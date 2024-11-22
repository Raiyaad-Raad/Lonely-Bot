const { Client, ChatInputCommandInteraction, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const giveaways = new Map(); // Stores giveaways

module.exports = {
    name: "gwcreate",
    description: "Create a giveaway",
    category: "information",
    /**
    * @param {Client} client
    * @param {ChatInputCommandInteraction} interaction
    **/
    async execute(interaction, client) {
        // Modal for Giveaway Details
        const modal = new ModalBuilder()
            .setCustomId('giveawayModal')
            .setTitle('Create a Giveaway');

        const timeInput = new TextInputBuilder()
            .setCustomId('giveawayTime')
            .setLabel('Time (e.g., 1m, 1h, 1d)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const winnersInput = new TextInputBuilder()
            .setCustomId('giveawayWinners')
            .setLabel('Number of Winners')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const descriptionInput = new TextInputBuilder()
            .setCustomId('giveawayDescription')
            .setLabel('Description')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(timeInput),
            new ActionRowBuilder().addComponents(winnersInput),
            new ActionRowBuilder().addComponents(descriptionInput)
        );

        await interaction.showModal(modal);

        const submitted = await interaction.awaitModalSubmit({
            time: 60000,
            filter: (i) => i.user.id === interaction.user.id,
        }).catch(() => null);

        if (!submitted) return interaction.followUp({ content: 'You took too long to respond.', ephemeral: true });

        const time = submitted.fields.getTextInputValue('giveawayTime');
        const winners = parseInt(submitted.fields.getTextInputValue('giveawayWinners'));
        const description = submitted.fields.getTextInputValue('giveawayDescription');

        if (isNaN(winners) || winners <= 0) {
            return submitted.reply({ content: 'Number of winners must be a positive number.', ephemeral: true });
        }

        const giveawayMessage = await submitted.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('🎉 Giveaway!')
                    .setDescription(description)
                    .addFields(
                        { name: 'Time Remaining', value: time },
                        { name: 'Number of Winners', value: winners.toString() },
                    )
                    .setColor('Blue')
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('joinGiveaway')
                        .setLabel('Join Giveaway')
                        .setStyle(ButtonStyle.Success)
                )
            ]
        });

        const giveawayData = {
            participants: new Set(),
            winners,
            endTime: Date.now() + parseDuration(time),
        };

        giveaways.set(giveawayMessage.id, giveawayData);

        const collector = giveawayMessage.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: parseDuration(time),
        });

        collector.on('collect', (buttonInteraction) => {
            const userId = buttonInteraction.user.id;
            const giveaway = giveaways.get(giveawayMessage.id);

            if (giveaway.participants.has(userId)) {
                giveaway.participants.delete(userId);
                buttonInteraction.reply({ content: 'You have left the giveaway.', ephemeral: true });
            } else {
                giveaway.participants.add(userId);
                buttonInteraction.reply({ content: 'You have joined the giveaway!', ephemeral: true });
            }
        });

        collector.on('end', async () => {
            const giveaway = giveaways.get(giveawayMessage.id);
            if (!giveaway) return;

            const participants = Array.from(giveaway.participants);

            if (participants.length === 0) {
                await giveawayMessage.edit({ components: [], embeds: [new EmbedBuilder().setDescription('No one joined the giveaway.')] });
                return;
            }

            const winners = getRandomWinners(participants, giveaway.winners);
            await giveawayMessage.edit({
                components: [],
                embeds: [
                    new EmbedBuilder()
                        .setTitle('🎉 Giveaway Ended!')
                        .setDescription(`Winners:\n${winners.map(w => `<@${w}>`).join(', ')}`)
                        .setColor('Green')
                ]
            });

            giveaways.delete(giveawayMessage.id);
        });
    }
};

function parseDuration(duration) {
    const match = duration.match(/(\\d+)([smhd])/);
    if (!match) return 0;
    const value = parseInt(match[1]);
    const unit = match[2];
    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        default: return 0;
    }
}

function getRandomWinners(participants, count) {
    const shuffled = participants.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

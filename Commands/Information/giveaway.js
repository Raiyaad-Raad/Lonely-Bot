const { Client, ChatInputCommandInteraction, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const giveaways = new Map(); // Stores giveaways

module.exports = {
    name: "gwcreate",
    description: "Create a giveaway",
    category: "Information",
    /**
    * @param {Client} client
    * @param {ChatInputCommandInteraction} interaction
    **/
    async execute(interaction, client) {
        // Create a modal to collect the giveaway details
        const modal = new ModalBuilder()
            .setCustomId('giveawayModal')
            .setTitle('Create a Giveaway');

        const timeInput = new TextInputBuilder()
            .setCustomId('giveawayTime')
            .setLabel('Time (e.g., 1m, 1h, 1d)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const prizeInput = new TextInputBuilder()
            .setCustomId('giveawayPrize')
            .setLabel('Prize')
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
            new ActionRowBuilder().addComponents(prizeInput),
            new ActionRowBuilder().addComponents(winnersInput),
            new ActionRowBuilder().addComponents(descriptionInput)
        );

        // Show the modal to the user
        await interaction.showModal(modal);

        // Wait for the modal to be submitted
        const submitted = await interaction.awaitModalSubmit({
            time: 60000,
            filter: (i) => i.user.id === interaction.user.id,
        }).catch(() => null);

        if (!submitted) return interaction.followUp({ content: 'You took too long to respond.', ephemeral: true });

        // Get the values from the modal inputs
        const time = submitted.fields.getTextInputValue('giveawayTime');
        const prize = submitted.fields.getTextInputValue('giveawayPrize');
        const winners = parseInt(submitted.fields.getTextInputValue('giveawayWinners'));
        const description = submitted.fields.getTextInputValue('giveawayDescription');

        // Validate the number of winners
        if (isNaN(winners) || winners <= 0) {
            return submitted.reply({ content: 'Number of winners must be a positive number.', ephemeral: true });
        }

        // Create the giveaway message and show it to the user
        const giveawayMessage = await submitted.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('🎉 Giveaway!')
                    .setDescription(description)
                    .addFields(
                        { name: 'Prize', value: prize },
                        { name: 'Time Remaining', value: time },
                        { name: 'Number of Winners', value: winners.toString() },
                        { name: 'Hosted By', value: `<@${interaction.user.id}>` },
                        { name: 'Participants', value: '0' } // Initial participants count is 0
                    )
                    .setColor('Blue')
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('joinGiveaway')
                        .setLabel('Join Giveaway')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('leaveGiveaway')
                        .setLabel('Leave Giveaway')
                        .setStyle(ButtonStyle.Danger)
                )
            ]
        });

        // Store giveaway data
        const giveawayData = {
            host: interaction.user.id,
            prize,
            participants: new Set(),
            winners,
            endTime: Date.now() + parseDuration(time),
        };

        giveaways.set(giveawayMessage.id, giveawayData);

        // Handle button interactions (Join/Leave)
        const collector = giveawayMessage.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: parseDuration(time),
        });

        collector.on('collect', (buttonInteraction) => {
            const userId = buttonInteraction.user.id;
            const giveaway = giveaways.get(giveawayMessage.id);

            if (buttonInteraction.customId === 'joinGiveaway') {
                if (!giveaway.participants.has(userId)) {
                    giveaway.participants.add(userId);
                    buttonInteraction.reply({ content: 'You have joined the giveaway!', ephemeral: true });
                } else {
                    buttonInteraction.reply({ content: 'You are already in the giveaway.', ephemeral: true });
                }
            } else if (buttonInteraction.customId === 'leaveGiveaway') {
                if (giveaway.participants.has(userId)) {
                    giveaway.participants.delete(userId);
                    buttonInteraction.reply({ content: 'You have left the giveaway.', ephemeral: true });
                } else {
                    buttonInteraction.reply({ content: 'You are not in the giveaway.', ephemeral: true });
                }
            }

            // Update the embed with the current participant count
            giveawayMessage.edit({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('🎉 Giveaway!')
                        .setDescription(description)
                        .addFields(
                            { name: 'Prize', value: prize },
                            { name: 'Time Remaining', value: formatTimeLeft(giveaway.endTime - Date.now()) },
                            { name: 'Number of Winners', value: winners.toString() },
                            { name: 'Hosted By', value: `<@${interaction.user.id}>` },
                            { name: 'Participants', value: giveaway.participants.size.toString() }
                        )
                        .setColor('Blue')
                ]
            });
        });

        // End giveaway and select winners
        collector.on('end', async () => {
            const giveaway = giveaways.get(giveawayMessage.id);
            if (!giveaway) return;

            const participants = Array.from(giveaway.participants);

            if (participants.length === 0) {
                await giveawayMessage.edit({
                    components: [],
                    embeds: [
                        new EmbedBuilder()
                            .setDescription('No one joined the giveaway.')
                            .setColor('Red')
                    ]
                });
                return;
            }

            // Randomly select the winners
            const winnersList = getRandomWinners(participants, giveaway.winners);

            await giveawayMessage.edit({
                components: [],
                embeds: [
                    new EmbedBuilder()
                        .setTitle('🎉 Giveaway Ended!')
                        .setDescription(`The winners are: ${winnersList.map(w => `<@${w}>`).join(', ')}`)
                        .addFields({ name: 'Prize', value: prize }, { name: 'Hosted By', value: `<@${giveaway.host}>` })
                        .setColor('Green')
                ]
            });

            giveaways.delete(giveawayMessage.id);
        });
    }
};

// Utility function to parse giveaway time (e.g., '1m', '1h')
function parseDuration(duration) {
    const match = duration.match(/(\d+)([smhd])/);
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

// Format time left for display in the embed
function formatTimeLeft(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
}

// Utility function to randomly select winners
function getRandomWinners(participants, count) {
    const shuffled = participants.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

collector.on('collect', async (buttonInteraction) => {
    const userId = buttonInteraction.user.id;
    const giveaway = giveaways.get(giveawayMessage.id);

    if (buttonInteraction.customId === 'joinGiveaway') {
        // Check if the user is already in the giveaway
        if (!giveaway.participants.has(userId)) {
            giveaway.participants.add(userId);
            await buttonInteraction.deferUpdate(); // Acknowledge the interaction
            buttonInteraction.followUp({ content: 'You have joined the giveaway!', ephemeral: true });
        } else {
            await buttonInteraction.deferUpdate(); // Acknowledge the interaction
            buttonInteraction.followUp({ content: 'You are already in the giveaway.', ephemeral: true });
        }
    } else if (buttonInteraction.customId === 'leaveGiveaway') {
        // Check if the user is in the giveaway
        if (giveaway.participants.has(userId)) {
            giveaway.participants.delete(userId);
            await buttonInteraction.deferUpdate(); // Acknowledge the interaction
            buttonInteraction.followUp({ content: 'You have left the giveaway.', ephemeral: true });
        } else {
            await buttonInteraction.deferUpdate(); // Acknowledge the interaction
            buttonInteraction.followUp({ content: 'You are not in the giveaway.', ephemeral: true });
        }
    }

    // Update the embed with the current participant count
    await giveawayMessage.edit({
        embeds: [
            new EmbedBuilder()
                .setTitle('🎉 Giveaway!')
                .setDescription(description)
                .addFields(
                    { name: 'Prize', value: prize },
                    { name: 'Time Remaining', value: formatTimeLeft(giveaway.endTime - Date.now()) },
                    { name: 'Number of Winners', value: winners.toString() },
                    { name: 'Hosted By', value: `<@${interaction.user.id}>` },
                    { name: 'Participants', value: giveaway.participants.size.toString() }
                )
                .setColor('Blue')
        ]
    });
});

collector.on('collect', async (buttonInteraction) => {
    const userId = buttonInteraction.user.id;
    const giveaway = giveaways.get(giveawayMessage.id);

    // Acknowledge the interaction immediately to prevent failures
    await buttonInteraction.deferUpdate();

    if (buttonInteraction.customId === 'joinGiveaway') {
        // Check if the user is already in the giveaway
        if (!giveaway.participants.has(userId)) {
            giveaway.participants.add(userId);
            buttonInteraction.followUp({ content: 'You have joined the giveaway!', ephemeral: true });
        } else {
            buttonInteraction.followUp({ content: 'You are already in the giveaway.', ephemeral: true });
        }
    } else if (buttonInteraction.customId === 'leaveGiveaway') {
        // Check if the user is in the giveaway
        if (giveaway.participants.has(userId)) {
            giveaway.participants.delete(userId);
            buttonInteraction.followUp({ content: 'You have left the giveaway.', ephemeral: true });
        } else {
            buttonInteraction.followUp({ content: 'You are not in the giveaway.', ephemeral: true });
        }
    }

    // Update the embed with the current participant count
    await giveawayMessage.edit({
        embeds: [
            new EmbedBuilder()
                .setTitle('🎉 Giveaway!')
                .setDescription(description)
                .addFields(
                    { name: 'Prize', value: prize },
                    { name: 'Time Remaining', value: formatTimeLeft(giveaway.endTime - Date.now()) },
                    { name: 'Number of Winners', value: winners.toString() },
                    { name: 'Hosted By', value: `<@${interaction.user.id}>` },
                    { name: 'Participants', value: giveaway.participants.size.toString() }
                )
                .setColor('Blue')
        ]
    });
});

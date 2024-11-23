// const { Client, ChatInputCommandInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
// const { db } = require('../../Events/Client/mongodb');

// module.exports = {
//     name: "gcreate",
//     description: "Start an interactive giveaway",
//     category: "Information",
//     /**
//      * @param {Client} client
//      * @param {ChatInputCommandInteraction} interaction
//      **/
//     async execute(interaction, client) {
//         const filter = (m) => m.author.id === interaction.user.id;

//         // Ask for the giveaway duration
//         await interaction.reply("⏳ How long should the giveaway last? (e.g., `60s`, `5m`, `1h`)");
//         const durationResponse = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000 });
//         const durationString = durationResponse.first()?.content;

//         if (!durationString) return interaction.followUp("⏳ You didn't provide a duration. Giveaway canceled.");
//         const duration = parseDuration(durationString);
//         if (!duration) return interaction.followUp("⚠️ Invalid duration format. Giveaway canceled.");

//         // Ask for the prize
//         await interaction.followUp("🎁 What is the prize?");
//         const prizeResponse = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000 });
//         const prize = prizeResponse.first()?.content;

//         if (!prize) return interaction.followUp("🎁 You didn't provide a prize. Giveaway canceled.");

//         // Ask for a description
//         await interaction.followUp("📝 Please provide a description for the giveaway (optional).");
//         const descriptionResponse = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000 });
//         const description = descriptionResponse.first()?.content || "No description provided.";

//         // Ask for the number of winners
//         await interaction.followUp("🏆 How many winners should be chosen?");
//         const winnersResponse = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000 });
//         const winnersCount = parseInt(winnersResponse.first()?.content, 10);

//         if (isNaN(winnersCount) || winnersCount <= 0) {
//             return interaction.followUp("⚠️ Invalid number of winners. Giveaway canceled.");
//         }

//         // Calculate the end timestamp
//         const endTimestamp = Date.now() + duration;

//         // Start the giveaway embed with the initial participant count set to 0
//         const embed = new EmbedBuilder()
//             .setTitle("🎉 Giveaway 🎉")
//             .setDescription(`**Prize:** ${prize}\n**Description:** ${description}\n**Participants:** 0\nClick the button below to participate!`)
//             .setColor(0x00AE86)
//             .setFooter({ text: `Ends: <t:${Math.floor(endTimestamp / 1000)}:R> | Winners: ${winnersCount}` });

//         const participateButton = new ButtonBuilder()
//             .setCustomId("join-giveaway")
//             .setLabel("Join Giveaway")
//             .setStyle(ButtonStyle.Primary);

//         const giveawayMessage = await interaction.followUp({
//             embeds: [embed],
//             components: [new ActionRowBuilder().addComponents(participateButton)],
//             fetchReply: true,
//         });

//         // Store the giveaway message id
//         // db.set(`gw-system-messageid-${interaction.guild.id}`, `-${giveawayMessage.id}`);
//         let participants = new Set();

//         // Wait for the giveaway to end
//         setTimeout(async () => {
//             const updatedMessage = await interaction.channel.messages.fetch(giveawayMessage.id);
//             const buttonCollector = updatedMessage.createMessageComponentCollector({ componentType: 'BUTTON', time: duration });

//             buttonCollector.on('collect', async (i) => {
//                 if (i.customId === 'join-giveaway' && !participants.has(i.user.id)) {
//                     participants.add(i.user.id);
//                     await i.reply({ content: "You have joined the giveaway!", ephemeral: true });

//                     // Update the embed with the new participant count
//                     const updatedEmbed = embed
//                         .setDescription(`**Prize:** ${prize}\n**Description:** ${description}\n**Participants:** ${participants.size}\nClick the button below to participate!`)
//                         .setFooter({ text: `Ends: <t:${Math.floor(endTimestamp / 1000)}:R> | Winners: ${winnersCount}` });

//                     await giveawayMessage.edit({ embeds: [updatedEmbed] });
//                 } else if (i.customId === 'join-giveaway' && participants.has(i.user.id)) {
//                     const confirmButtonRow = new ActionRowBuilder()
//                         .addComponents(
//                             new ButtonBuilder().setCustomId('confirm-leave-yes').setLabel('Yes').setStyle(ButtonStyle.Danger),
//                             new ButtonBuilder().setCustomId('confirm-leave-no').setLabel('No').setStyle(ButtonStyle.Secondary)
//                         );

//                     await i.reply({
//                         content: "You are already in the giveaway. Do you want to leave?",
//                         components: [confirmButtonRow],
//                         ephemeral: true
//                     });

//                     const leaveFilter = (btn) => btn.user.id === i.user.id;

//                     const leaveCollector = updatedMessage.createMessageComponentCollector({ filter: leaveFilter, time: 15000 });

//                     leaveCollector.on('collect', async (buttonInteraction) => {
//                         if (buttonInteraction.customId === 'confirm-leave-yes') {
//                             participants.delete(i.user.id);
//                             await buttonInteraction.reply({ content: "You have left the giveaway.", ephemeral: true });

//                             // Update the embed with the new participant count
//                             const updatedEmbed = embed
//                                 .setDescription(`**Prize:** ${prize}\n**Description:** ${description}\n**Participants:** ${participants.size}\nClick the button below to participate!`)
//                                 .setFooter({ text: `Ends: <t:${Math.floor(endTimestamp / 1000)}:R> | Winners: ${winnersCount}` });

//                             await giveawayMessage.edit({ embeds: [updatedEmbed] });
//                         } else if (buttonInteraction.customId === 'confirm-leave-no') {
//                             await buttonInteraction.reply({ content: "You decided to stay in the giveaway.", ephemeral: true });
//                         }
//                     });
//                 }
//             });

//             // After the giveaway ends, pick winners
//             setTimeout(() => {
//                 if (participants.size >= winnersCount) {
//                     const winners = Array.from(participants).slice(0, winnersCount);
//                     const winnersList = winners.map((userId) => `<@${userId}>`).join(", ");
//                     interaction.channel.send(`🎉 Congratulations to the winners: ${winnersList}! You won **${prize}**!`);
//                 } else {
//                     interaction.channel.send("⚠️ Not enough participants for the giveaway.");
//                 }
//             }, duration);
//         }, duration);
//     },
// };

// /**
//  * Parse duration string (e.g., `60s`, `5m`, `1h`) into milliseconds.
//  * @param {string} duration
//  * @returns {number|null}
//  */
// function parseDuration(duration) {
//     const match = duration.match(/^(\d+)([smhd])$/);
//     if (!match) return null;

//     const value = parseInt(match[1], 10);
//     const unit = match[2];

//     switch (unit) {
//         case "s": return value * 1000; // seconds to ms
//         case "m": return value * 60 * 1000; // minutes to ms
//         case "h": return value * 60 * 60 * 1000; // hours to ms
//         case "d": return value * 24 * 60 * 60 * 1000; // days to ms
//         default: return null;
//     }
// }
const { Client, ChatInputCommandInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { db } = require('../../Events/Client/mongodb');

module.exports = {
    name: "gcreate",
    description: "Start an interactive giveaway",
    category: "Information",
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     **/
    async execute(interaction, client) {
        // Step 1: Create the modal for the giveaway creation process
        const modal = new ModalBuilder()
            .setCustomId('giveaway_modal')
            .setTitle('Create a Giveaway');

        // Add fields to the modal (duration, prize, description, and winner count)
        modal.addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('duration')
                    .setLabel('Duration (e.g., 60s, 5m, 1h)')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('prize')
                    .setLabel('Prize')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('description')
                    .setLabel('Description (Optional)')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('winners')
                    .setLabel('Number of Winners')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            )
        );

        // Step 2: Show the modal to the user
        await interaction.showModal(modal);
    },

    /**
     * Handles the submission of the giveaway creation modal.
     */
    async handleModalSubmit(interaction) {
        if (interaction.customId === 'giveaway_modal') {
            const durationString = interaction.fields.getTextInputValue('duration');
            const prize = interaction.fields.getTextInputValue('prize');
            const description = interaction.fields.getTextInputValue('description') || 'No description provided.';
            const winnersCount = parseInt(interaction.fields.getTextInputValue('winners'), 10);

            if (isNaN(winnersCount) || winnersCount <= 0) {
                return interaction.reply("⚠️ Invalid number of winners. Giveaway canceled.");
            }

            const duration = parseDuration(durationString);
            if (!duration) return interaction.reply("⚠️ Invalid duration format. Giveaway canceled.");

            // Calculate the end timestamp
            const endTimestamp = Date.now() + duration;

            // Start the giveaway embed with the initial participant count set to 0
            const embed = new EmbedBuilder()
                .setTitle("🎉 Giveaway 🎉")
                .setDescription(`**Prize:** ${prize}\n**Description:** ${description}\n**Participants:** 0\nClick the button below to participate!`)
                .setColor(0x00AE86)
                .setFooter({ text: `Ends: <t:${Math.floor(endTimestamp / 1000)}:R> | Winners: ${winnersCount}` });

            const participateButton = new ButtonBuilder()
                .setCustomId("join-giveaway")
                .setLabel("Join Giveaway")
                .setStyle(ButtonStyle.Primary);

            const giveawayMessage = await interaction.reply({
                embeds: [embed],
                components: [new ActionRowBuilder().addComponents(participateButton)],
                fetchReply: true,
            });

            let participants = new Set();

            // Wait for the giveaway to end
            setTimeout(async () => {
                const updatedMessage = await interaction.channel.messages.fetch(giveawayMessage.id);
                const buttonCollector = updatedMessage.createMessageComponentCollector({ componentType: 'BUTTON', time: duration });

                buttonCollector.on('collect', async (i) => {
                    if (i.customId === 'join-giveaway' && !participants.has(i.user.id)) {
                        participants.add(i.user.id);
                        await i.reply({ content: "You have joined the giveaway!", ephemeral: true });

                        // Update the embed with the new participant count
                        const updatedEmbed = embed
                            .setDescription(`**Prize:** ${prize}\n**Description:** ${description}\n**Participants:** ${participants.size}\nClick the button below to participate!`)
                            .setFooter({ text: `Ends: <t:${Math.floor(endTimestamp / 1000)}:R> | Winners: ${winnersCount}` });

                        await giveawayMessage.edit({ embeds: [updatedEmbed] });
                    } else if (i.customId === 'join-giveaway' && participants.has(i.user.id)) {
                        const confirmButtonRow = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder().setCustomId('confirm-leave-yes').setLabel('Yes').setStyle(ButtonStyle.Danger),
                                new ButtonBuilder().setCustomId('confirm-leave-no').setLabel('No').setStyle(ButtonStyle.Secondary)
                            );

                        await i.reply({
                            content: "You are already in the giveaway. Do you want to leave?",
                            components: [confirmButtonRow],
                            ephemeral: true
                        });

                        const leaveFilter = (btn) => btn.user.id === i.user.id;

                        const leaveCollector = updatedMessage.createMessageComponentCollector({ filter: leaveFilter, time: 15000 });

                        leaveCollector.on('collect', async (buttonInteraction) => {
                            if (buttonInteraction.customId === 'confirm-leave-yes') {
                                participants.delete(i.user.id);
                                await buttonInteraction.reply({ content: "You have left the giveaway.", ephemeral: true });

                                // Update the embed with the new participant count
                                const updatedEmbed = embed
                                    .setDescription(`**Prize:** ${prize}\n**Description:** ${description}\n**Participants:** ${participants.size}\nClick the button below to participate!`)
                                    .setFooter({ text: `Ends: <t:${Math.floor(endTimestamp / 1000)}:R> | Winners: ${winnersCount}` });

                                await giveawayMessage.edit({ embeds: [updatedEmbed] });
                            } else if (buttonInteraction.customId === 'confirm-leave-no') {
                                await buttonInteraction.reply({ content: "You decided to stay in the giveaway.", ephemeral: true });
                            }
                        });
                    }
                });

                // After the giveaway ends, pick winners
                setTimeout(() => {
                    if (participants.size >= winnersCount) {
                        const winners = Array.from(participants).slice(0, winnersCount);
                        const winnersList = winners.map((userId) => `<@${userId}>`).join(", ");
                        interaction.channel.send(`🎉 Congratulations to the winners: ${winnersList}! You won **${prize}**!`);
                    } else {
                        interaction.channel.send("⚠️ Not enough participants for the giveaway.");
                    }
                }, duration);
            }, duration);
        }
    }
};

/**
 * Parse duration string (e.g., `60s`, `5m`, `1h`) into milliseconds.
 * @param {string} duration
 * @returns {number|null}
 */
function parseDuration(duration) {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) return null;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case "s": return value * 1000; // seconds to ms
        case "m": return value * 60 * 1000; // minutes to ms
        case "h": return value * 60 * 60 * 1000; // hours to ms
        case "d": return value * 24 * 60 * 60 * 1000; // days to ms
        default: return null;
    }
}

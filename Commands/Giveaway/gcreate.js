// const { Client, ChatInputCommandInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
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
//         // Step 1: Create the modal for the giveaway creation process
//         const modal = new ModalBuilder()
//             .setCustomId('giveaway_modal')
//             .setTitle('Create a Giveaway');

//         // Add fields to the modal (duration, prize, description, and winner count)
//         modal.addComponents(
//             new ActionRowBuilder().addComponents(
//                 new TextInputBuilder()
//                     .setCustomId('duration')
//                     .setLabel('Duration (e.g., 60s, 5m, 1h)')
//                     .setStyle(TextInputStyle.Short)
//                     .setRequired(true)
//             ),
//             new ActionRowBuilder().addComponents(
//                 new TextInputBuilder()
//                     .setCustomId('prize')
//                     .setLabel('Prize')
//                     .setStyle(TextInputStyle.Short)
//                     .setRequired(true)
//             ),
//             new ActionRowBuilder().addComponents(
//                 new TextInputBuilder()
//                     .setCustomId('description')
//                     .setLabel('Description (Optional)')
//                     .setStyle(TextInputStyle.Paragraph)
//                     .setRequired(false)
//             ),
//             new ActionRowBuilder().addComponents(
//                 new TextInputBuilder()
//                     .setCustomId('winners')
//                     .setLabel('Number of Winners')
//                     .setStyle(TextInputStyle.Short)
//                     .setRequired(true)
//             )
//         );

//         // Step 2: Show the modal to the user
//         await interaction.showModal(modal);

//         const collector = interaction.channel.createMessageComponentCollector({
//             filter: i => i.isModalSubmit(),
//             time: 60000 // 15 seconds
//         });
//         collector.on('collect', async i => {
//             if (i.customId === 'giveaway_modal') {
//                 const durationString = i.fields.getTextInputValue('duration');
//                 const prize = i.fields.getTextInputValue('prize');
//                 const description = i.fields.getTextInputValue('description') || 'No description provided.';
//                 const winnersCount = parseInt(i.fields.getTextInputValue('winners'), 10);
    
//                 if (isNaN(winnersCount) || winnersCount <= 0) {
//                     return i.reply("⚠️ Invalid number of winners. Giveaway canceled.");
//                 }
    
//                 const duration = parseDuration(durationString);
//                 if (!duration) return i.reply("⚠️ Invalid duration format. Giveaway canceled.");
    
//                 // Calculate the end timestamp
//                 const endTimestamp = Date.now() + duration;
    
//                 // Start the giveaway embed with the initial participant count set to 0
//                 const embed = new EmbedBuilder()
//                     .setTitle("🎉 Giveaway 🎉")
//                     .setDescription(`**Prize:** ${prize}\n**Description:** ${description}\n**Participants:** 0\nClick the button below to participate!`)
//                     .setColor(0x00AE86)
//                     .setFooter({ text: `Ends: <t:${Math.floor(endTimestamp / 1000)}:R> | Winners: ${winnersCount}` });
    
//                 const participateButton = new ButtonBuilder()
//                     .setCustomId("join-giveaway")
//                     .setLabel("Join Giveaway")
//                     .setStyle(ButtonStyle.Primary);
    
//                 const giveawayMessage = await i.reply({
//                     embeds: [embed],
//                     components: [new ActionRowBuilder().addComponents(participateButton)],
//                     fetchReply: true,
//                 }); 
    
//                 let participants = new Set();
    
//                 // Wait for the giveaway to end
//                 setTimeout(async () => {
//                     const updatedMessage = await interaction.channel.messages.fetch(giveawayMessage.id);
//                     const buttonCollector = updatedMessage.createMessageComponentCollector({ componentType: 'BUTTON', time: duration });
    
//                     buttonCollector.on('collect', async (i) => {
//                         if (i.customId === 'join-giveaway' && !participants.has(i.user.id)) {
//                             participants.add(i.user.id);
//                             await i.reply({ content: "You have joined the giveaway!", ephemeral: true });
    
//                             // Update the embed with the new participant count
//                             const updatedEmbed = embed
//                                 .setDescription(`**Prize:** ${prize}\n**Description:** ${description}\n**Participants:** ${participants.size}\nClick the button below to participate!`)
//                                 .setFooter({ text: `Ends: <t:${Math.floor(endTimestamp / 1000)}:R> | Winners: ${winnersCount}` });
    
//                             await giveawayMessage.edit({ embeds: [updatedEmbed] });
//                         } else if (i.customId === 'join-giveaway' && participants.has(i.user.id)) {
//                             const confirmButtonRow = new ActionRowBuilder()
//                                 .addComponents(
//                                     new ButtonBuilder().setCustomId('confirm-leave-yes').setLabel('Yes').setStyle(ButtonStyle.Danger),
//                                     new ButtonBuilder().setCustomId('confirm-leave-no').setLabel('No').setStyle(ButtonStyle.Secondary)
//                                 );
    
//                             await i.reply({
//                                 content: "You are already in the giveaway. Do you want to leave?",
//                                 components: [confirmButtonRow],
//                                 ephemeral: true
//                             });
    
//                             const leaveFilter = (btn) => btn.user.id === i.user.id;
    
//                             const leaveCollector = updatedMessage.createMessageComponentCollector({ filter: leaveFilter, time: 15000 });
    
//                             leaveCollector.on('collect', async (buttonInteraction) => {
//                                 if (buttonInteraction.customId === 'confirm-leave-yes') {
//                                     participants.delete(i.user.id);
//                                     await buttonInteraction.reply({ content: "You have left the giveaway.", ephemeral: true });
    
//                                     // Update the embed with the new participant count
//                                     const updatedEmbed = embed
//                                         .setDescription(`**Prize:** ${prize}\n**Description:** ${description}\n**Participants:** ${participants.size}\nClick the button below to participate!`)
//                                         .setFooter({ text: `Ends: <t:${Math.floor(endTimestamp / 1000)}:R> | Winners: ${winnersCount}` });
    
//                                     await giveawayMessage.edit({ embeds: [updatedEmbed] });
//                                 } else if (buttonInteraction.customId === 'confirm-leave-no') {
//                                     await buttonInteraction.reply({ content: "You decided to stay in the giveaway.", ephemeral: true });
//                                 }
//                             });
//                         }
//                     });
    
//                     // After the giveaway ends, pick winners
//                     setTimeout(() => {
//                         if (participants.size >= winnersCount) {
//                             const winners = Array.from(participants).slice(0, winnersCount);
//                             const winnersList = winners.map((userId) => `<@${userId}>`).join(", ");
//                             interaction.channel.send(`🎉 Congratulations to the winners: ${winnersList}! You won **${prize}**!`);
//                         } else {
//                             interaction.channel.send("⚠️ Not enough participants for the giveaway.");
//                         }
//                     }, duration);
//                 }, duration);
//             }
//         })
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
// const { Client, ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
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
//         // Ask for Duration
//         await interaction.reply('Please enter the duration for the giveaway (e.g., 60s, 5m, 1h):');

//         const durationResponse = await interaction.channel.awaitMessages({
//             filter: (msg) => msg.author.id === interaction.user.id,
//             max: 1,
//             time: 60000, // 60 seconds to reply
//         }).then((collected) => collected.first());

//         if (!durationResponse) {
//             return interaction.reply("⚠️ You didn't provide a duration in time. Giveaway canceled.");
//         }

//         const durationString = durationResponse.content;
//         const duration = parseDuration(durationString);
//         if (!duration) {
//             return interaction.reply("⚠️ Invalid duration format. Giveaway canceled.");
//         }

//         // Ask for Prize
//         await interaction.reply('Please enter the prize for the giveaway:');

//         const prizeResponse = await interaction.channel.awaitMessages({
//             filter: (msg) => msg.author.id === interaction.user.id,
//             max: 1,
//             time: 60000, // 60 seconds to reply
//         }).then((collected) => collected.first());

//         if (!prizeResponse) {
//             return interaction.reply("⚠️ You didn't provide a prize in time. Giveaway canceled.");
//         }

//         const prize = prizeResponse.content;

//         // Ask for Description (Optional)
//         await interaction.reply('Please enter a description for the giveaway (optional):');

//         const descriptionResponse = await interaction.channel.awaitMessages({
//             filter: (msg) => msg.author.id === interaction.user.id,
//             max: 1,
//             time: 60000, // 60 seconds to reply
//         }).then((collected) => collected.first());

//         const description = descriptionResponse ? descriptionResponse.content : 'No description provided.';

//         // Ask for Number of Winners
//         await interaction.reply('Please enter the number of winners for the giveaway:');

//         const winnersResponse = await interaction.channel.awaitMessages({
//             filter: (msg) => msg.author.id === interaction.user.id,
//             max: 1,
//             time: 60000, // 60 seconds to reply
//         }).then((collected) => collected.first());

//         if (!winnersResponse || isNaN(winnersResponse.content) || parseInt(winnersResponse.content, 10) <= 0) {
//             return interaction.reply("⚠️ Invalid number of winners. Giveaway canceled.");
//         }

//         const winnersCount = parseInt(winnersResponse.content, 10);

//         // Calculate end timestamp for the giveaway
//         const endTimestamp = Date.now() + duration;

//         // Create Embed for Giveaway
//         const embed = new EmbedBuilder()
//             .setTitle("🎉 Giveaway 🎉")
//             .setDescription(`**Prize:** ${prize}\n**Description:** ${description}\n**Participants:** 0\nClick the button below to participate!`)
//             .setColor(0x00AE86)
//             .setFooter({ text: `Ends: <t:${Math.floor(endTimestamp / 1000)}:R> | Winners: ${winnersCount}` });

//         // Create Button for participants to join
//         const participateButton = new ButtonBuilder()
//             .setCustomId("join-giveaway")
//             .setLabel("Join Giveaway")
//             .setStyle(ButtonStyle.Primary);

//         // Send Giveaway Embed with Join Button
//         const giveawayMessage = await interaction.reply({
//             embeds: [embed],
//             components: [new ActionRowBuilder().addComponents(participateButton)],
//             fetchReply: true,
//         });

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
const { Client, ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
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
    // Ask for Duration
    await interaction.channel.send('Please enter the duration for the giveaway (e.g., 60s, 5m, 1h):');

    const durationResponse = await interaction.channel.awaitMessages({
      filter: (msg) => msg.author.id === interaction.user.id,
      max: 1,
      time: 60000, // 60 seconds to reply
    }).then((collected) => collected.first());

    if (!durationResponse) {
      return interaction.channel.send("⚠️ You didn't provide a duration in time. Giveaway canceled.");
    }

    const durationString = durationResponse.content;
    const duration = parseDuration(durationString);
    if (!duration) {
      return interaction.channel.send("⚠️ Invalid duration format. Giveaway canceled.");
    }

    // Ask for Prize
    await interaction.channel.send('Please enter the prize for the giveaway:');

    const prizeResponse = await interaction.channel.awaitMessages({
      filter: (msg) => msg.author.id === interaction.user.id,
      max: 1,
      time: 60000, // 60 seconds to reply
    }).then((collected) => collected.first());

    if (!prizeResponse) {
      return interaction.channel.send("⚠️ You didn't provide a prize in time. Giveaway canceled.");
    }

    const prize = prizeResponse.content;

    // Ask for Description (Optional)
    await interaction.channel.send('Please enter a description for the giveaway (optional):');

    const descriptionResponse = await interaction.channel.awaitMessages({
      filter: (msg) => msg.author.id === interaction.user.id,
      max: 1,
      time: 60000, // 60 seconds to reply
    }).then((collected) => collected.first());

    const description = descriptionResponse ? descriptionResponse.content : 'No description provided.';

    // Ask for Number of Winners
    await interaction.channel.send('Please enter the number of winners for the giveaway:');

    const winnersResponse = await interaction.channel.awaitMessages({
      filter: (msg) => msg.author.id === interaction.user.id,
      max: 1,
      time: 60000, // 60 seconds to reply
    }).then((collected) => collected.first());

    if (!winnersResponse || isNaN(winnersResponse.content) || parseInt(winnersResponse.content, 10) <= 0) {
      return interaction.channel.send("⚠️ Invalid number of winners. Giveaway canceled.");
    }

    const winnersCount = parseInt(winnersResponse.content, 10);

    // Calculate end timestamp
    const endTimestamp = Date.now() + duration;

    // Create Embed for Giveaway
    const embed = new EmbedBuilder()
      .setTitle("🎉 Giveaway 🎉")
      .setDescription(`**Prize:** ${prize}\n**Description:** ${description}\n**Participants:** 0\nClick the button below to participate!`)
      .setColor(0x00AE86)
      .setFooter({ text: `Ends: <t:${Math.floor(endTimestamp / 1000)}:R> | Winners: ${winnersCount}` });

    // Create Button for participants to join
    const participateButton = new ButtonBuilder()
      .setCustomId("join-giveaway")
      .setLabel("Join Giveaway")
      .setStyle(ButtonStyle.Primary);

    // Send Giveaway Embed with Join Button
    const giveawayMessage = await interaction.channel.send({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(participateButton)],
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

          // Update the embed with the new participant count (Refactored)
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

              // Update the embed with the new participant count (Refactored)
              const updatedEmbed = embed
                .setDescription(`**Prize:** ${prize}\n**Description:** ${description}\n**Participants:** ${participants.size}\nClick the button below to participate!`)
                .setFooter({ text: `Ends: <t:${Math.floor(endTimestamp / 1000)}:R> | Winners: ${winnersCount}` });

              await giveawayMessage.edit({ embeds: [updatedEmbed] });
            } else if (buttonInteraction.customId === 'confirm-leave-no') {
              await buttonInteraction.reply({ content: "You decided to stay in the giveaway.", ephemeral: true });
            }
            leaveCollector.stop();
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
  },
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
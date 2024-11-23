
const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { db } = require('../../Events/Client/mongodb');

module.exports = {
    name: "gend",
    description: "End an ongoing giveaway and choose winners immediately",
    category: "Giveaway",
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     **/
    async execute(interaction, client) {
        const giveawayMessageId = await db.get(`gw-system-messageid-${interaction.guild.id}`);

        if (!giveawayMessageId || giveawayMessageId === '-') {
            return interaction.reply({ content: "No giveaway found in this server.", ephemeral: true });
        }

        const giveawayMessage = await interaction.channel.messages.fetch(giveawayMessageId.slice(1));
        
        if (!giveawayMessage) {
            return interaction.reply({ content: "Couldn't find the giveaway message.", ephemeral: true });
        }

        const reaction = giveawayMessage.reactions.cache.get("🎉");

        if (!reaction) {
            return interaction.reply({ content: "No reactions found for the giveaway.", ephemeral: true });
        }

        const users = await reaction.users.fetch();
        const participants = users.filter((user) => !user.bot);

        if (participants.size === 0) {
            return interaction.reply({ content: "No participants found for the giveaway.", ephemeral: true });
        }

        // Pick winners
        const winners = participants.random(3); // You can change the number of winners here
        const winnersList = winners.map((user) => user.toString()).join(", ");

        // Send a message announcing the winners
        interaction.channel.send(`🎉 Giveaway ended! The winners are: ${winnersList}! Congratulations!`);

        // Delete the giveaway message after ending
        await giveawayMessage.delete();

        // Remove the stored message ID from the database
        db.delete(`gw-system-messageid-${interaction.guild.id}`);
    },
};
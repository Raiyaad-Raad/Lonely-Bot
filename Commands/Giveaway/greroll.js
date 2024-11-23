const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { db } = require('../../Events/Client/mongodb');

module.exports = {
    name: "greroll",
    description: "Reroll the giveaway and choose new winners",
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

        // Pick new winners
        const winners = participants.random(3); // You can change the number of winners here
        const winnersList = winners.map((user) => user.toString()).join(", ");
        
        interaction.reply({ content: `🎉 New winners are: ${winnersList}! Congratulations!` });

        // Update the giveaway message or any other action if needed
    },
};

const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { db } = require('../../Events/Client/mongodb');

module.exports = {
    name: "gdelete",
    description: "Delete an ongoing giveaway",
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

        // Delete the giveaway message
        await giveawayMessage.delete();
        
        // Remove the stored message ID from the database
        db.delete(`gw-system-messageid-${interaction.guild.id}`);

        interaction.reply({ content: "The giveaway has been deleted.", ephemeral: true });
    },
};
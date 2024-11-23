const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    name: "slap", // Command name
    description: "Send a virtual slap", // Command description
    category: "fun", // Category of the command

    /**
    * @param {Client} client
    * @param {ChatInputCommandInteraction} interaction
    **/
    async execute(interaction, client) {
        // Send a reply when the command is triggered
        await interaction.reply('Here is a slap, boom! ');
    }
}

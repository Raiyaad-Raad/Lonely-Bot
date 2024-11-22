const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    name: "slap", // command name here
    description: "giving a slap", // command description here
    category: "Information", // command category here
    /**
    * @param {Client} client
    * @param {ChatInputCommandInteraction} interaction
    **/
    async execute(interaction, client) {
      // code here
        await interaction.reply({ text: "hers a slap" });
    }
}

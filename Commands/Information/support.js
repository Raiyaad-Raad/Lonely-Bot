const { Client, ChatInputCommandInteraction, EmbedBuilder() } = require('discord.js')

module.exports = {
    name: "support",
    description: "This Command Is For Joining The Support Server Of The Bot",
    category: "Information",
    /**
    * @param {Client} client
    * @param {ChatInputCommandInteraction} interaction
    **/
    async execute(interaction, client){
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Blue")
                .setAuthor({name: "Lonely Bot", avatarURL: `${client.user.avatarURL}`})
                .setTitle("Support For Lonely Bot")
                .setURL("https://discord.gg/WN3ksR5MTf")
                .setDescription("[Click Me To Join The Server!](https://discord.gg/WN3ksR5MTf)")
                .setFooter({text: "Copyright @ LB Development - 2023"})
                .setTimestamp()
            ],
            ephemeral: true
        })
    }
}
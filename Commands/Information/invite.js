const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'invite',
    description: "Invite the bot",
    category: "📗Information",
/**
* @param {Client} client
* @param {ChatInputCommandInteraction} interaction
**/

execute(interaction, client) {
        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("You Can Invite The Bot By Clicking The Link.")
        .setFooter({text: "CopyRight @ LB Development 2023"})
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=1099511627775&scope=bot%20applications.commands`)
        .setDescription(`[Click here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=1099511627775&scope=bot%20applications.commands)`)
        interaction.reply({
            embeds: [embed],
            ephemeral: true 
        });    
 }
}
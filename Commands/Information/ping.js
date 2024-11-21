const { Client, CommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { reply } = require('discord.js')

module.exports = {
  name: "ping",
  description: "Displays the ping",
  category: "📗Information",
  /**
  * @param {Client} client
  * @param {CommandInteraction} interaction
  */
  async execute(interaction, client) {
      
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });

    interaction.editReply({
      content: `\n`,
      embeds: [
        new EmbedBuilder()
        .setColor("Green")
        .setAuthor({
          name: "LonelyBot",
          iconURL: "https://cdn.discordapp.com/avatars/1051030553027166259/9429e5c84ae40ac5ce182d43ef179beb.png?size=1024"
        })
        .setTitle("LonelyBot's Ping")
        .setDescription(`LonelyBot's Ping:
    Websocket heartbeat: ${client.ws.ping}ms
    Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`)
        .setTimestamp()
        .setFooter({
          text: "If the ping is high, it means the bot may be slow.",
          iconURL: "https://cdn.discordapp.com/avatars/1051030553027166259/9429e5c84ae40ac5ce182d43ef179beb.png?size=1024"
        })
      ]
    })
  }
}
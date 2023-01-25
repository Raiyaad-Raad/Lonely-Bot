const { EmbedBuilder } = require('discord.js');

function reply(interaction, color, description) {
  interaction.reply({
    embeds: [
      new EmbedBuilder()
      .setColor(`${color}`)
      .setDescription(`${description}`)
    ]
  })
}
const { EmbedBuilder } = require('discord.js');

const { client } = require('../cool');

function reply(interaction, color, description) {
  interaction.reply({
    embeds: [
      new EmbedBuilder()
      .setAuthor({ name: `${client.user.name}`, iconURL: `${client.user.avatarURL}` })
      .setColor(`${color}`)
      .setDescription(`${description}`)
      .setTimestamp()
    ]
  });
}
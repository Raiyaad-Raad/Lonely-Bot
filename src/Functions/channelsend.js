const { EmbedBuilder } = require('discord.js');

const { client } = require('../cool');

function channelsend(interaction, color, description) {
  interaction.channel.send({
    embeds: [
      new EmbedBuilder()
      .setAuthor({ name: `${client.user.name}`, iconURL: `${client.user.avatarURL}` })
      .setColor(`${color}`)
      .setDescription(`${description}`)
    ]
  });
}
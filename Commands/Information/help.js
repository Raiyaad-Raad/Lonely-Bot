const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ButtonStyle, ComponentType } = require('discord.js');
const { promisify } = require('util')
const { glob } = require('glob')
const PG = promisify(glob)
const ms = require('ms')

module.exports = {
  name: "help",
  description: "Show help about cmds",
  category: "Information",
  /**
  * @param {Client} client
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction, client) {
  const main = new EmbedBuilder()
  .setColor("Blue")
  .setAuthor({name: "Lonely Bot", avatarURL: (`${client.user.avatarURL({size: 512})}`)})
  .setDescription(`Hi! Welcome The The Help Lists Of Lonely Bot.\n
I have many commands to help you customize your discord server.
My commands are easier to use and easy to understand too!
I'm not like other discord bots who need to setup everything in the dash.
If any customization added in future. It will surely be added here as a guideline as if you don't understand.\n
I only supports slash commands for now, when the bot reach 100+ servers and if I get a approval for the prefix commands. I will surely make sure to add it.\n
Click the commands below to get to the commands page.`)
  .setFooter({
      text: "Copyright © LB Development 2023"
  })
  .setTimestamp()
    const row =  await new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setCustomId("command-page")
      .setLabel("Commands Page")
    )
    interaction.reply({
        embeds: [main],
        components: [row]
    })
    const collector = interaction.channel.createMessageComponentCollector({
        type: ComponentType.Button,
        time: ms('15s')
    });      
  const Table = []

  const commandFiles = await PG(`${process.cwd()}/Commands/*/*.js`)

  commandFiles.map(async (file) => {

    const command = require(file) 

    await Table.push(`**Command's Name**: /**${command.name}**
**Command's Description:** **${command.description}**
**Command's Category:** **${command.category}**`)
    
  })
      const final = Table.join(`\n
`)
      
      collector.on('collect', async i => {
          if (i.customId === 'command-page') {
      interaction.editReply({
          embeds: [
              new EmbedBuilder()
              .setColor("Blue")
              .setAuthor({name: "Lonely Bot", avatarURL: `${client.user.avatarURL({size: 512})}`})
              .setDescription(`All Of The Commands List Given Below With Including What Categories They Are:
${final}`)
              .setFooter({text: "Copyright © LB Development 2023"})
              .setTimestamp()
          ],
          components: []
      })              
          }
      })
  }
}
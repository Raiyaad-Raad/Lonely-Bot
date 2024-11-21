const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ButtonStyle, ComponentType, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuComponent, StringSelectMenuOptionBuilder, Embed, EmbedAssertions } = require('discord.js');
const { promisify } = require('util')
const { glob } = require('glob')
const PG = promisify(glob)
const ms = require('ms')

module.exports = {
  name: "help",
  description: "Show help about cmds",
  category: "📗Information",
  /**
  * @param {Client} client
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction, client) {
  const main = new EmbedBuilder()
  .setColor("Blue")
  .setAuthor({name: "Lonely Bot", avatarURL: (`${client.user.avatarURL({size: 512})}`)})
  .setDescription(`Hi! Welcome The The Help Lists Of Lonely Bot.\n
It is a multi-purpose bot with easy-to-setup system and guideline in the bot itself.
If a command is mistyped or any errors is put then; the fixation instructions will be given too.
This bot might have a dashboard in future and even if it would have; the bot's main feature of maintaining everything via commands won't change.
If any customization added in future. It will surely be added here as a guideline as if you don't understand.\n
I only supports slash commands for now, when the bot reach 100+ servers and if the bot get a approval for the prefix commands. I will surely make sure to add it.\n
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
      .setLabel("Commands Page"),
      new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setCustomId("dropdownmenucommands")
      .setLabel("Commands and Setups Guidelines."),
      new ButtonBuilder()
      .setStyle(ButtonStyle.Danger)
      .setCustomId('gobak')
      .setLabel("Go Back To Main Menu")
    )
    interaction.reply({
        embeds: [main],
        components: [row]
    })
    const collector = interaction.channel.createMessageComponentCollector({
        type: ComponentType.Button,
        time: ms('15s')
    });
    const selectmenu = await new StringSelectMenuBuilder()
      .setCustomId('selectmenucmds')
      .setPlaceholder('Select A Guideline To Know About It')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('Category Relateds')
          .setDescription('If you have any problems understanding the command category this is for you.')
          .setValue('catrel'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Setup Relateds')
          .setDescription('Coming Soon {Not Responsive}')
      )      
    const selectmenuscollector = interaction.channel.createMessageCollector({
      type: ComponentType.StringSelect,
      time: ms('15s')
    })
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
            ]
        });              
        }
        if (i.customId === 'dropdownmenucommands') {
          interaction.channel.send({ embeds: [
            new EmbedBuilder()
            .setColor("Blue")
            .setAuthor({name: "Lonely Bot", avatarURL: (`${client.user.avatarURL({size: 512})}`)})
            .setDescription(`**Welcome To The Dropdown Help Menu.**\n
            Currently The Dropdown Only Supports Command's Category Related Information.\n
            Any Other System Is Not Addedd; Might Add In The Future Till Then The **Setup Related** Will Be Greyed Out.\n
            \n
            **NOTE: CHOOSE ONE FROM THE DROPDOWN MENU**`)
            .setFooter({ text: 'Copyright © LB Development 2023' })
          ], components: [selectmenu] })
        }
        if (i.customId === 'gobak') {          
          interaction.editReply({ embeds: [main], components: [row] })
        }
      });
      selectmenuscollector.on('collect', async i => {
        if (i.value === 'catrel') {
          interaction.channel.send({ embeds: [
            new EmbedBuilder()
            .setColor("Blue")
            .setAuthor({name: "Lonely Bot", avatarURL: (`${client.user.avatarURL({size: 512})}`)})
            .setDescription(`Categories Are Serially Explained:\n
            - **📗Information**: This category of commands gives out the informations about bot; like ping tells the bot's ping, support for the support server link etc.
            - **🪓Moderation**: This category of commands are mixed of moderaitons command such as ban, unban etc; planning to merge with automod soon.`)
            .setFooter({
                text: "Copyright © LB Development 2023"
            })
            .setTimestamp()
          ], components: [] })
        }
      })
  }
}
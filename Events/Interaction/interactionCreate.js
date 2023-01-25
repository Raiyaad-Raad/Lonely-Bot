const { Client, CommandInteraction, InteractionType, PermissionFlagsBits } = require('discord.js')

const { ApplicationCommand } = InteractionType

module.exports = {
  name: "interactionCreate",
  /**
  * @param {Client} client
  * @param {CommandInteraction} interaction
  **/
  async execute (interaction, client) {

    const { user, guild, commandName, member, type } = interaction

    if(!guild || user.bot) return
    if(type !== ApplicationCommand) return

    const command = client.commands.get(commandName)

    if(!command) return interaction.reply({ content:`${interaction}, "Something is wrong!"` }) && client.commands.delete(commandName)


    command.execute(interaction, client)
    
    
  }
}
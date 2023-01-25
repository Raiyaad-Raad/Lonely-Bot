const { Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ButtonStyle, ComponentType, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const wait = require('timers/promises').setTimeout()
const ms = require("ms")

module.exports = {
  name: "unban",
  description: "unban a member",
  category: "moderation",    
  options: [
    {
      name: "user-id",
      description: "mention the user you want to unban",
      required: true,
      type: 3,
    }
  ],
  /**
  * @param {Client} client
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute (interaction, client) {
		const use = interaction.guild.members.cache.get(interaction.member.id);
      
	if (!use.permissions.has([PermissionFlagsBits.BanMembers])) return interaction.reply({embeds: [new EmbedBuilder().setColor("#c22620").setDescription("You do not have permission to use this command.")]})
      
    const { options, user, guild, reply, editReply, deferReply } = interaction
    const main =  interaction.options.getString('user-id');
      
    
    if (isNaN(main)) return reply({embeds: [new EmbedBuilder().setColor("Red").setDescription(`Please provide a valid id.`).setTimestamp()]})

    const bannedMembers = await interaction.guild.bans.fetch()
    if(!bannedMembers.find(x => x.user.id === main)) return interaction.reply({embeds: [new EmbedBuilder().setColor("Red").setDescription("The following user-id cannot be found in the bans list. Are you sure that user is banned?").setTimestamp()]})
      
    interaction.guild.members.unban(main)
      .then(interaction.reply({embeds: [new EmbedBuilder().setColor('Blue').setDescription("Succesfully Unbanned The Following User ID.").setTimestamp()]}))
      .catch(console.error)
          }
      }    
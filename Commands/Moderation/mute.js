const { Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ButtonStyle, ComponentType, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const ms = require("ms")

module.exports = {
  name: "Mute",
  description: "Mute Someone (Permenant)",
  category: "🪓Moderation",    
  options: [
    {
      name: "user",
      description: "mention the user you want to mute",
      required: true,
      type: 6,
    },
    {
      name: "reason",
      description: "give a reason if you want.",
      required: false,
      type: 3,
    },
  ],
  /**
  * @param {Client} client
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute (interaction, client) {
		const use = interaction.guild.members.cache.get(interaction.member.id);

      	if (!use.permissions.has([PermissionFlagsBits.KickMembers || PermissionFlagsBits.BanMembers || PermissionFlagsBits.Administrator])) return interaction.reply({embeds: [new EmbedBuilder().setColor("#c22620").setDescription("You do not have permission to use this command.")]})
      
    const { options, user, guild, reply, editReply, deferReply } = interaction
    const member =  interaction.options.getMember('user');
    const r = interaction.options.getString('reason') || "no reason"

    if(member.id === user.id) return interaction.reply({content: "you can't mute yourself"}).catch((err) => {
     interaction.channel.send({content: `Error Occured! As This Error Will Continue Wait Till The Next Update. The Suggested Fix Is Don't Mute The User You Are Trying To Mute.`})
        const channel = client.channels.cache.get('1066558850754420847');
        channel.send({
            embeds: [
                new EmbedBuilder()
                .setDescription(`Hey Fellow Owner! @legpeice\n
A Error Occured When The Following User: ${interaction.user.tag} from ${interaction.guild.tag} Tried To Kick ${member.user.tag}.
The Error Is In The Following Description:
${err}`)
            ]
        });        
    })
    if (client.user.id === member.id) return interaction.reply({ content: "you can't mute me! using my own commands" }).catch((err) => {
     interaction.channel.send({content: `Error Occured! As This Error Will Continue Wait Till The Next Update. The Suggested Fix Is Don't Mute The User You Are Trying To Mute.`})
        const channel = client.channels.cache.get('1066558850754420847');
        channel.send({
            embeds: [
                new EmbedBuilder()
                .setDescription(`Hey Fellow Owner! @legepeice\n
A Error Occured When The Following User: ${interaction.user.tag} from ${interaction.guild.tag} Tried To Kick ${member.user.tag}.
The Error Is In The Following Description:
${err}`)
            ]
        });        
    })
    if (interaction.guild.ownerId === member.id) return interaction.reply({ content: "you can't kick the owner" }).catch((err) => {
             interaction.channel.send({content: `Error Occured! As This Error Will Continue Wait Till The Next Update. The Suggested Fix Is Don't Mute The User You Are Trying To Mute.`})
        const channel = client.channels.cache.get('1066558850754420847');
        channel.send({
            embeds: [
                new EmbedBuilder()
                .setDescription(`Hey Fellow Owner! @ratio.#2878\n
A Error Occured When The Following User: ${interaction.user.tag} from ${interaction.guild.tag} Tried To Kick ${member.user.tag}.
The Error Is In The Following Description:
${err}`)
            ]
        });
    })

    const row =  await new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setStyle(ButtonStyle.Danger)
      .setCustomId("mute-yes")
      .setLabel("Confirm"),

      new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setCustomId("mute-no")
      .setLabel("Cancel")
    )

    const cool = await interaction.reply({
      embeds: [
          new EmbedBuilder()
          .setColor('#c22620')
          .setAuthor({
              name: `Lonely Bot`,
              avatarURL: `${client.user.avatarURL({size: 512})}`
          })
		  .setDescription(`<:kick:1066554397108219974> Notice:\n
Are You Sure You Want To Mute @${member.user.tag}?`)
          .setTimestamp()
      ],
      components: [row]
    })

    const collector = interaction.channel.createMessageComponentCollector({
        type: ComponentType.Button,
        time: ms('15s')
    });
      
      collector.on('collect', async i => {
          if(i.customId === 'mute-yes') {
              member.send({
                  embeds: [
                      new EmbedBuilder()
                      .setColor('#ff0000')
                      .setAuthor({
                          name: `Lonely Bot`,
                          avatarURL: `${client.user.avatarURL({size: 512})}`
                      })
                      .setDescription(`**You Have Been Muted From ${interaction.guild.name}**\n
***You Were Kicked By ${interaction.user.tag}***
You are kicked for ${r}`)
                      .setTimestamp()
                  ],
                  content: ` <:kick:1066554397108219974> Notice!`,
                  components: []
              }).catch((err) => {
                  interaction.channel.send({content: "I cant send the specific member mute notice."})
              })              
                            const wait = require('node:timers/promises').setTimeout;
              await wait(4000)
            //   member.kick().catch(console.error)
            const mute_role = interaction.guild.roles.fetch('LonelyMuted')
            if (!mute_role) {
                interaction.guild.roles.create({ name: "LonelyMuted" })
            }
              interaction.editReply({ 
                  embeds: [
                      new EmbedBuilder()
                      .setColor('#ff0000')
                      .setAuthor({
                          name: "Lonely Bot",
                          avatarURL: `${client.user.avatarURL}`
                      })
                      .setDescription(`<:tick:1066553057531408384> Successfully mute ${member.user.tag} from the guild`)
                      .setTimestamp()
                  ],
                  components: []
              })
          }
          if (i.customId === 'mute-no') {
              interaction.editReply({
                  content: '',
                  embeds: [
                      new EmbedBuilder()
                      .setColor('#8abd91')
                      .setAuthor({
                          name: `Lonely Bot`,
                          iconURL: `${client.user.avatarURL({size: 512})}`
                      })
                      .setDescription(`Mute Request Succesfully Canceled <:tick:1066553057531408384>\n
The Member You Wanted To Mute: @${member.user.tag}`)
                      .setTimestamp()
                  ],
                  components: []
              })
          }
      })
      
  }
}    
const { Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ButtonStyle, ComponentType, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const wait = require('timers/promises').setTimeout()
const ms = require("ms")

module.exports = {
  name: "ban",
  description: "ban a member",
  category: "🪓Moderation",    
  options: [
    {
      name: "user",
      description: "mention the user you want to ban",
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
      
	if (!use.permissions.has([PermissionFlagsBits.BanMembers])) return interaction.reply({embeds: [new EmbedBuilder().setColor("#c22620").setDescription("You do not have permission to use this command.")]})
      
    const { options, user, guild, reply, editReply, deferReply } = interaction
    const member =  interaction.options.getMember('user');
    const r = interaction.options.getString('reason') || "no reason"

    if(member.id === user.id) return interaction.reply({content: "you can't ban yourself"}).catch((err) => {
     interaction.channel.send({content: `Error Occured! As This Error Will Continue Wait Till The Next Update. The Suggested Fix Is Don't Ban The User You Are Trying To Ban.`})
        const channel = client.channels.cache.get('1066558850754420847');
        channel.send({
            embeds: [
                new EmbedBuilder()
                .setDescription(`Hey Fellow Owner! @ratio.#2878\n
A Error Occured When The Following User: ${interaction.user.tag} from ${interaction.guild.tag} Tried To Ban ${member.user.tag}.
The Error Is In The Following Description:
${err}`)
            ]
        });        
    })
    if (client.user.id === member.id) return interaction.reply({ content: "you can't ban me! using my own commands" }).catch((err) => {
     interaction.channel.send({content: `Error Occured! As This Error Will Continue Wait Till The Next Update. The Suggested Fix Is Don't Ban The User You Are Trying To Ban.`})
        const channel = client.channels.cache.get('1066558850754420847');
        channel.send({
            embeds: [
                new EmbedBuilder()
                .setDescription(`Hey Fellow Owner! @ratio.#2878\n
A Error Occured When The Following User: ${interaction.user.tag} from ${interaction.guild.tag} Tried To Ban ${member.user.tag}.
The Error Is In The Following Description:
${err}`)
            ]
        });        
    })
    if (interaction.guild.ownerId === member.id) return interaction.reply({ content: "you can't ban the owner" }).catch((err) => {
             interaction.channel.send({content: `Error Occured! As This Error Will Continue Wait Till The Next Update. The Suggested Fix Is Don't Ban The User You Are Trying To Ban.`})
        const channel = client.channels.cache.get('1066558850754420847');
        channel.send({
            embeds: [
                new EmbedBuilder()
                .setDescription(`Hey Fellow Owner! @ratio.#2878\n
A Error Occured When The Following User: ${interaction.user.tag} from ${interaction.guild.tag} Tried To Ban ${member.user.tag}.
The Error Is In The Following Description:
${err}`)
            ]
        });
    })

    const row =  await new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setStyle(ButtonStyle.Danger)
      .setCustomId("ban-yes")
      .setLabel("Confirm"),

      new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setCustomId("ban-no")
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
		  .setDescription(`<:ban:1066578792132395008> Notice:\n
Are You Sure You Want To ban @${member.user.tag}?`)
          .setTimestamp()
      ],
      components: [row]
    })

    const collector = interaction.channel.createMessageComponentCollector({
        type: ComponentType.Button,
        time: ms('15s')
    });
      
      collector.on('collect', async i => {
          if(i.customId === 'ban-yes') {
              member.send({
                  embeds: [
                      new EmbedBuilder()
                      .setColor('#ff0000')
                      .setAuthor({
                          name: `Lonely Bot`,
                          avatarURL: `${client.user.avatarURL({size: 512})}`
                      })
                      .setDescription(`**You Have Been Banned From ${interaction.guild.name}**\n
***You Were Banned By ${interaction.user.tag}***\n
You are banned for ***${r}***`)
                      .setTimestamp()
                  ],
                  content: ` <:ban:1066578792132395008> Notice!`,
                  components: []
              }).catch((err) => {
                  interaction.channel.send({content: `I cant send the specific member banned notice. ${err}`})
              })
              const wait = require('node:timers/promises').setTimeout;
              await wait(4000)
              member.ban({reason: r}).catch((err) => {
                  interaction.editReply({
                      content: `${err}: ERROR OCCURED`,
                      embeds: [],
                      components: []
                  })
              })
              interaction.editReply({ 
                  content: "",
                  embeds: [
                      new EmbedBuilder()
                      .setColor('#ff0000')
                      .setAuthor({
                          name: "Lonely Bot",
                          avatarURL: `${client.user.avatarURL}`
                      })
                      .setDescription(`<:tick:1066553057531408384> Successfully banned ${member.user.tag} from the guild`)
                      .setTimestamp()
                  ],
                  components: []
              })
          }
          if (i.customId === 'ban-no') {
              interaction.editReply({
                  content: '',
                  embeds: [
                      new EmbedBuilder()
                      .setColor('#8abd91')
                      .setAuthor({
                          name: `Lonely Bot`,
                          iconURL: `${client.user.avatarURL({size: 512})}`
                      })
                      .setDescription(`Ban Request Succesfully Canceled <:tick:1066553057531408384>\n
The Member You Wanted To Ban: @${member.user.tag}`)
                      .setTimestamp()
                  ],
                  components: []
              })
          }
      })
      
  }
}    
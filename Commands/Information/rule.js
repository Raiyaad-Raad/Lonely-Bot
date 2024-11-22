const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    name: "support",
    description: "Displays the server rules",
    category: "📗Information",
    /**
    * @param {Client} client
    * @param {ChatInputCommandInteraction} interaction
    **/
    async execute(interaction, client){
        const embed = new EmbedBuilder()
        .setColor('Blue')
        .setTitle('Server Rules')
        .setDescription('Please follow these rules to maintain a healthy and respectful community.')
        .addFields(
          { name: '1. Be Respectful', value: 'Treat everyone with respect. No harassment, hate speech, or personal attacks.' },
          { name: '2. No Spamming', value: 'Avoid sending repetitive messages, emojis, or links.' },
          { name: '3. Follow Discord TOS', value: 'Adhere to [Discord Terms of Service](https://discord.com/terms).' },
          { name: '4. Use Appropriate Channels', value: 'Post content in the correct channels.' },
          { name: '5. No NSFW Content', value: 'This server is family-friendly. Keep content safe for all audiences.' }
        )
        .setFooter({ text: 'Thank you for being a part of our community!' })
        .setTimestamp();
  
      await interaction.reply({ embeds: [embed] });
  
    }
}
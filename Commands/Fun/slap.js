const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')
const axios = require('axios');

module.exports = {
    name: "slap", // command name here
    description: "Slap someone!", // command description here
    category: "🎈Fun", // command category here
    options: [
        {
            name: "user",
            description: "mention the user you want to slap",
            required: true,
            type: 6,
          },
    ],
    /**
    * @param {Client} client
    * @param {ChatInputCommandInteraction} interaction
    **/
    async execute(interaction, client) {
      const user = interaction.options.getUser('user');

      const randomPos = Math.floor(Math.random() * 5000);

      const apiResponse = await axios.get('https://g.tenor.com/v1/search', {
        params: {
            q: 'anime slap',
            key: 'YOUR_TENOR_API_KEY',
            limit: 1,
            pos: randomPos
        }
    });

      const gifs = apiResponse.data.results;
      if (gifs.length === 0) {
        return interaction.reply({ content: "Error Occured!, Try Again", ephemeral: true }).then(() => {
          console.log("Error Searching Gifs. - Tenor API Erorr")
      });
      };

      const slapURL = gifs[0].media[0].gif.url;

      const embed = new EmbedBuilder()
                .setColor("Random")
                .setDescription(`${interaction.user} slapped ${user}!`)
                .setImage(slapURL)
                .setTimestamp();

      interaction.reply({
        embeds: [embed]
      })
  }
}
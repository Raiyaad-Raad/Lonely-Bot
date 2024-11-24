// const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')
// const axios = require('axios');

// module.exports = {
//     name: "slap", // command name here
//     description: "Slap someone!", // command description here
//     category: "🎈Fun", // command category here
    // options: [
    //     {
    //         name: "user",
    //         description: "mention the user you want to slap",
    //         required: true,
    //         type: 6,
    //       },
    // ],
//     /**
//     * @param {Client} client
//     * @param {ChatInputCommandInteraction} interaction
//     **/
//     async execute(interaction, client) {
//       const user = interaction.options.getUser('user');

//       const randomPos = Math.floor(Math.random() * 5000);

//       const apiResponse = await axios.get('https://g.tenor.com/v1/search', {
//         params: {
//             q: 'anime slap',
//             key: 'AIzaSyDSJzSFsg8qoxmS00_Ay1RsZps6iT5UmiQ',
//             limit: 1,
//             pos: randomPos
//         }
//     });

//       const gifs = apiResponse.data.results;
//       if (gifs.length === 0) {
//         return interaction.reply({ content: "Error Occured!, Try Again", ephemeral: true }).then(() => {
//           console.log("Error Searching Gifs. - Tenor API Erorr")
//       });
//       };

//       const slapURL = gifs[0].media[0].gif.url;

//       const embed = new EmbedBuilder()
//                 .setColor("Random")
//                 .setDescription(`${interaction.user} slapped ${user}!`)
//                 .setImage(slapURL)
//                 .setTimestamp();

//       interaction.reply({
//         embeds: [embed]
//       })
//   }
// }
const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: "slap", // command name
    description: "Slap a user with a random anime gif!", // command description
    category: "Fun", // command category
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
        // Fetch the target user
        const targetUser = interaction.options.getUser('user');

        if (!targetUser) {
            return interaction.reply({ content: "You need to mention someone to slap!", ephemeral: true });
        }

        try {
            // Generate a random offset for infinite randomness
            const randomPos = Math.floor(Math.random() * 5000); // Random position between 0 and 5000

            // Fetch GIFs from Tenor API with random offset
            const response = await axios.get('https://g.tenor.com/v1/search', {
                params: {
                    q: 'anime slap',
                    key: 'YOUR_TENOR_API_KEY', // Replace with your Tenor API Key
                    limit: 1, // Fetch only one GIF at the random position
                    pos: randomPos // Random position in search results
                }
            });

            const gifs = response.data.results;

            if (gifs.length === 0) {
                return interaction.reply({ content: "Couldn't find a slap GIF, try again!", ephemeral: true });
            }

            const gifUrl = gifs[0].media[0].gif.url;

            // Create the embed
            const embed = new EmbedBuilder()
                .setColor("Random")
                .setDescription(`${interaction.user} slapped ${targetUser}!`)
                .setImage(gifUrl)
                .setTimestamp();

            // Send the embed
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "Something went wrong while fetching the slap GIF!", ephemeral: true });
        }
    }
};

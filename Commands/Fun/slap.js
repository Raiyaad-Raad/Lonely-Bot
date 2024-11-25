const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const dotenv = require('dotenv');
const apiKey = process.env.GIPHY_API_KEY;
const apiURL = process.env.GIPHY_API_URL;
module.exports = {
    name: "slap", 
    description: "Slap Someone! (*/ω＼*)",
    category: ".🎈Fun",
    options: [
        {
            name: "user",
            description: "mention the user you want to ban",
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

        axios.get(`${apiURL}`, {
            params: {
                api_key: apiKey,
                q: 'anime slap'
            }   
        }).then((res, err) => {
            if(err) {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setAuthor({ name: `${client.user.name}`, iconURL: `${client.user.avatarURL}` })
                        .setDescription(`⭕ ERROR! Can't Fetch API; Please Try Again Later\n
                        If The Problem Still Pursists Please Contatct The Owner Of The Bot.`)
                        .setTimestamp()
                    ],
                    ephemeral: true,
                })
                console.log('Error!', 'API Related!', 'Problem Detected In Giphy API!', err)
            } else if (res) {
                const int = Math.floor(Math.random() * res.data.data.length);
                const gifURI = res.data.data[int].embed_url;
                const slapEmbed = new EmbedBuilder()
                .setColor('Aqua')
                .setTitle('Someone Slapped~~!')
                .setDescription(`**${interaction.user} Has Slapped ${user}! Naughty~~**`)
                .setImage(gifURI)
                .setTimestamp()
                interaction.reply({
                    embeds: [
                        slapEmbed
                    ]
                })
            }
        })
    }
}
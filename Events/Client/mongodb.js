const { Client } = require('discord.js');
const mongo = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const mongoURL = process.env.MONGO

module.exports = {
    name: 'ready',
    /**
     * @param {Client} client
     */
    async execute(client) {
        if(!mongoURL) return;
        mongoose.connect(mongoURL, {

            useNewUrlParser: true,
            useUnifiedTopology: true

        })
    }
}
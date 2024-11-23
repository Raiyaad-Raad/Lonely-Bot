const { Client } = require('discord.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const mongoURL = process.env.MONGO;
const chalk = require('chalk');
const quickmongo = require('quickmongo');
const db = new quickmongo.Database(mongoURL);

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

        }).then((mongo) => {
            db.on("ready", () => {
                console.log(
                    chalk.green('[MONGO]: '),
                    chalk.bold('QuickMongo Has Been Added.')
                )
            })
            console.log(chalk.green('[MONGO]: '), chalk.green('Mongoose Database aka. Cluster Connected Successfully'))
        }).catch((err) => {
            console.log(err);
            process.exit();
        })
    }
}

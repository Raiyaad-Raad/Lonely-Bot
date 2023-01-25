const { Client, Partials, Collection } = require("discord.js")
const dotenv = require("dotenv").config()
const { promisify } = require('util')
const { glob } = require('glob')
const PG = promisify(glob)
const Ascii = require("ascii-table")
const ms = require('ms')
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials
const client = new Client({
  intents: 3276799
})

module.exports = client

require("./Handlers/Commands.js")(client, PG, Ascii, ms)
require("./Handlers/Events.js")(client, PG, Ascii, ms)

client.commands = new Collection();
client.events = new Collection();


client.login(process.env.TOKEN)
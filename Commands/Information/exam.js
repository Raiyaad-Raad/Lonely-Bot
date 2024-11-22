const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config(); // For loading environment variables

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // Required to read message content
    ],
});

// When the bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Listen for message events
client.on('messageCreate', (message) => {
    // Check if the message is "$hi" and not sent by the bot itself
    if (message.content === '$hi' && !message.author.bot) {
        message.channel.send('Hey, how are you?');
    }
});

// Log in to Discord
client.login(process.env.BOT_TOKEN);

const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config(); // For loading your bot token from a .env file

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// When the bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Listen for messages
client.on('messageCreate', message => {
    // Check if the message is "$hi" and not sent by the bot itself
    if (message.content === '$hi' && !message.author.bot) {
        message.channel.send('Hey, how are you?');
    }
});

// Log in to Discord
client.login(process.env.BOT_TOKEN);


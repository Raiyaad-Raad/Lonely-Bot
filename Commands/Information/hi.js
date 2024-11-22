const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    name: "hi", // command name here
    description: "Chat", // command description here
    category: "Information", // command category here
    /**
    * @param {Client} client
    * @param {ChatInputCommandInteraction} interaction
    **/
    async execute(interaction, client) {
      // code here
    }
}
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config(); // For loading environment variables

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Define the /hi command
const commands = [
    new SlashCommandBuilder()
        .setName('hi')
        .setDescription('Say hi to the bot!'),
];

// Register the command
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        // Replace YOUR_CLIENT_ID with your bot's client ID
        // Replace YOUR_GUILD_ID with your server ID (for testing, use guild-based registration)
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

// Event listener when the bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Listen for slash command interactions
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'hi') {
        await interaction.reply('Greetings!');
    }
});

// Log in to Discord
client.login(process.env.BOT_TOKEN);

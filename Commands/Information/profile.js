const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config(); // For loading your bot token from a .env file

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Register the /profile command
const commands = [
    new SlashCommandBuilder()
        .setName('profile')
        .setDescription("Displays your profile information"),
];

// Deploy commands
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
(async () => {
    try {
        console.log('Refreshing application commands...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );
        console.log('Application commands refreshed!');
    } catch (error) {
        console.error(error);
    }
})();

// When the bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Listen for interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'profile') {
        const user = interaction.user;
        const profileEmbed = {
            color: 0x0099ff,
            title: `${user.username}'s Profile`,
            thumbnail: {
                url: user.displayAvatarURL({ dynamic: true }),
            },
            fields: [
                { name: 'Username', value: user.username, inline: true },
                { name: 'Discriminator', value: `#${user.discriminator}`, inline: true },
            ],
            timestamp: new Date(),
        };

        await interaction.reply({ embeds: [profileEmbed] });
    }
});

// Log in to Discord
client.login(process.env.BOT_TOKEN);

const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');

// Bot token and IDs
const TOKEN = 'YOUR_BOT_TOKEN';
const CLIENT_ID = 'YOUR_CLIENT_ID';
const GUILD_ID = 'YOUR_GUILD_ID';

// Initialize the bot client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// Slash command definition
const commands = [
  {
    name: 'rule',
    description: 'Displays the server rules',
  }
];

// Register slash commands (only run when needed)
const registerCommands = async () => {
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    console.log('Registering slash commands...');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands
    });
    console.log('Slash commands registered successfully!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
};

// Handle bot ready event
client.once('ready', () => {
  console.log(`${client.user.tag} is online and ready!`);
});

// Handle interactions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'rule') {
    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('Server Rules')
      .setDescription('Please follow these rules to maintain a healthy and respectful community.')
      .addFields(
        { name: '1. Be Respectful', value: 'Treat everyone with respect. No harassment, hate speech, or personal attacks.' },
        { name: '2. No Spamming', value: 'Avoid sending repetitive messages, emojis, or links.' },
        { name: '3. Follow Discord TOS', value: 'Adhere to [Discord Terms of Service](https://discord.com/terms).' },
        { name: '4. Use Appropriate Channels', value: 'Post content in the correct channels.' },
        { name: '5. No NSFW Content', value: 'This server is family-friendly. Keep content safe for all audiences.' }
      )
      .setFooter({ text: 'Thank you for being a part of our community!' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
});

// Main logic: Register commands and start the bot
(async () => {
  if (process.argv.includes('--register')) {
    await registerCommands(); // Register commands if '--register' is passed as an argument
  } else {
    client.login(TOKEN); // Otherwise, log in the bot
  }
})();

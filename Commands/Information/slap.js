const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    name: "slap", // command name here
    description: "giving a slap", // command description here
    category: "Information", // command category here
    /**
    * @param {Client} client
    * @param {ChatInputCommandInteraction} interaction
    **/
    async execute(interaction, client) {
      // code here
const { Client, Intents, SlashCommandBuilder } = require('discord.js');
const { token } = require('./config.json'); // Assume your bot token is in a config file

// Create a new bot client with required intents
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
  console.log('Bot is online!');
});

// Register commands when the bot starts up
client.on('ready', () => {
  const commands = client.guilds.cache.get('YOUR_GUILD_ID')?.commands;

  if (commands) {
    commands.create(
      new SlashCommandBuilder()
        .setName('slap')
        .setDescription('Sends a slap message!')
        .toJSON()
    ).then(() => console.log('Slash command registered!'))
      .catch(console.error);
  }
});

// Handle interaction events (e.g., when the user uses the slash command)
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'slap') {
    await interaction.reply('Here’s a slap! 👋');
  }
});

// Login with your bot token
client.login(token);

    }
}

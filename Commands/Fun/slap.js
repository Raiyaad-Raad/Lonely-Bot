const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
    name: "slap", // command name here
    description: "Slap someone and let the bot announce it!", // command description here
    category: "Fun", // command category here
    options: [
        {
            name: "user", // option name
            type: 6, // type 6 corresponds to a USER in Discord API
            description: "The user you want to slap",
            required: true, // make this option mandatory
        },
    ],
    /**
    * @param {Client} client
    * @param {ChatInputCommandInteraction} interaction
    **/
    async execute(interaction, client) {
        // Get the user who invoked the command
        const slapper = interaction.user;
        // Get the target user from the options
        const targetUser = interaction.options.getUser("user");

        // Check if the slapper is trying to slap themselves
        if (slapper.id === targetUser.id) {
            return interaction.reply({
                content: "You can't slap yourself! 🤦",
                ephemeral: true,
            });
        }

        // Construct the response
        await interaction.reply({
            content: `${slapper} gave a big slap to ${targetUser}! 👋`,
            allowedMentions: { users: [slapper.id, targetUser.id] },
        });
    },
};

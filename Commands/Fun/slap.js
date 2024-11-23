const { Client, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    name: "slap", // command name
    description: "Slap someone with a funny image!", // command description
    category: "Fun", // command category
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
        // Predefined slap images
        const slapImages = [
            "https://i.imgur.com/fm49srQ.jpg", // Replace these with your desired slap images
            "https://i.imgur.com/WxNkKpF.jpg",
            "https://i.imgur.com/4oLIrwj.jpg",
            "https://i.imgur.com/ovZUl6P.jpg",
            "https://i.imgur.com/Nm6xDYM.jpg",
        ];

        // Get the user who invoked the command
        const slapper = interaction.user;
        // Get the target user from the options
        const targetUser = interaction.options.getUser("user");

        // Prevent self-slapping
        if (slapper.id === targetUser.id) {
            return interaction.reply({
                content: "You can't slap yourself! 🤦",
                ephemeral: true,
            });
        }

        // Pick a random slap image
        const randomImage = slapImages[Math.floor(Math.random() * slapImages.length)];

        // Construct the response
        await interaction.reply({
            content: `${slapper} gave a big slap to ${targetUser}! 👋`,
            embeds: [
                {
                    color: 0xff0000, // Set an embed color (red for slap)
                    image: { url: randomImage }, // Attach the random image
                },
            ],
            allowedMentions: { users: [slapper.id, targetUser.id] },
        });
    },
};

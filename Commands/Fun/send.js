const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
    name: "send",
    description: "Send a secret message to a specified user via DM.",
    category: "Fun",
    options: [
        {
            name: "message",
            description: "The message you want to send.",
            type: 3, // String
            required: true
        },
        {
            name: "user",
            description: "The Discord user to send the message to.",
            type: 6, // User
            required: true
        }
    ],
    /**
    * @param {Client} client
    * @param {ChatInputCommandInteraction} interaction
    **/
    async execute(interaction, client) {
        const message = interaction.options.getString("message");
        const user = interaction.options.getUser("user");

        try {
            // Send the message as a DM to the specified user
            await user.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Random")
                        .setTitle("You received a secret message!")
                        .setDescription(message)
                        .setFooter({ text: "This message was sent anonymously." })
                ]
            });

            // Confirm the action to the sender
            await interaction.reply({
                content: `✅ Your secret message has been sent to ${user.tag}!`,
                ephemeral: true
            });
        } catch (error) {
            console.error("Failed to send the DM:", error);
            await interaction.reply({
                content: "❌ I couldn't send the message. Please check if the user has DMs enabled.",
                ephemeral: true
            });
        }
    }
};

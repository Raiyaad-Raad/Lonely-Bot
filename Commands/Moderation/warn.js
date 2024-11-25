const { Client, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "warn",
    description: "Warn a member with a reason and choose to notify them privately or publicly.",
    category: "Moderation",
    options: [
        {
            name: "user",
            description: "The member to warn.",
            type: 6, // USER type
            required: true,
        },
        {
            name: "reason",
            description: "Reason for the warning.",
            type: 3, // STRING type
            required: true,
        },
        {
            name: "notify",
            description: "How to notify the user.",
            type: 3, // STRING type
            required: true,
            choices: [
                { name: "Privately", value: "private" },
                { name: "Publicly", value: "public" },
            ],
        },
    ],
    /**
    * @param {Client} client
    * @param {ChatInputCommandInteraction} interaction
    **/
    async execute(interaction, client) {
        try {
            // Defer the reply to prevent timeouts
            await interaction.deferReply({ ephemeral: true });

            const user = interaction.options.getUser("user");
            const reason = interaction.options.getString("reason");
            const notify = interaction.options.getString("notify");

            // Ensure the bot has permissions to send messages in the channel
            const botMember = interaction.guild.members.me;
            if (!botMember.permissions.has(PermissionFlagsBits.SendMessages)) {
                return interaction.editReply({
                    content: "I lack permissions to send messages in this channel.",
                });
            }

            // Ensure the user is valid and not self/bot
            if (user.id === interaction.user.id) {
                return interaction.editReply({
                    content: "You cannot warn yourself.",
                });
            }

            if (user.bot) {
                return interaction.editReply({
                    content: "You cannot warn a bot.",
                });
            }

            // Check if the user is a member of the server
            const member = interaction.guild.members.cache.get(user.id);
            if (!member) {
                return interaction.editReply({
                    content: "That user is not in this server.",
                });
            }

            // Create the warning embed
            const warnEmbed = new EmbedBuilder()
                .setTitle("⚠️ Warning Issued")
                .setColor("YELLOW")
                .addFields(
                    { name: "Warned User", value: `${user.tag}`, inline: true },
                    { name: "Warned By", value: `${interaction.user.tag}`, inline: true },
                    { name: "Reason", value: reason }
                )
                .setTimestamp();

            // Notify privately or publicly
            if (notify === "private") {
                try {
                    await user.send({ embeds: [warnEmbed] });
                    interaction.editReply({
                        content: `The user ${user.tag} has been warned privately.`,
                    });
                } catch (error) {
                    console.error("Failed to send DM to user:", error);
                    interaction.editReply({
                        content: `Could not send a DM to ${user.tag}. They may have DMs disabled.`,
                    });
                }
            } else if (notify === "public") {
                await interaction.editReply({
                    content: `The user ${user.tag} has been warned publicly.`,
                });
                interaction.channel.send({ embeds: [warnEmbed] });
            }
        } catch (error) {
            console.error("Error in /warn command:", error);
            interaction.editReply({
                content: "An error occurred while processing the command. Please check the logs.",
            });
        }
    },
};

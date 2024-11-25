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
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");
        const notify = interaction.options.getString("notify");

        // Check if the user is trying to warn themselves or a bot
        if (user.id === interaction.user.id) {
            return interaction.reply({
                content: "You cannot warn yourself.",
                ephemeral: true,
            });
        }

        if (user.bot) {
            return interaction.reply({
                content: "You cannot warn a bot.",
                ephemeral: true,
            });
        }

        const member = interaction.guild.members.cache.get(user.id);
        if (!member) {
            return interaction.reply({
                content: "That user is not in this server.",
                ephemeral: true,
            });
        }

        // Create embed message
        const warnEmbed = new EmbedBuilder()
            .setTitle("⚠️ Warning Issued")
            .setColor("YELLOW")
            .addFields(
                { name: "Warned User", value: `${user.tag}`, inline: true },
                { name: "Warned By", value: `${interaction.user.tag}`, inline: true },
                { name: "Reason", value: reason }
            )
            .setTimestamp();

        if (notify === "private") {
            try {
                await user.send({ embeds: [warnEmbed] });
                interaction.reply({
                    content: `The user ${user.tag} has been warned privately.`,
                    ephemeral: true,
                });
            } catch (error) {
                interaction.reply({
                    content: `Could not send a DM to ${user.tag}.`,
                    ephemeral: true,
                });
            }
        } else if (notify === "public") {
            interaction.reply({
                embeds: [warnEmbed],
                ephemeral: false,
            });
        }
    },
};

const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "give",
    description: "Give yourself a role from the server's available roles.",
    category: "Moderation",
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     **/
    async execute(interaction, client) {
        const guild = interaction.guild;

        // Fetch all roles from the server, excluding managed and @everyone
        const roles = guild.roles.cache.filter(role => !role.managed && role.name !== "@everyone");

        // If there are no roles to select
        if (!roles.size) {
            return interaction.reply({ content: "There are no available roles to select.", ephemeral: true });
        }

        // Create a select menu with the server's roles
        const roleSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('role_select')
            .setPlaceholder('Select a role to give yourself')
            .addOptions(
                roles.map(role => ({
                    label: role.name,
                    value: role.id
                }))
            );

        const row = new ActionRowBuilder().addComponents(roleSelectMenu);

        // Send the select menu to the user
        await interaction.reply({
            content: "Select a role to assign to yourself:",
            components: [row],
            ephemeral: true
        });

        // Create a collector to handle role selection
        const collector = interaction.channel.createMessageComponentCollector({
            componentType: 'SELECT_MENU',
            time: 60000 // 1 minute
        });

        collector.on('collect', async (menuInteraction) => {
            if (menuInteraction.user.id !== interaction.user.id) {
                return menuInteraction.reply({ content: "This menu isn't for you!", ephemeral: true });
            }

            const selectedRoleId = menuInteraction.values[0];
            const selectedRole = guild.roles.cache.get(selectedRoleId);

            if (!selectedRole) {
                return menuInteraction.reply({ content: "The selected role is no longer available.", ephemeral: true });
            }

            const member = interaction.member;

            if (member.roles.cache.has(selectedRoleId)) {
                return menuInteraction.reply({ content: `You already have the **${selectedRole.name}** role!`, ephemeral: true });
            }

            try {
                await member.roles.add(selectedRole);
                return menuInteraction.reply({ content: `You have been given the **${selectedRole.name}** role!`, ephemeral: true });
            } catch (err) {
                console.error(err);
                return menuInteraction.reply({ content: "I couldn't assign the role. Please ensure my role is above the selected role and I have the necessary permissions.", ephemeral: true });
            }
        });

        collector.on('end', () => {
            // Disable the select menu after the collector ends
            interaction.editReply({ components: [] });
        });
    }
};

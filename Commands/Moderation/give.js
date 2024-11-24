const { Client, ChatInputCommandInteraction, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

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
            .setCustomId('give_role_select') // Custom ID for identifying the interaction
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

        // Listen for interaction from the select menu
        const filter = (i) => i.customId === 'give_role_select' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (menuInteraction) => {
            const selectedRoleId = menuInteraction.values[0];
            const selectedRole = guild.roles.cache.get(selectedRoleId);

            if (!selectedRole) {
                return menuInteraction.reply({ content: "The selected role is no longer available.", ephemeral: true });
            }

            const member = interaction.member;

            // Check if the user already has the role
            if (member.roles.cache.has(selectedRoleId)) {
                return menuInteraction.reply({ content: `You already have the **${selectedRole.name}** role!`, ephemeral: true });
            }

            try {
                // Assign the role to the user
                await member.roles.add(selectedRole);
                return menuInteraction.reply({ content: `The **${selectedRole.name}** role has been given to you!`, ephemeral: true });
            } catch (err) {
                console.error(err);
                return menuInteraction.reply({
                    content: "I couldn't assign the role. Please ensure my role is above the selected role and I have the necessary permissions.",
                    ephemeral: true
                });
            }
        });

        collector.on('end', () => {
            // Disable the select menu after the collector ends
            interaction.editReply({ components: [] }).catch(console.error);
        });
    }
};

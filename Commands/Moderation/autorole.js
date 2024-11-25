const { Client, ChatInputCommandInteraction, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

// Database or a variable to store the autorole (you can use a database like MongoDB for persistence)
let autoRoleId = null; // Temporary variable to store the role ID

module.exports = {
    name: "autorole",
    description: "Set a role to be assigned to new members when they join the server.",
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
            .setCustomId('autorole_select')
            .setPlaceholder('Select a role to set as the autorole')
            .addOptions(
                roles.map(role => ({
                    label: role.name,
                    value: role.id
                }))
            );

        const row = new ActionRowBuilder().addComponents(roleSelectMenu);

        // Send the select menu to the user
        await interaction.reply({
            content: "Select a role to set as the autorole:",
            components: [row],
            ephemeral: true
        });

        // Listen for the select menu interaction
        const filter = (i) => i.customId === 'autorole_select' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (menuInteraction) => {
            const selectedRoleId = menuInteraction.values[0];
            const selectedRole = guild.roles.cache.get(selectedRoleId);

            if (!selectedRole) {
                return menuInteraction.reply({ content: "The selected role is no longer available.", ephemeral: true });
            }

            // Save the selected role ID for autorole
            autoRoleId = selectedRoleId;

            // Confirm the role has been set as autorole
            return menuInteraction.reply({
                content: `Alright! People will get the **${selectedRole.name}** role after joining.`,
                ephemeral: true
            });
        });

        collector.on('end', () => {
            // Disable the select menu after the collector ends
            interaction.editReply({ components: [] }).catch(console.error);
        });
    }
};

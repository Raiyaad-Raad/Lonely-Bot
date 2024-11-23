const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Path to the JSON file to store autorole configurations
const configPath = path.resolve(__dirname, './autorole-config.json');

// Ensure the config file exists
if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({}));
}

module.exports = {
    name: "autorole",
    description: "Set up an autorole for new members.",
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName("autorole")
        .setDescription("Set a role to assign automatically to new members.")
        .addRoleOption(option =>
            option.setName("role")
                .setDescription("The role to assign to new members.")
                .setRequired(true)
        ),
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     **/
    async execute(interaction, client) {
        try {
            // Check if the user has permission to manage roles
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                return interaction.reply({
                    content: "You don't have permission to use this command.",
                    ephemeral: true
                });
            }

            // Get the role from the command
            const role = interaction.options.getRole("role");

            // Check if the bot can manage this role
            if (role.managed || role.position >= interaction.guild.members.me.roles.highest.position) {
                return interaction.reply({
                    content: "I cannot assign this role. Make sure it is below my highest role and not a managed role.",
                    ephemeral: true
                });
            }

            // Read the current config
            const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

            // Save the role ID for this server
            config[interaction.guild.id] = role.id;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

            // Send confirmation message
            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("Autorole Set")
                .setDescription(`Successfully set the autorole to ${role}. New members will now automatically receive this role.`)
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: "An error occurred while setting the autorole.",
                ephemeral: true
            });
        }
    }
};

// Event listener for new members joining
module.exports.registerEventListeners = (client) => {
    client.on("guildMemberAdd", async (member) => {
        try {
            // Read the config
            const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

            // Get the autorole for the server
            const roleId = config[member.guild.id];
            if (!roleId) return;

            // Assign the role to the new member
            const role = member.guild.roles.cache.get(roleId);
            if (role) {
                await member.roles.add(role);
                console.log(`Assigned role ${role.name} to ${member.user.tag}`);
            }
        } catch (error) {
            console.error(`Failed to assign autorole: ${error.message}`);
        }
    });
};

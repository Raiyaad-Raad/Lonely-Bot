const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    name: "buttons",
    description: "Commands with buttons and interactive elements.",
    category: "information",
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     **/ 
    async execute(interaction, client) {
        const buttonRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("join")
                .setLabel("Join Giveaway")
                .setStyle("PRIMARY"),
            new ButtonBuilder()
                .setCustomId("leave")
                .setLabel("Leave Giveaway")
                .setStyle("DANGER")
        );

        await interaction.reply({
            content: "Click a button to join or leave the giveaway!",
            components: [buttonRow]
        });
    }
};

// Handling button interactions
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'join') {
        await interaction.reply({ content: "You have joined the giveaway!", ephemeral: true });
    } else if (interaction.customId === 'leave') {
        await interaction.reply({ content: "You have left the giveaway.", ephemeral: true });
    }
});

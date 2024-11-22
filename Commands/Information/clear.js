const { Client, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "clear", // command name here
    description: "Clear a specific number of messages from the channel", // command description here
    category: "Information", // command category here
    /**
    * @param {Client} client
    * @param {ChatInputCommandInteraction} interaction
    **/
    async execute(interaction, client) {
        // Check if the user has the MANAGE_MESSAGES permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: "You don't have permission to use this command.", ephemeral: true });
        }

        // Create a modal
        const modal = new ModalBuilder()
            .setCustomId('clearModal')
            .setTitle('Clear Messages');

        // Create a text input for specifying the number of messages
        const input = new TextInputBuilder()
            .setCustomId('messageCount')
            .setLabel('How many messages should I clear? (1-50)')
            .setPlaceholder('Enter a number between 1 and 50')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        // Add the input to an ActionRow
        const actionRow = new ActionRowBuilder().addComponents(input);

        // Add the ActionRow to the modal
        modal.addComponents(actionRow);

        // Show the modal to the user
        await interaction.showModal(modal);

        // Collect modal submission
        const filter = (modalInteraction) => modalInteraction.customId === 'clearModal' && modalInteraction.user.id === interaction.user.id;
        interaction.awaitModalSubmit({ filter, time: 60000 })
            .then(async (modalInteraction) => {
                const messageCount = parseInt(modalInteraction.fields.getTextInputValue('messageCount'));

                // Validate the input
                if (isNaN(messageCount) || messageCount < 1 || messageCount > 50) {
                    return modalInteraction.reply({ content: 'Please enter a valid number between 1 and 50.', ephemeral: true });
                }

                // Attempt to delete the messages
                try {
                    const deletedMessages = await interaction.channel.bulkDelete(messageCount, true);
                    await modalInteraction.reply({ content: `Successfully deleted ${deletedMessages.size} messages.`, ephemeral: true });
                } catch (error) {
                    console.error(error);
                    await modalInteraction.reply({ content: 'Failed to delete messages. Ensure they are not older than 14 days.', ephemeral: true });
                }
            })
            .catch((err) => {
                console.error(err);
                interaction.followUp({ content: 'You did not respond in time.', ephemeral: true });
            });
    }
};

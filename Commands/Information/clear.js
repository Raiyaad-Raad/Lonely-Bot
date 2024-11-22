const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
    name: "clear", // command name
    description: "Clear a specified number of messages (1-20)", // command description
    category: "moderation", // command category
    
    /**
    * @param {Client} client
    * @param {ChatInputCommandInteraction} interaction
    **/
    async execute(interaction, client) {
        // Get the number of messages to delete from the user's input
        const amount = interaction.options.getInteger('amount'); 

        // Check if the amount is within the valid range (1-20)
        if (amount < 1 || amount > 20) {
            return interaction.reply({
                content: 'You can only delete between 1 and 20 messages!',
                ephemeral: true, // reply visible only to the user
            });
        }

        try {
            // Delete the messages (amount + 1 to include the command message itself)
            await interaction.channel.bulkDelete(amount, true);

            // Send a confirmation message
            return interaction.reply({
                content: `Successfully deleted ${amount} message(s)!`,
                ephemeral: true, // reply visible only to the user
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: 'There was an error trying to clear messages.',
                ephemeral: true,
            });
        }
    }
};

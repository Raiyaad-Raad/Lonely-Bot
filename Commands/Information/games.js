const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    name: "minigames",
    description: "Play mini-games like trivia, fishing, and battles.",
    category: "Information",
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     **/ 
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "trivia") {
            const question = "What is the capital of France?";
            const correctAnswer = "Paris";

            await interaction.reply({ content: `Trivia: ${question}`, ephemeral: true });

            const filter = (message) => message.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

            collector.on("collect", (message) => {
                if (message.content.toLowerCase() === correctAnswer.toLowerCase()) {
                    message.reply({ content: "Correct! You win 50 coins!" });
                    updateBalance(interaction.user.id, 50); // Assuming you have updateBalance function
                    collector.stop();
                } else {
                    message.reply({ content: "Wrong answer! Try again." });
                }
            });

            collector.on("end", (collected, reason) => {
                if (reason === "time") {
                    interaction.followUp({ content: "You ran out of time!", ephemeral: true });
                }
            });
        }

        if (subcommand === "fishing") {
            const fish = ["Salmon", "Tuna", "Cod", "Shark"];
            const caughtFish = fish[Math.floor(Math.random() * fish.length)];
            await interaction.reply({ content: `You caught a **${caughtFish}**!`, ephemeral: true });
            // You can add rewards for specific fish types.
        }

        if (subcommand === "battle") {
            // Example: A simple battle game with two choices
            const battleChoices = ["Sword", "Shield"];
            const randomChoice = battleChoices[Math.floor(Math.random() * battleChoices.length)];
            const userChoice = interaction.options.getString("choice");

            if (!battleChoices.includes(userChoice)) {
                return await interaction.reply({ content: "Invalid choice. Choose either 'Sword' or 'Shield'.", ephemeral: true });
            }

            if (userChoice === randomChoice) {
                await interaction.reply({ content: `You chose **${userChoice}**, and the bot chose **${randomChoice}**. It's a tie!`, ephemeral: true });
            } else {
                await interaction.reply({ content: `You chose **${userChoice}**, and the bot chose **${randomChoice}**. You win!`, ephemeral: true });
            }
        }
    }
};

const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

// In-memory economy storage
const economy = new Map();

module.exports = {
    name: "economy",
    description: "Economy system with balance, transfer, and earning coins",
    category: "Information",
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     **/ 
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        // Balance Command
        if (subcommand === "bal") {
            const target = interaction.options.getUser("user") || interaction.user;
            const balance = getBalance(target.id);

            if (target.id === interaction.user.id) {
                await interaction.reply({ content: `Your balance is **${balance} coins**.`, ephemeral: true });
            } else {
                await interaction.reply({ content: `${target.username}'s balance is **${balance} coins**.` });
            }
        }

        // Give Coins Command
        if (subcommand === "give") {
            const target = interaction.options.getUser("user");
            const amount = interaction.options.getInteger("amount");
            const senderBalance = getBalance(interaction.user.id);

            if (!target || interaction.user.id === target.id) {
                return await interaction.reply({ content: "You cannot send coins to yourself or an invalid user.", ephemeral: true });
            }

            if (amount <= 0) {
                return await interaction.reply({ content: "The transfer amount must be greater than zero.", ephemeral: true });
            }

            if (senderBalance < amount) {
                return await interaction.reply({ content: "You do not have enough coins to complete this transfer.", ephemeral: true });
            }

            // Transfer coins
            updateBalance(interaction.user.id, -amount);
            updateBalance(target.id, amount);

            await interaction.reply({ content: `You have successfully sent **${amount} coins** to <@${target.id}>.` });
        }

        // Earning Coins Command
        if (subcommand === "earn") {
            const num1 = Math.floor(Math.random() * 50 + 1);
            const num2 = Math.floor(Math.random() * 50 + 1);
            const operations = ["+", "-", "*", "/"];
            const operation = operations[Math.floor(Math.random() * operations.length)];
            let correctAnswer;

            switch (operation) {
                case "+":
                    correctAnswer = num1 + num2;
                    break;
                case "-":
                    correctAnswer = num1 - num2;
                    break;
                case "*":
                    correctAnswer = num1 * num2;
                    break;
                case "/":
                    correctAnswer = parseFloat((num1 / num2).toFixed(2));
                    break;
            }

            const question = `${num1} ${operation} ${num2} = ?`;
            await interaction.reply({ content: `Solve this to earn 100 coins: **${question}**`, ephemeral: true });

            const filter = (message) => message.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

            collector.on("collect", (message) => {
                if (parseFloat(message.content) === correctAnswer) {
                    updateBalance(interaction.user.id, 100);
                    message.reply({ content: "Congrats, you won 100 coins!" });
                    collector.stop();
                } else {
                    message.reply({ content: "Wrong answer! Try again." });
                }
            });

            collector.on("end", (collected, reason) => {
                if (reason === "time") {
                    interaction.followUp({ content: "You ran out of time to answer the question.", ephemeral: true });
                }
            });
        }
    }
};

// Utility functions
function getBalance(userId) {
    if (!economy.has(userId)) {
        economy.set(userId, 1000); // Default balance
    }
    return economy.get(userId);
}

function updateBalance(userId, amount) {
    const currentBalance = getBalance(userId);
    economy.set(userId, currentBalance + amount);
}

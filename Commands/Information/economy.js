const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const economy = new Map(); // In-memory database for storing balances

module.exports = {
    name: "economy",
    description: "Economy system with balance check, transfer, and earning coins",
    category: "Information",
    commands: [
        {
            name: "bal",
            description: "Check your balance or another user's balance",
            /**
             * @param {Client} client
             * @param {ChatInputCommandInteraction} interaction
             **/
            async execute(interaction, client) {
                const target = interaction.options.getUser('user') || interaction.user;
                const balance = getBalance(target.id);

                if (target.id === interaction.user.id) {
                    interaction.reply({ content: `Your balance is **${balance} coins**.`, ephemeral: true });
                } else {
                    interaction.reply({ content: `${target.username}'s balance is **${balance} coins**.` });
                }
            }
        },
        {
            name: "give",
            description: "Transfer coins to another user",
            /**
             * @param {Client} client
             * @param {ChatInputCommandInteraction} interaction
             **/
            async execute(interaction, client) {
                const target = interaction.options.getUser('user');
                const amount = interaction.options.getInteger('amount');
                const senderBalance = getBalance(interaction.user.id);

                if (!target || interaction.user.id === target.id) {
                    return interaction.reply({ content: "You cannot send coins to yourself or an invalid user.", ephemeral: true });
                }

                if (amount <= 0) {
                    return interaction.reply({ content: "The transfer amount must be greater than zero.", ephemeral: true });
                }

                if (senderBalance < amount) {
                    return interaction.reply({ content: "You do not have enough coins to complete this transfer.", ephemeral: true });
                }

                // Transfer coins
                updateBalance(interaction.user.id, -amount);
                updateBalance(target.id, amount);

                interaction.reply({ content: `You have successfully sent **${amount} coins** to <@${target.id}>.` });
            }
        },
        {
            name: "earn",
            description: "Earn coins by solving math questions",
            /**
             * @param {Client} client
             * @param {ChatInputCommandInteraction} interaction
             **/
            async execute(interaction, client) {
                const num1 = Math.floor(Math.random() * 50 + 1); // Random number 1-50
                const num2 = Math.floor(Math.random() * 50 + 1);
                const operations = ['+', '-', '*', '/'];
                const operation = operations[Math.floor(Math.random() * operations.length)];
                let correctAnswer;

                // Calculate the correct answer based on the operation
                switch (operation) {
                    case '+': correctAnswer = num1 + num2; break;
                    case '-': correctAnswer = num1 - num2; break;
                    case '*': correctAnswer = num1 * num2; break;
                    case '/': correctAnswer = parseFloat((num1 / num2).toFixed(2)); break;
                }

                // Ask the question
                const question = `${num1} ${operation} ${num2} = ?`;
                interaction.reply({ content: `Solve this to earn 100 coins: **${question}**`, ephemeral: true });

                const filter = (message) => message.author.id === interaction.user.id;
                const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

                collector.on('collect', (message) => {
                    if (parseFloat(message.content) === correctAnswer) {
                        updateBalance(interaction.user.id, 100);
                        message.reply({ content: "Congrats, you won 100 coins!" });
                        collector.stop();
                    } else {
                        message.reply({ content: "Wrong answer! Try again." });
                    }
                });

                collector.on('end', (collected, reason) => {
                    if (reason === 'time') {
                        interaction.followUp({ content: "You ran out of time to answer the question.", ephemeral: true });
                    }
                });
            }
        }
    ]
};

// Utility function to get a user's balance
function getBalance(userId) {
    if (!economy.has(userId)) {
        economy.set(userId, 1000); // Default balance
    }
    return economy.get(userId);
}

// Utility function to update a user's balance
function updateBalance(userId, amount) {
    const currentBalance = getBalance(userId);
    economy.set(userId, currentBalance + amount);
}

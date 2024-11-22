const { Client, ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType, Intents } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const { token, clientId, guildId } = require('./config.json');

// Bot Initialization
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// SQLite Database Initialization
const db = new sqlite3.Database('./economy.db');
db.run(`CREATE TABLE IF NOT EXISTS economy (userId TEXT PRIMARY KEY, balance INTEGER DEFAULT 1000)`);

module.exports = {
    name: "economy",
    description: "Economy system with balance, transfer, and earning coins",
    category: "Economy",
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     **/
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "bal") {
            const target = interaction.options.getUser("user") || interaction.user;
            getBalance(target.id, (balance) => {
                if (target.id === interaction.user.id) {
                    interaction.reply({ content: `Your balance is **${balance} coins**.`, ephemeral: true });
                } else {
                    interaction.reply({ content: `${target.username}'s balance is **${balance} coins**.` });
                }
            });
        }

        if (subcommand === "give") {
            const target = interaction.options.getUser("user");
            const amount = interaction.options.getInteger("amount");

            if (!target || interaction.user.id === target.id) {
                return interaction.reply({ content: "You cannot send coins to yourself or an invalid user.", ephemeral: true });
            }

            if (amount <= 0) {
                return interaction.reply({ content: "The transfer amount must be greater than zero.", ephemeral: true });
            }

            getBalance(interaction.user.id, (senderBalance) => {
                if (senderBalance < amount) {
                    return interaction.reply({ content: "You do not have enough coins to complete this transfer.", ephemeral: true });
                }

                // Transfer coins
                updateBalance(interaction.user.id, -amount);
                updateBalance(target.id, amount);

                interaction.reply({ content: `You have successfully sent **${amount} coins** to <@${target.id}>.` });
            });
        }

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

            collector.on("end", (_, reason) => {
                if (reason === "time") {
                    interaction.followUp({ content: "You ran out of time to answer the question.", ephemeral: true });
                }
            });
        }
    }
};

// Utility Functions
function getBalance(userId, callback) {
    db.get("SELECT balance FROM economy WHERE userId = ?", [userId], (err, row) => {
        if (err) {
            console.error(err);
            return callback(1000); // Default balance if error occurs
        }
        if (row) {
            callback(row.balance);
        } else {
            db.run("INSERT INTO economy (userId, balance) VALUES (?, 1000)", [userId]);
            callback(1000);
        }
    });
}

function updateBalance(userId, amount) {
    getBalance(userId, (currentBalance) => {
        const newBalance = currentBalance + amount;
        db.run("UPDATE economy SET balance = ? WHERE userId = ?", [newBalance, userId]);
    });
}

// Slash Command Registration
client.on("ready", async () => {
    console.log(`${client.user.tag} is online!`);

    const commands = [
        {
            name: "economy",
            description: "Economy system with balance, transfer, and earning coins",
            options: [
                {
                    name: "bal",
                    description: "Check your balance or another user's balance",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "user",
                            description: "The user whose balance you want to check",
                            type: ApplicationCommandOptionType.User,
                            required: false,
                        },
                    ],
                },
                {
                    name: "give",
                    description: "Give coins to another user",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "user",
                            description: "The user to send coins to",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "amount",
                            description: "The amount of coins to send",
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                        },
                    ],
                },
                {
                    name: "earn",
                    description: "Earn coins by solving a math question",
                    type: ApplicationCommandOptionType.Subcommand,
                },
            ],
        },
    ];

    await client.application.commands.set(commands, guildId);
    console.log("Slash commands registered.");
});

// Interaction Handling
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = require("./economy.js");
    if (interaction.commandName === command.name) {
        await command.execute(interaction, client);
    }
});

// Login
client.login(token);


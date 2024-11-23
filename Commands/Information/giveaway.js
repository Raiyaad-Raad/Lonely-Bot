const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
    name: "giveaway",
    description: "Start an interactive giveaway",
    category: "Information",
    /**
    * @param {Client} client
    * @param {ChatInputCommandInteraction} interaction
    **/
    async execute(interaction, client) {
        const filter = (m) => m.author.id === interaction.user.id;

        // Ask for the giveaway duration
        await interaction.reply("⏳ How long should the giveaway last? (e.g., `60s`, `5m`, `1h`)");
        const durationResponse = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000 });
        const durationString = durationResponse.first()?.content;

        if (!durationString) return interaction.followUp("⏳ You didn't provide a duration. Giveaway canceled.");
        const duration = parseDuration(durationString);
        if (!duration) return interaction.followUp("⚠️ Invalid duration format. Giveaway canceled.");

        // Ask for the prize
        await interaction.followUp("🎁 What is the prize?");
        const prizeResponse = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000 });
        const prize = prizeResponse.first()?.content;

        if (!prize) return interaction.followUp("🎁 You didn't provide a prize. Giveaway canceled.");

        // Ask for a description
        await interaction.followUp("📝 Please provide a description for the giveaway (optional).");
        const descriptionResponse = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000 });
        const description = descriptionResponse.first()?.content || "No description provided.";

        // Ask for the number of winners
        await interaction.followUp("🏆 How many winners should be chosen?");
        const winnersResponse = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000 });
        const winnersCount = parseInt(winnersResponse.first()?.content, 10);

        if (isNaN(winnersCount) || winnersCount <= 0) {
            return interaction.followUp("⚠️ Invalid number of winners. Giveaway canceled.");
        }

        // Start the giveaway
        const embed = new EmbedBuilder()
            .setTitle("🎉 Giveaway 🎉")
            .setDescription(`**Prize:** ${prize}\n**Description:** ${description}\nReact with 🎉 to participate!`)
            .setColor(0x00AE86)
            .setFooter({ text: `Ends in ${durationString}! Winners: ${winnersCount}` });

        const giveawayMessage = await interaction.followUp({
            embeds: [embed],
            fetchReply: true,
        });

        await giveawayMessage.react("🎉");

        // Wait for the giveaway to end
        setTimeout(async () => {
            const updatedMessage = await interaction.channel.messages.fetch(giveawayMessage.id);
            const reaction = updatedMessage.reactions.cache.get("🎉");

            if (reaction) {
                const users = await reaction.users.fetch();
                const participants = users.filter((user) => !user.bot);

                if (participants.size >= winnersCount) {
                    const winners = participants.random(winnersCount); // Pick random winners
                    const winnersList = winners.map((user) => user.toString()).join(", ");
                    interaction.channel.send(`🎉 Congratulations to the winners: ${winnersList}! You won **${prize}**!`);
                } else {
                    interaction.channel.send("⚠️ Not enough participants for the giveaway.");
                }
            } else {
                interaction.channel.send("⚠️ No reactions for the giveaway.");
            }
        }, duration);
    },
};

/**
 * Parse duration string (e.g., `60s`, `5m`, `1h`) into milliseconds.
 * @param {string} duration
 * @returns {number|null}
 */
function parseDuration(duration) {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) return null;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case "s": return value * 1000; // seconds to ms
        case "m": return value * 60 * 1000; // minutes to ms
        case "h": return value * 60 * 60 * 1000; // hours to ms
        case "d": return value * 24 * 60 * 60 * 1000; // days to ms
        default: return null;
    }
}

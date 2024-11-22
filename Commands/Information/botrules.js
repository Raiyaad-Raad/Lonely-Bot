const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    name: "rule", // Command name
    description: "Displays the rules for using this bot", // Command description
    category: "info", // Category of the command

    /**
    * @param {Client} client
    * @param {ChatInputCommandInteraction} interaction
    **/
    async execute(interaction, client) {
        // Creating an embed to display the rules
        const embed = new EmbedBuilder()
            .setColor('GREEN') // Set embed color to green
            .setTitle('Bot Rules & General Policies') // Title of the embed
            .setDescription('Here are the general policies and rules for using this bot:')
            .addFields(
                { name: '1. Compliance with Discord\'s Terms of Service', value: 'Ensure the bot complies with Discord\'s Terms of Service and Community Guidelines. Do not engage in activities like spamming, harassment, or collecting data without user consent.' },
                { name: '2. Privacy Policy', value: 'Clearly define how user data is collected, stored, and used. Avoid storing sensitive personal information unless absolutely necessary. Provide users with the option to request deletion of their data.' },
                { name: '3. Functionality Restrictions', value: 'Limit the bot\'s permissions to only what is necessary (e.g., avoid giving it "Administrator" unless critical). Do not create features that can bypass server security, such as mass role edits or user bans without admin review.' },
                { name: '4. Respect User Boundaries', value: 'Ensure your bot only interacts with users when requested or as part of its intended functionality. Avoid unsolicited messaging, tagging, or intrusive notifications.' },
                { name: '5. Transparency', value: 'Offer clear documentation or commands like /help or /about to inform users about the bot\'s purpose, features, and policies. Include version details and update logs for transparency.' },
                { name: '6. Anti-Abuse Measures', value: 'Implement rate limits to prevent spamming commands. Include admin controls to block or restrict users abusing the bot. Add a logging system to track command usage for debugging or resolving disputes.' },
                { name: '7. Content Moderation', value: 'If your bot facilitates user-generated content (e.g., messages, images), ensure moderation features are in place to filter harmful content (profanity, hate speech, etc.). Allow server owners to customize moderation levels.' },
                { name: '8. Support and Reporting', value: 'Provide a clear method for users to report bugs, misuse, or abuse. Regularly monitor these reports and act promptly to resolve issues.' },
                { name: '9. Uptime and Maintenance', value: 'Notify users of planned downtime or maintenance via status messages or announcements. Build automatic recovery systems for unexpected outages if possible.' },
                { name: '10. Licensing and Open Source', value: 'if your bot uses external libraries or code, ensure you comply with their licenses. If your bot is open source, include proper documentation and a license file in your repository.' }
            )
            .setTimestamp(); // Optional: adds a timestamp to the embed

        // Send the embed message as a reply
        await interaction.reply({ embeds: [embed] });
    }
}


const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    name: "rule", // command name here
    description: "Bots rules", // command description here
    category: "Information", // command category here
    /**
    * @param {Client} client
    * @param {ChatInputCommandInteraction} interaction
    **/
    async execute(interaction, client) {
      // code here
        const rules = `
**1. Compliance with Discord's Terms of Service**  
Ensure the bot complies with Discord's Terms of Service and Community Guidelines.  
Do not engage in activities like spamming, harassment, or collecting data without user consent.

**2. Privacy Policy**  
Clearly define how user data is collected, stored, and used.  
Avoid storing sensitive personal information unless absolutely necessary.  
Provide users with the option to request deletion of their data.

**3. Functionality Restrictions**  
Limit the bot's permissions to only what is necessary (e.g., avoid giving it "Administrator" unless critical).  
Do not create features that can bypass server security, such as mass role edits or user bans without admin review.

**4. Respect User Boundaries**  
Ensure your bot only interacts with users when requested or as part of its intended functionality.  
Avoid unsolicited messaging, tagging, or intrusive notifications.

**5. Transparency**  
Offer clear documentation or commands like /help or /about to inform users about the bot's purpose, features, and policies.  
Include version details and update logs for transparency.

**6. Anti-Abuse Measures**  
Implement rate limits to prevent spamming commands.  
Include admin controls to block or restrict users abusing the bot.  
Add a logging system to track command usage for debugging or resolving disputes.

**7. Content Moderation**  
If your bot facilitates user-generated content (e.g., messages, images), ensure moderation features are in place to filter harmful content (profanity, hate speech, etc.).  
Allow server owners to customize moderation levels.

**8. Support and Reporting**  
Provide a clear method for users to report bugs, misuse, or abuse.  
Regularly monitor these reports and act promptly to resolve issues.

**9. Uptime and Maintenance**  
Notify users of planned downtime or maintenance via status messages or announcements.  
Build automatic recovery systems for unexpected outages if possible.

**10. Licensing and Open Source**  
If your bot uses external libraries or code, ensure you comply with their licenses.  
If your bot is open source, include proper documentation and a license file in your repository.
        `;

        await interaction.reply(rules);
    }
}

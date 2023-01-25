const { ActivityType } = require('discord.js')
const config = require("../../config.js")
module.exports = {
    name: "ready",
    once: "true",
    async execute(client) {
        if(config.Maintenece === true) {
            client.user.setActivity({
                name: "Im Currenty In Maintenece! Please Use Me Later! :<",
                type: ActivityType.Watching
            });
            client.user.setStatus('dnd')
            console.log("Maintenece Mode Enabled")            
        } else {
            client.user.setActivity({
              name: "Broken Angel",
              type: ActivityType.Listening
            })
            client.user.setStatus('idle')
            console.log("Ready To Go.")
        }
    }
}
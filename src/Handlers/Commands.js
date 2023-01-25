const { Client } = require('discord.js')

/**
* @param { Client } client
 */

module.exports = async (client, PG, Ascii, ms) => {

  const Table = new Ascii("Commands Loaded")
  
  let CommandsArray = [];

  const commandFiles = await PG(`${process.cwd()}/Commands/*/*.js`)

  commandFiles.map(async (file) => {

    const command = require(file)

    if(!command.name) return Tabel.addRow(file.split("/")[7], "Failed", "Command Name Not Found")
    if(!command.contex && !command.description) return Table.addRow(command.name, "Failed" ,"Mission Description")   

    client.commands.set(command.name, command)
    CommandsArray.push(command)

    await Table.addRow(command.name, "Success")
    
  })

  console.log(Table.toString())

  client.on('ready', () => {

    setInterval(() => {

      client.guilds.cache.forEach(guild => {

        guild.commands.set(CommandsArray)
        
      }, ms('5s'))
      
    })
    
  })
}
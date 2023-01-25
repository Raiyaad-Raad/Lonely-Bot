const { Events } = require("../Validation/EventNames.js")

module.exports = async (client, PG, Ascii, ms) => {

  const Table = new Ascii("Events Loaded")

  const EventFiles = await PG(`${process.cwd()}/Events/*/*.js`)

  const EventsArray = []

  EventFiles.map(async file => {

    const event = require(file)

    if(!Events.includes(event.name) || !event.name) (

    await Table.addRow(`${event.name || "MISSING"}`, `Event name is either invalid or missing`)
      
    )

    if (event.once) client.once(event.name, (...args) => event.execute(...args, client))
    if (!event.once) client.on(event.name, (...args) => event.execute(...args, client))    

  await Table.addRow(event.name, "SUCCESSFUL")
    client.events.set(event.name, event)
    EventsArray.push(event)
    
  })

  console.log(Table.toString())
  
}
import * as Discord from 'discord.js'
import * as fs from 'fs'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default async function eventsHandler (client: Discord.Client<true>) {

  client.removeAllListeners()

  const eventDirectories = fs.readdirSync('./build/events')
  const eventArray: Types.EventFile<keyof Discord.ClientEvents>[] = []


  // Loops over event directories and listens to their events.

  for (const eventDirectory of eventDirectories) {

    const eventFiles = fs.readdirSync(`./build/events/${eventDirectory}`).filter((file: string) => file.endsWith('.js'))

    for (const eventFile of eventFiles) {

      const eventData: Types.EventFile<keyof Discord.ClientEvents> = await (await import(`../events/${eventDirectory}/${eventFile}`)).default

      eventArray.push(eventData)

      client.on(eventData.name, async (...data) => {
        eventData.execute(client, ...data).catch((error) => {
          Functions.alertDevs({
            title: 'Event execution failed',
            description: `${error}`,
            type: 'error'
          })
        })
      })

    }

  }


  return eventArray

}
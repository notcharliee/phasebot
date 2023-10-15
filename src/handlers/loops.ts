import * as Discord from 'discord.js'
import * as fs from 'fs'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default async function loopsHandler (client: Discord.Client<true>) {

  const loopDirectories = fs.readdirSync('./build/loops')
  const loopArray: Types.LoopFile[] = []


  // Loops over loop directories and starts an interval.

  for (const loopDirectory of loopDirectories) {

    const loopFiles = fs.readdirSync(`./build/loops/${loopDirectory}`).filter((file: string) => file.endsWith('.js'))

    for (const eventFile of loopFiles) {

      const loopData: Types.LoopFile = await (await import(`../loops/${loopDirectory}/${eventFile}`)).default

      loopArray.push(loopData)

      setInterval(() => { loopData.execute(client).catch((error) => {
        Functions.alertDevs({
          title: 'Event execution failed',
          description: `${error}`,
          type: 'error'
        })
      })}, loopData.interval)

    }

  }


  return loopArray

}
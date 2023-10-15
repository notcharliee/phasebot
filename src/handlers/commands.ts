import * as Discord from 'discord.js'
import * as fs from 'fs'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default async function commandsHandler (client: Discord.Client<true>) {

  const directories = fs.readdirSync('./build/commands')
  const commandFileArray: Types.SlashCommand[] = []


  // Loops over command files and pushes them to the client.

  for (const directory of directories) {
    const files = fs.readdirSync(`./build/commands/${directory}`).filter((file: string) => file.endsWith('.js'))

    for (const file of files) {
      const clientCommandFile: Types.SlashCommand = await (await import(`../commands/${directory}/${file}`)).default

      if (commandFileArray.find((command) => { command.data.name == clientCommandFile.data.name })) Functions.alertDevs({
        title: 'Duplicate command detected',
        description: `Found multiple \`/${clientCommandFile.data.name}\` command files.`,
        type: 'error',
      })

      commandFileArray.push(clientCommandFile)
    }
  }


  // Checks for command data file to see if any command structure has changed.
  // If structure has changed, update commands in bot, else return command file array.

  const commandFileDataString = JSON.stringify(commandFileArray.map(commandFile => commandFile.data))
  const commandFileDataPath = './temp/commands.json'

  if (!fs.existsSync('./temp')) fs.mkdirSync('./temp')

  if (fs.existsSync(commandFileDataPath) && fs.readFileSync(commandFileDataPath).toString() == commandFileDataString) return commandFileArray
  else fs.writeFileSync(commandFileDataPath, commandFileDataString)
  
  client.application?.commands.set([])
  client.application?.commands.set(commandFileArray.map((command) => command.data))
  
  return commandFileArray

}
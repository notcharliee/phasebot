import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'

import { commandsArray } from '#client/main'


export default Functions.clientEvent({
  name: 'interactionCreate',
  async execute(client, interaction) {

    if (interaction.isChatInputCommand()) {

      const clientCommandFiles = commandsArray
      const clientCommand = clientCommandFiles.find((clientCommandFile: Types.SlashCommand) => { return clientCommandFile.data.name == interaction.commandName })


      if (clientCommand) {

        if (clientCommand.permissions) {

          const baseCommandPermissions = clientCommand.permissions.baseCommand
          const subCommandsPermissions = Object.entries(clientCommand.permissions.subCommands ?? {})

          if (baseCommandPermissions && !interaction.memberPermissions?.has(baseCommandPermissions)) return Functions.clientError(
            interaction,
            'Access Denied!',
            `${Enums.PhaseError.AccessDenied}\n\n**Missing Permission:**\n\`${Functions.getPermissionName(baseCommandPermissions).replace(/([a-z])([A-Z])/g, '$1 $2')}\``
          )

          if (subCommandsPermissions) for (const subCommandPermissions of subCommandsPermissions) {

            if (interaction.options.getSubcommand() == subCommandPermissions[0] && !interaction.memberPermissions?.has(subCommandPermissions[1])) return Functions.clientError(
              interaction,
              'Access Denied!',
              `${Enums.PhaseError.AccessDenied}\n\n**Missing Permission:**\n\`${Functions.getPermissionName(subCommandPermissions[1]).replace(/([a-z])([A-Z])/g, '$1 $2')}\``
            )

          }

        }

        clientCommand.execute(client, interaction).catch((error: any) => {

          Functions.alertDevs({
            title: `Command Failure: /${clientCommand.data.name}`,
            description: `${error}`,
            type: 'error',
          })
  
          Functions.clientError(
            interaction,
            'Well, this is awkward..',
            Enums.PhaseError.Unknown
          )
  
        })

      }

    }

  }
})
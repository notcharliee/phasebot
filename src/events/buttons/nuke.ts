import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientButtonEvent({
  customId: /nuke\.(proceed|abort)/,
  async execute(client, interaction) {

    const customIdParts = interaction.customId.split('.')
    const nukeAction = customIdParts[1] as 'proceed' | 'abort'

    if (!interaction.channel || interaction.channel.isDMBased()) return

    if (interaction.user.id != interaction.message.interaction?.user.id) Functions.clientError(
      interaction,
      'Access Denied!',
      Enums.PhaseError.AccessDenied
    )

    if (interaction.channel.isThread()) return Functions.clientError(
      interaction,
      'No can do!',
      'This command cannot be used in threads.'
    )

    await interaction.deferUpdate()

    if (nukeAction == 'proceed') {

      if (interaction.channel.isTextBased()) {

        const newChannel = await interaction.channel.clone({ reason: `${interaction.user} ran /nuke` })

        await newChannel.send({
          content: `${interaction.user}`,
          embeds: [
            new Discord.EmbedBuilder()
              .setColor(Enums.PhaseColour.Primary)
              .setDescription(`#${interaction.channel.name} was successfully nuked.`)
              .setTitle(Enums.PhaseEmoji.Success + 'Channel Nuked')
          ]
        })

        await interaction.channel.delete(`${interaction.user} ran /nuke`)

      }

    } else {

      interaction.message.edit({
        components: [
          new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
            .addComponents(
              new Discord.ButtonBuilder()
                .setCustomId(`nuke.proceed`)
                .setDisabled(true)
                .setLabel('Nuke')
                .setStyle(Discord.ButtonStyle.Danger)
            )
            .addComponents(
              new Discord.ButtonBuilder()
                .setCustomId(`nuke.abort`)
                .setDisabled(true)
                .setLabel('Abort')
                .setStyle(Discord.ButtonStyle.Secondary)
            )
        ],
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(Enums.PhaseColour.Primary)
            .setDescription(`Aborted channel nuke. Phew!`)
            .setTitle(Enums.PhaseEmoji.Success + 'Nuke Aborted')
        ],
      })

    }

  }
})
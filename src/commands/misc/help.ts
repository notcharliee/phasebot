import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('help')
    .setDescription('Having trouble? We can help.'),
  async execute(client, interaction) {

    interaction.reply({
      components: [
        new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
          .setComponents(
            new Discord.ButtonBuilder()
              .setLabel('Modules')
              .setStyle(Discord.ButtonStyle.Link)
              .setURL(Enums.PhaseURL.PhaseModules),
            new Discord.ButtonBuilder()
              .setLabel('Commands')
              .setStyle(Discord.ButtonStyle.Link)
              .setURL(Enums.PhaseURL.PhaseCommands),
            new Discord.ButtonBuilder()
              .setLabel('Support')
              .setStyle(Discord.ButtonStyle.Link)
              .setURL(Enums.PhaseURL.PhaseSupport)
          )
      ],
      embeds: [
        new Discord.EmbedBuilder()
          .setColor(Enums.PhaseColour.Primary)
          .setDescription(`Having trouble with Phase? We can help!\n\n**Phase Modules**\n${Enums.PhaseURL.PhaseModules}\n\n**Phase Commands**\n${Enums.PhaseURL.PhaseCommands}\n\n**Phase Support**\n${Enums.PhaseURL.PhaseSupport}`)
          .setTitle('Help is here!')
      ],
    })

  }
})
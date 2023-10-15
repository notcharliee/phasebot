import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('embed')
    .setDescription('Opens the Phase Embed Builder.'),
  async execute(client, interaction) {

    interaction.reply({
      components: [
        new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
          .setComponents(
            new Discord.ButtonBuilder()
              .setCustomId('embedbuilder.author')
              .setLabel('Edit Author')
              .setStyle(Discord.ButtonStyle.Secondary),
            new Discord.ButtonBuilder()
              .setCustomId('embedbuilder.body')
              .setLabel('Edit Body')
              .setStyle(Discord.ButtonStyle.Secondary),
            new Discord.ButtonBuilder()
              .setCustomId('embedbuilder.image')
              .setLabel('Edit Image')
              .setStyle(Discord.ButtonStyle.Secondary),
            new Discord.ButtonBuilder()
              .setCustomId('embedbuilder.footer')
              .setLabel('Edit Footer')
              .setStyle(Discord.ButtonStyle.Secondary),
            new Discord.ButtonBuilder()
              .setCustomId('embedbuilder.send')
              .setLabel('Send Embed')
              .setStyle(Discord.ButtonStyle.Success),
          )
      ],
      embeds: [
        new Discord.EmbedBuilder()
          .setColor(Enums.PhaseColour.Primary)
          .setDescription('Use the buttons below to edit this embed, then hit Send Embed when finished.')
          .setTitle('Embed Builder')
      ],
    })

  }
})
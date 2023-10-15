import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('membercount')
    .setDescription('Displays the server member count.')
    .setDMPermission(false),
  async execute(client, interaction) {

    interaction.reply({
      embeds: [
        new Discord.EmbedBuilder()
          .setColor(Enums.PhaseColour.Primary)
          .setDescription(`This server has ${interaction.guild!.memberCount} total members.`)
          .setThumbnail(interaction.guild!.iconURL())
          .setTitle(interaction.guild!.name)
      ],
    })

  }
})
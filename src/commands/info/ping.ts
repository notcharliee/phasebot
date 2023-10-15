import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('ping')
    .setDescription('Calculates the current bot latency metrics.'),
  async execute(client, interaction) {

    const ping = await interaction.deferReply({ fetchReply: true })

    const commandLatency = ping.createdTimestamp - interaction.createdTimestamp
    const apiLatency = client.ws.ping
    const rebootTimestamp = `<t:${Math.round(client.readyTimestamp / 1000)}:R>`

    interaction.editReply({
      embeds: [
        new Discord.EmbedBuilder()
          .setColor(Enums.PhaseColour.Primary)
          .setDescription(`Command Latency: ${commandLatency}ms\nDiscord API Latency: ${apiLatency}ms\n\nLast Reboot: ${rebootTimestamp}`)
          .setTitle('Pong! 🏓')
      ],
    })

  }
})
import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('echo')
    .setDescription('Echoes the text you give it.')
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('text')
        .setDescription('The text to echo.')
        .setRequired(true)
    ),
  async execute(client, interaction) {

    interaction.reply(interaction.options.getString('text', true))

  }
})
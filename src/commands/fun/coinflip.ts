import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flips a coin.'),
  async execute(client, interaction) {

    interaction.reply(["It's **Tails**!", "It's **Heads**!"][Math.floor(Math.random() * 2)])

  }
})
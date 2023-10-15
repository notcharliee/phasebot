import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('afk')
    .setDescription('Set your AFK status.')
    .setDMPermission(false)
    .addStringOption(
      new Discord.SlashCommandStringOption()
      .setName('reason')
      .setDescription('Give a reason for going AFK.')
      .setRequired(false)
    ),
  async execute(client, interaction) {
    
    const reason = interaction.options.getString('reason', false) ?? 'No reason set.'

    const AFKsSchema = await Database.AFKs.findOne({ guild: interaction.guildId, user: interaction.user.id })

    if (AFKsSchema) {

      AFKsSchema.reason = reason

      await AFKsSchema.save()

    } else await new Database.AFKs({
      guild: interaction.guildId,
      user: interaction.user.id,
      reason 
    }).save()

    interaction.reply({
      embeds: [
        new Discord.EmbedBuilder()
        .setColor(Enums.PhaseColour.Primary)
        .setDescription(reason)
        .setTitle(Enums.PhaseEmoji.Success + 'Updated your AFK status')
      ],
    })
    
  }
})
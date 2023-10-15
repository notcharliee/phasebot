import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('lock')
    .setDescription('Locks and unlocks a channel.')
    .setDMPermission(false)
    .addBooleanOption(
      new Discord.SlashCommandBooleanOption()
        .setName('state')
        .setDescription('The state of the channel lock.')
        .setRequired(true)
    )
    .addRoleOption(
      new Discord.SlashCommandRoleOption()
        .setName('role')
        .setDescription('Specify a role to lock access for (defaults to @everyone).')
        .setRequired(false)
    ),
  permissions: {
    baseCommand: Discord.PermissionFlagsBits.ModerateMembers,
  },
  async execute(client, interaction) {

    const channel = interaction.channel as Discord.GuildChannel
    const state = interaction.options.getBoolean('state', true)
    const role = interaction.options.getRole('role', false)

    if (channel.isThread()) return Functions.clientError(
      interaction,
      'No can do!',
      'This command cannot be used in threads.'
    )

    if (state) {

      if (channel.isTextBased()) channel.permissionOverwrites.edit(role?.id ?? interaction.guildId!, { SendMessages: false })
      if (channel.isVoiceBased()) channel.permissionOverwrites.edit(role?.id ?? interaction.guildId!, { Speak: false })

      interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(Enums.PhaseColour.Primary)
            .setDescription(`Channel has been locked for ${role ?? '@everyone'}.`)
            .setTitle(Enums.PhaseEmoji.Locked + 'Channel Locked')
        ],
      })

    } else {

      if (channel.isTextBased()) channel.permissionOverwrites.edit(role?.id ?? interaction.guildId!, { SendMessages: true })
      if (channel.isVoiceBased()) channel.permissionOverwrites.edit(role?.id ?? interaction.guildId!, { Speak: true })

      interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(Enums.PhaseColour.Primary)
            .setDescription(`Channel has been unlocked for ${role ?? '@everyone'}.`)
            .setTitle(Enums.PhaseEmoji.Lock + 'Channel Unlocked')
        ],
      })

    }

  }
})
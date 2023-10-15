import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('announce')
    .setDescription('Sends an announcement-style message as Phase.')
    .setDMPermission(false)
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('message')
        .setDescription('The announcement message.')
        .setMaxLength(4000)
        .setRequired(true)
    )
    .addRoleOption(
      new Discord.SlashCommandRoleOption()
        .setName('mention')
        .setDescription('What role to ping.')
        .setRequired(false)
    ),
  permissions: {
    baseCommand: Discord.PermissionFlagsBits.MentionEveryone,
  },
  async execute(client, interaction) {

    const author = interaction.member as Discord.GuildMember

    try {

      await interaction.channel?.send({
        embeds: [
          new Discord.EmbedBuilder()
            .setAuthor({ iconURL: author.displayAvatarURL(), name: author.displayName })
            .setColor(Enums.PhaseColour.Primary)
            .setDescription(interaction.options.getString('message', true))
            .setTimestamp()
        ],
      })

      interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(Enums.PhaseColour.Primary)
            .setDescription('Announcement was created successfully.')
            .setTitle(Enums.PhaseEmoji.Success + 'Announcement Sent')
        ],
        ephemeral: true,
      })

    } catch (error) {

      Functions.alertDevs({
        title: `Command Failure: /${this.data.name}`,
        description: `${error}`,
        type: 'warning'
      })

      Functions.clientError(
        interaction,
        'Well, this is awkward..',
        Enums.PhaseError.Unknown
      )

    }

  }
})
import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Displays a member\'s avatar.')
    .setDMPermission(false)
    .addUserOption(
      new Discord.SlashCommandUserOption()
        .setName('member')
        .setDescription('The member you want to select.')
        .setRequired(true)
    ),
  async execute(client, interaction) {

    const member = interaction.options.getMember('member') as Discord.GuildMember || null

    if (!member) return Functions.clientError(
      interaction,
      'No can do!',
      Enums.PhaseError.MemberNotFound
    )


    interaction.reply({
      embeds: [
        new Discord.EmbedBuilder()
          .setColor(Enums.PhaseColour.Primary)
          .setTitle(`${member.displayName}'s avatar`)
          .setImage(member.displayAvatarURL({ size: 4096 }))
      ],
    })

  }
})
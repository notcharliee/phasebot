import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('whois')
    .setDescription('Displays member data in an embed.')
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


    const keyPermissionsArray = Constants.keyPermissionsArray

    const memberPermissions = member.permissions.serialize(true) // @ts-ignore
    const permissionsArray = keyPermissionsArray.filter(permission => memberPermissions[permission])


    interaction.reply({
      embeds: [
        new Discord.EmbedBuilder()
          .setAuthor({
            iconURL: member.displayAvatarURL(),
            name: member.displayName
          })
          .setColor(Enums.PhaseColour.Primary)
          .setDescription(`${member}`)
          .setFields([
            {
              inline: true,
              name: 'Joined',
              value: member.joinedAt ? Functions.formatDate(member.joinedAt) : 'Unknown',
            },
            {
              inline: true,
              name: 'Registered',
              value: Functions.formatDate(member.user.createdAt),
            },
            {
              inline: false,
              name: `Roles [${member.roles.cache.size - 1}]`,
              value: member.roles.cache
                .sort((roleA, roleB) => { return roleB.position - roleA.position })
                .map(role => { return `${role.name != '@everyone' ? role : ''}` })
                .toString()
                .replaceAll(',', ' '),
            },
            {
              inline: false,
              name: `Key Permissions [${permissionsArray.length}]`,
              value: permissionsArray.length
                ? permissionsArray.map(permission => { return permission.replace(/([a-z])([A-Z])/g, '$1 $2') }).toString().replaceAll(',', ', ')
                : 'None',
            },
          ])
          .setFooter({
            text: `ID: ${member.id}`
          })
          .setThumbnail(member.displayAvatarURL())
          .setTimestamp()
      ],
    })

  }
})
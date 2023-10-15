import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientEvent({
  name: 'guildMemberRemove',
  async execute(client, member) {
    
    const auditLogsSchema = await Database.AuditLogs.findOne({ guild: member.guild.id })
    if (!auditLogsSchema) return
    
    const channelId = auditLogsSchema.channel

    const channel = client.channels.cache.get(channelId) as Discord.GuildTextBasedChannel | undefined

    return channel?.send({
      embeds: [
        new Discord.EmbedBuilder()
        .setAuthor({ iconURL: member.displayAvatarURL(), name: member.displayName })
        .setColor(Enums.PhaseColour.Primary)
        .setDescription(`User: ${member}\nJoined: ${member.joinedAt ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:R>` : '`Unknown`'}`)
        .setFooter({ text: `ID: ${member.id}` })
        .setTitle('Member Left')
      ],
    })
    
  }
})
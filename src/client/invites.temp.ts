/**
 * 
 *  THIS IS A TEMPORARY FILE
 * 
 *  This file will be removed with a future update.
 *  Do not build upon file in any commits as it will be deleted later on.
 * 
 */

import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'

import invitesTracker from '@androz2091/discord-invites-tracker'


export default async (client: Discord.Client<true>) => {
    
    const tracker = invitesTracker.init(client, {
      fetchGuilds: true,
      fetchVanity: true,
      fetchAuditLogs: true
    })

    tracker.on('guildMemberAdd', async (member, type, invite) => {

        if (!member || !type || !invite || !invite.inviter) return

        const auditLogsSchema = await Database.AuditLogs.findOne({ guild: member.guild.id })
        if (!auditLogsSchema) return
        
        const channelId = auditLogsSchema.channel
    
        const channel = client.channels.cache.get(channelId) as Discord.GuildTextBasedChannel | undefined

        if(type == 'permissions' || type == 'unknown' || !channel || !channel.isTextBased()) return

        channel.send({
          embeds: [
            new Discord.EmbedBuilder()
            .setAuthor({ iconURL: member.displayAvatarURL(), name: member.displayName })
            .setColor(Enums.PhaseColour.Primary)
            .setDescription(`User: ${member}\nInviter: ${invite.inviter}\nCode: \`${invite.code}\`\nUses: \`${invite.uses}\``)
            .setFooter({ text: `ID: ${member.id}` })
            .setTitle('Member Joined')
          ],
        })

    })

}
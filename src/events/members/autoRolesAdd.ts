import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientEvent({
  name: 'guildMemberAdd',
  async execute(client, member) {

    if (member.guild.features.includes(Discord.GuildFeature.MemberVerificationGateEnabled)) return
    
    const autoRolesSchema = await Database.AutoRoles.findOne({ guild: member.guild.id })
    if (!autoRolesSchema) return

    for (const role of autoRolesSchema.roles) {

      if (member.guild.roles.cache.get(role)) member.roles.add(role)
      .catch(() => { return })

    }
    
  }
})
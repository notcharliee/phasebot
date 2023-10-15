import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientEvent({
  name: 'guildMemberUpdate',
  async execute(client, oldMember, newMember) {

    if (
      !oldMember.pending ||
      !oldMember.pending && !newMember.pending ||
      !newMember.guild.features.includes(Discord.GuildFeature.MemberVerificationGateEnabled)
    ) return
    
    const autoRolesSchema = await Database.AutoRoles.findOne({ guild: newMember.guild.id })
    if (!autoRolesSchema) return

    for (const role of autoRolesSchema.roles) {

      if (newMember.guild.roles.cache.get(role)) newMember.roles.add(role)
      .catch(() => { return })

    }
    
  }
})
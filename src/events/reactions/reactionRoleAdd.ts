import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientEvent({
  name: 'messageReactionAdd',
  async execute(client, reaction, user) {
    
    if (user.bot) return

    if (!reaction.message.guild || !reaction.message.guild.members) return

    const reactionRolesSchema = await Database.ReactionRoles.findOne({ message: reaction.message.id })
    if (!reactionRolesSchema) return

    for (const item of reactionRolesSchema.reactions) {
        
      if (item.emoji != reaction.emoji.id && item.emoji != reaction.emoji.name) continue

      const role = reaction.message.guild.roles.cache.get(item.role)
      const member = reaction.message.guild.members.cache.get(user.id)

      if (role && role.editable && member) member.roles.add(role, 'Used Phase Reaction Role')

    }
    
  }
})
import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientEvent({
  name: 'ready',
  async execute(client) {

    cacheMessages()
    
    async function cacheMessages() {
      const reactionRolesSchemas = await Database.ReactionRoles.find()
      
      for (const schema of reactionRolesSchemas) {

        const { guild, channel, message } = schema

        const fetchedChannel = client.channels.cache.get(`${channel}`)
        if (!fetchedChannel || !fetchedChannel.isTextBased()) return Database.ReactionRoles.deleteOne({ channel, guild, message })

        const fetchedMessage = await fetchedChannel.messages.fetch(`${message}`).catch(() => {return})
        if (!fetchedMessage) return Database.ReactionRoles.deleteOne({ channel, guild, message })

      }
    }
    
  }
})
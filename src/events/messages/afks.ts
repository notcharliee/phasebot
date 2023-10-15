import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientEvent({
  name: 'messageCreate',
  async execute(client, message) {
    
    if (!client.user) return
    if (!message.guild) return

    const AFKsSchema = await Database.AFKs.findOne({ guild: message.guildId, user: message.author.id })

    if (AFKsSchema) {

      await AFKsSchema.deleteOne()

      message.reply({
        embeds: [
          new Discord.EmbedBuilder()
          .setColor(Enums.PhaseColour.Primary)
          .setDescription('Your AFK status has been updated to **false**.')
          .setTitle('AFK Status Changed')
        ],
      })

    } else {

      const mentionedMembers = message.mentions.users.map(usr => usr.id)

      if (!mentionedMembers) return

      for (const mentionedMember of mentionedMembers) {

        const mentionSchema = await Database.AFKs.findOne({ guild: message.guild.id, user: mentionedMember })
        const memberName = await message.guild.members.fetch(mentionedMember)

        if (mentionSchema) message.reply({
          embeds: [
            new Discord.EmbedBuilder()
            .setColor(Enums.PhaseColour.Primary)
            .setDescription(mentionSchema.reason)
            .setTitle(`${memberName.displayName} is currently AFK`)
          ],
        })

      }

    }
    
  }
})
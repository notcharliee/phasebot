import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientModalEvent({
  customId: /autopartner\.advert/,
  fromMessage: false,
  async execute(client, interaction) {

    // Returns error if advert includes major server pings.

    const advertText = interaction.fields.getTextInputValue('autopartner.advert.text')

    if (advertText.includes('@everyone') || advertText.includes('@here')) return Functions.clientError(
      interaction,
      'No can do!',
      'Adverts cannot include @everyone or @here pings.'
    )


    // Finds and updates the server advert schema, returns error if no schema.

    const guildPartnerSchema = await Database.AutoPartners.findOne({ guild: interaction.guildId })

    if (!guildPartnerSchema) return Functions.clientError(
      interaction,
      'Well, this is awkward..',
      Enums.PhaseError.Unknown
    ), console.log(interaction.guildId)

    guildPartnerSchema.advert = advertText
    await guildPartnerSchema.save()


    // Sends advert update confirmation message.

    interaction.reply({
      embeds: [
        new Discord.EmbedBuilder()
        .setColor(Enums.PhaseColour.Primary)
        .setDescription(`Auto-Partner advert has been set to the following:\n\n\`\`\`${guildPartnerSchema.advert}\`\`\``)
        .setTitle(Enums.PhaseEmoji.Success + 'Advert Updated')
      ],
    })


    // Loops over partner list and edits the messages (has 1 second delay between edits to avoid rate limits).

    for (const partner of guildPartnerSchema.partners) {

      setTimeout(() => {
        const partnerChannel = client.channels.cache.get(partner.channelId) as Discord.TextChannel | undefined
        const partnerMessage = partnerChannel?.messages.fetch(partner.messageId)

        partnerMessage?.then(message => message.edit(advertText)).catch(() => { return })
      }, 1000)

    }

  }
})
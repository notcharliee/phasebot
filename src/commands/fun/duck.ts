import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('duck')
    .setDescription('Finds a random picture of a duck.'),
  async execute(client, interaction) {

    await interaction.deferReply()

    const apiResponse = await fetch('https://random-d.uk/api/random')
    const apiJsonResponse: ApiJsonResponse = await apiResponse.json()

    if (apiResponse.ok) {

      const apiHostname = new URL(apiResponse.url).hostname
      const apiImageUrl = apiJsonResponse.url

      interaction.editReply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(Enums.PhaseColour.Primary)
            .setFooter({ text: `https://${apiHostname}` })
            .setImage(apiImageUrl)
            .setTitle('Quack!')
        ]
      })

    } else {

      Functions.alertDevs({
        title: `Command Failure: /${this.data.name}`,
        description: `**Error ${apiResponse.status}**\n${apiResponse.statusText}\n\n**Interaction Data**\nGuild: \`${interaction.guildId}\`\nUser: \`${interaction.user}\``,
        type: 'warning'
      })

      Functions.clientError<true>(
        interaction,
        'Well, this is awkward..',
        Enums.PhaseError.Unknown
      )

    }

  }
})


type ApiJsonResponse = {
  message: string,
  url: string,
}
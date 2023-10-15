import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('purge')
    .setDescription('Purges up to 100 messages from the channel at a time.')
    .setDMPermission(false)
    .addIntegerOption(
      new Discord.SlashCommandIntegerOption()
        .setName('amount')
        .setDescription('The number of messages to purge.')
        .setMaxValue(100)
        .setMinValue(1)
        .setRequired(true)
    )
    .addUserOption(
      new Discord.SlashCommandUserOption()
        .setName('author')
        .setDescription('The author of the messages.')
        .setRequired(false)
    ),
  permissions: {
    baseCommand: Discord.PermissionFlagsBits.ManageMessages,
  },
  async execute(client, interaction) {

    const amount = interaction.options.getInteger('amount', true)
    const author = interaction.options.getUser('author', false)

    const channel = interaction.channel as Discord.GuildTextBasedChannel

    let fetchedMessages = await channel.messages.fetch({ limit: amount })
    if (author) fetchedMessages = fetchedMessages.filter((message) => { return message.author.id == author!.id })

    const deletedMessages = await channel.bulkDelete(fetchedMessages, true)

    if (!deletedMessages.size) return Functions.clientError(
      interaction,
      'No can do!',
      'No messages were found.'
    )

    interaction.reply({
      embeds: [
        new Discord.EmbedBuilder()
          .setColor(Enums.PhaseColour.Primary)
          .setDescription(`Purged **${deletedMessages.size}** messages in total` + `${author ? ` sent by ${author}` : '.'}`)
          .setTitle(Enums.PhaseEmoji.Success + 'Purge Successful')
      ],
    })

  }
})
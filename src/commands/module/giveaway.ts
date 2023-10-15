import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('giveaway')
    .setDMPermission(false)
    .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
      .setName('create')
      .setDescription('Creates a new giveaway.')
      .addStringOption(
        new Discord.SlashCommandStringOption()
        .setName('prize')
        .setDescription('What the winner will get.')
        .setRequired(true)
        .setMaxLength(200)
      )
      .addIntegerOption(
        new Discord.SlashCommandIntegerOption()
        .setName('winners')
        .setDescription('How many members will win.')
        .setRequired(true)
        .setMaxValue(15)
      )
      .addStringOption(
        new Discord.SlashCommandStringOption()
        .setName('duration')
        .setDescription('How long the giveaway will last.')
        .setRequired(true)
        .addChoices(
          {
            name: '1m',
            value: `${1000 * 60 * 1}`,
          },
          {
            name: '15m',
            value: `${1000 * 60 * 15}`,
          },
          {
            name: '30m',
            value: `${1000 * 60 * 30}`,
          },
          {
            name: '1h',
            value: `${1000 * 60 * 60 * 1}`,
          },
          {
            name: '6h',
            value: `${1000 * 60 * 60 * 6}`,
          },
          {
            name: '12h',
            value: `${1000 * 60 * 60 * 12}`,
          },
          {
            name: '1d',
            value: `${1000 * 60 * 60 * 24 * 1}`,
          },
          {
            name: '7d',
            value: `${1000 * 60 * 60 * 24 * 7}`,
          },
        )
      )
    )
    .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
      .setName('delete')
      .setDescription('Deletes a giveaway.')
      .addStringOption(
        new Discord.SlashCommandStringOption()
        .setName('id')
        .setDescription('The ID of the giveaway.')
        .setRequired(true)
        .setMaxLength(200)
      )
    )
    .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
      .setName('reroll')
      .setDescription('Randomly rerolls a giveaway.')
      .addStringOption(
        new Discord.SlashCommandStringOption()
        .setName('id')
        .setDescription('The ID of the giveaway.')
        .setRequired(true)
      )
      .addIntegerOption(
        new Discord.SlashCommandIntegerOption()
        .setName('amount')
        .setDescription('How many winners you want to reroll.')
        .setRequired(false)
      )
    ),
  permissions: {
    baseCommand: Discord.PermissionFlagsBits.ManageGuild
  },
  async execute(client, interaction) {
    
    switch (interaction.options.getSubcommand()) {

      case 'create': {

        await interaction.deferReply({
          ephemeral: true,
        })

        const prize = interaction.options.getString('prize', true)
        const winners = interaction.options.getInteger('winners', true)
        const duration = interaction.options.getString('duration', true)

        const created = Date.now()
        const expires = new Date(created + Number(duration)).getTime()
        const host = interaction.member as Discord.GuildMember

        const giveawayMessage = await interaction.channel!.send({
          embeds: [
            new Discord.EmbedBuilder()
            .setAuthor({ iconURL: host.displayAvatarURL(), name: `Hosted by ${host.displayName}` })
            .setColor(Enums.PhaseColour.Primary)
            .setDescription(`React with ${Enums.PhaseEmoji.Tada} to enter!\nGiveaway ends: <t:${Math.floor(expires / 1000)}:R>`)
            .setFooter({ text: `ID: ${created}` })
            .setTitle(`${prize}`)
          ],
        })

        await giveawayMessage.react(Enums.PhaseEmoji.Tada)

        await new Database.Giveaways({
          guild: interaction.guildId,
          message: giveawayMessage.id,
          channel: interaction.channelId,
          created,
          host: host.id,
          entries: [],
          winners,
          prize,
          expires,
          duration,
          expired: false,
        }).save()

        interaction.editReply({
          embeds: [
            new Discord.EmbedBuilder()
            .setColor(Enums.PhaseColour.Primary)
            .setDescription(`**Prize:** ${prize}\n**Winners:** ${winners}\n**Duration:** <t:${Math.floor(expires / 1000)}:R>`)
            .setTitle(Enums.PhaseEmoji.Success + 'Giveaway Created')
          ]
        })

      } break



      case 'delete': {

        await interaction.deferReply({
          ephemeral: true,
        })

        const id = interaction.options.getString('id', true)

        const giveawaySchema = await Database.Giveaways.findOne({ guild: interaction.guildId, created: id })

        if (!giveawaySchema) return Functions.clientError<true>(
          interaction,
          'No can do!',
          `Giveaway not found! Make sure you have the correct ID and try again.`,
          true,
        )

        const giveawayChannel = client.channels.cache.get(giveawaySchema.channel) as Discord.GuildTextBasedChannel | undefined

        try {

          const giveawayMessage = await giveawayChannel?.messages.fetch(giveawaySchema.message)

          await giveawayMessage?.delete()
          await giveawaySchema.deleteOne()

          interaction.editReply({
            embeds: [
              new Discord.EmbedBuilder()
              .setColor(Enums.PhaseColour.Primary)
              .setDescription(`Giveaway with ID of \`${id}\` has been deleted.`)
              .setTitle(Enums.PhaseEmoji.Success + 'Giveaway Deleted')
            ]
          })

        } catch {

          return Functions.clientError<true>(
            interaction,
            'No can do!',
            `Failed to delete giveaway message. Make sure both the message and channel still exist, and that Phase has access to them, then try again.`,
            true,
          )

        }

      } break



      case 'reroll': {

        await interaction.deferReply({
          ephemeral: true,
        })

        const id = interaction.options.getString('id', true)
        const amount = interaction.options.getInteger('amount', false)

        const giveawaySchema = await Database.Giveaways.findOne({ guild: interaction.guildId, created: id, expired: true })

        if (!giveawaySchema) return Functions.clientError<true>(
          interaction,
          'No can do!',
          `No expired giveaway was found. Make sure you have the correct ID and try again.`,
          true,
        )

        const giveawayChannel = client.channels.cache.get(giveawaySchema.channel) as Discord.GuildTextBasedChannel | undefined

        if (!giveawayChannel) {

          await giveawaySchema.deleteOne()

          return Functions.clientError<true>(
            interaction,
            'No can do!',
            `No expired giveaway was found. Make sure you have the correct ID and try again.`,
            true,
          )

        }

        try {

          const giveawayMessage = await giveawayChannel.messages.fetch(giveawaySchema.message)
          const giveawayHost = await giveawayChannel.guild.members.fetch(giveawaySchema.host)

          const giveawayWinners = giveawaySchema.winners
          const giveawayRerollAmount = amount ?? giveawayWinners

          if (giveawayRerollAmount > giveawayWinners) return Functions.clientError<true>(
            interaction,
            'No can do!',
            `Reroll amount cannot be bigger than number of giveaway max winners (${giveawayWinners}).`,
            true,
          )
  
          const giveawayReaction = giveawayMessage.reactions.cache.get(Enums.PhaseEmoji.Tada.split(':')[2].replace('>', ''))
  
          if (!giveawayReaction) {
            await giveawayMessage.delete()
            await giveawaySchema.deleteOne()
  
            return Functions.clientError<true>(
              interaction,
              'No can do!',
              `Giveaway not found! Make sure you have the correct ID and try again.`,
              true,
            )
          }
  
          const giveawayEntries = (await giveawayReaction.users.fetch()).map(user => user)
  
          giveawayEntries.splice(giveawayEntries.findIndex(user => user.id == client.user.id), 1)
  
          if (!giveawayEntries.length) return Functions.clientError<true>(
            interaction,
            'No can do!',
            `Make sure at least 1 member has entered then try again.`,
            true,
          )

          const giveawayNewWinners = Functions.getRandomArrayElements(giveawayEntries, giveawayRerollAmount)
  
          giveawayMessage.reply({
            content: giveawayNewWinners.join(''),
            embeds: [
              new Discord.EmbedBuilder()
              .setAuthor({ iconURL: giveawayHost.displayAvatarURL(), name: `Hosted by ${giveawayHost.displayName}` })
              .setColor(Enums.PhaseColour.Primary)
              .setDescription(`Congratulations, you have won the giveaway!`)
            ],
          })

          interaction.editReply({
            embeds: [
              new Discord.EmbedBuilder()
              .setColor(Enums.PhaseColour.Primary)
              .setDescription(`New Winners: ${giveawayNewWinners.join('')}`)
              .setTitle(Enums.PhaseEmoji.Success + 'Rerolled Giveaway')
            ],
          })
  
        } catch {
  
          await giveawaySchema.deleteOne()

          return Functions.clientError<true>(
            interaction,
            'No can do!',
            `No expired giveaway was found. Make sure you have the correct ID and try again.`,
            true,
          )
  
        }

      } break

    }
    
  }
})
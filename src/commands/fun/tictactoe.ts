import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('tictactoe')
    .setDescription('Play tic-tac-toe against another user.')
    .setDMPermission(false)
    .addUserOption(
      new Discord.SlashCommandUserOption()
        .setName('member')
        .setDescription('The member you want to select.')
        .setRequired(true)
    ),
  async execute(client, interaction) {

    const member = interaction.options.getMember('member') as Discord.GuildMember || null

    if (!member) return Functions.clientError(
      interaction,
      'No can do!',
      Enums.PhaseError.MemberNotFound
    )


    const message = await interaction.reply({
      components: [
        new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
        .addComponents(
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.1')
          .setLabel(Enums.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.2')
          .setLabel(Enums.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.3')
          .setLabel(Enums.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
        ),
        new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
        .addComponents(
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.4')
          .setLabel(Enums.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.5')
          .setLabel(Enums.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.6')
          .setLabel(Enums.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
        ),
        new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
        .addComponents(
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.7')
          .setLabel(Enums.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.8')
          .setLabel(Enums.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
          .setCustomId('tictactoe.9')
          .setLabel(Enums.PhaseEmoji.ZeroWidthJoiner)
          .setStyle(Discord.ButtonStyle.Secondary),
        ),
      ],
      embeds: [
        new Discord.EmbedBuilder()
        .setColor(Enums.PhaseColour.Primary)
        .setDescription(`${member} it's your go. Make a move!`)
        .setTitle('TicTacToe')
      ],
      fetchReply: true,
    })


    await new Database.Games({
      guild: interaction.guildId,
      message: message.id,
      type: 'TICTACTOE',
      participants: [ interaction.user.id, member ],
      gameData: {
        currentTurn: {
          marker: Enums.PhaseEmoji.Cross,
          participant: member.id,
        },
        moves: [
          Enums.PhaseEmoji.ZeroWidthJoiner, Enums.PhaseEmoji.ZeroWidthJoiner, Enums.PhaseEmoji.ZeroWidthJoiner,
          Enums.PhaseEmoji.ZeroWidthJoiner, Enums.PhaseEmoji.ZeroWidthJoiner, Enums.PhaseEmoji.ZeroWidthJoiner,
          Enums.PhaseEmoji.ZeroWidthJoiner, Enums.PhaseEmoji.ZeroWidthJoiner, Enums.PhaseEmoji.ZeroWidthJoiner,
        ],
      }
    }).save()

  }
})
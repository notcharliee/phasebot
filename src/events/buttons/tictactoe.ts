import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientButtonEvent({
  customId: /tictactoe\.\d/,
  async execute(client, interaction) {

    const buttonIndex = Number(interaction.customId.split('.')[1]) - 1
    const gameSchema = await Database.Games.findOne({ message: interaction.message.id, type: Enums.GameType.TicTacToe })


    // If no schema, return unknown error.

    if (!gameSchema) return Functions.clientError(
      interaction,
      'Well, this is awkward..',
      Enums.PhaseError.Unknown,
      true,
    )

    
    // If user is not in game, return access denied error.

    if (!gameSchema.participants.includes(interaction.user.id)) return Functions.clientError(
      interaction,
      'Access Denied!',
      `You are not a member of this game. To start a new game, run \`/tictactoe\`.`,
      true,
    )


    // If user is not current turn, return no can do error.

    const currentTurn = gameSchema.gameData.currentTurn
    const moves = gameSchema.gameData.moves

    if (currentTurn.participant != interaction.user.id) return Functions.clientError(
      interaction,
      'No can do!',
      `Please wait your turn.`,
      true,
    )


    // If move square is already taken, defer update.

    if (moves[buttonIndex] != Enums.PhaseEmoji.ZeroWidthJoiner) return await interaction.deferUpdate()


    // Check if user made a winning move or if game is tied.

    moves[buttonIndex] = currentTurn.marker

    const winningMoves = checkWinner(moves)
    const winner = winningMoves ? currentTurn.participant : null

    const gameTied = moves.every((move) => move != Enums.PhaseEmoji.ZeroWidthJoiner)


    // Update game data.

    if (winner || gameTied) await gameSchema.deleteOne()
    else {
      
      currentTurn.marker = currentTurn.marker == Enums.PhaseEmoji.Cross ? Enums.PhaseEmoji.Naught : Enums.PhaseEmoji.Cross
      currentTurn.participant = gameSchema.participants.find(participant => participant != interaction.user.id) || currentTurn.participant

      gameSchema.markModified('gameData')
      await gameSchema.save()
      
    }


    // Update message data.

    const regularDescription = winner ? `<@${winner}> has won!` : `<@${currentTurn.participant}> it's your go. Make a move!`
    const tiedDescription = gameTied ? 'Game is tied! Nobody wins.' : null

    const button = (index: number) => {

      const buttonBuilder = new Discord.ButtonBuilder()
      .setCustomId('tictactoe.' + (index + 1))
      .setStyle(Discord.ButtonStyle.Secondary)

      if (winningMoves) winningMoves.includes(index)
      ? buttonBuilder.setDisabled(false)
      : buttonBuilder.setDisabled(true)

      if (gameTied) buttonBuilder.setDisabled(true)

      moves[index] == Enums.PhaseEmoji.ZeroWidthJoiner
      ? buttonBuilder.setLabel(moves[index])
      : buttonBuilder.setEmoji(moves[index])

      return buttonBuilder

    }

    await interaction.deferUpdate()

    await interaction.message.edit({
      components: [
        new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
        .addComponents(
          button(0),
          button(1),
          button(2),
        ),
        new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
        .addComponents(
          button(3),
          button(4),
          button(5),
        ),
        new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
        .addComponents(
          button(6),
          button(7),
          button(8),
        ),
      ],
      embeds: [
        new Discord.EmbedBuilder()
        .setColor(Enums.PhaseColour.Primary)
        .setDescription(tiedDescription ?? regularDescription)
        .setTitle('TicTacToe')
      ],
    })

  }
})


const checkWinner = (board: string[]): number[] | null => {

  const winningCombinations: number[][] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ]

  for (const combo of winningCombinations) {
    const [a, b, c] = combo

    if (board[a] == Enums.PhaseEmoji.Cross && board[b] == Enums.PhaseEmoji.Cross && board[c] == Enums.PhaseEmoji.Cross) return [a, b, c]
    else if (board[a] == Enums.PhaseEmoji.Naught && board[b] == Enums.PhaseEmoji.Naught && board[c] == Enums.PhaseEmoji.Naught) return [a, b, c]
  }

  return null // No winner yet

}
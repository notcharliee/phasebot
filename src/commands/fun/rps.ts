import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play a game of rock-paper-scissors.')
    .addStringOption(
      new Discord.SlashCommandStringOption()
      .setName('choice')
      .setDescription('Your move.')
      .setRequired(true)
      .setChoices(
        { name: 'Rock', value: 'rock' },
        { name: 'Paper', value: 'paper' },
        { name: 'Scissors', value: 'scissors' },
      )
    ),
  async execute(client, interaction) {
    
    const choices = ['rock', 'paper', 'scissors']
    const outcomes = [ `It's a tie! GG. 🤝`, `You win! GG. 🤝`, `I win! GG. 🤝` ]
    const choice = interaction.options.getString('choice', true)
    const move = Math.floor(Math.random() * 3)
    const outcomeIndex = (choices.indexOf(choice) - move + 3) % 3

    interaction.reply(`You chose **${choice}** and I chose **${choices[move]}**.\n${outcomes[outcomeIndex]}`)
    
  }
})
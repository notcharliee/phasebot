import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default Functions.clientSlashCommand({
	data: new Discord.SlashCommandBuilder()
		.setName('coffee')
		.setDescription('Buy me a coffee!'),
	async execute(client, interaction) {

		interaction.reply({
			components: [
				new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
					.setComponents(
						new Discord.ButtonBuilder()
							.setLabel('Buy me a coffee!')
							.setStyle(Discord.ButtonStyle.Link)
							.setURL(Enums.PhaseURL.PhaseCoffee)
					)
			],
			embeds: [
				new Discord.EmbedBuilder()
					.setColor(Enums.PhaseColour.Primary)
					.setDescription('Support the development of Phase and buy me (the developer) a cup of coffee! <3')
					.setTitle(Enums.PhaseEmoji.Coffee + 'Buy me a coffee!')
			],
		})

	}
})
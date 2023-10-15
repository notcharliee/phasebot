import * as Discord from 'discord.js'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'

import axios from 'axios'
import { google } from 'googleapis'


export default Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('youtube')
    .setDescription('Fetches info about a YouTube video.')
    .addStringOption(
      new Discord.SlashCommandStringOption()
      .setName('video')
      .setDescription('The video URL.')
      .setRequired(true)
    ),
  async execute(client, interaction) {
    
    await interaction.deferReply()

    const youtube = google.youtube('v3')

    const videoUrl = interaction.options.getString('video', true)
    let videoId: string = ''

    if (videoUrl.includes('v=')) videoId = videoUrl.split('v=')[1].split('&')[0]
    else if (videoUrl.includes('.be/')) videoId = videoUrl.split('.be/')[1].split('?')[0]
    else return Functions.clientError<true>(
      interaction,
      'No can do!',
      `Could not find YouTube video with url \`${videoUrl}\`.`,
      true,
    )

    try {

      const videoResponse = await youtube.videos.list({ key: process.env.API_YOUTUBE, part: ['snippet'], id: [videoId] })

      if (!videoResponse.data.items) return Functions.clientError<true>(
        interaction,
        'No can do!',
        `Could not find YouTube video with url \`${videoUrl}\`.`,
        true,
      )

      const likeData = (await axios.get<YoutTubeDislikeAPI>(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`)).data

      const video = videoResponse.data.items[0].snippet
      if (!video) return Functions.clientError<true>(
        interaction,
        'No can do!',
        `Could not find YouTube video with url \`${videoUrl}\`.`,
        true,
      )

      const videoThumbnail = video.thumbnails?.maxres?.url

      return interaction.editReply({
        embeds: [
          new Discord.EmbedBuilder()
          .setColor(Enums.PhaseColour.Primary)
          .setDescription(`**Published:** <t:${Date.parse(`${video.publishedAt}`) / 1000}:R>\n**Views:** ${Functions.formatNumber(likeData.viewCount)}\n**Likes:** ${Functions.formatNumber(likeData.likes)}\n**Dislikes:** ${Functions.formatNumber(likeData.dislikes)}\n\n**Description:**\n${video.description}`)
          .setImage(videoThumbnail ?? null)
          .setTitle(`${video.channelTitle} - ${video.title}`)
          .setURL(videoUrl)
        ],
      })

    } catch {

      return Functions.clientError<true>(
        interaction,
        'No can do!',
        `Could not find YouTube video with url \`${videoUrl}\`.`,
        true,
      )

    }
    
  }
})


type YoutTubeDislikeAPI = {
  id: string
  dateCreated: string
  likes: number
  dislikes: number
  rating: number
  viewCount: number
  deleted: boolean
}
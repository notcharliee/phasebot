import * as Discord from 'discord.js'
import mongoose from 'mongoose'

import * as Constants from '#utils/constants'
import * as Database from '#utils/database'
import * as Enums from '#utils/enums'
import * as Functions from '#utils/functions'
import * as Types from '#utils/types'


export default async (uri?: string) => {

  try {

    await mongoose.connect(uri!)
      
  } catch (error) {
    throw error
  }

  ['SIGINT', 'SIGTERM', 'SIGQUIT']
  .forEach(signal => process.on(signal, () => {
    mongoose.connection.close()
    process.exit()
  }))

}
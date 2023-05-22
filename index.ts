import { Client, Events, GatewayIntentBits } from 'discord.js'

import { Command } from './src/types/command'

import map from './src/commands/map.js'
import vc from './src/commands/vc.js'
import team from './src/commands/team.js'
import rank from './src/commands/rank.js'
import call from './src/commands/call.js'
import help from './src/commands/help'
import agent from './src/commands/agent'

const http = require('http')
http
  .createServer(function(req: any, res: any) {
    res.write('online')
    res.end()
  })
  .listen(8080)

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
})
const commands = [map, vc, team, rank, call, help, agent] as Command[]

// Botが起動した時の処理
client.once(Events.ClientReady, async () => {
  await client?.application?.commands.set(
    commands.map((command) => {
      console.log(command)
      return {
        name: command.name,
        description: command.description,
        options: command.options,
      }
    }),
    process.env.GUILD_ID!
  )
  await client.user?.setActivity({
    name; 'Valorant',
  })
})

// コマンドが実行された時の処理
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = commands.find((cmd) => cmd.name === interaction.commandName)

  if (!command) {
    console.error(` ${interaction.commandName} コマンドは存在しません。`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    await interaction.reply({ content: 'コマンドを実行中にエラーが発生しました。', ephemeral: true })
  }
})

client.login(process.env.TOKEN)

import { APIEmbed, Client, Events, GatewayIntentBits } from 'discord.js'
import { KeyvFile } from 'keyv-file'

import { Command } from './src/types/command'

import map from './src/commands/map.js'
import vc from './src/commands/vc.js'
import team from './src/commands/team.js'
import rank from './src/commands/rank.js'
import call from './src/commands/call.js'

const guilds = new KeyvFile({
  filename: 'guilds.keyv',
})

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
})
const commands = [map, vc, team, rank,call] as Command[]

// Botが起動した時の処理
client.once(Events.ClientReady, async () => {
  await client?.application?.commands.set(
    commands.map((command) => {
      return {
        name: command.name,
        description: command.description,
        options: command.options,
      }
    }),
    process.env.GUILD_ID!
  )
})

// コマンドが実行された時の処理
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return
  if (interaction.commandName === 'help') {
    await interaction.deferReply({ ephemeral: true })
    const embed: APIEmbed = {
      title: 'Botの使い方',
      description: 'Valorantカスタム用のBotです',
      fields: [
        { name: '/help', value: 'このコマンドです\nBotの説明を表示します' },
        { name: '/map', value: 'マップをランダムに選択します' },
        {
          name: '/vc',
          value:
            'VCの設定をします\nVC1,VC2,…は`/team`のチーム分けで使うVCでHomeは`/call`で集合先として使うVCです(指定無しの場合はVC1)',
        },
        { name: '/team', value: '同じVCにいるメンバーをランクを考慮してランダムにチーム分けします' },
        {
          name: '/call',
          value: 'チーム分けしたメンバー全員を1つのVCに集合させます',
        },
        {
          name: '/rank',
          value:
            '自分のランクを設定または確認します\nランクは`/team`でチーム分けする際に考慮されます\nランクは`ゴールド2`か`G2`のように指定してください（',
        },
      ],
      footer: { text: 'made by secchanu' },
    }
    await interaction.followUp({ embeds: [embed] })
  }

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

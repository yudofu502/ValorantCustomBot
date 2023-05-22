import { ApplicationCommandOptionType } from 'discord.js'
import { Command } from '../types/command'
import KeyvFile from 'keyv-file'
import { getRank, getRatio, ratioToRank, setRatio } from '../utils/rank'
import { INITIAL_RATIO } from '../constants'

export default {
  commandType: 'guild',
  name: 'match',
  description: '試合結果を登録します(teamコマンドでチーム分けをしてから実行してください)',
  options: [
    {
      type: ApplicationCommandOptionType.Number,
      name: 'team1',
      description: 'チーム1のラウンド取得数',
      required: true,
    },
    {
      type: ApplicationCommandOptionType.Number,
      name: 'team2',
      description: 'チーム2のラウンド取得数',
      required: true,
    },
  ],
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return
    await interaction.deferReply({ ephemeral: false })
    const guildId = interaction.guildId
    if (!interaction.inCachedGuild()) return
    const guilds = new KeyvFile({
      filename: 'guilds.keyv',
    })

    const teams = await guilds.get(`${guildId}.teams`)
    if (!teams) {
      await interaction.followUp('チーム分けがされていません')
      return
    }
    const team1 = interaction.options.getNumber('team1')
    const team2 = interaction.options.getNumber('team2')

    if (team1 === null || team2 === null) {
      await interaction.followUp('数字を入力してください')
      return
    }
    const roundNum = Math.max(team1, team2)
    const roundDif = Math.abs(team1 - team2)
    // 試合の規模とラウンド差からレートの変動の大きさを決める
    // レート10ごとに1ランク変動する
    // 例: 13-5の場合、roundNum = 13, roundDif = 8でratioDif = 10.5
    const ratioDif = roundNum / 2 + roundDif / 2
    for (const team of teams) {
      for (const userId of team) {
        const won = teams[0] === team ? team1 > team2 : team2 > team1
        const draw = team1 === team2
        const ratio = getRatio(userId) ?? INITIAL_RATIO
        const rank = ratioToRank(ratio)
        const newRating = Math.max(0, ratio + (won ? ratioDif : draw ? 0 : -ratioDif))
        setRatio(userId, newRating)
        const newRank = ratioToRank(newRating)
        if (rank !== newRank) {
          await interaction.followUp(
            `<@${userId}>さんのランクが${rank?.emoji ?? ''}${rank.fullName}から${newRank?.emoji ?? ''
            }${newRank.fullName}に変動しました`
          )
        }
      }
    }
    await interaction.followUp('試合結果を登録しました')
  },
} as Command

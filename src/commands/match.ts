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
    const basicRatioDif = roundNum * 3 + roundDif * 5
    const team1AvgRatio =
      teams[0].length === 0
        ? 0
        : teams[0].reduce((sum: number, userId: string) => sum + (getRatio(userId) ?? INITIAL_RATIO), 0) /
          teams[0].length
    const team2AvgRatio =
      teams[1].length === 0
        ? 0
        : teams[1].reduce((sum: number, userId: string) => sum + (getRatio(userId) ?? INITIAL_RATIO), 0) /
          teams[1].length

    let message = '試合結果を登録しました'
    for (const team of teams) {
      for (const userId of team) {
        const won = teams[0] === team ? team1 > team2 : team2 > team1
        const draw = team1 === team2
        const avgRatioDif = teams[0] === team ? team1AvgRatio - team2AvgRatio : team2AvgRatio - team1AvgRatio
        const avgRankDif = avgRatioDif / 100
        let ratioDif = (basicRatioDif + basicRatioDif * Math.max(avgRankDif * 0.1, -0.9)) * (won ? 1 : draw ? 0 : -1)
        const ratio = getRatio(userId) ?? INITIAL_RATIO
        const rank = ratioToRank(ratio)
        const newRating = Math.max(0, ratio + ratioDif)
        setRatio(userId, newRating)
        const newRank = ratioToRank(newRating)
        if (rank !== newRank) {
          message += `\n<@${userId}>さんのランクが${rank?.emoji ?? ''}${rank.fullName}から${newRank?.emoji ?? ''}${newRank.fullName
            }に変動しました`
        }
      }
    }
    await interaction.followUp(message)
  },
} as Command

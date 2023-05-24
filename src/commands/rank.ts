import { ApplicationCommandOptionType } from 'discord.js'
import { RANKS, RATIO_TO_RANK } from '../constants'
import { Command } from '../types/command'
import KeyvFile from 'keyv-file'
import { getRank, setRatio } from '../utils/rank'
import { getRule } from '../utils/rule'

export default {
  commandType: 'guild',
  name: 'rank',
  description: 'ランクを設定または確認します',
  options: [
    // ランク
    {
      type: ApplicationCommandOptionType.String,
      name: 'update',
      description: '自分のランク',
      choices: RANKS.map((rank) => ({
        name: rank.fullName,
        value: rank.id,
      })),
    },
  ],
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return

    const key = interaction.user.id
    if (!interaction.options.getString('update')) {
      // 返信する

      const rule = getRule(key)
      const rank = getRank(key, rule?.id)
      await interaction.reply(
        interaction.user.toString() +
          `${rule ? ' (' + rule.name + ')' : ''}` +
          'は' +
          (rank?.rank.emoji ?? '') +
          (rank?.rank.fullName ?? 'ランクなし') +
          ' (' +
          rank?.progress +
          ') です'
      )
    } else {
      // ランクを設定する
      const rankName = interaction.options.getString('update')!
      const rank = RANKS.find(
        (rank) => rank.id === rankName || rank.fullName === rankName || rank.otherNames?.includes(rankName)
      )
      setRatio(key, (rank?.value ?? 0) * RATIO_TO_RANK + RATIO_TO_RANK / 2)
      await interaction.reply(
        interaction.user.toString() +
          'のランクを' +
          (rank?.emoji ?? '') +
          (rank?.fullName ?? 'ランクなし') +
          'に設定しました'
      )
    }
  },
} as Command

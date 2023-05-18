import { ApplicationCommandOptionType } from 'discord.js'
import { RANKS } from '../constants'
import { guilds } from '../../index'
import { Command } from '../types/command'

export default {
  commandType: 'guild',
  name: 'rank',
  description: 'ランクを設定します',
  options: [
    // ランク
    {
      type: ApplicationCommandOptionType.String,
      name: 'rank',
      description: '自分のランク',
    },
  ],
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return
    const key = interaction.user.id
    if (!interaction.options.getString('rank')) {
      // 返信する
      await interaction.reply('あなたのランクは' + (guilds.get(key)?.fullName ?? '未設定') + 'です')
    } else {
      // ランクを設定する
      const rankName = interaction.options.getString('rank')!
      const rank = RANKS.find(
        (rank) => rank.shortName === rankName || rank.fullName === rankName || rank.otherNames?.includes(rankName)
      )
      guilds.set(key, rank)
      await interaction.reply('あなたのランクを' + (guilds.get(key) ?? '未設定') + 'に設定しました')
    }
  },
} as Command

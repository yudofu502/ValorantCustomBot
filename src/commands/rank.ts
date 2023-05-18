import { ApplicationCommandOptionType } from 'discord.js'
import { RANKS } from '../constants'
import { guilds } from '../../index'
import { Command } from '../types/command'

export default {
  commandType: 'guild',
  name: 'rank',
  description: 'ランクを設定または確認します',
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
      const rankId = guilds.get(key)

      const rank = RANKS.find((rank) => rank.id === rankId)
      await interaction.reply(interaction.user.username + 'は' + (rank?.fullName ?? 'ランクなし') + 'です')
    } else {
      // ランクを設定する
      const rankName = interaction.options.getString('rank')!
      const rank = RANKS.find(
        (rank) => rank.id === rankName || rank.fullName === rankName || rank.otherNames?.includes(rankName)
      )
      guilds.set(key, rank?.id)
      await interaction.reply(
        interaction.user.username + 'のランクを' + (rank?.fullName ?? 'ランクなし') + 'に設定しました'
      )
    }
  },
} as Command

import { ApplicationCommandOptionType } from 'discord.js'
import { RANKS } from '../constants'
import { Command } from '../types/command'
import KeyvFile from 'keyv-file'

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

    const guilds = new KeyvFile({
      filename: 'guilds.keyv',
    })
    const key = interaction.user.id
    if (!interaction.options.getString('rank')) {
      // 返信する
      const ratio = guilds.get(key) as number

      const rank = RANKS.filter((rank) => rank.value <= ratio).pop()
      await interaction.reply(
        interaction.user.toString() + 'は' + (rank?.emoji ?? '') + (rank?.fullName ?? 'ランクなし') + 'です'
      )
    } else {
      // ランクを設定する
      const rankName = interaction.options.getString('rank')!
      const rank = RANKS.find(
        (rank) => rank.id === rankName || rank.fullName === rankName || rank.otherNames?.includes(rankName)
      )
      guilds.set(key, rank?.value ?? 0)
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

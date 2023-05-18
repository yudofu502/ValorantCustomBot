import { ApplicationCommandOptionType, ChannelType } from 'discord.js'
import { TEAMS } from '../constants'
import { guilds } from '../../index'
import { Command } from '../types/command'

export default {
  commandType: 'guild',
  name: 'vc',
  description: 'チームボイスチャットを設定します',
  options: [
    ...Array(TEAMS)
      .fill({
        type: ApplicationCommandOptionType.Channel,
        required: true,
      })
      .map((t, i) => {
        const index = i + 1
        return { ...t, name: `vc${index}`, description: `VC${index}` }
      }),
    {
      type: ApplicationCommandOptionType.Channel,
      name: 'home',
      description: 'Home',
      required: false,
    },
  ],
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return
    const key = interaction.guildId
    await interaction.deferReply({ ephemeral: true })
    if (!interaction.guild?.members.me?.roles?.botRole) {
      await interaction.followUp('Botに必要なロールが付与されていません')
      return
    }
    const options = interaction.options
    const VCs = Array(TEAMS)
      .fill(null)
      .map((_, i) => {
        const index = i + 1
        const channel = options.getChannel(`vc${index}`)
        return channel
      })
    const channelHome = options.getChannel('home')
    const notVCs = [...VCs, channelHome].filter((ch) => ch).filter((ch) => ch?.type !== ChannelType.GuildVoice)
    if (notVCs.length) {
      await interaction.followUp(`${notVCs.join(', ')} はボイスチャンネルではありません`)
      return
    }
    const home = channelHome ?? VCs.at(0)
    const channels = {
      home: home?.id,
      VCs: VCs.map((ch) => ch?.id),
    }
    guilds.set(key, channels)
    await interaction.followUp(
      `以下の内容で設定しました\n\n${VCs.reduce((acc, vc, i) => {
        const index = i + 1
        return acc + `VC${index} : ${vc}\n`
      }, '')}\nHome : ${home}`
    )
  },
} as Command

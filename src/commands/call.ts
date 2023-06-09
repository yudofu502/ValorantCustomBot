import { Command } from '../types/command'
import { ChannelType } from 'discord.js'
import KeyvFile from 'keyv-file'
import { guilds } from '../utils/kv'

export default {
  commandType: 'global',
  name: 'call',
  description: 'ロビーに皆を集合させます',
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return
    const key = interaction.guildId
    await interaction.deferReply({ ephemeral: false })
    const cache = interaction.guild.channels.cache
    const guildId = interaction.guildId
    const channels = guilds.get(`${guildId}.channels`)
    const home = channels.home
    const VCs = channels.VCs
    await interaction.followUp('集合させています')
    for (const vcId of VCs) {
      const vc = cache.get(vcId)
      if (vc?.type !== ChannelType.GuildVoice) continue
      for (const member of vc?.members?.values()) {
        const voice = member.voice
        if (!voice.channel || voice.channelId === home) continue
        await member.voice.setChannel(home)
      }
    }
    await interaction.editReply('集合させました')
  },
} as Command

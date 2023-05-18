import { Command } from '../types/command'
import Keyv from 'keyv'
import fetch from 'isomorphic-fetch'
import { guilds } from '../..'
import { ChannelType } from 'discord.js'

export default {
  commandType: 'global',
  name: 'call',
  description: 'ロビーに皆を集合させます',
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return
    const key = interaction.guildId
    await interaction.deferReply({ ephemeral: false })
    const cache = interaction.guild.channels.cache
    const channels = guilds.get(key)
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
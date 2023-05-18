import { CacheType, ChatInputCommandInteraction } from 'discord.js'

export interface Command {
  commandType: 'global' | 'guild'
  name: string
  description: string
  options?: any[]
  execute: (interaction: ChatInputCommandInteraction<CacheType>) => void
}

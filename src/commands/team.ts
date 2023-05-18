import { ActionRowBuilder, BaseInteraction, ButtonBuilder, ButtonStyle, GuildMember } from 'discord.js'
import { Command } from '../types/command'
import { RANKS, Rank, TEAMS } from '../constants'
import { guilds } from '../../index'

// 2チームの戦力差がこの数字より小さくなるまで再抽選する
const initialThreshold = 1

// 再抽選の際に戦力差の閾値をどれだけ上げるか
const thresholdStep = 0.1

// 再抽選の最大回数
const maxRetry = 100

export default {
  commandType: 'guild',
  name: 'team',
  description: 'チーム分けを行います',
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return
    await interaction.deferReply({ ephemeral: false })
    const key = interaction.guildId
    if (!interaction.inCachedGuild()) return
    const channel = interaction.member.voice.channel
    if (!channel) {
      await interaction.followUp('VCに参加中のみ使用可能です')
      return
    }
    const botMessage = await interaction.followUp(`読み込み中…`)
    const members = channel.members.filter((m: { user: { bot: any } }) => !m.user.bot)
    const division = TEAMS
    const teamSize = Math.ceil(members.size / division)
    const teamFunc = async (int?: BaseInteraction) => {
      const players = members.clone()

      let teams: GuildMember[][]
      let threshhold = initialThreshold
      let retry = 0

      while (true) {
        let under = division * teamSize - players.size

        teams = new Array(division).fill(null).map((_, i) => {
          const handicap = Math.ceil(under / (division - i))
          under -= handicap
          const num = teamSize - handicap
          const rands = players.random(num)
          players.sweep((p: any) => rands.includes(p))
          return rands
        })
        const team1 = teams[0]
        const team2 = teams[1]

        const team1Power = team1.reduce((acc, m) => {
          const rankId = guilds.get(m.user.id)
          const rank = RANKS.find((r: Rank) => r.shortName === rankId)
          return acc + (rank?.value ?? 9)
        }, 0)
        const team2Power = team2.reduce((acc, m) => {
          const rankId = guilds.get(m.user.id)
          const rank = RANKS.find((r: Rank) => r.shortName === rankId)
          return acc + (rank?.value ?? 9)
        }, 0)
        console.log(team1Power, team2Power)
        const diff = Math.abs(team1Power - team2Power)
        if (diff <= threshhold || retry >= maxRetry) {
          break
        }
        threshhold += thresholdStep
        retry++
      }
      const content = teams.reduce((acc, members, i) => {
        const index = i + 1
        return acc + `チーム${index}\n` + members.map((m: { toString: () => any }) => m.toString()).join('\n') + '\n\n'
      }, '')
      const components = [
        new ActionRowBuilder<ButtonBuilder>().addComponents([
          new ButtonBuilder().setCustomId('cancel').setStyle(ButtonStyle.Danger).setLabel('キャンセル'),
          new ButtonBuilder().setCustomId('move').setStyle(ButtonStyle.Success).setLabel('移動'),
          new ButtonBuilder().setCustomId('again').setStyle(ButtonStyle.Primary).setLabel('再抽選'),
        ]),
      ]
      int?.isButton() ? await int.update({ content, components }) : await interaction.editReply({ content, components })
      const filter = (i: BaseInteraction) =>
        i.isButton() && ['cancel', 'move', 'again'].includes(i.customId) && i.user.id === interaction.user.id
      const res = await botMessage.awaitMessageComponent({ filter }).catch(async () => {
        components[0]?.components?.forEach((c: { setDisabled: () => any }) => c?.setDisabled())
        await botMessage.edit({ content, components }).catch(() => {
          return
        })
      })
      if (!res) return
      switch (res.customId) {
        case 'cancel': {
          await botMessage.delete().catch(() => {
            return
          })
          break
        }
        case 'move': {
          await res.update({ content, components: [] })
          const channels = guilds.get(key)
          const VCs = channels.VCs
          teams.forEach((members, i) => {
            members.forEach((member: { voice: { channel: any; setChannel: (arg0: any) => void } }) => {
              if (!member.voice.channel) return
              member.voice.setChannel(VCs[i])
            })
          })
          break
        }
        case 'again': {
          await teamFunc(res)
          break
        }
      }
    }
    await teamFunc()
  },
} as Command

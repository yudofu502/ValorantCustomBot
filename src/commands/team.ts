import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  BaseInteraction,
  ButtonBuilder,
  ButtonStyle,
  GuildMember,
} from 'discord.js'
import { Command } from '../types/command'
import { INITIAL_RATIO, RANKS, Rank, TEAMS } from '../constants'
import KeyvFile from 'keyv-file'
import { getRank, getRatio } from '../utils/rank'
import { getRule } from '../utils/rule'
import { guilds } from '../utils/kv'

// 2チームの戦力差がこの数字より小さくなるまで再抽選する
const initialThreshold = 50

// 再抽選の際に戦力差の閾値をどれだけ上げるか
const thresholdStep = 10

// 再抽選の最大回数
const maxRetry = 100

export default {
  commandType: 'guild',
  name: 'team',
  description: 'チーム分けを行います',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'ignore',
      description: 'チーム分けから除外するメンバーを設定（,区切り）',
    },
  ],
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return
    await interaction.deferReply({ ephemeral: false })
    const guildId = interaction.guildId
    if (!interaction.inCachedGuild()) return

    const channel = interaction.member.voice.channel
    if (!channel) {
      await interaction.followUp('VCに参加中のみ使用可能です')
      return
    }
    const botMessage = await interaction.followUp(`読み込み中…`)
    const ignoreList = interaction.options.getString('ignore')?.split(',') ?? []
    const members = channel.members.filter((m: GuildMember) => !m.user.bot && !ignoreList.includes(m.user.username))
    const division = TEAMS
    const teamSize = Math.ceil(members.size / division)
    const teamFunc = async (int?: BaseInteraction) => {
      let teams: GuildMember[][]
      let threshhold = initialThreshold
      let retry = 0

      while (true) {
        const players = members.clone()
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
          const rule = getRule(m.user.id)
          return acc + (getRatio(m.user.id, rule?.id) ?? INITIAL_RATIO)
        }, 0)
        const team2Power = team2.reduce((acc, m) => {
          const rule = getRule(m.user.id)
          return acc + (getRatio(m.user.id, rule?.id) ?? INITIAL_RATIO)
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
        return (
          acc +
          `チーム${index} (${index == 1 ? 'アタッカー' : 'ディフェンダー'})\n ` +
          members
            .map(
              (m) =>
                `${m.toString()} ${getRank(m.user.id, getRule(m.user.id)?.id)?.rank.emoji ?? ''} ${
                  getRule(m.user.id)?.name ?? ''
                }`
            )
            .join('\n') +
          '\n\n'
        )
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
          const channels = guilds.get(`${guildId}.channels`)
          const VCs = channels.VCs
          teams.forEach((members, i) => {
            members.forEach((member: { voice: { channel: any; setChannel: (arg0: any) => void } }) => {
              if (!member.voice.channel) return
              member.voice.setChannel(VCs[i])
            })
          })
          guilds.set(
            `${guildId}.teams`,
            teams.map((m) => m.map((m) => m.user.id))
          )
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

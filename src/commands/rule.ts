// RULESからRULEを選択するコマンド

import Keyv from 'keyv'
import fetch from 'isomorphic-fetch'
import { ApplicationCommandOptionType } from 'discord.js'
import { RATIO_TO_RANK, RULES, Rule } from '../constants'
import { getRank, getRatio, ratioToRank, setRatio } from '../utils/rank'
import { Command } from '../types/command'
import { getRule, setRule } from '../utils/rule'

export default {
  commandType: 'global',
  name: 'rule',
  description: 'ルールを設定または確認します',
  options: [
    {
      name: 'use',
      description: '使用するルール',
      type: ApplicationCommandOptionType.String,
      choices: RULES.map((rule) => ({
        name: rule.name + ' ' + rule.description,
        value: rule.id,
      })),
    },
    {
      name: 'reset',
      description: 'ランクをリセットする',
      type: ApplicationCommandOptionType.Boolean,
    },
  ],
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return

    const selectedRule = interaction.options.getString('rule')

    if (selectedRule === null) {
      const currentRule = getRule(interaction.user.id)
      if (!currentRule) {
        await interaction.reply(`${interaction.user.toString()} は縛りなしです`)
        return
      }
      await interaction.reply({
        content: `${interaction.user.toString()} は ${currentRule.name} を選択しています`,
      })
      return
    }

    const rule = RULES.find((rule) => rule.id === selectedRule)
    if (!rule) {
      await interaction.reply('ルールが見つかりませんでした')
      return
    }
    let ruleRatio = getRatio(interaction.user.id, rule.id)
    const reset = interaction.options.getBoolean('reset')
    if (ruleRatio === undefined || reset) {
      const ratio = getRatio(interaction.user.id)
      if (!ratio) {
        await interaction.reply('ランクを設定してください')
        return
      }

      ruleRatio = ratio - rule.difficulty * RATIO_TO_RANK
      setRatio(interaction.user.id, ruleRatio, rule.id)
    }

    const ruleRank = ratioToRank(ruleRatio)
    setRule(interaction.user.id, rule.id)

    await interaction.reply({
      content: interaction.user.toString() + ' ルールを選択しました',
      embeds: [
        {
          title: rule.name,
          description: `ランク: ${ruleRank?.rank.emoji}${ruleRank?.rank.fullName} (${ruleRank?.progress})`,
        },
      ],
    })
  },
} as Command

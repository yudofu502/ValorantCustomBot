import { Command } from '../types/command'
import Keyv from 'keyv'
import fetch from 'isomorphic-fetch'
import { ApplicationCommandOptionType } from 'discord.js'

type ValoMap = {
  id: string
  name: string
  img: string
}

export default {
  commandType: 'global',
  name: 'map',
  description: 'ランダムにマップを選択します',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'ignore',
      description: '除外するマップを設定（,区切り）',
    },
  ],
  async execute(interaction) {
    const ignore = interaction.options.getString('ignore')?.split(',')
    const map = await getMap(ignore)
    if (!map) {
      await interaction.reply('マップが見つかりませんでした')
      return
    }

    await interaction.reply({
      content: 'マップを選択しました',
      embeds: [
        {
          title: map.name,
          image: {
            url: map.img,
          },
        },
      ],
    })
  },
} as Command

const mapsCache = new Keyv({
  namespace: 'maps',
})
const ignoreIds = ['ee613ee9-28b7-4beb-9666-08db13bb2244'] // 射撃場は除外

const getMap = async (ignore?: String[]): Promise<ValoMap | undefined> => {
  const cached = await mapsCache.get('maps')

  let mapsData: ValoMap[] = []

  if (!cached) {
    const mapApi = `https://valorant-api.com/v1/maps?language=ja-JP`
    const res = await fetch(mapApi)
    const data = await res.json()
    mapsData = data.data
      .filter((map: any) => !ignoreIds.includes(map.uuid))
      .map((map: any) => {
        return { id: map.uuid, name: map.displayName, img: map.splash } as ValoMap
      })

    mapsCache.set('maps', mapsData, 60 * 60 * 1000) //ソースからの更新頻度
  }
  const maps: ValoMap[] = (cached ?? mapsData ?? []).filter((map: ValoMap) => !ignore || !ignore.includes(map.name))
  const map = maps[Math.floor(Math.random() * maps.length)]
  return map
}

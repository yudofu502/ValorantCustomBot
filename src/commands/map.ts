import { Command } from '../types/command'
import Keyv from 'keyv'
import fetch from 'isomorphic-fetch'

type ValoMap = {
  id: string
  name: string
  img: string
}

export default {
  commandType: 'global',
  name: 'map',
  description: 'ランダムにマップを選択します',
  async execute(interaction) {
    const map = await getMap()
    if (!map) {
      await interaction.reply('マップが見つかりませんでした')
      return
    }

    await interaction.channel?.send({
      embeds: [
        {
          title: map.name,
          image: {
            url: map.img,
          },
        },
      ],
    })
    interaction.reply('マップを選択しました')
  },
} as Command

const mapsCache = new Keyv({
  namespace: 'maps',
})
const ignoreIds = ['ee613ee9-28b7-4beb-9666-08db13bb2244'] // 射撃場は除外

const getMap = async (): Promise<ValoMap | undefined> => {
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
  const maps: ValoMap[] = cached ?? mapsData ?? []
  const map = maps[Math.floor(Math.random() * maps.length)]
  return map
}

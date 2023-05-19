import { Command } from '../types/command'
import Keyv from 'keyv'
import fetch from 'isomorphic-fetch'

type Map = {
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
      content: `抽選結果\n${map.name}`,
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

const getMap = async (): Promise<Map | undefined> => {
  const cached = await mapsCache.get('maps')

  if (!cached) {
    const mapApi = `https://valorant-api.com/v1/maps?language=ja-JP`
    const res = await fetch(mapApi)
    const data = await res.json()
    const mapsData: Map[] = data.data.map((map: any) => {
      return { id: map.uuid, name: map.displayName, img: map.splash } as Map
    })

    mapsCache.set('maps', mapsData, 60 * 60 * 1000) //ソースからの更新頻度
  }
  const maps: Map[] = cached ?? []
  const map = maps[Math.floor(Math.random() * maps.length)]
  return map
}

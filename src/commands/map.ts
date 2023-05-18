import { Command } from '../types/command'
import Keyv from 'keyv'
import fetch from 'isomorphic-fetch'

export default {
  commandType: 'global',
  name: 'map',
  description: 'ランダムにマップを選択します',
  async execute(interaction) {
    const map = await getMap()
    const content = map ?? 'マップが見つかりませんでした'
    await interaction.reply(content)
  },
} as Command

const mapsCache = new Keyv({
  namespace: 'maps',
})

export const getMap = async (): Promise<string | undefined> => {
  const cached = await mapsCache.get('maps')

  if (!cached) {
    const mapApi = `https://valorant-api.com/v1/maps?language=ja-JP`
    const res = await fetch(mapApi)
    const data = await res.json()
    const mapsData = data.data.map((map: any) => map.displayName)

    mapsCache.set('maps', mapsData, 60 * 60 * 1000) //ソースからの更新頻度
  }
  const maps: string[] = cached ??
    (await mapsCache.get('maps')) ?? [
      'アセント',
      'バインド',
      'スプリット',
      'ヘイブン',
      'アイスボックス',
      'ブリーズ',
      'ロータス',
      'フラクチャー',
    ]
  const map = maps[Math.floor(Math.random() * maps.length)]
  return map
}

import KeyvFile from 'keyv-file'
import { RANKS, Rank } from '../constants'

function getRatio(userId: string): number | undefined {
  const guilds = new KeyvFile({
    filename: 'guilds.keyv',
  })
  const ratio = guilds.get(userId)
  return ratio
}

async function setRatio(userId: string, ratio: number): Promise<void> {
  const guilds = new KeyvFile({
    filename: 'guilds.keyv',
  })
  await guilds.set(userId, ratio)
}

function getRank(userId: string): Rank | undefined {
  const guilds = new KeyvFile({
    filename: 'guilds.keyv',
  })
  const ratio = guilds.get(userId)
  const rank = RANKS.filter((rank) => rank.value <= ratio).pop()
  return rank
}

export { getRatio, getRank, setRatio }

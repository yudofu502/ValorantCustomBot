import KeyvFile from 'keyv-file'
import { RANKS, RATIO_TO_RANK, Rank } from '../constants'

function getRatio(userId: string): number | undefined {
  const members = new KeyvFile({
    filename: 'members.keyv',
  })
  const ratio = members.get(userId)
  return ratio
}

function setRatio(userId: string, ratio: number): void {
  const members = new KeyvFile({
    filename: 'members.keyv',
  })
  members.set(userId, ratio)
}

function getRank(userId: string): Rank | undefined {
  const members = new KeyvFile({
    filename: 'members.keyv',
  })
  const ratio = members.get(userId)
  const rank = ratio !== null ? ratioToRank(ratio) : undefined
  return rank
}

function ratioToRank(ratio: number): Rank {
  const rank = RANKS.filter((rank) => rank.value * RATIO_TO_RANK <= ratio).pop()
  return rank!
}

export { getRatio, getRank, setRatio, ratioToRank }

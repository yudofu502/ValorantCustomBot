import KeyvFile from 'keyv-file'
import { RANKS, RATIO_TO_RANK, Rank, RankWithProgress } from '../constants'

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

function getRank(userId: string): RankWithProgress | undefined {
  const members = new KeyvFile({
    filename: 'members.keyv',
  })
  const ratio = members.get(userId)
  const rank = ratio !== null ? ratioToRank(ratio) : undefined
  return rank
}

function ratioToRank(ratio: number): RankWithProgress {
  const rank = RANKS.filter((rank) => rank.value * RATIO_TO_RANK <= ratio).pop()
  const progress = ratio % RATIO_TO_RANK
  return { rank: rank!, progress: progress }
}

export { getRatio, getRank, setRatio, ratioToRank }

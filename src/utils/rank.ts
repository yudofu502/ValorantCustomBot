import KeyvFile from 'keyv-file'
import { RANKS, RATIO_TO_RANK, Rank, RankWithProgress, Rule } from '../constants'
import { members } from './kv'

function getRatio(userId: string, ruleId?: String): number | undefined {
  if (ruleId !== undefined && ruleId !== '0') {
    const ratio = members.get(`${userId}.${ruleId}`)
    return ratio
  }
  const ratio = members.get(userId)
  return ratio
}

function setRatio(userId: string, ratio: number, ruleId?: String): void {
  const modifiedRatio = Math.max(0, ratio)
  if (ruleId !== undefined && ruleId !== '0') {
    members.set(`${userId}.${ruleId}`, modifiedRatio)
    console.log(`${userId}.${ruleId}`)
    return
  }
  members.set(userId, modifiedRatio)
}

function getRank(userId: string, ruleId?: String): RankWithProgress | undefined {
  if (ruleId !== undefined && ruleId !== '0') {
    const ratio = members.get(`${userId}.${ruleId}`)
    const rank = ratio !== null ? ratioToRank(ratio) : undefined
    return rank
  }
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

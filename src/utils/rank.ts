import KeyvFile from 'keyv-file'
import { RANKS, Rank } from '../constants'

function getRank(userId: string): Rank | undefined {
  const guilds = new KeyvFile({
    filename: 'guilds.keyv',
  })
  const rankId = guilds.get(userId)
  const rank = RANKS.find((rank) => rank.id === rankId)
  return rank
}

export { getRank }

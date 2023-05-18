export const TEAMS = 2 //チーム分けのチーム数
export const RANKS = [
  {
    id: 'I1',
    fullName: 'アイアン1',
    value: 1,
  },
  {
    id: 'I2',
    fullName: 'アイアン2',
    value: 2,
  },
  {
    id: 'I3',
    fullName: 'アイアン3',
    value: 3,
  },
  {
    id: 'B1',
    fullName: 'ブロンズ1',
    value: 4,
  },
  {
    id: 'B2',
    fullName: 'ブロンズ2',
    value: 5,
  },
  {
    id: 'B3',
    fullName: 'ブロンズ3',
    value: 6,
  },
  {
    id: 'S1',
    fullName: 'シルバー1',
    value: 7,
  },
  {
    id: 'S2',
    fullName: 'シルバー2',
    value: 8,
  },
  {
    id: 'S3',
    fullName: 'シルバー3',
    value: 9,
  },
  {
    id: 'G1',
    fullName: 'ゴールド1',
    value: 10,
  },
  {
    id: 'G2',
    fullName: 'ゴールド2',
    value: 11,
  },
  {
    id: 'G3',
    fullName: 'ゴールド3',
    value: 12,
  },
  {
    id: 'P1',
    fullName: 'プラチナ1',
    value: 13,
  },
  {
    id: 'P2',
    fullName: 'プラチナ2',
    value: 14,
  },
  {
    id: 'P3',
    fullName: 'プラチナ3',
    value: 15,
  },
  {
    id: 'D1',
    fullName: 'ダイヤ1',
    value: 16,
  },
  {
    id: 'D2',
    fullName: 'ダイヤ2',
    value: 17,
  },
  {
    id: 'D3',
    fullName: 'ダイヤ3',
    value: 18,
  },
  {
    id: 'As1',
    fullName: 'アセンダント1',
    value: 19,
  },
  {
    id: 'As2',
    fullName: 'アセンダント2',
    value: 20,
  },
  {
    id: 'As3',
    fullName: 'アセンダント3',
    value: 21,
  },
  {
    id: 'R',
    fullName: 'レディアント',
    value: 19,
  },
] as Rank[]

export type Rank = {
  id: string
  fullName: string
  otherNames?: string[]
  value: number
}
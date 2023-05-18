export const TEAMS = 2 //チーム分けのチーム数
export const RANKS = [
  {
    shortName: 'I1',
    fullName: 'アイアン1',
    value: 1,
  },
  {
    shortName: 'I2',
    fullName: 'アイアン2',
    value: 2,
  },
  {
    shortName: 'I3',
    fullName: 'アイアン3',
    value: 3,
  },
  {
    shortName: 'B1',
    fullName: 'ブロンズ1',
    value: 4,
  },
  {
    shortName: 'B2',
    fullName: 'ブロンズ2',
    value: 5,
  },
  {
    shortName: 'B3',
    fullName: 'ブロンズ3',
    value: 6,
  },
  {
    shortName: 'S1',
    fullName: 'シルバー1',
    value: 7,
  },
  {
    shortName: 'S2',
    fullName: 'シルバー2',
    value: 8,
  },
  {
    shortName: 'S3',
    fullName: 'シルバー3',
    value: 9,
  },
  {
    shortName: 'G1',
    fullName: 'ゴールド1',
    value: 10,
  },
  {
    shortName: 'G2',
    fullName: 'ゴールド2',
    value: 11,
  },
  {
    shortName: 'G3',
    fullName: 'ゴールド3',
    value: 12,
  },
  {
    shortName: 'P1',
    fullName: 'プラチナ1',
    value: 13,
  },
  {
    shortName: 'P2',
    fullName: 'プラチナ2',
    value: 14,
  },
  {
    shortName: 'P3',
    fullName: 'プラチナ3',
    value: 15,
  },
  {
    shortName: 'D1',
    fullName: 'ダイヤ1',
    value: 16,
  },
  {
    shortName: 'D2',
    fullName: 'ダイヤ2',
    value: 17,
  },
  {
    shortName: 'D3',
    fullName: 'ダイヤ3',
    value: 18,
  },
  {
    shortName: 'As1',
    fullName: 'アセンダント1',
    value: 19,
  },
  {
    shortName: 'As2',
    fullName: 'アセンダント2',
    value: 20,
  },
  {
    shortName: 'As3',
    fullName: 'アセンダント3',
    value: 21,
  },
  {
    shortName: 'R',
    fullName: 'レディアント',
    value: 19,
  },
] as Rank[]

export type Rank = {
  shortName: string
  fullName: string
  otherNames?: string[]
  value: number
}
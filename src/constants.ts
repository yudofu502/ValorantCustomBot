export const TEAMS = 2 //チーム分けのチーム数
export const RANKS = [
  {
    id: 'I1',
    fullName: 'アイアン1',
    value: 1,
    emoji: ':iron1:1108966129768087644',
  },
  {
    id: 'I2',
    fullName: 'アイアン2',
    value: 2,
    emoji: ':iron2:1108966159279202324',
  },
  {
    id: 'I3',
    fullName: 'アイアン3',
    value: 3,
    emoji: ':iron3:1108966115398389790',
  },
  {
    id: 'B1',
    fullName: 'ブロンズ1',
    value: 4,
    emoji: ':bronze1:1108966133991751703',
  },
  {
    id: 'B2',
    fullName: 'ブロンズ2',
    value: 5,
    emoji: ':bronze2:1108966135812063292',
  },
  {
    id: 'B3',
    fullName: 'ブロンズ3',
    value: 6,
    emoji: ':bronze3:1108966139935080501',
  },
  {
    id: 'S1',
    fullName: 'シルバー1',
    value: 7,
    emoji: ':silver1:1108966154703216742',
  },
  {
    id: 'S2',
    fullName: 'シルバー2',
    value: 8,
    emoji: ':silver2:1108966162362028063',
  },
  {
    id: 'S3',
    fullName: 'シルバー3',
    value: 9,
    emoji: ':silver3:1108966127234723890',
  },
  {
    id: 'G1',
    fullName: 'ゴールド1',
    value: 10,
    emoji: ':gold1:1108966145681260554',
  },
  {
    id: 'G2',
    fullName: 'ゴールド2',
    value: 11,
    emoji: ':gold2:1108966118200193035',
  },
  {
    id: 'G3',
    fullName: 'ゴールド3',
    value: 12,
    emoji: ':gold3:1108966124160307351',
  },
  {
    id: 'P1',
    fullName: 'プラチナ1',
    value: 13,
    emoji: ':platinum1:1108966819739488358',
  },
  {
    id: 'P2',
    fullName: 'プラチナ2',
    value: 14,
    emoji: ':platinum2:1108966122713264200',
  },
  {
    id: 'P3',
    fullName: 'プラチナ3',
    value: 15,
    emoji: ':platinum3:1108966815264165908',
  },
  {
    id: 'D1',
    fullName: 'ダイヤモンド1',
    value: 16,
    emoji: ':diamond1:1108966142606843926',
  },
  {
    id: 'D2',
    fullName: 'ダイヤモンド2',
    value: 17,
    emoji: ':diamond2:1108966131328372796',
  },
  {
    id: 'D3',
    fullName: 'ダイヤモンド3',
    value: 18,
    emoji: ':diamond3:1108966156825538590',
  },
  {
    id: 'A1',
    fullName: 'アセンダント1',
    value: 19,
    emoji: ':ascendant1:1108966138387365999',
  },
  {
    id: 'A2',
    fullName: 'アセンダント2',
    value: 20,
    emoji: ':ascendant2:1108966737635967026',
  },
  {
    id: 'A3',
    fullName: 'アセンダント3',
    value: 21,
    emoji: ':ascendant3:1108966119995359262',
  },
  {
    id: 'Im1',
    fullName: 'イモータル1',
    value: 22,
    emoji: ':immortal1:1108966110059036772',
  },
  {
    id: 'Im2',
    fullName: 'イモータル2',
    value: 23,
    emoji: ':immortal2:1108966112021991434',
  },
  {
    id: 'Im3',
    fullName: 'イモータル3',
    value: 24,
    emoji: ':immortal3:1108966149544214658',
  },

  {
    id: 'R',
    fullName: 'レディアント',
    value: 25,
    emoji: ':radiant:1108966817176764416',
  },
  {
    id: 'N',
    fullName: 'ランクなし',
    value: 10,
  },
] as Rank[]

export type Rank = {
  id: string
  fullName: string
  otherNames?: string[]
  value: number
  emoji?: string
}
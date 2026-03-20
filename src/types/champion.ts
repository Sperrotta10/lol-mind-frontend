export const CHAMPION_ROLES = [
  'All',
  'Fighter',
  'Mage',
  'Assassin',
  'Tank',
  'Support',
  'Marksman',
] as const

export type ChampionFilterRole = (typeof CHAMPION_ROLES)[number]

export interface Champion {
  id: string
  name: string
  title: string
  lore?: string
  tags: string[]
  imageUrl?: string
  avatar?: string
  splash: string
}

export interface ChampionsApiResponse {
  data: ChampionApiModel[]
}

export interface ChampionApiModel {
  id: string
  name: string
  title: string
  lore?: string
  blurb?: string
  tags?: string[]
  image?: string
  avatar?: string
  splash?: string
}

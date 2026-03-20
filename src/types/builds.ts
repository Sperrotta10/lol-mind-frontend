export interface MatchupAnalysisRequest {
  champion: string
  enemy: string
}

export interface MatchupDescriptor {
  allyChampion: string
  enemyChampion: string
  lanePlan: string
  winCondition: string
  riskAlerts: string[]
}

export interface MatchupBuildRecommendation {
  startingItems: string[]
  coreItems: string[]
  situationalItems: string[]
  boots: string
}

export interface MatchupRunesRecommendation {
  primaryTree: string
  secondaryTree: string
  primaryChoices: string[]
  secondaryChoices: string[]
  shards: string[]
}

export interface MatchupMicroPlan {
  earlyGame: string[]
  midGame: string[]
  lateGame: string[]
}

export interface MatchupAnalysisResponse {
  matchup: MatchupDescriptor
  build: MatchupBuildRecommendation
  runes: MatchupRunesRecommendation
  microPlan: MatchupMicroPlan
}

export interface MatchupAnalysisMeta {
  requestId: string
}

export interface MatchupAnalysisApiResponse {
  success: boolean
  data: MatchupAnalysisResponse
  meta?: MatchupAnalysisMeta
}

export interface TeamAnalysisRequest {
  myTeam: string[]
  enemyTeam: string[]
  myChampion: string
}

export interface TeamAnalysisRecommendedBuild {
  coreItems?: string[]
  situationalItems?: string[]
  boots?: string
}

export interface TeamAnalysisComposition {
  globalWinCondition?: string
  myTeamDamageProfile?: string
  enemyTeamDamageProfile?: string
  ccAdvantage?: string
  explanation?: string
  recommendedBuild?: TeamAnalysisRecommendedBuild
}

export interface TeamAnalysisResponseData {
  composition?: TeamAnalysisComposition
  explanation?: string
}

export interface TeamAnalysisApiResponse {
  success: boolean
  data: TeamAnalysisResponseData
  meta?: {
    requestId?: string
  }
}

export interface StyleBuildRequest {
  champion: string
  style: string
}

export interface StyleBuildResponseData {
  summary?: string
  items?: string[]
  runes?: string[]
  tips?: string[]
  [key: string]: unknown
}

export interface StyleBuildApiResponse {
  success: boolean
  data?: StyleBuildResponseData | unknown
  meta?: {
    requestId?: string
  }
}

export interface ChampionMetaBuildItems {
  startingItems?: string[]
  coreItems?: string[]
  situationalItems?: string[]
  optionalItems?: string[]
  boots?: string
}

export interface ChampionMetaBuildRunes {
  primaryTree?: string
  secondaryTree?: string
  primaryChoices?: string[]
  secondaryChoices?: string[]
  shards?: string[]
}

export interface ChampionMetaBuildSkills {
  abilityPriority?: string[]
  levelingOrder?: string[]
  maxOrder?: string[]
}

export interface ChampionMetaBuildData {
  championId?: string
  championName?: string
  patch?: string
  winRate?: number
  pickRate?: number
  banRate?: number
  difficulty?: string
  playstyle?: string
  build?: ChampionMetaBuildItems
  runes?: ChampionMetaBuildRunes
  skills?: ChampionMetaBuildSkills
  summonerSpells?: string[]
  tips?: string[]
  threats?: string[]
  synergies?: string[]
  [key: string]: unknown
}

export interface ChampionMetaBuildApiResponse {
  success: boolean
  data?: ChampionMetaBuildData | unknown
  meta?: {
    requestId?: string
  }
}
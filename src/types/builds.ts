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
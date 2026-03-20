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

export interface TeamAnalysisBuild {
  startingItems?: string[]
  coreItems?: string[]
  situationalItems?: string[]
  boots?: string
  runes?: {
    primaryTree?: string
    secondaryTree?: string
    primaryChoices?: string[]
    secondaryChoices?: string[]
    shards?: string[]
  }
}

export interface TeamAnalysisMacro {
  globalStrategy?: string
  earlyGamePlan?: string[]
  midGamePlan?: string[]
  lateGamePlan?: string[]
  objectivePriority?: string[]
}

export interface TeamAnalysisTeamfight {
  roleInTeamfight?: string
  targetPriority?: string[]
  engagePattern?: string[]
  positioningTips?: string[]
  dangerAlerts?: string[]
}

export interface TeamAnalysisResponseData {
  myTeam: string[]
  enemyTeam: string[]
  myChampion: string
  compositionSummary?: string
  winCondition?: string
  build?: TeamAnalysisBuild
  macro?: TeamAnalysisMacro
  teamfight?: TeamAnalysisTeamfight
}

export interface TeamAnalysisApiResponse {
  success: boolean
  data: TeamAnalysisResponseData
  meta?: {
    requestId?: string
  }
}
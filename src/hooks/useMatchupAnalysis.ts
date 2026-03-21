import { useCallback, useRef, useState } from 'react'
import type {
  BuildEntry,
  MatchupAnalysisApiResponse,
  MatchupAnalysisRequest,
  MatchupAnalysisResponse,
} from '@/types/builds'

interface UseMatchupAnalysisResult {
  data: MatchupAnalysisResponse | null
  isLoading: boolean
  isError: boolean
  analyzeMatchup: (payload: MatchupAnalysisRequest) => Promise<void>
  reset: () => void
}

function getApiBaseUrl(): string {
  const envBase = import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_BACKEND_URL
  return typeof envBase === 'string' ? envBase.replace(/\/+$/, '') : ''
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toNamedString(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  if (isRecord(value) && typeof value.name === 'string' && value.name.trim().length > 0) {
    return value.name
  }

  return undefined
}

function toBuildEntry(value: unknown): BuildEntry | undefined {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  if (!isRecord(value)) {
    return undefined
  }

  if (typeof value.name !== 'string' || value.name.trim().length === 0) {
    return undefined
  }

  return {
    id: typeof value.id === 'string' ? value.id : null,
    name: value.name,
    image: typeof value.image === 'string' ? value.image : null,
  }
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => toNamedString(item))
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

function toBuildEntryArray(value: unknown): BuildEntry[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map((item) => toBuildEntry(item)).filter((item): item is BuildEntry => item !== undefined)
}

function normalizeMatchupResponse(raw: unknown): MatchupAnalysisResponse | null {
  if (!isRecord(raw)) {
    return null
  }

  const matchupSource = isRecord(raw.matchup) ? raw.matchup : {}
  const buildSource = isRecord(raw.build) ? raw.build : {}
  const runesSource = isRecord(raw.runes) ? raw.runes : {}
  const microPlanSource = isRecord(raw.microPlan) ? raw.microPlan : {}

  const allyChampion = toNamedString(matchupSource.allyChampion)
  const enemyChampion = toNamedString(matchupSource.enemyChampion)

  if (!allyChampion || !enemyChampion) {
    return null
  }

  return {
    matchup: {
      allyChampion,
      enemyChampion,
      lanePlan: toNamedString(matchupSource.lanePlan) ?? '',
      winCondition: toNamedString(matchupSource.winCondition) ?? '',
      riskAlerts: toStringArray(matchupSource.riskAlerts),
    },
    build: {
      startingItems: toBuildEntryArray(buildSource.startingItems),
      coreItems: toBuildEntryArray(buildSource.coreItems),
      situationalItems: toBuildEntryArray(buildSource.situationalItems),
      boots: toBuildEntry(buildSource.boots) ?? null,
    },
    runes: {
      primaryTree: toBuildEntry(runesSource.primaryTree) ?? null,
      secondaryTree: toBuildEntry(runesSource.secondaryTree) ?? null,
      primaryChoices: toBuildEntryArray(runesSource.primaryChoices),
      secondaryChoices: toBuildEntryArray(runesSource.secondaryChoices),
      shards: toStringArray(runesSource.shards),
    },
    microPlan: {
      earlyGame: toStringArray(microPlanSource.earlyGame),
      midGame: toStringArray(microPlanSource.midGame),
      lateGame: toStringArray(microPlanSource.lateGame),
    },
  }
}

export function useMatchupAnalysis(): UseMatchupAnalysisResult {
  const [data, setData] = useState<MatchupAnalysisResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const requestIdRef = useRef(0)
  const controllerRef = useRef<AbortController | null>(null)

  const analyzeMatchup = useCallback(async (payload: MatchupAnalysisRequest) => {
    requestIdRef.current += 1
    const requestId = requestIdRef.current

    controllerRef.current?.abort()

    const controller = new AbortController()
    controllerRef.current = controller

    setIsLoading(true)
    setIsError(false)

    try {
      const apiBaseUrl = getApiBaseUrl()
      const response = await fetch(`${apiBaseUrl}/api/builds/matchup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`Failed to analyze matchup (${response.status})`)
      }

      const result = (await response.json()) as MatchupAnalysisApiResponse

      if (!result.success) {
        throw new Error('Matchup analysis failed on backend')
      }

      if (requestId !== requestIdRef.current) {
        return
      }

      const normalized = normalizeMatchupResponse(result.data)

      if (!normalized) {
        throw new Error('Invalid matchup shape from backend')
      }

      setData(normalized)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      if (requestId !== requestIdRef.current) {
        return
      }

      setIsError(true)
      setData(null)
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false)
      }
    }
  }, [])

  const reset = useCallback(() => {
    controllerRef.current?.abort()
    setData(null)
    setIsError(false)
    setIsLoading(false)
  }, [])

  return {
    data,
    isLoading,
    isError,
    analyzeMatchup,
    reset,
  }
}
import { useCallback, useRef, useState } from 'react'
import type {
  BuildEntry,
  TeamAnalysisApiResponse,
  TeamAnalysisComposition,
  TeamAnalysisRequest,
  TeamAnalysisRecommendedBuild,
  TeamAnalysisResponseData,
} from '@/types/builds'

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
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

function toBuildEntryArray(value: unknown): BuildEntry[] | undefined {
  if (Array.isArray(value)) {
    const parsed = value
      .map((item) => toBuildEntry(item))
      .filter((item): item is BuildEntry => item !== undefined)

    return parsed.length > 0 ? parsed : undefined
  }

  if (isRecord(value)) {
    const parsed = Object.values(value)
      .map((item) => toBuildEntry(item))
      .filter((item): item is BuildEntry => item !== undefined)

    return parsed.length > 0 ? parsed : undefined
  }

  return undefined
}

function toOptionalString(value: unknown): string | undefined {
  return toNamedString(value)
}

function normalizeRecommendedBuild(value: unknown): TeamAnalysisRecommendedBuild | undefined {
  if (!isRecord(value)) {
    return undefined
  }

  const coreItems = toBuildEntryArray(value.coreItems)
  const situationalItems = toBuildEntryArray(value.situationalItems)
  const boots = toBuildEntry(value.boots)

  if (!coreItems && !situationalItems && !boots) {
    return undefined
  }

  return {
    coreItems,
    situationalItems,
    boots,
  }
}

function normalizeComposition(value: unknown, root: UnknownRecord): TeamAnalysisComposition | undefined {
  const compositionSource = isRecord(value) ? value : {}
  const fallbackBuild = normalizeRecommendedBuild(root.recommendedBuild)
  const recommendedBuild = normalizeRecommendedBuild(compositionSource.recommendedBuild) ?? fallbackBuild
  const explanation = toOptionalString(compositionSource.explanation) ?? toOptionalString(root.explanation)

  const composition: TeamAnalysisComposition = {
    globalWinCondition: toOptionalString(compositionSource.globalWinCondition),
    myTeamDamageProfile: toOptionalString(compositionSource.myTeamDamageProfile),
    enemyTeamDamageProfile: toOptionalString(compositionSource.enemyTeamDamageProfile),
    ccAdvantage: toOptionalString(compositionSource.ccAdvantage),
    explanation,
    recommendedBuild,
  }

  if (Object.values(composition).every((item) => item === undefined)) {
    return undefined
  }

  return composition
}

function normalizeTeamAnalysisData(raw: unknown): TeamAnalysisResponseData {
  if (!isRecord(raw)) {
    return {}
  }

  const nestedData = isRecord(raw.data) ? raw.data : undefined
  const payload = nestedData ?? raw

  return {
    explanation: toOptionalString(payload.explanation),
    composition: normalizeComposition(payload.composition, payload),
  }
}

interface UseTeamAnalysisResult {
  data: TeamAnalysisResponseData | null
  isLoading: boolean
  isError: boolean
  analyzeTeam: (payload: TeamAnalysisRequest) => Promise<void>
  reset: () => void
}

function getApiBaseUrl(): string {
  const envBase = import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_BACKEND_URL
  return typeof envBase === 'string' ? envBase.replace(/\/+$/, '') : ''
}

export function useTeamAnalysis(): UseTeamAnalysisResult {
  const [data, setData] = useState<TeamAnalysisResponseData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const requestIdRef = useRef(0)
  const controllerRef = useRef<AbortController | null>(null)

  const analyzeTeam = useCallback(async (payload: TeamAnalysisRequest) => {
    requestIdRef.current += 1
    const requestId = requestIdRef.current

    controllerRef.current?.abort()

    const controller = new AbortController()
    controllerRef.current = controller

    setIsLoading(true)
    setIsError(false)

    try {
      const apiBaseUrl = getApiBaseUrl()
      const response = await fetch(`${apiBaseUrl}/api/builds/team-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`Failed to analyze team (${response.status})`)
      }

      const result = (await response.json()) as TeamAnalysisApiResponse

      if (!result.success) {
        throw new Error('Team analysis failed on backend')
      }

      if (requestId !== requestIdRef.current) {
        return
      }

      setData(normalizeTeamAnalysisData(result.data))
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
    analyzeTeam,
    reset,
  }
}
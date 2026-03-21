import { useCallback, useEffect, useRef, useState } from 'react'
import type { BuildEntry, ChampionMetaBuildApiResponse, ChampionMetaBuildData } from '@/types/builds'

interface UseChampionMetaBuildResult {
  data: ChampionMetaBuildData | null
  isLoading: boolean
  isError: boolean
  refetch: () => Promise<void>
}

function getApiBaseUrl(): string {
  const envBase = import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_BACKEND_URL
  return typeof envBase === 'string' ? envBase.replace(/\/+$/, '') : ''
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function asNamedString(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  if (isRecord(value) && typeof value.name === 'string' && value.name.trim().length > 0) {
    return value.name
  }

  return undefined
}

function asBuildEntry(value: unknown): BuildEntry | undefined {
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

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined
  }

  const parsed = value
    .map((item) => asNamedString(item))
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)

  return parsed.length > 0 ? parsed : undefined
}

function asBuildEntryArray(value: unknown): BuildEntry[] | undefined {
  if (!Array.isArray(value)) {
    return undefined
  }

  const parsed = value
    .map((item) => asBuildEntry(item))
    .filter((item): item is BuildEntry => item !== undefined)

  return parsed.length > 0 ? parsed : undefined
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function asString(value: unknown): string | undefined {
  return asNamedString(value)
}

function normalizeMetaBuild(raw: unknown): ChampionMetaBuildData | null {
  if (!isRecord(raw)) {
    return null
  }

  const buildSource = isRecord(raw.build) ? raw.build : raw
  const runesSource = isRecord(raw.runes) ? raw.runes : undefined
  const skillsSource = isRecord(raw.skills) ? raw.skills : undefined

  return {
    championId: asString(raw.championId) ?? asString(raw.champion),
    championName: asString(raw.championName),
    patch: asString(raw.patch),
    winRate: asNumber(raw.winRate),
    pickRate: asNumber(raw.pickRate),
    banRate: asNumber(raw.banRate),
    difficulty: asString(raw.difficulty),
    playstyle: asString(raw.playstyle) ?? asString(raw.playstyleExplanation),
    build: {
      startingItems: asBuildEntryArray(buildSource.startingItems),
      coreItems: asBuildEntryArray(buildSource.coreItems),
      situationalItems: asBuildEntryArray(buildSource.situationalItems),
      optionalItems: asBuildEntryArray(buildSource.optionalItems),
      boots: asBuildEntry(buildSource.boots),
    },
    runes: {
      primaryTree: asBuildEntry(runesSource?.primaryTree),
      secondaryTree: asBuildEntry(runesSource?.secondaryTree),
      primaryChoices: asBuildEntryArray(runesSource?.primaryChoices),
      secondaryChoices: asBuildEntryArray(runesSource?.secondaryChoices),
      shards: asStringArray(runesSource?.shards),
    },
    skills: {
      abilityPriority: asStringArray(skillsSource?.abilityPriority),
      levelingOrder: asStringArray(skillsSource?.levelingOrder),
      maxOrder: asStringArray(skillsSource?.maxOrder),
    },
    summonerSpells: asStringArray(raw.summonerSpells),
    tips: asStringArray(raw.tips),
    threats: asStringArray(raw.threats),
    synergies: asStringArray(raw.synergies),
  }
}

export function useChampionMetaBuild(championId?: string): UseChampionMetaBuildResult {
  const [data, setData] = useState<ChampionMetaBuildData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const requestIdRef = useRef(0)
  const controllerRef = useRef<AbortController | null>(null)

  const normalizedChampionId = championId?.trim()

  const fetchMetaBuild = useCallback(async () => {
    if (!normalizedChampionId) {
      setData(null)
      setIsError(false)
      setIsLoading(false)
      return
    }

    requestIdRef.current += 1
    const requestId = requestIdRef.current

    controllerRef.current?.abort()

    const controller = new AbortController()
    controllerRef.current = controller

    setIsLoading(true)
    setIsError(false)

    try {
      const apiBaseUrl = getApiBaseUrl()
      const response = await fetch(
        `${apiBaseUrl}/api/builds/base/${encodeURIComponent(normalizedChampionId)}`,
        {
          signal: controller.signal,
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch champion meta build (${response.status})`)
      }

      const payload = (await response.json()) as ChampionMetaBuildApiResponse | ChampionMetaBuildData
      const rawData = 'success' in payload ? payload.data : payload

      if (requestId !== requestIdRef.current) {
        return
      }

      setData(normalizeMetaBuild(rawData))
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
  }, [normalizedChampionId])

  useEffect(() => {
    void fetchMetaBuild()

    return () => {
      controllerRef.current?.abort()
    }
  }, [fetchMetaBuild])

  return {
    data,
    isLoading,
    isError,
    refetch: fetchMetaBuild,
  }
}

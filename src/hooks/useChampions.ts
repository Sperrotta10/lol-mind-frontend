import { useEffect, useRef, useState } from 'react'
import type {
  Champion,
  ChampionApiModel,
  ChampionsApiResponse,
  ChampionFilterRole,
} from '@/types/champion'

interface UseChampionsParams {
  search?: string
  tag?: Exclude<ChampionFilterRole, 'All'>
}

interface UseChampionsResult {
  champions: Champion[]
  isLoading: boolean
  isError: boolean
}

const MIN_LOADING_MS = 350

function mapChampion(champion: ChampionApiModel): Champion {
  const splashImageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`

  return {
    id: champion.id,
    name: champion.name,
    title: champion.title,
    tags: champion.tags ?? [],
    imageUrl: champion.imageUrl ?? splashImageUrl,
  }
}

function getApiBaseUrl(): string {
  const envBase = import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_BACKEND_URL
  return typeof envBase === 'string' ? envBase.replace(/\/+$/, '') : ''
}

export function useChampions(params: UseChampionsParams = {}): UseChampionsResult {
  const { search, tag } = params
  const [champions, setChampions] = useState<Champion[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const requestIdRef = useRef(0)

  useEffect(() => {
    const controller = new AbortController()
    requestIdRef.current += 1
    const requestId = requestIdRef.current
    let cancelled = false

    async function loadChampions() {
      const startedAt = Date.now()
      setIsLoading(true)
      setIsError(false)

      try {
        const query = new URLSearchParams()

        if (search?.trim()) {
          query.set('search', search.trim())
        }

        if (tag) {
          query.set('tag', tag)
        }

        const apiBaseUrl = getApiBaseUrl()
        const path = '/api/champions'
        const endpoint = query.size > 0 ? `${path}?${query.toString()}` : path
        const url = `${apiBaseUrl}${endpoint}`
        const response = await fetch(url, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Failed to fetch champions (${response.status})`)
        }

        const payload = (await response.json()) as ChampionsApiResponse | ChampionApiModel[]
        const championList = Array.isArray(payload) ? payload : payload.data

        if (cancelled || requestId !== requestIdRef.current) {
          return
        }

        setChampions(championList.map(mapChampion))
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        if (cancelled || requestId !== requestIdRef.current) {
          return
        }

        setIsError(true)
        setChampions([])
      } finally {
        let shouldFinalize = !cancelled && requestId === requestIdRef.current

        if (shouldFinalize) {
          const elapsed = Date.now() - startedAt
          const remaining = MIN_LOADING_MS - elapsed

          if (remaining > 0) {
            await new Promise((resolve) => {
              setTimeout(resolve, remaining)
            })

            shouldFinalize = !cancelled && requestId === requestIdRef.current
          }
        }

        if (shouldFinalize) {
          setIsLoading(false)
        }
      }
    }

    void loadChampions()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [search, tag])

  return { champions, isLoading, isError }
}

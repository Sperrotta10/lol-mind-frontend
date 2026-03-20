import { useCallback, useRef, useState } from 'react'
import type {
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

      setData(result.data)
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
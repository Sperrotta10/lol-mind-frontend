import { useCallback, useRef, useState } from 'react'
import type { StyleBuildApiResponse, StyleBuildRequest } from '@/types/builds'

interface UseStyleBuildResult {
  data: Record<string, unknown> | null
  usedStyle: string | null
  isLoading: boolean
  isError: boolean
  generateStyleBuild: (champion: string) => Promise<void>
  reset: () => void
}

const EXOTIC_STYLES = [
  'poke',
  'splitpush',
  'on-hit',
  'burst',
  'drain-tank',
  'utility',
  'anti-tank',
] as const

function getApiBaseUrl(): string {
  const envBase = import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_BACKEND_URL
  return typeof envBase === 'string' ? envBase.replace(/\/+$/, '') : ''
}

function getRandomStyle(): string {
  const index = Math.floor(Math.random() * EXOTIC_STYLES.length)
  return EXOTIC_STYLES[index]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function useStyleBuild(): UseStyleBuildResult {
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  const [usedStyle, setUsedStyle] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef(0)

  const generateStyleBuild = useCallback(async (champion: string) => {
    requestIdRef.current += 1
    const requestId = requestIdRef.current

    controllerRef.current?.abort()

    const controller = new AbortController()
    controllerRef.current = controller

    setIsLoading(true)
    setIsError(false)

    const style = getRandomStyle()
    setUsedStyle(style)

    try {
      const apiBaseUrl = getApiBaseUrl()
      const response = await fetch(`${apiBaseUrl}/api/builds/style`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ champion, style } satisfies StyleBuildRequest),
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`Failed to generate style build (${response.status})`)
      }

      const payload = (await response.json()) as StyleBuildApiResponse

      if (!payload.success) {
        throw new Error('Style build failed on backend')
      }

      if (requestId !== requestIdRef.current) {
        return
      }

      const normalized = isRecord(payload.data) ? payload.data : { result: payload.data }
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
    setUsedStyle(null)
    setIsError(false)
    setIsLoading(false)
  }, [])

  return {
    data,
    usedStyle,
    isLoading,
    isError,
    generateStyleBuild,
    reset,
  }
}

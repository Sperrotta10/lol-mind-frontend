import { useMemo } from 'react'
import { useChampions } from '@/hooks/useChampions'
import type { Champion } from '@/types/champion'

interface UseChampionDetailResult {
  champion: Champion | null
  isLoading: boolean
  isError: boolean
}

export function useChampionDetail(championId?: string): UseChampionDetailResult {
  const normalizedId = championId?.trim().toLowerCase() ?? ''
  const { champions, isLoading, isError } = useChampions({ search: normalizedId })

  const champion = useMemo(() => {
    if (!normalizedId) {
      return null
    }

    return champions.find((item) => item.id.toLowerCase() === normalizedId) ?? null
  }, [champions, normalizedId])

  return {
    champion,
    isLoading,
    isError,
  }
}

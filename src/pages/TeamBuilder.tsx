import { TeamAnalysisResult } from '@/components/features/team-builder/TeamAnalysisResult'
import { TeamSelector } from '@/components/features/team-builder/TeamSelector'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useChampions } from '@/hooks/useChampions'
import { useTeamAnalysis } from '@/hooks/useTeamAnalysis'
import { Cpu, Sparkles, Swords } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const TEAM_SIZE = 5

function createEmptyTeam(): Array<string | null> {
  return Array.from({ length: TEAM_SIZE }, () => null)
}

export function TeamBuilderPage() {
  const { champions, isLoading: isLoadingChampions, isError: isErrorChampions } = useChampions()
  const { data, isLoading: isAnalyzing, isError: isAnalyzeError, analyzeTeam } = useTeamAnalysis()

  const [myTeam, setMyTeam] = useState<Array<string | null>>(createEmptyTeam)
  const [enemyTeam, setEnemyTeam] = useState<Array<string | null>>(createEmptyTeam)
  const [myChampion, setMyChampion] = useState<string | null>(null)
  const [fakeProgress, setFakeProgress] = useState(7)

  useEffect(() => {
    if (!isAnalyzing) {
      return
    }

    const intervalId = setInterval(() => {
      setFakeProgress((current) => {
        if (current >= 93) {
          return 93
        }

        return current + Math.max(1, Math.floor((96 - current) / 8))
      })
    }, 200)

    return () => {
      clearInterval(intervalId)
    }
  }, [isAnalyzing])

  const sortedChampions = useMemo(
    () => [...champions].sort((a, b) => a.name.localeCompare(b.name)),
    [champions],
  )

  const isMyTeamComplete = myTeam.every((championId) => Boolean(championId))
  const isEnemyTeamComplete = enemyTeam.every((championId) => Boolean(championId))
  const canAnalyze = isMyTeamComplete && isEnemyTeamComplete && Boolean(myChampion)

  const handleMyTeamChange = (slotIndex: number, championId: string | null) => {
    setMyTeam((current) => {
      const next = [...current]
      next[slotIndex] = championId
      return next
    })

    if (myChampion && championId === null && myTeam[slotIndex] === myChampion) {
      setMyChampion(null)
    }
  }

  const handleEnemyTeamChange = (slotIndex: number, championId: string | null) => {
    setEnemyTeam((current) => {
      const next = [...current]
      next[slotIndex] = championId
      return next
    })
  }

  const handleAnalyze = async () => {
    if (!canAnalyze || !myChampion) {
      return
    }

    setFakeProgress(7)

    const myTeamPayload = myTeam.filter((championId): championId is string => Boolean(championId))
    const enemyTeamPayload = enemyTeam.filter((championId): championId is string => Boolean(championId))

    await analyzeTeam({
      myTeam: myTeamPayload,
      enemyTeam: enemyTeamPayload,
      myChampion,
    })
  }

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/70 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-cyan-700 dark:border-cyan-400/30 dark:text-cyan-200">
          <Sparkles className="size-3.5" />
          Tactical Team Builder
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Analizador de Composicion 5v5
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
          Simula la partida completa y descubre build, macroestrategia y foco de teamfight para tu campeon.
        </p>
      </header>

      <TeamSelector
        champions={sortedChampions}
        myTeam={myTeam}
        enemyTeam={enemyTeam}
        myChampion={myChampion}
        onMyTeamChange={handleMyTeamChange}
        onEnemyTeamChange={handleEnemyTeamChange}
        onMyChampionChange={setMyChampion}
        disabled={isLoadingChampions || isAnalyzing}
      />

      <div className="flex justify-center">
        <Button
          type="button"
          onClick={handleAnalyze}
          disabled={!canAnalyze || isLoadingChampions || isAnalyzing}
          className="h-14 min-w-72 rounded-full border border-cyan-300/60 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 px-8 text-base font-semibold text-white shadow-[0_14px_36px_-18px_rgba(14,165,233,0.9)] transition-all hover:scale-[1.02] hover:shadow-[0_16px_42px_-18px_rgba(14,165,233,0.95)] dark:border-cyan-300/35"
        >
          {isAnalyzing ? (
            <span className="inline-flex items-center gap-2">
              <Cpu className="size-5 animate-pulse" />
              Calculando probabilidades de victoria...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Swords className="size-5" />
              Analizar Composicion 5v5
            </span>
          )}
        </Button>
      </div>

      {!isAnalyzing && !canAnalyze ? (
        <Card className="border-amber-300/60 bg-amber-100/70 dark:border-amber-300/30 dark:bg-amber-500/10">
          <CardContent className="p-4 text-sm text-amber-800 dark:text-amber-100">
            Completa los 10 slots y marca tu campeon en Blue Side para iniciar el analisis.
          </CardContent>
        </Card>
      ) : null}

      {isErrorChampions ? (
        <Card className="border-red-400/55 bg-red-100/70 dark:border-red-400/30 dark:bg-red-500/10">
          <CardContent className="p-4 text-sm text-red-700 dark:text-red-200">
            No pudimos cargar el listado de campeones. Revisa el backend y vuelve a intentarlo.
          </CardContent>
        </Card>
      ) : null}

      {isAnalyzing ? (
        <Card className="border-cyan-300/25 bg-card/70">
          <CardContent className="space-y-5 p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-200">
                Calculando probabilidades de victoria...
              </p>
              <Progress value={fakeProgress} className="h-2.5 bg-cyan-500/15" />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
            </div>

            <Skeleton className="h-28 w-full" />
          </CardContent>
        </Card>
      ) : null}

      {isAnalyzeError ? (
        <Card className="border-red-400/55 bg-red-100/70 dark:border-red-400/30 dark:bg-red-500/10">
          <CardContent className="p-6 text-sm text-red-700 dark:text-red-200">
            El analisis 5v5 fallo. Verifica el backend de IA tactica y vuelve a lanzar el calculo.
          </CardContent>
        </Card>
      ) : null}

      {!isAnalyzing && data ? <TeamAnalysisResult data={data} /> : null}
    </section>
  )
}
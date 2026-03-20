import { ChampionSelector } from '@/components/features/matchup/ChampionSelector'
import { MatchupResult } from '@/components/features/matchup/MatchupResult'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useChampions } from '@/hooks/useChampions'
import { useMatchupAnalysis } from '@/hooks/useMatchupAnalysis'
import { Swords, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'

export function MatchupPage() {
  const { champions, isLoading: isLoadingChampions, isError: isErrorChampions } = useChampions()
  const {
    data,
    isLoading: isAnalyzing,
    isError: isAnalyzeError,
    analyzeMatchup,
  } = useMatchupAnalysis()

  const [myChampion, setMyChampion] = useState<string | null>(null)
  const [enemyChampion, setEnemyChampion] = useState<string | null>(null)

  const championOptions = useMemo(
    () => [...champions].sort((a, b) => a.name.localeCompare(b.name)),
    [champions],
  )

  const canAnalyze = Boolean(myChampion && enemyChampion && myChampion !== enemyChampion)

  const handleAnalyze = async () => {
    if (!myChampion || !enemyChampion || myChampion === enemyChampion) {
      return
    }

    await analyzeMatchup({
      champion: myChampion,
      enemy: enemyChampion,
    })
  }

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/70 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-cyan-700 dark:border-cyan-400/30 dark:text-cyan-200">
          <Zap className="size-3.5" />
          Theorycrafting Core
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Analizador de Enfrentamientos 1v1
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
          Compara dos campeones y obtiene una recomendacion tactica de build para dominar la fase de linea.
        </p>
      </header>

      <Card className="overflow-hidden border-cyan-300/55 bg-card/85 dark:border-cyan-400/20 dark:bg-card/70">
        <CardContent className="space-y-6 p-4 sm:p-6">
          <div className="grid items-end gap-4 md:grid-cols-[1fr_auto_1fr]">
            <ChampionSelector
              label="Tu campeon"
              placeholder="Selecciona tu pick"
              value={myChampion}
              onChange={setMyChampion}
              champions={championOptions}
              disabled={isLoadingChampions || isAnalyzing}
            />

            <div className="flex justify-center">
              <Button
                type="button"
                onClick={handleAnalyze}
                disabled={!canAnalyze || isAnalyzing || isLoadingChampions}
                className="h-14 w-14 rounded-full border border-cyan-300/60 bg-gradient-to-br from-cyan-500 to-blue-500 text-base font-bold text-white shadow-[0_14px_30px_-14px_rgba(14,165,233,0.9)] transition-transform hover:scale-105 disabled:opacity-50 dark:border-cyan-300/40"
                aria-label="Analizar enfrentamiento"
              >
                {isAnalyzing ? <Swords className="size-5 animate-pulse" /> : 'VS'}
              </Button>
            </div>

            <ChampionSelector
              label="Campeon enemigo"
              placeholder="Selecciona rival"
              value={enemyChampion}
              onChange={setEnemyChampion}
              champions={championOptions}
              disabled={isLoadingChampions || isAnalyzing}
            />
          </div>

          {myChampion && enemyChampion && myChampion === enemyChampion ? (
            <p className="text-sm text-amber-700 dark:text-amber-300">Elige dos campeones distintos para iniciar el analisis.</p>
          ) : null}

          {isErrorChampions ? (
            <p className="text-sm text-red-700 dark:text-red-300">No pudimos cargar el listado de campeones.</p>
          ) : null}
        </CardContent>
      </Card>

      {isAnalyzing ? (
        <Card className="border-cyan-300/55 bg-card/85 dark:border-cyan-400/20 dark:bg-card/70">
          <CardContent className="space-y-4 p-6">
            <p className="animate-pulse text-center text-sm font-medium uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-200">
              Analizando tacticas de combate...
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ) : null}

      {isAnalyzeError ? (
        <Card className="border-red-400/55 bg-red-100/80 dark:border-red-400/30 dark:bg-red-500/10">
          <CardContent className="p-6 text-sm text-red-700 dark:text-red-200">
            El analisis fallo. Revisa que el backend de theorycrafting este disponible y vuelve a intentarlo.
          </CardContent>
        </Card>
      ) : null}

      {!isAnalyzing && data ? <MatchupResult data={data} /> : null}
    </section>
  )
}
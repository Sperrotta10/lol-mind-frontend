import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useStyleBuild } from '@/hooks/useStyleBuild'
import type { Champion } from '@/types/champion'
import { Dices, Sparkles, Swords } from 'lucide-react'

interface ChampionRouletteBoardProps {
  champions: Champion[]
  isLoadingChampions: boolean
  isErrorChampions: boolean
  selectedRoleLabel: string
}

interface StyleEntry {
  id: string | null
  name: string
  image: string | null
}

const SPIN_DURATION_MS = 3000
const TICK_MS = 50

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => {
      if (typeof item === 'string' && item.trim().length > 0) {
        return item
      }

      if (asRecord(item) && typeof item.name === 'string' && item.name.trim().length > 0) {
        return item.name
      }

      return null
    })
    .filter((item): item is string => typeof item === 'string')
}

function asStyleEntryArray(value: unknown): StyleEntry[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => {
      if (typeof item === 'string' && item.trim().length > 0) {
        return {
          id: null,
          name: item,
          image: null,
        }
      }

      const record = asRecord(item)
      if (!record || typeof record.name !== 'string' || record.name.trim().length === 0) {
        return null
      }

      return {
        id: typeof record.id === 'string' ? record.id : null,
        name: record.name,
        image: typeof record.image === 'string' ? record.image : null,
      }
    })
    .filter((item): item is StyleEntry => item !== null)
}

function collectStringArrays(...values: unknown[]): string[] {
  const collected = values.flatMap((value) => asStringArray(value))
  return Array.from(new Set(collected))
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null
}

export function ChampionRouletteBoard({
  champions,
  isLoadingChampions,
  isErrorChampions,
  selectedRoleLabel,
}: ChampionRouletteBoardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [winner, setWinner] = useState<Champion | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showExoticBuild, setShowExoticBuild] = useState(false)

  const {
    data: styleBuild,
    usedStyle,
    isLoading: isLoadingStyleBuild,
    isError: isStyleBuildError,
    generateStyleBuild,
    reset: resetStyleBuild,
  } = useStyleBuild()

  useEffect(() => {
    if (!isSpinning || champions.length === 0) {
      return
    }

    const startedAt = performance.now()
    let lastAdvanceAt = startedAt

    const intervalId = window.setInterval(() => {
      const now = performance.now()
      const elapsed = now - startedAt
      const progress = Math.min(1, elapsed / SPIN_DURATION_MS)
      const eased = progress * progress
      const dynamicStepMs = 40 + eased * 300

      if (now - lastAdvanceAt >= dynamicStepMs) {
        setCurrentIndex((index) => (index + 1) % champions.length)
        lastAdvanceAt = now
      }

      if (elapsed >= SPIN_DURATION_MS) {
        window.clearInterval(intervalId)

        const winnerIndex = Math.floor(Math.random() * champions.length)
        setCurrentIndex(winnerIndex)
        setWinner(champions[winnerIndex])
        setIsSpinning(false)
      }
    }, TICK_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isSpinning, champions])

  const displayChampion = useMemo(() => {
    if (champions.length === 0) {
      return null
    }

    const safeIndex = currentIndex % champions.length
    return champions[safeIndex]
  }, [champions, currentIndex])

  const startRoulette = () => {
    if (champions.length === 0 || isSpinning) {
      return
    }

    setWinner(null)
    setShowExoticBuild(false)
    resetStyleBuild()
    setIsSpinning(true)
  }

  const handleOpenExoticBuild = () => {
    if (!winner) {
      return
    }

    setShowExoticBuild(true)
    void generateStyleBuild(winner.id)
  }

  const styleBuildRecord = asRecord(styleBuild)
  const styleBuildNestedRecord = asRecord(styleBuildRecord?.build)
  const styleRunesRecord = asRecord(styleBuildRecord?.runes)
  const styleSkillsRecord = asRecord(styleBuildRecord?.skills)

  const styleItems = asStyleEntryArray(styleBuildRecord?.items)
  const styleItemNames = collectStringArrays(
    styleBuildRecord?.items,
    styleBuildRecord?.coreItems,
    styleBuildRecord?.situationalItems,
    styleBuildNestedRecord?.coreItems,
    styleBuildNestedRecord?.situationalItems,
  )
  const styleRunes = collectStringArrays(
    styleBuildRecord?.runes,
    styleRunesRecord?.primaryChoices,
    styleRunesRecord?.secondaryChoices,
    styleRunesRecord?.shards,
  )
  const styleTips = asStringArray(styleBuildRecord?.tips)
  const styleSkills = collectStringArrays(
    styleBuildRecord?.skillOrder,
    styleSkillsRecord?.abilityPriority,
    styleSkillsRecord?.levelingOrder,
  )
  const styleSummary = typeof styleBuildRecord?.summary === 'string' ? styleBuildRecord.summary : null
  const playstyleExplanation =
    typeof styleBuildRecord?.playstyleExplanation === 'string' ? styleBuildRecord.playstyleExplanation : null

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-slate-300/75 bg-[linear-gradient(140deg,rgba(236,254,255,0.92)_0%,rgba(255,255,255,0.95)_50%,rgba(224,231,255,0.88)_100%)] ring-cyan-500/20 dark:border-zinc-700/75 dark:bg-[linear-gradient(140deg,rgba(8,47,73,0.72)_0%,rgba(12,10,9,0.92)_50%,rgba(23,37,84,0.72)_100%)] dark:ring-cyan-500/25">
        <CardHeader className="space-y-3 border-b border-slate-300/70 dark:border-zinc-700/70">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:border-cyan-300/50 dark:bg-cyan-500/15 dark:text-cyan-100">
            <Sparkles className="size-3.5" />
            Ruleta Hextech
          </div>
          <CardTitle className="text-2xl text-slate-900 dark:text-zinc-50">Invoca un campeon para la partida</CardTitle>
          <p className="text-sm text-slate-600 dark:text-zinc-300">
            Pool activo: <span className="font-semibold text-cyan-700 dark:text-cyan-100">{selectedRoleLabel}</span> ({champions.length}{' '}
            campeones)
          </p>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {isErrorChampions ? (
            <p className="rounded-md border border-red-400/50 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:bg-red-500/15 dark:text-red-100">
              No se pudieron cargar campeones para este rol. Intenta cambiar el filtro.
            </p>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative rounded-2xl border border-cyan-400/35 bg-white/70 p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.12),0_18px_45px_-20px_rgba(8,145,178,0.35)] dark:bg-zinc-950/65 dark:shadow-[0_0_0_1px_rgba(34,211,238,0.15),0_18px_45px_-20px_rgba(34,211,238,0.65)]">
              <div className="absolute -left-8 top-1/2 hidden h-14 w-14 -translate-y-1/2 rounded-full border border-cyan-400/35 bg-cyan-500/15 backdrop-blur dark:border-cyan-300/35 dark:bg-cyan-500/20 lg:block" />
              <div className="absolute -right-8 top-1/2 hidden h-14 w-14 -translate-y-1/2 rounded-full border border-cyan-400/35 bg-cyan-500/15 backdrop-blur dark:border-cyan-300/35 dark:bg-cyan-500/20 lg:block" />

              {isLoadingChampions ? (
                <Skeleton className="h-[320px] w-full rounded-xl" />
              ) : displayChampion ? (
                <article className="relative overflow-hidden rounded-xl border border-slate-300/75 bg-slate-900/90 dark:border-zinc-700/75 dark:bg-zinc-900/80">
                  <img
                    src={displayChampion.splash}
                    alt={displayChampion.name}
                    className={[
                      'h-[320px] w-full object-cover transition-all duration-300',
                      isSpinning ? 'scale-[1.03] saturate-125 blur-[1px]' : 'scale-100 saturate-110',
                    ].join(' ')}
                    loading="lazy"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950 via-zinc-950/75 to-transparent px-4 py-4">
                    <p className="text-lg font-semibold tracking-wide text-zinc-50">{displayChampion.name}</p>
                    <p className="text-sm text-zinc-300">{displayChampion.title}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {displayChampion.tags.map((tag) => (
                        <Badge key={`${displayChampion.id}-${tag}`} variant="outline" className="border-cyan-300/45 bg-cyan-500/15 text-cyan-100">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </article>
              ) : (
                <p className="rounded-md border border-amber-300/55 bg-amber-200/45 px-3 py-2 text-sm text-amber-800 dark:bg-amber-200/20 dark:text-amber-100">
                  No hay campeones disponibles en este filtro.
                </p>
              )}
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-300/80 bg-white/75 p-4 dark:border-zinc-700/70 dark:bg-zinc-950/70">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-zinc-400">Estado de giro</p>
                <p className="text-sm text-slate-700 dark:text-zinc-200">
                  {isSpinning ? 'La rueda esta girando y desacelerando...' : 'Lista para invocar al proximo pick.'}
                </p>
              </div>

              <Button
                type="button"
                onClick={startRoulette}
                disabled={isSpinning || isLoadingChampions || champions.length === 0}
                className="h-16 w-full border border-cyan-300/55 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 text-base font-bold tracking-[0.08em] text-white shadow-[0_12px_34px_-16px_rgba(14,165,233,0.95)] transition-all hover:scale-[1.02]"
              >
                <Dices className={['size-5', isSpinning ? 'animate-spin' : ''].join(' ')} />
                GIRAR RULETA
              </Button>

              <p className="text-xs text-slate-500 dark:text-zinc-400">Duracion aproximada: 3 segundos con desaceleracion progresiva.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {winner ? (
        <Card className="animate-in zoom-in duration-500 border-emerald-400/45 bg-emerald-50/95 ring-emerald-300/30 dark:border-emerald-400/35 dark:bg-emerald-500/10 dark:ring-emerald-300/25">
          <CardHeader>
            <CardTitle className="text-xl text-emerald-900 dark:text-emerald-50">Campeon seleccionado: {winner.name}</CardTitle>
            <p className="text-sm text-emerald-800/85 dark:text-emerald-100/85">Tu invocacion ya esta lista. Decide el siguiente paso tactico.</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11 flex-1 bg-emerald-600 text-white shadow-[0_10px_24px_-16px_rgba(5,150,105,0.8)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400">
              <Link to={`/champions/${winner.id}`}>
                <Swords className="size-4" />
                Ver Build Meta
              </Link>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 border-cyan-400/55 bg-cyan-500/10 text-cyan-800 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-500/70 hover:bg-cyan-500/20 hover:text-cyan-900 dark:border-cyan-300/55 dark:text-cyan-100 dark:hover:border-cyan-300/70 dark:hover:bg-cyan-500/20 dark:hover:text-cyan-50"
              onClick={handleOpenExoticBuild}
            >
              <Sparkles className="size-4" />
              Generar Build Exotica
            </Button>
          </CardContent>

          {showExoticBuild ? (
            <CardContent className="pt-0">
              <Card className="animate-in fade-in zoom-in-95 duration-300 border-cyan-300/35 bg-zinc-950/70 py-3">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-base text-cyan-100">Build Exotica</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-zinc-300">
                    Campeon: {winner.name}
                    {usedStyle ? ` · Estilo: ${usedStyle}` : ''}
                  </p>
                </CardHeader>

                <CardContent>
                  {isLoadingStyleBuild ? (
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-2/3" />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    </div>
                  ) : isStyleBuildError ? (
                    <p className="rounded-md border border-red-400/45 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                      No se pudo generar la build exotica. Intenta nuevamente.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {styleSummary || playstyleExplanation ? (
                        <p className="rounded-md border border-violet-300/45 bg-violet-500/10 px-3 py-2 text-sm text-violet-100">
                          {styleSummary ?? playstyleExplanation}
                        </p>
                      ) : null}

                      <div className="grid gap-3 md:grid-cols-2">
                        <Card className="border-slate-300/75 bg-white/80 py-3 dark:border-zinc-700/75 dark:bg-zinc-900/70">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-slate-800 dark:text-zinc-100">Items recomendados</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {styleItems.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {styleItems.map((item, index) => (
                                  <Badge key={`style-item-${item.id ?? item.name}-${index}`} variant="outline" className="border-cyan-300/45 bg-cyan-500/10 text-cyan-100">
                                    {item.image ? <img src={item.image} alt={item.name} className="size-4 rounded-sm" loading="lazy" /> : null}
                                    {item.name}
                                  </Badge>
                                ))}
                              </div>
                            ) : styleItemNames.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {styleItemNames.map((item) => (
                                  <Badge key={`style-item-fallback-${item}`} variant="outline" className="border-cyan-300/45 bg-cyan-500/10 text-cyan-100">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-slate-500 dark:text-zinc-400">Sin items estructurados en la respuesta.</p>
                            )}
                          </CardContent>
                        </Card>

                        <Card className="border-slate-300/75 bg-white/80 py-3 dark:border-zinc-700/75 dark:bg-zinc-900/70">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-slate-800 dark:text-zinc-100">Runas / enfoque</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {styleRunes.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {styleRunes.map((rune) => (
                                  <Badge key={`style-rune-${rune}`} variant="secondary">
                                    {rune}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-slate-500 dark:text-zinc-400">Sin runas estructuradas en la respuesta.</p>
                            )}
                          </CardContent>
                        </Card>
                      </div>

                      {styleSkills.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-cyan-100">Orden de habilidades</p>
                          <div className="flex flex-wrap gap-2">
                            {styleSkills.map((skill) => (
                              <Badge key={`style-skill-${skill}`} variant="outline" className="border-indigo-300/45 bg-indigo-500/10 text-indigo-100">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {styleTips.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-cyan-100">Tips de uso</p>
                          <ul className="space-y-2 text-sm text-slate-700 dark:text-zinc-200">
                            {styleTips.map((tip) => (
                              <li key={tip} className="rounded-md border border-slate-300/80 bg-white/75 px-3 py-2 dark:border-zinc-700/70 dark:bg-zinc-900/80">
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {!styleSummary && !playstyleExplanation && styleItems.length === 0 && styleItemNames.length === 0 && styleRunes.length === 0 && styleTips.length === 0 ? (
                        <p className="rounded-md border border-slate-300/80 bg-white/75 px-3 py-2 text-sm text-slate-600 dark:border-zinc-700/70 dark:bg-zinc-900/80 dark:text-zinc-300">
                          La build exotica se genero, pero el backend no devolvio un formato visual estandar.
                        </p>
                      ) : null}
                    </div>
                  )}
                </CardContent>
              </Card>
            </CardContent>
          ) : null}
        </Card>
      ) : null}
    </div>
  )
}

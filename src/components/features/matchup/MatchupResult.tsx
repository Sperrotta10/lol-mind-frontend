import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { MatchupAnalysisResponse } from '@/types/builds'

interface MatchupResultProps {
  data: MatchupAnalysisResponse
}

interface PhaseRisk {
  phase: 'Early' | 'Mid' | 'Late'
  score: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function getPhaseLabel(score: number): string {
  if (score >= 75) {
    return 'Alto'
  }

  if (score >= 50) {
    return 'Medio'
  }

  return 'Bajo'
}

function getPhaseStyle(score: number): string {
  if (score >= 75) {
    return 'bg-red-500/70'
  }

  if (score >= 50) {
    return 'bg-amber-500/70'
  }

  return 'bg-emerald-500/70'
}

function computePhaseRisk(
  phaseTips: string[],
  riskAlerts: string[],
  phaseKeywords: string[],
): number {
  const normalizedAlerts = riskAlerts.map((alert) => alert.toLowerCase())

  const phaseAlertHits = normalizedAlerts.filter((alert) =>
    phaseKeywords.some((keyword) => alert.includes(keyword)),
  ).length

  const globalAlertPressure = Math.min(25, riskAlerts.length * 5)
  const planStabilityBonus = Math.min(15, phaseTips.length * 4)

  return clamp(35 + phaseAlertHits * 20 + globalAlertPressure - planStabilityBonus, 5, 95)
}

export function MatchupResult({ data }: MatchupResultProps) {
  const matchup = data.matchup
  const build = data.build
  const runes = data.runes
  const microPlan = data.microPlan

  const phaseRisk: PhaseRisk[] = [
    {
      phase: 'Early',
      score: computePhaseRisk(microPlan.earlyGame, matchup.riskAlerts, [
        'early',
        'nivel',
        'linea',
        'encanto',
      ]),
    },
    {
      phase: 'Mid',
      score: computePhaseRisk(microPlan.midGame, matchup.riskAlerts, [
        'mid',
        'rotaciones',
        'objetivos',
      ]),
    },
    {
      phase: 'Late',
      score: computePhaseRisk(microPlan.lateGame, matchup.riskAlerts, [
        'late',
        'team',
        'pelea',
        'flanquea',
      ]),
    },
  ]

  return (
    <section className="space-y-4 rounded-2xl border border-slate-300/75 bg-card/85 p-4 sm:p-6 dark:border-border/70 dark:bg-card/70">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Resultado Tactico</h2>
        <p className="text-sm text-muted-foreground">
          {matchup.allyChampion} vs {matchup.enemyChampion}
        </p>
      </header>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="border-cyan-300/55 bg-background/80 dark:border-cyan-300/20 dark:bg-background/70">
          <CardHeader>
            <CardTitle className="text-base">Build Recomendada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-cyan-700 dark:text-cyan-200">Inicio</p>
              {build.startingItems.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {build.startingItems.map((item) => (
                    <Badge key={`start-${item}`} variant="outline" className="border-cyan-300/55 bg-cyan-500/10 text-cyan-700 dark:border-cyan-300/40 dark:text-cyan-200">
                      {item}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sin items de inicio</p>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-cyan-700 dark:text-cyan-200">Core</p>
              <div className="flex flex-wrap gap-2">
                {build.coreItems.map((item) => (
                  <Badge key={`core-${item}`} variant="outline" className="border-sky-300/55 bg-sky-500/10 text-sky-700 dark:border-sky-300/40 dark:text-sky-200">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            {build.situationalItems.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-cyan-700 dark:text-cyan-200">Situacionales</p>
                <div className="flex flex-wrap gap-2">
                  {build.situationalItems.map((item) => (
                    <Badge key={`situ-${item}`} variant="secondary">{item}</Badge>
                  ))}
                </div>
              </div>
            ) : null}

            {build.boots ? (
              <p className="text-sm text-foreground/90">
                <span className="font-medium text-cyan-700 dark:text-cyan-300">Botas:</span> {build.boots}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-cyan-300/55 bg-background/80 dark:border-cyan-300/20 dark:bg-background/70">
          <CardHeader>
            <CardTitle className="text-base">Runas Recomendadas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Arbol primario: {runes.primaryTree}</p>
              {runes.primaryChoices.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {runes.primaryChoices.map((rune) => (
                    <Badge key={`primary-${rune}`} variant="outline" className="border-fuchsia-300/55 bg-fuchsia-500/10 text-fuchsia-700 dark:border-fuchsia-300/40 dark:text-fuchsia-200">{rune}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sin runas primarias</p>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Arbol secundario: {runes.secondaryTree}</p>
              <div className="flex flex-wrap gap-2">
                {runes.secondaryChoices.map((rune) => (
                  <Badge key={`secondary-${rune}`} variant="secondary">{rune}</Badge>
                ))}
              </div>
            </div>

            {runes.shards.length > 0 ? (
              <p className="text-sm text-foreground/90">
                <span className="font-medium text-cyan-700 dark:text-cyan-300">Shards:</span> {runes.shards.join(' · ')}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-cyan-300/55 bg-background/80 dark:border-cyan-300/20 dark:bg-background/70">
          <CardHeader>
            <CardTitle className="text-base">Riesgo por Fase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {phaseRisk.map((item) => (
              <div key={item.phase} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{item.phase} Game</span>
                  <span className="text-muted-foreground">{item.score}/100 · {getPhaseLabel(item.score)}</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted/60">
                  <div
                    className={[
                      'h-full rounded-full transition-all duration-500',
                      getPhaseStyle(item.score),
                    ].join(' ')}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}

            {matchup.riskAlerts.length > 0 ? (
              <div className="space-y-2 pt-1">
                <p className="text-sm font-medium text-red-700 dark:text-red-300">Alertas de riesgo</p>
                <ul className="space-y-2">
                  {matchup.riskAlerts.map((danger) => (
                    <li key={danger} className="rounded-md border border-red-400/55 bg-red-100/80 px-3 py-2 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-200">
                      {danger}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card className="border-cyan-300/55 bg-background/80 dark:border-cyan-300/20 dark:bg-background/70">
        <CardHeader>
          <CardTitle className="text-base">Plan Tactico por Fases</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {matchup.winCondition ? (
            <p className="text-sm text-foreground/90">
              <span className="font-medium text-cyan-700 dark:text-cyan-300">Win condition:</span> {matchup.winCondition}
            </p>
          ) : null}

          {matchup.lanePlan ? (
            <p className="rounded-md border border-border/60 bg-card/50 px-3 py-2 text-sm text-foreground/90">
              <span className="font-medium text-cyan-700 dark:text-cyan-300">Lane plan:</span> {matchup.lanePlan}
            </p>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-2 rounded-xl border border-cyan-300/55 bg-cyan-500/8 p-3 dark:border-cyan-300/20 dark:bg-cyan-500/5">
              <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-200">Early Game</p>
              <ul className="space-y-2">
                {microPlan.earlyGame.map((tip) => (
                  <li key={`early-${tip}`} className="text-sm text-foreground/90">• {tip}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 rounded-xl border border-violet-300/55 bg-violet-500/8 p-3 dark:border-violet-300/20 dark:bg-violet-500/5">
              <p className="text-sm font-semibold text-violet-700 dark:text-violet-200">Mid Game</p>
              <ul className="space-y-2">
                {microPlan.midGame.map((tip) => (
                  <li key={`mid-${tip}`} className="text-sm text-foreground/90">• {tip}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 rounded-xl border border-fuchsia-300/55 bg-fuchsia-500/8 p-3 dark:border-fuchsia-300/20 dark:bg-fuchsia-500/5">
              <p className="text-sm font-semibold text-fuchsia-700 dark:text-fuchsia-200">Late Game</p>
              <ul className="space-y-2">
                {microPlan.lateGame.map((tip) => (
                  <li key={`late-${tip}`} className="text-sm text-foreground/90">• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
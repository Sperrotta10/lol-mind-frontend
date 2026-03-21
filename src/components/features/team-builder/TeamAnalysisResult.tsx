import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { BuildEntry, TeamAnalysisResponseData } from '@/types/builds'
import { useState } from 'react'

interface TeamAnalysisResultProps {
  data: TeamAnalysisResponseData
}

function getEntryName(entry: BuildEntry): string {
  return typeof entry === 'string' ? entry : entry.name
}

function getEntryImage(entry: BuildEntry): string | null {
  return typeof entry === 'string' ? null : entry.image ?? null
}

export function TeamAnalysisResult({ data }: TeamAnalysisResultProps) {
  const composition = data.composition
  const recommendedBuild = composition?.recommendedBuild
  const explanation = composition?.explanation ?? data.explanation
  const [activeTab, setActiveTab] = useState('build')

  return (
    <section className="space-y-4 rounded-2xl border border-slate-300/75 bg-card/85 p-4 sm:p-6 dark:border-border/70 dark:bg-card/70">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Analisis Tactico 5v5</h2>
        {composition?.globalWinCondition ? (
          <p className="text-sm text-muted-foreground">{composition.globalWinCondition}</p>
        ) : null}
        {explanation ? (
          <p className="text-sm text-cyan-700 dark:text-cyan-200">
            <span className="font-medium">Enfoque para tu campeon:</span> {explanation}
          </p>
        ) : null}
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-4">
        <TabsList className="grid h-auto w-full grid-cols-3 bg-background/70">
          <TabsTrigger value="build">Build</TabsTrigger>
          <TabsTrigger value="composition">Composicion</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="build" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-1">
            <Card className="border-cyan-300/55 bg-background/80 dark:border-cyan-300/20 dark:bg-background/70">
              <CardHeader>
                <CardTitle className="text-base">Items para tu campeon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {explanation ? (
                  <p className="rounded-md border border-violet-300/55 bg-violet-500/8 px-3 py-2 text-sm text-foreground/90 dark:border-violet-300/20 dark:bg-violet-500/5">
                    <span className="font-medium text-violet-700 dark:text-violet-300">Explicacion del pick/build:</span>{' '}
                    {explanation}
                  </p>
                ) : null}

                <div className="space-y-2">
                  <p className="text-sm font-medium text-cyan-700 dark:text-cyan-200">Core</p>
                  {recommendedBuild?.coreItems?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {recommendedBuild.coreItems.map((item, index) => (
                        <Badge key={`core-${getEntryName(item)}-${index}`} variant="outline" className="border-sky-300/55 bg-sky-500/10 text-sky-700 dark:border-sky-300/40 dark:text-sky-200">
                          {getEntryImage(item) ? <img src={getEntryImage(item) ?? ''} alt={getEntryName(item)} className="size-4 rounded-sm" loading="lazy" /> : null}
                          {getEntryName(item)}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Sin items core en la respuesta.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-cyan-700 dark:text-cyan-200">Situacionales</p>
                  {recommendedBuild?.situationalItems?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {recommendedBuild.situationalItems.map((item, index) => (
                        <Badge key={`situ-${getEntryName(item)}-${index}`} variant="secondary">
                          {getEntryImage(item) ? <img src={getEntryImage(item) ?? ''} alt={getEntryName(item)} className="size-4 rounded-sm" loading="lazy" /> : null}
                          {getEntryName(item)}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Sin items situacionales en la respuesta.</p>
                  )}
                </div>

                {recommendedBuild?.boots ? (
                  <p className="text-sm text-foreground/90">
                    <span className="font-medium text-cyan-700 dark:text-cyan-300">Botas:</span> {getEntryName(recommendedBuild.boots)}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Sin recomendacion de botas.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="composition">
          <Card className="border-cyan-300/55 bg-background/80 dark:border-cyan-300/20 dark:bg-background/70">
            <CardHeader>
              <CardTitle className="text-base">Lectura de composiciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {composition?.myTeamDamageProfile ? (
                <p className="rounded-md border border-border/60 bg-card/50 px-3 py-2 text-sm text-foreground/90">
                  <span className="font-medium text-cyan-700 dark:text-cyan-300">Perfil de dano (mi equipo):</span>{' '}
                  {composition.myTeamDamageProfile}
                </p>
              ) : null}

              {composition?.enemyTeamDamageProfile ? (
                <p className="rounded-md border border-border/60 bg-card/50 px-3 py-2 text-sm text-foreground/90">
                  <span className="font-medium text-rose-700 dark:text-rose-300">Perfil de dano (enemigo):</span>{' '}
                  {composition.enemyTeamDamageProfile}
                </p>
              ) : null}

              {composition?.ccAdvantage ? (
                <p className="rounded-md border border-amber-300/55 bg-amber-100/70 px-3 py-2 text-sm text-amber-800 dark:border-amber-300/30 dark:bg-amber-500/10 dark:text-amber-100">
                  <span className="font-medium">Ventaja de CC:</span> {composition.ccAdvantage}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card className="border-cyan-300/55 bg-background/80 dark:border-cyan-300/20 dark:bg-background/70">
              <CardHeader>
                <CardTitle className="text-base">Insights tacticos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {composition?.globalWinCondition ? (
                  <p className="rounded-md border border-cyan-300/55 bg-cyan-500/8 px-3 py-2 text-sm text-foreground/90 dark:border-cyan-300/20 dark:bg-cyan-500/5">
                    <span className="font-medium text-cyan-700 dark:text-cyan-300">Win condition global:</span>{' '}
                    {composition.globalWinCondition}
                  </p>
                ) : null}

                {explanation ? (
                  <p className="rounded-md border border-violet-300/55 bg-violet-500/8 px-3 py-2 text-sm text-foreground/90 dark:border-violet-300/20 dark:bg-violet-500/5">
                    <span className="font-medium text-violet-700 dark:text-violet-300">Explicacion del pick/build:</span>{' '}
                    {explanation}
                  </p>
                ) : null}
              </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

      {!composition ? (
        <Card className="border-amber-300/60 bg-amber-100/70 dark:border-amber-300/30 dark:bg-amber-500/10">
          <CardContent className="p-4 text-sm text-amber-800 dark:text-amber-100">
            El backend no devolvio el bloque composition en la respuesta.
          </CardContent>
        </Card>
      ) : null}
    </section>
  )
}
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { TeamAnalysisResponseData } from '@/types/builds'

interface TeamAnalysisResultProps {
  data: TeamAnalysisResponseData
}

export function TeamAnalysisResult({ data }: TeamAnalysisResultProps) {
  const build = data.build
  const macro = data.macro
  const teamfight = data.teamfight

  return (
    <section className="space-y-4 rounded-2xl border border-border/70 bg-card/70 p-4 sm:p-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Analisis Tactico 5v5</h2>
        {data.compositionSummary ? (
          <p className="text-sm text-muted-foreground">{data.compositionSummary}</p>
        ) : null}
        {data.winCondition ? (
          <p className="text-sm text-cyan-200">
            <span className="font-medium">Win condition:</span> {data.winCondition}
          </p>
        ) : null}
      </header>

      <Tabs defaultValue="build" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-background/70">
          <TabsTrigger value="build">Build</TabsTrigger>
          <TabsTrigger value="macro">Macroestrategia</TabsTrigger>
          <TabsTrigger value="teamfight">Teamfight</TabsTrigger>
        </TabsList>

        <TabsContent value="build" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-cyan-300/20 bg-background/70">
              <CardHeader>
                <CardTitle className="text-base">Items para tu campeon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-cyan-200">Inicio</p>
                  <div className="flex flex-wrap gap-2">
                    {build?.startingItems?.map((item) => (
                      <Badge key={`start-${item}`} variant="outline" className="border-cyan-300/40 bg-cyan-500/10 text-cyan-200">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-cyan-200">Core</p>
                  <div className="flex flex-wrap gap-2">
                    {build?.coreItems?.map((item) => (
                      <Badge key={`core-${item}`} variant="outline" className="border-sky-300/40 bg-sky-500/10 text-sky-200">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-cyan-200">Situacionales</p>
                  <div className="flex flex-wrap gap-2">
                    {build?.situationalItems?.map((item) => (
                      <Badge key={`situ-${item}`} variant="secondary">{item}</Badge>
                    ))}
                  </div>
                </div>

                {build?.boots ? (
                  <p className="text-sm text-foreground/90">
                    <span className="font-medium text-cyan-300">Botas:</span> {build.boots}
                  </p>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-cyan-300/20 bg-background/70">
              <CardHeader>
                <CardTitle className="text-base">Runas sugeridas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {build?.runes?.primaryTree ? (
                  <p className="text-sm text-foreground/90">
                    <span className="font-medium text-cyan-300">Primario:</span> {build.runes.primaryTree}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {build?.runes?.primaryChoices?.map((rune) => (
                    <Badge key={`pri-${rune}`} variant="outline" className="border-fuchsia-300/40 bg-fuchsia-500/10 text-fuchsia-200">
                      {rune}
                    </Badge>
                  ))}
                </div>

                {build?.runes?.secondaryTree ? (
                  <p className="text-sm text-foreground/90">
                    <span className="font-medium text-cyan-300">Secundario:</span> {build.runes.secondaryTree}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {build?.runes?.secondaryChoices?.map((rune) => (
                    <Badge key={`sec-${rune}`} variant="secondary">{rune}</Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {build?.runes?.shards?.map((shard) => (
                    <Badge key={`sha-${shard}`} variant="outline">{shard}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="macro">
          <Card className="border-cyan-300/20 bg-background/70">
            <CardHeader>
              <CardTitle className="text-base">Plan macro por fases</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {macro?.globalStrategy ? (
                <p className="rounded-md border border-border/60 bg-card/50 px-3 py-2 text-sm text-foreground/90">
                  {macro.globalStrategy}
                </p>
              ) : null}

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="early">
                  <AccordionTrigger>Early Game</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {macro?.earlyGamePlan?.map((tip) => (
                        <li key={`macro-early-${tip}`} className="text-sm text-foreground/90">• {tip}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mid">
                  <AccordionTrigger>Mid Game</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {macro?.midGamePlan?.map((tip) => (
                        <li key={`macro-mid-${tip}`} className="text-sm text-foreground/90">• {tip}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="late">
                  <AccordionTrigger>Late Game</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {macro?.lateGamePlan?.map((tip) => (
                        <li key={`macro-late-${tip}`} className="text-sm text-foreground/90">• {tip}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {macro?.objectivePriority?.length ? (
                <div>
                  <p className="mb-2 text-sm font-medium text-cyan-300">Prioridad de objetivos</p>
                  <div className="flex flex-wrap gap-2">
                    {macro.objectivePriority.map((objective) => (
                      <Badge key={objective} variant="outline">{objective}</Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teamfight">
          <Card className="border-cyan-300/20 bg-background/70">
            <CardHeader>
              <CardTitle className="text-base">Foco en Teamfight</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamfight?.roleInTeamfight ? (
                <p className="text-sm text-foreground/90">
                  <span className="font-medium text-cyan-300">Tu rol:</span> {teamfight.roleInTeamfight}
                </p>
              ) : null}

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="target-priority">
                  <AccordionTrigger>Target Priority</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {teamfight?.targetPriority?.map((tip) => (
                        <li key={`tf-target-${tip}`} className="text-sm text-foreground/90">• {tip}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="engage-pattern">
                  <AccordionTrigger>Patron de engage</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {teamfight?.engagePattern?.map((tip) => (
                        <li key={`tf-engage-${tip}`} className="text-sm text-foreground/90">• {tip}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="positioning">
                  <AccordionTrigger>Posicionamiento</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {teamfight?.positioningTips?.map((tip) => (
                        <li key={`tf-pos-${tip}`} className="text-sm text-foreground/90">• {tip}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {teamfight?.dangerAlerts?.length ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-300">Alertas de riesgo</p>
                  {teamfight.dangerAlerts.map((alert) => (
                    <p key={alert} className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                      {alert}
                    </p>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}
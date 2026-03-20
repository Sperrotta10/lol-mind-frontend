import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowRight,
  BookOpen,
  Crosshair,
  Dices,
  Shield,
  Sparkles,
  Swords,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'

type Feature = {
  title: string
  description: string
  to: string
  icon: LucideIcon
  tone: string
}

const features: Feature[] = [
  {
    title: 'Catalogo y Meta',
    description: 'Busca campeones en tiempo real, filtra por rol y detecta picks fuertes del parche actual.',
    to: '/champions',
    icon: BookOpen,
    tone: 'from-sky-500/12 to-cyan-500/6 dark:from-sky-500/20 dark:to-cyan-500/10',
  },
  {
    title: 'Analizador 1v1',
    description: 'Simula enfrentamientos directos y recibe recomendaciones de build para dominar el duelo.',
    to: '/tools/matchup',
    icon: Crosshair,
    tone: 'from-indigo-500/12 to-blue-500/6 dark:from-indigo-500/20 dark:to-blue-500/10',
  },
  {
    title: 'Team Builder 5v5',
    description: 'Evalua sinergias, condiciones de victoria y prioridad tactica para cada composicion.',
    to: '/tools/team-builder',
    icon: Shield,
    tone: 'from-emerald-500/12 to-teal-500/6 dark:from-emerald-500/20 dark:to-teal-500/10',
  },
  {
    title: 'Ruleta Hextech',
    description: 'Activa ruletas por linea para practicar picks inesperados o decidir en segundos.',
    to: '/tools/roulette',
    icon: Dices,
    tone: 'from-cyan-500/12 to-sky-500/6 dark:from-cyan-500/20 dark:to-sky-500/10',
  },
]

export function HomePage() {
  return (
    <section className="relative isolate space-y-12 overflow-hidden pb-4 sm:space-y-16 lg:space-y-20">
      <div className="pointer-events-none absolute -top-28 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-500/15" />
      <div className="pointer-events-none absolute right-0 top-1/4 h-56 w-56 rounded-full bg-emerald-400/8 blur-3xl dark:bg-emerald-400/10" />

      <header className="relative rounded-3xl border border-border/70 bg-card/50 px-5 py-10 backdrop-blur-sm sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        <div className="absolute inset-0 rounded-3xl bg-[linear-gradient(115deg,rgba(14,165,233,0.12),transparent_45%,rgba(16,185,129,0.1))]" />
        <div className="relative space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/45 bg-sky-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-800 dark:border-sky-300/40 dark:bg-sky-500/10 dark:text-sky-200">
            <Sparkles className="size-3.5" />
            Tactical AI Assistant
          </p>

          <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              Domina la Grieta con Inteligencia
            </span>
          </h1>

          <p className="max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
            Lol-Mind es tu asistente tactico y laboratorio de theorycrafting. Analiza matchups, optimiza
            composiciones de equipo y descubre builds rompe-metas impulsadas por IA.
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 px-5 text-sm font-semibold text-white shadow-[0_14px_34px_-16px_rgba(14,165,233,0.95)] transition-all duration-300 hover:scale-[1.015] hover:shadow-[0_18px_40px_-14px_rgba(16,185,129,0.85)]"
            >
              <Link to="/tools/team-builder">
                Probar Team Builder
                <Swords className="size-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 rounded-xl border-border/70 bg-background/50 px-5 text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/60 hover:bg-cyan-500/10"
            >
              <Link to="/champions">
                Explorar Campeones
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-200/90">Herramientas Core</p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Tu stack tactico en una sola interfaz
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <Card
                key={feature.title}
                className="group relative border border-border/75 bg-card/70 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/35 hover:shadow-[0_18px_40px_-28px_rgba(14,116,144,0.42)] dark:hover:border-cyan-300/45 dark:hover:shadow-[0_18px_40px_-26px_rgba(56,189,248,0.9)]"
              >
                <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className={`h-full w-full bg-gradient-to-br ${feature.tone}`} />
                </div>

                <CardHeader className="relative space-y-2">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-sky-500/35 bg-sky-500/15 text-sky-800 dark:border-sky-300/35 dark:bg-sky-500/15 dark:text-sky-200">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-lg text-foreground">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative pt-0">
                  <Button
                    asChild
                    variant="ghost"
                    className="h-9 px-0 text-cyan-700 hover:bg-transparent hover:text-cyan-800 dark:text-cyan-200 dark:hover:text-cyan-100"
                  >
                    <Link to={feature.to}>
                      Abrir herramienta
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card/55 p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
              Actualizado al parche actual
            </p>
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
              Datos de campeones, tendencias de meta y rutas de build sincronizadas para decisiones mas precisas.
            </p>
          </div>

          <Button
            asChild
            className="h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 text-sm font-semibold text-white shadow-[0_12px_28px_-16px_rgba(16,185,129,0.95)] transition-all duration-300 hover:scale-[1.015]"
          >
            <Link to="/champions">
              Ir al Catalogo
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </section>
  )
}

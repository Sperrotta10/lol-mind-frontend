import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Champion } from '@/types/champion'
import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ChampionDetailViewProps {
  champion: Champion
}

export function ChampionDetailView({ champion }: ChampionDetailViewProps) {
  return (
    <section className="space-y-6">
      <Button asChild variant="outline" size="sm">
        <Link to="/champions" className="inline-flex items-center gap-1">
          <ChevronLeft className="size-4" />
          Volver al catalogo
        </Link>
      </Button>

      <Card className="overflow-hidden border-slate-300/75 bg-card/90 dark:border-border/70 dark:bg-card/80">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
          <div className="relative min-h-[320px] border-b border-border/60 lg:min-h-[560px] lg:border-b-0 lg:border-r">
            <img
              src={champion.imageUrl}
              alt={`Arte de ${champion.name}`}
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </div>

          <CardContent className="flex flex-col justify-between gap-8 p-6 sm:p-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-700 dark:text-cyan-300/85">League of Legends</p>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {champion.name}
              </h1>
              <p className="text-lg text-muted-foreground">{champion.title}</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Roles
              </h2>
              <div className="flex flex-wrap gap-2">
                {champion.tags.map((tag) => (
                  <Badge
                    key={`${champion.id}-${tag}`}
                    variant="outline"
                    className="border-cyan-300/55 bg-cyan-500/10 text-cyan-700 dark:border-cyan-300/35 dark:text-cyan-200"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </section>
  )
}

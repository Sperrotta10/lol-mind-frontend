import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Champion } from '@/types/champion'
import { Link } from 'react-router-dom'

interface ChampionCardProps {
  champion: Champion
}

export function ChampionCard({ champion }: ChampionCardProps) {
  return (
    <Link to={`/champions/${champion.id}`} className="group block focus:outline-none">
      <Card className="h-full overflow-hidden border-border/70 bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/60 hover:shadow-[0_0_24px_-8px_rgba(34,211,238,0.6)] focus-visible:ring-2 focus-visible:ring-cyan-400/70">
        <div className="relative aspect-[4/5] overflow-hidden border-b border-border/60">
          <img
            src={champion.imageUrl}
            alt={`Arte de ${champion.name}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        </div>

        <CardContent className="space-y-3 p-4">
          <div>
            <h3 className="text-base font-semibold tracking-wide text-foreground">{champion.name}</h3>
            <p className="text-sm text-muted-foreground">{champion.title}</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {champion.tags.map((tag) => (
              <Badge
                key={`${champion.id}-${tag}`}
                variant="outline"
                className="border-cyan-300/30 bg-cyan-500/10 text-[11px] tracking-wide text-cyan-200"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

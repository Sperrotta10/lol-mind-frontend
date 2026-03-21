import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { BuildEntry, ChampionMetaBuildData } from '@/types/builds'
import { AlertTriangle, RefreshCcw, Sparkles } from 'lucide-react'

interface MetaBuildPanelProps {
  data: ChampionMetaBuildData | null
  isLoading: boolean
  isError: boolean
  onRetry?: () => void
}

function getEntryName(entry: BuildEntry): string {
  return typeof entry === 'string' ? entry : entry.name
}

function getEntryImage(entry: BuildEntry): string | null {
  return typeof entry === 'string' ? null : entry.image ?? null
}

function renderBadges(items: BuildEntry[] | undefined, prefix: string) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-zinc-400">Sin datos disponibles.</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <Badge key={`${prefix}-${getEntryName(item)}-${index}`} variant="outline" className="border-cyan-400/55 bg-cyan-500/10 text-cyan-800 dark:border-cyan-300/45 dark:text-cyan-100">
          {getEntryImage(item) ? <img src={getEntryImage(item) ?? ''} alt={getEntryName(item)} className="size-4 rounded-sm" loading="lazy" /> : null}
          {getEntryName(item)}
        </Badge>
      ))}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-40" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
      <Skeleton className="h-20 w-full rounded-xl" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}

export function MetaBuildPanel({ data, isLoading, isError, onRetry }: MetaBuildPanelProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-300/75 bg-white/90 dark:border-zinc-700/75 dark:bg-zinc-900/70">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-zinc-100">Build Meta (Parche Actual)</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="border-red-400/45 bg-red-500/10">
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2 text-red-700 dark:text-red-100">
            <AlertTriangle className="size-4" />
            Estrategia no disponible
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-red-700/90 dark:text-red-100/90">
          <p>No se pudo cargar la build meta para este campeon.</p>
          {onRetry ? (
            <Button type="button" variant="outline" onClick={onRetry} className="border-red-300/60 bg-red-500/10 text-red-700 hover:bg-red-500/20 dark:border-red-300/50 dark:text-red-100">
              <RefreshCcw className="size-4" />
              Reintentar
            </Button>
          ) : null}
        </CardContent>
      </Card>
    )
  }

  const hasBuildData = Boolean(
    data?.build?.coreItems?.length ||
      data?.build?.startingItems?.length ||
      data?.build?.situationalItems?.length ||
      data?.runes?.primaryChoices?.length ||
      data?.skills?.abilityPriority?.length,
  )

  if (!data || !hasBuildData) {
    return (
      <Card className="border-slate-300/75 bg-white/90 dark:border-zinc-700/75 dark:bg-zinc-900/70">
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2 text-slate-900 dark:text-zinc-100">
            <Sparkles className="size-4" />
            Build Meta (Parche Actual)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600 dark:text-zinc-300">
          <p className="rounded-lg border border-slate-300/75 bg-slate-50/80 px-3 py-3 dark:border-zinc-700/70 dark:bg-zinc-950/70">
            Estrategia no disponible.
          </p>
          <p className="text-slate-500 dark:text-zinc-400">Aun no tenemos una build generada para este campeon en el parche actual.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-300/75 bg-white/90 dark:border-zinc-700/75 dark:bg-zinc-900/70">
      <CardHeader className="space-y-3">
        <CardTitle className="text-slate-900 dark:text-zinc-100">Build Meta (Parche Actual)</CardTitle>
        <div className="flex flex-wrap gap-2">
          {data.patch ? <Badge className="bg-cyan-500/15 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-100">Parche {data.patch}</Badge> : null}
          {typeof data.winRate === 'number' ? <Badge variant="outline" className="border-emerald-400/45 bg-emerald-500/10 text-emerald-800 dark:border-emerald-300/45 dark:text-emerald-100">Winrate {data.winRate.toFixed(1)}%</Badge> : null}
          {typeof data.pickRate === 'number' ? <Badge variant="outline" className="border-indigo-400/45 bg-indigo-500/10 text-indigo-800 dark:border-indigo-300/45 dark:text-indigo-100">Pickrate {data.pickRate.toFixed(1)}%</Badge> : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.playstyle ? (
          <p className="rounded-lg border border-violet-300/55 bg-violet-500/10 px-3 py-2 text-sm text-violet-800 dark:border-violet-300/45 dark:text-violet-100">{data.playstyle}</p>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          <Card className="border-slate-300/75 bg-slate-50/85 py-3 dark:border-zinc-700/75 dark:bg-zinc-950/65">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-800 dark:text-zinc-100">Objetos Core</CardTitle>
            </CardHeader>
            <CardContent>{renderBadges(data.build?.coreItems, 'core')}</CardContent>
          </Card>

          <Card className="border-slate-300/75 bg-slate-50/85 py-3 dark:border-zinc-700/75 dark:bg-zinc-950/65">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-800 dark:text-zinc-100">Objetos Situacionales</CardTitle>
            </CardHeader>
            <CardContent>{renderBadges(data.build?.situationalItems, 'situ')}</CardContent>
          </Card>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Card className="border-slate-300/75 bg-slate-50/85 py-3 dark:border-zinc-700/75 dark:bg-zinc-950/65">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-800 dark:text-zinc-100">Runas Principales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.runes?.primaryTree ? <p className="text-xs uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">{getEntryName(data.runes.primaryTree)}</p> : null}
              {renderBadges(data.runes?.primaryChoices, 'runes-primary')}
            </CardContent>
          </Card>

          <Card className="border-slate-300/75 bg-slate-50/85 py-3 dark:border-zinc-700/75 dark:bg-zinc-950/65">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-800 dark:text-zinc-100">Runas Secundarias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.runes?.secondaryTree ? <p className="text-xs uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">{getEntryName(data.runes.secondaryTree)}</p> : null}
              {renderBadges(data.runes?.secondaryChoices, 'runes-secondary')}
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-300/75 bg-slate-50/85 py-3 dark:border-zinc-700/75 dark:bg-zinc-950/65">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-800 dark:text-zinc-100">Orden de Habilidades</CardTitle>
          </CardHeader>
          <CardContent>{renderBadges(data.skills?.abilityPriority ?? data.skills?.levelingOrder, 'skills')}</CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

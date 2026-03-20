import { ChampionCard } from '@/components/features/champions/ChampionCard'
import { ChampionCardSkeleton } from '@/components/features/champions/ChampionCardSkeleton'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useChampions } from '@/hooks/useChampions'
import { CHAMPION_ROLES, type ChampionFilterRole } from '@/types/champion'
import { Search } from 'lucide-react'
import { useDeferredValue, useMemo, useState } from 'react'

export function ChampionsPage() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<ChampionFilterRole>('All')
  const deferredSearch = useDeferredValue(search)

  const selectedTag = useMemo(
    () => (role === 'All' ? undefined : role),
    [role],
  )

  const { champions, isLoading, isError } = useChampions({
    search: deferredSearch,
    tag: selectedTag,
  })

  return (
    <section className="space-y-8">
      <header className="rounded-2xl border border-slate-300/75 bg-card/85 p-4 sm:p-6 dark:border-border/70 dark:bg-card/70">
        <div className="mb-5">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Catalogo de Campeones</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explora campeones por rol y encuentra picks para cada estrategia.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar campeon..."
              className="h-11 border-border/70 bg-background pl-9"
              aria-label="Buscar campeon"
            />
          </div>

          <Select
            value={role}
            onValueChange={(value) => setRole(value as ChampionFilterRole)}
          >
            <SelectTrigger className="h-11 border-border/70 bg-background">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              {CHAMPION_ROLES.map((roleOption) => (
                <SelectItem key={roleOption} value={roleOption}>
                  {roleOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {isError ? (
        <div className="rounded-2xl border border-red-400/55 bg-red-100/80 p-6 text-sm text-red-700 dark:border-red-400/40 dark:bg-red-500/10 dark:text-red-200">
          No pudimos cargar los campeones. Intenta de nuevo en unos segundos.
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => <ChampionCardSkeleton key={index} />)
          : champions.map((champion) => (
              <ChampionCard key={champion.id} champion={champion} />
            ))}
      </div>

      {!isLoading && !isError && champions.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-muted/40 p-6 text-sm text-muted-foreground">
          No encontramos campeones con esos filtros.
        </div>
      ) : null}
    </section>
  )
}

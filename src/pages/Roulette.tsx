import { ChampionRouletteBoard } from '@/components/features/roulette/ChampionRouletteBoard'
import { RoleSelector } from '@/components/features/roulette/RoleSelector'
import { Card, CardContent } from '@/components/ui/card'
import { useChampions } from '@/hooks/useChampions'
import { type ChampionFilterRole } from '@/types/champion'
import { Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'

const ROLE_LABELS: Record<ChampionFilterRole, string> = {
  All: 'Todos',
  Fighter: 'Fighter',
  Mage: 'Mage',
  Assassin: 'Assassin',
  Tank: 'Tank',
  Marksman: 'Marksman',
  Support: 'Support',
}

export function RoulettePage() {
  const [selectedRole, setSelectedRole] = useState<ChampionFilterRole>('All')

  const effectiveTag = selectedRole === 'All' ? undefined : selectedRole
  const { champions, isLoading, isError } = useChampions({ tag: effectiveTag })

  const selectedRoleLabel = useMemo(() => ROLE_LABELS[selectedRole], [selectedRole])

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 py-2">
      <header className="space-y-3 text-center">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-400/55 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-200">
          <Sparkles className="size-3.5" />
          Modo Ludico
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Ruleta Interactiva de Campeones</h1>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
          Filtra por rol, gira la ruleta y descubre tu pick sorpresa para la siguiente partida.
        </p>
      </header>

      <Card className="border-slate-300/70 bg-white/85 dark:border-zinc-700/70 dark:bg-zinc-900/55">
        <CardContent className="space-y-4 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-zinc-400">Selecciona el pool de la ruleta</p>
          <RoleSelector selectedRole={selectedRole} onRoleChange={setSelectedRole} disabled={isLoading} />
        </CardContent>
      </Card>

      <ChampionRouletteBoard
        champions={champions}
        isLoadingChampions={isLoading}
        isErrorChampions={isError}
        selectedRoleLabel={selectedRoleLabel}
      />
    </section>
  )
}

import { CHAMPION_ROLES, type ChampionFilterRole } from '@/types/champion'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface RoleSelectorProps {
  selectedRole: ChampionFilterRole
  onRoleChange: (value: ChampionFilterRole) => void
  disabled?: boolean
}

const roleLabel: Record<ChampionFilterRole, string> = {
  All: 'Todos',
  Fighter: 'Fighter',
  Mage: 'Mage',
  Assassin: 'Assassin',
  Tank: 'Tank',
  Marksman: 'Marksman',
  Support: 'Support',
}

export function RoleSelector({ selectedRole, onRoleChange, disabled = false }: RoleSelectorProps) {
  return (
    <Tabs
      value={selectedRole}
      onValueChange={(value) => onRoleChange(value as ChampionFilterRole)}
      className="w-full"
    >
      <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-slate-100/80 p-2 dark:bg-zinc-900/70 sm:grid-cols-4 lg:grid-cols-7">
        {CHAMPION_ROLES.map((role) => (
          <TabsTrigger
            key={role}
            value={role}
            disabled={disabled}
            className="min-h-10 border border-slate-300/80 bg-white/90 text-slate-700 text-xs font-semibold uppercase tracking-[0.08em] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/70 hover:bg-cyan-500/12 hover:text-cyan-700 data-active:border-cyan-500/70 data-active:bg-cyan-500/15 data-active:text-cyan-800 dark:border-zinc-700/70 dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:border-sky-300/70 dark:hover:bg-sky-500/18 dark:hover:text-sky-100 dark:data-active:border-cyan-400/60 dark:data-active:bg-cyan-500/20 dark:data-active:text-cyan-100"
          >
            {roleLabel[role]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

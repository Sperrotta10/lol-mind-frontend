import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { Champion } from '@/types/champion'
import { Check, ChevronsUpDown, Shield, Swords } from 'lucide-react'
import { useMemo, useState } from 'react'

interface TeamSelectorProps {
  champions: Champion[]
  myTeam: Array<string | null>
  enemyTeam: Array<string | null>
  myChampion: string | null
  onMyTeamChange: (slotIndex: number, championId: string | null) => void
  onEnemyTeamChange: (slotIndex: number, championId: string | null) => void
  onMyChampionChange: (championId: string | null) => void
  disabled?: boolean
}

interface TeamSlotSelectorProps {
  label: string
  value: string | null
  champions: Champion[]
  disabled?: boolean
  onChange: (championId: string | null) => void
  isMyChampion?: boolean
  onSetMyChampion?: () => void
}

function TeamSlotSelector({
  label,
  value,
  champions,
  disabled = false,
  onChange,
  isMyChampion = false,
  onSetMyChampion,
}: TeamSlotSelectorProps) {
  const [open, setOpen] = useState(false)

  const selected = useMemo(
    () => champions.find((champion) => champion.id === value),
    [champions, value],
  )

  return (
    <div className={[
      'rounded-xl border bg-card/85 p-3 transition-all',
      isMyChampion
        ? 'border-cyan-400/60 shadow-[0_12px_30px_-16px_rgba(14,165,233,0.55)] dark:border-cyan-300/70 dark:shadow-[0_0_20px_-8px_rgba(34,211,238,0.75)]'
        : 'border-border/80 hover:border-slate-300/90 dark:hover:border-slate-600',
    ].join(' ')}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300">{label}</p>

        <div className="flex h-6 w-10 items-center justify-end">
          {onSetMyChampion ? (
            <Button
              type="button"
              size="xs"
              variant={isMyChampion ? 'default' : 'outline'}
              onClick={onSetMyChampion}
              disabled={!value || disabled}
              className="h-6 w-10 px-0"
            >
              Tu
            </Button>
          ) : (
            <span className="h-6 w-10" aria-hidden="true" />
          )}
        </div>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="h-11 w-full justify-between rounded-lg border-border/80 bg-background px-3 text-left text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800/70"
          >
            <span className="truncate">{selected?.name ?? 'Seleccionar campeon'}</span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-70" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] rounded-xl border border-slate-200 p-0 shadow-xl shadow-slate-900/10 dark:border-slate-700"
          align="start"
          sideOffset={8}
        >
          <Command className="rounded-xl bg-popover/95 backdrop-blur">
            <CommandInput placeholder="Buscar campeon..." />
            <CommandList className="max-h-60">
              <CommandEmpty>Sin resultados</CommandEmpty>
              <CommandGroup className="p-1">
                <CommandItem
                  value="clear"
                  onSelect={() => {
                    onChange(null)
                    setOpen(false)
                  }}
                  className="rounded-md text-slate-600 dark:text-slate-200"
                >
                  Limpiar slot
                </CommandItem>
                {champions.map((champion) => (
                  <CommandItem
                    key={champion.id}
                    value={`${champion.id} ${champion.name}`}
                    onSelect={() => {
                      onChange(champion.id)
                      setOpen(false)
                    }}
                    className="flex items-center justify-between rounded-md"
                  >
                    <span>{champion.name}</span>
                    <Check
                      className={[
                        'size-4 text-cyan-500 transition-opacity dark:text-cyan-400',
                        value === champion.id ? 'opacity-100' : 'opacity-0',
                      ].join(' ')}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function TeamSelector({
  champions,
  myTeam,
  enemyTeam,
  myChampion,
  onMyTeamChange,
  onEnemyTeamChange,
  onMyChampionChange,
  disabled = false,
}: TeamSelectorProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <section className="space-y-3 rounded-2xl border border-sky-300/55 bg-gradient-to-b from-sky-50/90 to-cyan-50/60 p-3 sm:p-4 dark:border-cyan-300/30 dark:from-cyan-500/10 dark:to-sky-500/5">
        <div className="flex items-center justify-between">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-cyan-200">
            <Shield className="size-4" />
            Blue Side · Mi Equipo
          </p>
          {myChampion ? (
            <Badge className="border border-cyan-300/60 bg-cyan-500/10 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-100">
              Tu pick: {myChampion}
            </Badge>
          ) : null}
        </div>

        <div className="space-y-2.5">
          {myTeam.map((championId, index) => (
            <TeamSlotSelector
              key={`my-slot-${index}`}
              label={`Slot ${index + 1}`}
              value={championId}
              champions={champions}
              disabled={disabled}
              isMyChampion={Boolean(championId && championId === myChampion)}
              onSetMyChampion={() => {
                onMyChampionChange(championId)
              }}
              onChange={(newChampionId) => {
                onMyTeamChange(index, newChampionId)
              }}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-rose-300/55 bg-gradient-to-b from-rose-50/90 to-red-50/60 p-3 sm:p-4 dark:border-red-300/30 dark:from-red-500/10 dark:to-rose-500/5">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-red-200">
          <Swords className="size-4" />
          Red Side · Equipo Enemigo
        </p>

        <div className="space-y-2.5">
          {enemyTeam.map((championId, index) => (
            <TeamSlotSelector
              key={`enemy-slot-${index}`}
              label={`Slot ${index + 1}`}
              value={championId}
              champions={champions}
              disabled={disabled}
              onChange={(newChampionId) => {
                onEnemyTeamChange(index, newChampionId)
              }}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
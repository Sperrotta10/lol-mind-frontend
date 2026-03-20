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
import { Check, ChevronsUpDown } from 'lucide-react'
import { useMemo, useState } from 'react'

interface ChampionSelectorProps {
  label: string
  placeholder: string
  value: string | null
  onChange: (value: string) => void
  champions: Champion[]
  disabled?: boolean
}

export function ChampionSelector({
  label,
  placeholder,
  value,
  onChange,
  champions,
  disabled = false,
}: ChampionSelectorProps) {
  const [open, setOpen] = useState(false)

  const selectedChampion = useMemo(
    () => champions.find((champion) => champion.id === value),
    [champions, value],
  )

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-cyan-300/85">{label}</p>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="h-12 w-full justify-between rounded-lg border-slate-300/80 bg-background px-4 text-left text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-cyan-300/20 dark:bg-card/70 dark:text-foreground dark:hover:bg-card"
          >
            <span className="truncate">{selectedChampion?.name ?? placeholder}</span>
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
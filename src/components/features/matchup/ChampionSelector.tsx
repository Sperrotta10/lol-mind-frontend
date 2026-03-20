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
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300/80">{label}</p>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="h-12 w-full justify-between border-cyan-300/20 bg-card/70 px-4 text-left text-foreground hover:bg-card"
          >
            <span className="truncate">{selectedChampion?.name ?? placeholder}</span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-70" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar campeon..." />
            <CommandList>
              <CommandEmpty>Sin resultados</CommandEmpty>
              <CommandGroup>
                {champions.map((champion) => (
                  <CommandItem
                    key={champion.id}
                    value={`${champion.id} ${champion.name}`}
                    onSelect={() => {
                      onChange(champion.id)
                      setOpen(false)
                    }}
                    className="flex items-center justify-between"
                  >
                    <span>{champion.name}</span>
                    <Check
                      className={[
                        'size-4 text-cyan-400 transition-opacity',
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
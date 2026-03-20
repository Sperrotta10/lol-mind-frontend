import { Moon, Sun } from 'lucide-react'
import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { useMounted } from '../../providers/theme-provider.tsx'

const navItems: Array<{ to: string; label: string }> = [
  { to: '/', label: 'Inicio' },
  { to: '/champions', label: 'Campeones' },
  { to: '/tools/matchup', label: 'Matchup' },
  { to: '/tools/team-builder', label: 'Team Builder' },
  { to: '/tools/ruleta', label: 'Ruleta' },
]

export function Navbar() {
  const mounted = useMounted()
  const { setTheme, resolvedTheme } = useTheme()

  const isDark = mounted ? resolvedTheme === 'dark' : true

  const toggleTheme = React.useCallback(() => {
    setTheme(isDark ? 'light' : 'dark')
  }, [isDark, setTheme])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="font-heading text-xl font-semibold tracking-[0.2em] text-foreground sm:text-2xl"
        >
          Lol-Mind
        </NavLink>

        <nav aria-label="Navegacion principal" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                [
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-card-foreground transition-transform hover:scale-105"
          aria-label="Cambiar tema"
          title="Cambiar tema"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      <nav
        aria-label="Navegacion principal movil"
        className="mx-auto flex w-full max-w-7xl gap-2 overflow-x-auto px-4 pb-3 md:hidden sm:px-6 lg:px-8"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              [
                'whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
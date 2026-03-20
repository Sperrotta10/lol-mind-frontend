import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar.tsx'

export function Layout() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
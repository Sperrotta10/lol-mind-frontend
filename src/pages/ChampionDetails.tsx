import { ChampionDetailSkeleton } from '@/components/features/champions/ChampionDetailSkeleton'
import { ChampionDetailView } from '@/components/features/champions/ChampionDetailView'
import { MetaBuildPanel } from '@/components/features/champions/MetaBuildPanel'
import { Button } from '@/components/ui/button'
import { useChampionDetail } from '@/hooks/useChampionDetail'
import { useChampionMetaBuild } from '@/hooks/useChampionMetaBuild'
import { ChevronLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

export function ChampionDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { champion, isLoading, isError } = useChampionDetail(id)
  const {
    data: metaBuild,
    isLoading: isLoadingMetaBuild,
    isError: isErrorMetaBuild,
    refetch: refetchMetaBuild,
  } = useChampionMetaBuild(id)

  if (isLoading) {
    return <ChampionDetailSkeleton />
  }

  if (isError) {
    return (
      <section className="space-y-4 rounded-2xl border border-red-400/55 bg-red-100/80 p-6 dark:border-red-400/40 dark:bg-red-500/10">
        <h1 className="text-xl font-semibold text-red-700 dark:text-red-200">No se pudo cargar el campeon</h1>
        <p className="text-sm text-red-700/90 dark:text-red-100/90">Revisa tu conexion e intentalo nuevamente.</p>
        <Button asChild variant="outline" size="sm">
          <Link to="/champions">Volver al catalogo</Link>
        </Button>
      </section>
    )
  }

  if (!champion) {
    return (
      <section className="space-y-4 rounded-2xl border border-border/70 bg-card/70 p-6">
        <h1 className="text-xl font-semibold text-foreground">Campeon no encontrado</h1>
        <p className="text-sm text-muted-foreground">
          El campeon solicitado no existe o no coincide con el identificador de ruta.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link to="/champions" className="inline-flex items-center gap-1">
            <ChevronLeft className="size-4" />
            Volver al catalogo
          </Link>
        </Button>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <Button asChild variant="outline" size="sm">
        <Link to="/champions" className="inline-flex items-center gap-1">
          <ChevronLeft className="size-4" />
          Volver al catalogo
        </Link>
      </Button>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ChampionDetailView champion={champion} />
        <MetaBuildPanel
          data={metaBuild}
          isLoading={isLoadingMetaBuild}
          isError={isErrorMetaBuild}
          onRetry={() => {
            void refetchMetaBuild()
          }}
        />
      </div>
    </section>
  )
}

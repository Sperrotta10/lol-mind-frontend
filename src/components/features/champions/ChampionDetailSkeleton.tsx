import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ChampionDetailSkeleton() {
  return (
    <Card className="overflow-hidden border-border/70 bg-card/80">
      <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
        <Skeleton className="min-h-[320px] w-full rounded-none lg:min-h-[560px]" />
        <CardContent className="space-y-6 p-6 sm:p-8">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

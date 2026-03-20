import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ChampionCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/70 bg-card/80">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <CardContent className="space-y-3 p-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

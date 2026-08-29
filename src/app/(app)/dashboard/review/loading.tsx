import { Card, CardContent } from "@/components/ui/card";

export default function ReviewLoading() {
  return (
    <div className="space-y-6" aria-label="Loading review session">
      <div className="h-10 w-40 animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <Card key={item}>
            <CardContent className="space-y-3 py-8">
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-8 w-1/3 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mx-auto max-w-3xl">
        <CardContent className="space-y-4 py-16">
          <div className="mx-auto h-5 w-1/3 animate-pulse rounded bg-muted" />
          <div className="mx-auto h-10 w-2/3 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    </div>
  );
}

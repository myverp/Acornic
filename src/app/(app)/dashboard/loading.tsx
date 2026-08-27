import { Card, CardContent } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <Card aria-live="polite" aria-busy="true">
      <CardContent className="text-muted-foreground">
        Loading your dashboard…
      </CardContent>
    </Card>
  );
}

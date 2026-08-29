"use client";

import { Button } from "@/components/ui/button";

export default function ReviewError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="text-2xl font-semibold">We could not load your review</h1>
      <p className="mt-2 text-muted-foreground">
        Check your connection and try loading the review queue again.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}

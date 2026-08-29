import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function DeckNotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="text-2xl font-semibold">Deck not found</h1>
      <p className="mt-2 text-muted-foreground">
        This deck may have been deleted or belongs to another account.
      </p>
      <Button asChild className="mt-6">
        <Link href="/dashboard/decks">Return to decks</Link>
      </Button>
    </div>
  );
}

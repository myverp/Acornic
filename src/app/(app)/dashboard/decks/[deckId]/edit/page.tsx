import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDeck } from "@/data/decks";
import {
  deleteDeckAction,
  updateDeckAction,
} from "@/features/decks/actions";
import { DeckForm } from "@/features/decks/deck-form";
import { DeleteButton } from "@/features/decks/delete-button";
import { entityIdSchema } from "@/features/decks/schemas";
import { StatusAlert } from "@/features/decks/status-alert";

type EditDeckPageProps = {
  params: Promise<{ deckId: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditDeckPage({
  params,
  searchParams,
}: EditDeckPageProps) {
  const [{ deckId }, { error }] = await Promise.all([params, searchParams]);
  const idResult = entityIdSchema.safeParse(deckId);

  if (!idResult.success) {
    notFound();
  }

  const deck = await getDeck(idResult.data);
  if (!deck) {
    notFound();
  }

  const updateThisDeck = updateDeckAction.bind(null, deck.id);
  const deleteThisDeck = deleteDeckAction.bind(null, deck.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href={`/dashboard/decks/${deck.id}`}>
          <ArrowLeft aria-hidden="true" />
          Back to deck
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Edit deck</h1>
        <p className="mt-2 text-muted-foreground">
          Update the title or language pair for {deck.title}.
        </p>
      </div>

      <StatusAlert error={error} />

      <Card>
        <CardHeader>
          <CardTitle>Deck details</CardTitle>
        </CardHeader>
        <CardContent>
          <DeckForm
            action={updateThisDeck}
            defaults={deck}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle>Delete deck</CardTitle>
          <CardDescription>
            This permanently deletes the deck and every card inside it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={deleteThisDeck}>
            <DeleteButton label="Delete deck" />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

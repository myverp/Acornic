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
import { getCard } from "@/data/cards";
import { getDeck } from "@/data/decks";
import { updateCardAction } from "@/features/decks/actions";
import { CardForm } from "@/features/decks/card-form";
import { entityIdSchema } from "@/features/decks/schemas";

type EditCardPageProps = {
  params: Promise<{ deckId: string; cardId: string }>;
};

export default async function EditCardPage({ params }: EditCardPageProps) {
  const { deckId, cardId } = await params;
  const deckIdResult = entityIdSchema.safeParse(deckId);
  const cardIdResult = entityIdSchema.safeParse(cardId);

  if (!deckIdResult.success || !cardIdResult.success) {
    notFound();
  }

  const deck = await getDeck(deckIdResult.data);
  if (!deck) {
    notFound();
  }

  const card = await getCard(deck.id, cardIdResult.data);
  if (!card) {
    notFound();
  }

  const updateThisCard = updateCardAction.bind(null, deck.id, card.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href={`/dashboard/decks/${deck.id}`}>
          <ArrowLeft aria-hidden="true" />
          Back to {deck.title}
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Edit card</h1>
        <p className="mt-2 text-muted-foreground">
          Update this vocabulary card without changing its deck.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Card details</CardTitle>
          <CardDescription>
            The word or phrase and translation are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardForm
            action={updateThisCard}
            defaults={card}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </div>
  );
}

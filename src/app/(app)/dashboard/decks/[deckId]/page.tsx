import Link from "next/link";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
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
import { listCards } from "@/data/cards";
import { getEnglishGermanStarterCards } from "@/domain/datasets/english-german-starter";
import {
  createCardAction,
  deleteCardAction,
  importEnglishGermanStarterAction,
} from "@/features/decks/actions";
import { CardForm } from "@/features/decks/card-form";
import { DeleteButton } from "@/features/decks/delete-button";
import { entityIdSchema } from "@/features/decks/schemas";
import { StarterSetImportForm } from "@/features/decks/starter-set-import-form";
import { StatusAlert } from "@/features/decks/status-alert";

type DeckPageProps = {
  params: Promise<{ deckId: string }>;
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function DeckPage({
  params,
  searchParams,
}: DeckPageProps) {
  const [{ deckId }, { error, message }] = await Promise.all([
    params,
    searchParams,
  ]);
  const idResult = entityIdSchema.safeParse(deckId);

  if (!idResult.success) {
    notFound();
  }

  const deck = await getDeck(idResult.data);
  if (!deck) {
    notFound();
  }

  const cards = await listCards(deck.id);
  const createCardForDeck = createCardAction.bind(null, deck.id);
  const starterCards = getEnglishGermanStarterCards(
    deck.sourceLanguageCode,
    deck.targetLanguageCode,
  );
  const importStarterCardsForDeck = importEnglishGermanStarterAction.bind(
    null,
    deck.id,
  );

  return (
    <div className="space-y-8">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-3">
          <Link href="/dashboard/decks">
            <ArrowLeft aria-hidden="true" />
            All decks
          </Link>
        </Button>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-medium text-primary">
              {deck.sourceLanguageCode} → {deck.targetLanguageCode}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {deck.title}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {cards.length} {cards.length === 1 ? "card" : "cards"}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/dashboard/decks/${deck.id}/edit`}>
              <Pencil aria-hidden="true" />
              Edit deck
            </Link>
          </Button>
        </div>
      </div>

      <StatusAlert error={error} message={message} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-labelledby="cards-heading" className="space-y-4">
          <h2 id="cards-heading" className="text-xl font-semibold">
            Cards
          </h2>
          {cards.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center py-12 text-center">
                <Plus
                  className="mb-4 size-8 text-muted-foreground"
                  aria-hidden="true"
                />
                <h3 className="font-semibold">This deck is empty</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Add the first word or phrase using the form on this page.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {cards.map((card) => {
                const deleteThisCard = deleteCardAction.bind(
                  null,
                  deck.id,
                  card.id,
                );

                return (
                  <Card key={card.id}>
                    <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <CardTitle className="break-words">
                          {card.sourceText}
                        </CardTitle>
                        <CardDescription className="mt-1 break-words text-base text-foreground">
                          {card.translation}
                        </CardDescription>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link
                            href={`/dashboard/decks/${deck.id}/cards/${card.id}/edit`}
                          >
                            Edit
                          </Link>
                        </Button>
                        <form action={deleteThisCard}>
                          <DeleteButton label="Delete" />
                        </form>
                      </div>
                    </CardHeader>
                    {card.exampleSentence || card.notes ? (
                      <CardContent className="space-y-3 text-sm">
                        {card.exampleSentence ? (
                          <p className="whitespace-pre-wrap">
                            <span className="font-medium">Example:</span>{" "}
                            {card.exampleSentence}
                          </p>
                        ) : null}
                        {card.notes ? (
                          <p className="whitespace-pre-wrap text-muted-foreground">
                            <span className="font-medium text-foreground">
                              Notes:
                            </span>{" "}
                            {card.notes}
                          </p>
                        ) : null}
                      </CardContent>
                    ) : null}
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add a card</CardTitle>
              <CardDescription>
                Examples and notes are optional and can be added later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CardForm action={createCardForDeck} submitLabel="Add card" />
            </CardContent>
          </Card>

          {starterCards ? (
            <Card className="motion-card">
              <CardHeader>
                <CardTitle>English–German starter dataset</CardTitle>
                <CardDescription>
                  A compact set of everyday vocabulary for this language pair.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StarterSetImportForm
                  action={importStarterCardsForDeck}
                  cardCount={starterCards.length}
                />
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

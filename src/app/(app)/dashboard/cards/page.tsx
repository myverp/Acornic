import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Languages, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listLearningCards } from "@/data/cards";
import { formatLanguageCode } from "@/domain/languages/language-options";

export const metadata: Metadata = { title: "Learning cards" };

export default async function LearningCardsPage() {
  const cards = await listLearningCards();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-primary">Your vocabulary</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Learning cards
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Browse every word and phrase you are learning across your private
          decks.
        </p>
      </div>

      <section aria-labelledby="learning-cards-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="learning-cards-heading" className="text-xl font-semibold">
            {cards.length} {cards.length === 1 ? "card" : "cards"}
          </h2>
          <Button asChild variant="outline">
            <Link href="/dashboard/decks">
              <Plus aria-hidden="true" />
              Add cards in a deck
            </Link>
          </Button>
        </div>

        {cards.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <BookOpen
                className="mb-4 size-8 text-muted-foreground"
                aria-hidden="true"
              />
              <h3 className="font-semibold">No learning cards yet</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Create a deck, then add the first word or phrase you want to
                remember.
              </p>
              <Button asChild className="mt-5">
                <Link href="/dashboard/decks">Go to decks</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {cards.map((card, index) => (
              <Card
                key={card.id}
                className="motion-card motion-enter"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <CardHeader className="gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardDescription className="flex items-center gap-1.5">
                        <Languages className="size-3.5" aria-hidden="true" />
                        {formatLanguageCode(card.deck.sourceLanguageCode)} →{" "}
                        {formatLanguageCode(card.deck.targetLanguageCode)}
                      </CardDescription>
                      <CardTitle className="mt-2 break-words">
                        {card.sourceText}
                      </CardTitle>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/decks/${card.deck.id}`}>Deck</Link>
                    </Button>
                  </div>
                  <p className="break-words text-base text-foreground">
                    {card.translation}
                  </p>
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
                        <span className="font-medium text-foreground">Notes:</span>{" "}
                        {card.notes}
                      </p>
                    ) : null}
                  </CardContent>
                ) : null}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

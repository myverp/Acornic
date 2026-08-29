import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listDecks } from "@/data/decks";
import { createDeckAction } from "@/features/decks/actions";
import { DeckForm } from "@/features/decks/deck-form";
import { StatusAlert } from "@/features/decks/status-alert";

export const metadata: Metadata = { title: "Decks" };

type DecksPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function DecksPage({ searchParams }: DecksPageProps) {
  const [{ error, message }, decks] = await Promise.all([
    searchParams,
    listDecks(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-primary">Your vocabulary</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Decks</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Organize words and phrases by the language you know and the language
          you are learning.
        </p>
      </div>

      <StatusAlert error={error} message={message} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-labelledby="deck-list-heading" className="space-y-4">
          <h2 id="deck-list-heading" className="text-xl font-semibold">
            Your decks
          </h2>
          {decks.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center py-12 text-center">
                <BookOpen
                  className="mb-4 size-8 text-muted-foreground"
                  aria-hidden="true"
                />
                <h3 className="font-semibold">No decks yet</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Create a deck to start collecting vocabulary for any language
                  pair.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {decks.map((deck) => (
                <Card key={deck.id}>
                  <CardHeader>
                    <CardTitle>{deck.title}</CardTitle>
                    <CardDescription>
                      {deck.sourceLanguageCode} → {deck.targetLanguageCode}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/dashboard/decks/${deck.id}`}>
                        Open deck
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Create a deck</CardTitle>
            <CardDescription>
              Language codes keep every deck multilingual and portable.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeckForm action={createDeckAction} submitLabel="Create deck" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

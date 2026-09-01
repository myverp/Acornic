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
import { getLanguagePreferences } from "@/data/language-preferences";
import {
  deleteDeckAction,
  updateDeckAction,
} from "@/features/decks/actions";
import { DeckForm } from "@/features/decks/deck-form";
import { DeleteButton } from "@/features/decks/delete-button";
import { entityIdSchema } from "@/features/decks/schemas";
import { StatusAlert } from "@/features/decks/status-alert";

type EditDeckPreferencesPageProps = {
  params: Promise<{ deckId: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditDeckPreferencesPage({
  params,
  searchParams,
}: EditDeckPreferencesPageProps) {
  const [{ deckId }, { error }] = await Promise.all([params, searchParams]);
  const idResult = entityIdSchema.safeParse(deckId);

  if (!idResult.success) {
    notFound();
  }

  const [deck, languageOptions] = await Promise.all([
    getDeck(idResult.data),
    getLanguagePreferences(),
  ]);

  if (!deck) {
    notFound();
  }

  const updateThisDeck = updateDeckAction.bind(null, deck.id);
  const deleteThisDeck = deleteDeckAction.bind(null, deck.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/dashboard/preferences">
          <ArrowLeft aria-hidden="true" />
          Profile / Preferences
        </Link>
      </Button>

      <div>
        <p className="text-sm font-medium text-primary">Deck management</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Edit {deck.title}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Update this deck&apos;s title or saved language pair.
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
            languageOptions={languageOptions}
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

import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLanguagePreferences } from "@/data/language-preferences";
import { listDecks } from "@/data/decks";
import { updateLanguagePreferencesAction } from "@/features/preferences/actions";
import { PreferencesForm } from "@/features/preferences/preferences-form";

export const metadata: Metadata = { title: "Profile / Preferences" };

export default async function PreferencesPage() {
  const [preferences, decks] = await Promise.all([
    getLanguagePreferences(),
    listDecks(),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-sm font-medium text-primary">Your profile</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Preferences
        </h1>
        <p className="mt-2 text-muted-foreground">
          Keep your language choices in one place. Decks use these saved pairs.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Languages</CardTitle>
          <CardDescription>
            Choose multiple known and learning languages. Every selection is
            saved as an ISO language code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PreferencesForm
            action={updateLanguagePreferencesAction}
            defaults={preferences}
            submitLabel="Save preferences"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deck management</CardTitle>
          <CardDescription>
            Create and edit decks using the language pairs saved above.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {decks.length === 0 ? (
            <Button asChild variant="outline">
              <Link href="/dashboard/decks">
                <BookOpen aria-hidden="true" />
                Create a deck
              </Link>
            </Button>
          ) : (
            <ul className="space-y-3">
              {decks.map((deck) => (
                <li
                  key={deck.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{deck.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {deck.sourceLanguageCode} → {deck.targetLanguageCode}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/preferences/decks/${deck.id}`}>
                      Edit deck
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

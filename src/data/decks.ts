import "server-only";

import { cache } from "react";

import type { DeckInput } from "@/features/decks/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type Deck = {
  id: string;
  title: string;
  sourceLanguageCode: string;
  targetLanguageCode: string;
};

type DeckRow = {
  id: string;
  title: string;
  source_language_code: string;
  target_language_code: string;
};

const deckColumns =
  "id, title, source_language_code, target_language_code" as const;

function toDeck(row: DeckRow): Deck {
  return {
    id: row.id,
    title: row.title,
    sourceLanguageCode: row.source_language_code,
    targetLanguageCode: row.target_language_code,
  };
}

async function authenticatedClient() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) {
    throw new Error("Authentication is required.");
  }

  return { supabase, userId };
}

export async function listDecks(): Promise<Deck[]> {
  const { supabase, userId } = await authenticatedClient();
  const { data, error } = await supabase
    .from("decks")
    .select(deckColumns)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error("Could not load decks.");
  }

  return (data as DeckRow[]).map(toDeck);
}

export const getDeck = cache(async (deckId: string): Promise<Deck | null> => {
  const { supabase, userId } = await authenticatedClient();
  const { data, error } = await supabase
    .from("decks")
    .select(deckColumns)
    .eq("id", deckId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load the deck.");
  }

  return data ? toDeck(data as DeckRow) : null;
});

export async function createDeck(input: DeckInput): Promise<string> {
  const { supabase, userId } = await authenticatedClient();
  const { data, error } = await supabase
    .from("decks")
    .insert({
      user_id: userId,
      title: input.title,
      source_language_code: input.sourceLanguageCode,
      target_language_code: input.targetLanguageCode,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error("Could not create the deck.");
  }

  return data.id as string;
}

export async function updateDeck(
  deckId: string,
  input: DeckInput,
): Promise<boolean> {
  const { supabase, userId } = await authenticatedClient();
  const { data, error } = await supabase
    .from("decks")
    .update({
      title: input.title,
      source_language_code: input.sourceLanguageCode,
      target_language_code: input.targetLanguageCode,
    })
    .eq("id", deckId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error("Could not update the deck.");
  }

  return Boolean(data);
}

export async function deleteDeck(deckId: string): Promise<boolean> {
  const { supabase, userId } = await authenticatedClient();
  const { data, error } = await supabase
    .from("decks")
    .delete()
    .eq("id", deckId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error("Could not delete the deck.");
  }

  return Boolean(data);
}

import "server-only";

import { getDeck } from "@/data/decks";
import type { VocabularyCardInput } from "@/features/decks/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type VocabularyCard = {
  id: string;
  sourceText: string;
  translation: string;
  exampleSentence: string | null;
  notes: string | null;
};

type CardRow = {
  id: string;
  source_text: string;
  translation: string;
  example_sentence: string | null;
  notes: string | null;
};

const cardColumns =
  "id, source_text, translation, example_sentence, notes" as const;

function toVocabularyCard(row: CardRow): VocabularyCard {
  return {
    id: row.id,
    sourceText: row.source_text,
    translation: row.translation,
    exampleSentence: row.example_sentence,
    notes: row.notes,
  };
}

async function requireOwnedDeck(deckId: string): Promise<void> {
  if (!(await getDeck(deckId))) {
    throw new Error("The deck was not found.");
  }
}

export async function listCards(deckId: string): Promise<VocabularyCard[]> {
  await requireOwnedDeck(deckId);
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("cards")
    .select(cardColumns)
    .eq("deck_id", deckId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error("Could not load cards.");
  }

  return (data as CardRow[]).map(toVocabularyCard);
}

export async function getCard(
  deckId: string,
  cardId: string,
): Promise<VocabularyCard | null> {
  await requireOwnedDeck(deckId);
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("cards")
    .select(cardColumns)
    .eq("id", cardId)
    .eq("deck_id", deckId)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load the card.");
  }

  return data ? toVocabularyCard(data as CardRow) : null;
}

export async function createCard(
  deckId: string,
  input: VocabularyCardInput,
): Promise<void> {
  await requireOwnedDeck(deckId);
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("cards").insert({
    deck_id: deckId,
    source_text: input.sourceText,
    translation: input.translation,
    example_sentence: input.exampleSentence,
    notes: input.notes,
  });

  if (error) {
    throw new Error("Could not create the card.");
  }
}

export async function updateCard(
  deckId: string,
  cardId: string,
  input: VocabularyCardInput,
): Promise<boolean> {
  await requireOwnedDeck(deckId);
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("cards")
    .update({
      source_text: input.sourceText,
      translation: input.translation,
      example_sentence: input.exampleSentence,
      notes: input.notes,
    })
    .eq("id", cardId)
    .eq("deck_id", deckId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error("Could not update the card.");
  }

  return Boolean(data);
}

export async function deleteCard(
  deckId: string,
  cardId: string,
): Promise<boolean> {
  await requireOwnedDeck(deckId);
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("cards")
    .delete()
    .eq("id", cardId)
    .eq("deck_id", deckId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error("Could not delete the card.");
  }

  return Boolean(data);
}

import "server-only";

import { getDeck } from "@/data/decks";
import type { StarterCardInput } from "@/domain/datasets/english-german-starter";
import type { VocabularyCardInput } from "@/features/decks/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type VocabularyCard = {
  id: string;
  sourceText: string;
  translation: string;
  exampleSentence: string | null;
  notes: string | null;
};

export type VocabularyCardWithDeck = VocabularyCard & {
  deck: {
    id: string;
    sourceLanguageCode: string;
    targetLanguageCode: string;
    title: string;
  };
};

type CardRow = {
  id: string;
  source_text: string;
  translation: string;
  example_sentence: string | null;
  notes: string | null;
};

type DeckRow = {
  id: string;
  source_language_code: string;
  target_language_code: string;
  title: string;
};

type CardWithDeckRow = CardRow & {
  decks: DeckRow | DeckRow[] | null;
};

const cardColumns =
  "id, source_text, translation, example_sentence, notes" as const;

const cardSourceColumns = "source_text" as const;

const cardWithDeckColumns =
  "id, source_text, translation, example_sentence, notes, decks!inner(id, title, source_language_code, target_language_code)" as const;

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

export async function listLearningCards(): Promise<VocabularyCardWithDeck[]> {
  const supabase = await createServerSupabaseClient();
  const { data: claims, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claims?.claims?.sub) {
    throw new Error("Authentication is required.");
  }

  const { data, error } = await supabase
    .from("cards")
    .select(cardWithDeckColumns)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Could not load cards.");
  }

  return (data as CardWithDeckRow[]).flatMap((row) => {
    const deck = Array.isArray(row.decks) ? row.decks[0] : row.decks;

    if (!deck) {
      return [];
    }

    return [
      {
        ...toVocabularyCard(row),
        deck: {
          id: deck.id,
          sourceLanguageCode: deck.source_language_code,
          targetLanguageCode: deck.target_language_code,
          title: deck.title,
        },
      },
    ];
  });
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

function normalizedSourceText(value: string): string {
  return value.normalize("NFKC").trim().toLocaleLowerCase();
}

export async function importStarterCards(
  deckId: string,
  cards: readonly StarterCardInput[],
): Promise<{ imported: number; skipped: number }> {
  await requireOwnedDeck(deckId);
  const supabase = await createServerSupabaseClient();
  const { data: existingCards, error: existingCardsError } = await supabase
    .from("cards")
    .select(cardSourceColumns)
    .eq("deck_id", deckId);

  if (existingCardsError) {
    throw new Error("Could not check existing cards.");
  }

  const sourceTexts = new Set(
    (existingCards as Array<{ source_text: string }>).map((card) =>
      normalizedSourceText(card.source_text),
    ),
  );
  const cardsToInsert = cards.filter((card) => {
    const sourceText = normalizedSourceText(card.sourceText);

    if (sourceTexts.has(sourceText)) {
      return false;
    }

    sourceTexts.add(sourceText);
    return true;
  });

  if (cardsToInsert.length === 0) {
    return { imported: 0, skipped: cards.length };
  }

  const { error } = await supabase.from("cards").insert(
    cardsToInsert.map((card) => ({
      deck_id: deckId,
      source_text: card.sourceText,
      translation: card.translation,
    })),
  );

  if (error) {
    throw new Error("Could not import starter cards.");
  }

  return {
    imported: cardsToInsert.length,
    skipped: cards.length - cardsToInsert.length,
  };
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

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createCard, deleteCard, updateCard } from "@/data/cards";
import { createDeck, deleteDeck, updateDeck } from "@/data/decks";
import type { FormActionState } from "@/features/decks/form-state";
import {
  deckSchema,
  entityIdSchema,
  firstDeckValidationMessage,
  vocabularyCardSchema,
} from "@/features/decks/schemas";
import { logServerActionFailure } from "@/lib/monitoring/server";

function noticeUrl(
  path: string,
  kind: "error" | "message",
  message: string,
): string {
  const query = new URLSearchParams({ [kind]: message });
  return `${path}?${query.toString()}`;
}

export async function createDeckAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const result = deckSchema.safeParse({
    title: formData.get("title"),
    sourceLanguageCode: formData.get("sourceLanguageCode"),
    targetLanguageCode: formData.get("targetLanguageCode"),
  });

  if (!result.success) {
    return { error: firstDeckValidationMessage(result.error) };
  }

  let deckId: string;
  try {
    deckId = await createDeck(result.data);
  } catch (error) {
    logServerActionFailure("create_deck", error);
    return { error: "We could not create this deck. Please try again." };
  }

  revalidatePath("/dashboard/decks");
  redirect(noticeUrl(`/dashboard/decks/${deckId}`, "message", "Deck created."));
}

export async function updateDeckAction(
  deckId: string,
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const idResult = entityIdSchema.safeParse(deckId);
  const inputResult = deckSchema.safeParse({
    title: formData.get("title"),
    sourceLanguageCode: formData.get("sourceLanguageCode"),
    targetLanguageCode: formData.get("targetLanguageCode"),
  });

  if (!idResult.success) {
    return { error: "This deck is no longer available." };
  }

  if (!inputResult.success) {
    return { error: firstDeckValidationMessage(inputResult.error) };
  }

  let updated: boolean;
  try {
    updated = await updateDeck(idResult.data, inputResult.data);
  } catch (error) {
    logServerActionFailure("update_deck", error);
    return { error: "We could not save this deck. Please try again." };
  }

  if (!updated) {
    return { error: "This deck is no longer available." };
  }

  revalidatePath("/dashboard/decks");
  revalidatePath(`/dashboard/decks/${idResult.data}`);
  redirect(
    noticeUrl(`/dashboard/decks/${idResult.data}`, "message", "Deck updated."),
  );
}

export async function deleteDeckAction(deckId: string): Promise<void> {
  const result = entityIdSchema.safeParse(deckId);

  if (!result.success) {
    redirect(noticeUrl("/dashboard/decks", "error", "This deck is invalid."));
  }

  let deleted = false;
  try {
    deleted = await deleteDeck(result.data);
  } catch (error) {
    logServerActionFailure("delete_deck", error);
    redirect(
      noticeUrl(
        `/dashboard/decks/${result.data}/edit`,
        "error",
        "We could not delete this deck. Please try again.",
      ),
    );
  }

  if (!deleted) {
    redirect(
      noticeUrl("/dashboard/decks", "error", "This deck is no longer available."),
    );
  }

  revalidatePath("/dashboard/decks");
  redirect(noticeUrl("/dashboard/decks", "message", "Deck deleted."));
}

export async function createCardAction(
  deckId: string,
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const idResult = entityIdSchema.safeParse(deckId);
  const inputResult = vocabularyCardSchema.safeParse({
    sourceText: formData.get("sourceText"),
    translation: formData.get("translation"),
    exampleSentence: formData.get("exampleSentence") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!idResult.success) {
    return { error: "This deck is no longer available." };
  }

  if (!inputResult.success) {
    return { error: firstDeckValidationMessage(inputResult.error) };
  }

  try {
    await createCard(idResult.data, inputResult.data);
  } catch (error) {
    logServerActionFailure("create_card", error);
    return { error: "We could not add this card. Please try again." };
  }

  revalidatePath(`/dashboard/decks/${idResult.data}`);
  redirect(
    noticeUrl(`/dashboard/decks/${idResult.data}`, "message", "Card added."),
  );
}

export async function updateCardAction(
  deckId: string,
  cardId: string,
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const deckIdResult = entityIdSchema.safeParse(deckId);
  const cardIdResult = entityIdSchema.safeParse(cardId);
  const inputResult = vocabularyCardSchema.safeParse({
    sourceText: formData.get("sourceText"),
    translation: formData.get("translation"),
    exampleSentence: formData.get("exampleSentence") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!deckIdResult.success || !cardIdResult.success) {
    return { error: "This card is no longer available." };
  }

  if (!inputResult.success) {
    return { error: firstDeckValidationMessage(inputResult.error) };
  }

  let updated: boolean;
  try {
    updated = await updateCard(
      deckIdResult.data,
      cardIdResult.data,
      inputResult.data,
    );
  } catch (error) {
    logServerActionFailure("update_card", error);
    return { error: "We could not save this card. Please try again." };
  }

  if (!updated) {
    return { error: "This card is no longer available." };
  }

  revalidatePath(`/dashboard/decks/${deckIdResult.data}`);
  redirect(
    noticeUrl(
      `/dashboard/decks/${deckIdResult.data}`,
      "message",
      "Card updated.",
    ),
  );
}

export async function deleteCardAction(
  deckId: string,
  cardId: string,
): Promise<void> {
  const deckIdResult = entityIdSchema.safeParse(deckId);
  const cardIdResult = entityIdSchema.safeParse(cardId);

  if (!deckIdResult.success || !cardIdResult.success) {
    redirect(noticeUrl("/dashboard/decks", "error", "This card is invalid."));
  }

  let deleted = false;
  try {
    deleted = await deleteCard(deckIdResult.data, cardIdResult.data);
  } catch (error) {
    logServerActionFailure("delete_card", error);
    redirect(
      noticeUrl(
        `/dashboard/decks/${deckIdResult.data}`,
        "error",
        "We could not delete this card. Please try again.",
      ),
    );
  }

  if (!deleted) {
    redirect(
      noticeUrl(
        `/dashboard/decks/${deckIdResult.data}`,
        "error",
        "This card is no longer available.",
      ),
    );
  }

  revalidatePath(`/dashboard/decks/${deckIdResult.data}`);
  redirect(
    noticeUrl(`/dashboard/decks/${deckIdResult.data}`, "message", "Card deleted."),
  );
}

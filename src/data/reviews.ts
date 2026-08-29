import "server-only";

import type { ReviewRating } from "@/domain/review/scheduler";
import { simpleReviewScheduler } from "@/domain/review/scheduler";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type DueReviewCard = {
  id: string;
  deckTitle: string;
  sourceLanguageCode: string;
  targetLanguageCode: string;
  sourceText: string;
  translation: string;
  exampleSentence: string | null;
  notes: string | null;
};

export type ReviewHistoryItem = {
  id: string;
  cardSourceText: string;
  deckTitle: string;
  rating: ReviewRating;
  reviewedAt: string;
  nextReviewAt: string;
};

export type ReviewOverview = {
  dueCard: DueReviewCard | null;
  dueCount: number;
  reviewedLast24Hours: number;
  totalCards: number;
  nextDueAt: string | null;
  history: ReviewHistoryItem[];
};

type DeckRelationRow = {
  id: string;
  user_id: string;
  title: string;
  source_language_code: string;
  target_language_code: string;
};

type ReviewCardRow = {
  id: string;
  source_text: string;
  translation: string;
  example_sentence: string | null;
  notes: string | null;
  position: number;
  created_at: string;
  decks: DeckRelationRow | DeckRelationRow[];
};

type ReviewEventRow = {
  id: string;
  card_id: string;
  rating: ReviewRating;
  review_stage: number;
  next_review_at: string;
  reviewed_at: string;
};

async function authenticatedClient() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) {
    throw new Error("Authentication is required.");
  }

  return { supabase, userId };
}

function deckFrom(row: ReviewCardRow): DeckRelationRow {
  const deck = Array.isArray(row.decks) ? row.decks[0] : row.decks;

  if (!deck) {
    throw new Error("The card deck could not be loaded.");
  }

  return deck;
}

export async function getReviewOverview(now: Date): Promise<ReviewOverview> {
  const { supabase, userId } = await authenticatedClient();
  const [cardsResult, eventsResult] = await Promise.all([
    supabase
      .from("cards")
      .select(
        "id, source_text, translation, example_sentence, notes, position, created_at, decks!inner(id, user_id, title, source_language_code, target_language_code)",
      )
      .eq("decks.user_id", userId),
    supabase
      .from("review_events")
      .select(
        "id, card_id, rating, review_stage, next_review_at, reviewed_at",
      )
      .eq("user_id", userId)
      .order("reviewed_at", { ascending: false })
      .order("id", { ascending: false }),
  ]);

  if (cardsResult.error || eventsResult.error) {
    throw new Error("Could not load the review queue.");
  }

  const cards = cardsResult.data as unknown as ReviewCardRow[];
  const events = eventsResult.data as unknown as ReviewEventRow[];
  const cardsById = new Map(cards.map((card) => [card.id, card]));
  const latestEventByCard = new Map<string, ReviewEventRow>();

  for (const event of events) {
    if (!latestEventByCard.has(event.card_id)) {
      latestEventByCard.set(event.card_id, event);
    }
  }

  const nowTime = now.getTime();
  const dueCards = cards
    .filter((card) => {
      const latestEvent = latestEventByCard.get(card.id);
      return !latestEvent || Date.parse(latestEvent.next_review_at) <= nowTime;
    })
    .toSorted((left, right) => {
      const leftDue = latestEventByCard.get(left.id)?.next_review_at;
      const rightDue = latestEventByCard.get(right.id)?.next_review_at;
      const dueDifference =
        (leftDue ? Date.parse(leftDue) : 0) -
        (rightDue ? Date.parse(rightDue) : 0);

      return (
        dueDifference ||
        left.position - right.position ||
        Date.parse(left.created_at) - Date.parse(right.created_at)
      );
    });

  const upcomingTimes = Array.from(latestEventByCard.values())
    .map((event) => Date.parse(event.next_review_at))
    .filter((nextReviewTime) => nextReviewTime > nowTime);
  const nextDueTime = upcomingTimes.length > 0 ? Math.min(...upcomingTimes) : null;
  const oneDayAgo = nowTime - 24 * 60 * 60 * 1000;
  const firstDueCard = dueCards[0];

  return {
    dueCard: firstDueCard
      ? (() => {
          const deck = deckFrom(firstDueCard);
          return {
            id: firstDueCard.id,
            deckTitle: deck.title,
            sourceLanguageCode: deck.source_language_code,
            targetLanguageCode: deck.target_language_code,
            sourceText: firstDueCard.source_text,
            translation: firstDueCard.translation,
            exampleSentence: firstDueCard.example_sentence,
            notes: firstDueCard.notes,
          };
        })()
      : null,
    dueCount: dueCards.length,
    reviewedLast24Hours: events.filter(
      (event) => Date.parse(event.reviewed_at) >= oneDayAgo,
    ).length,
    totalCards: cards.length,
    nextDueAt: nextDueTime ? new Date(nextDueTime).toISOString() : null,
    history: events.slice(0, 10).flatMap((event) => {
      const card = cardsById.get(event.card_id);
      if (!card) {
        return [];
      }

      return [
        {
          id: event.id,
          cardSourceText: card.source_text,
          deckTitle: deckFrom(card).title,
          rating: event.rating,
          reviewedAt: event.reviewed_at,
          nextReviewAt: event.next_review_at,
        },
      ];
    }),
  };
}

export async function recordReview(
  cardId: string,
  rating: ReviewRating,
  now: Date,
): Promise<void> {
  const { supabase, userId } = await authenticatedClient();
  const { data: card, error: cardError } = await supabase
    .from("cards")
    .select("id, decks!inner(user_id)")
    .eq("id", cardId)
    .eq("decks.user_id", userId)
    .maybeSingle();

  if (cardError || !card) {
    throw new Error("The review card was not found.");
  }

  const { data: latestEvent, error: latestEventError } = await supabase
    .from("review_events")
    .select("review_stage")
    .eq("card_id", cardId)
    .eq("user_id", userId)
    .order("reviewed_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestEventError) {
    throw new Error("The review schedule could not be loaded.");
  }

  const schedule = simpleReviewScheduler.schedule({
    currentState: latestEvent
      ? { stage: latestEvent.review_stage as number }
      : null,
    now,
    rating,
  });
  const { error: insertError } = await supabase.from("review_events").insert({
    card_id: cardId,
    user_id: userId,
    rating,
    reviewed_at: now.toISOString(),
    review_stage: schedule.state.stage,
    next_review_at: schedule.nextReviewAt.toISOString(),
  });

  if (insertError) {
    throw new Error("The review could not be recorded.");
  }
}

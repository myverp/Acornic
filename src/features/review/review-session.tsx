"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DueReviewCard } from "@/data/reviews";
import type { ReviewRating } from "@/domain/review/scheduler";

type ReviewSessionProps = {
  card: DueReviewCard;
  remainingCount: number;
  action: (formData: FormData) => Promise<void>;
};

const ratingOptions: Array<{
  rating: ReviewRating;
  label: string;
  hint: string;
}> = [
  { rating: "again", label: "Again", hint: "10 minutes" },
  { rating: "hard", label: "Hard", hint: "Shorter interval" },
  { rating: "good", label: "Good", hint: "Next stage" },
  { rating: "easy", label: "Easy", hint: "Skip a stage" },
];

function RatingButtons() {
  const { pending } = useFormStatus();

  return (
    <div className="grid gap-2 sm:grid-cols-4">
      {ratingOptions.map(({ rating, label, hint }) => (
        <Button
          key={rating}
          type="submit"
          name="rating"
          value={rating}
          variant={rating === "good" ? "default" : "outline"}
          disabled={pending}
          className="h-auto flex-col py-3"
        >
          <span>{pending ? "Saving…" : label}</span>
          <span className="text-xs font-normal opacity-70">{hint}</span>
        </Button>
      ))}
    </div>
  );
}

export function ReviewSession({ card, remainingCount, action }: ReviewSessionProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader className="text-center">
        <CardDescription>
          {card.deckTitle} · {card.sourceLanguageCode} → {card.targetLanguageCode}
        </CardDescription>
        <CardTitle className="text-3xl break-words">{card.sourceText}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {remainingCount} {remainingCount === 1 ? "card" : "cards"} due
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {!revealed ? (
          <div className="flex justify-center py-8">
            <Button type="button" size="lg" onClick={() => setRevealed(true)}>
              Reveal answer
            </Button>
          </div>
        ) : (
          <div className="space-y-6" aria-live="polite">
            <div className="rounded-lg border bg-muted/40 p-5 text-center">
              <p className="text-2xl font-semibold break-words">
                {card.translation}
              </p>
              {card.exampleSentence ? (
                <p className="mt-3 whitespace-pre-wrap text-sm">
                  {card.exampleSentence}
                </p>
              ) : null}
              {card.notes ? (
                <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                  {card.notes}
                </p>
              ) : null}
            </div>
            <form action={action} className="space-y-3">
              <p className="text-center text-sm font-medium">
                How well did you remember it?
              </p>
              <RatingButtons />
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

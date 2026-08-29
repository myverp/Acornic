import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getReviewOverview } from "@/data/reviews";
import { StatusAlert } from "@/features/decks/status-alert";
import { recordReviewAction } from "@/features/review/actions";
import { ReviewSession } from "@/features/review/review-session";

export const metadata: Metadata = { title: "Review" };

type ReviewPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const now = new Date();
  const [{ error, message }, overview] = await Promise.all([
    searchParams,
    getReviewOverview(now),
  ]);
  const reviewThisCard = overview.dueCard
    ? recordReviewAction.bind(null, overview.dueCard.id)
    : null;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-primary">Practice</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Review</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Recall each card, reveal the answer, then rate how it felt.
        </p>
      </div>

      <StatusAlert error={error} message={message} />

      <section aria-labelledby="progress-heading">
        <h2 id="progress-heading" className="sr-only">
          Review progress
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Due now</CardDescription>
              <CardTitle className="text-3xl">{overview.dueCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Reviewed in 24 hours</CardDescription>
              <CardTitle className="text-3xl">
                {overview.reviewedLast24Hours}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total cards</CardDescription>
              <CardTitle className="text-3xl">{overview.totalCards}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </section>

      {overview.dueCard && reviewThisCard ? (
        <ReviewSession
          card={overview.dueCard}
          remainingCount={overview.dueCount}
          action={reviewThisCard}
        />
      ) : (
        <Card className="mx-auto max-w-2xl border-dashed">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <CheckCircle2
              className="mb-4 size-9 text-primary"
              aria-hidden="true"
            />
            <h2 className="text-xl font-semibold">
              {overview.totalCards === 0 ? "Add a card to begin" : "All caught up"}
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {overview.nextDueAt
                ? `Your next review is scheduled for ${formatDate(overview.nextDueAt)}.`
                : "Create a vocabulary deck and add a card before starting a review."}
            </p>
            {overview.totalCards === 0 ? (
              <Button asChild className="mt-5">
                <Link href="/dashboard/decks">Manage decks</Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      )}

      <section aria-labelledby="history-heading" className="space-y-4">
        <div>
          <h2 id="history-heading" className="text-xl font-semibold">
            Recent history
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your latest ten ratings and their next scheduled review.
          </p>
        </div>
        {overview.history.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Completed reviews will appear here.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {overview.history.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{item.cardSourceText}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.deckTitle} · {formatDate(item.reviewedAt)}
                    </p>
                  </div>
                  <div className="text-sm sm:text-right">
                    <p className="font-medium capitalize">{item.rating}</p>
                    <p className="text-muted-foreground">
                      Next: {formatDate(item.nextReviewAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

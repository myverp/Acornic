"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { recordReview } from "@/data/reviews";
import { isReviewRating } from "@/domain/review/scheduler";
import { entityIdSchema } from "@/features/decks/schemas";

function reviewNotice(kind: "error" | "message", message: string): string {
  return `/dashboard/review?${new URLSearchParams({ [kind]: message })}`;
}

export async function recordReviewAction(
  cardId: string,
  formData: FormData,
): Promise<void> {
  const cardIdResult = entityIdSchema.safeParse(cardId);
  const rating = formData.get("rating");

  if (!cardIdResult.success || !isReviewRating(rating)) {
    redirect(reviewNotice("error", "This review is invalid."));
  }

  try {
    await recordReview(cardIdResult.data, rating, new Date());
  } catch {
    redirect(
      reviewNotice(
        "error",
        "We could not record this review. Please try again.",
      ),
    );
  }

  revalidatePath("/dashboard/review");
  revalidatePath("/dashboard");
  redirect(reviewNotice("message", "Review recorded."));
}

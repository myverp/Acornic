export const REVIEW_RATINGS = ["again", "hard", "good", "easy"] as const;

export type ReviewRating = (typeof REVIEW_RATINGS)[number];

export type ReviewScheduleInput<State> = {
  currentState: State | null;
  now: Date;
  rating: ReviewRating;
};

export type ReviewScheduleResult<State> = {
  nextReviewAt: Date;
  state: State;
};

/**
 * Business-logic boundary for a future review algorithm.
 * Implementations must remain independent from React and persistence details.
 */
export interface ReviewScheduler<State> {
  schedule(input: ReviewScheduleInput<State>): ReviewScheduleResult<State>;
}

export function isReviewRating(value: unknown): value is ReviewRating {
  return (
    typeof value === "string" &&
    REVIEW_RATINGS.some((rating) => rating === value)
  );
}

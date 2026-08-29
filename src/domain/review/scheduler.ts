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

export type SimpleReviewState = {
  stage: number;
};

const MINUTE_IN_MS = 60 * 1000;
const DAY_IN_MS = 24 * 60 * MINUTE_IN_MS;
const STAGE_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30, 60] as const;

function normalizedStage(stage: number | undefined): number {
  if (!Number.isInteger(stage) || !stage || stage < 1) {
    return 1;
  }

  return Math.min(stage, STAGE_INTERVAL_DAYS.length - 1);
}

function currentStage(stage: number | undefined): number {
  if (!Number.isInteger(stage) || stage === undefined || stage < 0) {
    return 0;
  }

  return Math.min(stage, STAGE_INTERVAL_DAYS.length - 1);
}

function intervalDays(stage: number): number {
  return STAGE_INTERVAL_DAYS[normalizedStage(stage)];
}

export const simpleReviewScheduler: ReviewScheduler<SimpleReviewState> = {
  schedule({ currentState, now, rating }) {
    if (rating === "again") {
      return {
        nextReviewAt: new Date(now.getTime() + 10 * MINUTE_IN_MS),
        state: { stage: 0 },
      };
    }

    if (rating === "hard") {
      const stage = normalizedStage(currentState?.stage);
      const delayInDays = Math.max(1, Math.round(intervalDays(stage) / 2));

      return {
        nextReviewAt: new Date(now.getTime() + delayInDays * DAY_IN_MS),
        state: { stage },
      };
    }

    if (rating === "good") {
      const stage = Math.min(
        currentStage(currentState?.stage) + 1,
        STAGE_INTERVAL_DAYS.length - 1,
      );

      return {
        nextReviewAt: new Date(now.getTime() + intervalDays(stage) * DAY_IN_MS),
        state: { stage },
      };
    }

    if (rating === "easy") {
      const stage = Math.min(
        currentStage(currentState?.stage) + 2,
        STAGE_INTERVAL_DAYS.length - 1,
      );

      return {
        nextReviewAt: new Date(now.getTime() + intervalDays(stage) * DAY_IN_MS),
        state: { stage },
      };
    }

    throw new Error(`Unsupported review rating: ${rating}`);
  },
};

export function isReviewRating(value: unknown): value is ReviewRating {
  return (
    typeof value === "string" &&
    REVIEW_RATINGS.some((rating) => rating === value)
  );
}

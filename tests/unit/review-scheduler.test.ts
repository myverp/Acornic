import { describe, expect, it } from "vitest";

import {
  isReviewRating,
  REVIEW_RATINGS,
  simpleReviewScheduler,
} from "../../src/domain/review/scheduler";

describe("review ratings", () => {
  it("recognizes every supported rating", () => {
    REVIEW_RATINGS.forEach((rating) => expect(isReviewRating(rating)).toBe(true));
  });

  it("rejects values outside the review contract", () => {
    expect(isReviewRating("perfect")).toBe(false);
    expect(isReviewRating(null)).toBe(false);
  });
});

describe("simpleReviewScheduler", () => {
  it("resets a card rated again and makes it due in ten minutes", () => {
    const now = new Date("2026-08-29T12:00:00.000Z");

    expect(
      simpleReviewScheduler.schedule({
        currentState: { stage: 4 },
        now,
        rating: "again",
      }),
    ).toEqual({
      nextReviewAt: new Date("2026-08-29T12:10:00.000Z"),
      state: { stage: 0 },
    });
  });

  it("keeps the stage for a hard recall and halves its interval", () => {
    const now = new Date("2026-08-29T12:00:00.000Z");

    expect(
      simpleReviewScheduler.schedule({
        currentState: { stage: 4 },
        now,
        rating: "hard",
      }),
    ).toEqual({
      nextReviewAt: new Date("2026-09-05T12:00:00.000Z"),
      state: { stage: 4 },
    });
  });

  it("advances one stage for a good recall", () => {
    const now = new Date("2026-08-29T12:00:00.000Z");

    expect(
      simpleReviewScheduler.schedule({
        currentState: { stage: 2 },
        now,
        rating: "good",
      }),
    ).toEqual({
      nextReviewAt: new Date("2026-09-05T12:00:00.000Z"),
      state: { stage: 3 },
    });
  });

  it("advances two stages for an easy recall", () => {
    const now = new Date("2026-08-29T12:00:00.000Z");

    expect(
      simpleReviewScheduler.schedule({
        currentState: null,
        now,
        rating: "easy",
      }),
    ).toEqual({
      nextReviewAt: new Date("2026-09-01T12:00:00.000Z"),
      state: { stage: 2 },
    });
  });
});

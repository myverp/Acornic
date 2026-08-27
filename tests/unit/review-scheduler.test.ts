import { describe, expect, it } from "vitest";

import {
  isReviewRating,
  REVIEW_RATINGS,
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

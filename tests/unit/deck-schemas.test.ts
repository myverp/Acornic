import { describe, expect, it } from "vitest";

import {
  deckSchema,
  entityIdSchema,
  vocabularyCardSchema,
} from "../../src/features/decks/schemas";

describe("deckSchema", () => {
  it("accepts and trims a multilingual deck", () => {
    expect(
      deckSchema.parse({
        title: "  Ukrainian to Spanish  ",
        sourceLanguageCode: "uk",
        targetLanguageCode: "es",
      }),
    ).toEqual({
      title: "Ukrainian to Spanish",
      sourceLanguageCode: "uk",
      targetLanguageCode: "es",
    });
  });

  it("requires different source and target languages", () => {
    const result = deckSchema.safeParse({
      title: "English words",
      sourceLanguageCode: "en",
      targetLanguageCode: "en",
    });

    expect(result.success).toBe(false);
  });
});

describe("vocabularyCardSchema", () => {
  it("normalizes optional empty fields to null", () => {
    expect(
      vocabularyCardSchema.parse({
        sourceText: " acorn ",
        translation: " bellota ",
        exampleSentence: " ",
        notes: "",
      }),
    ).toEqual({
      sourceText: "acorn",
      translation: "bellota",
      exampleSentence: null,
      notes: null,
    });
  });

  it("rejects a card without both vocabulary terms", () => {
    expect(
      vocabularyCardSchema.safeParse({
        sourceText: "",
        translation: "bellota",
      }).success,
    ).toBe(false);
  });
});

describe("entityIdSchema", () => {
  it("accepts UUIDs and rejects route fragments", () => {
    expect(
      entityIdSchema.safeParse("11111111-1111-4111-8111-111111111111").success,
    ).toBe(true);
    expect(entityIdSchema.safeParse("../another-user").success).toBe(false);
  });
});

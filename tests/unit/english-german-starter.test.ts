import { describe, expect, it } from "vitest";

import {
  englishGermanStarterEntries,
  getEnglishGermanStarterCards,
} from "../../src/domain/datasets/english-german-starter";

describe("English–German starter dataset", () => {
  it("contains exactly 100 unique English entries", () => {
    expect(englishGermanStarterEntries).toHaveLength(100);
    expect(
      new Set(englishGermanStarterEntries.map((entry) => entry.english)).size,
    ).toBe(100);
  });

  it("supports both directions and no unrelated language pair", () => {
    const englishToGerman = getEnglishGermanStarterCards("en", "de");
    const germanToEnglish = getEnglishGermanStarterCards("de", "en");

    expect(englishToGerman?.[0]).toEqual({
      sourceText: "hello",
      translation: "Hallo",
    });
    expect(germanToEnglish?.[0]).toEqual({
      sourceText: "Hallo",
      translation: "hello",
    });
    expect(getEnglishGermanStarterCards("en-US", "de-DE")).toHaveLength(100);
    expect(getEnglishGermanStarterCards("en", "uk")).toBeNull();
  });
});

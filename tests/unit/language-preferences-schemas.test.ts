import { describe, expect, it } from "vitest";

import { languagePreferencesSchema } from "../../src/features/preferences/schemas";

describe("languagePreferencesSchema", () => {
  it("accepts multiple known and learning ISO language codes", () => {
    const result = languagePreferencesSchema.parse({
      knownLanguageCodes: ["en", "uk"],
      learningLanguageCodes: ["de", "pt-BR"],
    });

    expect(result).toEqual({
      knownLanguageCodes: ["en", "uk"],
      learningLanguageCodes: ["de", "pt-BR"],
    });
  });

  it("requires at least one language in each group", () => {
    expect(
      languagePreferencesSchema.safeParse({
        knownLanguageCodes: ["en"],
        learningLanguageCodes: [],
      }).success,
    ).toBe(false);
  });

  it("does not allow a language to be known and learning", () => {
    expect(
      languagePreferencesSchema.safeParse({
        knownLanguageCodes: ["en"],
        learningLanguageCodes: ["en", "de"],
      }).success,
    ).toBe(false);
  });
});

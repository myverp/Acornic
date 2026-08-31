import { describe, expect, it } from "vitest";

import { languageCodeSchema } from "../../src/domain/languages/language-code";
import { formatLanguageCode } from "../../src/domain/languages/language-options";

describe("languageCodeSchema", () => {
  it.each(["en", "de", "uk", "pt-BR", "zh-Hant"])(
    "accepts the language tag %s",
    (languageTag) => {
      expect(languageCodeSchema.parse(languageTag)).toBe(languageTag);
    },
  );

  it.each(["", "English", "en_US", "e"])(
    "rejects the invalid language tag %s",
    (languageTag) => {
      expect(languageCodeSchema.safeParse(languageTag).success).toBe(false);
    },
  );

  it("formats common languages with their flags and preserves unknown valid codes", () => {
    expect(formatLanguageCode("uk")).toBe("🇺🇦 Ukrainian");
    expect(formatLanguageCode("pt-BR")).toBe("pt-BR");
  });
});

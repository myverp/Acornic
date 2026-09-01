import { z } from "zod";

import { languageCodeSchema } from "@/domain/languages/language-code";

const languageCodeListSchema = z
  .array(languageCodeSchema)
  .min(1, "Choose at least one language.")
  .max(12, "Choose up to 12 languages.")
  .refine((codes) => new Set(codes).size === codes.length, {
    message: "Choose each language only once.",
  });

export const languagePreferencesSchema = z
  .object({
    knownLanguageCodes: languageCodeListSchema,
    learningLanguageCodes: languageCodeListSchema,
  })
  .superRefine(({ knownLanguageCodes, learningLanguageCodes }, context) => {
    const knownLanguages = new Set(knownLanguageCodes);
    const overlap = learningLanguageCodes.find((code) => knownLanguages.has(code));

    if (overlap) {
      context.addIssue({
        code: "custom",
        message: `${overlap} cannot be both known and learning.`,
        path: ["learningLanguageCodes"],
      });
    }
  });

export type LanguagePreferencesInput = z.infer<typeof languagePreferencesSchema>;

export function firstPreferenceValidationMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Check your language preferences and try again.";
}

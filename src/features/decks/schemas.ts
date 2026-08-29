import { z } from "zod";

import { languageCodeSchema } from "@/domain/languages/language-code";

export const entityIdSchema = z.uuid("The requested item is invalid.");

export const deckSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Enter a deck title.")
      .max(120, "Use at most 120 characters for the title."),
    sourceLanguageCode: languageCodeSchema,
    targetLanguageCode: languageCodeSchema,
  })
  .refine(
    ({ sourceLanguageCode, targetLanguageCode }) =>
      sourceLanguageCode !== targetLanguageCode,
    {
      message: "Choose two different languages.",
      path: ["targetLanguageCode"],
    },
  );

export const vocabularyCardSchema = z.object({
  sourceText: z
    .string()
    .trim()
    .min(1, "Enter the word or phrase to learn.")
    .max(500, "Use at most 500 characters for the word or phrase."),
  translation: z
    .string()
    .trim()
    .min(1, "Enter a translation.")
    .max(500, "Use at most 500 characters for the translation."),
  exampleSentence: z
    .string()
    .trim()
    .max(1000, "Use at most 1,000 characters for the example.")
    .optional()
    .transform((value) => value || null),
  notes: z
    .string()
    .trim()
    .max(2000, "Use at most 2,000 characters for notes.")
    .optional()
    .transform((value) => value || null),
});

export type DeckInput = z.infer<typeof deckSchema>;
export type VocabularyCardInput = z.infer<typeof vocabularyCardSchema>;

export function firstDeckValidationMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Check the form and try again.";
}

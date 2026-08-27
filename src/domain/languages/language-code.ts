import { z } from "zod";

const LANGUAGE_TAG_PATTERN = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/;

export const languageCodeSchema = z
  .string()
  .trim()
  .regex(LANGUAGE_TAG_PATTERN, "Use a valid language tag such as en or pt-BR.");

export type LanguageCode = z.infer<typeof languageCodeSchema>;

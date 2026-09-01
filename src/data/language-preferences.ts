import "server-only";

import type { LanguagePreferencesInput } from "@/features/preferences/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type LanguagePreference = "known" | "learning";

type UserLanguageRow = {
  language_code: string;
  preference: LanguagePreference;
};

export type LanguagePreferences = {
  knownLanguageCodes: string[];
  learningLanguageCodes: string[];
};

export function hasSavedLanguagePair(
  preferences: LanguagePreferences,
  sourceLanguageCode: string,
  targetLanguageCode: string,
): boolean {
  return (
    preferences.knownLanguageCodes.includes(sourceLanguageCode) &&
    preferences.learningLanguageCodes.includes(targetLanguageCode)
  );
}

async function authenticatedClient() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) {
    throw new Error("Authentication is required.");
  }

  return { supabase, userId };
}

export async function getLanguagePreferences(): Promise<LanguagePreferences> {
  const { supabase, userId } = await authenticatedClient();
  const { data, error } = await supabase
    .from("user_languages")
    .select("language_code, preference")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error("Could not load language preferences.");
  }

  const rows = (data ?? []) as UserLanguageRow[];

  return {
    knownLanguageCodes: rows
      .filter((row) => row.preference === "known")
      .map((row) => row.language_code),
    learningLanguageCodes: rows
      .filter((row) => row.preference === "learning")
      .map((row) => row.language_code),
  };
}

export async function hasCompletedLanguagePreferences(): Promise<boolean> {
  const preferences = await getLanguagePreferences();

  return (
    preferences.knownLanguageCodes.length > 0 &&
    preferences.learningLanguageCodes.length > 0
  );
}

export async function saveLanguagePreferences(
  input: LanguagePreferencesInput,
): Promise<void> {
  const { supabase, userId } = await authenticatedClient();
  const previous = await getLanguagePreferences();
  const rows = [
    ...input.knownLanguageCodes.map((languageCode) => ({
      user_id: userId,
      language_code: languageCode,
      preference: "known" as const,
    })),
    ...input.learningLanguageCodes.map((languageCode) => ({
      user_id: userId,
      language_code: languageCode,
      preference: "learning" as const,
    })),
  ];

  const { error: upsertError } = await supabase
    .from("user_languages")
    .upsert(rows, { onConflict: "user_id,language_code" });

  if (upsertError) {
    throw new Error("Could not save language preferences.");
  }

  const wantedLanguageCodes = new Set([
    ...input.knownLanguageCodes,
    ...input.learningLanguageCodes,
  ]);
  const removedLanguageCodes = [
    ...previous.knownLanguageCodes,
    ...previous.learningLanguageCodes,
  ].filter((code) => !wantedLanguageCodes.has(code));

  if (removedLanguageCodes.length === 0) {
    return;
  }

  const { error: deleteError } = await supabase
    .from("user_languages")
    .delete()
    .eq("user_id", userId)
    .in("language_code", removedLanguageCodes);

  if (deleteError) {
    throw new Error("Could not save language preferences.");
  }
}

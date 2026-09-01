"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { saveLanguagePreferences } from "@/data/language-preferences";
import type { FormActionState } from "@/features/decks/form-state";
import {
  firstPreferenceValidationMessage,
  languagePreferencesSchema,
} from "@/features/preferences/schemas";
import { logServerActionFailure } from "@/lib/monitoring/server";

function parseLanguagePreferences(formData: FormData) {
  return languagePreferencesSchema.safeParse({
    knownLanguageCodes: formData.getAll("knownLanguageCodes"),
    learningLanguageCodes: formData.getAll("learningLanguageCodes"),
  });
}

async function savePreferences(
  formData: FormData,
): Promise<FormActionState | null> {
  const result = parseLanguagePreferences(formData);

  if (!result.success) {
    return { error: firstPreferenceValidationMessage(result.error) };
  }

  try {
    await saveLanguagePreferences(result.data);
  } catch (error) {
    logServerActionFailure("save_language_preferences", error);
    return { error: "We could not save your preferences. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/preferences");
  revalidatePath("/onboarding");
  return null;
}

export async function completeOnboardingAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const errorState = await savePreferences(formData);

  if (errorState) {
    return errorState;
  }

  redirect("/dashboard");
}

export async function updateLanguagePreferencesAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const errorState = await savePreferences(formData);

  return errorState ?? { message: "Language preferences saved." };
}

"use client";

import { useActionState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  initialFormActionState,
  type FormActionState,
} from "@/features/decks/form-state";
import { LanguagePicker } from "@/features/preferences/language-picker";

type PreferencesFormProps = {
  action: (
    state: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
  defaults: {
    knownLanguageCodes: string[];
    learningLanguageCodes: string[];
  };
  submitLabel: string;
};

export function PreferencesForm({
  action,
  defaults,
  submitLabel,
}: PreferencesFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialFormActionState,
  );
  return (
    <form action={formAction} className="space-y-6">
      {state.error ? (
        <Alert variant="destructive" aria-live="polite">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      {state.message ? (
        <Alert aria-live="polite">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}
      <LanguagePicker
        id="known-languages"
        label="Languages you know"
        name="knownLanguageCodes"
        description="Choose every language you can use to understand translations."
        initialValue={defaults.knownLanguageCodes}
      />
      <LanguagePicker
        id="learning-languages"
        label="Languages you want to learn"
        name="learningLanguageCodes"
        description="Choose one or more languages for new vocabulary."
        initialValue={defaults.learningLanguageCodes}
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}

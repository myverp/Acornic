"use client";

import { useActionState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  initialFormActionState,
  type FormActionState,
} from "@/features/decks/form-state";
type DeckFormProps = {
  action: (
    state: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
  defaults?: {
    title: string;
    sourceLanguageCode: string;
    targetLanguageCode: string;
  };
  languageOptions: {
    knownLanguageCodes: string[];
    learningLanguageCodes: string[];
  };
  submitLabel: string;
};

export function DeckForm({
  action,
  defaults,
  languageOptions,
  submitLabel,
}: DeckFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialFormActionState,
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.error ? (
        <Alert variant="destructive" aria-live="polite">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="title">Deck title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={defaults?.title}
          maxLength={120}
          autoComplete="off"
          required
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Deck language pair</p>
        <p className="text-xs text-muted-foreground">
          Manage your available languages in Profile / Preferences.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sourceLanguageCode">Language you know</Label>
            <select
              id="sourceLanguageCode"
              name="sourceLanguageCode"
              defaultValue={defaults?.sourceLanguageCode}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              required
            >
              {languageOptions.knownLanguageCodes.map((languageCode) => (
                <option key={languageCode} value={languageCode}>
                  {languageCode}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetLanguageCode">Language to learn</Label>
            <select
              id="targetLanguageCode"
              name="targetLanguageCode"
              defaultValue={defaults?.targetLanguageCode}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              required
            >
              {languageOptions.learningLanguageCodes.map((languageCode) => (
                <option key={languageCode} value={languageCode}>
                  {languageCode}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}

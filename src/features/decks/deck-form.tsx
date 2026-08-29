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
  submitLabel: string;
};

export function DeckForm({ action, defaults, submitLabel }: DeckFormProps) {
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sourceLanguageCode">Language you know</Label>
          <Input
            id="sourceLanguageCode"
            name="sourceLanguageCode"
            defaultValue={defaults?.sourceLanguageCode}
            placeholder="en"
            autoCapitalize="none"
            autoComplete="off"
            spellCheck={false}
            required
          />
          <p className="text-xs text-muted-foreground">
            Use a language code such as en, uk, or pt-BR.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetLanguageCode">Language to learn</Label>
          <Input
            id="targetLanguageCode"
            name="targetLanguageCode"
            defaultValue={defaults?.targetLanguageCode}
            placeholder="es"
            autoCapitalize="none"
            autoComplete="off"
            spellCheck={false}
            required
          />
        </div>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}

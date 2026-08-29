"use client";

import { useActionState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  initialFormActionState,
  type FormActionState,
} from "@/features/decks/form-state";

type CardFormProps = {
  action: (
    state: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
  defaults?: {
    sourceText: string;
    translation: string;
    exampleSentence: string | null;
    notes: string | null;
  };
  submitLabel: string;
};

export function CardForm({ action, defaults, submitLabel }: CardFormProps) {
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sourceText">Word or phrase</Label>
          <Input
            id="sourceText"
            name="sourceText"
            defaultValue={defaults?.sourceText}
            maxLength={500}
            autoComplete="off"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="translation">Translation</Label>
          <Input
            id="translation"
            name="translation"
            defaultValue={defaults?.translation}
            maxLength={500}
            autoComplete="off"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="exampleSentence">Example sentence</Label>
        <Textarea
          id="exampleSentence"
          name="exampleSentence"
          defaultValue={defaults?.exampleSentence ?? ""}
          maxLength={1000}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={defaults?.notes ?? ""}
          maxLength={2000}
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}

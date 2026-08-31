"use client";

import { Download } from "lucide-react";
import { useActionState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  initialFormActionState,
  type FormActionState,
} from "@/features/decks/form-state";

type StarterSetImportFormProps = {
  action: (
    state: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
  cardCount: number;
};

export function StarterSetImportForm({
  action,
  cardCount,
}: StarterSetImportFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialFormActionState,
  );

  return (
    <form action={formAction} className="space-y-4">
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
      <p className="text-sm text-muted-foreground">
        Adds up to {cardCount} cards once. Existing words in this deck are
        skipped, so you can safely use this dataset again.
      </p>
      <Button type="submit" disabled={pending} className="w-full">
        <Download aria-hidden="true" />
        {pending ? "Adding cards…" : `Add ${cardCount} starter cards`}
      </Button>
    </form>
  );
}

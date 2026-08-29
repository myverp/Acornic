"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type DeleteButtonProps = {
  label: string;
};

export function DeleteButton({ label }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const { pending } = useFormStatus();

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="destructive"
        onClick={() => setConfirming(true)}
      >
        {label}
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2" aria-live="polite">
      <span className="text-sm text-muted-foreground">
        This cannot be undone.
      </span>
      <Button type="submit" variant="destructive" disabled={pending}>
        {pending ? "Deleting…" : `Confirm ${label.toLowerCase()}`}
      </Button>
      <Button
        type="button"
        variant="ghost"
        disabled={pending}
        onClick={() => setConfirming(false)}
      >
        Cancel
      </Button>
    </div>
  );
}

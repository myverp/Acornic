import { Alert, AlertDescription } from "@/components/ui/alert";

type StatusAlertProps = {
  error?: string;
  message?: string;
};

const knownMessages = new Set([
  "Card added.",
  "Card deleted.",
  "Card updated.",
  "Deck created.",
  "Deck deleted.",
  "Deck updated.",
  "This card is invalid.",
  "This card is no longer available.",
  "This deck is invalid.",
  "This deck is no longer available.",
  "We could not delete this card. Please try again.",
  "We could not delete this deck. Please try again.",
]);

export function StatusAlert({ error, message }: StatusAlertProps) {
  const safeError = error && knownMessages.has(error) ? error : undefined;
  const safeMessage = message && knownMessages.has(message) ? message : undefined;

  if (!safeError && !safeMessage) {
    return null;
  }

  return (
    <Alert variant={safeError ? "destructive" : "default"} role="status">
      <AlertDescription>{safeError ?? safeMessage}</AlertDescription>
    </Alert>
  );
}

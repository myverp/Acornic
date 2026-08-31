import "server-only";

export function logServerActionFailure(
  action: string,
  error: unknown,
): void {
  const message = error instanceof Error ? error.message : "Unknown error";

  console.error("Acornic server action failed", { action, message });
}

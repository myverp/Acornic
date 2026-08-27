import { z } from "zod";

export const publicEnvironmentSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

export const serverEnvironmentSchema = publicEnvironmentSchema.extend({
  APP_URL: z.url(),
});

export function formatEnvironmentError(error: z.ZodError): string {
  const fields = error.issues.map((issue) => issue.path.join(".")).join(", ");
  return `Invalid environment configuration: ${fields}`;
}

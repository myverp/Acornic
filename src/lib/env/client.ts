import {
  formatEnvironmentError,
  publicEnvironmentSchema,
} from "@/lib/env/schema";

export type PublicEnvironment = {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string;
};

let cachedEnvironment: PublicEnvironment | undefined;

export function getPublicEnvironment(): PublicEnvironment {
  if (cachedEnvironment) {
    return cachedEnvironment;
  }

  const result = publicEnvironmentSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });

  if (!result.success) {
    throw new Error(formatEnvironmentError(result.error));
  }

  cachedEnvironment = result.data;
  return cachedEnvironment;
}

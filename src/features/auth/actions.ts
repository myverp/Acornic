"use server";

import { redirect } from "next/navigation";

import {
  firstValidationMessage,
  safeInternalPath,
  signInSchema,
  signUpSchema,
} from "@/features/auth/schemas";
import { getServerEnvironment } from "@/lib/env/server";
import { logServerActionFailure } from "@/lib/monitoring/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function redirectWithNotice(
  path: string,
  kind: "error" | "message",
  message: string,
): never {
  const query = new URLSearchParams({ [kind]: message });
  redirect(`${path}?${query.toString()}`);
}

export async function signIn(formData: FormData): Promise<void> {
  const result = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") || undefined,
  });

  if (!result.success) {
    redirectWithNotice("/login", "error", firstValidationMessage(result.error));
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    redirectWithNotice("/login", "error", "Email or password is incorrect.");
  }

  redirect(safeInternalPath(result.data.next));
}

export async function signUp(formData: FormData): Promise<void> {
  const result = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    redirectWithNotice(
      "/sign-up",
      "error",
      firstValidationMessage(result.error),
    );
  }

  const environment = getServerEnvironment();
  const supabase = await createServerSupabaseClient();
  const emailRedirectTo = new URL("/auth/callback", environment.APP_URL);
  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: { emailRedirectTo: emailRedirectTo.toString() },
  });

  if (error) {
    logServerActionFailure("sign_up", error);
    redirectWithNotice(
      "/sign-up",
      "error",
      "We could not create your account. Please try again.",
    );
  }

  redirectWithNotice(
    "/login",
    "message",
    "Check your email to confirm your account.",
  );
}

export async function signOut(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}

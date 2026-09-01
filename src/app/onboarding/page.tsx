import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  getLanguagePreferences,
  hasCompletedLanguagePreferences,
} from "@/data/language-preferences";
import { completeOnboardingAction } from "@/features/preferences/actions";
import { PreferencesForm } from "@/features/preferences/preferences-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Choose your languages" };

export default async function OnboardingPage() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/login");
  }

  const [isComplete, preferences] = await Promise.all([
    hasCompletedLanguagePreferences(),
    getLanguagePreferences(),
  ]);

  if (isComplete) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <p className="text-sm font-medium text-primary">Welcome to Acornic</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Choose your languages
          </h1>
          <p className="text-muted-foreground">
            Save the languages you know and the ones you want to learn. You can
            change these later in Profile / Preferences.
          </p>
        </CardHeader>
        <CardContent>
          <PreferencesForm
            action={completeOnboardingAction}
            defaults={preferences}
            submitLabel="Continue to Acornic"
          />
        </CardContent>
      </Card>
    </main>
  );
}

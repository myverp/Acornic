import Link from "next/link";
import { BookOpen, Brain, LayoutDashboard, List, Sprout } from "lucide-react";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOut } from "@/features/auth/actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-5 px-4 sm:px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Sprout className="size-5 text-primary" aria-hidden="true" />
            Acornic
          </Link>
          <Separator orientation="vertical" className="h-5!" />
          <nav aria-label="Application" className="flex flex-1 items-center gap-1">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard" aria-label="Overview">
                <LayoutDashboard className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Overview</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/decks" aria-label="Decks">
                <BookOpen className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Decks</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/cards" aria-label="Cards">
                <List className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Cards</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/review" aria-label="Review">
                <Brain className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Review</span>
              </Link>
            </Button>
          </nav>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              Log out
            </Button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, Languages, Sprout } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Sprout className="size-5 text-primary" aria-hidden="true" />
            Acornic
          </Link>
          <nav aria-label="Account" className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Create account</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
        <div className="max-w-2xl">
          <p className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
            <Languages className="size-4" aria-hidden="true" />
            Learn from any language into any language
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Grow the words you want to remember.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Build focused vocabulary decks, add examples that matter to you,
            and review at a comfortable pace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/sign-up">
                Start learning
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>
        </div>

        <Card className="border-primary/15 shadow-sm">
          <CardHeader>
            <CardDescription>Example deck</CardDescription>
            <CardTitle className="flex items-center justify-between gap-4">
              Everyday phrases
              <span className="text-sm font-normal text-muted-foreground">
                uk → en
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-card p-5">
              <p className="text-sm text-muted-foreground">Source</p>
              <p className="mt-1 text-xl font-medium">Як справи?</p>
              <div className="my-4 h-px bg-border" />
              <p className="text-sm text-muted-foreground">Translation</p>
              <p className="mt-1 text-xl font-medium">How are you?</p>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Language pairs belong to each deck, so your garden can grow in
              more than one direction.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

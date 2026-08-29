import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ChartNoAxesColumn, Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };

const foundationCards = [
  {
    title: "Language pairs",
    description: "Choose the language you know and the one you want to learn.",
    icon: Languages,
  },
  {
    title: "Vocabulary decks",
    description: "Create private multilingual decks and add the words you want to remember.",
    icon: BookOpen,
  },
  {
    title: "Review progress",
    description: "Review history is ready for a scheduling algorithm to be added later.",
    icon: ChartNoAxesColumn,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-primary">Your garden</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Build private multilingual decks now. Review sessions and progress
          tracking will arrive in the next milestones.
        </p>
        <Button asChild className="mt-5">
          <Link href="/dashboard/decks">Manage decks</Link>
        </Button>
      </div>
      <section aria-labelledby="foundation-heading">
        <h2 id="foundation-heading" className="sr-only">
          Application foundation
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {foundationCards.map(({ title, description, icon: Icon }) => (
            <Card key={title}>
              <CardHeader>
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-6">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

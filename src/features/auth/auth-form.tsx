import Link from "next/link";
import { Sprout } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthFormProps = {
  action: (formData: FormData) => Promise<void>;
  error?: string;
  message?: string;
  mode: "sign-in" | "sign-up";
  next?: string;
};

export function AuthForm({
  action,
  error,
  message,
  mode,
  next,
}: AuthFormProps) {
  const isSignUp = mode === "sign-up";

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Sprout className="size-5 text-primary" aria-hidden="true" />
          Acornic
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>
              <h1>{isSignUp ? "Create your account" : "Welcome back"}</h1>
            </CardTitle>
            <CardDescription>
              {isSignUp
                ? "Start building vocabulary decks for any language pair."
                : "Log in to continue growing your vocabulary."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={action} className="space-y-5">
              {next ? <input type="hidden" name="next" value={next} /> : null}
              {error ? (
                <Alert variant="destructive" className="motion-error">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
              {message ? (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  minLength={isSignUp ? 8 : undefined}
                  required
                />
                {isSignUp ? (
                  <p className="text-sm text-muted-foreground">
                    Use at least 8 characters.
                  </p>
                ) : null}
              </div>
              <Button type="submit" className="w-full">
                {isSignUp ? "Create account" : "Log in"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "New to Acornic?"}{" "}
              <Link
                href={isSignUp ? "/login" : "/sign-up"}
                className="font-medium text-foreground underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {isSignUp ? "Log in" : "Create an account"}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

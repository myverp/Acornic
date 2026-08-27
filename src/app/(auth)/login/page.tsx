import type { Metadata } from "next";

import { signIn } from "@/features/auth/actions";
import { AuthForm } from "@/features/auth/auth-form";

export const metadata: Metadata = { title: "Log in" };

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, message, next } = await searchParams;

  return (
    <AuthForm
      action={signIn}
      error={error}
      message={message}
      mode="sign-in"
      next={next}
    />
  );
}

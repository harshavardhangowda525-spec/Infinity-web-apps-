import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the Infinity Web & Apps admin dashboard.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="card h-96 animate-pulse" />}>
      <LoginForm />
    </Suspense>
  );
}

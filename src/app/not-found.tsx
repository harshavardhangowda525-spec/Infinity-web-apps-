import Link from "next/link";
import { Logo } from "@/components/site/Logo";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-mist-100 px-5">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <p className="font-display text-6xl font-bold heading-gradient">404</p>
        <h1 className="mt-4 text-xl font-semibold text-ink-900">
          Page not found
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-900/60">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link href="/" className="btn-primary mt-6">
          Back to home
        </Link>
      </div>
    </div>
  );
}

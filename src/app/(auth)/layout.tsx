import Link from "next/link";
import { AnimatedBackground } from "@/components/motion/AnimatedBackground";
import { Logo } from "@/components/site/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative grid min-h-screen place-items-center px-5 py-16">
      <AnimatedBackground />
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        {children}
        <p className="mt-6 text-center text-sm text-ink-900/55">
          <Link href="/" className="link-underline hover:text-royal-600">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setSignedIn(!!session?.user)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-mist-300/70 bg-white/80 backdrop-blur-xl shadow-[0_2px_20px_-12px_rgba(10,37,64,0.3)]"
          : "bg-transparent"
      )}
    >
      <nav className="container-x flex h-16 items-center justify-between">
        <Link href="/" aria-label="Home" className="shrink-0">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-royal-50 text-royal-700"
                      : "text-ink-900/70 hover:bg-ink-900/5 hover:text-ink-900"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {signedIn ? (
            <Link href="/admin" className="btn-primary">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
          ) : (
            <Link href="/contact" className="btn-primary">
              Get Started
            </Link>
          )}
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-xl text-ink-900 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-mist-300/70 bg-white/95 backdrop-blur-xl md:hidden"
          >
            <ul className="container-x flex flex-col gap-1 py-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-ink-900/80 hover:bg-royal-50 hover:text-royal-700"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 flex gap-3 px-1">
                {signedIn ? (
                  <Link href="/admin" className="btn-primary flex-1">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                ) : (
                  <Link href="/contact" className="btn-primary flex-1">
                    Get Started
                  </Link>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

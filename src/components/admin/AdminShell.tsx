"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Inbox,
  Users,
  FolderKanban,
  SlidersHorizontal,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { createClient } from "@/lib/supabase/client";
import { initials } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ToastProvider } from "@/components/admin/useToast";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/content", label: "Content & Pricing", icon: SlidersHorizontal },
];

export function AdminShell({
  email,
  name,
  children,
}: {
  email: string;
  name?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const SidebarInner = (
    <div className="flex h-full flex-col">
      <div className="px-6 py-5">
        <Link href="/" className="[&_span.text-ink-900]:text-white [&_span.text-royal-600]:text-royal-300">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-royal-500 text-white shadow-glow"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" /> View website
        </Link>
        <div className="mt-2 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-royal-400 to-royal-700 text-xs font-bold text-white">
            {initials(name || email)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-white">
              {name || "Administrator"}
            </div>
            <div className="truncate text-xs text-white/50">{email}</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-red-500/20 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-mist-100">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-ink-950 lg:block">
        {SidebarInner}
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-mist-300 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/admin">
          <Logo />
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-xl text-ink-900"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-ink-950">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 grid h-9 w-9 place-items-center rounded-lg text-white/70 hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {SidebarInner}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
          <ToastProvider>{children}</ToastProvider>
        </div>
      </div>
    </div>
  );
}

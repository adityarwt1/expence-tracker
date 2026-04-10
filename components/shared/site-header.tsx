"use client";

import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { usePathname } from "next/navigation";

const marketingLinks = [
  { label: "Agenda", href: "/#agenda" },
  { label: "Features", href: "/#features" },
  { label: "Reports", href: "/#reports" },
  { label: "Share", href: "/#share" },
];

const appLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Reports", href: "/reports" },
  { label: "Share", href: "/share" },
];

interface SiteHeaderProps {
  mode: "marketing" | "app";
}

const isActiveRoute = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

export function SiteHeader({ mode }: SiteHeaderProps) {
  const pathname = usePathname();
  const links = mode === "marketing" ? marketingLinks : appLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#1e1e1e]/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Logo />
        <div className="flex flex-wrap items-center justify-end gap-3">
          <nav className="flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2">
            {links.map((link) => {
              const active = mode === "app" && isActiveRoute(pathname, link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    active
                      ? "bg-white text-[#101010]"
                      : "text-white/72 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <Link
            href={mode === "marketing" ? "/dashboard" : "/"}
            className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#072229] transition hover:bg-[var(--accent-strong)]"
          >
            {mode === "marketing" ? "Open Workspace" : "View Landing"}
          </Link>
        </div>
      </div>
    </header>
  );
}

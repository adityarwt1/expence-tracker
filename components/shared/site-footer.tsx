import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-4">
          <Logo compact />
          <p className="max-w-2xl text-sm text-white/55">
            Astra Ledger helps consumers turn expense tracking into a confident
            weekly habit with better visibility, sharper reporting, and cleaner
            stakeholder updates.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-white/60 lg:justify-end">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/reports">Reports</Link>
          <Link href="/share">Share</Link>
        </div>
      </div>
    </footer>
  );
}

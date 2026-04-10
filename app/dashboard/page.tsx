import { DashboardView } from "@/components/dashboard/dashboard-view";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="page-shell">
      <SiteHeader mode="app" />
      <main className="mx-auto w-full max-w-7xl px-6 py-10 lg:py-14">
        <DashboardView />
      </main>
      <SiteFooter />
    </div>
  );
}

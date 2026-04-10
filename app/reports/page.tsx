import { ReportsView } from "@/components/reports/reports-view";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
};

export default function ReportsPage() {
  return (
    <div className="page-shell">
      <SiteHeader mode="app" />
      <main className="mx-auto w-full max-w-7xl px-6 py-10 lg:py-14">
        <ReportsView />
      </main>
      <SiteFooter />
    </div>
  );
}

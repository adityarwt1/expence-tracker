"use client";

import { AreaTrendChart, BarChart, DonutChart } from "@/components/ui/charts";
import { ReportsPayload, ReportsResponse } from "@/interfaces/expense";
import Link from "next/link";
import { useEffect, useState } from "react";

function ReportsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-72 rounded-[2rem] bg-white/6" />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="h-[26rem] rounded-[2rem] bg-white/6" />
        <div className="h-[26rem] rounded-[2rem] bg-white/6" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="h-[24rem] rounded-[2rem] bg-white/6" />
        <div className="h-[24rem] rounded-[2rem] bg-white/6" />
      </div>
    </div>
  );
}

export function ReportsView() {
  const [data, setData] = useState<ReportsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadReports = async () => {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/v1/reports", {
        cache: "no-store",
      });
      const result = (await response.json()) as ReportsResponse;

      if (cancelled) {
        return;
      }

      if (!response.ok || !result.success || !result.data) {
        setError(result.message || "Unable to load reports.");
        setIsLoading(false);
        return;
      }

      setData(result.data);
      setIsLoading(false);
    };

    void loadReports();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  if (isLoading) {
    return <ReportsSkeleton />;
  }

  if (!data) {
    return (
      <div className="glass-panel rounded-[2rem] p-8">
        <p className="eyebrow">Reports</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          We couldn&apos;t load the report view.
        </h1>
        <p className="mt-4 max-w-2xl leading-8 text-white/65">
          {error || "Something went wrong while loading the reports."}
        </p>
        <button
          type="button"
          onClick={() => {
            setReloadKey((value) => value + 1);
          }}
          className="mt-6 rounded-full border border-white/14 px-5 py-3 text-sm text-white/80 transition hover:bg-white/6 hover:text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const demoMode = data.viewer.source === "demo";

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[2rem] p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="status-pill text-white/72">
            {demoMode ? "Demo reporting data" : `Live account: ${data.viewer.email}`}
          </span>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/dashboard"
              className="rounded-full border border-white/14 px-4 py-2 text-white/72 transition hover:bg-white/6 hover:text-white"
            >
              Back to dashboard
            </Link>
            <Link
              href="/share"
              className="rounded-full border border-white/14 px-4 py-2 text-white/72 transition hover:bg-white/6 hover:text-white"
            >
              Open share
            </Link>
          </div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <p className="eyebrow">Reports</p>
            <h1 className="font-display text-4xl font-semibold tracking-tight lg:text-5xl">
              Turn monthly expense data into a report that reads clearly.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-white/65">
              Graphs now anchor the reporting flow, making it much easier to
              read pace, spot category pressure, and explain where spend is
              moving.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="surface-card rounded-[1.5rem] p-5">
              <p className="text-sm text-white/55">Total tracked spend</p>
              <p className="mt-3 font-display text-3xl font-semibold">
                {data.totalSpend}
              </p>
            </div>
            <div className="surface-card rounded-[1.5rem] p-5">
              <p className="text-sm text-white/55">Month-on-month signal</p>
              <p className="mt-3 font-display text-3xl font-semibold">
                {data.monthDelta}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="glass-panel rounded-[2rem] p-6 lg:p-8">
          <p className="eyebrow">Monthly trend</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            Six-month spending pattern
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/65">
            Use this view to explain how current spend compares with the recent
            run rate.
          </p>
          <div className="mt-8">
            <BarChart points={data.monthlyTrend} />
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-6 lg:p-8">
          <p className="eyebrow">Category mix</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            Budget concentration by category
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/65">
            The donut view helps show whether one category is dominating the
            month or if the budget is staying balanced.
          </p>
          <div className="mt-8">
            <DonutChart segments={data.categoryBreakdown} />
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-panel rounded-[2rem] p-6 lg:p-8">
          <p className="eyebrow">Weekly movement</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            Short-term flow
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/65">
            This graph highlights short bursts of spending so the report still
            feels useful between month-end reviews.
          </p>
          <div className="mt-8">
            <AreaTrendChart points={data.weeklyTrend} accent="#f4b350" />
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-6 lg:p-8">
          <p className="eyebrow">Readout</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            Key insights to mention
          </h2>
          <div className="mt-6 space-y-4">
            {data.insights.map((insight) => (
              <article
                key={insight.title}
                className="surface-card rounded-[1.4rem] p-4"
              >
                <h3 className="font-medium text-white">{insight.title}</h3>
                <p className="mt-2 text-sm leading-7 text-white/65">
                  {insight.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="glass-panel rounded-[2rem] p-6 lg:p-8">
        <p className="eyebrow">Breakdown</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          Category detail
        </h2>
        <div className="mt-6 space-y-4">
          {data.categoryBreakdown.map((category) => (
            <article key={category.category} className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-white">{category.category}</p>
                  <p className="text-sm text-white/50">
                    {category.share}% of total tracked spend
                  </p>
                </div>
                <p className="text-sm text-white/75">{category.formattedAmount}</p>
              </div>
              <div className="h-3 rounded-full bg-white/8">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(category.share, 6)}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

"use client";

import { SignupForm } from "@/components/forms/signup-form";
import { SharePayload, ShareResponse } from "@/interfaces/expense";
import Link from "next/link";
import { useEffect, useState } from "react";

function ShareSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="h-[28rem] rounded-[2rem] bg-white/6" />
        <div className="h-[28rem] rounded-[2rem] bg-white/6" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="h-[24rem] rounded-[2rem] bg-white/6" />
        <div className="h-[24rem] rounded-[2rem] bg-white/6" />
      </div>
    </div>
  );
}

export function ShareView() {
  const [data, setData] = useState<SharePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [clipboardMessage, setClipboardMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const copyText = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setClipboardMessage(`${label} copied to clipboard.`);
    } catch {
      setClipboardMessage("Clipboard access failed in this browser.");
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadShare = async () => {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/v1/share", {
        cache: "no-store",
      });
      const result = (await response.json()) as ShareResponse;

      if (cancelled) {
        return;
      }

      if (!response.ok || !result.success || !result.data) {
        setError(result.message || "Unable to load share view.");
        setIsLoading(false);
        return;
      }

      setData(result.data);
      setIsLoading(false);
    };

    void loadShare();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  if (isLoading) {
    return <ShareSkeleton />;
  }

  if (!data) {
    return (
      <div className="glass-panel rounded-[2rem] p-8">
        <p className="eyebrow">Share</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          We couldn&apos;t load the sharing workspace.
        </h1>
        <p className="mt-4 max-w-2xl leading-8 text-white/65">
          {error || "Something went wrong while loading the share view."}
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
  const detailedBrief = [
    data.shareMessage,
    "",
    ...data.stats.map((stat) => `${stat.label}: ${stat.value} (${stat.note})`),
    "",
    ...data.topCategories.map(
      (category) => `${category.category}: ${category.formattedAmount} (${category.share}%)`,
    ),
  ].join("\n");

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="glass-panel rounded-[2rem] p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="status-pill text-white/72">
              {demoMode ? "Demo share preview" : `Ready to share from ${data.viewer.email}`}
            </span>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                href="/dashboard"
                className="rounded-full border border-white/14 px-4 py-2 text-white/72 transition hover:bg-white/6 hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                href="/reports"
                className="rounded-full border border-white/14 px-4 py-2 text-white/72 transition hover:bg-white/6 hover:text-white"
              >
                Reports
              </Link>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <p className="eyebrow">Share</p>
            <h1 className="font-display text-4xl font-semibold tracking-tight lg:text-5xl">
              {data.headline}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-white/65">
              {data.description}
            </p>
          </div>
          <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-black/10 p-6">
            <p className="text-sm text-white/45">Share preview</p>
            <p className="mt-4 text-2xl leading-10 text-white/90">
              {data.shareMessage}
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {data.stats.map((stat) => (
              <article key={stat.label} className="surface-card rounded-[1.5rem] p-5">
                <p className="text-sm text-white/55">{stat.label}</p>
                <p className="mt-3 font-display text-3xl font-semibold">
                  {stat.value}
                </p>
                <p className="mt-3 text-sm leading-7 text-white/55">{stat.note}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="glass-panel rounded-[2rem] p-6 lg:p-8">
            <p className="eyebrow">Actions</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
              Copy a clean update
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/65">
              Use the short note for quick chats and the detailed brief when you
              need more context.
            </p>
            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={() => {
                  void copyText(data.shareMessage, "Short update");
                }}
                className="rounded-[1.2rem] bg-[var(--accent)] px-5 py-3 font-semibold text-[#072229] transition hover:bg-[var(--accent-strong)]"
              >
                Copy short update
              </button>
              <button
                type="button"
                onClick={() => {
                  void copyText(detailedBrief, "Detailed brief");
                }}
                className="rounded-[1.2rem] border border-white/14 px-5 py-3 font-semibold text-white/82 transition hover:bg-white/6"
              >
                Copy detailed brief
              </button>
            </div>
            {clipboardMessage ? (
              <p className="mt-4 text-sm text-white/65">{clipboardMessage}</p>
            ) : null}
          </section>

          {demoMode ? (
            <SignupForm
              compact
              title="Make this your real share flow"
              description="Create an account to replace the demo snapshot with your own live expense data and reports."
            />
          ) : (
            <section className="glass-panel rounded-[2rem] p-6 lg:p-8">
              <p className="eyebrow">Share confidence</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
                Live account data is active.
              </h2>
              <p className="mt-4 leading-8 text-white/65">
                Your copied updates now come from the same backend-backed data
                used by the dashboard and reports pages.
              </p>
            </section>
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="glass-panel rounded-[2rem] p-6 lg:p-8">
          <p className="eyebrow">Top categories</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            What the shared update should mention
          </h2>
          <div className="mt-6 space-y-4">
            {data.topCategories.map((category) => (
              <article key={category.category} className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{category.category}</p>
                    <p className="text-sm text-white/50">
                      {category.share}% of the current month
                    </p>
                  </div>
                  <p className="text-sm text-white/75">{category.formattedAmount}</p>
                </div>
                <div className="h-3 rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(category.share, 8)}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-6 lg:p-8">
          <p className="eyebrow">Recent proof points</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            Latest expenses behind the summary
          </h2>
          <div className="mt-6 space-y-3">
            {data.recentTransactions.map((transaction) => (
              <article
                key={transaction.id}
                className="surface-card flex flex-wrap items-center justify-between gap-4 rounded-[1.35rem] px-4 py-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">
                    {transaction.title}
                  </p>
                  <p className="mt-1 text-sm text-white/50">
                    {transaction.category} • {transaction.formattedDate}
                  </p>
                </div>
                <p className="font-medium text-white">
                  {transaction.formattedAmount}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

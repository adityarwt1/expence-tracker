"use client";

import { SignupForm } from "@/components/forms/signup-form";
import { AreaTrendChart } from "@/components/ui/charts";
import {
  ExpenseMutationResponse,
  OverviewPayload,
  OverviewResponse,
  expenseCategories,
  paymentMethods,
} from "@/interfaces/expense";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

type ExpenseDraft = {
  title: string;
  category: (typeof expenseCategories)[number];
  amount: string;
  spentAt: string;
  paymentMethod: (typeof paymentMethods)[number];
  notes: string;
  recurring: boolean;
};

const createInitialDraft = (): ExpenseDraft => ({
  title: "",
  category: expenseCategories[0],
  amount: "",
  spentAt: new Date().toISOString().slice(0, 10),
  paymentMethod: paymentMethods[0],
  notes: "",
  recurring: false,
});

const toneClasses = {
  positive: "border-emerald-400/20 bg-emerald-400/8",
  negative: "border-rose-400/20 bg-rose-400/8",
  neutral: "border-white/10 bg-white/4",
};

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="h-72 rounded-[2rem] bg-white/6" />
        <div className="h-72 rounded-[2rem] bg-white/6" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 rounded-[1.75rem] bg-white/6" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="h-[28rem] rounded-[2rem] bg-white/6" />
        <div className="h-[28rem] rounded-[2rem] bg-white/6" />
      </div>
    </div>
  );
}

export function DashboardView() {
  const [data, setData] = useState<OverviewPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [draft, setDraft] = useState<ExpenseDraft>(createInitialDraft);
  const [reloadKey, setReloadKey] = useState(0);
  const [isSaving, startSaving] = useTransition();

  useEffect(() => {
    let cancelled = false;

    const loadOverview = async () => {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/v1/overview", {
        cache: "no-store",
      });
      const result = (await response.json()) as OverviewResponse;

      if (cancelled) {
        return;
      }

      if (!response.ok || !result.success || !result.data) {
        setError(result.message || "Unable to load dashboard data.");
        setIsLoading(false);
        return;
      }

      setData(result.data);
      setIsLoading(false);
    };

    void loadOverview();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const saveExpense = async () => {
    setFeedback(null);

    const response = await fetch("/api/v1/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...draft,
        amount: Number(draft.amount),
      }),
    });

    const result = (await response.json()) as ExpenseMutationResponse;

    if (!response.ok || !result.success) {
      setFeedback(result.message || "Unable to save the expense.");
      return;
    }

    setFeedback(result.message || "Expense saved successfully.");
    setDraft(createInitialDraft());
    setReloadKey((value) => value + 1);
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!data) {
    return (
      <div className="glass-panel rounded-[2rem] p-8">
        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          We couldn&apos;t load the workspace.
        </h1>
        <p className="mt-4 max-w-2xl leading-8 text-white/65">
          {error || "Something went wrong while loading the dashboard."}
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
      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <section className="glass-panel rounded-[2rem] p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="status-pill text-white/72">
              {demoMode
                ? "Demo mode enabled"
                : `Signed in as ${data.viewer.email}`}
            </span>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                href="/reports"
                className="rounded-full border border-white/14 px-4 py-2 text-white/72 transition hover:bg-white/6 hover:text-white"
              >
                Open reports
              </Link>
              <Link
                href="/share"
                className="rounded-full border border-white/14 px-4 py-2 text-white/72 transition hover:bg-white/6 hover:text-white"
              >
                Open share
              </Link>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <p className="eyebrow">Dashboard</p>
            <h1 className="font-display text-4xl font-semibold tracking-tight lg:text-5xl">
              Keep every rupee visible before it turns into surprise spend.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-white/65">
              Review the current month, track the most recent expenses, and move
              straight into reporting or sharing when you need to explain the
              numbers.
            </p>
          </div>
          {demoMode ? (
            <div className="mt-8 rounded-[1.6rem] border border-[var(--accent)]/20 bg-[var(--accent)]/8 p-5">
              <p className="font-medium text-white">
                You&apos;re exploring with live demo data.
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">
                Create an account to save real expenses, keep your own report
                history, and use the sharing view with personal numbers.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="surface-card rounded-[1.4rem] p-4">
                <p className="text-sm text-white/55">Workspace status</p>
                <p className="mt-2 font-display text-2xl font-semibold">
                  Live
                </p>
                <p className="mt-2 text-sm text-white/55">
                  Expense changes sync into overview, reports, and share.
                </p>
              </div>
              <div className="surface-card rounded-[1.4rem] p-4">
                <p className="text-sm text-white/55">Tracking mode</p>
                <p className="mt-2 font-display text-2xl font-semibold">
                  Account
                </p>
                <p className="mt-2 text-sm text-white/55">
                  Saved expenses are backed by the API and ready for reporting.
                </p>
              </div>
              <div className="surface-card rounded-[1.4rem] p-4">
                <p className="text-sm text-white/55">Best next step</p>
                <p className="mt-2 font-display text-2xl font-semibold">
                  Add expense
                </p>
                <p className="mt-2 text-sm text-white/55">
                  Log the latest transaction to keep your month accurate.
                </p>
              </div>
            </div>
          )}
        </section>
        {demoMode ? (
          <SignupForm
            compact
            title="Create your saved workspace"
            description="Switch from demo data to your own account so dashboard actions, reports, and share output stay persistent."
          />
        ) : (
          <aside className="glass-panel rounded-[2rem] p-6 lg:p-8">
            <p className="eyebrow">Workspace health</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
              Everything is ready for day-to-day tracking.
            </h2>
            <p className="mt-4 leading-8 text-white/65">
              New expenses update the dashboard immediately, and your reports and
              share summary stay aligned with the latest month.
            </p>
            <div className="mt-8 space-y-4">
              <div className="surface-card rounded-[1.4rem] p-4">
                <p className="text-sm text-white/55">Connected account</p>
                <p className="mt-2 text-lg font-medium text-white">
                  {data.viewer.email}
                </p>
              </div>
              <div className="surface-card rounded-[1.4rem] p-4">
                <p className="text-sm text-white/55">API-backed actions</p>
                <p className="mt-2 text-lg font-medium text-white">
                  Overview, reports, and share are live.
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <article
            key={metric.label}
            className={`rounded-[1.75rem] border p-5 ${
              toneClasses[metric.tone]
            }`}
          >
            <p className="text-sm text-white/55">{metric.label}</p>
            <p className="mt-3 font-display text-3xl font-semibold tracking-tight">
              {metric.value}
            </p>
            <p className="mt-3 text-sm leading-7 text-white/65">{metric.detail}</p>
          </article>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="space-y-6">
          <section className="glass-panel rounded-[2rem] p-6 lg:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Weekly flow</p>
                <h2 className="font-display text-3xl font-semibold tracking-tight">
                  Recent spending trend
                </h2>
              </div>
              <span className="status-pill text-white/65">
                Updates from your expense timeline
              </span>
            </div>
            <AreaTrendChart points={data.trend} />
          </section>

          <section className="glass-panel rounded-[2rem] p-6 lg:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Recent activity</p>
                <h2 className="font-display text-3xl font-semibold tracking-tight">
                  Latest expenses
                </h2>
              </div>
            </div>
            <div className="space-y-3">
              {data.transactions.map((transaction) => (
                <article
                  key={transaction.id}
                  className="surface-card flex flex-wrap items-center justify-between gap-4 rounded-[1.35rem] px-4 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">
                      {transaction.title}
                    </p>
                    <p className="mt-1 text-sm text-white/50">
                      {transaction.category} • {transaction.formattedDate} •{" "}
                      {transaction.paymentMethod}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">
                      {transaction.formattedAmount}
                    </p>
                    {transaction.recurring ? (
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
                        Recurring
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {demoMode ? (
            <section className="glass-panel rounded-[2rem] p-6 lg:p-8">
              <p className="eyebrow">Quick add</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
                Save expenses with an account.
              </h2>
              <p className="mt-4 leading-8 text-white/65">
                The demo shows the real interface, but saving new expenses is
                unlocked once you create a workspace.
              </p>
              <div className="mt-6">
                <SignupForm
                  compact
                  title="Unlock saved expenses"
                  description="Create your account and the quick-add form will begin writing directly to the backend API."
                />
              </div>
            </section>
          ) : (
            <section className="glass-panel rounded-[2rem] p-6 lg:p-8">
              <p className="eyebrow">Quick add</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
                Add a new expense
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/65">
                Log a transaction and the dashboard will refresh from the API.
              </p>
              <form
                className="mt-6 space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  startSaving(() => {
                    void saveExpense();
                  });
                }}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    value={draft.title}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Expense title"
                    className="px-4 py-3"
                    required
                  />
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={draft.amount}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        amount: event.target.value,
                      }))
                    }
                    placeholder="Amount"
                    className="px-4 py-3"
                    required
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <select
                    value={draft.category}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        category: event.target.value as ExpenseDraft["category"],
                      }))
                    }
                    className="px-4 py-3"
                  >
                    {expenseCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <select
                    value={draft.paymentMethod}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        paymentMethod: event.target.value as ExpenseDraft["paymentMethod"],
                      }))
                    }
                    className="px-4 py-3"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="date"
                  value={draft.spentAt}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      spentAt: event.target.value,
                    }))
                  }
                  className="px-4 py-3"
                />
                <textarea
                  value={draft.notes}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  placeholder="Notes (optional)"
                  rows={4}
                  className="px-4 py-3"
                />
                <label className="flex items-center gap-3 rounded-[1rem] border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/72">
                  <input
                    type="checkbox"
                    checked={draft.recurring}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        recurring: event.target.checked,
                      }))
                    }
                    className="size-4 min-h-4 min-w-4"
                  />
                  Mark this as a recurring expense
                </label>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full rounded-2xl bg-[var(--accent)] px-5 py-3 font-semibold text-[#072229] transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save expense"}
                </button>
                {feedback ? (
                  <p className="text-sm text-white/65">{feedback}</p>
                ) : null}
              </form>
            </section>
          )}

          <section className="glass-panel rounded-[2rem] p-6 lg:p-8">
            <p className="eyebrow">Budget watch</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
              Highest pressure categories
            </h2>
            <div className="mt-6 space-y-4">
              {data.budgets.length ? (
                data.budgets.map((budget) => (
                  <article key={budget.category} className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{budget.category}</p>
                        <p className="text-sm text-white/50">
                          {budget.formattedAmount} of {budget.formattedBudget}
                        </p>
                      </div>
                      <p className="text-sm text-white/65">
                        {Math.round(budget.progress)}% used
                      </p>
                    </div>
                    <div className="h-3 rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(budget.progress, 100)}%`,
                          backgroundColor: budget.color,
                        }}
                      />
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-sm leading-7 text-white/55">
                  Add expenses to see which categories are applying the most
                  pressure to the monthly budget.
                </p>
              )}
            </div>
          </section>

          <section className="glass-panel rounded-[2rem] p-6 lg:p-8">
            <p className="eyebrow">Highlights</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
              What matters most right now
            </h2>
            <div className="mt-6 space-y-4">
              {data.highlights.map((highlight) => (
                <article
                  key={highlight.title}
                  className={`rounded-[1.35rem] border p-4 ${
                    toneClasses[highlight.tone]
                  }`}
                >
                  <h3 className="font-medium text-white">{highlight.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/65">
                    {highlight.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

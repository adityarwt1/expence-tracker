import { SignupForm } from "@/components/forms/signup-form";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";
import { AreaTrendChart, BarChart } from "@/components/ui/charts";
import Link from "next/link";

const heroTrend = [
  { label: "Mon", amount: 1800, formattedAmount: "INR 1.8K" },
  { label: "Tue", amount: 1250, formattedAmount: "INR 1.3K" },
  { label: "Wed", amount: 2400, formattedAmount: "INR 2.4K" },
  { label: "Thu", amount: 960, formattedAmount: "INR 960" },
  { label: "Fri", amount: 2100, formattedAmount: "INR 2.1K" },
  { label: "Sat", amount: 1320, formattedAmount: "INR 1.3K" },
  { label: "Sun", amount: 890, formattedAmount: "INR 890" },
];

const reportTrend = [
  { month: "Nov", label: "Nov", amount: 12400, formattedAmount: "INR 12.4K" },
  { month: "Dec", label: "Dec", amount: 14800, formattedAmount: "INR 14.8K" },
  { month: "Jan", label: "Jan", amount: 17200, formattedAmount: "INR 17.2K" },
  { month: "Feb", label: "Feb", amount: 13950, formattedAmount: "INR 14K" },
  { month: "Mar", label: "Mar", amount: 16540, formattedAmount: "INR 16.5K" },
  { month: "Apr", label: "Apr", amount: 15880, formattedAmount: "INR 15.9K" },
];

const agendaItems = [
  {
    title: "Clarity before complexity",
    description:
      "We surface the numbers consumers need first: spend, trend, budget pressure, and what needs attention next.",
  },
  {
    title: "Share-ready accountability",
    description:
      "Every report and summary is designed so you can communicate progress without rebuilding the story in another tool.",
  },
  {
    title: "Useful from day one",
    description:
      "The workspace opens with seeded data, a live dashboard, visual reporting, and a clean sharing flow.",
  },
];

const featureItems = [
  {
    title: "Dedicated landing experience",
    description:
      "A polished marketing page explains the value clearly, shows the product agenda, and guides users into the app.",
  },
  {
    title: "Live operational dashboard",
    description:
      "Track recent expenses, review budget pressure, and add new transactions from a focused command center.",
  },
  {
    title: "Graph-driven reports",
    description:
      "Monthly trend bars, weekly flow visuals, and category mix views make reporting feel professional and easy to read.",
  },
  {
    title: "Share workflow",
    description:
      "Turn the current month into a concise update that is clean enough for teammates, clients, or family stakeholders.",
  },
];

export default function Home() {
  return (
    <div className="page-shell">
      <SiteHeader mode="marketing" />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 lg:py-16">
        <section className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="eyebrow">Expense tracking, redesigned</p>
              <h1 className="font-display max-w-4xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
                A professional expense tracker with a separate landing page,
                reporting graphs, and a cleaner customer story.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/65">
                Astra Ledger helps consumers stay in control with a focused dark
                interface, sharper reporting, and a shareable month-end summary
                that feels ready for production.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-[#072229] transition hover:bg-[var(--accent-strong)]"
              >
                Launch workspace
              </Link>
              <Link
                href="#agenda"
                className="rounded-full border border-white/14 px-6 py-3 text-white/80 transition hover:bg-white/6 hover:text-white"
              >
                See our agenda
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="surface-card rounded-[1.5rem] p-5">
                <p className="text-sm text-white/55">Monthly visibility</p>
                <p className="mt-2 font-display text-3xl font-semibold">24/7</p>
                <p className="mt-2 text-sm text-white/55">
                  Always-on spend monitoring with a cleaner signal-to-noise
                  ratio.
                </p>
              </div>
              <div className="surface-card rounded-[1.5rem] p-5">
                <p className="text-sm text-white/55">Report confidence</p>
                <p className="mt-2 font-display text-3xl font-semibold">+41%</p>
                <p className="mt-2 text-sm text-white/55">
                  Stronger visibility into trends, category pressure, and share
                  updates.
                </p>
              </div>
              <div className="surface-card rounded-[1.5rem] p-5">
                <p className="text-sm text-white/55">Setup friction</p>
                <p className="mt-2 font-display text-3xl font-semibold">Low</p>
                <p className="mt-2 text-sm text-white/55">
                  Starter data loads automatically so the whole product feels
                  complete immediately.
                </p>
              </div>
            </div>
          </div>
          <SignupForm
            title="Create your workspace"
            description="Set up a secure account, land directly in the dashboard, and start with seeded expenses so reports and sharing are ready right away."
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glass-panel rounded-[2rem] p-6 lg:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Preview</p>
                <h2 className="font-display text-3xl font-semibold tracking-tight">
                  A dashboard that shows the signal, not the noise.
                </h2>
              </div>
              <span className="status-pill text-white/70">Dark theme ready</span>
            </div>
            <AreaTrendChart points={heroTrend} />
          </div>
          <div className="grid gap-4">
            <div className="glass-panel rounded-[2rem] p-6">
              <p className="text-sm text-white/55">What changes now</p>
              <ul className="mt-4 space-y-4 text-sm leading-7 text-white/72">
                <li>Separate landing page for product positioning and onboarding.</li>
                <li>Professional dashboard route for actual product usage.</li>
                <li>Graph-based reports and clean sharing workflow.</li>
              </ul>
            </div>
            <div className="glass-panel rounded-[2rem] p-6">
              <p className="text-sm text-white/55">UI direction</p>
              <p className="mt-4 text-lg leading-8 text-white/72">
                Built around your requested `#1e1e1e` background and white text,
                with a refined visual system instead of a starter-template look.
              </p>
            </div>
          </div>
        </section>

        <section id="agenda" className="space-y-6 py-8">
          <div className="max-w-3xl space-y-4">
            <p className="eyebrow">Our agenda for consumers</p>
            <h2 className="font-display text-4xl font-semibold tracking-tight">
              Help people spend with confidence, explain their numbers faster,
              and keep the interface calm under pressure.
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {agendaItems.map((item) => (
              <article
                key={item.title}
                className="glass-panel rounded-[2rem] p-6 transition hover:-translate-y-1"
              >
                <h3 className="font-display text-2xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-4 leading-8 text-white/65">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="features" className="space-y-6 py-8">
          <div className="max-w-3xl space-y-4">
            <p className="eyebrow">Features</p>
            <h2 className="font-display text-4xl font-semibold tracking-tight">
              Everything needed to move from rough prototype to production-ready
              experience.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {featureItems.map((item) => (
              <article key={item.title} className="surface-card rounded-[1.75rem] p-6">
                <h3 className="font-display text-2xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-4 leading-8 text-white/65">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="reports" className="grid gap-6 py-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="glass-panel rounded-[2rem] p-6 lg:p-8">
            <p className="eyebrow">Report design</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">
              Graphs now sit at the center of the reporting experience.
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-white/65">
              Monthly bars surface the pace of spending, weekly flow reveals
              short-term pressure, and category mix makes it easier to explain
              where the budget is moving.
            </p>
            <div className="mt-8">
              <BarChart points={reportTrend} />
            </div>
          </div>
          <div id="share" className="grid gap-4">
            <div className="glass-panel rounded-[2rem] p-6">
              <p className="eyebrow">Share experience</p>
              <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight">
                One click to create a clean stakeholder-ready update.
              </h3>
              <p className="mt-4 leading-8 text-white/65">
                Use the sharing screen to copy a concise update, highlight the
                biggest category, and present recent spend without sending raw
                spreadsheets around.
              </p>
            </div>
            <div className="surface-card rounded-[2rem] p-6">
              <p className="text-sm text-white/55">Share preview</p>
              <p className="mt-4 text-xl leading-9 text-white/85">
                Tracked INR 15.9K this month across 12 expenses. Housing leads,
                subscriptions are stable, and the budget remains easy to review
                in one glance.
              </p>
            </div>
            <Link
              href="/share"
              className="rounded-[1.4rem] border border-white/14 px-6 py-4 text-center text-sm font-medium text-white/80 transition hover:bg-white/6 hover:text-white"
            >
              Open share workflow
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

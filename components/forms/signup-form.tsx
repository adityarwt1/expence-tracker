"use client";

import { SignUpResponse } from "@/interfaces/auth/auth";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface SignupFormProps {
  title: string;
  description: string;
  buttonLabel?: string;
  compact?: boolean;
  className?: string;
  redirectTo?: string;
}

type FeedbackState = {
  tone: "success" | "error";
  message: string;
} | null;

export function SignupForm({
  title,
  description,
  buttonLabel = "Create workspace",
  compact = false,
  className = "",
  redirectTo = "/dashboard",
}: SignupFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [isPending, startTransition] = useTransition();

  const submitSignup = async () => {
    setFeedback(null);

    const response = await fetch("/api/v1/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const result = (await response.json()) as SignUpResponse;

    if (!response.ok || !result.success) {
      setFeedback({
        tone: "error",
        message: result.message || "Unable to create your workspace.",
      });
      return;
    }

    setFeedback({
      tone: "success",
      message: result.message || "Workspace created successfully.",
    });
    setEmail("");
    setPassword("");
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div className={`glass-panel rounded-[2rem] p-6 ${className}`.trim()}>
      <div className="space-y-3">
        <p className="eyebrow">Get started</p>
        <h2
          className={`font-display font-semibold tracking-tight ${
            compact ? "text-2xl" : "text-3xl"
          }`}
        >
          {title}
        </h2>
        <p className="text-sm leading-7 text-white/65">{description}</p>
      </div>
      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(() => {
            void submitSignup();
          });
        }}
      >
        <div className="space-y-2">
          <label className="text-sm text-white/70" htmlFor="signup-email">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="px-4 py-3"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/70" htmlFor="signup-password">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="8+ characters"
            className="px-4 py-3"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-2xl bg-[var(--accent)] px-5 py-3 font-semibold text-[#072229] transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating..." : buttonLabel}
        </button>
      </form>
      {feedback ? (
        <p
          className={`mt-4 text-sm ${
            feedback.tone === "success" ? "text-emerald-300" : "text-rose-300"
          }`}
        >
          {feedback.message}
        </p>
      ) : null}
      <p className="mt-4 text-xs leading-6 text-white/45">
        We create your secure workspace and preload starter data so the
        dashboard, reports, and share preview feel complete on first launch.
      </p>
    </div>
  );
}

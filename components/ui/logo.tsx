import Link from "next/link";

interface LogoProps {
  href?: string;
  compact?: boolean;
}

export function Logo({ href = "/", compact = false }: LogoProps) {
  return (
    <Link href={href} className="inline-flex items-center gap-3">
      <span className="flex size-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(0,0,0,0.24)]">
        AL
      </span>
      {!compact ? (
        <span className="flex flex-col">
          <span className="font-display text-lg font-semibold tracking-tight">
            Astra Ledger
          </span>
          <span className="text-sm text-white/55">
            Premium clarity for everyday spending.
          </span>
        </span>
      ) : null}
    </Link>
  );
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const shortDateFormatter = new Intl.DateTimeFormat("en-IN", {
  month: "short",
  day: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("en-IN", {
  month: "short",
});

export const formatCurrency = (value: number) => currencyFormatter.format(value);

export const formatCompactCurrency = (value: number) =>
  compactCurrencyFormatter.format(value);

export const formatShortDate = (value: string | Date) =>
  shortDateFormatter.format(new Date(value));

export const formatMonth = (value: Date) => monthFormatter.format(value);

export const clamp = (value: number, min = 0, max = 100) =>
  Math.min(Math.max(value, min), max);

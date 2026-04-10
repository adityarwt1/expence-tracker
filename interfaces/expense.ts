import { ApiResponse } from "./Standered/standeredResponse";

export const expenseCategories = [
  "Housing",
  "Food",
  "Transport",
  "Utilities",
  "Lifestyle",
  "Health",
  "Subscriptions",
  "Work",
  "Travel",
  "Shopping",
  "Other",
] as const;

export const paymentMethods = [
  "UPI",
  "Card",
  "Cash",
  "Wallet",
  "Bank Transfer",
] as const;

export type ExpenseCategory = (typeof expenseCategories)[number];
export type PaymentMethod = (typeof paymentMethods)[number];
export type ViewerSource = "demo" | "account";
export type InsightTone = "positive" | "negative" | "neutral";

export interface ViewerState {
  authenticated: boolean;
  email: string | null;
  source: ViewerSource;
}

export interface ExpenseInput {
  title: string;
  category: ExpenseCategory;
  amount: number;
  spentAt: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  recurring?: boolean;
}

export interface ExpenseRecord extends ExpenseInput {
  id: string;
  formattedAmount: string;
  formattedDate: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  detail: string;
  tone: InsightTone;
}

export interface BudgetStatus {
  category: ExpenseCategory;
  amount: number;
  formattedAmount: string;
  budget: number;
  formattedBudget: string;
  progress: number;
  remaining: number;
  share: number;
  color: string;
}

export interface TrendPoint {
  label: string;
  amount: number;
  formattedAmount: string;
}

export interface ReportInsight {
  title: string;
  description: string;
  tone: InsightTone;
}

export interface OverviewPayload {
  viewer: ViewerState;
  metrics: DashboardMetric[];
  budgets: BudgetStatus[];
  transactions: ExpenseRecord[];
  trend: TrendPoint[];
  highlights: ReportInsight[];
}

export interface MonthlySpendPoint extends TrendPoint {
  month: string;
}

export interface CategorySlice {
  category: ExpenseCategory;
  amount: number;
  formattedAmount: string;
  share: number;
  color: string;
}

export interface ReportsPayload {
  viewer: ViewerState;
  totalSpend: string;
  monthDelta: string;
  monthlyTrend: MonthlySpendPoint[];
  weeklyTrend: TrendPoint[];
  categoryBreakdown: CategorySlice[];
  insights: ReportInsight[];
}

export interface ShareStat {
  label: string;
  value: string;
  note: string;
}

export interface SharePayload {
  viewer: ViewerState;
  headline: string;
  description: string;
  shareMessage: string;
  stats: ShareStat[];
  topCategories: CategorySlice[];
  recentTransactions: ExpenseRecord[];
}

export interface ExpenseMutationPayload {
  expense: ExpenseRecord;
}

export type OverviewResponse = ApiResponse<OverviewPayload>;
export type ReportsResponse = ApiResponse<ReportsPayload>;
export type ShareResponse = ApiResponse<SharePayload>;
export type ExpenseMutationResponse = ApiResponse<ExpenseMutationPayload>;

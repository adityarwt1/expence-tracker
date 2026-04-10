import {
  BudgetStatus,
  CategorySlice,
  ExpenseCategory,
  ExpenseInput,
  ExpenseRecord,
  MonthlySpendPoint,
  OverviewPayload,
  PaymentMethod,
  ReportInsight,
  ReportsPayload,
  SharePayload,
  TrendPoint,
  ViewerState,
} from "@/interfaces/expense";
import {
  clamp,
  formatCompactCurrency,
  formatCurrency,
  formatMonth,
  formatShortDate,
} from "@/lib/format";
import { mongoconnect } from "@/lib/mongodb";
import Expense from "@/mongoose/Expense";
import mongoose from "mongoose";

const categoryBudgets: Record<ExpenseCategory, number> = {
  Housing: 22000,
  Food: 9000,
  Transport: 4500,
  Utilities: 5000,
  Lifestyle: 8000,
  Health: 3500,
  Subscriptions: 2500,
  Work: 6000,
  Travel: 12000,
  Shopping: 7000,
  Other: 4000,
};

const categoryColors: Record<ExpenseCategory, string> = {
  Housing: "#4dd0e1",
  Food: "#f4b350",
  Transport: "#60a5fa",
  Utilities: "#34d399",
  Lifestyle: "#fb7185",
  Health: "#a78bfa",
  Subscriptions: "#f97316",
  Work: "#38bdf8",
  Travel: "#facc15",
  Shopping: "#f472b6",
  Other: "#94a3b8",
};

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toIsoDate(date);
};

const monthsAgo = (months: number, day: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() - months, day);
  return toIsoDate(date);
};

const createStarterExpenseInputs = (): ExpenseInput[] => [
  {
    title: "Apartment rent",
    category: "Housing",
    amount: 18500,
    spentAt: monthsAgo(0, 1),
    paymentMethod: "Bank Transfer",
    recurring: true,
  },
  {
    title: "Groceries restock",
    category: "Food",
    amount: 3250,
    spentAt: daysAgo(1),
    paymentMethod: "UPI",
  },
  {
    title: "Metro recharge",
    category: "Transport",
    amount: 720,
    spentAt: daysAgo(2),
    paymentMethod: "Wallet",
  },
  {
    title: "Electricity bill",
    category: "Utilities",
    amount: 2480,
    spentAt: daysAgo(5),
    paymentMethod: "UPI",
    recurring: true,
  },
  {
    title: "Team dinner",
    category: "Lifestyle",
    amount: 1940,
    spentAt: daysAgo(6),
    paymentMethod: "Card",
  },
  {
    title: "Pharmacy",
    category: "Health",
    amount: 890,
    spentAt: daysAgo(7),
    paymentMethod: "UPI",
  },
  {
    title: "Streaming bundle",
    category: "Subscriptions",
    amount: 699,
    spentAt: daysAgo(8),
    paymentMethod: "Card",
    recurring: true,
  },
  {
    title: "Workspace supplies",
    category: "Work",
    amount: 1490,
    spentAt: daysAgo(10),
    paymentMethod: "Card",
  },
  {
    title: "Weekend train tickets",
    category: "Travel",
    amount: 2630,
    spentAt: daysAgo(14),
    paymentMethod: "UPI",
  },
  {
    title: "Headphones repair",
    category: "Shopping",
    amount: 1580,
    spentAt: daysAgo(17),
    paymentMethod: "Card",
  },
  {
    title: "Quarterly home supplies",
    category: "Housing",
    amount: 2800,
    spentAt: monthsAgo(1, 22),
    paymentMethod: "UPI",
  },
  {
    title: "Client coffee chats",
    category: "Food",
    amount: 1160,
    spentAt: monthsAgo(1, 17),
    paymentMethod: "UPI",
  },
  {
    title: "Doctor consultation",
    category: "Health",
    amount: 2100,
    spentAt: monthsAgo(2, 8),
    paymentMethod: "Card",
  },
  {
    title: "Internet upgrade",
    category: "Utilities",
    amount: 1799,
    spentAt: monthsAgo(2, 3),
    paymentMethod: "Bank Transfer",
  },
  {
    title: "Cab reimbursements",
    category: "Transport",
    amount: 1240,
    spentAt: monthsAgo(3, 13),
    paymentMethod: "Wallet",
  },
];

const parseExpenseDate = (value: string | Date) => {
  if (value instanceof Date) {
    return value;
  }

  return new Date(`${value}T12:00:00.000Z`);
};

const sortByLatest = (expenses: ExpenseRecord[]) =>
  [...expenses].sort(
    (left, right) =>
      new Date(right.spentAt).getTime() - new Date(left.spentAt).getTime(),
  );

const sumAmount = (expenses: ExpenseRecord[]) =>
  expenses.reduce((total, expense) => total + expense.amount, 0);

const sumTrend = (points: TrendPoint[]) =>
  points.reduce((total, point) => total + point.amount, 0);

const compareToPrevious = (current: number, previous: number) => {
  if (previous === 0 && current === 0) {
    return "Steady vs last month";
  }

  if (previous === 0) {
    return "New spend tracked this month";
  }

  const delta = ((current - previous) / previous) * 100;
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(0)}% vs last month`;
};

const normalizeExpense = (expense: {
  _id?: mongoose.Types.ObjectId | string;
  id?: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  spentAt: Date | string;
  paymentMethod: PaymentMethod;
  notes?: string;
  recurring?: boolean;
}): ExpenseRecord => {
  const spentAt =
    expense.spentAt instanceof Date
      ? expense.spentAt.toISOString()
      : new Date(expense.spentAt).toISOString();

  return {
    id: expense.id || String(expense._id),
    title: expense.title,
    category: expense.category,
    amount: expense.amount,
    spentAt,
    paymentMethod: expense.paymentMethod,
    notes: expense.notes,
    recurring: expense.recurring ?? false,
    formattedAmount: formatCurrency(expense.amount),
    formattedDate: formatShortDate(spentAt),
  };
};

const buildDemoExpenses = () =>
  sortByLatest(
    createStarterExpenseInputs().map((expense, index) =>
      normalizeExpense({
        ...expense,
        id: `demo-${index + 1}`,
        spentAt: parseExpenseDate(expense.spentAt),
      }),
    ),
  );

const getWindowExpenses = (
  expenses: ExpenseRecord[],
  start: Date,
  end: Date,
) =>
  expenses.filter((expense) => {
    const spentAt = new Date(expense.spentAt);
    return spentAt >= start && spentAt < end;
  });

const buildCategorySummary = (expenses: ExpenseRecord[]): CategorySlice[] => {
  const total = Math.max(sumAmount(expenses), 1);
  const grouped = expenses.reduce<Record<string, number>>((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([category, amount]) => ({
      category: category as ExpenseCategory,
      amount,
      formattedAmount: formatCurrency(amount),
      share: Math.round((amount / total) * 100),
      color: categoryColors[category as ExpenseCategory],
    }))
    .sort((left, right) => right.amount - left.amount);
};

const buildTrend = (expenses: ExpenseRecord[], days: number): TrendPoint[] => {
  const points: TrendPoint[] = [];

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - index);
    const key = toIsoDate(date);
    const amount = expenses
      .filter((expense) => expense.spentAt.slice(0, 10) === key)
      .reduce((total, expense) => total + expense.amount, 0);

    points.push({
      label: new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(date),
      amount,
      formattedAmount: formatCurrency(amount),
    });
  }

  return points;
};

const buildMonthlyTrend = (expenses: ExpenseRecord[]): MonthlySpendPoint[] => {
  const points: MonthlySpendPoint[] = [];

  for (let offset = 5; offset >= 0; offset -= 1) {
    const start = new Date();
    start.setMonth(start.getMonth() - offset, 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setMonth(end.getMonth() + 1, 1);

    const amount = sumAmount(getWindowExpenses(expenses, start, end));

    points.push({
      month: formatMonth(start),
      label: formatMonth(start),
      amount,
      formattedAmount: formatCurrency(amount),
    });
  }

  return points;
};

const buildBudgetStatus = (expenses: ExpenseRecord[]): BudgetStatus[] => {
  const categorySummary = buildCategorySummary(expenses);

  return categorySummary.slice(0, 5).map((entry) => {
    const budget = categoryBudgets[entry.category];
    const progress = clamp((entry.amount / budget) * 100);

    return {
      category: entry.category,
      amount: entry.amount,
      formattedAmount: entry.formattedAmount,
      budget,
      formattedBudget: formatCurrency(budget),
      progress,
      remaining: budget - entry.amount,
      share: entry.share,
      color: entry.color,
    };
  });
};

const buildHighlights = (
  currentMonthExpenses: ExpenseRecord[],
  previousMonthExpenses: ExpenseRecord[],
): ReportInsight[] => {
  const currentTotal = sumAmount(currentMonthExpenses);
  const previousTotal = sumAmount(previousMonthExpenses);
  const categorySummary = buildCategorySummary(currentMonthExpenses);
  const topCategory = categorySummary[0];
  const budgetStatus = buildBudgetStatus(currentMonthExpenses)[0];

  return [
    {
      title:
        currentTotal <= previousTotal
          ? "Spending is stabilizing"
          : "Spending picked up",
      description: `${compareToPrevious(currentTotal, previousTotal)} and ${formatCompactCurrency(currentTotal)} tracked this month.`,
      tone: currentTotal <= previousTotal ? "positive" : "negative",
    },
    {
      title: topCategory
        ? `${topCategory.category} is leading the month`
        : "Your categories are balanced",
      description: topCategory
        ? `${topCategory.formattedAmount} is flowing into ${topCategory.category.toLowerCase()}, covering ${topCategory.share}% of total spend.`
        : "No category has dominated your budget yet.",
      tone: "neutral",
    },
    {
      title: budgetStatus
        ? `${budgetStatus.category} budget is ${budgetStatus.progress > 85 ? "at risk" : "on track"}`
        : "Budgets are ready",
      description: budgetStatus
        ? `${budgetStatus.formattedAmount} spent against ${budgetStatus.formattedBudget}.`
        : "Add your first expense to start monitoring budget health.",
      tone: budgetStatus && budgetStatus.progress > 85 ? "negative" : "positive",
    },
  ];
};

export const createStarterExpenses = async (userId: string) => {
  await mongoconnect();

  const existingCount = await Expense.countDocuments({ userId });

  if (existingCount > 0) {
    return;
  }

  const starterExpenses = createStarterExpenseInputs().map((expense) => ({
    userId,
    title: expense.title,
    category: expense.category,
    amount: expense.amount,
    spentAt: parseExpenseDate(expense.spentAt),
    paymentMethod: expense.paymentMethod,
    notes: expense.notes,
    recurring: expense.recurring ?? false,
  }));

  await Expense.insertMany(starterExpenses);
};

export const getExpensesForViewer = async (userId: string | null) => {
  if (!userId) {
    return buildDemoExpenses();
  }

  await mongoconnect();

  const expenses = await Expense.find({ userId }).sort({ spentAt: -1 }).lean();
  return expenses.map((expense) => normalizeExpense(expense));
};

export const createExpenseForUser = async (
  userId: string,
  input: ExpenseInput,
) => {
  await mongoconnect();

  const expense = await Expense.create({
    userId,
    title: input.title,
    category: input.category,
    amount: input.amount,
    spentAt: parseExpenseDate(input.spentAt),
    paymentMethod: input.paymentMethod,
    notes: input.notes,
    recurring: input.recurring ?? false,
  });

  return normalizeExpense(expense.toObject());
};

export const buildOverviewPayload = (
  viewer: ViewerState,
  expenses: ExpenseRecord[],
): OverviewPayload => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const currentMonthExpenses = getWindowExpenses(
    expenses,
    currentMonthStart,
    nextMonthStart,
  );
  const previousMonthExpenses = getWindowExpenses(
    expenses,
    previousMonthStart,
    currentMonthStart,
  );
  const lastFourWeeks = buildTrend(expenses, 28);
  const recurringTotal = currentMonthExpenses
    .filter((expense) => expense.recurring)
    .reduce((total, expense) => total + expense.amount, 0);
  const categorySummary = buildCategorySummary(currentMonthExpenses);
  const topCategory = categorySummary[0];

  return {
    viewer,
    metrics: [
      {
        label: "This month",
        value: formatCurrency(sumAmount(currentMonthExpenses)),
        detail: compareToPrevious(
          sumAmount(currentMonthExpenses),
          sumAmount(previousMonthExpenses),
        ),
        tone:
          sumAmount(currentMonthExpenses) <= sumAmount(previousMonthExpenses)
            ? "positive"
            : "negative",
      },
      {
        label: "Recurring commitments",
        value: formatCurrency(recurringTotal),
        detail: `${currentMonthExpenses.filter((expense) => expense.recurring).length} automated bills this month`,
        tone: "neutral",
      },
      {
        label: "Average weekly burn",
        value: formatCurrency(sumTrend(lastFourWeeks) / 4),
        detail: `${expenses.length} tracked expenses in your workspace`,
        tone: "neutral",
      },
      {
        label: "Primary category",
        value: topCategory ? topCategory.category : "Not enough data",
        detail: topCategory ? topCategory.formattedAmount : "Start with a few entries",
        tone: "neutral",
      },
    ],
    budgets: buildBudgetStatus(currentMonthExpenses),
    transactions: sortByLatest(expenses).slice(0, 7),
    trend: buildTrend(expenses, 7),
    highlights: buildHighlights(currentMonthExpenses, previousMonthExpenses),
  };
};

export const buildReportsPayload = (
  viewer: ViewerState,
  expenses: ExpenseRecord[],
): ReportsPayload => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const currentMonthExpenses = getWindowExpenses(
    expenses,
    currentMonthStart,
    nextMonthStart,
  );
  const previousMonthExpenses = getWindowExpenses(
    expenses,
    previousMonthStart,
    currentMonthStart,
  );

  return {
    viewer,
    totalSpend: formatCurrency(sumAmount(expenses)),
    monthDelta: compareToPrevious(
      sumAmount(currentMonthExpenses),
      sumAmount(previousMonthExpenses),
    ),
    monthlyTrend: buildMonthlyTrend(expenses),
    weeklyTrend: buildTrend(expenses, 7),
    categoryBreakdown: buildCategorySummary(expenses).slice(0, 5),
    insights: buildHighlights(currentMonthExpenses, previousMonthExpenses),
  };
};

export const buildSharePayload = (
  viewer: ViewerState,
  expenses: ExpenseRecord[],
): SharePayload => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const currentMonthExpenses = getWindowExpenses(
    expenses,
    currentMonthStart,
    nextMonthStart,
  );
  const categoryBreakdown = buildCategorySummary(currentMonthExpenses);
  const total = sumAmount(currentMonthExpenses);
  const topCategory = categoryBreakdown[0];
  const recentTransactions = sortByLatest(expenses).slice(0, 5);

  return {
    viewer,
    headline: viewer.authenticated
      ? "A clean financial snapshot, ready to send."
      : "Explore how your updates will look when you share them.",
    description: topCategory
      ? `${topCategory.category} is your largest focus area this month, while the rest of the budget remains easy to explain in one glance.`
      : "Track a few expenses to generate a share-ready narrative.",
    shareMessage: `Tracked ${formatCurrency(total)} this month across ${currentMonthExpenses.length} expenses. ${topCategory ? `${topCategory.category} leads at ${topCategory.formattedAmount}.` : "Budget is just getting started."}`,
    stats: [
      {
        label: "Monthly spend",
        value: formatCurrency(total),
        note: currentMonthExpenses.length
          ? `${currentMonthExpenses.length} expenses logged`
          : "No expenses this month",
      },
      {
        label: "Top category",
        value: topCategory ? topCategory.category : "N/A",
        note: topCategory ? topCategory.formattedAmount : "Waiting for more data",
      },
      {
        label: "Share confidence",
        value: viewer.authenticated ? "Live account data" : "Demo preview",
        note: viewer.authenticated
          ? "Safe to share with stakeholders"
          : "Create an account to share your real data",
      },
    ],
    topCategories: categoryBreakdown.slice(0, 4),
    recentTransactions,
  };
};

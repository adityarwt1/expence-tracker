import { expenseCategories, paymentMethods } from "@/interfaces/expense";
import { z } from "zod";

export const signUpBodyValidation = z.object({
  email: z.email("Please enter a valid email address.").transform((value) =>
    value.toLowerCase().trim(),
  ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(64, "Password is too long."),
});

export const expenseBodyValidation = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Expense title must be at least 2 characters long.")
    .max(80, "Expense title is too long."),
  category: z.enum(expenseCategories),
  amount: z.coerce.number().positive("Amount must be greater than zero."),
  spentAt: z.string().date("Please choose a valid spending date."),
  paymentMethod: z.enum(paymentMethods),
  notes: z
    .string()
    .trim()
    .max(240, "Notes must be 240 characters or fewer.")
    .optional()
    .transform((value) => value || undefined),
  recurring: z.boolean().optional().default(false),
});

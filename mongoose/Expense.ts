import { expenseCategories, paymentMethods } from "@/interfaces/expense";
import mongoose, { Schema } from "mongoose";

export interface ExpenseDocumentInterface {
  userId: mongoose.Types.ObjectId;
  title: string;
  category: (typeof expenseCategories)[number];
  amount: number;
  spentAt: Date;
  paymentMethod: (typeof paymentMethods)[number];
  notes?: string;
  recurring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<ExpenseDocumentInterface>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: expenseCategories,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    spentAt: {
      type: Date,
      required: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: paymentMethods,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    recurring: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Expense =
  (mongoose.models.Expense as mongoose.Model<ExpenseDocumentInterface>) ||
  mongoose.model<ExpenseDocumentInterface>("Expense", ExpenseSchema);

export default Expense;

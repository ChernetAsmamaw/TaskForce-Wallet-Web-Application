import mongoose from "mongoose";

const monthlyReportSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    totalIncome: Number,
    totalExpense: Number,
    budgetBreakdown: [
      {
        budgetId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Budget",
        },
        spent: Number,
        remaining: Number,
      },
    ],
    accountBreakdown: [
      {
        accountId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Account",
        },
        balance: Number,
        transactions: {
          income: Number,
          expense: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

const MonthlyReport =
  mongoose.models.MonthlyReport ||
  mongoose.model("MonthlyReport", monthlyReportSchema);
export default MonthlyReport;

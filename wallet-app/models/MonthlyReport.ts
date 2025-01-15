import mongoose from "mongoose";

const monthlyReportSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    day: {
      type: Number,
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
    categoryBreakdown: [
      {
        categoryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
        },
        amount: Number,
      },
    ],
    accountBreakdown: [
      {
        accountId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Account",
        },
        balance: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create a model using the schema
const MonthlyReport = mongoose.model("MonthlyReport", monthlyReportSchema);

// Export the model
export default MonthlyReport;

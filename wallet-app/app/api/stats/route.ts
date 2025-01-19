import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/utils/db";
import Transaction from "@/models/Transaction";
import Account from "@/models/Account";
import Budget from "@/models/Budget";

export async function GET() {
  try {
    await dbConnect();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current month's date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Fetch all required data in parallel
    const [
      monthlyTransactions,
      accountsCount,
      budgetsCount,
      transactionsCount,
    ] = await Promise.all([
      // Get current month's transactions
      Transaction.find({
        userId: user.id,
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      }).lean(),

      // Get total accounts count
      Account.countDocuments({ userId: user.id }),

      // Get active budgets count
      Budget.countDocuments({
        userId: user.id,
        startDate: { $lte: now },
        endDate: { $gte: now },
      }),

      // Get total transactions count
      Transaction.countDocuments({ userId: user.id }),
    ]);

    // Calculate monthly totals
    const monthlyStats = monthlyTransactions.reduce(
      (acc, curr) => {
        if (curr.type === "income") {
          acc.income += curr.amount;
        } else {
          acc.expense += curr.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    const stats = {
      income: monthlyStats.income,
      expense: monthlyStats.expense,
      balance: monthlyStats.income - monthlyStats.expense,
      accountsCount,
      budgetsCount,
      transactionsCount,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/utils/db";
import Transaction from "@/models/Transaction";

export async function GET() {
  try {
    await dbConnect();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the last 6 months
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        start: new Date(date.getFullYear(), date.getMonth(), 1),
        end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
        label: date.toLocaleDateString("en-US", { month: "short" }),
      };
    }).reverse();

    // Fetch transactions for the last 6 months
    const spending = await Promise.all(
      months.map(async ({ start, end, label }) => {
        const [currentMonthSpending, previousMonthSpending] = await Promise.all(
          [
            // Current month spending
            Transaction.aggregate([
              {
                $match: {
                  userId: user.id,
                  type: "expense",
                  date: { $gte: start, $lte: end },
                },
              },
              {
                $group: {
                  _id: null,
                  total: { $sum: "$amount" },
                },
              },
            ]),
            // Previous year same month for comparison
            Transaction.aggregate([
              {
                $match: {
                  userId: user.id,
                  type: "expense",
                  date: {
                    $gte: new Date(
                      start.getFullYear() - 1,
                      start.getMonth(),
                      1
                    ),
                    $lte: new Date(
                      start.getFullYear() - 1,
                      start.getMonth() + 1,
                      0
                    ),
                  },
                },
              },
              {
                $group: {
                  _id: null,
                  total: { $sum: "$amount" },
                },
              },
            ]),
          ]
        );

        return {
          date: label,
          amount: currentMonthSpending[0]?.total || 0,
          previous: previousMonthSpending[0]?.total || 0,
        };
      })
    );

    return NextResponse.json(spending);
  } catch (error) {
    console.error("Error fetching monthly spending:", error);
    return NextResponse.json(
      { error: "Failed to fetch monthly spending" },
      { status: 500 }
    );
  }
}

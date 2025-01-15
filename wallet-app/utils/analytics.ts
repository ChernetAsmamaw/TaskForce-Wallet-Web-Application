import { Transaction } from "@/models/Transaction";

export async function getSpendingTrends(userId: string, months: number = 6) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const trends = await Transaction.aggregate([
    {
      $match: {
        userId,
        date: { $gte: startDate },
        type: "expense",
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          category: "$categoryId",
        },
        total: { $sum: "$amount" },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);

  return trends;
}

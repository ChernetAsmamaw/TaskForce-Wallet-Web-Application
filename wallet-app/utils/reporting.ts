export async function generateMonthlyReport(
  userId: string,
  month: number,
  year: number
) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const [income, expenses] = await Promise.all([
    Transaction.aggregate([
      {
        $match: {
          userId,
          type: "income",
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]),
    Transaction.aggregate([
      {
        $match: {
          userId,
          type: "expense",
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  const categoryBreakdown = await Transaction.aggregate([
    {
      $match: {
        userId,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$categoryId",
        amount: { $sum: "$amount" },
      },
    },
  ]);

  const accountBreakdown = await Account.find({ userId }).select("balance");

  return {
    userId,
    month,
    year,
    totalIncome: income[0]?.total || 0,
    totalExpense: expenses[0]?.total || 0,
    categoryBreakdown,
    accountBreakdown,
  };
}

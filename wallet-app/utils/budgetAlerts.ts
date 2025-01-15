import { UserSettings } from "@/models/UserSettings";
import { Category } from "@/models/Category";
import { Transaction } from "@/models/Transaction";

export async function checkBudgetAlerts(
  userId: string,
  categoryId: string,
  amount: number
) {
  const userSettings = await UserSettings.findOne({ userId });
  if (!userSettings?.budgetAlerts) return;

  const category = await Category.findById(categoryId);
  const alerts = userSettings.budgetAlerts.filter(
    (alert) => alert.category === category.name
  );

  for (const alert of alerts) {
    const startDate = getStartDateForPeriod(alert.period);
    const totalSpent = await Transaction.aggregate([
      {
        $match: {
          userId,
          categoryId,
          date: { $gte: startDate },
          type: "expense",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    if (totalSpent[0]?.total > alert.limit) {
      await sendBudgetAlert(
        userId,
        category.name,
        totalSpent[0].total,
        alert.limit
      );
    }
  }
}

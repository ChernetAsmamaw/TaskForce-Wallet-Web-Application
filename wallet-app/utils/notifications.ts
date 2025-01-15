import { UserSettings } from "@/models/UserSettings";

export async function sendBudgetAlert(
  userId: string,
  category: string,
  currentAmount: number,
  budgetLimit: number
) {
  const userSettings = await UserSettings.findOne({ userId });

  // Here you would implement your notification logic
  // This could be email, push notifications, or in-app notifications
  console.log(
    `Budget alert for ${category}: Spent ${currentAmount} of ${budgetLimit}`
  );
}

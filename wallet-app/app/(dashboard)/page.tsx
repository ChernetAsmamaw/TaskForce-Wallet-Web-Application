import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import UserSettings from "@/models/UserSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import SpendingOverview from "./_components/SpendingOverview";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await UserSettings.findOne({
    userId: user.id,
  });

  if (!userSettings?.currency) {
    redirect("/wizard");
  }

  const accounts = [
    {
      id: 1,
      name: "Main Account",
      balance: 5240.5,
      currency: userSettings.currency,
      cardNumber: "**** **** **** 4242",
      expiryDate: "12/25",
    },
    {
      id: 2,
      name: "Savings",
      balance: 12350.75,
      currency: userSettings.currency,
      cardNumber: "**** **** **** 8888",
      expiryDate: "08/26",
    },
  ];

  const transactionData = [
    { date: "Jan", amount: 4000, previous: 3500 },
    { date: "Feb", amount: 3000, previous: 2800 },
    { date: "Mar", amount: 5000, previous: 4200 },
    { date: "Apr", amount: 4600, previous: 4000 },
    { date: "May", amount: 6000, previous: 5200 },
    { date: "Jun", amount: 5400, previous: 4800 },
  ];

  const recentTransactions = [
    { id: 1, name: "Grocery Store", amount: -85.5, date: "Today" },
    { id: 2, name: "Salary Deposit", amount: 3200.0, date: "Yesterday" },
    { id: 3, name: "Restaurant", amount: -45.75, date: "2 days ago" },
  ];

  return (
    <main className="min-h-screen p-6 bg-background">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user.firstName}! 👋
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here's your financial overview
        </p>
      </div>

      {/* Account Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {accounts.map((account) => (
          <Card
            key={account.id}
            className="relative overflow-hidden bg-gradient-to-br from-primary/90 to-primary group hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/20 rounded-full -ml-16 -mb-16" />

              <div className="relative">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="font-medium text-primary-foreground">
                      {account.name}
                    </h3>
                    <p className="text-3xl font-bold mt-2 text-primary-foreground">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: account.currency,
                      }).format(account.balance)}
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-primary-foreground/80" />
                </div>

                <div className="space-y-2">
                  <p className="font-mono text-lg text-primary-foreground/90">
                    {account.cardNumber}
                  </p>
                  <p className="text-sm text-primary-foreground/80">
                    Valid thru: {account.expiryDate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Account Card */}
        <Card className="border-2 border-dashed border-muted hover:border-primary cursor-pointer transition-all group">
          <CardContent className="p-6 flex items-center justify-center h-full">
            <div className="text-center">
              <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary mx-auto mb-2 transition-colors" />
              <p className="text-muted-foreground group-hover:text-primary transition-colors">
                Add Account
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spending Overview and Recent Transactions */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <SpendingOverview data={transactionData} />

        {/* Recent Transactions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium text-foreground mb-4">
              Recent Transactions
            </h3>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    {transaction.amount > 0 ? (
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <ArrowDownRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-foreground">
                        {transaction.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-medium ${
                      transaction.amount > 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: userSettings.currency,
                    }).format(Math.abs(transaction.amount))}
                  </p>
                </div>
              ))}

              <button className="w-full mt-4 py-2 text-center text-primary font-medium hover:text-primary/80 transition-colors">
                View All Transactions
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

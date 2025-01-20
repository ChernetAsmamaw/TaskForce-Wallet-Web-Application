"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WelcomeStats } from "./_components/WelcomeStats";
import RecentTransactions from "./_components/RecentTransactions";
import SpendingOverview from "./_components/SpendingOverview";
import { useUser } from "@clerk/nextjs";
import AccountCard from "@/components/AccountCard";
import BudgetCard from "@/components/BudgetCard";
import DashboardLoading from "./_components/Loading";
import { useAppData } from "@/components/providers/DataProvider";

interface Account {
  _id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  const {
    accounts,
    budgets,
    stats,
    transactions,
    spendingData,
    isLoading,
    reloadData,
  } = useAppData();
  const [selectedTimeframe, setSelectedTimeframe] = useState("6m");

  // Handle loading states
  if (!userLoaded || isLoading) {
    return <DashboardLoading />;
  }

  if (!isSignedIn) return null;

  // Get recent items
  const recentAccounts = accounts.slice(0, 3);
  const recentBudgets = budgets.slice(0, 3);
  const recentTransactions = transactions.slice(0, 5);

  // Handler for adding new account
  const handleAccountAdded = (newAccount: Account) => {
    reloadData(); // Reload all data to ensure consistency
  };

  // Handler for deleting budget
  const handleBudgetDelete = async (budgetId: string) => {
    try {
      const response = await fetch("/api/budgets", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: budgetId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete budget");
      }

      reloadData(); // Reload data after successful deletion
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  return (
    <main className="min-h-screen pt-20 px-4 sm:px-6 my-10 flex flex-col items-center">
      {/* Welcome Section with Stats */}
      <section className="w-full max-w-7xl mb-12">
        <WelcomeStats stats={stats} userName={user?.firstName || ""} />
      </section>

      {/* Recent Accounts Section */}
      <section className="w-full max-w-7xl mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Accounts</h2>
          <button
            onClick={() => router.push("/accounts")}
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            View All
          </button>
        </div>
        <AccountCard
          data={recentAccounts}
          onAccountAdded={handleAccountAdded}
        />
      </section>

      {/* Recent Budgets Section */}
      <section className="w-full max-w-7xl mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Budgets</h2>
          <button
            onClick={() => router.push("/budgets")}
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentBudgets.map((budget) => (
            <BudgetCard
              key={budget._id}
              budget={budget}
              onDelete={handleBudgetDelete}
            />
          ))}
        </div>
      </section>

      {/* Spending Overview and Recent Transactions */}
      <section className="w-full max-w-7xl grid md:grid-cols-2 gap-6 mb-12">
        <SpendingOverview
          data={spendingData}
          onTimeframeChange={setSelectedTimeframe}
        />
        <RecentTransactions data={recentTransactions} />
      </section>
    </main>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WelcomeStats } from "./_components/WelcomeStats";
import RecentTransactions from "./_components/RecentTransactions";
import SpendingOverview from "./_components/SpendingOverview";
import { useUser } from "@clerk/nextjs";
import AccountCard from "@/components/AccountCard";
import BudgetCard from "@/components/BudgetCard";
import { toast } from "sonner";
import DashboardLoading from "./_components/Loading";

interface DashboardStats {
  income: number;
  expense: number;
  balance: number;
  accountsCount: number;
  transactionsCount: number;
  budgetsCount: number;
}

interface Account {
  _id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  createdAt: string;
}

interface Budget {
  _id: string;
  name: string;
  amount: number;
  currentAmount: number;
  period: "monthly" | "weekly" | "yearly";
  startDate: string;
  endDate: string;
}

interface Transaction {
  _id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
  category: {
    name: string;
    type: string;
  };
  accountId: {
    _id: string;
    name: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  const [stats, setStats] = useState<DashboardStats>({
    income: 0,
    expense: 0,
    balance: 0,
    accountsCount: 0,
    transactionsCount: 0,
    budgetsCount: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [recentAccounts, setRecentAccounts] = useState<Account[]>([]);
  const [recentBudgets, setRecentBudgets] = useState<Budget[]>([]);
  const [spendingData, setSpendingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("6m");

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isSignedIn) return;

      try {
        setIsLoading(true);
        const [
          statsRes,
          transactionsRes,
          accountsRes,
          budgetsRes,
          spendingRes,
        ] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/transactions?limit=5"),
          fetch("/api/accounts?limit=3"),
          fetch("/api/budgets?limit=3"),
          fetch(`/api/reports/monthly?timeframe=${selectedTimeframe}`),
        ]);

        if (
          !statsRes.ok ||
          !transactionsRes.ok ||
          !accountsRes.ok ||
          !budgetsRes.ok ||
          !spendingRes.ok
        ) {
          throw new Error("Failed to fetch dashboard data");
        }

        const [
          statsData,
          transactionsData,
          accountsData,
          budgetsData,
          spendingData,
        ] = await Promise.all([
          statsRes.json(),
          transactionsRes.json(),
          accountsRes.json(),
          budgetsRes.json(),
          spendingRes.json(),
        ]);

        setStats(statsData);
        setRecentTransactions(transactionsData);
        setRecentAccounts(accountsData);
        setRecentBudgets(budgetsData);
        setSpendingData(spendingData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    if (userLoaded && isSignedIn) {
      fetchDashboardData();
    }
  }, [userLoaded, isSignedIn, selectedTimeframe]);

  if (!userLoaded || isLoading) {
    return <DashboardLoading />;
  }

  if (!isSignedIn) return null;

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
          data={recentAccounts.slice(0, 3)}
          onAccountAdded={(newAccount) => {
            setRecentAccounts((prev) => [...prev, newAccount].slice(0, 3));
          }}
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
              onDelete={async () => {
                // Handle delete logic
              }}
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

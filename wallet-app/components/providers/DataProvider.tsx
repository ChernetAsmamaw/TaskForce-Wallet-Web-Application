"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ReactNode } from "react";

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

interface Stats {
  income: number;
  expense: number;
  balance: number;
  accountsCount: number;
  transactionsCount: number;
  budgetsCount: number;
}

interface AppData {
  accounts: Account[];
  budgets: Budget[];
  transactions: Transaction[];
  stats: Stats | null;
  spendingData: any[]; // You can type this more specifically based on your data structure
  error: string | null;
  isLoading: boolean;
  reloadData: () => Promise<void>;
}

const DataContext = createContext<AppData | null>(null);

export const useAppData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useAppData must be used within a DataProvider");
  }
  return context;
};

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Omit<AppData, "isLoading" | "reloadData">>({
    accounts: [],
    budgets: [],
    transactions: [],
    stats: null,
    spendingData: [],
    error: null,
  });

  const loadInitialData = async () => {
    if (!userLoaded || !isSignedIn) return;

    try {
      setIsLoading(true);

      // Load all data in parallel for better performance
      const [accountsRes, budgetsRes, statsRes, transactionsRes, spendingRes] =
        await Promise.all([
          fetch("/api/accounts"),
          fetch("/api/budgets"),
          fetch("/api/stats"),
          fetch("/api/transactions?limit=5"),
          fetch("/api/reports/monthly?timeframe=6m"),
        ]);

      // Process all responses in parallel
      const [accounts, budgets, stats, transactions, spendingData] =
        await Promise.all([
          accountsRes.ok ? accountsRes.json() : [],
          budgetsRes.ok ? budgetsRes.json() : [],
          statsRes.ok ? statsRes.json() : null,
          transactionsRes.ok ? transactionsRes.json() : [],
          spendingRes.ok ? spendingRes.json() : [],
        ]);

      setData({
        accounts,
        budgets,
        stats,
        transactions,
        spendingData,
        error: null,
      });
    } catch (error) {
      console.error("Error loading data:", error);
      setData((prev) => ({
        ...prev,
        error: "Failed to load application data",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [userLoaded, isSignedIn]);

  const contextValue: AppData = {
    ...data,
    isLoading,
    reloadData: loadInitialData,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
}

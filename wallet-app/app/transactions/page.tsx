"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import NavBar from "@/components/NavBar";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddTransaction from "@/components/AddTransaction";
import ExportTransactionsDialog from "@/components/ExportTransactions";
import { toast } from "sonner";
import CurrencyFormatter from "@/components/CurrencyFormatter";

// Predefined categories based on your TransactionModel
const EXPENSE_CATEGORIES = [
  "Housing",
  "Transportation",
  "Food",
  "Utilities",
  "Insurance",
  "Healthcare",
  "Savings",
  "Personal",
  "Entertainment",
  "Other",
];

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investments",
  "Rental",
  "Other",
];

interface Category {
  name: string;
  type: string;
  subCategory?: string;
}

interface Transaction {
  _id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
  category?: Category;
}

interface FilterState {
  type: string;
  timePeriod: string;
  category: string;
}

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    timePeriod: "all-time",
    category: "all",
  });

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();

      // Add type filter
      if (filters.type !== "all") {
        queryParams.append("type", filters.type);
      }

      // Add category filter
      if (filters.category !== "all") {
        // Find the original category with proper casing
        const selectedCategory = getAvailableCategories().find(
          (cat) => cat.name.toLowerCase() === filters.category
        )?.name;

        if (selectedCategory) {
          queryParams.append("category.name", selectedCategory);
        }
      }

      // Add time period filter
      if (filters.timePeriod !== "all-time") {
        const now = new Date();
        const startDate = new Date();

        switch (filters.timePeriod) {
          case "today":
            startDate.setHours(0, 0, 0, 0);
            break;
          case "week":
            startDate.setDate(now.getDate() - 7);
            break;
          case "month":
            startDate.setMonth(now.getMonth() - 1);
            break;
          case "year":
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }

        queryParams.append("startDate", startDate.toISOString());
        queryParams.append("endDate", now.toISOString());
      }

      const response = await fetch(
        "/api/transactions?" + queryParams.toString()
      );
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transactions");
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]); // Fetch whenever filters change

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Get available categories based on transaction type
  const getAvailableCategories = () => {
    if (filters.type === "income") {
      return INCOME_CATEGORIES.map((cat) => ({ type: "income", name: cat }));
    }
    if (filters.type === "expense") {
      return EXPENSE_CATEGORIES.map((cat) => ({ type: "expense", name: cat }));
    }
    return [
      ...INCOME_CATEGORIES.map((cat) => ({ type: "income", name: cat })),
      ...EXPENSE_CATEGORIES.map((cat) => ({ type: "expense", name: cat })),
    ];
  };

  // Helper function to get category name
  const getCategoryName = (transaction: Transaction) => {
    return transaction.category?.name || "Uncategorized";
  };

  // Helper function to get subcategory
  const getSubCategory = (transaction: Transaction) => {
    return transaction.category?.subCategory || "";
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Transactions
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage and track all your financial activities
              </p>
            </div>
            <div className="flex items-center gap-4">
              <AddTransaction onTransactionAdded={fetchTransactions} />
              <ExportTransactionsDialog transactions={transactions} />
            </div>
          </div>

          {/* Filters */}
          <Card className="p-5">
            <div className="flex flex-wrap gap-4">
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange("type", value)}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.timePeriod}
                onValueChange={(value) =>
                  handleFilterChange("timePeriod", value)
                }
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {getAvailableCategories().map((category) => (
                    <SelectItem
                      key={`${category.type}-${category.name}`}
                      value={category.name.toLowerCase()}
                    >
                      {filters.type === "all"
                        ? `${category.name} (${category.type})`
                        : category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Transactions List */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Recent Transactions
              </h2>
              {isLoading ? (
                <div className="text-center py-4">Loading transactions...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-4">No transactions found</div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={
                            "w-12 h-12 flex items-center justify-center rounded-lg " +
                            (transaction.type === "income"
                              ? "bg-green-100 dark:bg-green-900"
                              : "bg-red-100 dark:bg-red-900")
                          }
                        >
                          {transaction.type === "income" ? (
                            <ArrowUpRight className="h-6 w-6 text-green-600 dark:text-green-400" />
                          ) : (
                            <ArrowDownRight className="h-6 w-6 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-100">
                            {transaction.description || "Untitled Transaction"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(transaction.date).toLocaleDateString()} •{" "}
                            {getCategoryName(transaction)}
                            {getSubCategory(transaction) &&
                              " › " + getSubCategory(transaction)}
                          </p>
                        </div>
                      </div>
                      <CurrencyFormatter
                        amount={transaction.amount}
                        type={transaction.type}
                        className={`font-semibold text-lg ${
                          transaction.type === "income"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TransactionsPage;

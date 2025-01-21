"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";
import BudgetCard from "@/components/BudgetCard";
import { Button } from "@/components/ui/button";
import AddBudgetDialog from "@/components/AddBudget";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Budget {
  _id: string;
  name: string;
  amount: number;
  currentAmount: number;
  period: "monthly" | "weekly" | "yearly";
  startDate: string;
  endDate: string;
  categoryId: {
    _id: string;
    name: string;
    type: string;
  };
  accountId: {
    _id: string;
    name: string;
    type: string;
  };
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [userCurrency, setUserCurrency] = useState("usd");
  const router = useRouter();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const fetchUserSettings = async (retryCount = 2) => {
    try {
      const response = await fetch("/api/user-settings", {
        cache: "no-store",
      });
      if (response.ok) {
        const settings = await response.json();
        setUserCurrency(settings.currency || "usd");
      } else if (retryCount > 0) {
        // Retry with a delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        await fetchUserSettings(retryCount - 1);
      }
    } catch (error) {
      console.error("Error fetching user settings:", error);
    }
  };

  const fetchBudgets = async (retryCount = 2) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/budgets?month=${currentMonth}&year=${currentYear}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/sign-in");
          return;
        }

        if (retryCount > 0) {
          // Retry with a delay
          await new Promise((resolve) => setTimeout(resolve, 500));
          return fetchBudgets(retryCount - 1);
        }
        throw new Error("Failed to fetch budgets");
      }

      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      toast.error("Failed to load budgets");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data with a small delay
  useEffect(() => {
    const initializeData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      await Promise.all([fetchUserSettings(), fetchBudgets()]);
    };

    initializeData();
  }, []);

  // Fetch budgets when month/year changes
  useEffect(() => {
    fetchBudgets();
  }, [currentMonth, currentYear]);

  const handleBudgetAdded = (newBudget: Budget) => {
    setBudgets((prev) => [...prev, newBudget]);
    toast.success("Budget created successfully");
  };

  const handleBudgetUpdate = (updatedBudget: Budget) => {
    setBudgets((prev) =>
      prev.map((budget) =>
        budget._id === updatedBudget._id ? updatedBudget : budget
      )
    );
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      const response = await fetch(`/api/budgets`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete budget");
      }

      setBudgets((prev) => prev.filter((budget) => budget._id !== id));
      toast.success("Budget deleted successfully");
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast.error("Failed to delete budget");
      throw error;
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear((prev) => prev - 1);
      } else {
        setCurrentMonth((prev) => prev - 1);
      }
    } else {
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear((prev) => prev + 1);
      } else {
        setCurrentMonth((prev) => prev + 1);
      }
    }
  };

  // Generate array of years (5 years back and 5 years forward)
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Your Budgets
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track and manage your spending limits
              </p>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-amber-500 hover:bg-amber-600"
            >
              Create New Budget
            </Button>
          </div>

          {/* Month/Year selector */}
          <div className="flex flex-wrap items-center justify-center gap-4 bg-gray-50 dark:bg-gray-950 p-4 rounded-lg">
            <div className="bg-slate-100 dark:bg-gray-900">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-black rounded-lg">
              <Select
                value={currentMonth.toString()}
                onValueChange={(value) => setCurrentMonth(parseInt(value))}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-black rounded-lg">
              <Select
                value={currentYear.toString()}
                onValueChange={(value) => setCurrentYear(parseInt(value))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-slate-100 dark:bg-gray-900">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Budgets Grid */}
          {isLoading ? (
            <div className="text-center py-8">Loading budgets...</div>
          ) : budgets.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No budgets found for this period
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {budgets.map((budget) => (
                <BudgetCard
                  key={budget._id}
                  budget={budget}
                  onDelete={handleDeleteBudget}
                  onUpdate={handleBudgetUpdate}
                  currency={userCurrency}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddBudgetDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onBudgetAdded={handleBudgetAdded}
      />
    </>
  );
}

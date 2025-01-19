"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Predefined categories
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

interface Account {
  _id: string;
  name: string;
  type: string;
}

interface Budget {
  _id: string;
  name: string;
  amount: number;
  currentAmount: number;
}

interface AddTransactionProps {
  onTransactionAdded?: () => void;
  selectedBudgetId?: string;
}

const AddTransaction: React.FC<AddTransactionProps> = ({
  onTransactionAdded,
  selectedBudgetId,
}) => {
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  interface FormData {
    type: "expense" | "income";
    description: string;
    amount: string;
    category: {
      name: string;
      type: "expense" | "income";
      subCategory: string;
    };
    accountId: string;
    budgetId: string;
    date: string;
    notes: string;
    status: "completed" | "pending" | "cancelled";
  }

  const [formData, setFormData] = useState<FormData>({
    type: "expense",
    description: "",
    amount: "",
    category: {
      name: "",
      type: "expense",
      subCategory: "",
    },
    accountId: "",
    budgetId: selectedBudgetId || "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    status: "completed",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get current date for budgets query
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        // Fetch both accounts and budgets
        const [accountsRes, budgetsRes] = await Promise.all([
          fetch("/api/accounts"),
          fetch(`/api/budgets?month=${month}&year=${year}`),
        ]);

        if (!accountsRes.ok || !budgetsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [accountsData, budgetsData] = await Promise.all([
          accountsRes.json(),
          budgetsRes.json(),
        ]);

        setAccounts(accountsData);
        setBudgets(budgetsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, selectedBudgetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate category
      if (!formData.category.name) {
        toast.error("Please select or enter a category");
        return;
      }

      // Validate other required fields
      if (!formData.description.trim()) {
        toast.error("Please enter a description");
        return;
      }
      if (!formData.amount || Number(formData.amount) <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
      if (!formData.accountId) {
        toast.error("Please select an account");
        return;
      }
      if (!formData.budgetId) {
        toast.error("Please select a budget");
        return;
      }

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create transaction");
      }

      setOpen(false);
      setFormData({
        type: "expense",
        description: "",
        amount: "",
        category: {
          name: "",
          type: "expense",
          subCategory: "",
        },
        accountId: "",
        budgetId: selectedBudgetId || "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
        status: "completed",
      });

      if (onTransactionAdded) {
        onTransactionAdded();
      }

      toast.success("Transaction added successfully");
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Failed to create transaction");
    } finally {
      setLoading(false);
    }
  };

  const categories =
    formData.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Transaction Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  type: value,
                  category: {
                    ...prev.category,
                    type: value,
                    name: "", // Reset category when type changes
                  },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  amount: e.target.value,
                }))
              }
              placeholder="Enter amount"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            {!showCustomCategory ? (
              <>
                <Select
                  value={formData.category.name}
                  onValueChange={(value) => {
                    if (value === "custom") {
                      setShowCustomCategory(true);
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        category: {
                          ...prev.category,
                          name: value,
                        },
                      }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom Category</SelectItem>
                  </SelectContent>
                </Select>
              </>
            ) : (
              <div className="space-y-2">
                <Input
                  value={formData.category.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: {
                        ...prev.category,
                        name: e.target.value,
                      },
                    }))
                  }
                  placeholder="Enter custom category"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCustomCategory(false)}
                >
                  Back to Categories
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategory (Optional)</Label>
            <Input
              id="subcategory"
              value={formData.category.subCategory}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category: {
                    ...prev.category,
                    subCategory: e.target.value,
                  },
                }))
              }
              placeholder="Enter subcategory"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account">Account</Label>
            <Select
              value={formData.accountId}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  accountId: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account._id} value={account._id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!selectedBudgetId && (
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Select
                value={formData.budgetId}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    budgetId: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgets.map((budget) => (
                    <SelectItem key={budget._id} value={budget._id}>
                      {budget.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  date: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              placeholder="Add notes"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Transaction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransaction;

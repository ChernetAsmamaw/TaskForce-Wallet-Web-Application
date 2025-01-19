import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface Account {
  _id: string;
  name: string;
}

interface Budget {
  _id: string;
  name: string;
  amount: number;
  currentAmount: number;
  period: "monthly" | "weekly" | "yearly";
  startDate: string;
  endDate: string;
  accountId: {
    _id: string;
    name: string;
  } | null;
}

interface UpdateBudgetDialogProps {
  budget: Budget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBudgetUpdated: (budget: Budget) => void;
}

const UpdateBudgetDialog = ({
  budget,
  open,
  onOpenChange,
  onBudgetUpdated,
}: UpdateBudgetDialogProps) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with safe default values
  const [updatedBudget, setUpdatedBudget] = useState({
    _id: budget._id,
    name: budget.name || "",
    amount: budget.amount || 0,
    period: budget.period || "monthly",
    startDate: budget.startDate
      ? new Date(budget.startDate).toISOString().split("T")[0]
      : "",
    endDate: budget.endDate
      ? new Date(budget.endDate).toISOString().split("T")[0]
      : "",
    accountId: budget.accountId?._id || "",
  });

  // Update state when budget prop changes
  useEffect(() => {
    setUpdatedBudget({
      _id: budget._id,
      name: budget.name || "",
      amount: budget.amount || 0,
      period: budget.period || "monthly",
      startDate: budget.startDate
        ? new Date(budget.startDate).toISOString().split("T")[0]
        : "",
      endDate: budget.endDate
        ? new Date(budget.endDate).toISOString().split("T")[0]
        : "",
      accountId: budget.accountId?._id || "",
    });
  }, [budget]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountsRes = await fetch("/api/accounts");

        if (!accountsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const accountsData = await accountsRes.json();
        setAccounts(accountsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load accounts");
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  const validateForm = () => {
    if (!updatedBudget.name.trim()) {
      toast.error("Please enter a budget name");
      return false;
    }
    if (!updatedBudget.amount || updatedBudget.amount <= 0) {
      toast.error("Please enter a valid amount");
      return false;
    }
    if (!updatedBudget.startDate) {
      toast.error("Please select a start date");
      return false;
    }
    if (!updatedBudget.endDate) {
      toast.error("Please select an end date");
      return false;
    }
    if (!updatedBudget.accountId) {
      toast.error("Please select an account");
      return false;
    }

    // Validate dates
    const startDate = new Date(updatedBudget.startDate);
    const endDate = new Date(updatedBudget.endDate);
    if (endDate <= startDate) {
      toast.error("End date must be after start date");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/budgets", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBudget),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update budget");
      }

      const updated = await response.json();
      onBudgetUpdated(updated);
      onOpenChange(false);
      toast.success("Budget updated successfully");
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update budget"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Budget</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Budget Name</Label>
            <Input
              id="name"
              value={updatedBudget.name}
              onChange={(e) =>
                setUpdatedBudget((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter budget name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={updatedBudget.amount}
              onChange={(e) =>
                setUpdatedBudget((prev) => ({
                  ...prev,
                  amount: Number(e.target.value),
                }))
              }
              placeholder="Enter amount"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Period</Label>
            <Select
              value={updatedBudget.period}
              onValueChange={(value: "monthly" | "weekly" | "yearly") =>
                setUpdatedBudget((prev) => ({ ...prev, period: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account">Account</Label>
            <Select
              value={updatedBudget.accountId}
              onValueChange={(value) =>
                setUpdatedBudget((prev) => ({ ...prev, accountId: value }))
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

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={updatedBudget.startDate}
              onChange={(e) =>
                setUpdatedBudget((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={updatedBudget.endDate}
              onChange={(e) =>
                setUpdatedBudget((prev) => ({
                  ...prev,
                  endDate: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Budget"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateBudgetDialog;

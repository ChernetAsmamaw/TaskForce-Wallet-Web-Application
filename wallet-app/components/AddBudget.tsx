"use client";

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

interface AddBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBudgetAdded: (budget: {
    name: string;
    maxAmount: number;
    startDate: string;
    endDate: string;
    accountId: string;
    period: "monthly" | "weekly" | "yearly";
  }) => void;
}

const AddBudgetDialog = ({
  open,
  onOpenChange,
  onBudgetAdded,
}: AddBudgetDialogProps) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newBudget, setNewBudget] = useState({
    name: "",
    maxAmount: "", // Will be converted to 'amount' in the API
    startDate: "",
    endDate: "",
    accountId: "",
    period: "monthly" as "monthly" | "weekly" | "yearly",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountsRes = await fetch("/api/accounts");

        if (!accountsRes.ok) {
          throw new Error("Failed to fetch accounts");
        }

        const accountsData = await accountsRes.json();

        console.log("Accounts:", accountsData);

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
    if (!newBudget.name.trim()) {
      toast.error("Please enter a budget name");
      return false;
    }
    if (!newBudget.maxAmount || Number(newBudget.maxAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return false;
    }
    if (!newBudget.startDate) {
      toast.error("Please select a start date");
      return false;
    }
    if (!newBudget.endDate) {
      toast.error("Please select an end date");
      return false;
    }
    if (!newBudget.accountId) {
      toast.error("Please select an account");
      return false;
    }

    // Validate dates
    const startDate = new Date(newBudget.startDate);
    const endDate = new Date(newBudget.endDate);
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
      console.log("Submitting budget:", newBudget);

      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newBudget,
          maxAmount: Number(newBudget.maxAmount),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create budget");
      }

      const budget = await response.json();
      onBudgetAdded(budget);
      onOpenChange(false);
      setNewBudget({
        name: "",
        maxAmount: "",
        startDate: "",
        endDate: "",
        accountId: "",
        period: "monthly",
      });
      toast.success("Budget created successfully");
    } catch (error) {
      console.error("Error creating budget:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create budget"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Budget Name</Label>
            <Input
              id="name"
              value={newBudget.name}
              onChange={(e) =>
                setNewBudget((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter budget name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxAmount">Amount</Label>
            <Input
              id="maxAmount"
              type="number"
              value={newBudget.maxAmount}
              onChange={(e) =>
                setNewBudget((prev) => ({ ...prev, maxAmount: e.target.value }))
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
              value={newBudget.period}
              onValueChange={(value: "monthly" | "weekly" | "yearly") =>
                setNewBudget((prev) => ({ ...prev, period: value }))
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
              value={newBudget.accountId}
              onValueChange={(value) => {
                console.log("Selected account ID:", value);
                setNewBudget((prev) => ({ ...prev, accountId: value }));
              }}
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
              value={newBudget.startDate}
              onChange={(e) =>
                setNewBudget((prev) => ({ ...prev, startDate: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={newBudget.endDate}
              onChange={(e) =>
                setNewBudget((prev) => ({ ...prev, endDate: e.target.value }))
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
              {isLoading ? "Creating..." : "Create Budget"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBudgetDialog;

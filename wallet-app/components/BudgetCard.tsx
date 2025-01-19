"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { Progress } from "@/components/Progress";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TransactionsDialog from "./TransactionsDialog";
import UpdateBudgetDialog from "./UpdateBudget";
import Currencies from "@/lib/Currencies";

interface Budget {
  _id: string;
  name: string;
  amount: number;
  currentAmount: number;
  period: "monthly" | "weekly" | "yearly";
  startDate: string;
  endDate: string;
  accountId?: {
    _id: string;
    name: string;
    type: string;
  };
}

interface BudgetCardProps {
  budget: Budget;
  onDelete: (id: string) => Promise<void>;
  onUpdate?: (updatedBudget: Budget) => void;
  currency?: string;
}

const BudgetCard = ({
  budget,
  onDelete,
  onUpdate,
  currency = "usd",
}: BudgetCardProps) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lastWarningLevel, setLastWarningLevel] = useState(0);

  // Format currency based on user settings
  const formatCurrency = (amount: number) => {
    const currencyInfo = Currencies.find(
      (c) => c.value === currency.toLowerCase()
    ) ||
      Currencies.find((c) => c.value === "usd") || {
        value: "usd",
        label: "US Dollar",
        locale: "en-US",
        symbol: "$",
      };

    try {
      return new Intl.NumberFormat(currencyInfo.locale, {
        style: "currency",
        currency: currencyInfo.value.toUpperCase(),
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      console.error("Currency formatting error:", error);
      return `${currencyInfo.symbol}${amount.toFixed(2)}`;
    }
  };

  // Safely access budget properties with fallbacks
  const safeAmount = budget?.amount || 0;
  const safeCurrentAmount = budget?.currentAmount || 0;
  const safeName = budget?.name || "Unnamed Budget";
  const safePeriod = budget?.period || "monthly";
  const safeStartDate = budget?.startDate || new Date().toISOString();
  const safeEndDate = budget?.endDate || new Date().toISOString();
  const safeAccountName = budget?.accountId?.name || "No Account";

  // Calculate percentage spent with safe values
  const percentageSpent =
    safeAmount > 0 ? (safeCurrentAmount / safeAmount) * 100 : 0;

  // Enhanced progress color logic with warning system
  const getProgressColor = (percentage: number) => {
    if (percentage >= 95) return "bg-red-500";
    if (percentage >= 85) return "bg-orange-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Warning system
  useEffect(() => {
    if (percentageSpent >= 95 && lastWarningLevel < 95) {
      toast.error(`Warning: Budget "${safeName}" is critically overspent!`);
      setLastWarningLevel(95);
    } else if (percentageSpent >= 85 && lastWarningLevel < 85) {
      toast.warning(`Warning: Budget "${safeName}" is nearing its limit!`);
      setLastWarningLevel(85);
    } else if (percentageSpent >= 75 && lastWarningLevel < 75) {
      toast.info(`Notice: Budget "${safeName}" is at 75% utilization.`);
      setLastWarningLevel(75);
    }
  }, [percentageSpent, safeName, lastWarningLevel]);

  const handleDelete = async () => {
    if (!budget?._id) return;
    try {
      setIsDeleting(true);
      await onDelete(budget._id);
      toast.success("Budget deleted successfully");
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast.error("Failed to delete budget");
    } finally {
      setIsDeleting(false);
      setShowDeleteAlert(false);
    }
  };

  const handleUpdate = (updatedBudget: Budget) => {
    if (onUpdate) {
      onUpdate(updatedBudget);
    }
    setShowEditDialog(false);
    toast.success("Budget updated successfully");
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <Card className="p-6 space-y-4 hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {safeName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {safeAccountName}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Budget
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setShowDeleteAlert(true)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Budget
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Progress</span>
          <span
            className={`font-medium ${
              percentageSpent >= 95 ? "text-red-600" : ""
            }`}
          >
            {percentageSpent.toFixed(1)}%
          </span>
        </div>
        <Progress
          value={percentageSpent}
          className="h-2"
          indicatorClassName={getProgressColor(percentageSpent)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Spent</p>
          <p className="text-lg font-semibold">
            {" "}
            {formatCurrency(safeCurrentAmount)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
          <p className="text-lg font-semibold"> {formatCurrency(safeAmount)}</p>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {safePeriod.charAt(0).toUpperCase() + safePeriod.slice(1)} Budget
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(safeStartDate)} - {formatDate(safeEndDate)}
        </p>
      </div>

      <Button
        className="w-full flex items-center justify-center gap-2"
        variant="secondary"
        onClick={() => setShowTransactions(true)}
      >
        View Transactions <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Delete Alert Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              budget and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      {showEditDialog && (
        <UpdateBudgetDialog
          budget={budget}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onBudgetUpdated={handleUpdate}
        />
      )}

      {/* Transactions Dialog */}
      {showTransactions && (
        <TransactionsDialog
          open={showTransactions}
          onOpenChange={setShowTransactions}
          budget={budget}
        />
      )}
    </Card>
  );
};

export default BudgetCard;

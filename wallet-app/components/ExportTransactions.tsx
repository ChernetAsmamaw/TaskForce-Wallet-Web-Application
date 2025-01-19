import React from "react";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Transaction {
  date: string;
  type: string;
  description?: string;
  category?: {
    name: string;
    subCategory?: string;
  };
  amount: number;
}

interface ExportTransactionsDialogProps {
  transactions: Transaction[];
}

const ExportTransactionsDialog: React.FC<ExportTransactionsDialogProps> = ({
  transactions,
}) => {
  const handleExport = () => {
    // Prepare data for export
    const exportData = transactions.map((transaction) => ({
      Date: new Date(transaction.date).toLocaleDateString(),
      Type:
        transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
      Description: transaction.description || "Untitled Transaction",
      Category: transaction.category?.name || "Uncategorized",
      Subcategory: transaction.category?.subCategory || "",
      Amount:
        transaction.type === "income"
          ? Number(transaction.amount).toFixed(2)
          : `-${Number(transaction.amount).toFixed(2)}`,
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");

    // Generate file name with current date
    const fileName = `transactions_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Transactions</DialogTitle>
          <DialogDescription>
            Download your transactions as an Excel file. The file will include
            all transactions currently displayed based on your applied filters.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The exported file will include the following information:
          </p>
          <ul className="list-disc ml-6 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <li>Transaction date</li>
            <li>Transaction type</li>
            <li>Description</li>
            <li>Category and subcategory</li>
            <li>Amount</li>
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleExport}>
            Download Excel File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportTransactionsDialog;

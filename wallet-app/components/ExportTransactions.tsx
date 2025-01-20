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
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();

    // Prepare data for export with proper formatting
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

    // Create worksheet from data
    const ws = XLSX.utils.json_to_sheet(exportData, {
      header: [
        "Date",
        "Type",
        "Description",
        "Category",
        "Subcategory",
        "Amount",
      ],
    });

    // Set column widths
    const columnWidths = [
      { wch: 15 }, // Date
      { wch: 10 }, // Type
      { wch: 30 }, // Description
      { wch: 20 }, // Category
      { wch: 20 }, // Subcategory
      { wch: 15 }, // Amount
    ];
    ws["!cols"] = columnWidths;

    // Define styles
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F46E5" } }, // Indigo color
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    };

    const dataStyle = {
      alignment: { horizontal: "left", vertical: "center" },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    };

    const amountStyle = {
      ...dataStyle,
      alignment: { horizontal: "right" },
      numFmt: "#,##0.00",
    };

    // Apply styles to the worksheet
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!ws[cellAddress]) continue;

        // Apply header styles to first row
        if (row === 0) {
          ws[cellAddress].s = headerStyle;
        } else {
          // Apply specific styles based on column
          if (col === 5) {
            // Amount column
            ws[cellAddress].s = amountStyle;
          } else {
            ws[cellAddress].s = dataStyle;
          }
        }
      }
    }

    // Add summary section
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const netAmount = totalIncome - totalExpense;

    // Add empty row as separator
    XLSX.utils.sheet_add_json(ws, [{}], { origin: -1 });

    // Add summary rows

    XLSX.utils.sheet_add_json(
      ws,
      [
        { Summary: "Total Income:", Amount: totalIncome.toFixed(2) },
        { Summary: "Total Expense:", Amount: totalExpense.toFixed(2) },
        { Summary: "Net Amount:", Amount: netAmount.toFixed(2) },
      ],
      { origin: -1, skipHeader: true }
    );

    // Add the worksheet to workbook
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
            Download your transactions as a formatted Excel file. The file will
            include all transactions currently displayed based on your applied
            filters.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The exported file will include:
          </p>
          <ul className="list-disc ml-6 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <li>Transaction date with proper formatting</li>
            <li>Transaction type with proper casing</li>
            <li>Description with fallback for empty values</li>
            <li>Category and subcategory (if available)</li>
            <li>Amount with currency formatting</li>
            <li>Summary section with totals</li>
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

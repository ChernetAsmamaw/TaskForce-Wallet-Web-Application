"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";
import CurrencyFormatter from "@/components/CurrencyFormatter";

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
  subCategory?: string;
}

interface TransactionCardProps {
  transactions: Transaction[];
  currency: string;
  isLoading?: boolean;
}

const TransactionCard = ({
  transactions,
  currency,
  isLoading = false,
}: TransactionCardProps) => {
  const [error, setError] = useState<string | null>(null);

  const getSubCategory = (transaction: Transaction): string => {
    return transaction.category?.subCategory || transaction.subCategory || "";
  };

  const getCategoryName = (transaction: Transaction): string => {
    return transaction.category?.name || "Uncategorized";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="hover:shadow-md transition-shadow duration-300">
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
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-lg transition-transform group-hover:scale-105 ${
                        transaction.type === "income"
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-red-100 dark:bg-red-900/30"
                      }`}
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
                          ` › ${getSubCategory(transaction)}`}
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
    </motion.div>
  );
};

export default TransactionCard;

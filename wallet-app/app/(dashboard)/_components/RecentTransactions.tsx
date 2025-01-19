"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

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

interface RecentTransactionsProps {
  data: Transaction[];
}

export default function RecentTransactions({ data }: RecentTransactionsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            Recent Transactions
          </CardTitle>
          <Link
            href="/transactions"
            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-5">
          {data.map((transaction, index) => (
            <motion.div
              key={transaction._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ring-8 transition-all duration-200 group-hover:scale-105 ${
                    transaction.type === "income"
                      ? "bg-green-100 dark:bg-green-900/30 ring-green-50 dark:ring-green-900/10"
                      : "bg-red-100 dark:bg-red-900/30 ring-red-50 dark:ring-red-900/10"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <ArrowUpRight className="h-6 w-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowDownRight className="h-6 w-6 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    {transaction.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      {transaction.accountId
                        ? transaction.accountId.name
                        : "Unknown Account"}
                    </span>
                    <span>•</span>
                    <span>
                      {transaction.category.name
                        ? transaction.category.name
                        : "Uncategorized"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(Math.abs(transaction.amount))}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(transaction.date)}
                </p>
              </div>
            </motion.div>
          ))}
          {data.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No recent transactions found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

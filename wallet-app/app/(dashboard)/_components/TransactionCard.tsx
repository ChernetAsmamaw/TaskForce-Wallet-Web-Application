"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";

const TransactionCard = ({ transactions, currency }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-8">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Recent Transactions
          </h3>
          <div className="space-y-6">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-2 group hover:bg-muted/50 rounded-lg 
                  transition-colors duration-200 px-3 -mx-3"
              >
                <div className="flex items-center gap-4">
                  {transaction.amount > 0 ? (
                    <div
                      className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 
                      flex items-center justify-center group-hover:scale-110 transition-transform"
                    >
                      <ArrowUpRight className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 
                      flex items-center justify-center group-hover:scale-110 transition-transform"
                    >
                      <ArrowDownRight className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-foreground">
                      {transaction.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.date}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-medium ${
                    transaction.amount > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: currency,
                  }).format(Math.abs(transaction.amount))}
                </p>
              </div>
            ))}

            <button
              className="w-full mt-6 py-3 text-center text-primary font-medium hover:text-primary/80 
              transition-colors hover:bg-primary/5 rounded-lg"
            >
              View All Transactions
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TransactionCard;

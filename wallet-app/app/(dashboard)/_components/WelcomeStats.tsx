"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Wallet2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import Currencies from "@/lib/Currencies";

interface WelcomeStatsProps {
  stats: {
    income: number;
    expense: number;
    balance: number;
    accountsCount: number;
    transactionsCount: number;
    budgetsCount: number;
  };
  userName: string;
}

export function WelcomeStats({ stats, userName }: WelcomeStatsProps) {
  const [currencyInfo, setCurrencyInfo] = useState<{
    value: string;
    label: string;
    locale: string;
    symbol: string;
  }>({
    value: "usd",
    label: "United States Dollar (USD)",
    locale: "en-US",
    symbol: "$",
  });

  // Fetch user settings to get currency
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await fetch("/api/user-settings");
        if (response.ok) {
          const settings = await response.json();
          // Find the currency info from our Currencies list
          const foundCurrency = Currencies.find(
            (c) => c.value.toLowerCase() === settings.currency.toLowerCase()
          );
          if (foundCurrency) {
            setCurrencyInfo(foundCurrency);
          }
        }
      } catch (error) {
        console.error("Error fetching user settings:", error);
      }
    };

    fetchUserSettings();
  }, []);

  // Currency formatting function using the user's selected currency
  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat(currencyInfo.locale, {
        style: "currency",
        currency: currencyInfo.value.toUpperCase(),
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (error) {
      // Fallback to basic formatting if Intl.NumberFormat fails
      return `${currencyInfo.symbol}${amount.toLocaleString()}`;
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      {/* Welcome Text */}
      <div className="text-center space-y-4 mb-12">
        <motion.h1
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to WalletApp,{" "}
          <span className="text-amber-600 dark:text-amber-500">{userName}</span>
          !
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Here&apos;s your financial overview for{" "}
          {new Date().toLocaleDateString(currencyInfo.locale, {
            month: "long",
            year: "numeric",
          })}
        </motion.p>
      </div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Income Card */}
        <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowUpRight className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                Monthly
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Income
              </p>
              <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(stats.income)}
              </p>
            </div>
          </div>
        </Card>

        {/* Expense Card */}
        <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowDownRight className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
                Monthly
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Expenses
              </p>
              <p className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(stats.expense)}
              </p>
            </div>
          </div>
        </Card>

        {/* Balance Card */}
        <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wallet2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                Net
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Balance
              </p>
              <p className="text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(stats.balance)}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
}

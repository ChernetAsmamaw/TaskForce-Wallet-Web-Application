"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Wallet, Smartphone, Coins } from "lucide-react";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

// Helper function to get icon based on account type
const getAccountIcon = (type) => {
  switch (type) {
    case "bank":
      return <CreditCard className="h-8 w-8" />;
    case "cash":
      return <Wallet className="h-8 w-8" />;
    case "mobile_money":
      return <Smartphone className="h-8 w-8" />;
    default:
      return <Coins className="h-8 w-8" />;
  }
};

// Helper function to get gradient based on account type
const getAccountGradient = (type) => {
  switch (type) {
    case "bank":
      return "from-blue-500/90 to-blue-600";
    case "cash":
      return "from-green-500/90 to-green-600";
    case "mobile_money":
      return "from-purple-500/90 to-purple-600";
    default:
      return "from-amber-500/90 to-amber-600";
  }
};

const AccountCard = ({ account, index }) => {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative overflow-hidden bg-gradient-to-br ${getAccountGradient(
        account.type
      )} 
        group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
    >
      <CardContent className="p-8">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 transition-transform group-hover:scale-110" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20 transition-transform group-hover:scale-110" />

        <div className="relative">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-medium text-white/80">{account.name}</h3>
              <p className="text-3xl font-bold mt-2 text-white">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: account.currency,
                }).format(account.balance)}
              </p>
            </div>
            <div className="text-white/80 transition-transform group-hover:scale-110">
              {getAccountIcon(account.type)}
            </div>
          </div>

          <div className="space-y-2">
            {account.cardNumber && (
              <p className="font-mono text-lg text-white/90">
                {account.cardNumber}
              </p>
            )}
            {account.phoneNumber && (
              <p className="font-mono text-lg text-white/90">
                {account.phoneNumber}
              </p>
            )}
            <p className="text-sm text-white/80">
              {account.type.replace("_", " ").toUpperCase()}
            </p>
          </div>
        </div>
      </CardContent>
    </MotionCard>
  );
};

export default AccountCard;

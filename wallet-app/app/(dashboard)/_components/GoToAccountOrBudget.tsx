"use client";

import React from "react";
import { Briefcase, ArrowBigRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function CreateAccount() {
  return (
    <div className="p-8 mb-12">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <Briefcase className="w-12 h-12 text-amber-500" />
        </div>
        <motion.h1
          className="text-3xl md:text-5xl font-bold text-foreground tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {" "}
          <h1 className="text-2xl font-extrabold text-black dark:text-white sm:text-4xl">
            Manage Your Accounts with Ease
          </h1>
        </motion.h1>

        <motion.p
          className="mt-2 text-gray-800 dark:text-gray-300 text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="mt-2 text-gray-800 dark:text-gray-300 text-muted-foreground">
            Keep track of your accounts, whether it&apos;s a bank account,
            credit card, or cash, all in one place.
          </p>
        </motion.p>
      </div>

      {/* Call to Action */}
      <div className="flex justify-center">
        <Link
          href="/accounts"
          className="flex items-center justify-center gap-3 px-6 py-3 bg-amber-600 text-white font-semibold rounded-full shadow-md hover:bg-amber-700 transition-all"
        >
          <ArrowBigRight className="w-5 h-5" />
          <span>Go to Accounts</span>
        </Link>
        <Link
          href="/budgets"
          className="flex items-center justify-center gap-3 px-6 py-3 ml-4 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 transition-all"
        >
          <ArrowBigRight className="w-5 h-5" />
          <span>Go to Budgets</span>
        </Link>
      </div>
    </div>
  );
}

export default CreateAccount;

"use client";

import { Button } from "@/components/ui/button";
import { Wallet2, HomeIcon, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4 space-y-8">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="flex justify-center"
        >
          <div className="relative">
            <Wallet2 className="w-32 h-32 text-amber-600 dark:text-amber-500" />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-4 -right-4 text-4xl"
            >
              💸
            </motion.div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">
            404
          </h1>
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
            Oops! Your Money Took a Wrong Turn
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            The page you're looking for seems to have disappeared like loose
            change in the couch cushions.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </Button>
          <Button
            onClick={() => router.push("/")}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <HomeIcon className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { Coins } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: {
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 1,
            repeat: Infinity,
          },
        }}
      >
        <Coins className="w-16 h-16 text-amber-500" />
      </motion.div>

      <motion.p
        className="mt-4 text-lg font-medium text-muted-foreground"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Loading...
      </motion.p>
    </div>
  );
}

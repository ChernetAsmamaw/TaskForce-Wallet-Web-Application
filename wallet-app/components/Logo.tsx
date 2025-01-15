import React from "react";
import { HandCoins } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 group hover:opacity-95 transition-opacity"
    >
      <HandCoins
        className={cn(
          "h-10 w-12",
          "stroke-amber-500",
          "stroke-[2]",
          "transition-transform group-hover:scale-105"
        )}
      />

      <span
        className={cn(
          "text-2xl font-bold",
          "tracking-tight leading-none",
          "bg-gradient-to-r from-amber-500 to-amber-600",
          "bg-clip-text text-transparent",
          "relative"
        )}
        style={{
          WebkitTextStroke: "1px rgba(251, 191, 36, 0.3)", // Amber-500 with opacity
          textShadow: `
            0 0 10px rgba(245, 158, 11, 0.3),  /* Amber-600 glow */
            0 0 20px rgba(245, 158, 11, 0.2)   /* Outer glow */
          `,
        }}
      >
        WalletApp
      </span>
    </Link>
  );
}

export default Logo;

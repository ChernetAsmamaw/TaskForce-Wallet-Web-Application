"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SpendingOverviewProps {
  data: Array<{
    date: string;
    amount: number;
  }>;
  onTimeframeChange: (timeframe: string) => void;
}

export default function SpendingOverview({ data }: SpendingOverviewProps) {
  return (
    <Card className="w-full transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">
              Spending Overview
            </h3>
            <p className="text-sm text-muted-foreground">
              Track your spending patterns over time
            </p>
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted/30"
              />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                }}
                formatter={(value) => [`$${value}`, "Amount"]}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#colorAmount)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";

const SpendingChart = dynamic(() => import("./SpendingChart"), { ssr: false });

export default function SpendingOverview({ data }) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-8">
        <h3 className="text-xl font-semibold text-foreground mb-6">
          Spending Overview
        </h3>
        <div className="h-[300px]">
          <SpendingChart data={data} />
        </div>
      </CardContent>
    </Card>
  );
}

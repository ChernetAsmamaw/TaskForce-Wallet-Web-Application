"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

const AddAccountCard = () => {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="border-2 border-dashed border-muted hover:border-primary cursor-pointer transition-all 
        hover:-translate-y-1 hover:shadow-lg group"
    >
      <CardContent className="p-8 flex items-center justify-center h-full">
        <div className="text-center">
          <Plus
            className="h-12 w-12 text-muted-foreground group-hover:text-primary mx-auto mb-3 
            transition-all group-hover:scale-110 group-hover:rotate-90 duration-300"
          />
          <p className="text-lg text-muted-foreground group-hover:text-primary transition-colors">
            Add Account
          </p>
        </div>
      </CardContent>
    </MotionCard>
  );
};

export default AddAccountCard;

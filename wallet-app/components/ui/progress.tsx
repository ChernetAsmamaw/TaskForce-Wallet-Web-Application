"use client";

import React from "react";

const Progress = ({
  value = 0,
  className = "",
  indicatorClassName = "",
  ...props
}) => {
  // Ensure value is between 0 and 100
  const percentage = Math.min(Math.max(0, value), 100);

  // Determine default color based on percentage
  const getColorClass = () => {
    if (percentage <= 40) return "bg-green-500";
    if (percentage <= 60) return "bg-yellow-500";
    if (percentage <= 95) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div
      className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}
      {...props}
    >
      <div
        className={`h-full transition-all duration-300 ${
          indicatorClassName || getColorClass()
        }`}
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};

export default Progress;

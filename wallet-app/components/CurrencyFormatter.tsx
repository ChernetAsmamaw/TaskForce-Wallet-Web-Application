import { useState, useEffect } from "react";
import Currencies from "@/lib/Currencies";

// Custom hook for currency formatting
export const useCurrencyFormatter = () => {
  const [currencyInfo, setCurrencyInfo] = useState({
    value: "usd",
    label: "US Dollar",
    locale: "en-US",
    symbol: "$",
  });

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await fetch("/api/user-settings");
        if (response.ok) {
          const settings = await response.json();
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

  const formatCurrency = (
    amount: number,
    options = { maximumFractionDigits: 2 }
  ) => {
    try {
      // Ensure amount is a number
      const numericAmount =
        typeof amount === "string" ? parseFloat(amount) : amount;

      if (isNaN(numericAmount)) {
        console.error("Invalid amount provided to formatCurrency:", amount);
        return `${currencyInfo.symbol}0.00`;
      }

      return new Intl.NumberFormat(currencyInfo.locale, {
        style: "currency",
        currency: currencyInfo.value.toUpperCase(),
        ...options,
      }).format(numericAmount);
    } catch (error) {
      console.error("Error formatting currency:", error);
      return `${currencyInfo.symbol}${Number(amount).toFixed(
        options.maximumFractionDigits
      )}`;
    }
  };

  return { formatCurrency, currencyInfo };
};

interface CurrencyFormatterProps {
  amount: number;
  type?: "income" | "expense" | "default";
  className?: string;
  options?: Intl.NumberFormatOptions;
}

// Currency formatter component
const CurrencyFormatter = ({
  amount,
  type = "default",
  className = "",
  options = { maximumFractionDigits: 2 },
}: CurrencyFormatterProps) => {
  const { formatCurrency } = useCurrencyFormatter();

  const getPrefix = () => {
    switch (type) {
      case "income":
        return "+";
      case "expense":
        return "-";
      default:
        return "";
    }
  };

  // Ensure amount is treated as a number and handle invalid values
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  const validAmount = isNaN(numericAmount) ? 0 : numericAmount;

  return (
    <span className={className}>
      {getPrefix()}
      {formatCurrency(Math.abs(validAmount), options)}
    </span>
  );
};

export default CurrencyFormatter;

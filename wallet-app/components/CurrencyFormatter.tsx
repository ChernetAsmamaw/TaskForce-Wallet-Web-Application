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
      return new Intl.NumberFormat(currencyInfo.locale, {
        style: "currency",
        currency: currencyInfo.value.toUpperCase(),
        ...options,
      }).format(amount);
    } catch {
      return `${currencyInfo.symbol}${amount.toFixed(
        options.maximumFractionDigits
      )}`;
    }
  };

  return { formatCurrency, currencyInfo };
};

// Currency formatter component
const CurrencyFormatter = ({
  amount,
  type = "default",
  className = "",
}: {
  amount: number;
  type?: "income" | "expense" | "default";
  className?: string;
}) => {
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

  return (
    <span className={className}>
      {getPrefix()}
      {formatCurrency(Math.abs(amount))}
    </span>
  );
};

export default CurrencyFormatter;

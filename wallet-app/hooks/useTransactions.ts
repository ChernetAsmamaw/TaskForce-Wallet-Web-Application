// A hook that fetches the list of transactions from the server and provides a function to add a new transaction.
import { useState } from "react";

export function useTransactions() {
  const [loading, setLoading] = useState(false);

  const addTransaction = async (data) => {
    setLoading(true);
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      return result;
    } finally {
      setLoading(false);
    }
  };

  return { addTransaction, loading };
}

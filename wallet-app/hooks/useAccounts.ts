import { useState } from "react";

export function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/accounts");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setAccounts(data);
    } finally {
      setLoading(false);
    }
  };

  const addAccount = async (accountData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accountData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setAccounts((prev) => [...prev, data]);
      return data;
    } finally {
      setLoading(false);
    }
  };

  return { accounts, loading, fetchAccounts, addAccount };
}

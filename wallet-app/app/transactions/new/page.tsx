"use client";

import { useTransactions } from "@/hooks/useTransactions";

export default function NewTransaction() {
  const { addTransaction, loading } = useTransactions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      accountId: formData.get("accountId"),
      amount: parseFloat(formData.get("amount")),
      type: formData.get("type"),
      categoryId: formData.get("categoryId"),
      description: formData.get("description"),
    };

    try {
      await addTransaction(data);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return <form onSubmit={handleSubmit}>{/* Your form fields */}</form>;
}

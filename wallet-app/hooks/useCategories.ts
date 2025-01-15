import { useState } from "react";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (categoryData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setCategories((prev) => [...prev, data]);
      return data;
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, fetchCategories, addCategory };
}

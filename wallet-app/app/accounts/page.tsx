"use client";

import AccountCard from "@/components/AccountCard";
import NavBar from "@/components/NavBar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("/api/accounts");
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/sign-in");
            return;
          }
          throw new Error("Failed to fetch accounts");
        }
        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, [router]);

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Your Accounts
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Here you can find all the accounts you have registered with us
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-2 px-2">
        <AccountCard data={accounts} />
      </div>
    </>
  );
}

export default AccountsPage;

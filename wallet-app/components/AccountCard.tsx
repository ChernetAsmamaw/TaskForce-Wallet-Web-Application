"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Wallet,
  Smartphone,
  Coins,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddAccount from "./AddAccount";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Currencies from "@/lib/Currencies";

interface Account {
  _id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  createdAt: string;
}

interface AccountCardProps {
  data: Account[];
}

const getAccountDetails = (type = "bank") => {
  const details = {
    bank: {
      icon: <CreditCard className="h-8 w-8" />,
      color: "bg-gradient-to-r from-blue-600 to-blue-800",
      label: "BANK ACCOUNT",
    },
    cash: {
      icon: <Wallet className="h-8 w-8" />,
      color: "bg-gradient-to-r from-emerald-600 to-emerald-800",
      label: "CASH",
    },
    mobile_money: {
      icon: <Smartphone className="h-8 w-8" />,
      color: "bg-gradient-to-r from-violet-600 to-violet-800",
      label: "MOBILE MONEY",
    },
    other: {
      icon: <Coins className="h-8 w-8" />,
      color: "bg-gradient-to-r from-amber-600 to-amber-800",
      label: "OTHER",
    },
  };
  return details[type as keyof typeof details] || details.other;
};

const AccountCard = ({ data = [] }: AccountCardProps) => {
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>(data);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userCurrencyInfo, setUserCurrencyInfo] = useState(() => {
    return Currencies.find((c) => c.value === "USD") || Currencies[0];
  });

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await fetch("/api/user-settings");
        if (response.ok) {
          const settings = await response.json();
          if (settings.currency) {
            const foundCurrency = Currencies.find(
              (c) => c.value === settings.currency
            );
            if (foundCurrency) {
              setUserCurrencyInfo(foundCurrency);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user settings:", error);
      }
    };

    fetchUserSettings();
  }, []);

  useEffect(() => {
    setAccounts(data);
  }, [data]);

  const formatWithSymbol = (amount: number, currencyCode: string) => {
    const uppercaseCurrency =
      currencyCode?.toUpperCase() || userCurrencyInfo.value;
    const currencyInfo =
      Currencies.find((c) => c.value === uppercaseCurrency) || userCurrencyInfo;

    try {
      const formattedNumber = amount.toLocaleString(currencyInfo.locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `${currencyInfo.symbol} ${formattedNumber}`;
    } catch {
      return `${currencyInfo.symbol} ${amount.toFixed(2)}`;
    }
  };

  const handleEditClick = (account: Account) => {
    setEditAccount({
      ...account,
      name: account.name || "",
      type: account.type || "bank",
      balance: account.balance || 0,
      currency: account.currency?.toUpperCase() || userCurrencyInfo.value,
    });
    setIsEditOpen(true);
  };

  const handleAccountUpdate = async (updatedData: Partial<Account>) => {
    if (!editAccount?._id) return;

    try {
      const response = await fetch("/api/accounts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: editAccount._id,
          ...updatedData,
          currency: updatedData.currency?.toUpperCase(),
        }),
      });

      if (!response.ok) throw new Error("Failed to update account");

      const updated = await response.json();
      setAccounts((prev) =>
        prev.map((acc) => (acc._id === updated._id ? updated : acc))
      );
      setIsEditOpen(false);
      setEditAccount(null);
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setAccountToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleAccountDelete = async () => {
    if (!accountToDelete) return;

    try {
      const response = await fetch("/api/accounts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: accountToDelete }),
      });

      if (!response.ok) throw new Error("Failed to delete account");
      setAccounts((prev) => prev.filter((acc) => acc._id !== accountToDelete));
      setIsDeleteDialogOpen(false);
      setAccountToDelete(null);
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleInputChange = (
    key: keyof Account,
    value: string | number,
    prev: Account | null
  ) => {
    if (!prev) return null;
    const updates = { ...prev };

    if (key === "balance") {
      updates[key] = parseFloat(value as string) || 0;
    } else {
      updates[key] = value as any;
    }

    return updates;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16 p-4 w-full max-w-screen-2xl">
        {accounts.map((account, index) => {
          const { icon, color } = getAccountDetails(account.type);

          return (
            <motion.div
              key={account._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${color} rounded-2xl shadow-2xl overflow-hidden min-h-[200px]`}
            >
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-white text-xl font-semibold tracking-wide">
                      {account.name}
                    </h3>
                    <p className="text-xl font-bold text-white pt-6">
                      <span className="text-[16px] flex font-extrabold pb-2">
                        Balance:{" "}
                      </span>
                      {formatWithSymbol(account.balance, account.currency)}
                    </p>
                    <p className="text-white pt-4 text-sm">
                      Added on:{" "}
                      {new Date(account.createdAt).toLocaleDateString(
                        userCurrencyInfo.locale
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-white/90">{icon}</div>
                    <Popover
                      open={isEditOpen && editAccount?._id === account._id}
                      onOpenChange={(open) => {
                        setIsEditOpen(open);
                        if (!open) setEditAccount(null);
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white/90 hover:text-white"
                          onClick={() => handleEditClick(account)}
                        >
                          <Pencil className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        {editAccount && (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleAccountUpdate({
                                name: editAccount.name,
                                type: editAccount.type,
                                balance: editAccount.balance,
                                currency: editAccount.currency,
                              });
                            }}
                            className="space-y-4"
                          >
                            <div className="space-y-2">
                              <Label>Account Name</Label>
                              <Input
                                value={editAccount.name}
                                onChange={(e) =>
                                  setEditAccount((prev) =>
                                    handleInputChange(
                                      "name",
                                      e.target.value,
                                      prev
                                    )
                                  )
                                }
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Account Type</Label>
                              <Select
                                value={editAccount.type}
                                onValueChange={(value) =>
                                  setEditAccount((prev) =>
                                    handleInputChange("type", value, prev)
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="bank">
                                    Bank Account
                                  </SelectItem>
                                  <SelectItem value="cash">Cash</SelectItem>
                                  <SelectItem value="mobile_money">
                                    Mobile Money
                                  </SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Balance</Label>
                              <Input
                                type="number"
                                value={editAccount.balance}
                                onChange={(e) =>
                                  setEditAccount((prev) =>
                                    handleInputChange(
                                      "balance",
                                      e.target.value,
                                      prev
                                    )
                                  )
                                }
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Currency</Label>
                              <Select
                                value={
                                  editAccount.currency || userCurrencyInfo.value
                                }
                                onValueChange={(value) =>
                                  setEditAccount((prev) =>
                                    handleInputChange("currency", value, prev)
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Currencies.map((currency) => (
                                    <SelectItem
                                      key={currency.value}
                                      value={currency.value}
                                    >
                                      {currency.symbol} - {currency.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <Button type="submit" className="w-full">
                              Update Account
                            </Button>
                          </form>
                        )}
                      </PopoverContent>
                    </Popover>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white/90 hover:text-white"
                      onClick={() => handleDeleteClick(account._id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Add New Card */}
        <AddAccount
          onAccountAdded={(newAccount) =>
            setAccounts([...accounts, newAccount as Account])
          }
          userCurrency={userCurrencyInfo.value}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              account and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAccountDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AccountCard;

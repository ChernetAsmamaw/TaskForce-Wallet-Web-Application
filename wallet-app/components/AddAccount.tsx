"use client";

import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
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

interface Account {
  _id?: string;
  name: string;
  type: string;
  balance: number;
}

interface AddAccountProps {
  onAccountAdded: (account: Account) => void;
}

function AddAccount({ onAccountAdded }: AddAccountProps) {
  const [open, setOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "bank",
    balance: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newAccount,
          balance: Number(newAccount.balance),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create account");
      }

      const account = await response.json();
      onAccountAdded(account);
      setOpen(false);
      setNewAccount({
        name: "",
        type: "bank",
        balance: "",
      });
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className="relative bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 
          rounded-2xl shadow-2xl overflow-hidden min-h-[200px] cursor-pointer 
          transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] group"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div
                className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 
                group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-colors duration-300"
              >
                <Plus className="h-8 w-8 text-gray-600 dark:text-gray-300" />
              </div>
              <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                Add New Account
              </span>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              value={newAccount.name}
              onChange={(e) =>
                setNewAccount((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="Enter account name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Account Type</Label>
            <Select
              value={newAccount.type}
              onValueChange={(value) =>
                setNewAccount((prev) => ({
                  ...prev,
                  type: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Bank Account</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Initial Balance</Label>
            <Input
              id="balance"
              type="number"
              value={newAccount.balance}
              onChange={(e) =>
                setNewAccount((prev) => ({
                  ...prev,
                  balance: e.target.value,
                }))
              }
              placeholder="Enter initial balance"
              step="0.01"
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Account</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddAccount;

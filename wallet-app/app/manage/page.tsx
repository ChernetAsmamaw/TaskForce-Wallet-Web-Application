"use client";
"use client";

import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import Currencies from "@/lib/Currencies";
import NavBar from "@/components/NavBar";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const UserSettingsPage = () => {
  const [settings, setSettings] = useState({
    currency: "usd",
    language: "en",
    budgetAlerts: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
  ];

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/user-settings");
        if (!response.ok) throw new Error("Failed to fetch settings");
        const data = await response.json();
        setSettings(data);
        setError(null);
      } catch (error) {
        setError("Unable to load settings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    try {
      const response = await fetch("/api/user-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Failed to update settings");

      setSuccessMessage("Settings updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to update settings. Please try again.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your account preferences and notifications
              </p>
            </div>
          </div>

          {isLoading ? (
            <Card className="p-6">
              <div className="flex items-center justify-center h-32">
                <div className="text-gray-600 dark:text-gray-400">
                  Loading settings...
                </div>
              </div>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-lg">
                  {successMessage}
                </div>
              )}

              {/* General Settings */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                  General Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency
                    </label>
                    <Select
                      value={settings.currency}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          currency: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {Currencies.map((currency) => (
                          <SelectItem
                            key={currency.value}
                            value={currency.value}
                          >
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Language
                    </label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          language: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="max-w-xs w-full flex items-center justify-center bg-amber-600 gap-2 dark:text-white font-bold py-3"
                >
                  <Save className="h-5 w-5" />
                  Save Settings
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default UserSettingsPage;

"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Currencies from "@/lib/Currencies";
import { UpdateUserCurrencySchema } from "../schema/userSettings";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SkeletonWrapper from "./SkeletonWrapper";
import { toast } from "sonner";

export default function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const queryClient = useQueryClient();

  // Fetch user settings
  const { data: userSettings, isLoading } = useQuery({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  });

  // Update user settings mutation
  const updateSettings = useMutation({
    mutationFn: async (currency: string) => {
      const validationResult = UpdateUserCurrencySchema.safeParse({ currency });

      if (!validationResult.success) {
        throw new Error("Please select a valid currency");
      }

      const response = await fetch("/api/user-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency }),
      });

      if (!response.ok) {
        throw new Error("Failed to update currency");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Currency updated successfully! ");
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update currency");
    },
  });

  // Find the currently selected currency
  const selectedCurrency = React.useMemo(() => {
    if (!userSettings?.currency) return null;
    return Currencies.find((c) => c.value === userSettings.currency) || null;
  }, [userSettings?.currency]);

  // Handle currency selection
  const handleCurrencySelect = (currency: (typeof Currencies)[0]) => {
    if (!currency?.value) {
      toast.error("Please select a valid currency");
      return;
    }
    updateSettings.mutate(currency.value);
  };

  if (isLoading) {
    return (
      <SkeletonWrapper>
        <div className="w-[300px] h-[50px] bg-gray-200 rounded-md"></div>
      </SkeletonWrapper>
    );
  }

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={updateSettings.isPending}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[300px] h-[50px] justify-center text-center font-bold"
            >
              {selectedCurrency
                ? `${selectedCurrency.symbol} - ${selectedCurrency.label}`
                : "+ Select A Currency"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="center">
            <CurrencyList setOpen={setOpen} onSelect={handleCurrencySelect} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-[300px] h-[50px] justify-center text-amber-500 p-4"
        >
          {selectedCurrency
            ? `${selectedCurrency.symbol} - ${selectedCurrency.label}`
            : "+ Set Currency"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t flex justify-center">
          <CurrencyList setOpen={setOpen} onSelect={handleCurrencySelect} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function CurrencyList({
  setOpen,
  onSelect,
}: {
  setOpen: (open: boolean) => void;
  onSelect: (currency: (typeof Currencies)[0]) => void;
}) {
  return (
    <Command>
      <CommandInput
        placeholder="Filter Currencies..."
        className="text-center"
      />
      <CommandList>
        <CommandEmpty className="text-center">No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                const selected = Currencies.find(
                  (item) => item.value === value
                );
                if (selected) {
                  onSelect(selected);
                  setOpen(false);
                }
              }}
              className="text-center"
            >
              {currency.symbol} - {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

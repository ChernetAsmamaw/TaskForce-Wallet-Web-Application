import { z } from "zod";
import Currencies from "@/lib/Currencies";

export const UpdateUserCurrencySchema = z.object({
  currency: z.custom((value) => {
    const found = Currencies.find((currency) => currency.value === value);
    if (!found) {
      throw new Error(`Invalid currency: ${value}`);
    }
    return value;
  }),
});

export type UpdateUserCurrencyType = z.infer<typeof UpdateUserCurrencySchema>;

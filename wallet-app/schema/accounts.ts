import { z } from "zod";

// Schema for creating a new account
export const CreateAccountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  balance: z.number().default(0),
});

// Schema for updating an account
export const UpdateAccountSchema = z.object({
  name: z.string().optional(),
  balance: z.number().optional(),
});

// Types inferred from the schemas
export type CreateAccountType = z.infer<typeof CreateAccountSchema>;
export type UpdateAccountType = z.infer<typeof UpdateAccountSchema>;

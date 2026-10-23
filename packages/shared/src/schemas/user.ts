// Mirror docs/product-specs/data-contract.md mục 2 — collection `users`.
// Đổi schema phải đồng bộ docs.

import { z } from "zod";
import { emailSchema, idSchema, timestampSchema } from "./common";

export const userProviderSchema = z.enum(["google", "email", "anonymous"]);
export type UserProvider = z.infer<typeof userProviderSchema>;

export const userSchema = z.object({
  id: idSchema,
  email: emailSchema.optional(),
  displayName: z.string().min(1).max(120).optional(),
  photoURL: z.string().url().optional(),
  provider: userProviderSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export type User = z.infer<typeof userSchema>;

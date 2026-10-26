// Mirror docs/product-specs/data-contract.md mục 2 — collection `tarot_readings`.
// Đổi schema phải đồng bộ docs.

import { z } from "zod";
import { idSchema, timestampSchema } from "./common";
import { tarotAiReadingSchema } from "./tarot-ai";

/**
 * Spread hợp lệ theo data-contract.md: 1 | 3 | 5 | 7 | 10 | 12.
 * MVP chỉ triển khai 1 và 3 lá (ADR-003), nhưng schema giữ đủ để không
 * phải migrate khi mở rộng.
 */
export const tarotSpreadSchema = z.union([
  z.literal(1),
  z.literal(3),
  z.literal(5),
  z.literal(7),
  z.literal(10),
  z.literal(12),
]);
export type TarotSpread = z.infer<typeof tarotSpreadSchema>;

export const tarotCardSchema = z.object({
  cardId: z.number().int().nonnegative(),
  reversed: z.boolean(),
  position: z.number().int().nonnegative(),
});
export type TarotCard = z.infer<typeof tarotCardSchema>;

export const tarotAccessSourceSchema = z.enum(["free", "subscription", "voucher"]);
export type TarotAccessSource = z.infer<typeof tarotAccessSourceSchema>;

export const tarotProfileSnapshotSchema = z.object({
  name: z.string().max(200).optional(),
  dob: z.string().max(20).optional(),
  gender: z.string().max(20).optional(),
});

export const tarotReadingSchema = z.object({
  id: idSchema,
  userId: idSchema.optional(),
  theme: z.string().min(1).max(200),
  subTheme: z.string().min(1).max(200).optional(),
  question: z.string().min(1).max(500).optional(),
  spread: tarotSpreadSchema,
  cards: z.array(tarotCardSchema).min(1).max(12),
  analysis: z.string().max(10000).optional(),
  reading: tarotAiReadingSchema.optional(),
  source: z.enum(["gemini", "template"]).optional(),
  profileSnapshot: tarotProfileSnapshotSchema.optional(),
  accessSource: tarotAccessSourceSchema.default("free"),
  createdAt: timestampSchema,
});

export type TarotReading = z.infer<typeof tarotReadingSchema>;

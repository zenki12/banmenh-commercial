// Mirror docs/product-specs/data-contract.md mục 2 — collection `reports`.
// Đổi schema phải đồng bộ docs.

import { z } from "zod";
import { idSchema, isoDateSchema, timestampSchema } from "./common";

/**
 * Snapshot input người dùng. Backend nên hash riêng vào `inputHash` và chỉ
 * giữ snapshot cho mục đích hiển thị/đối chiếu, không log raw PII ngoài đây.
 */
export const reportInputSnapshotSchema = z.object({
  fullName: z.string().min(1).max(200),
  nickname: z.string().min(1).max(120).optional(),
  gender: z.enum(["male", "female"]).optional(),
  birthDate: isoDateSchema,
});

export type ReportInputSnapshot = z.infer<typeof reportInputSnapshotSchema>;

/**
 * data-contract.md chỉ liệt kê `module: "numerology"` cho `reports`. Tarot
 * có collection riêng `tarot_readings`. Khi spec mở rộng, cập nhật cả docs
 * và schema này cùng lúc.
 */
export const reportModuleSchema = z.literal("numerology");

export const reportStatusSchema = z.enum(["free", "unlocked"]);
export type ReportStatus = z.infer<typeof reportStatusSchema>;

export const reportUnlockSourceSchema = z.enum([
  "payos",
  "voucher_free",
  "legacy",
  "admin",
]);
export type ReportUnlockSource = z.infer<typeof reportUnlockSourceSchema>;

export const reportSchema = z.object({
  id: idSchema,
  userId: idSchema.optional(),
  module: reportModuleSchema,
  inputHash: z.string().min(1),
  inputSnapshot: reportInputSnapshotSchema,
  status: reportStatusSchema,
  purchaseId: idSchema.optional(),
  entitlementId: idSchema.optional(),
  unlockSource: reportUnlockSourceSchema.optional(),
  unlockedAt: timestampSchema.optional(),
  reportVersion: z.string().min(1).default("v1"),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export type Report = z.infer<typeof reportSchema>;

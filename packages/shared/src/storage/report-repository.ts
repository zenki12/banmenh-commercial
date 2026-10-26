// Storage adapter interface — implement bởi Worker/API, không phải frontend.
// Mirror docs/product-specs/data-contract.md mục 2 — collection `reports`.

import type { Report, ReportStatus, ReportUnlockSource } from "../schemas";
import type { PaginationOptions, QueryResult, StorageContext } from "./common";

export interface ReportRepository {
  getById(id: string, ctx: StorageContext): Promise<Report | null>;
  listByUser(
    userId: string,
    options: PaginationOptions,
    ctx: StorageContext,
  ): Promise<QueryResult<Report>>;
  /**
   * Tìm report theo inputHash + userId để tránh tạo trùng.
   * data-contract.md mục 4: `reports.inputHash + userId` có thể index.
   */
  findByInputHash(
    inputHash: string,
    userId: string | undefined,
    ctx: StorageContext,
  ): Promise<Report | null>;
  create(
    input: Omit<Report, "id" | "createdAt" | "updatedAt">,
    ctx: StorageContext,
  ): Promise<Report>;
  updateStatus(
    id: string,
    status: ReportStatus,
    ctx: StorageContext,
  ): Promise<Report>;
  updateAccess(
    id: string,
    access: {
      status: ReportStatus;
      purchaseId?: string;
      entitlementId?: string;
      unlockSource?: ReportUnlockSource;
      unlockedAt?: string;
    },
    ctx: StorageContext,
  ): Promise<Report>;
}

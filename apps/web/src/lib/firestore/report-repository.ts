import type { Report, ReportRepository } from "@banmenh/shared";
import { createHash } from "node:crypto";
import { adminFirestore } from "../firebase/admin";
import { fromFirestoreDoc, toFirestoreDoc } from "./converters";

const COLLECTION = "reports";

function col() {
  return adminFirestore.collection(COLLECTION);
}

export function numerologyInputHash(input: Report["inputSnapshot"]): string {
  const normalized = {
    fullName: input.fullName.trim().toLocaleLowerCase("vi-VN").replace(/\s+/g, " "),
    nickname: input.nickname?.trim().toLocaleLowerCase("vi-VN").replace(/\s+/g, " ") ?? "",
    gender: input.gender ?? "",
    birthDate: input.birthDate,
  };
  return createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
}

export function numerologyReportId(userId: string, inputHash: string): string {
  return `num_${createHash("sha256").update(`${userId}:${inputHash}`).digest("hex").slice(0, 32)}`;
}

export const firestoreReportRepository: ReportRepository = {
  async getById(id, ctx) {
    const report = fromFirestoreDoc<Report>(await col().doc(id).get());
    if (!report || (ctx.userId && report.userId !== ctx.userId)) return null;
    return report;
  },

  async listByUser(userId, options, _ctx) {
    const limit = Math.min(Math.max(options.limit ?? 100, 1), 100);
    const snap = await col().where("userId", "==", userId).limit(limit).get();
    const items = snap.docs
      .map((doc) => fromFirestoreDoc<Report>(doc))
      .filter((report): report is Report => report !== null)
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
    return { items, total: items.length };
  },

  async findByInputHash(inputHash, userId, _ctx) {
    if (!userId) return null;
    const id = numerologyReportId(userId, inputHash);
    return fromFirestoreDoc<Report>(await col().doc(id).get());
  },

  async create(input, _ctx) {
    const now = new Date().toISOString();
    const id = numerologyReportId(input.userId ?? "anonymous", input.inputHash);
    const ref = col().doc(id);
    const existing = fromFirestoreDoc<Report>(await ref.get());
    if (existing) {
      await ref.update({ inputSnapshot: input.inputSnapshot, updatedAt: now });
      return { ...existing, inputSnapshot: input.inputSnapshot, updatedAt: now };
    }
    const report: Report = { ...input, id, createdAt: now, updatedAt: now };
    await ref.set(toFirestoreDoc(report));
    return report;
  },

  async updateStatus(id, status, ctx) {
    return this.updateAccess(id, { status }, ctx);
  },

  async updateAccess(id, access, ctx) {
    const ref = col().doc(id);
    const current = fromFirestoreDoc<Report>(await ref.get());
    if (!current || (ctx.userId && current.userId !== ctx.userId)) {
      throw new Error("Báo cáo không tồn tại hoặc không thuộc tài khoản.");
    }
    const updatedAt = new Date().toISOString();
    await ref.update({ ...access, updatedAt });
    return { ...current, ...access, updatedAt };
  },
};

// Firestore implementation của EntitlementRepository — server context only.
// Collection: "entitlements", doc id = `${userId}_${purchaseId}` (deterministic).
// Idempotency: tạo với doc id cố định → set với merge = false → không tạo trùng.

import type { Entitlement, EntitlementRepository } from "@banmenh/shared";
import { adminFirestore } from "../firebase/admin";
import { fromFirestoreDoc, toFirestoreDoc } from "./converters";

const COLLECTION = "entitlements";

function col() {
  return adminFirestore.collection(COLLECTION);
}

export const firestoreEntitlementRepository: EntitlementRepository = {
  async getById(id, _ctx) {
    const doc = await col().doc(id).get();
    return fromFirestoreDoc<Entitlement>(doc);
  },

  async listByUser(userId, _ctx) {
    const snap = await col()
      .where("userId", "==", userId)
      .limit(100)
      .get();
    return snap.docs
      .map((d) => fromFirestoreDoc<Entitlement>(d))
      .filter((e): e is Entitlement => e !== null && e.status === "active")
      .sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt));
  },

  async findActiveForReport(userId, reportId, _ctx) {
    const snap = await col()
      .where("userId", "==", userId)
      .where("reportId", "==", reportId)
      .where("status", "==", "active")
      .limit(1)
      .get();
    if (snap.empty) return null;
    return fromFirestoreDoc<Entitlement>(snap.docs[0]);
  },

  async create(input, _ctx) {
    // Deterministic id = `${userId}_${purchaseId}` — idempotent
    const id = `${input.userId ?? "anon"}_${input.purchaseId}`;
    const data: Entitlement = { ...input, id };
    const ref = col().doc(id);
    const existing = await ref.get();
    if (existing.exists) {
      // Idempotent: trả về doc đã có, không ghi đè
      return fromFirestoreDoc<Entitlement>(existing) as Entitlement;
    }
    await ref.set(toFirestoreDoc(data));
    return data;
  },

  async markCancelled(id, _ctx) {
    await col().doc(id).update({ status: "cancelled" });
    const doc = await col().doc(id).get();
    const updated = fromFirestoreDoc<Entitlement>(doc);
    if (!updated) throw new Error(`Entitlement ${id} không tìm thấy.`);
    return updated;
  },
};

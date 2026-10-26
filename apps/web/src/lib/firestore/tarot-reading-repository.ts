import type { TarotReading, TarotReadingRepository } from "@banmenh/shared";
import { randomUUID } from "node:crypto";
import { adminFirestore } from "../firebase/admin";
import { fromFirestoreDoc, toFirestoreDoc } from "./converters";

const COLLECTION = "tarot_readings";

function col() {
  return adminFirestore.collection(COLLECTION);
}

export const firestoreTarotReadingRepository: TarotReadingRepository = {
  async getById(id, ctx) {
    const reading = fromFirestoreDoc<TarotReading>(await col().doc(id).get());
    if (!reading || (ctx.userId && reading.userId !== ctx.userId)) return null;
    return reading;
  },

  async listByUser(userId, options, _ctx) {
    const limit = Math.min(Math.max(options.limit ?? 50, 1), 100);
    const snap = await col().where("userId", "==", userId).limit(limit).get();
    const items = snap.docs
      .map((doc) => fromFirestoreDoc<TarotReading>(doc))
      .filter((reading): reading is TarotReading => reading !== null)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    return { items, total: items.length };
  },

  async create(input, _ctx) {
    const id = randomUUID();
    const reading: TarotReading = { ...input, id, createdAt: new Date().toISOString() };
    await col().doc(id).set(toFirestoreDoc(reading));
    return reading;
  },
};

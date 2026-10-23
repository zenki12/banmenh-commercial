// Firestore implementation của UserRepository — server context only.
// Collection: "users", doc id = Firebase uid.

import type { User } from "@banmenh/shared";
import type {
  PaginationOptions,
  QueryResult,
  StorageContext,
  UserRepository,
} from "@banmenh/shared";
import { adminFirestore } from "../firebase/admin";
import { fromFirestoreDoc, toFirestoreDoc } from "./converters";

const COLLECTION = "users";

function col() {
  return adminFirestore.collection(COLLECTION);
}

export const firestoreUserRepository: UserRepository = {
  async getById(id, _ctx) {
    const doc = await col().doc(id).get();
    return fromFirestoreDoc<User>(doc);
  },

  async getByEmail(email, _ctx) {
    const snap = await col().where("email", "==", email).limit(1).get();
    if (snap.empty) return null;
    return fromFirestoreDoc<User>(snap.docs[0]);
  },

  async create(input, _ctx) {
    const now = new Date().toISOString();
    // UserRepository.create nhận Omit<User, "id"|"createdAt"|"updatedAt">.
    // id phải được truyền qua ensureUser hoặc caller tự set trước khi gọi.
    // Ở đây dùng ensureUser thay vì create trực tiếp — method này chỉ để
    // satisfy interface, caller nên dùng ensureUser.
    const data: User = {
      id: "",
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    if (!data.id) throw new Error("UserRepository.create: thiếu id. Dùng ensureUser thay thế.");
    await col().doc(data.id).set(toFirestoreDoc(data));
    return data;
  },

  async update(id, patch, _ctx) {
    const now = new Date().toISOString();
    await col().doc(id).update({ ...patch, updatedAt: now });
    const doc = await col().doc(id).get();
    const updated = fromFirestoreDoc<User>(doc);
    if (!updated) throw new Error(`User ${id} không tìm thấy sau update.`);
    return updated;
  },

  async list(options, _ctx) {
    let query = col().orderBy("createdAt", "desc");
    if (options.limit) query = query.limit(options.limit) as typeof query;
    if (options.cursor) query = query.startAfter(options.cursor) as typeof query;
    const snap = await query.get();
    const items = snap.docs
      .map((d) => fromFirestoreDoc<User>(d))
      .filter((u): u is User => u !== null);
    return { items } satisfies QueryResult<User>;
  },
};

/**
 * Tạo user doc nếu chưa có, hoặc merge fields mới (displayName/photoURL/email).
 * Gọi sau mỗi lần login thành công để đảm bảo Firestore luôn sync với Firebase Auth.
 */
export async function ensureUser(
  uid: string,
  profile: {
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
    provider: "google" | "email" | "anonymous";
  },
  _ctx: StorageContext,
): Promise<void> {
  const ref = col().doc(uid);
  const doc = await ref.get();
  const now = new Date().toISOString();

  if (!doc.exists) {
    const data: User = {
      id: uid,
      email: profile.email ?? undefined,
      displayName: profile.displayName ?? undefined,
      photoURL: profile.photoURL ?? undefined,
      provider: profile.provider,
      createdAt: now,
      updatedAt: now,
    };
    await ref.set(toFirestoreDoc(data));
  } else {
    const patch: Record<string, unknown> = { updatedAt: now };
    patch.provider = profile.provider;
    if (profile.email) patch.email = profile.email;
    if (profile.displayName) patch.displayName = profile.displayName;
    if (profile.photoURL) patch.photoURL = profile.photoURL;
    await ref.update(patch);
  }
}

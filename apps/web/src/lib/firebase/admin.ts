// Chỉ dùng trong server context. KHÔNG import vào client component.
// firebase-admin không chạy trên Edge runtime — route handler phải set
// export const runtime = "nodejs".

import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function getAdminApp(): App {
  if (getApps().length > 0) return getApp();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error(
      "Thiếu FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL hoặc FIREBASE_PRIVATE_KEY. Kiểm tra .env.local.",
    );
  }

  // Xử lý escaped newline khi key được lưu dạng JSON string trong env.
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

function getAdminFirestore(): Firestore {
  const fs = getFirestore(getAdminApp());
  // ignoreUndefinedProperties: Firestore tự strip undefined fields trước khi write.
  // Cần thiết vì optional fields trong schema (voucherCode, expiresAt, providerRef, ...)
  // có thể là undefined — Firestore Admin SDK reject nếu không set.
  // settings() chỉ call được 1 lần; catch để tránh crash khi hot reload re-import.
  try {
    fs.settings({ ignoreUndefinedProperties: true });
  } catch {
    // Settings đã được set trước đó — bỏ qua.
  }
  return fs;
}

let adminAuthInstance: Auth | null = null;
let adminFirestoreInstance: Firestore | null = null;

export const adminAuth = new Proxy({} as Auth, {
  get(_target, prop) {
    if (!adminAuthInstance) {
      adminAuthInstance = getAuth(getAdminApp());
    }
    return (adminAuthInstance as any)[prop];
  },
});

export const adminFirestore = new Proxy({} as Firestore, {
  get(_target, prop) {
    if (!adminFirestoreInstance) {
      adminFirestoreInstance = getAdminFirestore();
    }
    return (adminFirestoreInstance as any)[prop];
  },
});

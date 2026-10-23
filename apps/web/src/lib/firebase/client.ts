// Firebase client SDK — dùng được ở cả client component và server component.
// Singleton pattern: chỉ khởi tạo một lần dù module được import nhiều lần.
//
// QUAN TRỌNG: Next.js chỉ inline NEXT_PUBLIC_* khi access TRỰC TIẾP
// (process.env.NEXT_PUBLIC_FIREBASE_API_KEY). Dynamic access qua process.env[key]
// KHÔNG được inline vào client bundle → browser throw "process is not defined".
// Ref: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

function createFirebaseConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock-api-key";
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock.firebaseapp.com";
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project";
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock.appspot.com";
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000";
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:mock";

  return { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId };
}

function getFirebaseApp(): FirebaseApp {
  if (getApps().length === 0) {
    return initializeApp(createFirebaseConfig());
  }
  return getApp();
}

let firebaseAppInstance: FirebaseApp | null = null;
let firebaseAuthInstance: Auth | null = null;

export const firebaseApp = new Proxy({} as FirebaseApp, {
  get(_target, prop) {
    if (!firebaseAppInstance) {
      firebaseAppInstance = getFirebaseApp();
    }
    return (firebaseAppInstance as any)[prop];
  },
});

export const firebaseAuth = new Proxy({} as Auth, {
  get(_target, prop) {
    if (!firebaseAuthInstance) {
      firebaseAuthInstance = getAuth(getFirebaseApp());
    }
    return (firebaseAuthInstance as any)[prop];
  },
});

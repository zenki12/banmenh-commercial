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
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC6rnSqkcOD1aB70npWtyB-N5Fe3cbwa_U";
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ban-menh-v2.firebaseapp.com";
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ban-menh-v2";
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ban-menh-v2.appspot.com";
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "763529927902";
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:763529927902:web:a06df7fdd1bbe1a7dd364f";

  return { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId };
}

function getFirebaseApp(): FirebaseApp {
  if (getApps().length === 0) {
    return initializeApp(createFirebaseConfig());
  }
  return getApp();
}

export const firebaseApp: FirebaseApp = getFirebaseApp();
export const firebaseAuth: Auth = getAuth(firebaseApp);

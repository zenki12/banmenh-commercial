"use client";

import {
  createError,
  type AppError,
  type User as SharedUser,
} from "@banmenh/shared";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GoogleAuthProvider,
  linkWithPopup,
  linkWithCredential,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { firebaseAuth } from "../firebase/client";

type AuthContextValue = {
  user: SharedUser | null;
  loading: boolean;
  isAnonymous: boolean;
  error: AppError | null;
  signInWithGoogle: () => Promise<boolean>;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  createAccountWithEmail: (email: string, password: string) => Promise<boolean>;
  signInAnonymouslyFn: () => Promise<void>;
  linkAnonymousToGoogle: () => Promise<boolean>;
  signOutFn: () => Promise<void>;
  clearError: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

function mapFirebaseUser(fbUser: FirebaseUser): SharedUser {
  const now = new Date().toISOString();
  return {
    id: fbUser.uid,
    email: fbUser.email ?? undefined,
    displayName: fbUser.displayName ?? undefined,
    photoURL: fbUser.photoURL ?? undefined,
    provider: fbUser.isAnonymous
      ? "anonymous"
      : fbUser.providerData.some((provider) => provider.providerId === "password")
        ? "email"
        : "google",
    createdAt: fbUser.metadata.creationTime ?? now,
    updatedAt: now,
  };
}

function mapFirebaseError(err: unknown): AppError | null {
  if (typeof err !== "object" || err === null) return null;
  const code = (err as { code?: string }).code ?? "";
  console.warn("[AuthProvider] Firebase auth failed:", code || err);
  if (
    code === "auth/cancelled-popup-request" ||
    code === "auth/popup-closed-by-user"
  ) {
    return null;
  }
  if (code === "auth/unauthorized-domain") {
    return {
      ...createError("AUTH_INVALID_TOKEN"),
      message: "Domain Vercel chưa được thêm vào Firebase Authorized domains.",
    };
  }
  if (code === "auth/operation-not-allowed") {
    return {
      ...createError("AUTH_INVALID_TOKEN"),
      message: "Phương thức đăng nhập này chưa được bật trong Firebase Authentication.",
    };
  }
  if (code === "auth/popup-blocked") {
    return {
      ...createError("AUTH_INVALID_TOKEN"),
      message: "Trình duyệt đã chặn popup đăng nhập. Vui lòng cho phép popup rồi thử lại.",
    };
  }
  if (code === "auth/network-request-failed") return createError("NETWORK_ERROR");
  if (code === "auth/invalid-credential") {
    return { ...createError("AUTH_INVALID_TOKEN"), message: "Email hoặc mật khẩu không đúng." };
  }
  if (code === "auth/credential-already-in-use") {
    return { ...createError("ALREADY_EXISTS"), message: "Email này đã thuộc một tài khoản khác. Vui lòng đăng nhập." };
  }
  if (code === "auth/email-already-in-use") {
    return { ...createError("ALREADY_EXISTS"), message: "Email này đã được đăng ký. Vui lòng đăng nhập." };
  }
  if (code === "auth/weak-password") {
    return { ...createError("INPUT_INVALID"), message: "Mật khẩu cần có ít nhất 8 ký tự." };
  }
  if (code === "auth/invalid-email") {
    return { ...createError("INPUT_INVALID"), message: "Địa chỉ email chưa đúng định dạng." };
  }
  if (code === "auth/too-many-requests") {
    return { ...createError("RATE_LIMITED"), message: "Bạn đã thử quá nhiều lần. Vui lòng đợi một lúc rồi thử lại." };
  }
  return createError("INTERNAL_ERROR");
}

function createGoogleProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}

/** Gọi /api/auth/session để ensure Firestore user doc — non-blocking. */
async function syncSessionToFirestore(fbUser: FirebaseUser): Promise<void> {
  try {
    const credential = await fbUser.getIdToken();
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });
  } catch (err) {
    console.warn("[AuthProvider] syncSession failed (non-blocking):", err);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SharedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(firebaseAuth, (fbUser) => {
        setUser(fbUser ? mapFirebaseUser(fbUser) : null);
        setLoading(false);
        if (fbUser) {
          // Ensure Firestore user doc — không await để không block UI
          void syncSessionToFirestore(fbUser);
        }
      });
      return unsubscribe;
    } catch (err) {
      console.warn("[AuthProvider] Firebase auth initialization failed:", err);
      setLoading(false);
      return undefined;
    }
  }, []);

  async function signInWithGoogle() {
    setError(null);
    try {
      await signInWithPopup(firebaseAuth, createGoogleProvider());
      return true;
    } catch (err) {
      const mapped = mapFirebaseError(err);
      if (mapped) setError(mapped);
      return false;
    }
  }

  async function signInWithEmail(email: string, password: string) {
    setError(null);
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      return true;
    } catch (err) {
      const mapped = mapFirebaseError(err);
      if (mapped) setError(mapped);
      return false;
    }
  }

  async function createAccountWithEmail(email: string, password: string) {
    setError(null);
    try {
      const current = firebaseAuth.currentUser;
      if (current?.isAnonymous) {
        await linkWithCredential(current, EmailAuthProvider.credential(email, password));
      } else {
        await createUserWithEmailAndPassword(firebaseAuth, email, password);
      }
      return true;
    } catch (err) {
      const mapped = mapFirebaseError(err);
      if (mapped) setError(mapped);
      return false;
    }
  }

  async function signInAnonymouslyFn() {
    setError(null);
    try {
      await signInAnonymously(firebaseAuth);
    } catch (err) {
      const mapped = mapFirebaseError(err);
      if (mapped) setError(mapped);
    }
  }

  async function linkAnonymousToGoogle() {
    setError(null);
    const current = firebaseAuth.currentUser;
    if (!current) {
      setError(createError("AUTH_REQUIRED"));
      return false;
    }
    try {
      await linkWithPopup(current, createGoogleProvider());
      return true;
    } catch (err) {
      const code = (err as { code?: string })?.code;
      // Nếu tài khoản Google này đã tồn tại trước đó, tự động chuyển sang đăng nhập vào tài khoản đó
      if (code === "auth/credential-already-in-use" || code === "auth/email-already-in-use") {
        try {
          await signInWithPopup(firebaseAuth, createGoogleProvider());
          return true;
        } catch (signInErr) {
          const mapped = mapFirebaseError(signInErr);
          if (mapped) setError(mapped);
          return false;
        }
      }
      const mapped = mapFirebaseError(err);
      if (mapped) setError(mapped);
      return false;
    }
  }

  async function signOutFn() {
    setError(null);
    try {
      await signOut(firebaseAuth);
    } catch (err) {
      const mapped = mapFirebaseError(err);
      if (mapped) setError(mapped);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAnonymous: user?.provider === "anonymous",
        error,
        signInWithGoogle,
        signInWithEmail,
        createAccountWithEmail,
        signInAnonymouslyFn,
        linkAnonymousToGoogle,
        signOutFn,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

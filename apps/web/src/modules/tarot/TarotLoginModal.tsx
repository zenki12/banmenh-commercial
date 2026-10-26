"use client";

import { useState } from "react";
import { Button } from "../../components/ui";
import { useAuth } from "../../lib/auth";
import { ModalShell } from "./tarot-ui";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
      <path d="M21.35 12.27c0-.71-.06-1.24-.2-1.8H12v3.53h5.37a4.72 4.72 0 0 1-2 3.03l-.02.12 2.9 2.25.2.02c1.86-1.72 2.9-4.24 2.9-7.15Z" fill="#4285F4" />
      <path d="M12 21.75c2.63 0 4.84-.87 6.45-2.33l-3.08-2.39c-.82.56-1.92.95-3.37.95a5.85 5.85 0 0 1-5.54-4.04l-.12.01-3.02 2.34-.04.11A9.74 9.74 0 0 0 12 21.75Z" fill="#34A853" />
      <path d="M6.46 13.94A6.02 6.02 0 0 1 6.13 12c0-.68.12-1.33.32-1.94v-.13L3.4 7.56l-.1.05A9.73 9.73 0 0 0 2.25 12c0 1.58.38 3.08 1.03 4.4l3.18-2.46Z" fill="#FBBC05" />
      <path d="M12 6.02c1.83 0 3.06.79 3.77 1.44l2.74-2.68A9.3 9.3 0 0 0 12 2.25a9.74 9.74 0 0 0-8.72 5.36l3.17 2.45A5.87 5.87 0 0 1 12 6.02Z" fill="#EA4335" />
    </svg>
  );
}

export function TarotLoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}) {
  const { clearError, error, signInWithGoogle } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  function handleClose() {
    clearError();
    onClose();
  }

  async function handleGoogleLogin() {
    setSubmitting(true);
    const success = await signInWithGoogle();
    setSubmitting(false);
    if (success) onLoginSuccess();
  }

  return (
    <ModalShell label="Đăng nhập để bắt đầu trải bài" onClose={handleClose}>
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--bm-gold-bright)]">
          Đặc quyền mỗi ngày
        </p>
        <h2 className="mt-3 text-3xl font-black text-[var(--bm-text-main)]">
          Đăng nhập để bắt đầu trải bài
        </h2>
        <p className="mt-4 leading-7 text-[var(--bm-text-soft)]">
          Nhận ngay <strong className="text-[var(--bm-gold-bright)]">3 lượt trải bài miễn phí mỗi ngày</strong> cho các câu hỏi 1 lá và 3 lá khi kết nối bằng tài khoản Google. Lịch sử và thông điệp sẽ được lưu an toàn cùng tài khoản của bạn.
        </p>
        {error ? (
          <p
            className="mt-5 rounded-xl border border-[color-mix(in_srgb,var(--bm-danger)_40%,transparent)] bg-[color-mix(in_srgb,var(--bm-danger)_12%,transparent)] p-3 text-sm leading-6 text-[var(--bm-danger-soft)]"
            role="alert"
          >
            {error.message}
          </p>
        ) : null}
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Button
            fullWidth
            leftIcon={<GoogleIcon />}
            loading={submitting}
            onClick={() => void handleGoogleLogin()}
            size="lg"
          >
            Tiếp tục với Google
          </Button>
          <Button fullWidth onClick={handleClose} size="lg" variant="secondary">
            Để sau
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

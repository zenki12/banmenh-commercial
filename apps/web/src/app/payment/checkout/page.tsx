"use client";

import { formatPriceVnd } from "@banmenh/shared";
import { useRouter, useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";
import { Suspense, useEffect, useMemo, useState } from "react";
import { PageShell } from "../../../components/layout";
import { Button, Card, ErrorState, LoadingState } from "../../../components/ui";
import { fetchWithAuth } from "../../../lib/api/client";

type PendingPayment = {
  orderId: string;
  qrCode: string;
  checkoutUrl?: string;
  amount: number;
  productName: string;
  moduleSlug?: string;
  voucherCode?: string | null;
  discountVnd?: number;
  expiresAt: string;
  returnQuery?: string;
};

type CheckResponse = {
  orderId: string;
  status: "pending" | "confirming" | "confirmed" | "expired" | "failed";
  entitlementGranted: boolean;
};

const STORAGE_KEY = "banmenh-payment-pending";
const POLL_INTERVAL_MS = 3000;

function readPendingPayment(orderId: string | null): PendingPayment | null {
  if (!orderId) return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<PendingPayment>;
    if (
      parsed.orderId !== orderId ||
      typeof parsed.qrCode !== "string" ||
      typeof parsed.amount !== "number" ||
      typeof parsed.productName !== "string" ||
      typeof parsed.expiresAt !== "string"
    ) {
      return null;
    }
    return {
      orderId: parsed.orderId,
      qrCode: parsed.qrCode,
      checkoutUrl: parsed.checkoutUrl,
      amount: parsed.amount,
      productName: parsed.productName,
      moduleSlug: parsed.moduleSlug,
      voucherCode: parsed.voucherCode,
      discountVnd: parsed.discountVnd,
      expiresAt: parsed.expiresAt,
      returnQuery: typeof parsed.returnQuery === "string" ? parsed.returnQuery : undefined,
    };
  } catch {
    return null;
  }
}

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [pending, setPending] = useState<PendingPayment | null>(null);
  const [status, setStatus] = useState<"pending" | "confirmed" | "expired">("pending");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const payment = readPendingPayment(orderId);
    if (!payment) {
      router.replace("/pricing");
      return;
    }
    setPending(payment);
  }, [orderId, router]);

  const remainingMs = useMemo(() => {
    if (!pending) return 0;
    return Math.max(0, new Date(pending.expiresAt).getTime() - now);
  }, [now, pending]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!pending || status !== "pending") return;
    if (remainingMs <= 0) {
      setStatus("expired");
    }
  }, [pending, remainingMs, status]);

  useEffect(() => {
    if (!pending || status !== "pending") return;
    const poll = async () => {
      try {
        const data = await fetchWithAuth<CheckResponse>(
          `/api/payment/check?orderId=${encodeURIComponent(pending.orderId)}`,
        );
        if (data.status === "confirmed" && data.entitlementGranted) {
          setStatus("confirmed");
          const successBase = pending.moduleSlug ? `/${pending.moduleSlug}/payment/success` : "/payment/success";
          const successParams = new URLSearchParams(pending.returnQuery ?? "");
          successParams.set("orderId", pending.orderId);
          router.push(`${successBase}?${successParams.toString()}`);
        } else if (data.status === "expired" || data.status === "failed") {
          setStatus("expired");
        }
      } catch (err) {
        console.warn("[payment/checkout] status check failed:", err);
      }
    };
    const interval = window.setInterval(() => void poll(), POLL_INTERVAL_MS);
    void poll();
    return () => window.clearInterval(interval);
  }, [pending, router, status]);

  if (!pending) {
    return <LoadingState message="Đang tải thông tin thanh toán..." />;
  }

  if (status === "expired") {
    return (
      <Card padding="lg" variant="report">
        <ErrorState
          code="PAYMENT_EXPIRED"
          onRetry={() => router.push("/pricing")}
          retryLabel="Tạo đơn mới"
          title="Mã QR đã hết hạn"
        />
      </Card>
    );
  }

  const countdownColor =
    remainingMs <= 0
      ? "text-[var(--bm-danger)]"
      : remainingMs <= 60_000
        ? "text-[var(--bm-warning)]"
        : "text-[var(--bm-text-soft)]";

  return (
    <Card padding="lg" variant="glass">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <h2>{pending.productName}</h2>
        <p className="mt-4 text-3xl font-bold text-[var(--bm-text-main)]">
          {formatPriceVnd(pending.amount)}
        </p>
        {pending.voucherCode && pending.discountVnd ? (
          <p className="mt-2 text-sm text-[var(--bm-success)]">
            Đã áp dụng voucher {pending.voucherCode}: -{formatPriceVnd(pending.discountVnd)}
          </p>
        ) : null}
        <div className="mt-8 w-full max-w-[18rem] rounded-2xl bg-white p-4">
          <QRCode
            aria-label="Mã QR thanh toán"
            value={pending.qrCode}
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          />
        </div>
        <p className="mt-5 text-sm text-[var(--bm-text-soft)]">
          Quét mã QR bằng ứng dụng ngân hàng để thanh toán đơn hàng.
        </p>
        <div className="mt-6">
          <p className="text-sm text-[var(--bm-text-muted)]">Mã QR hết hạn sau</p>
          <p className={`mt-1 font-mono text-3xl font-bold ${countdownColor}`}>
            {formatRemaining(remainingMs)}
          </p>
        </div>
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            disabled={!pending.checkoutUrl}
            fullWidth
            onClick={() => pending.checkoutUrl && window.open(pending.checkoutUrl, "_blank")}
            variant="secondary"
          >
            Mở trang thanh toán ngân hàng
          </Button>
          <Button fullWidth onClick={() => router.push("/pricing")} variant="ghost">
            Đổi gói
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function PaymentCheckoutPage() {
  return (
    <PageShell title="Thanh toán" showBack={false} containerWidth="narrow">
      <Suspense fallback={<LoadingState message="Đang tải thông tin thanh toán..." />}>
        <CheckoutContent />
      </Suspense>
    </PageShell>
  );
}

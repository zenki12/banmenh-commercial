"use client";

import { formatPriceVnd, type ProductModule } from "@banmenh/shared";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageShell } from "../layout";
import { Button, Card, ErrorState, LoadingState } from "../ui";
import { fetchWithAuth } from "../../lib/api/client";
import { useAuth } from "../../lib/auth";
import { appendSearchParams, buildModulePath, moduleToSlug } from "./utils";

type PaymentSuccessProps = {
  module: ProductModule;
};

type CheckResponse = {
  orderId: string;
  status: "pending" | "confirming" | "confirmed" | "expired" | "failed";
  amount: number;
  productCode: string;
  expiresAt: string | null;
  confirmedAt: string | null;
  entitlementGranted: boolean;
};

type PendingPaymentContext = {
  orderId?: string;
  returnQuery?: string;
};

const STORAGE_KEY = "banmenh-payment-pending";
const MAX_POLLS = 20;
const POLL_INTERVAL_MS = 3000;

function buildReportHref(module: ProductModule, searchParams: URLSearchParams): string {
  const params = new URLSearchParams(searchParams);
  params.delete("orderId");
  params.delete("freeUnlock");
  params.delete("voucherCode");
  params.delete("productCode");
  return appendSearchParams(buildModulePath(module, "/result/details"), params);
}

function hasReportInput(searchParams: URLSearchParams): boolean {
  return Boolean(searchParams.get("fullName")?.trim() && searchParams.get("dob")?.trim());
}

function SuccessPanel({
  module,
  orderId,
  amount,
  voucherCode,
  searchParams,
}: {
  module: ProductModule;
  orderId: string | null;
  amount?: number;
  voucherCode?: string | null;
  searchParams: URLSearchParams;
}) {
  const { user } = useAuth();
  const hasInput = hasReportInput(searchParams);
  const reportHref = useMemo(
    () => (hasInput ? buildReportHref(module, searchParams) : buildModulePath(module, "")),
    [hasInput, module, searchParams],
  );
  const displayName =
    searchParams.get("name") ||
    searchParams.get("fullName") ||
    user?.displayName ||
    "Hồ sơ của bạn";
  const isTarot = module === "tarot";

  return (
    <Card padding="lg" variant="report">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center motion-safe:animate-[fadeIn_0.35s_ease-out]">
        <span
          aria-hidden
          className="flex size-16 items-center justify-center rounded-full border border-[rgba(52,211,153,0.35)] bg-[rgba(52,211,153,0.12)] text-4xl text-[var(--bm-success-soft)]"
        >
          ✓
        </span>
        <div>
          <h2>Thanh toán thành công</h2>
          <p className="mt-3 text-[var(--bm-text-soft)]">
            {isTarot ? "Gói Tarot" : "Quyền truy cập báo cáo của"}{" "}
            {!isTarot ? <strong className="text-[var(--bm-text-main)]">{displayName}</strong> : null}{" "}
            đã được kích hoạt.
          </p>
        </div>
        <div className="w-full rounded-xl border border-[var(--bm-border-subtle)] bg-[var(--bm-bg-glass)] p-4 text-left">
          {orderId ? (
            <p className="text-sm text-[var(--bm-text-soft)]">
              Mã đơn hàng: <code className="font-mono text-[var(--bm-text-main)]">{orderId}</code>
            </p>
          ) : null}
          {voucherCode ? (
            <p className="mt-2 text-sm text-[var(--bm-success-soft)]">Voucher đã dùng: {voucherCode}</p>
          ) : null}
          {typeof amount === "number" ? (
            <p className="mt-2 text-lg font-bold text-[var(--bm-text-main)]">
              {formatPriceVnd(amount)}
            </p>
          ) : null}
        </div>
        <div className="grid w-full gap-3 sm:grid-cols-2">
          <Button href={reportHref} fullWidth variant="primary">
            {isTarot ? "Bắt đầu trải bài" : hasInput ? "Xem báo cáo đầy đủ" : "Nhập thông tin để tạo báo cáo"}
          </Button>
          <Button href="/account" fullWidth variant="secondary">
            Vào tài khoản
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function PaymentSuccess({ module }: PaymentSuccessProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const orderId = searchParams.get("orderId");
  const freeUnlock = searchParams.get("freeUnlock") === "true";
  const voucherCode = searchParams.get("voucherCode");
  const [result, setResult] = useState<CheckResponse | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [error, setError] = useState(false);
  const [contextReady, setContextReady] = useState(false);
  const [reportParams, setReportParams] = useState(
    () => new URLSearchParams(searchParamsString),
  );
  const pollCount = useRef(0);

  useEffect(() => {
    const restored = new URLSearchParams(searchParamsString);
    if (!hasReportInput(restored) && orderId) {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        const pending = raw ? JSON.parse(raw) as PendingPaymentContext : null;
        if (pending?.orderId === orderId && pending.returnQuery) {
          const saved = new URLSearchParams(pending.returnQuery);
          saved.forEach((value, key) => {
            if (!restored.has(key)) restored.set(key, value);
          });
        }
      } catch {
        // Context cũ không hợp lệ không được làm hỏng bước xác nhận thanh toán.
      }
    }
    setReportParams(restored);
    setContextReady(true);
  }, [orderId, searchParamsString]);

  useEffect(() => {
    if (!contextReady || (!freeUnlock && result?.status !== "confirmed")) return;
    sessionStorage.removeItem(STORAGE_KEY);
  }, [contextReady, freeUnlock, result?.status]);

  useEffect(() => {
    if (freeUnlock) return;
    if (!orderId) {
      setError(true);
      return;
    }

    const poll = async () => {
      try {
        const data = await fetchWithAuth<CheckResponse>(
          `/api/payment/check?orderId=${encodeURIComponent(orderId)}`,
        );
        if (
          (data.status === "confirmed" && data.entitlementGranted) ||
          data.status === "failed" ||
          data.status === "expired"
        ) {
          setResult(data);
          return;
        }
        pollCount.current += 1;
        if (pollCount.current >= MAX_POLLS) {
          setTimedOut(true);
          return;
        }
        setTimeout(() => void poll(), POLL_INTERVAL_MS);
      } catch {
        setError(true);
      }
    };

    setTimeout(() => void poll(), POLL_INTERVAL_MS);
  }, [freeUnlock, orderId]);

  const retryUrl = buildModulePath(module, "/payment");
  const moduleName = moduleToSlug(module);

  return (
    <PageShell title="Thanh toán" showBack={false} containerWidth="narrow">
      {!contextReady ? <LoadingState message="Đang khôi phục báo cáo..." /> : null}
      {freeUnlock && contextReady ? (
        <SuccessPanel
          module={module}
          orderId={orderId}
          amount={0}
          voucherCode={voucherCode}
          searchParams={reportParams}
        />
      ) : null}
      {contextReady && !freeUnlock && !result && !timedOut && !error ? (
        <LoadingState message="Đang xác nhận thanh toán..." />
      ) : null}
      {timedOut ? (
        <ErrorState
          description="Hệ thống đang xác nhận thanh toán. Vui lòng kiểm tra lại trong tài khoản sau ít phút."
          onRetry={() => router.push("/account")}
          retryLabel="Vào tài khoản"
          title="Đang chờ xác nhận"
        />
      ) : null}
      {error ? (
        <ErrorState
          code="PAYMENT_FAILED"
          onRetry={() => router.push(retryUrl)}
          retryLabel="Thử thanh toán lại"
          title="Không thể kiểm tra thanh toán"
        />
      ) : null}
      {result?.status === "confirmed" ? (
        <SuccessPanel
          module={module}
          orderId={result.orderId}
          amount={result.amount}
          searchParams={reportParams}
        />
      ) : null}
      {result?.status === "failed" || result?.status === "expired" ? (
        <ErrorState
          code="PAYMENT_FAILED"
          description={`Giao dịch cho ${moduleName} chưa hoàn tất hoặc đã hết hạn.`}
          onRetry={() => router.push(retryUrl)}
          retryLabel="Tạo đơn mới"
          title="Thanh toán chưa hoàn tất"
        />
      ) : null}
    </PageShell>
  );
}

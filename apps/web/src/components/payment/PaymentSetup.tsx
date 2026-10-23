"use client";

import {
  createError,
  findProduct,
  formatPriceVnd,
  isAppError,
  type AppError,
} from "@banmenh/shared";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { PageShell } from "../layout";
import { Button, Card, ErrorState, UnauthorizedState } from "../ui";
import { fetchWithAuth } from "../../lib/api/client";
import { useAuth } from "../../lib/auth";
import { buildModulePath, moduleToSlug } from "./utils";

type PaymentSetupProps = {
  productCode: string;
};

type VoucherStatus = "idle" | "validating" | "valid" | "invalid";

type VoucherResult = {
  discountVnd: number;
  finalAmount: number;
  voucher: { code: string; discountType: string };
};

type VoucherValidateResponse =
  | ({ valid: true } & VoucherResult)
  | { valid: false; error: AppError };

type CreateResponse = {
  orderId: string;
  amount: number;
  freeUnlock?: boolean;
  qrCode?: string;
  checkoutUrl?: string;
  voucherCode?: string | null;
  discountVnd?: number;
  expiresAt?: string;
  productCode?: string;
};

const STORAGE_KEY = "banmenh-payment-pending";

const NUMEROLOGY_FEATURES = [
  "Mở khóa toàn bộ báo cáo Thần số học cá nhân.",
  "Xem đầy đủ các chỉ số cốt lõi, vận số năm và chu kỳ tháng.",
  "Lưu quyền truy cập trong tài khoản để đọc lại bất cứ lúc nào.",
  "Áp dụng voucher hợp lệ trước khi tạo đơn thanh toán.",
  "Thanh toán qua PayOS với số tiền được tính lại ở backend.",
];

function StatusBadge({ tone, children }: { tone: "success" | "danger"; children: ReactNode }) {
  const color =
    tone === "success"
      ? "border-[rgba(52,211,153,0.35)] text-[var(--bm-success-soft)]"
      : "border-[rgba(252,165,165,0.35)] text-[var(--bm-danger-soft)]";

  return (
    <span
      className={`inline-flex items-center rounded-full border bg-[var(--bm-bg-glass)] px-3 py-1 text-sm font-bold ${color}`}
    >
      {children}
    </span>
  );
}

function PriceRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "success" | "total";
}) {
  const valueClass =
    accent === "success"
      ? "text-[var(--bm-success-soft)]"
      : accent === "total"
        ? "bg-[image:var(--bm-gradient-gold-text)] bg-clip-text text-2xl text-transparent"
        : "text-[var(--bm-text-main)]";

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[var(--bm-text-soft)]">{label}</span>
      <span className={`text-right font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}

function buildSuccessUrl(moduleSlug: string, searchParams: URLSearchParams, data: CreateResponse) {
  const params = new URLSearchParams(searchParams);
  params.set("orderId", data.orderId);
  params.set("freeUnlock", "true");
  if (data.productCode) params.set("productCode", data.productCode);
  if (data.voucherCode) params.set("voucherCode", data.voucherCode);
  return `/${moduleSlug}/payment/success?${params.toString()}`;
}

function isAuthError(code: AppError["code"]) {
  return code === "AUTH_REQUIRED" || code === "AUTH_INVALID_TOKEN" || code === "AUTH_SESSION_EXPIRED";
}

function authErrorDescription(code: AppError["code"]) {
  return code === "AUTH_REQUIRED"
    ? "Bạn cần đăng nhập trước khi thanh toán."
    : "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.";
}

function loginReturnHref() {
  if (typeof window === "undefined") return "/";
  const returnUrl = `${window.location.pathname}${window.location.search}`;
  return `/?returnUrl=${encodeURIComponent(returnUrl)}`;
}

export function PaymentSetup({ productCode }: PaymentSetupProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const product = useMemo(() => (productCode ? findProduct(productCode) : undefined), [productCode]);
  const { user, isAnonymous, linkAnonymousToGoogle, signInWithGoogle } = useAuth();
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherStatus, setVoucherStatus] = useState<VoucherStatus>("idle");
  const [voucherResult, setVoucherResult] = useState<VoucherResult | null>(null);
  const [voucherError, setVoucherError] = useState<AppError | null>(null);
  const [creating, setCreating] = useState(false);
  const [createErrorState, setCreateErrorState] = useState<AppError | null>(null);

  if (!productCode) {
    return (
      <PageShell title="Thanh toán" showBack backHref="/pricing" containerWidth="narrow">
        <Card padding="lg" variant="glass">
          <ErrorState
            title="Thiếu gói cần thanh toán"
            description="Đường dẫn thanh toán chưa có mã gói. Vui lòng quay lại màn hình chọn gói và thử lại."
            onRetry={() => router.push("/pricing")}
            retryLabel="Về bảng giá"
          />
        </Card>
      </PageShell>
    );
  }

  if (!product) {
    return (
      <PageShell title="Thanh toán" showBack backHref="/pricing" containerWidth="narrow">
        <Card padding="lg" variant="glass">
          <ErrorState
            title="Gói thanh toán không tồn tại"
            description="Gói bạn chọn không còn khả dụng. Vui lòng quay lại bảng giá để chọn gói khác."
            onRetry={() => router.push("/pricing")}
            retryLabel="Về bảng giá"
          />
        </Card>
      </PageShell>
    );
  }

  const selectedProduct = product;
  const moduleSlug = moduleToSlug(selectedProduct.module);
  const validVoucher = voucherStatus === "valid" ? voucherResult : null;
  const totalAmount = validVoucher ? validVoucher.finalAmount : selectedProduct.priceVnd;
  const appliedCode = validVoucher ? validVoucher.voucher.code : voucherCode.trim().toUpperCase();
  const profileName =
    searchParams.get("name") ||
    searchParams.get("fullName") ||
    user?.displayName ||
    "Khách hàng";
  const dob = searchParams.get("dob") || searchParams.get("dateOfBirth") || "Chưa có trong đường dẫn";
  const features =
    selectedProduct.module === "numerology" ? NUMEROLOGY_FEATURES : Array.from(selectedProduct.features);

  function clearVoucher() {
    setVoucherCode("");
    setVoucherStatus("idle");
    setVoucherResult(null);
    setVoucherError(null);
  }

  async function ensureSignedIn() {
    if (!user) return await signInWithGoogle();
    if (isAnonymous) return await linkAnonymousToGoogle();
    return true;
  }

  async function handleApplyVoucher() {
    const normalized = voucherCode.trim().toUpperCase();
    setCreateErrorState(null);
    if (!normalized) {
      clearVoucher();
      return;
    }
    setVoucherCode(normalized);
    setVoucherStatus("validating");
    setVoucherResult(null);
    setVoucherError(null);
    try {
      const signedIn = await ensureSignedIn();
      if (!signedIn) {
        setVoucherStatus("idle");
        return;
      }
      const data = await fetchWithAuth<VoucherValidateResponse>("/api/voucher/validate", {
        method: "POST",
        body: JSON.stringify({ code: normalized, productCode: selectedProduct.code }),
      });
      if (data.valid) {
        setVoucherResult({
          discountVnd: data.discountVnd,
          finalAmount: data.finalAmount,
          voucher: data.voucher,
        });
        setVoucherStatus("valid");
      } else {
        setVoucherError(data.error);
        setVoucherStatus("invalid");
      }
    } catch (err) {
      setVoucherError(isAppError(err) ? err : createError("NETWORK_ERROR"));
      setVoucherStatus("invalid");
    }
  }

  async function handleConfirm() {
    setCreating(true);
    setCreateErrorState(null);
    try {
      const signedIn = await ensureSignedIn();
      if (!signedIn) {
        setCreating(false);
        return;
      }
      const data = await fetchWithAuth<CreateResponse>("/api/payment/create", {
        method: "POST",
        body: JSON.stringify({
          productCode: selectedProduct.code,
          voucherCode: validVoucher ? appliedCode : undefined,
        }),
      });

      if (data.freeUnlock) {
        router.push(buildSuccessUrl(moduleSlug, searchParams, data));
        return;
      }

      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          orderId: data.orderId,
          qrCode: data.qrCode,
          checkoutUrl: data.checkoutUrl,
          amount: data.amount,
          productName: selectedProduct.name,
          productCode: selectedProduct.code,
          moduleSlug,
          voucherCode: data.voucherCode,
          discountVnd: data.discountVnd ?? 0,
          expiresAt: data.expiresAt,
        }),
      );
      router.push(`/payment/checkout?orderId=${encodeURIComponent(data.orderId)}`);
    } catch (err) {
      setCreateErrorState(isAppError(err) ? err : createError("PAYMENT_FAILED"));
    } finally {
      setCreating(false);
    }
  }

  return (
    <PageShell
      title="Xác nhận thanh toán"
      subtitle="Kiểm tra thông tin gói, áp dụng voucher nếu có, rồi tạo đơn thanh toán qua PayOS."
      showBack
      backHref={buildModulePath(selectedProduct.module, "")}
      backLabel="Quay lại"
      containerWidth="narrow"
    >
      <Card padding="lg" variant="glass">
        <div className="space-y-8">
          <section>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--bm-gold-bright)]">
              {selectedProduct.code}
            </p>
            <h2 className="mt-3 text-2xl">{selectedProduct.name}</h2>
            <p className="mt-3 text-[var(--bm-text-soft)]">{selectedProduct.description}</p>
            <div className="mt-5 grid gap-3 rounded-xl border border-[var(--bm-border-subtle)] bg-[var(--bm-bg-glass)] p-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-[var(--bm-text-muted)]">Hồ sơ</p>
                <p className="mt-1 break-words font-bold text-[var(--bm-text-main)]">{profileName}</p>
              </div>
              <div>
                <p className="text-[var(--bm-text-muted)]">Ngày sinh</p>
                <p className="mt-1 break-words font-bold text-[var(--bm-text-main)]">{dob}</p>
              </div>
            </div>
            <ul className="mt-5 space-y-3 text-sm text-[var(--bm-text-soft)]">
              {features.map((feature) => (
                <li className="flex items-start gap-3" key={feature}>
                  <span aria-hidden className="mt-0.5 text-[var(--bm-gold-bright)]">
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          <hr className="border-[var(--bm-border-subtle)]" />

          <section>
            <h3>Mã giảm giá</h3>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void handleApplyVoucher();
              }}
              className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]"
            >
              <input
                className="min-h-11 w-full rounded-lg border border-[var(--bm-border-subtle)] bg-[var(--bm-bg-glass)] px-4 text-[var(--bm-text-main)] outline-none transition focus:border-[var(--bm-border-purple)]"
                maxLength={64}
                onChange={(event) => {
                  setVoucherCode(event.target.value);
                  setVoucherStatus("idle");
                  setVoucherResult(null);
                  setVoucherError(null);
                }}
                placeholder="Nhập mã nếu có"
                value={voucherCode}
              />
              <Button
                disabled={voucherStatus === "validating"}
                loading={voucherStatus === "validating"}
                type="submit"
                variant="secondary"
              >
                Áp dụng
              </Button>
            </form>
            {validVoucher ? (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <StatusBadge tone="success">Đã áp dụng voucher {appliedCode}</StatusBadge>
                  <p className="text-sm text-[var(--bm-success-soft)]">
                    Giảm {formatPriceVnd(validVoucher.discountVnd)}
                  </p>
                </div>
                <Button onClick={clearVoucher} variant="ghost">
                  Bỏ voucher
                </Button>
              </div>
            ) : null}
            {voucherStatus === "invalid" && voucherError ? (
              <div className="mt-4">
                <StatusBadge tone="danger">{voucherError.message}</StatusBadge>
              </div>
            ) : null}
          </section>

          <hr className="border-[var(--bm-border-subtle)]" />

          <section className="space-y-4">
            <h3>Tổng cộng</h3>
            <PriceRow label="Giá gốc" value={formatPriceVnd(selectedProduct.priceVnd)} />
            {validVoucher ? (
              <PriceRow
                accent="success"
                label={`Giảm giá (${appliedCode})`}
                value={`-${formatPriceVnd(validVoucher.discountVnd)}`}
              />
            ) : null}
            <div className="border-t border-[var(--bm-border-subtle)] pt-4">
              <PriceRow accent="total" label="Cần thanh toán" value={formatPriceVnd(totalAmount)} />
            </div>
          </section>

          {createErrorState ? (
            <Card padding="md" variant="default">
              {isAuthError(createErrorState.code) ? (
                <UnauthorizedState
                  description={authErrorDescription(createErrorState.code)}
                  onLogin={() => router.push(loginReturnHref())}
                />
              ) : (
                <ErrorState
                  code={createErrorState.code}
                  requestId={createErrorState.requestId}
                  title="Không thể tạo đơn thanh toán"
                />
              )}
            </Card>
          ) : null}

          <Button fullWidth loading={creating} onClick={() => void handleConfirm()} size="lg">
            Thanh toán {formatPriceVnd(totalAmount)}
          </Button>
          <p className="text-sm leading-6 text-[var(--bm-text-muted)]">
            PayOS chỉ nhận số tiền do backend tính từ gói đã chọn và voucher hợp lệ. Trình duyệt không
            được tự tạo quyền truy cập hoặc tự gửi số tiền thanh toán.
          </p>
        </div>
      </Card>
    </PageShell>
  );
}

"use client";

import { type ErrorCode, getErrorMessage } from "@banmenh/shared";
import { Button } from "../Button";

type ErrorStateProps = {
  /**
   * Mã lỗi shared contract. Khi truyền mà không có `description`,
   * component tự dùng message tiếng Việt từ `ERROR_MESSAGES`.
   */
  code?: ErrorCode;
  title?: string;
  description?: string;
  /** Hiển thị nhỏ ở dưới để user copy khi liên hệ support. */
  requestId?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

const ERROR_TITLES: Partial<Record<ErrorCode, string>> = {
  AUTH_REQUIRED: "Cần đăng nhập",
  ["AUTH_INVALID_TOKEN"]: "Phiên đăng nhập hết hạn",
  AUTH_SESSION_EXPIRED: "Phiên đăng nhập hết hạn",
  FORBIDDEN: "Không có quyền truy cập",
  ENTITLEMENT_MISSING: "Chưa mở khóa nội dung",
  VALIDATION_FAILED: "Thông tin chưa hợp lệ",
  INPUT_REQUIRED: "Thiếu thông tin",
  INPUT_INVALID: "Thông tin chưa đúng định dạng",
  NOT_FOUND: "Không tìm thấy",
  ALREADY_EXISTS: "Nội dung đã tồn tại",
  PAYMENT_FAILED: "Thanh toán không thành công",
  PAYMENT_PENDING: "Đang chờ thanh toán",
  PAYMENT_EXPIRED: "Đơn thanh toán đã hết hạn",
  PAYMENT_AMOUNT_MISMATCH: "Số tiền thanh toán không khớp",
  VOUCHER_NOT_FOUND: "Không tìm thấy voucher",
  VOUCHER_EXPIRED: "Voucher đã hết hạn",
  VOUCHER_OUT_OF_USES: "Voucher đã hết lượt dùng",
  VOUCHER_NOT_APPLICABLE: "Voucher không áp dụng được",
  VOUCHER_ALREADY_USED: "Voucher đã được sử dụng",
  KB_ACCESS_DENIED: "Không thể truy cập dữ liệu",
  KB_NOT_AVAILABLE: "Báo cáo tạm chưa sẵn sàng",
  RATE_LIMITED: "Bạn thao tác quá nhanh",
  NETWORK_ERROR: "Kết nối mạng gián đoạn",
  TIMEOUT: "Kết nối chậm",
  INTERNAL_ERROR: "Có lỗi xảy ra",
  SERVICE_UNAVAILABLE: "Dịch vụ tạm gián đoạn",
};

function getErrorTitle(code?: ErrorCode, fallback = "Có lỗi xảy ra"): string {
  if (!code) return fallback;
  return ERROR_TITLES[code] ?? fallback;
}

export function ErrorState({
  code,
  title,
  description,
  requestId,
  onRetry,
  retryLabel = "Thử lại",
}: ErrorStateProps) {
  const resolvedTitle = title ?? getErrorTitle(code);
  const resolvedDescription =
    description ?? (code ? getErrorMessage(code) : "Vui lòng thử lại sau ít phút.");

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-10 text-center">
      <svg
        aria-hidden="true"
        className="size-12 text-[var(--bm-danger-soft)]"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 8v5m0 4h.01M10.3 4.7 2.9 18a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 4.7a2 2 0 0 0-3.4 0Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
      <h3 className="mt-4">{resolvedTitle}</h3>
      <p className="mt-3 text-[var(--bm-text-soft)]">{resolvedDescription}</p>
      {onRetry ? (
        <Button className="mt-6" onClick={onRetry} variant="secondary">
          {retryLabel}
        </Button>
      ) : null}
      {requestId ? (
        <p className="mt-5 text-xs text-[var(--bm-text-muted)]">
          Mã lỗi:{" "}
          <code className="font-mono text-[var(--bm-text-soft)]">
            {requestId}
          </code>
        </p>
      ) : null}
    </div>
  );
}

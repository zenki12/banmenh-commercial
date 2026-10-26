// Shared error contract — nguồn sự thật cho mọi error code và message tiếng
// Việt. Mọi nơi (frontend, API, worker) phải dùng contract này thay vì
// hardcode. Không expose stack trace, raw exception hay PII trong `message`.

export type ErrorCode =
  // Auth
  | "AUTH_REQUIRED"
  | "AUTH_INVALID_TOKEN"
  | "AUTH_SESSION_EXPIRED"
  // Permission / entitlement
  | "FORBIDDEN"
  | "ENTITLEMENT_MISSING"
  // Validation
  | "VALIDATION_FAILED"
  | "INPUT_REQUIRED"
  | "INPUT_INVALID"
  // Resource
  | "NOT_FOUND"
  | "ALREADY_EXISTS"
  // Payment
  | "PAYMENT_FAILED"
  | "PAYMENT_PENDING"
  | "PAYMENT_EXPIRED"
  | "PAYMENT_AMOUNT_MISMATCH"
  // Voucher
  | "VOUCHER_NOT_FOUND"
  | "VOUCHER_EXPIRED"
  | "VOUCHER_OUT_OF_USES"
  | "VOUCHER_NOT_APPLICABLE"
  | "VOUCHER_ALREADY_USED"
  | "VOUCHER_PER_USER_LIMIT_EXCEEDED"
  // KB
  | "KB_ACCESS_DENIED"
  | "KB_NOT_AVAILABLE"
  // Rate limit / network
  | "RATE_LIMITED"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  // Generic
  | "INTERNAL_ERROR"
  | "SERVICE_UNAVAILABLE";

/**
 * Metadata phụ trợ kèm theo lỗi. KHÔNG được chứa PII (họ tên, ngày sinh,
 * email, câu hỏi Tarot, raw stack trace). Chỉ dùng cho ID đơn hàng, mã
 * voucher, số nguyên context, ...
 */
export type AppErrorDetails = Record<string, string | number | boolean>;

export type AppError = {
  code: ErrorCode;
  /** Message tiếng Việt user-facing, không chứa stack hay PII. */
  message: string;
  /** Optional request id để hỗ trợ debug; không expose stack. */
  requestId?: string;
  details?: AppErrorDetails;
};

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  AUTH_REQUIRED: "Vui lòng đăng nhập để tiếp tục.",
  AUTH_INVALID_TOKEN:
    "Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại.",
  AUTH_SESSION_EXPIRED: "Phiên đăng nhập đã hết hạn.",
  FORBIDDEN: "Bạn không có quyền truy cập nội dung này.",
  ENTITLEMENT_MISSING:
    "Bạn chưa sở hữu gói này. Vui lòng kiểm tra lại đơn hàng.",
  VALIDATION_FAILED: "Thông tin nhập chưa hợp lệ, vui lòng kiểm tra lại.",
  INPUT_REQUIRED: "Vui lòng điền đủ thông tin bắt buộc.",
  INPUT_INVALID: "Định dạng thông tin chưa đúng.",
  NOT_FOUND: "Không tìm thấy nội dung yêu cầu.",
  ALREADY_EXISTS: "Mục này đã tồn tại.",
  PAYMENT_FAILED: "Thanh toán không thành công. Vui lòng thử lại.",
  PAYMENT_PENDING: "Đơn hàng đang chờ xác nhận thanh toán.",
  PAYMENT_EXPIRED: "Đơn hàng đã hết hạn. Vui lòng tạo đơn mới.",
  PAYMENT_AMOUNT_MISMATCH: "Số tiền thanh toán không khớp với đơn hàng.",
  VOUCHER_NOT_FOUND: "Mã voucher không tồn tại.",
  VOUCHER_EXPIRED: "Mã voucher đã hết hạn.",
  VOUCHER_OUT_OF_USES: "Mã voucher đã hết lượt sử dụng.",
  VOUCHER_NOT_APPLICABLE: "Mã voucher không áp dụng cho gói này.",
  VOUCHER_ALREADY_USED: "Bạn đã dùng mã này trước đó.",
  VOUCHER_PER_USER_LIMIT_EXCEEDED: "Bạn đã sử dụng hết lượt cho voucher này.",
  KB_ACCESS_DENIED: "Không thể truy cập kho dữ liệu, vui lòng thử lại.",
  KB_NOT_AVAILABLE: "Nội dung tạm thời chưa sẵn sàng.",
  RATE_LIMITED: "Bạn đang thao tác quá nhanh, vui lòng đợi một chút.",
  NETWORK_ERROR: "Kết nối mạng bị gián đoạn, vui lòng thử lại.",
  TIMEOUT: "Hệ thống phản hồi chậm, vui lòng thử lại.",
  INTERNAL_ERROR: "Có lỗi xảy ra ở hệ thống, chúng tôi đang xử lý.",
  SERVICE_UNAVAILABLE: "Dịch vụ tạm thời gián đoạn, vui lòng thử lại sau.",
};

export const TAROT_GOOGLE_AUTH_REQUIRED_MESSAGE =
  "Vui lòng đăng nhập bằng tài khoản Google để nhận 3 lượt trải bài miễn phí mỗi ngày.";

/** Trả về message tiếng Việt user-facing cho một `ErrorCode`. */
export function getErrorMessage(code: ErrorCode): string {
  return ERROR_MESSAGES[code];
}

export type CreateErrorOptions = {
  requestId?: string;
  details?: AppErrorDetails;
};

/**
 * Tạo `AppError` từ `code`. Nếu cần override message thì caller tự gán sau,
 * nhưng nguyên tắc chung là dùng message từ `ERROR_MESSAGES` để giữ thống
 * nhất giữa frontend, API và worker.
 */
export function createError(
  code: ErrorCode,
  options?: CreateErrorOptions,
): AppError {
  const error: AppError = {
    code,
    message: ERROR_MESSAGES[code],
  };
  if (options?.requestId !== undefined) {
    error.requestId = options.requestId;
  }
  if (options?.details !== undefined) {
    error.details = options.details;
  }
  return error;
}

/** Type guard kiểm tra một giá trị bất kỳ có phải `AppError` hợp lệ không. */
export function isAppError(value: unknown): value is AppError {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.code !== "string") return false;
  if (typeof candidate.message !== "string") return false;
  if (!(candidate.code in ERROR_MESSAGES)) return false;
  if (
    candidate.requestId !== undefined &&
    typeof candidate.requestId !== "string"
  ) {
    return false;
  }
  if (candidate.details !== undefined) {
    if (typeof candidate.details !== "object" || candidate.details === null) {
      return false;
    }
    for (const detailValue of Object.values(
      candidate.details as Record<string, unknown>,
    )) {
      const detailType = typeof detailValue;
      if (
        detailType !== "string" &&
        detailType !== "number" &&
        detailType !== "boolean"
      ) {
        return false;
      }
    }
  }
  return true;
}

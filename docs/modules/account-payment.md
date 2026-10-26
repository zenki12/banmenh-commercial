# Module: Account & Payment

## Purpose

Quản lý đăng nhập, entitlement, giao dịch PayOS, voucher và alert vận hành.

## Current Status

MVP core

## Scope

- Google login/account profile.
- PayOS order creation, QR, webhook, success state.
- Voucher fixed amount/percent/finalPrice theo rule được kiểm soát.
- Telegram alert cho payment/error/security event.
- Idempotency và audit log cho webhook.

## Out of Scope

- Không tự mở rộng ngoài TASK_REGISTRY.
- Không thêm payment/AI/storage mới nếu chưa có ADR hoặc task rõ.

## Data Model

- Sẽ được chi tiết trong `docs/product-specs/data-contract.md`.
- Mọi thay đổi data model phải cập nhật ADR nếu ảnh hưởng kiến trúc.

## API / Interface

- Frontend chỉ gọi API/module service đã định nghĩa.
- Không đọc trực tiếp KB/private storage từ client.

### Module-scoped payment URL pattern

- Numerology payment dùng module-scoped route:
  - Setup: `/than-so-hoc/payment`
  - Success: `/than-so-hoc/payment/success`
  - Cancel: `/than-so-hoc/payment/cancel`
- Legacy routes `/payment/setup`, `/payment/success`, `/payment/cancel` được giữ bằng wrapper/redirect để không làm gãy link cũ.
- Option C hybrid: UI payment dùng shared components (`PaymentSetup`, `PaymentSuccess`, `PaymentCancel`), còn route wrapper thuộc từng module để URL user-facing khớp hành trình sản phẩm.
- `/api/payment/create` vẫn là backend boundary tính amount từ `packages/shared/src/pricing.ts`; PayOS return/cancel URL được sinh từ `product.module`, không từ input amount/order URL phía client.
- Context hồ sơ dùng để quay lại báo cáo được giữ cục bộ xuyên suốt setup → checkout → success, không gửi PII này sang PayOS và không dùng nó để tính tiền/cấp quyền.
- Trạng thái payment thành công trên UI yêu cầu đồng thời purchase `confirmed` và entitlement đã được bảo đảm. `GET /api/payment/check` được phép self-heal entitlement theo purchase confirmed thuộc đúng user.
- Webhook phải cấp entitlement idempotent trước khi công bố purchase `confirmed`; webhook lặp lại trên đơn confirmed vẫn kiểm tra/cấp bù quyền thay vì thoát sớm.

## Dependencies

- Auth/account state.
- Payment/entitlement nếu module có nội dung trả phí.
- Logging/audit với các thao tác nhạy cảm.

## Acceptance Criteria

- Có UI/UX rõ theo module.
- Có test/smoke cho luồng chính.
- Không lộ secret/KB trong client/static asset.
- Cập nhật DEVLOG và RISK_REGISTER sau task liên quan.

## Risks

- Webhook giả mạo/replay.
- Thanh toán thành công nhưng không unlock.
- Voucher bị lạm dụng.
- Secret bị commit.

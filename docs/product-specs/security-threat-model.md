# Bản Mệnh V2 Security Threat Model

Ngày cập nhật: 2026-05-13

Mục tiêu: liệt kê rủi ro bảo mật/thương mại quan trọng trước khi rebuild để tránh lặp lại lỗi đã từng gặp.

## 1. Tài Sản Cần Bảo Vệ

- KB Thần số học private.
- KB Tarot private.
- Admin token.
- PayOS secret/webhook secret.
- User PII: họ tên, ngày sinh, email, câu hỏi Tarot.
- Entitlement/quyền đã mua.
- Voucher/promotions.
- Payment logs.

## 2. Rủi Ro P0

### P0.1 KB private bị public trong static build

Rủi ro:

- Đối thủ tải toàn bộ KB.
- Mất lợi thế thương mại.

Kiểm soát:

- KB chỉ nằm trong Worker/KV/private storage.
- Static artifact scan trước deploy.
- `/api/kb/*` no auth trả `401`.
- Không đặt file `*_knowledge_base.json` trong web public.

### P0.2 Fake entitlement từ frontend

Rủi ro:

- User tự sửa localStorage hoặc gọi API sai để unlock.

Kiểm soát:

- Entitlement chỉ tạo từ backend sau payment confirmed.
- Mọi unlock check qua backend.
- Frontend chỉ hiển thị theo response backend.

### P0.3 Webhook replay tạo quyền trùng

Rủi ro:

- Một payment sinh nhiều entitlement.

Kiểm soát:

- `orderId` unique.
- `purchaseId` unique trong entitlement.
- Webhook idempotent.
- Nếu order confirmed rồi, webhook lặp trả ok nhưng không tạo quyền mới.

### P0.4 Secret/token bị commit

Rủi ro:

- Bị chiếm admin/payment.

Kiểm soát:

- Secret scan trước commit/deploy.
- Token thật lưu ngoài repo.
- Rotate token nếu nghi lộ.
- File hướng dẫn chỉ có placeholder.

## 3. Rủi Ro P1

### P1.1 Voucher abuse

Rủi ro:

- Khách dùng mã test/giảm sâu ngoài ý muốn.

Kiểm soát:

- `active`, `startsAt`, `expiresAt`.
- `maxUses`, `perUserLimit`.
- Admin log khi tạo/sửa/tắt voucher.
- Telegram alert với voucher giảm sâu.

### P1.2 Payment amount mismatch

Rủi ro:

- User trả ít hơn giá thật nhưng vẫn unlock.

Kiểm soát:

- Backend tự tính giá từ productCode + voucher.
- Webhook check amount expected.
- Không nhận amount từ frontend làm nguồn sự thật.

### P1.3 Admin API brute force

Rủi ro:

- Dò token admin.

Kiểm soát:

- Token dài, random.
- Rate limit admin endpoint.
- CORS Origin allowlist.
- Alert khi nhiều request 401.

### P1.4 Log chứa PII

Rủi ro:

- Lộ họ tên/ngày sinh/câu hỏi cá nhân qua log.

Kiểm soát:

- Log hash hoặc id thay vì raw input.
- Redact email/token/phone.
- Chỉ log nội dung cần debug.

### P1.5 AI provider data exposure

Rủi ro:

- Nếu gửi câu hỏi/user data sang AI provider mà không nói rõ trong Privacy.

Kiểm soát:

- Privacy/Terms và UI phải nói rõ “AI hỗ trợ diễn giải” và loại dữ liệu được gửi sang nhà cung cấp.
- Chỉ gửi dữ liệu tối thiểu của phiên Tarot; không gửi payment data, credential, token hoặc admin secret.
- Không log raw prompt, câu hỏi, họ tên, ngày sinh, giới tính hoặc raw provider response.
- Không claim “Không AI” khi backend có gọi AI.

### P1.6 AI API abuse, prompt injection và chi phí vượt kiểm soát

Rủi ro:

- Bot hoặc user lạm dụng endpoint làm phát sinh chi phí Gemini.
- Câu hỏi chứa chỉ dẫn nhằm ghi đè system prompt hoặc ép model sinh nội dung nguy hiểm.
- Provider timeout/output sai cấu trúc làm hỏng flow kết quả.

Kiểm soát:

- Luận giải và quota Tarot từ chối guest Anonymous; 3 lượt miễn phí/ngày gắn với UID của tài khoản đăng nhập, kết hợp rate limit theo user và IP.
- Zod validate request/output; câu hỏi tối đa 200 ký tự, spread MVP chỉ 1/3 lá.
- Prompt đánh dấu dữ liệu user là untrusted và yêu cầu bỏ qua instruction nằm trong dữ liệu đó.
- Safety settings, content-safety prompt và bypass AI cho câu hỏi có tín hiệu tự hại/hại người tức thời.
- Timeout tối đa 20 giây và fallback template HTTP 200.
- Theo dõi usage/cost, tách key dev/prod và cấu hình billing alert trước production.

### P1.7 Tarot combo test mode hoặc private KB bị lộ

Rủi ro:

- Client tải trực tiếp raw index/detail 1.544 combo hoặc endpoint thư viện cho phép bulk scraping KB thương mại.
- Kẻ tấn công bật chế độ ép combo trên production khiến nội dung kiểm thử bị hiểu là kết quả thật.

Kiểm soát:

- Luồng kết quả chỉ nhận tối đa ba combo đã khớp. Luồng từ điển chỉ nhận metadata tối đa 15 combo/trang và lazy-load đúng một detail/lần; không nhận raw index, `detail_file`, đường dẫn R2 hay bulk detail dump.
- Firebase Auth, rate limit, Zod input/output, timeout proxy và fallback không gây crash.
- Không log họ tên, câu hỏi hoặc danh sách raw của phiên; lỗi chỉ ghi mã/ngữ cảnh chung.
- Test mode được gate ở cả Next route và Worker, gắn nhãn rõ trong UI, tắt tại production và chặn hostname production ngay cả khi cấu hình nhầm.
- Static artifact scan phải xác nhận không có `combo_index.json`, `combos/details` hoặc đường dẫn KB canonical; chấp nhận rủi ro còn lại là nội dung đã được phục vụ hợp lệ có thể bị thu thập chậm theo thời gian và theo dõi bằng quota/telemetry.

## 4. Rủi Ro P2

- UI lỗi encoding làm mất niềm tin thương mại.
- QR hết hạn không hướng dẫn tạo lại.
- Telegram alert fail im lặng.
- Mobile CTA bị che.
- Footer/header lệch giữa các module.

## 5. Security Smoke Test Bắt Buộc

```text
[ ] Không có secret/token trong git diff
[ ] Không có KB private trong static artifact
[ ] /api/kb/* no auth = 401
[ ] Admin API no token = 401
[ ] Voucher disabled trả thông báo đúng
[ ] Payment webhook replay không tạo entitlement trùng
[ ] Payment amount mismatch không unlock
[ ] QR expired không unlock
[ ] Telegram test alert pass
```

## 6. Quy Tắc Với Multi-Agent

- Codex là người sửa code/deploy chính.
- Claude chỉ QC/audit, không giữ secret, không deploy.
- Không agent nào được tự thêm dependency lớn nếu chưa có lý do.
- Không agent nào được public KB ra frontend để “test nhanh”.
- Mọi audit finding P0/P1 phải xử lý trước production deploy.


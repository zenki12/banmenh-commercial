# RISK_REGISTER - Bản Mệnh V2

## 1. Cách dùng

- Mỗi rủi ro phải có owner, mức độ, trạng thái và hành động giảm thiểu.
- Khi task liên quan đến security/payment/KB xong, phải cập nhật file này.
- Không đóng rủi ro nếu chưa có bằng chứng kiểm tra.

## 2. Risk Dashboard

| ID | Risk | Area | Severity | Status | Owner | Mitigation |
|---|---|---|---|---|---|---|
| R-001 | KB thần số học bị public trong bundle/static asset | KB/Security | Critical | Open | Codex/User | Chỉ lưu KB private backend, smoke test URL public |
| R-002 | Secret/admin token bị commit vào repo | Security | Critical | Open | User/Codex | Secret scanning, không ghi secret vào docs, dùng env/secret store |
| R-003 | Thanh toán thành công nhưng không unlock entitlement | Payment | High | Open | Codex | Idempotent webhook, verify amount/order/user/module |
| R-004 | Webhook bị replay hoặc giả mạo | Payment/Security | High | Open | Codex | Verify checksum, order status, amount, idempotency |
| R-005 | V2 vô tình phụ thuộc/copy lại code hoặc hạ tầng ngoài scope | Architecture/Process | High | Open | Codex/User | V2 dùng project, DB/storage, worker và payment boundary mới; không copy code/hạ tầng ngoài scope |
| R-006 | Nội dung Tarot nói quá claim hoặc gây hiểu nhầm | Legal/Content | Medium | Open | User/Claude | Content guideline, disclaimer, không cam kết chắc chắn |
| R-007 | Voucher test/campaign bị lạm dụng | Payment | Medium | Open | User/Codex | maxUses, perUserLimit, expiresAt, audit log |
| R-008 | Agent code vượt scope gây phình app/tech debt | Process | High | Open | Codex/Claude | TASK_REGISTRY, review diff, no task no code |
| R-009 | Dev/Test dùng nhầm production key | Environment | High | Open | User/Codex | ENVIRONMENT rõ ràng, prefix env, deploy checklist |
| R-010 | PII người dùng lưu/log quá mức cần thiết | Privacy | High | Open | Codex | Data minimization, mask logs, retention policy |
| R-011 | Import KB/design sai cách làm lộ tài sản lõi | KB/Security | Critical | Open | Codex/User | KB chỉ import vào private storage/API layer; design asset kiểm tra license/quyền dùng trước khi đưa vào repo |
| R-012 | Copy nhầm logic/workflow V1 khi chỉ được lấy visual/KB | Process/Architecture | High | Open | Codex/Claude | Design extraction spec và KB extraction plan phải được dùng trước khi code; review diff không cho copy app logic cũ |
| R-013 | Dùng workflow/asset Tarot tham chiếu vượt quá quyền cho phép | Legal/Content | High | Open | User/Claude | Mystery Tarot/TAROT-vibe chỉ là workflow reference; asset/code/branding cần license rõ trước khi dùng |
| R-014 | Công thức numerology V2 có thể lệch V1 ngoài 3 challenge indicators đã fix | Numerology/KB | Medium | Open | Codex/Claude | Audit toàn bộ formula report.ts/indicators.ts với V1 engine.browser.js; thêm regression tests theo từng nhóm chỉ số |

| R-015 | API thiếu rate limit cơ bản dẫn tới spam auth/payment/admin/report | Security/API | Medium | Done | Codex | T-0606n-4 thêm in-memory rate limit: KB report 60/phút, payment create 10/phút, auth session 10/phút, admin voucher 20/phút |
| R-016 | Worker trả CORS quá rộng hoặc thiếu allowlist origin | Security/Worker | Medium | Done | Codex | T-0606n-1 thêm CORS allowlist cho KB/Payment Worker với localhost, dev/prod domain và `CORS_ALLOWED_ORIGINS` |
| R-017 | Firestore rules/indexes chưa được deploy trước production | Security/Data | High | Pending | User/Codex | Cần Firebase CLI login và deploy `firestore:rules,firestore:indexes`; không nằm trong T-0606n |
| R-018 | Gemini nhận dữ liệu phiên Tarot hoặc bị prompt injection/API abuse | AI/Privacy/Security | High | Mitigated | User/Codex | ADR-009; disclosure Privacy/Terms; auth Anonymous; Zod; quota user/IP; timeout; không log raw PII; safety prompt; fallback template |
| R-019 | Chi phí/latency Gemini vượt ngưỡng vận hành | AI/Operations | High | Open | User/Codex | Tách key dev/prod, giới hạn prompt/output, quota 5 lượt/10 phút/user, billing alert và theo dõi usage trước production |
| R-020 | Local history chứa câu hỏi Tarot nhạy cảm và có thể bị người dùng chung thiết bị xem | Privacy/Tarot | High | Mitigated | User/Codex | Chỉ lưu tối đa 15 phiên trên browser; không lưu profile/token/payment; disclosure rõ không cloud sync; có xóa từng phiên/toàn bộ; Zod + try/catch storage |
| R-021 | Chế độ ép combo Tarot bị bật nhầm trên production hoặc bị lợi dụng như kết quả thật | Tarot/Security | High | Mitigated | User/Codex | Chỉ nhận trigger `Turniodev`; gate theo môi trường ở cả Next.js và Worker; chặn hostname production; gắn nhãn “Chế độ kiểm thử”; production flag luôn false |
| R-022 | Thư viện combo bị bulk scrape dù KB không nằm trong static bundle | Tarot/KB/Security | High | Mitigated | User/Codex | Firebase Auth; quota user/IP; metadata 15 mục/trang; detail lazy-load từng combo; Zod/ID allowlist; không trả raw index/path; theo dõi traffic và siết quota/WAF trước production |
| R-023 | Khách có thể xóa phiên Anonymous để né quota Tarot 3 lượt/ngày | Tarot/Abuse | Medium | Open | User/Codex | Firestore transaction chặn vượt quota theo UID; trước production bổ sung Firebase App Check và rate limit/WAF theo IP/device ở edge |

## 3. Review cadence

- Review nhanh sau mỗi task có thay đổi code.
- Review đầy đủ cuối mỗi phase.
- Review bắt buộc trước production deploy.

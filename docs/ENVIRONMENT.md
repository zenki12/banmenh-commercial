# ENVIRONMENT - Bản Mệnh V2

## 1. Nguyên tắc

- Không commit secret thật vào repo.
- Dev/Test và Production phải dùng biến môi trường, storage, payment config riêng.
- Mọi thay đổi môi trường phải cập nhật file này và DEVLOG.
- Nếu đổi domain, worker, database, bucket, webhook hoặc secret name thì phải tạo ADR nếu ảnh hưởng kiến trúc.

## 2. Môi trường

| Environment | URL | Mục đích | Ghi chú |
|---|---|---|---|
| Local | http://localhost:[port] | Dev nhanh trên máy | Port theo app thực tế |
| Dev/Test | https://dev.banmenh.online | Test trước khi go-live | Domain đã Active; hiện cần tách sang project dev riêng khi có code/build V2 |
| Production | https://banmenh.online | Khách thật | Chỉ deploy sau checklist |

## 3. Dịch vụ bên ngoài

| Service | Dev/Test | Production | Ghi chú |
|---|---|---|---|
| Cloudflare Pages/Workers | Chưa tạo project riêng; dự kiến `banmenh-v2-dev` | Chưa tạo project V2 production riêng | V2 phải dùng project mới hoàn toàn |
| Firestore/Firebase | Chưa có | Chưa có | Sẽ tạo sau khi chốt data model/auth; ưu tiên tách dev/prod hoặc namespace rõ ràng |
| Cloudflare KV/R2 | Chưa có | Chưa có | Chốt hướng: dùng R2 cho KB/file JSON lớn; dùng KV cho config nhỏ/cache/manifest; không để KB trong frontend/static asset |
| PayOS | Sandbox/Test config | Live config | Không dùng live key ở dev |
| Telegram Bot | Test chat | Production alert chat | Có test-alert endpoint |

## 4. Biến môi trường bắt buộc

| Variable | Scope | Secret? | Mô tả |
|---|---|---:|---|
| `NEXT_PUBLIC_APP_URL` | Frontend | No | URL app theo môi trường |
| `GOOGLE_CLIENT_ID` | Auth | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Auth | Yes | Google OAuth secret |
| `FIREBASE_PROJECT_ID` | Backend | Yes | Firebase project |
| `FIREBASE_CLIENT_EMAIL` | Backend | Yes | Service account email |
| `FIREBASE_PRIVATE_KEY` | Backend | Yes | Service account private key |
| `PAYOS_CLIENT_ID` | Payment | Yes | PayOS client ID |
| `PAYOS_API_KEY` | Payment | Yes | PayOS API key |
| `PAYOS_CHECKSUM_KEY` | Payment | Yes | PayOS checksum/webhook key |
| `ADMIN_TOKEN` | Admin API | Yes | Token cho thao tác admin |
| `TELEGRAM_BOT_TOKEN` | Alert | Yes | Bot token |
| `TELEGRAM_CHAT_ID` | Alert | Yes | Chat nhận alert |
| `KB_STORAGE_BUCKET` | KB | Yes/No | Tên bucket/private storage |
| `GEMINI_API_KEY` | Next.js server | Yes | Khóa gọi Gemini cho luận giải Tarot; tuyệt đối không dùng prefix `NEXT_PUBLIC_` |
| `TAROT_COMBO_TEST_MODE` | Next.js server + KB Worker | No | Feature flag ép combo khi hồ sơ là `Turniodev`; chỉ bật ở local/dev test, luôn tắt ở production |

`.env.example` dùng `https://banmenh.online` làm giá trị production mẫu cho `NEXT_PUBLIC_APP_URL`; local/dev phải override bằng URL đúng môi trường. Ba biến PayOS là bắt buộc ở backend và không được dùng prefix `NEXT_PUBLIC_`.

### Gemini AI

- Dev/Test và Production phải dùng khóa Gemini riêng, có quota/billing alert riêng.
- Chỉ Route Handler server-side được đọc `GEMINI_API_KEY`; không ghi khóa vào client bundle, log, docs hoặc error response.
- API Tarot áp dụng Firebase Auth, rate limit theo user/IP, timeout tối đa 20 giây và fallback KB/template.
- Không deploy production nếu Privacy/Terms chưa công bố việc gửi dữ liệu phiên Tarot tới nhà cung cấp AI.

### Tarot Combo Test Mode

- Local development tự cho phép hồ sơ `Turniodev` kích hoạt một combo mẫu ngẫu nhiên; dev/test build cần đặt `TAROT_COMBO_TEST_MODE=true` ở cả Next.js và KB Worker.
- Production phải đặt `TAROT_COMBO_TEST_MODE=false`. Route Next.js từ chối test mode trên hostname `banmenh.online` và `www.banmenh.online` ngay cả khi cấu hình nhầm.
- Cờ kiểm thử chỉ thay đổi dữ liệu khối cộng hưởng, không thay đổi các lá đã rút, lịch sử hay nội dung Gemini.

## 5. Quy tắc deploy

1. Code phải pass test/smoke ở local hoặc dev/test.
2. Không deploy production nếu còn secret trong file docs/code.
3. Payment phải test đủ: tạo đơn, QR, webhook, unlock, hết hạn, sai amount, retry.
4. KB thần số học phải xác nhận không nằm trong static asset public.
5. Sau deploy phải cập nhật DEVLOG.

## 6. Thông tin còn thiếu cho V2

Đã biết:

- Dev/Test domain: `https://dev.banmenh.online`
- V2 là rebuild độc lập, dùng hạ tầng mới.

Còn thiếu:

- Tên Cloudflare Pages project dev/test mới, dự kiến `banmenh-v2-dev`.
- Tên Cloudflare Pages project production V2 mới.
- Tên Workers dev/prod cho payment, KB và admin API.
- Firebase/Firestore project ID cho từng môi trường, nếu dùng Firebase/Firestore.
- R2 bucket cho KB Thần số học và KB Tarot.
- KV namespace cho config/cache/manifest.
- Quy trình rollback/gắn domain production cho V2.


## 7. Ghi chú hiện trạng 2026-05-14

- `dev.banmenh.online` đã Active và có SSL trong Cloudflare.
- Trước khi dùng `dev.banmenh.online` cho V2, phải gắn domain này vào project V2 dev/test riêng.
- Chưa tạo Firebase/Firestore.
- Chưa tạo KV/R2 cho KB thần số học.
- Chưa có codebase Bản Mệnh V2 chính thức được duyệt để build/deploy.
- Project root chính thức: `E:\Project\Project\banmenh`.
- Docs source of truth: `E:\Project\Project\banmenh\docs`.
- Mọi code/scaffold/build chỉ được tính là chính thức khi có task trong `TASK_REGISTRY.md` và entry trong `DEVLOG.md`.
- CI/CD sẽ bắt đầu bằng deploy thủ công để giảm rủi ro; có thể chuyển sang GitHub auto deploy sau khi secrets được đưa hoàn toàn vào ENV/secret store và có checklist chống commit nhầm.


## 8. Quy ước độc lập hạ tầng V2

- Các project/hạ tầng đã có không thuộc scope triển khai Bản Mệnh V2.
- Domain production chỉ được gắn sang V2 sau khi V2 pass dev/test và user approve.
- Không rebuild, không refactor, không deploy Bản Mệnh V2 vào project đã có.
- Dev/Test của Bản Mệnh V2 phải dùng project mới riêng, dự kiến `banmenh-v2-dev`.
- Production của Bản Mệnh V2 phải là project/hạ tầng mới; chỉ gắn domain production sau khi có kế hoạch rõ và user approve.

## 9. Quy ước storage đã chốt

- Firestore: user, payment, entitlement, report metadata, voucher usage, audit/payment logs.
- R2: KB thần số học, file JSON lớn, nội dung hệ thống ít thay đổi, file/PDF nếu có.
- KV: config nhỏ, cache, manifest version, feature flags nhẹ.
- Frontend không được đọc trực tiếp KB private; mọi truy cập KB phải đi qua API/Worker có kiểm tra quyền.


## 10. Input đã có cho V2

- File thiết kế giao diện: đã có, cần user cung cấp đường dẫn khi bắt đầu UI implementation.
- KB Thần số học: đã có, phải import vào private storage/API layer, không đưa vào frontend/static asset.
- KB Tarot: đã có, sẽ dùng cho module Tarot rebuild, chỉ dùng KB do user cung cấp.

## 11. Deployment History

### 2026-10-23 22:44 +07 — Production

- Commit: `d0c5d7f`
- Vercel deployment: `dpl_9Hx2mekgf7WpjzmLzqXiV29Fz7ss`
- URL: `https://banmenh-commercial-erigz3oca-zenkis-projects-f69ce370.vercel.app`
- Production alias: `https://banmenh.online`
- Status: `Ready`
- Rollback deployment: `dpl_5XVyx5J3DkerooVbL9KvqmQBtBYN`
- Known gap: production còn thiếu các biến `PAYOS_*`, `ADMIN_TOKEN`, Telegram và `KB_WORKER_URL`; chưa nghiệm thu payment/admin/alert.

### 2026-10-26 20:21 +07 — Production KB restored

- KB Worker: `https://banmenh-kb-prod.numerology-thai.workers.dev`.
- KV production chứa private keys `kb-numerology` và `kb-narrative`; raw JSON không nằm trong Git/static artifact.
- R2 production: `banmenh-tarot-kb-prod`.
- Vercel Production đã cấu hình `KB_WORKER_URL` và redeploy artifact hiện hành tại `dpl_B8SMajbRSxWa4Ypofa8o59NnwhMv`.
- Production report smoke trả `kbVersion: 1.0`, đủ 31 section và dữ liệu luận giải thay vì `local-dev-fallback`.

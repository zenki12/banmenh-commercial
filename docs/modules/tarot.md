# Module: Tarot

## Purpose

Tạo trải nghiệm Tarot có workflow rõ: daily message, chọn chủ đề, chọn spread, rút bài, đọc ý nghĩa, xem cộng hưởng và lưu lịch sử.

## Current Status

Spec ready for MVP planning

## Scope

### MVP

- Landing `/tarot`.
- Daily message popup/card.
- Bắt đầu hành trình tra cứu.
- Chọn chủ đề/câu hỏi.
- Spread 1 lá và 3 lá.
- Rút bài/flip/reveal.
- Kết quả chuyên sâu do Gemini hỗ trợ theo ADR-009; KB + template engine là fallback bắt buộc.
- Sách phép Tarot/dictionary 78 lá.
- Local history tối đa 15 phiên trên trình duyệt, có xem lại và xóa từng phiên/toàn bộ; không đồng bộ cloud trong MVP.
- Credit display.

### P1

- Combo/cộng hưởng (T-0716 đã triển khai: match private KB 2-5 lá, đúng ngách/chiều, tối đa ba combo ưu tiên độ đặc hiệu cao).
- Thư viện `Mật Mã Cộng Hưởng` (T-0717 đã triển khai: tra cứu 1.544 combo theo trang 15 mục, lọc/tìm kiếm và lazy-load chi tiết 5 lĩnh vực → ngách → Xuôi/Ngược).
- Clarify questions.
- Top topics.
- Spread 5/7.
- Cloud history nếu có auth.
- Guide/Master entitlement nếu chốt pricing.

### P2

- Spread 10/12.
- Manual reading.
- Mở rộng AI ngoài phạm vi luận giải đã duyệt trong ADR-009.
- Streak/share/advanced analytics.

## Out of Scope

- Không clone code/asset/endpoint/branding của Mystery Tarot/TAROT-vibe.
- Không gọi Gemini trực tiếp từ frontend và không mở rộng AI ngoài ADR-009/T-0709.
- Spread 5/7/10/12 chỉ được mở sau khi luồng 1/3 lá ổn định và phải gate bằng entitlement Tarot ở cả UI lẫn API.
- Không thêm payment/AI/storage mới nếu chưa có ADR hoặc task rõ.

## Data Model

- KB canonical: `E:\huyen hoc AI\test\kb\commercial\tarot_kb`.
- Entry points: cards, daily, taxonomy, clarify, combo index, combo details, assets.
- Data contract chi tiết sẽ nằm trong `docs/product-specs/data-contract.md` khi implement API.

## API / Interface

- Frontend chỉ gọi API/module service đã định nghĩa.
- Không đọc trực tiếp KB/private storage từ client.
- API Tarot kiểm tra quota/entitlement server-side.
- Combo details/premium reading không public raw dump.
- `POST /api/tarot/combo` yêu cầu Firebase Auth, Zod và rate limit; Next/Worker chỉ trả các combo đã khớp, không trả index 1.544 combo.
- `GET /api/tarot/combos` chỉ trả metadata phân trang tối đa 15 mục; `GET /api/tarot/combos/:comboId` lazy-load đúng một detail. Cả hai yêu cầu Firebase Auth, Zod và rate limit, không trả raw file/path KB.

## Dependencies

- Account/auth state nếu cloud history hoặc paid tier.
- Payment/entitlement cho Guide/Master.
- Logging/audit cho reading, quota, payment-sensitive actions.
- Content quality guideline cho claim và disclaimer.

## Acceptance Criteria

- UI/UX bám workflow trong `docs/product-specs/tarot-workflow-reference.md`.
- Có test/smoke cho daily, reading 1/3 lá, dictionary.
- Không lộ secret/KB trong client/static asset.
- Có credit display theo `CREDITS.md`.
- Có disclaimer rõ cho Tarot.
- Cập nhật DEVLOG và RISK_REGISTER sau task liên quan.

## Risks

- Nội dung Tarot claim quá mức hoặc thiếu disclaimer.
- KB/asset có yêu cầu credit/licensing.
- Upsell quá sớm làm lệch journey.
- History chứa câu hỏi nhạy cảm.
- Spread 5/7/10/12 có thể làm app phình; giữ chung workflow, không nhân bản component và luôn kiểm tra entitlement server-side.

## V2 Workflow Reference

- Target UX tham chiếu: `https://www.mystery-tarot.net/`.
- Chi tiết workflow: `docs/product-specs/tarot-workflow-reference.md`.
- Rebuild mới bằng code/hạ tầng/branding Bản Mệnh V2.

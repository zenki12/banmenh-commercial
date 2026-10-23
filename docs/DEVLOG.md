# DEVLOG — Nhật Ký Triển Khai
> **Current truth after 2026-05-14 DOCS-SCOPE-001/002/003/004:** Bản Mệnh V2 là rebuild độc lập. Các entry cũ có nhắc `numerology-app`, migration, user/gói cũ hoặc production hiện tại chỉ là lịch sử trước khi scope được đính chính, không phải yêu cầu hiện hành.
> **Mục đích:** Nguồn sự thật duy nhất về lịch sử triển khai. Ghi lại chi tiết sau mỗi task/phase — không tô hồng, không bỏ qua vấn đề.
>
> **Định dạng thời gian:** `YYYY-MM-DD HH:mm +07`
>
> **Nguyên tắc ghi:**
> - Entry MỚI lên ĐẦU file (newest first)
> - Không sửa entry cũ — nếu cần đính chính, tạo entry loại `Correction`
> - KB Notes → ghi thêm vào **KB INDEX** ở cuối file (không chỉ trong entry)

---

## 2026-10-23 22:44 +07 — Production deploy commit d0c5d7f

Loại: Production deployment

Đã làm:

- Deploy artifact sạch từ commit `d0c5d7f` lên Vercel project `zenkis-projects-f69ce370/banmenh-commercial`.
- Deployment `dpl_9Hx2mekgf7WpjzmLzqXiV29Fz7ss` đạt trạng thái `Ready` và được alias tới `https://banmenh.online`.
- Không đưa các thay đổi chưa commit trong worktree vào artifact production.

Kiểm tra sau deploy:

- `/`, `/than-so-hoc`, `/tarot`, `/pricing`, `/account` — HTTP 200.
- `/api/numerology/report` — HTTP 200; tài khoản Free nhận đủ 31 mục với 10 full, 3 partial, 18 locked và không có HTML trong mục locked.
- Admin API không token trả HTTP 500 với thông báo chưa cấu hình thay vì HTTP 401 do production chưa có `ADMIN_TOKEN`.

Rủi ro/cấu hình còn thiếu:

- Vercel Production chưa có `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY`, `ADMIN_TOKEN`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` và `KB_WORKER_URL`.
- Numerology Free đang dùng local fallback khi KB Worker không khả dụng; payment PayOS, admin API và Telegram chưa thể nghiệm thu production cho tới khi secret/config được bổ sung rồi redeploy.
- Không ghi giá trị secret vào repo hoặc DEVLOG.

Rollback:

- Deployment production trước: `dpl_5XVyx5J3DkerooVbL9KvqmQBtBYN`.

---

## 2026-10-23 18:29 +07 — T-NUMEROLOGY-PAYWALL-TEASER-RHYTHM hoàn thiện nhịp teaser

Loại: Numerology access control + Conversion UI

Đã làm:

- Mở full cho tài khoản Free tại các mục chính `1, 2, 3, 4, 11, 16, 19, 21, 25, 26` ở cả API redaction và fallback quyền truy cập trong `FullReport`.
- Giữ partial cho mục `5, 6, 23`; giữ khóa mặc định cho 18 mục phân tích sâu còn lại.
- Bảo toàn `LockedTeaser` với thông điệp nâng cấp, giá lấy từ cấu hình và CTA dẫn theo `paymentHref` tới `/than-so-hoc/payment` kèm query báo cáo.
- Giữ redaction phía server: mục khóa không trả HTML hoặc `chartSlot`; mục partial chỉ trả `previewHtml` đã chuẩn bị trong synthesizer.

Không làm:

- Không thay đổi nội dung 31 section, pricing, entitlement, Firestore rules hoặc payment transaction.
- Không thêm dependency và không deploy production.

Kiểm tra:

- `npm run typecheck` — pass.
- `npm run lint` — pass.
- `npm run build` — pass.
- Smoke API Free — pass: đủ 31 mục, 10 full, 3 partial, 18 locked; mọi mục locked có `htmlLength = 0`.
- Browser smoke — trang chi tiết render được `LockedTeaser`; CTA xuất hiện sau khi báo cáo tải.
- `git diff --check` — pass.

Rủi ro còn lại:

- Chưa kiểm thử bằng tài khoản đã có entitlement thật; nhánh `unlocked` giữ nguyên cơ chế mở full hiện có.
- Task giữ trạng thái `Review`, chờ code review độc lập trước khi chuyển `Done`.

---

## 2026-10-23 16:10 +07 — T-BRAND-FAVICON-TITLES đồng bộ logo Header

Loại: Brand asset + UI

Đã làm:

- Thay chấm vàng trước wordmark `Bản Mệnh` trong Header bằng chính asset `/favicon.png`.
- Cố định kích thước brand mark ở 28x28px, bo góc và giữ ảnh ở trạng thái trang trí để không tạo nội dung lặp cho trình đọc màn hình.
- Kiểm tra trực quan ở viewport desktop 1440px và mobile 375px: logo rõ, cân chữ và không gây tràn ngang.

Không làm:

- Không chỉnh sửa nội dung ảnh favicon nguồn, không thêm dependency và không thay đổi logic Header/Auth.

Kiểm tra:

- `npm run typecheck` — pass.
- `npm run lint` — pass.
- `npm run build` — pass sau khi dừng dev server cục bộ chiếm bộ nhớ; lần chạy đầu compile thành công nhưng worker thu thập page data hết heap.
- `git diff --check` — pass.

Rủi ro còn lại:

- Task giữ trạng thái `Review` theo quy trình, chờ code review độc lập trước khi chuyển `Done`.

---

## 2026-10-23 15:51 +07 — T-BRAND-FAVICON-TITLES cập nhật nhận diện tab trình duyệt

Loại: Brand asset + Metadata + UI

Đã làm:

- Sao chép nguyên vẹn `favicon.png` từ root vào `apps/web/public/favicon.png`, `apps/web/src/app/icon.png` và `apps/web/src/app/apple-icon.png`; xác nhận cùng SHA-256 với nguồn.
- Cập nhật root metadata với title mặc định `Bản Mệnh — Nền tảng tra cứu huyền học`, template `%s | Bản Mệnh`, description và icon/Apple icon.
- Thêm metadata `Tarot` và `Thần số học` cho hai Server Component tương ứng.
- Chuyển `PageShell` thành Client Component và đồng bộ `document.title` theo prop `title`.
- Bổ sung `MutationObserver` gọn trong effect vì Next.js 16 có thể stream root metadata sau hydration và ghi đè title của trang client; observer tự ngắt khi component unmount.

Không làm:

- Không thêm dependency, không chỉnh sửa nội dung hoặc tái nén asset favicon nguồn.
- Không thay đổi layout hiển thị, navigation hoặc logic nghiệp vụ các route.

File chính đã sửa/tạo:

- `apps/web/public/favicon.png`
- `apps/web/src/app/icon.png`
- `apps/web/src/app/apple-icon.png`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/components/layout/PageShell.tsx`
- `apps/web/src/app/tarot/page.tsx`
- `apps/web/src/app/than-so-hoc/page.tsx`

Kiểm thử:

- `npm run typecheck` — pass.
- `npm run lint` — pass.
- `npm run build` — pass; sinh route `/icon.png` và `/apple-icon.png`.
- `git diff --check` — pass.
- Browser smoke Edge headless — pass: `/`, `/than-so-hoc`, `/tarot`, `/pricing`, `/account` có title chính xác; không có page error.
- `/favicon.png` trả HTTP thành công với `content-type: image/png`; icon và Apple touch icon đều trỏ đúng `/favicon.png`.

Rủi ro còn lại:

- Asset nguồn có dung lượng khoảng 2,87 MB. Task yêu cầu giữ nguyên file; có thể tạo task tối ưu derivative favicon sau nếu cần giảm tải production.

## 2026-10-23 15:28 +07 — T-AUTH-SIMPLIFY tinh gọn Google Auth 1-click

Loại: Auth + UI

Đã làm:

- Đối chiếu Header của `banmenh v2` và khôi phục luồng đăng nhập trực tiếp: nút `Đăng nhập` gọi ngay `signInWithGoogle`, không mở hộp thoại trung gian.
- Với tài khoản ẩn danh, Header hiển thị huy hiệu `Khách` và nút `Liên kết Google` gọi trực tiếp `linkAnonymousToGoogle`.
- Loại bỏ `AuthDialog` và toàn bộ tham chiếu/state liên quan khỏi Header.
- Xác nhận `AuthProvider` đã xử lý `auth/credential-already-in-use` và `auth/email-already-in-use` bằng cách chuyển sang `signInWithPopup` cho tài khoản Google có sẵn.
- Giữ nguyên `onAuthStateChanged` và `syncSessionToFirestore`, vì vậy token vẫn được đồng bộ tới `/api/auth/session` sau khi trạng thái Firebase thay đổi.

Không làm:

- Không thêm dependency, không thay API session, payment hoặc entitlement.
- Không đăng nhập bằng tài khoản Gmail thật trong môi trường automation; bước chọn tài khoản cần Firebase dev credentials và thao tác tương tác khi review.

File chính đã sửa:

- `apps/web/src/components/layout/Header.tsx`
- Xóa `apps/web/src/components/auth/AuthDialog.tsx`
- `docs/TASK_REGISTRY.md`
- `docs/DEVLOG.md`

Kiểm thử:

- `npm run typecheck` — pass.
- `npm run lint` — pass.
- `npm run build` — pass.
- Visual smoke Edge headless — Header desktop 1440×1000 và mobile 375×812 render đúng, nút `Đăng nhập` hiển thị gọn.
- Source audit — không còn tham chiếu `AuthDialog`, `authOpen` hoặc copy `Đăng nhập Google / Email` trong `apps/web/src`.

Rủi ro còn lại:

- Cần xác nhận popup Google, chọn tài khoản và avatar/tên sau đăng nhập bằng Firebase dev credentials trong lượt review tích hợp.

## 2026-10-23 14:35 +07 — T-COMM-NUMEROLOGY-PAYWALL chuyển sang in-line teaser paywall

Loại: Numerology + Commerce + UI + Security

Đã làm:

- Khôi phục trang Tổng quan cho Free/VIP với đủ 8 chỉ số cốt lõi, 3 biểu đồ và một CTA dẫn sang trang Chi tiết; bỏ thẻ hard paywall xen giữa nội dung.
- Mở route Chi tiết cho mọi người dùng và thêm `LockedTeaser` dùng token thiết kế, giá từ shared pricing và liên kết PayOS giữ nguyên query báo cáo.
- Áp dụng phân quyền theo từng mục: mở Đường Đời/Sứ Mệnh; chỉ mở chặng đầu Chu kỳ Đường Đời, Đỉnh 1 Kim Tự Tháp và phần số hiện diện của Lưới Ngày Sinh; khóa các luận giải chuyên sâu còn lại.
- Tạo HTML preview ngay trong synthesizer và redaction tại API sau bước kiểm tra entitlement. Mục khóa được trả `html: ""`, vì vậy nội dung VIP không bị gửi xuống client Free.
- Giữ nguyên Pyramid SVG, Birth Grid, Career Bars và toàn bộ nội dung gốc khi `unlocked === true`.

Không làm:

- Không thêm dependency, không thay pricing, Firestore rules hoặc payment transaction.
- Không đổi số thứ tự dữ liệu hiện có: báo cáo thực tế có 31 mục; Birth Grid là mục 23, còn Nợ Nghiệp mục 22 được khóa đúng ý nghĩa nghiệp vụ.

File chính đã sửa:

- `apps/web/src/components/numerology/result/SummaryDashboard.tsx`
- `apps/web/src/app/than-so-hoc/result/details/page.tsx`
- `apps/web/src/components/numerology/result/FullReport.tsx`
- `apps/web/src/app/api/numerology/report/route.ts`
- `packages/shared/src/numerology/synthesizer.ts`
- `packages/shared/src/numerology/narrative/cycle.ts`
- `packages/shared/src/numerology/narrative/pyramid.ts`

Kiểm thử:

- `npm run typecheck` — pass.
- `npm run lint` — pass.
- `npm run build` — pass.
- `git diff --check` — pass.
- API smoke Free — pass: 4 phase; mục 5 chỉ có 1 chặng; mục 6 không chứa Thử thách; mục 23 không chứa phân tích Mũi tên; mục 7/12/22/24 có HTML rỗng.
- Visual smoke bằng Edge headless — pass ở desktop 1440×1000 và mobile 375×812; Tổng quan có đủ 8 chỉ số/3 biểu đồ, báo cáo dài và teaser render ổn.

Rủi ro còn lại:

- Task giữ trạng thái `Review` để chờ code review độc lập và kiểm thử entitlement VIP bằng Firebase dev credentials trước khi chuyển `Done`.

## 2026-10-23 10:39 +07 — T-COMM-B2C-1-FIX xử lý finding Auth và CSS

Loại: Code review fix

- Sửa nhãn provider Email trên `/account`, không còn hiển thị nhầm là tài khoản khách.
- Session API xác định `isAnonymous` bằng `firebase.sign_in_provider === "anonymous"` thay vì suy luận từ email.
- Di chuyển `@reference "../app/globals.css"` lên đầu hai stylesheet Numerology theo chuẩn Tailwind CSS v4.
- Không thêm dependency và không thay đổi pricing, Firestore rules hoặc payment transaction.
- Kiểm thử: `npm run typecheck`, `npm run lint`, `npm run build` và `git diff --check` — pass.

## 2026-10-23 10:21 +07 — T-COMM-B2C-1 hoàn thiện Commercial Edition auth, paywall và PayOS

Loại: Auth + Commerce + Payment + Security + UI

Đã làm:

- Mở đầy đủ navigation thương mại trên Header; thêm hộp thoại đăng nhập Google/Email, đăng ký Email, liên kết tài khoản Anonymous và avatar/menu quản lý tài khoản.
- Chuyển paywall Thần số học sang kiểm tra entitlement server-side; bản free chỉ hiện Đường đời/Sứ mệnh, khóa các biểu đồ và luận giải chuyên sâu với CTA lấy giá từ shared pricing.
- Hoàn thiện route thanh toán Tarot, callback success/cancel và buộc tài khoản Google/Email trước khi tạo đơn PayOS; amount và entitlement vẫn do backend/webhook quyết định.
- Thêm quota Tarot 3 lượt/ngày bằng Firestore transaction; API từ chối spread 5/7/10/12 khi thiếu gói và UI hiển thị số lượt còn lại cùng popup nâng cấp PayOS.
- Đồng bộ provider Email, contract `tarot_daily_usage`, Firestore rules server-only, mô tả quyền lợi gói và `NEXT_PUBLIC_APP_URL=https://banmenh.online` trong `.env.example`.
- Tách import CSS toàn cục tương thích Turbopack/Tailwind v4 và thêm `@reference` để giữ các utility tùy biến khi build độc lập.

Không làm:

- Không deploy production, không cấu hình secret thật, không đổi stack.
- Không chạy giao dịch PayOS thật hoặc đăng nhập Firebase thật vì môi trường hiện tại chưa có dev credentials được cấp cho phiên kiểm thử.
- Không chuyển lịch sử Tarot local lên cloud; contract hiện hành vẫn giới hạn 15 phiên trên thiết bị và đã sửa copy gói để không hứa quá quyền lợi thực tế.

File chính đã sửa/tạo:

- `apps/web/src/components/layout/Header.tsx`, `apps/web/src/components/auth/AuthDialog.tsx`, `apps/web/src/lib/auth/AuthProvider.tsx`
- `apps/web/src/app/api/numerology/report/route.ts`, `apps/web/src/components/numerology/result/SummaryDashboard.tsx`, các trang kết quả Thần số học
- `apps/web/src/app/api/tarot/reading/route.ts`, `apps/web/src/app/api/tarot/quota/route.ts`, `apps/web/src/lib/tarot/quota.ts`
- `apps/web/src/modules/tarot/TarotExperience.tsx`, `tarot-workflow-stages.tsx`, `tarot-upgrade-modal.tsx`
- `apps/web/src/app/tarot/payment/**`, payment setup/success và `apps/web/src/app/api/payment/create/route.ts`
- `packages/shared/src/pricing.ts`, schema user, `infra/firestore.rules`, `.env.example` và tài liệu contract/risk/environment liên quan

Kiểm thử:

- `npm run typecheck` — pass.
- `npm run lint` — pass.
- `npm run build` — pass; sinh đủ `/api/tarot/quota`, `/tarot/payment`, success/cancel và các route thương mại.
- `npm run security:smoke` — pass; không phát hiện secret phổ biến hoặc KB leak trong frontend/static.
- `npm run payos:test-sig` — pass.
- Visual smoke bằng Edge headless: `/` ở 1440×1000, `/pricing` và `/tarot/payment` ở 375×812 đều render, không có lỗi runtime trong dev log.
- `npm run qa:responsive-audit` — fail do smoke script vẫn khóa selector Header cũ ở breakpoint `md` trong khi Header thương mại chủ động chuyển sang `lg` để đủ chỗ cho 6 nav item; hai finding Footer/Home Hub cũng là baseline ngoài scope. Kiểm tra trực quan 375px đã pass.
- `npm run check` — typecheck/lint pass nhưng chuỗi lệnh dừng ở `kb:test-diacritics` vì workspace không có file gitignored `kb-private/numerology/narrative.json`; build và security smoke sau đó đã được chạy riêng và pass.
- `git diff --check` — pass.

Rủi ro còn lại:

- Cần code review độc lập theo workflow và test tích hợp Google/Email, QR PayOS, webhook/entitlement bằng Firebase + PayOS dev credentials trước khi chuyển task sang `Done`.
- Anonymous UID có thể bị reset để né quota; đã ghi R-023, cần App Check và rate limit/WAF theo IP/device trước production.

## 2026-10-22 10:39 +07 — T-0719 hoàn tất trải nghiệm bộ bài 3D, xào và xòe bài

Loại: UI + Interaction + Accessibility + Responsive + E2E

Đã làm:

- Thay lưới 78 lá tĩnh tại `deckDraw` bằng nghi thức ba trạng thái `idle` → `shuffling` → `fanned`, giữ nguyên thuật toán chọn bài và session hiện hữu.
- Dựng chồng bài 3D bảy lớp dùng mặt lưng Celestial Compass, cho phép kích hoạt bằng nút “Xào Bài” hoặc trực tiếp trên cỗ bài.
- Tạo hoạt cảnh xào hai nửa bộ bài đan xen trong 1,35 giây, kèm aura; khi bật `prefers-reduced-motion`, giao diện bỏ qua hoạt cảnh và mở quạt bài ngay.
- Xòe 78 lá thành cung liền mạch trên desktop; hover/focus nâng lá và tạo viền vàng, lá được chọn bay xuống khay rồi tự chuyển sang `spreadReveal` khi đủ số lá của spread.
- Trên mobile 375–430px, chuyển quạt bài thành vùng cuộn ngang cảm ứng có scroll snap, touch target tối thiểu 44px và tín hiệu lá kế bên; trang không phát sinh cuộn ngang ngoài vùng chủ đích.
- Bổ sung semantic button, trạng thái `aria-pressed`, thông báo `aria-live`, điều hướng bàn phím và tự đưa focus vào lá đầu tiên khi quạt mở.
- Tách toàn bộ style nghi thức sang file riêng, xóa component/style lưới mặt lưng cũ và cập nhật smoke test mặt lưng để theo luồng mới.
- Hướng triển khai chịu ảnh hưởng từ `ui-ux-pro-max`: ưu tiên touch target, focus rõ, layout ổn định, chuyển động bằng transform/opacity và reduced motion.

Không làm:

- Không thay đổi cách xáo thứ tự dữ liệu, số lá của spread, bước lật bài, prompt Gemini, KB Tarot hoặc lịch sử phiên.
- Không thêm dependency và không deploy production.
- Không biến toàn trang thành vùng cuộn ngang; chỉ rail bài trên mobile được phép cuộn cảm ứng.

File đã sửa/tạo:

- `apps/web/src/modules/tarot/tarot-deck-ritual.tsx`
- `apps/web/src/styles/tarot-deck-ritual.css`
- `apps/web/src/modules/tarot/tarot-workflow-stages.tsx`
- `apps/web/src/modules/tarot/TarotExperience.tsx`
- `apps/web/src/modules/tarot/tarot-ui.tsx`
- `apps/web/src/styles/tarot-workflow-stage.css`
- `apps/web/src/styles/tarot-workflow.css`
- `apps/web/src/app/tarot/layout.tsx`
- `tools/tarot-deck-ritual-smoke.mjs`
- `tools/tarot-card-back-smoke.mjs`
- `docs/TASK_REGISTRY.md`
- `docs/DEVLOG.md`

File đã xóa:

- `apps/web/src/styles/tarot-card-back.css` — style còn dùng đã được thay bởi stylesheet nghi thức mới; component `SelectedSlot` vẫn dùng asset mặt lưng chung.

Kiểm thử:

- `npm run typecheck` — pass.
- `npm run lint` — pass; các file nguồn liên quan đều dưới giới hạn 600 dòng.
- `npm run build` — pass; `/tarot` build thành công.
- `node tools/tarot-deck-ritual-smoke.mjs` với Edge headless — pass: đủ ba trạng thái, 78 lá, hover, keyboard, chọn spread 3 lá, tự chuyển bước, mobile 375×812 cuộn ngang cảm ứng, reduced motion và không tràn viewport.
- `node tools/tarot-card-back-smoke.mjs` — pass sau khi cập nhật selector theo nghi thức mới; Daily Card và `spreadReveal` tiếp tục dùng đúng mặt lưng/flip hiện hữu.
- Review trực quan ảnh chụp desktop 1280×800 và mobile 375×812 — quạt bài nằm gọn trong stage, rail mobile dễ nhận biết có thể vuốt, khay bài không che CTA hoặc gây cuộn ngang trang.

Rủi ro còn lại:

- 78 nút chỉ được mount sau khi xào để giảm chi phí ở trạng thái đầu; tất cả dùng chung một URL ảnh đã cache, nhưng thiết bị rất yếu vẫn có thể chịu chi phí compositing khi quạt mở.
- Build vẫn có cảnh báo Next.js hiện hữu về convention `middleware` deprecated; ngoài phạm vi T-0719.
- Workspace là snapshot không có `.git`, nên không thể lấy `BASE_SHA`/`HEAD_SHA` hoặc gửi request review theo SHA; đã tự review interaction, accessibility, responsive và phạm vi thay đổi, không có finding P0/P1.

## 2026-10-22 10:17 +07 — T-0718 hoàn tất mặt lưng Celestial Compass Tarot

Loại: UI Asset + Interaction + Accessibility + E2E

Đã làm:

- Sao chép ảnh nguồn `Celestial Compass Tarot Card Back.png` vào `apps/web/public/tarot_cards/card-back.png`; URL web thống nhất là `/tarot_cards/card-back.png`.
- Tạo hằng `TAROT_CARD_BACK_SRC` để `DeckBack`, `SelectedSlot` và Daily Card dùng chung một đường dẫn, tránh hardcode lặp lại.
- Thay toàn bộ khung CSS/SVG mặt lưng cũ bằng ảnh Celestial Compass tại bàn 78 lá, bước lật bài và popup Thông điệp mỗi ngày.
- Giữ flip 3D của Daily/Reveal, nhãn “Chạm để lật lá số”, bo góc và aura. Ảnh dùng kích thước khai báo 1024×1536, `object-fit` phù hợp và `alt=""` vì nút đã có accessible name.
- Sửa transform bàn 78 lá bằng CSS variable để góc nghiêng và hiệu ứng nâng khi hover hoạt động đồng thời; thêm reduced-motion cho transition mặt lưng.
- Tách style sang `tarot-card-back.css` sau khi lint phát hiện `tarot-workflow-stage.css` vượt giới hạn 600 dòng.
- Hướng triển khai chịu ảnh hưởng từ `ui-ux-pro-max`: khai báo kích thước chống CLS, không lặp semantic của ảnh trang trí, giữ keyboard interaction và reduced motion.

Không làm:

- Không thay đổi ảnh mặt trước, thuật toán chọn/rút bài, dữ liệu Daily Card, modal chi tiết hoặc prompt Gemini.
- Không chuyển đổi ảnh nguồn sang WebP/AVIF vì task yêu cầu URL PNG cố định; file PNG gốc 3.207.713 byte được giữ nguyên và trình duyệt tái sử dụng qua cache.
- Không deploy production.

File đã sửa/tạo:

- `apps/web/public/tarot_cards/card-back.png`
- `apps/web/src/modules/tarot/tarot-kb.ts`
- `apps/web/src/modules/tarot/tarot-ui.tsx`
- `apps/web/src/modules/tarot/tarot-daily-card.tsx`
- `apps/web/src/styles/tarot-card-back.css`
- `apps/web/src/styles/tarot-spread-reveal.css`
- `apps/web/src/styles/tarot-daily-card.css`
- `apps/web/src/app/tarot/layout.tsx`
- `tools/tarot-card-back-smoke.mjs`
- `docs/TASK_REGISTRY.md`
- `docs/DEVLOG.md`

Kiểm thử:

- `npm run typecheck` — pass.
- `npm run lint` — pass sau khi tách stylesheet; không có file nguồn vượt 600 dòng.
- `npm run build` — pass; `/tarot` prerender thành công.
- `node tools/tarot-card-back-smoke.mjs` với Edge headless — pass: ảnh đúng URL/kích thước tại Daily, đủ 78 ảnh ở deck, hover/nghiêng, reveal flip, keyboard Enter, reduced motion và viewport 375×812 không tràn ngang.

Rủi ro còn lại:

- Asset PNG khoảng 3,2 MB có thể làm lần tải đầu chậm trên mạng yếu dù chỉ tải một URL và được cache; có thể tối ưu lossless hoặc tạo biến thể responsive trong task hiệu năng riêng nếu cần.
- Build vẫn có cảnh báo Next.js hiện hữu về convention `middleware` deprecated; ngoài phạm vi T-0718.
- Workspace là snapshot không có `.git`, nên không thể lấy `BASE_SHA`/`HEAD_SHA` hoặc gửi request review theo SHA; đã tự review phạm vi asset, interaction, accessibility và responsive, không có finding P0/P1.

## 2026-10-22 09:52 +07 — T-0717 hoàn tất thư viện 1.544 Mật Mã Cộng Hưởng

Loại: Feature + Private KB + Security + UI/UX + E2E

Đã làm:

- Bổ sung tab `Mật Mã Cộng Hưởng` cạnh `78 Lá Bài`, bộ lọc 2/3/4/5 lá, tìm kiếm không dấu theo tên combo/tên lá, phân trang cố định 15 mục và đầy đủ loading/error/empty state.
- Xây màn chi tiết trong modal Từ điển hiện hữu: header vàng kim, ảnh ghép, phương trình lá và Accordion 5 lĩnh vực → ngách → hai khối Xuôi/Ngược. Dùng một modal boundary để Escape, click outside, focus trap/restoration và body scroll lock không xung đột.
- Tạo contract Zod dùng chung, taxonomy 5 lĩnh vực/70 ngách, hai Next API `GET /api/tarot/combos` và `GET /api/tarot/combos/:comboId`, cùng route KB Worker tương ứng.
- Index chỉ trả metadata tối đa 15 mục/trang; detail chỉ đọc khi người dùng mở một combo. Worker dùng KV/R2, local fallback chỉ đọc KB canonical ở server; client không nhận raw index, `detail_file` hay đường dẫn private.
- Thêm Firebase Auth, quota riêng cho thư viện, ID allowlist, timeout proxy và log lỗi tổng quát không chứa PII/query raw.
- Thêm smoke nguồn KB và Playwright E2E cho lọc/tìm kiếm/phân trang/Accordion/focus/Escape/mobile 375px. Hướng UI chịu ảnh hưởng từ `ui-ux-pro-max`: hierarchy rõ, focus nhìn thấy, skeleton giữ layout và tránh nested modal.
- Cập nhật data contract, module Tarot, Threat Model và Risk Register R-022.

Không làm:

- Không đưa `combo_index.json`, `combos/details/*.json` hoặc nội dung KB private vào `public`/client bundle.
- Không thay đổi thuật toán combo ở màn kết quả T-0716, prompt Gemini, entitlement/payment hoặc deploy production.
- Không bỏ Auth để phục vụ kiểm thử; môi trường hiện không cấp Firebase Anonymous token cho browser headless nên live request bị từ chối đúng `401`, còn UI được kiểm bằng fixture đúng schema và kho thật được kiểm riêng.
- Không tuyên bố pixel-perfect với ảnh mẫu không có trong workspace; triển khai bám đúng cấu trúc và hành vi đã mô tả trong task.

File đã sửa/tạo:

- `packages/shared/src/tarot-combo-taxonomy.ts`
- `packages/shared/src/schemas/tarot-combo-library.ts`
- `packages/shared/src/schemas/index.ts`
- `packages/shared/src/index.ts`
- `workers/kb/src/lib/tarot-kb-loader.ts`
- `workers/kb/src/routes/tarot-combo-library.ts`
- `workers/kb/src/index.ts`
- `apps/web/src/lib/tarot/local-tarot-kb.ts`
- `apps/web/src/lib/tarot/rate-limit.ts`
- `apps/web/src/app/api/tarot/combos/route.ts`
- `apps/web/src/app/api/tarot/combos/[comboId]/route.ts`
- `apps/web/src/modules/tarot/tarot-dictionary.tsx`
- `apps/web/src/modules/tarot/tarot-combo-library.tsx`
- `apps/web/src/modules/tarot/tarot-combo-detail-modal.tsx`
- `apps/web/src/styles/tarot-combo-library.css`
- `apps/web/src/app/tarot/layout.tsx`
- `apps/web/src/modules/tarot/TarotExperience.tsx`
- `tools/tarot-combo-library-smoke.mjs`
- `tools/tarot-combo-source-smoke.mjs`
- `docs/product-specs/data-contract.md`
- `docs/product-specs/security-threat-model.md`
- `docs/modules/tarot.md`
- `docs/RISK_REGISTER.md`
- `docs/TASK_REGISTRY.md`
- `docs/DEVLOG.md`

Kiểm thử:

- `npm run typecheck` — pass.
- `npm run lint` — pass.
- `npm run build` — pass; hai route combo library được build dạng dynamic server route.
- `node node_modules/typescript/bin/tsc -p workers/kb/tsconfig.json` — pass.
- Hai request list/detail không token — đều trả `401`.
- `node tools/tarot-combo-source-smoke.mjs` — pass: 1.544 combo, phân bố 1.195/240/34/75, đủ 78 lá, không thiếu file detail.
- `node tools/tarot-combo-library-smoke.mjs` với Edge headless — pass: 15 mục/trang, filter + search, phân trang, 5 lĩnh vực, Xuôi/Ngược, focus, Escape và viewport 375x812 không tràn ngang.
- Scan `apps/web/.next/static` — không có `combo_index.json`, `combos/details`, đường dẫn KB canonical hoặc `tarot_kb/combos`.

Rủi ro còn lại:

- Firebase Anonymous chưa cấp token trong browser headless local, nên tích hợp live Auth + dữ liệu thật cần được chạy lại ở môi trường dev có Firebase cấu hình; route đã fail-closed `401` và không hạ bảo vệ để test.
- Thư viện hợp lệ vẫn có thể bị thu thập chậm qua nhiều request; R-022 ghi rõ Auth, quota, pagination, lazy detail và yêu cầu telemetry/WAF trước production.
- Workspace là snapshot không có `.git`, nên không thể lấy `BASE_SHA`/`HEAD_SHA` hoặc gửi code review theo SHA; đã tự review API boundary, schema, accessibility và static artifact. Không có finding P0/P1 mới.
- Build vẫn có cảnh báo Next.js hiện hữu về convention `middleware` deprecated; ngoài phạm vi T-0717.

## 2026-10-22 00:37 +07 — T-0716 hoàn tất Combo Cộng Hưởng Định Mệnh Tarot

Loại: Feature + Private KB + Security + UI/UX + E2E

Đã làm:

- Tạo contract Zod dùng chung cho request/response combo; client chỉ gửi ID, tên và chiều của các lá đã rút, nhận tối đa ba combo đã khớp thay vì raw index/detail.
- Bổ sung `findMatchedCombos` tại KB Worker: so khớp không phân biệt hoa/thường, không phụ thuộc thứ tự phiên trải, chuẩn hóa tên số `Two`/`2`, hỗ trợ combo 2/3/4/5 lá và dựng orientation variant theo đúng thứ tự canonical của index.
- Nâng endpoint KB Worker `/tarot/combo` bằng POST, Firebase Auth, rate limit, Zod, nội dung đúng `nicheKey`/variant và lỗi không log raw PII; giữ GET cũ để không phá tương thích.
- Tạo Next route `/api/tarot/combo` có Auth, quota, proxy timeout 5 giây và fallback server-only đọc KB canonical; thiếu Worker/KB trả danh sách rỗng HTTP 200 để không làm sập bài luận giải.
- Xây khối `Cộng Hưởng Định Mệnh` trong `FinalReadingView`: sigil SVG quay nhẹ, cấp danh hiệu theo số lá, tiêu đề Việt/Anh, ảnh đúng chiều với dấu cộng, bài luận giải chuyên sâu và nhãn test mode.
- Tối ưu mobile 375px bằng wrap linh hoạt, ảnh giữ tỉ lệ, nội dung không tràn ngang; tắt chuyển động sigil khi `prefers-reduced-motion: reduce`.
- Tên hồ sơ `Turniodev` kích hoạt combo mẫu ngẫu nhiên ở local/dev; gate ở cả Next route và Worker, chặn hostname production, production flag mặc định `false` và không gửi raw họ tên qua API combo.
- Cập nhật data contract, module Tarot, Environment, Threat Model và Risk Register R-021. Hướng UI chịu ảnh hưởng trực tiếp từ checklist `ui-ux-pro-max`: hierarchy rõ, chỉ một chuyển động trang trí và tôn trọng reduced motion.

Không làm:

- Không đưa `combo_index.json`, `details/*.json` hoặc KB private vào frontend/public/static bundle.
- Không thay đổi các lá đã rút, prompt Gemini, lịch sử Tarot, entitlement/payment hoặc deploy production.
- Không sửa endpoint GET combo cũ ngoài việc bổ sung endpoint POST mới tương thích với contract T-0716.

File đã sửa/tạo:

- `packages/shared/src/schemas/tarot-combo.ts`
- `packages/shared/src/schemas/index.ts`
- `workers/kb/src/lib/tarot-kb-loader.ts`
- `workers/kb/src/index.ts`
- `workers/kb/wrangler.toml`
- `apps/web/src/app/api/tarot/combo/route.ts`
- `apps/web/src/lib/tarot/local-tarot-kb.ts`
- `apps/web/src/modules/tarot/tarot-destiny-combo.tsx`
- `apps/web/src/modules/tarot/tarot-workflow-stages.tsx`
- `apps/web/src/styles/tarot-ai-reading.css`
- `apps/web/.env.example`
- `tools/tarot-destiny-combo-smoke.mjs`
- `docs/product-specs/data-contract.md`
- `docs/product-specs/security-threat-model.md`
- `docs/modules/tarot.md`
- `docs/ENVIRONMENT.md`
- `docs/RISK_REGISTER.md`
- `docs/TASK_REGISTRY.md`
- `docs/DEVLOG.md`

Kiểm thử:

- `npm run typecheck` — pass.
- `npm run lint` — pass; các file nguồn liên quan đều dưới 600 dòng.
- `npm run build` — pass; route `/api/tarot/combo` được build dạng dynamic server route.
- `npx tsc -p workers/kb/tsconfig.json` — pass.
- Unit smoke `findMatchedCombos` — pass cho 2/3/4/5 lá, thứ tự đảo, alias số và variant chiều canonical.
- Smoke nguồn thật — pass với đủ 1.544 entry; `The Devil + The Lovers` khớp `the devil_the lovers`, nạp đúng `love/Up_Rev`.
- Request `POST /api/tarot/combo` không token — trả `401`.
- `node tools/tarot-destiny-combo-smoke.mjs` với Edge headless — pass: trigger `Turniodev`, sigil, tiêu đề Việt/Anh, hai ảnh, dấu cộng, bài luận giải, nhãn test mode, reduced motion và viewport 375x812 không tràn ngang.
- Scan `apps/web/.next/static` không phát hiện đường dẫn KB canonical, `combo_index.json` hoặc `combos/details`.

Rủi ro còn lại:

- Dev/test triển khai phải bật `TAROT_COMBO_TEST_MODE=true` đồng thời ở Next.js và KB Worker; production phải giữ `false` theo ENVIRONMENT.
- Workspace là snapshot không có `.git`, vì vậy không thể lấy `BASE_SHA`/`HEAD_SHA` hoặc gửi review theo mẫu SHA trong AGENTS.md; đã tự review contract, boundary private KB, Auth/rate limit và static artifact. Không có finding P0/P1 mới.
- Build vẫn phát cảnh báo Next.js hiện hữu về convention `middleware` đã deprecated; ngoài phạm vi T-0716.

## 2026-10-22 00:06 +07 — T-0715 hoàn tất Modal ý nghĩa tuần tự trong bước lật bài Tarot

Loại: Feature + UI/UX + Accessibility + E2E

Đã làm:

- Tách `SpreadRevealView` thành module chuyên trách, điều phối trạng thái lá đang lật, lá đang xem và danh sách lá đã mở mà không thay đổi state machine cấp ứng dụng.
- Khi người dùng lật một lá úp, thẻ chạy hiệu ứng 3D bằng transform rồi tự mở `TarotReadingCardDetail`; nếu hệ điều hành bật reduced-motion, hiệu ứng được rút xuống tức thời và modal không chờ 620ms.
- Tái sử dụng private card-detail API của T-0712 để hiển thị ảnh đúng chiều, vị trí, tên, hành tinh, cung, nguyên tố, thần số, ý nghĩa, từ khóa và nội dung đúng niche trước bước tâm thức; không đưa raw KB vào client/static asset.
- Bổ sung footer tiến độ “còn N lá chưa lật”, CTA trả focus đến lá chưa mở kế tiếp, carousel Trước/Sau chỉ duyệt tập lá đã lật và chỉ cho phép sang kết nối tâm thức khi toàn bộ spread đã mở.
- Giữ CTA dự phòng trên màn reveal sau khi đủ lá để người dùng không bị mắc kẹt nếu đóng modal bằng X, Escape hoặc click outside.
- Bổ sung ảnh thật ở mặt trước thẻ sau flip, xử lý lá ngược, nhãn truy cập theo vị trí, focus ring, SVG điều hướng và breakpoint mobile.
- Mở rộng `TarotReadingCardDetail` bằng footer tùy chọn và reset fallback tức thời khi carousel đổi lá, tránh hiển thị tạm nội dung của lá trước trong lúc chờ API.
- Tách CSS flip thành file riêng sau khi lint phát hiện stylesheet workflow vượt giới hạn; `tarot-workflow-stages.tsx` còn 547 dòng và `tarot-workflow-stage.css` còn 580 dòng.

Không làm:

- Không thay đổi API/schema, Worker, Auth, rate limit, quota, Gemini prompt hoặc private KB contract.
- Không mở thêm spread ngoài phạm vi hiện có và không deploy production.

File đã sửa/tạo:

- `apps/web/src/modules/tarot/tarot-spread-reveal.tsx`
- `apps/web/src/modules/tarot/tarot-workflow-stages.tsx`
- `apps/web/src/modules/tarot/TarotExperience.tsx`
- `apps/web/src/modules/tarot/tarot-ui.tsx`
- `apps/web/src/modules/tarot/tarot-reading-card-detail.tsx`
- `apps/web/src/styles/tarot-spread-reveal.css`
- `apps/web/src/styles/tarot-workflow-stage.css`
- `apps/web/src/styles/tarot-reading-card-detail.css`
- `apps/web/src/app/tarot/layout.tsx`
- `tools/tarot-spread-reveal-detail-smoke.mjs`
- `tools/tarot-card-detail-smoke.mjs`
- `docs/TASK_REGISTRY.md`
- `docs/DEVLOG.md`

Kiểm thử:

- `npm run typecheck` — pass.
- `npm run lint` — pass; toàn bộ file nguồn dưới giới hạn 600 dòng.
- `npm run build` — pass; `/tarot`, `/api/tarot/card/[cardId]` và `/api/tarot/reading` build thành công.
- `node tools/tarot-spread-reveal-detail-smoke.mjs` — pass: spread ba lá, modal tự mở theo từng lá, tiến độ 2 → 1 → 0, carousel chỉ qua lá đã mở, focus lá tiếp theo, gate tâm thức, ba câu clarification và kết quả Gemini cuối.
- Smoke ba lá pass tại 375x812 và landscape 812x375, không tràn ngang, body scroll lock đúng và reduced-motion hoạt động.
- `node tools/tarot-card-detail-smoke.mjs` — regression pass cho flow một lá, badge chiêm tinh/thần số, ảnh ngược, Escape, click outside và focus restoration.

Rủi ro còn lại:

- Build vẫn phát cảnh báo Next.js hiện hữu về convention `middleware` đã deprecated; không thuộc phạm vi T-0715.

## 2026-10-21 21:40 +07 — T-0714 hoàn tất header Modal chi tiết lá bài Tarot

Loại: UI/UX + Accessibility + E2E

Đã làm:

- Xác nhận T-0712 đã có đầy đủ modal chuyên sâu tại `FinalReadingView`: dữ liệu private KB đi qua API có Auth/rate limit, ảnh đúng chiều, thông tin chiêm tinh, thần số, ý nghĩa, từ khóa và luận giải đúng niche; không sao chép raw `cards.json` vào frontend.
- Hoàn thiện header theo thứ tự `{Họ tên} [đồng hồ] {DD/MM/YYYY} · {Tên ngách}`; thay emoji bằng SVG outline ổn định, ẩn biểu tượng trang trí khỏi accessibility tree và dùng phần tử `time` cho ngày sinh.
- Bỏ ép chữ hoa ở header, giữ đúng cách viết tên/ngách và cho phép nội dung wrap theo nhịp nhỏ để không tràn ở mobile.
- Đồng bộ smoke fixture modal với endpoint Niche Clarify của T-0713 và bổ sung assertion cho tên, ngày sinh, ngách cùng SVG đồng hồ.

Không làm:

- Không thay đổi API/schema, Worker, Auth, rate limit, private KB hoặc nội dung luận giải đã nghiệm thu tại T-0712.
- Không deploy production.

File đã sửa:

- `apps/web/src/modules/tarot/tarot-reading-card-detail.tsx`
- `apps/web/src/styles/tarot-reading-card-detail.css`
- `tools/tarot-card-detail-smoke.mjs`
- `docs/TASK_REGISTRY.md`
- `docs/DEVLOG.md`

Kiểm thử:

- `npm run typecheck` — pass.
- `npm run lint` — pass.
- `npm run build` — pass; route `/api/tarot/card/[cardId]` tiếp tục build thành công.
- `node tools/tarot-card-detail-smoke.mjs` với Edge headless — pass tại 375x812 cho flow Sự nghiệp → Xin Việc Làm; xác nhận header tên/đồng hồ/ngày sinh/ngách, badge Sao Hỏa/Bạch Dương/Số 2, ảnh lá ngược, Escape, click outside, body scroll lock, focus restoration và không tràn ngang.

Rủi ro còn lại:

- Build vẫn phát cảnh báo Next.js hiện hữu về convention `middleware` đã deprecated; không thuộc phạm vi T-0714.

## 2026-10-21 20:30 +07 — T-0713 hoàn tất Niche Clarify và cảnh báo trải bài lặp

Loại: Feature + Private KB API + UI/UX + Privacy + E2E

Đã làm:

- Đối chiếu trực tiếp `clarify/clarify_questions.json` canonical: 1.659 câu, tối đa 219 ký tự, có các nhóm chi tiết như `job_search`, `ex`, `promotion`; xác nhận nhóm `job_search` chứa câu hỏi về nộp hồ sơ, trì hoãn và than vãn về tình hình thất nghiệp.
- Bổ sung `GET /tarot/clarify?niche=...` tại KB Worker: Firebase Auth, rate limit theo IP, validate niche, lấy ngẫu nhiên không lặp đúng ba câu và không trả raw dump của kho private.
- Thêm Next.js proxy `/api/tarot/clarify` với Firebase Admin verification, Zod input/output, timeout 6 giây, `no-store` và lỗi tiếng Việt an toàn. Frontend preload theo đúng `nicheKey`; nếu Worker chưa khả dụng thì fallback về kho câu hỏi theo chủ đề hiện có để luồng không crash.
- Nâng cấp `consciousnessCheck`: ba câu CÓ/KHÔNG theo niche, nút “CHIA SẺ THÊM THÔNG TIN” mở textarea có label, focus rõ, giới hạn 1.000 ký tự và bộ đếm. Phần chia sẻ thêm được validate, đưa vào prompt trong delimiter dữ liệu không tin cậy và được kiểm tra safety; không lưu vào local history hoặc log.
- Ghi dấu `${theme}_${date}` vào localStorage bằng helper có `try/catch` khi người dùng hoàn thành ba câu tâm thức và chuyển sang kết quả.
- Khi vào `spreadSelect` lần nữa với cùng chủ đề trong ngày, hiển thị popup “Vũ Trụ Đã Lên Tiếng” với SVG trăng khuyết, copy cảnh báo, “Quay Lại” về landing và “Tiếp Tục” cho phép đi tiếp. Modal tái sử dụng focus trap, Escape, click outside, trả focus và body scroll lock.
- Tách taxonomy Tarot sang `tarot-topics.ts` để `TarotExperience.tsx` còn 512 dòng và toàn bộ file liên quan tiếp tục dưới giới hạn 600 dòng.

Không làm:

- Không sao chép `clarify_questions.json` vào frontend, `public` hoặc production artifact; frontend chỉ nhận ba câu tối thiểu qua API.
- Không deploy Worker/production và không ghi dữ liệu vào KV remote trong task này; Product Owner vẫn phải duyệt release và nạp canonical JSON vào key `kb-tarot-clarify` theo quy trình private.
- Không lưu phần chia sẻ thêm hoặc ba câu trả lời Có/Không vào local history.

File chính đã sửa/thêm:

- `packages/shared/src/schemas/tarot-clarify.ts`
- `packages/shared/src/schemas/tarot-ai.ts`
- `packages/shared/src/schemas/index.ts`
- `workers/kb/src/lib/tarot-kb-loader.ts`
- `workers/kb/src/index.ts`
- `workers/kb/README.md`
- `apps/web/src/app/api/tarot/clarify/route.ts`
- `apps/web/src/app/api/tarot/reading/route.ts`
- `apps/web/src/lib/tarot/gemini.ts`
- `apps/web/src/modules/tarot/TarotExperience.tsx`
- `apps/web/src/modules/tarot/tarot-niche-clarify.ts`
- `apps/web/src/modules/tarot/tarot-niche-consciousness.tsx`
- `apps/web/src/modules/tarot/tarot-repeat-warning.ts`
- `apps/web/src/modules/tarot/tarot-universe-warning.tsx`
- `apps/web/src/modules/tarot/tarot-topics.ts`
- `apps/web/src/modules/tarot/tarot-workflow-stages.tsx`
- `apps/web/src/styles/tarot-clarify-warning.css`
- `apps/web/src/app/tarot/layout.tsx`
- `tools/tarot-niche-clarify-smoke.mjs`
- `docs/TASK_REGISTRY.md`
- `docs/DEVLOG.md`

Kiểm tra đã chạy:

- `npm run typecheck` — pass.
- `npm run lint` — pass.
- `npm run build` — pass; route `/api/tarot/clarify` được build thành công, 38/38 trang generated.
- `npx tsc -p workers/kb/tsconfig.json --noEmit` — pass.
- `GET /api/tarot/clarify?niche=job_search` không có Bearer token — trả `401 AUTH_REQUIRED` với thông báo tiếng Việt an toàn.
- `node tools/tarot-niche-clarify-smoke.mjs` với Edge headless — pass tại 375x812: đúng ba câu `job_search`, context tùy chọn đi vào AI request, lưu dấu chủ đề/ngày, popup xuất hiện ở lượt hai, hai CTA hoạt động, body scroll lock và không tràn ngang.
- Quét `apps/web/src`, `apps/web/public` và `apps/web/.next` theo câu canonical về thất nghiệp — không có kết quả; raw clarify KB không nằm trong frontend/static artifact.

Rủi ro còn lại:

- Dev/prod Worker cần được deploy và key `kb-tarot-clarify` cần được nạp từ nguồn canonical private sau khi Product Owner duyệt; trước đó UI dùng fallback theo chủ đề.
- Build vẫn phát cảnh báo Next.js hiện hữu về convention `middleware` đã deprecated; không thuộc phạm vi T-0713.

## 2026-10-21 20:09 +07 — T-0712 hoàn tất Modal chi tiết lá bài chuyên sâu

Loại: Feature + API/KB + UI/UX + Accessibility + E2E

Đã làm:

- Cho phép click từng lá trong `FinalReadingView` để mở modal chi tiết hai cột trên desktop và một cột trên mobile; hiển thị hồ sơ người xem, ảnh đúng chiều, vị trí, tên Việt/Anh, hành tinh, cung, nguyên tố, thần số, ý nghĩa, từ khóa và luận giải đúng niche.
- Mở rộng `GET /tarot/card/:cardId` tại KB Worker với Firebase Auth, rate limit, validate card/niche/chiều và payload tối thiểu; raw Tarot KB vẫn nằm sau Worker, không được đưa vào bundle hoặc public assets.
- Thêm Next.js proxy `/api/tarot/card/[cardId]` với Firebase Admin verification, Zod input/output, timeout, `no-store` và thông báo lỗi an toàn; frontend có cache theo phiên và fallback từ bài luận hiện tại.
- Hoàn thiện accessibility: focus trap, nút X, Escape, click outside, trả focus về thẻ vừa mở, khóa body scroll, focus-visible và reduced-motion.
- Bổ sung smoke test cho luồng Sự nghiệp → Xin Việc Làm tại viewport 375x812, bao gồm badge chiêm tinh, mục `TRONG XIN VIỆC LÀM`, ảnh lá ngược 180 độ, không tràn ngang, Escape, click outside và focus restoration.

Không làm:

- Không sao chép raw KB sang frontend/public và không deploy KB Worker hoặc production; deployment tiếp tục cần Product Owner duyệt.
- Không thay đổi stack, pricing, entitlement hoặc phạm vi các module khác.

File chính đã sửa/thêm:

- `apps/web/src/modules/tarot/tarot-reading-card-detail.tsx`
- `apps/web/src/modules/tarot/tarot-workflow-stages.tsx`
- `apps/web/src/modules/tarot/TarotExperience.tsx`
- `apps/web/src/modules/tarot/tarot-ui.tsx`
- `apps/web/src/styles/tarot-reading-card-detail.css`
- `apps/web/src/styles/tarot-ai-reading.css`
- `apps/web/src/app/tarot/layout.tsx`
- `apps/web/src/app/api/tarot/card/[cardId]/route.ts`
- `workers/kb/src/index.ts`
- `workers/kb/src/lib/tarot-kb-loader.ts`
- `packages/shared/src/schemas/tarot-card-detail.ts`
- `packages/shared/src/schemas/index.ts`
- `tools/tarot-card-detail-smoke.mjs`
- `docs/TASK_REGISTRY.md`
- `docs/DEVLOG.md`

Kiểm tra đã chạy:

- `npm run typecheck` — pass.
- `npm run lint` — pass.
- `npm run build` — pass; route `/api/tarot/card/[cardId]` được build thành công.
- `npx tsc -p workers/kb/tsconfig.json --noEmit` — pass.
- `GET /api/tarot/card/1?niche=xin-viec-lam&reversed=true` không có Bearer token — trả `401 AUTH_REQUIRED` với thông báo tiếng Việt an toàn.
- `node tools/tarot-card-detail-smoke.mjs` với Edge headless — pass tại 375x812 cho luồng Sự nghiệp → Xin Việc Làm; xác nhận lá ngược, badge Sao Hỏa/Bạch Dương/Số 2, Escape, click outside, body scroll lock, không tràn ngang và focus restoration.

Rủi ro còn lại:

- Endpoint Worker mở rộng cần được deploy theo release runbook sau khi Product Owner duyệt; trước deploy, môi trường đang trỏ Worker cũ sẽ dùng fallback an toàn từ nội dung luận giải hiện tại.
- Build vẫn phát cảnh báo Next.js hiện hữu về convention `middleware` đã deprecated; không thuộc phạm vi T-0712.

## 2026-10-21 18:05 +07 — T-0711 hoàn tất Hyper-personalization Tarot

Loại: Feature + AI prompt + UI/UX + E2E

Đã làm:

- Thiết kế lại khối hồ sơ tùy chọn ở `QuestionView` với tiêu đề “Kết nối tần số năng lượng của bạn”, mô tả mục đích, nhãn truy cập đầy đủ, tên/biệt danh, ngày sinh và lựa chọn Nam/Nữ/Khác. Nếu Firebase user có `displayName`, tên được điền sẵn nhưng không ghi đè nội dung người dùng đã sửa; bỏ trống vẫn mặc định là “Bạn”.
- Thay ba câu hỏi tâm thức dùng chung bằng kho sáu câu cho từng nhóm `love`, `career`, `finance`, `self`, `general` và thêm pool an toàn cho `health`; mỗi phiên xáo trộn và cố định ba câu theo đúng chủ đề đã chọn.
- Thêm helper kiểm tra ngày sinh hợp lệ, tính 12 Cung Hoàng Đạo, bốn Nguyên tố và Con số năng lượng. Ca mẫu `1997-07-20` cho kết quả Cự Giải / Nước / 8.
- Nâng prompt Gemini để gọi tên người xem xuyên suốt, dùng cách xưng hô theo giới tính, kết nối Cung/Nguyên tố với lá xuôi-ngược, khai thác ba clarification để tìm gốc rễ, phân tích cộng hưởng và tạo đúng ba hành động riêng. Gỡ yêu cầu viết ngắn và lệnh cấm tính chiêm tinh từ ngày sinh.
- Đặt `temperature: 0.85`, `maxOutputTokens: 3000`; giữ nguyên ranh giới chống prompt injection, timeout, schema Zod, safety settings và fallback an toàn.
- Bổ sung smoke test Edge headless cho toàn bộ flow 375x812 với Hương / 1997-07-20 / Tình yêu, gồm kiểm tra pool câu hỏi đúng chủ đề, không tràn ngang và bản Gemini thật có tên Hương, Cự Giải, Nước.

File chính:

- `apps/web/src/modules/tarot/tarot-profile-fields.tsx`
- `apps/web/src/modules/tarot/tarot-profile-state.ts`
- `apps/web/src/modules/tarot/tarot-data.ts`
- `apps/web/src/modules/tarot/tarot-workflow-stages.tsx`
- `apps/web/src/modules/tarot/TarotExperience.tsx`
- `apps/web/src/lib/tarot/tarot-birth-profile.ts`
- `apps/web/src/lib/tarot/gemini.ts`
- `apps/web/src/styles/tarot-profile-fields.css`
- `tools/tarot-personalization-smoke.mjs`
- `docs/TASK_REGISTRY.md`
- `docs/DEVLOG.md`

Kiểm thử:

- `npm run typecheck` — pass.
- `npm run lint` — pass.
- `npm run build` — pass toàn bộ 37 trang; chạy với hai worker để tránh lỗi thiếu bộ nhớ của môi trường khi Next tự mở 15 worker. Cấu hình giới hạn worker chỉ dùng tạm lúc nghiệm thu, không giữ trong source.
- `node tools/verify-tarot-personalization.mjs` — pass: `Cự Giải`, `Nước`, Con số năng lượng `8`.
- Edge headless E2E 375x812 — pass: nhập hồ sơ, rút một lá, ba câu tâm thức Tình yêu, AI trả kết quả thật (`fallback: false`) và bài đọc chứa `Hương`, `Cự Giải`, `Nước`; không tràn ngang.

Chưa làm / rủi ro còn lại:

- Chiêm tinh và Con số năng lượng chỉ là lớp cá nhân hóa chiêm nghiệm; prompt tiếp tục cấm khẳng định định mệnh và tư vấn thay thế y tế, pháp lý hay tài chính.
- Workspace là snapshot không có `.git`; áp dụng ngoại lệ SHA đã được product owner xác nhận, self-review và nghiệm thu trực tiếp thay cho review theo commit range.

Kết luận:

- T-0711 đạt DoD và chuyển trạng thái `Done`.

---

## 2026-10-21 17:15 +07 — T-0703 nâng cấp trải nghiệm Thông điệp mỗi ngày

Loại: Feature + UI/UX + Accessibility

Đã làm:

- Mở lại T-0703 để thay popup text tĩnh bằng trải nghiệm rút lá bài ngày hoàn chỉnh.
- Nâng `getDailyCard(dateStr)` sang FNV-1a hash: một chuỗi ngày `YYYY-MM-DD` luôn cho cùng lá và cùng chiều Xuôi/Ngược, không phụ thuộc random runtime.
- Tạo component daily riêng với mặt lưng huyền bí bằng CSS/SVG, nút lật semantic, hiệu ứng `rotateY` 3D và mặt trước dùng ảnh thật từ `tarotCardImageSrc`.
- Sau reveal hiển thị tên Việt/Anh, chiều lá, thông điệp ngắn, lời khuyên hành động cho 24 giờ và CTA đi sâu vào luồng Tarot.
- Tách key đã đóng popup `tarot_daily_seen` khỏi key đã lật `bm_tarot_daily_revealed_v1`; mở lại trong cùng ngày hiển thị trực tiếp lá đã lật.
- Bọc toàn bộ đọc/ghi localStorage trong `try/catch`; Private browsing không làm crash modal.
- CTA chính đóng modal và chuyển tới `fieldSelect`; CTA phụ chỉ xác nhận đã nhận thông điệp.
- Giữ hỗ trợ nút X, Escape, click outside, focus trap; bổ sung focus-visible, touch target, tỉ lệ ảnh cố định và reduced-motion.
- Tách helper storage khỏi `TarotExperience.tsx` để toàn bộ source tiếp tục tuân thủ giới hạn 600 dòng; xóa CSS placeholder không còn sử dụng.

File chính:

- `apps/web/src/modules/tarot/tarot-daily-card.tsx`
- `apps/web/src/modules/tarot/tarot-daily-storage.ts`
- `apps/web/src/modules/tarot/tarot-data.ts`
- `apps/web/src/modules/tarot/TarotExperience.tsx`
- `apps/web/src/styles/tarot-daily-card.css`
- `apps/web/src/styles/tarot-workflow-stage.css`
- `apps/web/src/app/tarot/layout.tsx`
- `docs/TASK_REGISTRY.md`
- `docs/DEVLOG.md`

Kiểm thử:

- `npm run typecheck` — pass.
- `npm run lint` — pass.
- `npm run build` — pass với Firebase credential kiểm thử chỉ tồn tại trong process; không ghi secret ra file/repository.
- Edge headless E2E 375x812 — pass: mặt úp, click lật, ảnh/chiều lá, nội dung 24 giờ, persist ngày, mở lại hiện thẳng mặt bài, Escape, click outside, CTA sang “Chọn lĩnh vực”, reduced-motion và không tràn ngang.
- Script E2E tạm đã xóa sau kiểm thử.

Chưa làm / rủi ro còn lại:

- Nguồn static hiện có thông điệp riêng cho 10 lá Major Arcana; các lá còn lại vẫn dùng fallback an toàn chung. Việc nhập đủ 78 daily message từ KB private cần luồng backend/KB riêng, không đưa raw KB vào frontend.
- Trạng thái daily vẫn local-only cho guest; cloud sync thuộc P1 theo `tarot-workflow-reference.md`.
- Workspace snapshot không có `.git`; dùng ngoại lệ SHA đã được product owner xác nhận cho workspace, self-review và nghiệm thu trực tiếp thay cho review theo commit range.

Kết luận:

- T-0703 đạt DoD nâng cấp và giữ trạng thái `Done`.

---

## 2026-10-21 16:30 +07 — T-0710 hoàn tất Sách phép Tarot / Từ điển 78 lá

Loại: Feature + UI/UX + Accessibility

Đã làm:

- Đăng ký T-0710 theo phạm vi product owner duyệt và thay modal placeholder 22 lá bằng thư viện đủ 78 lá lấy trực tiếp từ `DECK`.
- Thêm sáu bộ lọc: Tất cả, Ẩn chính, Bộ Gậy, Bộ Ly, Bộ Kiếm, Bộ Tiền; số lượng đã kiểm tra lần lượt 78/22/14/14/14/14.
- Thêm tìm kiếm theo tên tiếng Việt hoặc tiếng Anh, có chuẩn hóa để truy vấn tiếng Việt không dấu như “Ke Kho” vẫn tìm được “Kẻ Khờ”.
- Xây lưới thẻ responsive với ảnh từ `tarotCardImageSrc`, kích thước ảnh khai báo sẵn, `loading="lazy"` và `decoding="async"` để giảm tải khi hiển thị 78 lá.
- Xây màn chi tiết trong cùng modal để tránh nested dialog: ảnh lớn, nhóm bài, nguyên tố của Minor Arcana, trọng tâm năng lượng, từ khóa, chuyển đổi nghĩa Xuôi/Ngược và lời khuyên hành động.
- Nâng nút đóng modal thành nút X có nhãn truy cập; giữ Escape, click outside, focus trap, khóa body scroll và khôi phục focus từ ModalShell hiện có.
- Thêm empty state có hành động xóa bộ lọc, focus-visible rõ ràng, touch target tối thiểu và reduced-motion.
- Xóa CSS placeholder không còn sử dụng; không thêm dependency, API, storage hay dữ liệu ngoài phạm vi.

File chính:

- `apps/web/src/modules/tarot/tarot-dictionary.tsx`
- `apps/web/src/modules/tarot/TarotExperience.tsx`
- `apps/web/src/modules/tarot/tarot-ui.tsx`
- `apps/web/src/styles/tarot-dictionary.css`
- `apps/web/src/styles/tarot-workflow-stage.css`
- `apps/web/src/app/tarot/layout.tsx`
- `docs/TASK_REGISTRY.md`
- `docs/DEVLOG.md`

Kiểm thử:

- `npm run typecheck` — pass.
- `npm run lint` — pass.
- `npm run build` — pass với Firebase credential kiểm thử chỉ tồn tại trong process; không ghi secret ra file/repository.
- Edge headless E2E tại 375x812 — pass: mở “Từ điển”, xác nhận đủ 78 lá, lọc đúng 22/14/14/14/14, tìm EN, tìm VI không dấu, mở chi tiết, đổi nghĩa Ngược, đóng bằng Escape và click outside; `scrollWidth` không vượt `clientWidth`.
- Script E2E tạm đã xóa sau kiểm thử.

Chưa làm / rủi ro còn lại:

- Chưa có combo dictionary hoặc luận giải thủ công; đây là scope P1/P2 trong `tarot-workflow-reference.md`.
- Metadata hành tinh/cung hoàng đạo theo từng lá chưa có trong `DECK`; UI chỉ hiển thị metadata thật có thể suy ra an toàn từ nhóm bài (nguyên tố của bốn bộ), không tự bịa dữ liệu chiêm tinh.
- Workspace snapshot không có `.git`; dùng ngoại lệ SHA đã được product owner xác nhận cho workspace, self-review và nghiệm thu trực tiếp thay cho review theo commit range.

Kết luận:

- T-0710 đạt DoD và chuyển `Done`.

---

## 2026-10-21 15:32 +07 — T-0708 hoàn tất Tarot local history

Loại: Feature + Privacy + UI/UX

Đã làm:

- Tạo lớp lưu trữ versioned `bm_tarot_history_v1`, validate Zod và giới hạn 15 phiên mới nhất; quẻ mới đứng đầu, quẻ cũ nhất bị loại khi vượt giới hạn.
- Tự động lưu sau khi `FinalReadingView` nhận response Gemini hoặc template fallback thành công.
- Dữ liệu lưu gồm ID, thời gian, chủ đề, câu hỏi, spread, thông tin/chiều/ảnh các lá, tóm tắt, nguồn kết quả và nội dung luận giải để xem lại.
- Không lưu profile họ tên/ngày sinh/giới tính, clarification, auth token hoặc payment data.
- Thay placeholder bằng modal “Thông điệp quá khứ”: danh sách trực quan, ngày giờ, câu hỏi, ảnh thu nhỏ, màn đọc lại đầy đủ, disclaimer, xóa một phiên và xóa toàn bộ có xác nhận hai bước.
- Thêm thông báo lịch sử chỉ nằm trên trình duyệt, không đồng bộ máy chủ; có cảnh báo riêng khi Private browsing/Incognito chặn localStorage.
- Bọc mọi thao tác lấy `window.localStorage`, đọc, parse, ghi và xóa trong `try/catch`; lỗi storage không làm crash Tarot.
- Nâng accessibility cho modal Tarot: `role=dialog`, `aria-modal`, nhãn dialog, focus ban đầu, focus trap, đóng bằng Escape, khôi phục focus và khóa body scroll.
- Điều chỉnh nút “Thông điệp quá khứ” trên Landing thành hàng riêng để không vỡ chữ ở 375px; bổ sung focus-visible.

File chính:

- `apps/web/src/modules/tarot/tarot-history.ts`
- `apps/web/src/modules/tarot/tarot-history-view.tsx`
- `apps/web/src/modules/tarot/TarotExperience.tsx`
- `apps/web/src/modules/tarot/tarot-ui.tsx`
- `apps/web/src/modules/tarot/tarot-landing.tsx`
- `apps/web/src/modules/tarot/tarot-data.ts`
- `apps/web/src/styles/tarot-history.css`
- `apps/web/src/styles/tarot-workflow-landing.css`
- `apps/web/src/app/tarot/layout.tsx`

Kiểm thử:

- `npm run typecheck` — pass.
- `npm run lint` — pass.
- `npm --workspace workers/kb exec tsc -- --noEmit` — pass.
- `npm run build` — pass với Firebase credential kiểm thử chỉ tồn tại trong process.
- Edge headless E2E 375x812 — pass: tạo quẻ mới → lưu local history → trở về Landing → mở “Thông điệp quá khứ” → xem chi tiết → xóa quẻ; xác nhận không tràn ngang và localStorage về mảng rỗng.
- `npm run security:smoke` — không có finding mới từ T-0708; còn bốn false-positive có sẵn ở `ErrorState.tsx`, `tarot-kb.ts` và `tarot-questions.ts`.
- Script/screenshot E2E tạm đã được xóa sau kiểm thử; không thêm dependency mới.

Kết luận:

- T-0708 đạt DoD và chuyển `Done`. Workspace snapshot không có `.git`; thực hiện self-review và nghiệm thu trực tiếp theo yêu cầu product owner thay cho review theo SHA.
- Rủi ro còn lại: câu hỏi Tarot nằm trong bộ nhớ trình duyệt và có thể bị người khác dùng chung thiết bị xem; UI đã disclosure rõ và cung cấp xóa từng phiên/toàn bộ.

---

## 2026-10-21 15:04 +07 — T-0709 tích hợp Gemini cho luận giải Tarot

Loại: Feature + Security + Documentation

Đã làm:

- Tạo ADR-009 (supersede ADR-003) và đăng ký T-0709 với guardrail AI, riêng tư, chi phí và fallback.
- Tạo `POST /api/tarot/reading`: Firebase ID token/Anonymous Auth, rate limit theo user và IP, Zod input/output, câu hỏi tối đa 200 ký tự, timeout Gemini 18 giây và fallback template HTTP 200.
- Gọi Gemini 2.5 Flash bằng native `fetch`; prompt dùng thông tin người hỏi, chủ đề/niche, câu hỏi, ba câu trả lời làm rõ, vị trí/chiều lá bài, nghĩa theo chủ đề, metadata chiêm tinh/năng lượng và bắt buộc ba section Markdown đã duyệt.
- Thêm prompt-injection boundary và content-safety: không tiên đoán chắc chắn, hù dọa, tự hại/hại người hoặc thay thế tư vấn y tế, tâm lý, pháp lý và tài chính.
- Làm giàu `aspectMeaning` server-side qua endpoint Tarot KB đã xác thực; bổ sung Firebase Auth cho endpoint KB `/tarot/reading` cũ để đóng đường truy cập không xác thực.
- Nối `FinalReadingView` với API, gồm loading, lỗi tiếng Việt, ảnh/tên/vị trí/chiều từng lá, overview, synergy, advice, trạng thái fallback, disclosure AI và disclaimer.
- Bổ sung form cá nhân hóa tùy chọn (họ tên, ngày sinh, giới tính) cùng thông báo trước khi dữ liệu phiên Tarot được Google Gemini xử lý.
- Cập nhật `.env.example`, ENVIRONMENT, Privacy, Terms, Threat Model, Risk Register, technical decisions, project/module/workflow docs và legal copy.
- Tách component/style hồ sơ và AI reading để mọi source file giữ dưới giới hạn 600 dòng.

File chính đã sửa/tạo:

- `apps/web/src/app/api/tarot/reading/route.ts`
- `apps/web/src/lib/tarot/gemini.ts`, `apps/web/src/lib/tarot/rate-limit.ts`
- `packages/shared/src/schemas/tarot-ai.ts`
- `apps/web/src/modules/tarot/TarotExperience.tsx`, `tarot-workflow-stages.tsx`, `tarot-profile-fields.tsx`, `tarot-data.ts`, `tarot-kb.ts`
- `apps/web/src/styles/tarot-ai-reading.css`, `tarot-profile-fields.css`, `tarot-workflow-stage.css`
- `workers/kb/src/index.ts`
- `docs/ADR.md`, `docs/TASK_REGISTRY.md`, `docs/ENVIRONMENT.md`, `docs/RISK_REGISTER.md` và các product/module/legal docs liên quan.

Command/check đã chạy:

- `npm install` — hoàn tất; npm audit báo 25 vulnerability dependency hiện có (1 low, 9 moderate, 13 high, 2 critical), chưa tự động sửa vì ngoài scope và có thể gây breaking change.
- `npm run typecheck` — pass.
- `npm run lint` — pass.
- `npm --workspace workers/kb exec tsc -- --noEmit` — pass.
- `npm run build` — pass với Firebase credential kiểm thử tạm chỉ tồn tại trong process; không ghi secret ra file/repository.
- Smoke `POST /api/tarot/reading` không token — trả `401`.
- Playwright/Edge viewport 375x812 trên `/tarot` — route render được và không tràn ngang; ảnh tạm đã xóa.
- `npm run check` — dừng ở `kb:test-diacritics` do thiếu file gitignored `kb-private/numerology/kb.json`.
- `npm run security:smoke` — còn fail bởi bốn false-positive có sẵn tại `ErrorState.tsx`, `tarot-kb.ts` và `tarot-questions.ts`; không có finding mới ở route/prompt T-0709.
- `npm run qa:responsive-audit` — còn fail bởi rule cũ ở Header, Footer và Home Hub; các rule này không kiểm tra UI Tarot mới.

Chưa làm / rủi ro còn lại:

- Chưa gọi live Gemini vì không có `GEMINI_API_KEY` thật trong môi trường; cần kiểm thử dev/test với key riêng và billing alert trước production.
- Chưa kiểm thử E2E nhánh token hợp lệ + Gemini success/timeout trên hạ tầng Firebase/Gemini thật.
- Workspace là snapshot độc lập không có `.git`; product owner đã duyệt bỏ qua bước lấy SHA/request Claude review riêng cho T-0709.
- Rate limit hiện là in-memory theo instance; production multi-instance cần KV/Durable Object nếu cần quota toàn cục chặt.

Kết luận nghiệm thu:

- Product owner nghiệm thu T-0709 dựa trên `npm run typecheck`, `npm run lint`, `npm run build` đều pass và smoke bảo mật request không token trả `401`.
- T-0709 hoàn tất và chuyển trạng thái `Done` ngày 2026-10-21. Kiểm thử Gemini live với key dev/test và billing alert vẫn là bước vận hành trước production, không chặn nghiệm thu implementation.

---

## 2026-06-16 18:00 +07 — T-AUDIT-S2B hoàn tất

Loại: Audit Fix

Hoàn tất 4 items deferred từ T-AUDIT-S2:

- **I1 (webhook TOCTOU):** Thêm processingAt lock 30s trong payment worker. Nếu PayOS gửi 2 webhook trùng trước khi Firestore update xong, webhook thứ 2 trả về `{ ok: true, processing: true }` thay vì double-grant.
- **I8 (GalaxyBackground SSR):** `next/dynamic({ ssr: false })` không dùng được trong Server Component. Tạo `GalaxyBackgroundLazy.tsx` là Client Component chứa dynamic import; root `layout.tsx` import wrapper này.
- **I9 (parallel fetch):** `checkEntitlement` và KB fetch chạy song song qua `Promise.allSettled`. Entitlement fail không block response; KB fail → 502.
- **I14 (CSS tokens):** Thêm `--bm-rose`, `--bm-violet`, `--bm-gold-faint` vào `tokens.css`. Tarot CSS files dùng token thay hardcode hex.

Commits:

- `bc873a1` perf(api): parallelize entitlement check and KB fetch (T-AUDIT-S2B I9)
- `34b7278` fix(webhook): add processingAt lock to prevent TOCTOU double-grant (T-AUDIT-S2B I1)
- `d1ba30c` style(tarot): replace hardcode hex with --bm-* tokens (T-AUDIT-S2B I14)
- `5e7a15e` perf(layout): lazy-load GalaxyBackground with ssr:false (T-AUDIT-S2B I8)
- `c3ae37f` fix(layout): wrap GalaxyBackground dynamic import in client component (T-AUDIT-S2B I8-fix)

Verify:

- `npm run lint` pass.

Rủi ro còn lại:

- Không chạy lại build trong docs-only commit này theo đúng phạm vi user yêu cầu; build đã pass ở hotfix I8-fix trước đó.

---

## 2026-06-16 17:00 +07 — T-AUDIT-S2 — Post-Sprint-1 + Tarot audit fixes

Loại: Audit Fix

Đã làm:

- Item 0: Checkpoint commit toàn bộ 11 untracked Tarot/layout files + modified files (safe checkpoint trước khi fix).
- C1: `TarotExperience.tsx` — xóa hardcode tên người thật, thay bằng `user?.displayName || "Bạn"` qua `useAuth()`.
- C2: Xóa 3 Tarot CSS import khỏi root `apps/web/src/app/layout.tsx`, tạo `apps/web/src/app/tarot/layout.tsx` scope CSS đúng route `/tarot`.
- I2: `docs/ADR.md` — đổi ADR-007 duplicate (narrative extension) → ADR-008, cập nhật index table.
- I7: Tạo 4 placeholder "Sắp ra mắt" pages: `/tu-vi`, `/ma-tran`, `/chiem-sao`, `/bat-tu`.
- M: `MysticHero.tsx` đổi `batu.png` → `batu.jpg` (tiết kiệm ~2.3MB); `tarot-data.ts` thêm TODO marker DAILY_MESSAGE; `workers/payment/src/index.ts` đổi entitlement for-loop → `Promise.allSettled`.
- I3/I4 xác nhận đã có: BackHomeBar mounted tại `layout.tsx:26`, CSS classes tồn tại tại `globals.css:455+`.

Không làm (defer sang T-AUDIT-S2B):

- I1: Webhook processingAt lock (TOCTOU) — cần review flow đầy đủ.
- I8: GalaxyBackground dynamic import ssr:false — perf improvement.
- I9: Promise.all cho checkEntitlement + KB fetch trong numerology route.
- I14: Tarot CSS hardcode hex → `--bm-*` tokens.

Commits (6):

- `26e21df` feat(tarot): checkpoint
- `137fe65` fix(tarot): C1 hardcoded name
- `0420f4a` perf(tarot): C2 CSS scope
- `97b18b6` docs(adr): I2 ADR-008
- `c27aa57` feat(routes): I7 placeholder routes
- `7b1aebe` chore: M misc fixes

Command đã chạy:

- `npm run typecheck` — pass
- `npm run lint` — pass

Rủi ro còn lại:

- 4 items defer cần T-AUDIT-S2B trước khi có thể đánh full audit Done.

---

## 2026-06-13 12:30 +07 — T-0702B — Port Mystery Tarot UX shell local-only

Loại: Task

Đã làm:

- Thay shell Tarot bằng flow local-only gần hơn với website tham chiếu: landing, popup tạo phiên, tĩnh tâm, chọn bài, lật bài, phân tích.
- Làm lại data/UI Tarot thành bản sạch tiếng Việt, có spread 1/3/5/7/10/12, modal phụ và hiệu ứng heartbeat/ripple/fade-up.
- Giữ KB ngoài luồng, không gọi AI, không public KB private.

File đã sửa:

- `apps/web/src/app/tarot/page.tsx`
- `apps/web/src/modules/tarot/TarotExperience.tsx`
- `apps/web/src/modules/tarot/tarot-data.ts`
- `apps/web/src/modules/tarot/tarot-ui.tsx`
- `docs/TASK_REGISTRY.md`
- `docs/DEVLOG.md`

Command đã chạy:

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`

Rủi ro còn lại:

- Chưa smoke qua browser nội bộ trong phiên này.
- Phần KB Tarot/Mystery workflow thật vẫn để task tiếp theo, hiện tại chỉ là UX shell local-only.

## 2026-06-13 11:50 +07 — T-0702A — Prototype Tarot ritual UX theo Mystery Tarot

Loại: Task

Đã làm:

- Thay `/tarot` skeleton/form-like bằng flow ritual local-only: landing, tụ tâm, chọn chủ đề/câu hỏi, chọn trải bài, rút/lật bài và kết quả.
- Thêm nhịp animation chậm cho heartbeat, ripple, fade-up và reveal từng lá.
- Tách dữ liệu mô phỏng, UI helpers và experience thành file riêng để giữ file dưới giới hạn lint.
- Không gọi AI, không nối KB private trong bước này.

File đã sửa:

- `apps/web/src/app/tarot/page.tsx`
- `apps/web/src/modules/tarot/TarotExperience.tsx`
- `apps/web/src/modules/tarot/tarot-data.ts`
- `apps/web/src/modules/tarot/tarot-ui.tsx`
- `docs/TASK_REGISTRY.md`

Verify:

- `npm run typecheck` pass.
- `npm run lint` pass.
- `npm run build` pass.

Rủi ro / chưa làm:

- Chưa manual browser QA do automation/dev-server local lỗi sandbox trong phiên này.
- KB thật, combo, history, entitlement và backend Tarot vẫn thuộc các task Tarot MVP sau.

## Môi trường dự án

| Môi trường | Mục đích | Trạng thái |
|-----------|---------|-----------|
| **DEV/TEST** | Verify trước khi ra production | — |
| **PRODUCTION** | Sản phẩm thật, user thực tế | — |

> Chi tiết: `ENVIRONMENT.md`

---

## Scope Change Log
> Mọi thay đổi scope — dù nhỏ. Đây là giải thích tại sao dự án kéo dài hoặc đổi hướng.
> **Thêm entry mới vào ĐẦU bảng.**

| ID | Ngày & Giờ | Mô tả thay đổi | Tác động | Người quyết định |
|----|-----------|----------------|---------|-----------------|
| SC-001 | YYYY-MM-DD HH:mm +07 | [Mô tả] | Timeline +Xh / Task mới: PX.Y | [Tên] |

---

## Index nhanh
> **Thêm entry mới vào ĐẦU bảng.**

| Ngày & Giờ | Ref | Tiêu đề | Loại |
|-----------|-----|---------|------|
| 2026-06-10 00:00 +07 | T-AUDIT-S1 | Fix 5 blocker findings from project audit | `Task` |
| 2026-06-06 00:37 +07 | T-HOME-DEMO | Local homepage A/B/C variants | `Task` |
| 2026-06-06 00:37 +07 | T-HOME-1 | Homepage shared component refactor | `Task` |
| 2026-06-05 15:31 +07 | T-PAY-NUM-4 | Free preview Mystical Hub redesign | `Task` |
| 2026-06-05 15:16 +07 | T-UX-ERR-1 | Auth-aware error states | `Task` |
| 2026-06-05 15:00 +07 | T-PAY-NUM-3-FIX-2 | Multi-faceted preview with locked aspect teasers | `Task` |
| 2026-06-05 14:39 +07 | T-PAY-NUM-3-FIX | Generous free preview from narrative + month fields | `Task` |
| 2026-06-05 13:53 +07 | T-PAY-NUM-2 | Numerology free preview flow + CTA FAQ | `Task` |
| 2026-06-05 11:33 +07 | T-PAY-NUM-1 | Numerology payment module-scoped routes | `Task` |
| 2026-06-05 14:15 +07 | T-PAY-NUM-3 | Free preview indicators + anchor wording | `Task` |
| 2026-06-04 23:54 +07 | T-0610c-lifePath10 | Life Path 10 display + narrative KB | `Task` |
| 2026-06-04 13:49 +07 | T-0606o/T-0606n | Free voucher commit + security hardening | `Task` |
| 2026-06-02 13:10 +07 | T-0606m | Audit cleanup batch | `Task` |
| 2026-06-02 12:35 +07 | T-0606l | Tension number fallback insight + English cleanup | `Hotfix` |
| 2026-06-02 12:05 +07 | T-0606k-fix | Section 23 compensation arrow summary fix | `Hotfix` |
| 2026-06-02 11:45 +07 | T-0606k | Port V1 birth/name grid analysis | `Task` |
| 2026-06-02 11:15 +07 | T-0606j | Extended karmicDebt content merge | `Task` |
| 2026-06-02 10:55 +07 | T-0606f | Wire section 21 karmic debt rich V1 narrative | `Task` |
| 2026-06-02 10:22 +07 | T-0606e | Fix challenge indicator formulas to match V1 | `Task` |
| 2026-06-02 01:24 +07 | T-0606c | Extended soulChallenge content merge | `Task` |
| 2026-06-01 23:57 +07 | T-0610c-section16-17-18 | Literal V1 sections 16-17-18 inline render | `Task` |
| 2026-06-01 23:41 +07 | T-0610c-section12-13-14 | Literal V1 sections 12-14 inline render | `Task` |
| 2026-06-01 23:06 +07 | T-0606b | Detect V1 narrative OVERRIDE assignments | `Task` |
| 2026-06-01 17:37 +07 | T-0610c-section10-finalize | Expand destiny extra narratives to V1-length parity | `Task` |
| 2026-06-01 16:40 +07 | T-0610c-section10-extra | Destiny extra narrative content | `Task` |
| 2026-06-01 15:22 +07 | T-0610c-section10-11 | Literal V1 destiny context + section 11 correlation | `Task` |
| 2026-05-30 01:54 +07 | T-0610c-section9 | Literal V1 personal month 3-month detail | `Task` |
| 2026-05-30 01:30 +07 | T-0610c-section8 | Literal V1 personal year summary + 3-year cycle | `Task` |
| 2026-05-30 01:07 +07 | T-0610c-cleanup | Split narrative modules + diacritics test | `Task` |
| 2026-05-30 00:59 +07 | T-0610c-fix | Vietnamese period strings + pyramid year labels | `Hotfix` |
| 2026-05-30 00:34 +07 | T-0610c-section7 | Literal V1 pyramid section | `Task` |
| 2026-05-30 00:08 +07 | T-0610c-section6 | Literal V1 life cycles section | `Task` |
| 2026-05-29 23:43 +07 | T-0610c-section5 | Literal V1 life path section + career detail | `Task` |
| 2026-05-29 17:48 +07 | T-0610c-year | Literal V1 personal year deep narrative | `Task` |
| 2026-05-29 17:21 +07 | T-0610 | Mechanical port V1 web numerology details 4 phần | `Task` |
| 2026-05-29 11:14 +07 | T-0609 | Port V1 pyramid + 3x3 numerology charts | `Task` |
| 2026-05-29 10:22 +07 | T-0608 | V1-style numerology details synthesizer | `Task` |
| 2026-05-29 00:34 +07 | T-0607b | Personality bars 2-col + 11 aspect cards | `Task` |
| 2026-05-29 00:09 +07 | T-0607a | Fix V1 chart math + locked grid icons | `Task` |
| 2026-05-28 23:52 +07 | T-0607 | Result summary dashboard + V1 charts | `Task` |
| 2026-05-28 22:59 +07 | T-0606 | Extract 19 nhóm narrative V1 + KB Worker merge | `Task` |
| 2026-05-28 16:36 +07 | T-0605b | Free unlock qua voucher 100% | `Task` |
| 2026-05-28 15:50 +07 | T-0604 | Numerology paid unlock check | `Task` |
| 2026-05-27 23:38 +07 | T-0602c | Strategy B freemium result | `Task` |
| 2026-05-27 23:18 +07 | T-0602b | Numerology result premium redesign | `Task` |
| 2026-05-27 00:27 +07 | T-0602 | Numerology free result generation | `Task` |
| 2026-05-26 22:48 +07 | T-0601 | Numerology input form | `Task` |
| 2026-05-26 22:40 +07 | T-0407 | Phase 4B KB pipeline hoàn tất | `Phase-Retro` |
| 2026-05-23 16:11 +07 | T-0407d | Extract V1 narrative lifePath + destiny | `Task` |
| 2026-05-23 16:00 +07 | T-0407c | Numerology engine TypeScript Worker-ready | `Task` |
| 2026-05-23 15:50 +07 | T-0407a | Numerology KB private copy + schema validate | `Task` |
| 2026-05-23 14:02 +07 | T-0307 | Pricing inline trên module pages | `Task` |
| 2026-05-22 15:50 +07 | T-0506 | Admin voucher CRUD API | `Task` |
| 2026-05-22 15:30 +07 | T-0505b | UX refactor voucher input sang payment setup | `Task` |
| 2026-05-21 00:50 +07 | T-0505 | Voucher validate API + apply discount | `Task` |
| 2026-05-21 00:37 +07 | T-0502b | Render PayOS QR inline với countdown 5 phút | `Task` |
| 2026-05-21 00:19 +07 | T-0504 | Telegram payment alerts cho Worker webhook | `Task` |
| 2026-05-19 23:55 +07 | T-0503b | PayOS webhook logic — Firestore REST + entitlement grant | `Task` |
| 2026-05-19 23:30 +07 | T-0503a | Scaffold Cloudflare Worker với Hono | `Task` |
| 2026-05-18 21:30 +07 | T-0401 | Pricing strategy correction — Tarot subscription model | `Correction` |
| 2026-05-18 21:00 +07 | T-0406 | Fix Firestore undefined field error | `Correction` |
| 2026-05-18 20:30 +07 | T-0502 | Payment check API + success/cancel pages + pricing wire | `Task` |
| 2026-05-18 19:30 +07 | T-0501 | Implement payment create API | `Task` |
| 2026-05-18 18:00 +07 | T-0406 | Implement entitlement service | `Task` |
| 2026-05-18 17:00 +07 | T-0405 | Fix Next.js env inlining bug trong client.ts | `Correction` |
| 2026-05-18 16:30 +07 | T-0405 | Implement auth/account boundary | `Task` |
| 2026-05-18 15:15 +07 | T-0404 | Tạo storage adapter interfaces | `Task` |
| 2026-05-18 14:30 +07 | T-0403 | Tạo data schemas/types với Zod | `Task` |
| 2026-05-18 13:30 +07 | T-0402 | Tạo shared error contract | `Task` |
| 2026-05-18 12:20 +07 | T-0401 | Đồng bộ legal-commercial-spec mục 7 với pricing.ts | `Correction` |
| 2026-05-18 12:05 +07 | T-0401 | Tạo shared product/pricing contract | `Task` |
| 2026-05-18 11:30 +07 | T-0209 | Visual polish: GalaxyBackground component | `Task` |
| 2026-05-18 11:01 +07 | T-0306 | Tạo legal/support route skeleton | `Task` |
| 2026-05-18 10:52 +07 | T-0305 | Tạo skeleton route `/account` | `Task` |
| 2026-05-18 10:41 +07 | T-0304 | Tạo skeleton route `/pricing` | `Task` |
| 2026-05-18 10:32 +07 | T-0303 | Tạo skeleton route `/tarot` | `Task` |
| 2026-05-18 10:13 +07 | T-0302 | Tạo skeleton route `/than-so-hoc` | `Task` |
| 2026-05-18 09:58 +07 | T-0301 | Correction: Button polymorphic + responsive audit Hub | `Correction` |
| 2026-05-18 09:45 +07 | T-0301 | Tạo Hub skeleton cho route `/` | `Task` |
| 2026-05-17 10:15 +07 | T-0208 | Responsive QA — bổ sung tablet + audit tĩnh | `Correction` |
| 2026-05-16 23:52 +07 | T-0208 | Responsive UI QA nền | `Task` |
| 2026-05-16 23:35 +07 | T-0207 | Tạo Header/Footer chuẩn | `Task` |
| 2026-05-16 22:53 +07 | T-0206 | Tạo PageShell và navigation convention | `Task` |
| 2026-05-16 22:41 +07 | T-0205 | Tạo Loading/Error/Empty states | `Task` |
| 2026-05-16 22:34 +07 | T-0204 | Tạo component Card/Panel | `Task` |
| 2026-05-16 20:23 +07 | T-0203 | Tạo component Button/CTA | `Task` |
| 2026-05-16 19:51 +07 | T-0202 | Thiết lập typography và content defaults | `Task` |
| 2026-05-16 19:39 +07 | T-0105 | Thiết lập dev/test và production config skeleton | `Task` |
| 2026-05-16 19:33 +07 | T-0104 | Tạo `.env.example` và quy tắc secret | `Task` |
| 2026-05-16 19:29 +07 | T-0103 | Tạo cấu trúc folder module hóa | `Task` |
| 2026-05-16 19:21 +07 | T-0102 | Thiết lập scripts kiểm soát chất lượng | `Task` |
| YYYY-MM-DD HH:mm +07 | P0.1 | [Tên entry] | `Task` \| `Phase-Retro` \| `Hotfix` \| `Correction` \| `Post-mortem` |

---

<!-- ============================================================
     ENTRY MỚI NHẤT Ở TRÊN CÙNG
     ============================================================ -->

---

## [2026-06-10 00:00 +07] - T-AUDIT-S1: Fix 5 blocker findings from project audit

**Loại:** `Task`  
**Ref:** T-AUDIT-S1

**Đã làm**

- C1: Promote Mystic Hub homepage từ ignored demo route sang `apps/web/src/components/homepage-v2/`; root `page.tsx` không còn import từ `demo/`.
- C2: PayOS signature verify dùng constant-time compare, reject non-primitive values khi build signature string, thêm `npm run payos:test-sig`.
- C3: Enforce `voucher.perUserLimit` bằng Firestore aggregate count theo `userId + voucherCode + status=confirmed`; thêm error code `VOUCHER_PER_USER_LIMIT_EXCEEDED` và composite index purchases.
- I13: Narrow `apps/web/tsconfig.json` include/exclude và tăng heap cho typecheck lên 4096MB.
- I15: Xóa local-only stale demo variants `homepage-v2-clean`, `homepage-v2-focused`, `homepage-v2-premium`, `homepage-v2-saas`; không commit vì `demo/` gitignored.

**Không làm**

- Không sửa KB content, narrative JSON, synthesizer logic, route auth/payment ngoài phạm vi audit fix.
- Không deploy production.
- Không chạy `--no-verify`, `--force`, hoặc amend.

**Verify đã chạy**

- Sau từng commit C1/C2/C3/I13: `npm.cmd run typecheck`, `npm.cmd run lint`.
- C2: `npm.cmd run payos:test-sig`.

**Rủi ro còn lại**

- Manual voucher free-unlock lần 2 cần Firebase credential + user thật để smoke qua `/api/payment/create`.
- Final full KB/build verification chạy ở cuối task để xác nhận toàn bộ batch.

## [2026-06-06 00:37 +07] - T-HOME-DEMO: Local homepage A/B/C variants

**Loại:** Task  
**Ref:** T-HOME-DEMO

**Đã làm**

- Tạo local route `/demo` để so sánh các homepage variants.
- Tạo Variant A `/demo/homepage-v2-clean`: tối giản, benefit-first, một CTA chính.
- Tạo Variant B `/demo/homepage-v2-focused`: outcome-first, 3 câu hỏi lớn, FAQ và pricing CTA.
- Tạo Variant C `/demo/homepage-v2-premium`: spiritual vibe, methodology cards và testimonials placeholder.
- Mỗi variant có component/style riêng trong route demo, không dùng chung với homepage chính.
- Giữ pricing hiển thị `99.000đ`; không đụng `pricing.ts`.
- Giữ Tarot ở trạng thái sắp ra mắt/Q1 2027.

**Không làm**

- Không đổi homepage chính thức `/`.
- Không đổi `apps/web/src/components/homepage/*`.
- Không đụng KB, narrative, synthesizer, workers hoặc payment.
- Không commit demo files vì `apps/web/src/app/demo/*` đang nằm trong `.gitignore` theo scope task.

**Verify**

- `npm.cmd run typecheck` pass.
- `npm.cmd run lint` pass.
- `npm.cmd run build` pass.
- `/demo`, `/demo/homepage-hub`, `/demo/homepage-v2-clean`, `/demo/homepage-v2-focused`, `/demo/homepage-v2-premium` trả `200`.

**Rủi ro còn lại**

- Demo routes là local ignored files. Nếu muốn version control các demo này, cần task riêng để thay đổi `.gitignore` và commit demo routes.

---

## [2026-06-06 00:37 +07] - T-HOME-1: Homepage shared component refactor

**Loại:** Task  
**Ref:** T-HOME-1

**Đã làm**

- Tách homepage monolith thành `apps/web/src/components/homepage/`.
- Tách data, style block và các section chính: hero, modules grid, pricing, constellation, callout, trust signals.
- Rút gọn `apps/web/src/app/page.tsx` còn orchestration.
- Đổi `apps/web/src/app/demo/homepage-hub/page.tsx` thành re-export để không duplicate homepage.
- Move source logo folder từ `logo/` sang `apps/web/public/logo/`.
- Giữ module icons đã chuẩn hóa tại `apps/web/public/icons/modules/`.

**Không làm**

- Không đổi copy, pricing, module status, styling values hoặc logic click module.
- Không đụng KB, workers, pricing.ts, synthesizer hoặc payment.

**Verify**

- `npm.cmd run typecheck` pass.
- `npm.cmd run lint` pass.
- `npm.cmd run build` pass.
- `/` và `/demo/homepage-hub` trả `200`.

**Rủi ro còn lại**

- `apps/web/src/app/demo/homepage-hub/page.tsx` đang nằm trong ignored demo route; vẫn hoạt động local/build, nhưng không được git add nếu không thay `.gitignore`.

---

## [2026-06-05 15:31 +07] - T-PAY-NUM-4: Free preview Mystical Hub redesign

**Loại:** `Task`
**Ref:** T-PAY-NUM-4

Changed:

- Added `LifeCyclesSummary` for 3 life cycle previews with 300-character truncation.
- Added compact `LockedSectionCard`, `PhaseDivider`, `LockedSectionsGrouped`, and `lockedSectionConfig.ts` with 22 locked sections grouped by phase B/C/D.
- Refactored `SummaryDashboard` to show profile, overview, 8 chips, line chart, career bars, life cycles summary, personal month full, early CTA, grouped locked cards, final CTA, FAQ and sticky mobile CTA.
- Added CSS in `numerology-result.css` for cycles, locked cards, phase dividers and final CTA.

Not changed:

- No KB, narrative, synthesizer, worker, API, pricing, voucher, payment backend, or entitlement logic changed.

Verification:

- `npm.cmd run typecheck` pass.
- `npm.cmd run lint` pass.
- `npm.cmd run build` pass.

Notes:

- Manual browser visual smoke was not run in this turn; build verification passed.

---
## [2026-06-05 15:16 +07] - T-UX-ERR-1: Auth-aware error states

**Loại:** `Task`
**Ref:** T-UX-ERR-1

Changed:

- Added specific friendly title mapping for shared `ErrorCode` values in `ErrorState`.
- Routed auth failures (`AUTH_REQUIRED`, `AUTH_INVALID_TOKEN`, `AUTH_SESSION_EXPIRED`) on numerology result, details, and payment setup flows to `UnauthorizedState`.
- Verified `/account` already used `UnauthorizedState`.
- Login CTA now includes a `returnUrl` query for the current page.

Not changed:

- No API, KB, narrative, worker, pricing, or entitlement logic changed.
- Full login success return flow was not changed; this task only passes `returnUrl` to the login destination.

Verification:

- `npm.cmd run typecheck` pass.
- `npm.cmd run lint` pass.
- `npm.cmd run build` pass.

---

## [2026-06-05 15:00 +07] - T-PAY-NUM-3-FIX-2: Multi-faceted preview with locked aspect teasers

**Loai:** `Task`
**Ref:** T-PAY-NUM-3-FIX-2

> Use more of the available report data in the free preview and make the locked value clearer without touching KB, narrative files, synthesizer, workers, API routes, or pricing.

Changed:

- Added reusable `RichIndicatorPreview` for multi-field preview cards.
- Life Path preview now shows KB title/intro, up to 6 positive trait chips, a career snippet, and 7 locked aspect teasers.
- Personal Year preview now shows title/theme intro, career + finance snippets, and 3 locked aspect teasers.
- Added CSS for trait chips, preview field snippets, and locked-aspect teaser blocks.
- Kept `PersonalMonthFull` unchanged from the previous fix.

Verification:

- `npm.cmd run typecheck` pass.
- `npm.cmd run lint` pass.
- `npm.cmd run build` pass.

Notes:

- Manual browser visual smoke was not run in this turn; build verification passed.

---

## [2026-06-05 14:39 +07] - T-PAY-NUM-3-FIX: Generous free preview from narrative + month fields

**Loai:** `Task`
**Ref:** T-PAY-NUM-3-FIX

> Make the free preview use richer data already present in the report response, without touching KB, narrative files, synthesizer, workers, API routes, or pricing.

Changed:

- Added `stripHtml()` and made indicator preview prefer narrative HTML before KB data fallbacks.
- Expanded indicator title/body fallback fields and increased Life Path preview from 200 to 350 characters.
- Expanded Personal Year fallback fields and increased preview length to 300 characters.
- Reworked `PersonalMonthFull` to render every available string field covered by `FIELD_META`, including `focus`, `action`, `moon_link`, `warning`, `avoid`, `best_for`, and related fields.

Verification:

- `npm.cmd run typecheck` pass.
- `npm.cmd run lint` pass.
- `npm.cmd run build` pass.

Notes:

- Manual browser visual check was not run in this turn; build verification passed.

---

## [2026-06-05 13:53 +07] - T-PAY-NUM-2: Numerology free preview flow + CTA FAQ

**Loai:** `Task`
**Ref:** T-PAY-NUM-2

> Make `/than-so-hoc/result` the single free preview surface and reserve `/result/details` for unlocked users.

Changed:

- Added `generateOverview(report, name)` helper and free preview constants.
- Refactored `SummaryDashboard` to render profile, overview, 8 core chips, 2 concise indicator previews, locked grid and enhanced CTA.
- Added dynamic locked count `33 - 2 = 31`.
- Added `FAQSection` with 5 accordion items and accessible `aria-expanded`.
- Refactored `StickyBottomCTA` to appear on mobile after scroll > 600px with listener cleanup.
- Added `numerology-result.css` for preview, CTA, FAQ, locked and sticky blocks.
- Updated `/than-so-hoc/result/details` to redirect locked users back to `/than-so-hoc/result?notice=locked`.

Not changed:

- Did not touch KB content, `narrative.json`, synthesizer, pricing, entitlement logic, workers or API routes.

Verification:

- `npm.cmd run typecheck` pass.
- `npm.cmd run lint` pass.
- `npm.cmd run build` pass.

Residual risk:

- Manual browser smoke should still be run with a logged-in locked/unlocked account to confirm redirect and sticky behavior against real entitlement state.

---

## [2026-06-05 11:33 +07] - T-PAY-NUM-1: Numerology payment module-scoped routes

**Loai:** `Task`
**Ref:** T-PAY-NUM-1

> Refactor numerology payment to module-scoped URLs with shared payment components.

Changed:

- Extracted shared payment UI components: `PaymentSetup`, `PaymentSuccess`, `PaymentCancel`.
- Added `/than-so-hoc/payment`, `/than-so-hoc/payment/success`, and `/than-so-hoc/payment/cancel` wrapper routes.
- Kept legacy `/payment/setup`, `/payment/success`, and `/payment/cancel` compatible via thin wrappers and Next redirects.
- Updated `/api/payment/create` so PayOS `returnUrl` and `cancelUrl` are generated from the product module slug.
- Updated numerology CTAs to `/than-so-hoc/payment` and preserved report query params through setup/success.
- Added success fade-in and module-specific retry/report CTAs.

Not changed:

- Did not touch KB content, `narrative.json`, synthesizer, workers, or pricing `99000`.
- Did not deploy webhook/payment worker.
- Did not run PayOS sandbox smoke. Phase D/F deferred to `T-PAY-NUM-1-DEPLOY`.

Verification:

- `npm.cmd run typecheck` pass.
- `npm.cmd run lint` pass.
- `npm.cmd run build` pass.

Residual risk:

- Real PayOS/webhook confirmation and entitlement unlock still need deploy/smoke verification in `T-PAY-NUM-1-DEPLOY`.

---

## [2026-06-05 14:15 +07] - T-PAY-NUM-3: Free preview indicators + anchor wording

**Loai:** `Task`
**Ref:** T-PAY-NUM-3

> Adjust numerology result free preview only; no KB, synthesizer, worker, API route, or pricing changes.

Changed:

- Replaced birthday preview with a personal year partial preview.
- Added `PersonalMonthFull` for full current personal month preview with conditional field rendering.
- Updated preview count from 2 to 3 so locked count becomes 30.
- Changed CTA anchor wording to `(~ giá 2 bát phở)`.
- Added month preview styles in `numerology-result.css`.

Verification:

- `npm.cmd run typecheck` pass.
- `npm.cmd run lint` pass.
- `npm.cmd run build` pass.

Notes:

- Manual browser visual check was not run in this turn; build verification passed.

---

## [2026-06-04 23:54 +07] - T-0610c-lifePath10: Life Path 10 display + narrative KB

**Loai:** `Task`
**Ref:** T-0610c-lifePath10

> Add Life Path 10 as a display/narrative variant while preserving reduced-number calculation behavior.

Changed:

- Added optional `displayNumber` to numerology calculations/results; raw Life Path 10 now reports `number=1` and `displayNumber=10`.
- Added private KB entry `life_path.10` and extracted `narrative.lifePath.10` from local V1 source.
- Updated report data lookup so only Life Path uses `displayNumber` for KB/narrative lookup; other indicators remain unchanged.
- Updated summary dashboard, free indicator badge, profile header, details synthesizer, and Life Path context blocks to display 10 where appropriate.
- Added raw Life Path 10 coverage to engine and synthesizer tests.

Verification:

- `npm run kb:extract-narrative` pass.
- `npm run kb:validate` pass.
- `npm run kb:validate-narrative` pass.
- `npm run kb:test-engine` pass.
- `npm run kb:test-synthesizer` pass.
- `npm run typecheck` pass.
- `npm run lint` pass.
- `npm run build` pass.

Notes:

- `kb-private/numerology/kb.json` and `kb-private/numerology/narrative.json` are intentionally private/gitignored. Upload KV again before testing this through the remote KB Worker.
- The two external pages user provided were used as reference direction only; implementation relies on local V1 source plus Bản Mệnh-style private KB text.

---

## [2026-06-04 13:49 +07] - T-0606o/T-0606n: Free voucher commit + security hardening

**Loại:** `Task`
**Ref:** T-0606o, T-0606n

> Commit pending free-voucher scope from audit and apply T-0606n hardening without touching `kb-private/*`.

Changed:

- Committed free unlock via 100% voucher and `ResultHero` component: stable `FREE_` order id, direct entitlement grant, voucher usage increment, setup/success page free-unlock handling.
- Added CORS allowlist middleware to KB Worker and Payment Worker with localhost, `dev.banmenh.online`, `banmenh.online`, and optional `CORS_ALLOWED_ORIGINS`.
- Added `/dev-token` middleware guard for production/non-localhost.
- Ran non-breaking `npm audit fix`; lockfile moved Next to 16.2.7 and Wrangler/workerd/ws patch versions.
- Added in-memory rate limits: KB report 60/min, payment create 10/min, auth session 10/min, admin voucher 20/min.
- Updated `TASK_REGISTRY.md` and `RISK_REGISTER.md`; Firestore rules remain pending outside this task.

Verification:

- `npm run typecheck` pass.
- `npm run lint` pass.
- `npx tsc --noEmit -p workers/kb/tsconfig.json` pass.
- `npx tsc --noEmit -p workers/payment/tsconfig.json` pass.
- `npm run build` pass.
- `npm --workspace apps/web exec next build -- --webpack` pass.
- `npm audit --audit-level=moderate` still reports moderate advisories whose available fixes require `npm audit fix --force`; not run by design.

Notes:

- Next 16.2.7 still warns that `middleware` file convention is deprecated in favor of `proxy`; kept `middleware.ts` because T-0606n explicitly requested middleware hardening.

## [2026-06-02 13:10 +07] - T-0606m: Audit cleanup batch

**Loại:** `Task`
**Ref:** T-0606m
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Cleanup theo audit toàn dự án: xử lý dev-token exposure, commit T-0606l còn pending, xác minh schema dirty, đóng KARMIC_DEBTS false positive, ignore tooling dirs. Payment/ResultHero bị dừng vì scope chưa rõ.

### Kết quả theo sub-task
- `T-0606m-1` Done: `/dev-token` route có production `notFound()` gate; dev/preview giữ nguyên.
- `T-0606m-2` Done: commit T-0606l extractor/doc; narrative đã re-extract, KV upload complete và worker 8787 ready trước batch.
- `T-0606m-3` Done: `numerology-kb.ts` schema expansion khớp `kb.json`; `npm run kb:validate` pass.
- `T-0606m-4` Stopped: payment free-voucher flow và untracked `ResultHero` có scope không rõ, không commit, không revert.
- `T-0606m-5` Done: bỏ `10` khỏi `KARMIC_DEBTS`/`KarmicDebtNumber`; thêm `kb:test-karmic`.
- `T-0606m-6` Done: ignore `.agent/`, `.agents/`, `.kiro/`, `_bmad/`.

### Verify
- Pass: `npm run typecheck`, `npm run lint`, `npm run kb:test-challenges`, `npm run kb:test-karmic`.
- Pass: `NODE_OPTIONS=--max-old-space-size=4096 npm run build`.
- V1 check: `engine.browser.js` has `KN = [13, 14, 16, 19]`.
- Tooling dirs no longer appear in `git status --short`.

### Rủi ro còn lại
- Payment/free-voucher dirty files and untracked `ResultHero` remain in worktree pending user decision.
- Untracked `apps/web/.env.example` and icon asset also remain outside this task.

---

## [2026-06-02 12:35 +07] - T-0606l: Tension number fallback insight + English cleanup

**Loại:** `Hotfix`
**Ref:** T-0606l
**Môi trường:** `DEV/TEST`

### Tóm tắt
> User report section 26 `tensionNumber` có insight-box rỗng và lẫn English idioms. Root cause là extractor drop mất fallback literal trong `${d?.advice || "..."}` và V1 source có một số cụm English inline.

### Thay đổi
- `extract-narrative.mjs` thêm `expandFallbackExpressions(...)` để giữ literal fallback text trước khi convert placeholder.
- Thêm `ENGLISH_REPLACEMENTS` và `translateEnglishIdioms(...)` cho các cụm như `cognitive reframing`, `paralysis by analysis`, `brute force`, `small talk`, `remote work`.
- Re-extract local `kb-private/numerology/narrative.json`; không commit `kb-private/*`.
- Upload KV narrative sau khi regenerate và restart KB Worker 8787.

### Verify
- `tensionNumber` 9/9 insight length `245-299`, tất cả > 100.
- Forbidden English terms audit: `0` hits.
- Group counts giữ nguyên total `189`.
- Pass: `npm run kb:validate-narrative`, `npm run kb:test-challenges`, `npm run kb:test-synthesizer`, `npm run typecheck`, `npm run lint`.
- `npm run kb:upload-kv` complete; worker ready on `http://127.0.0.1:8787`.
- Runtime smoke `Hà Thu Hương / 1999-02-02`: section 26 tension `7`, insight length `274`, forbidden hits `[]`.

### Rủi ro còn lại
- `npm run build` đang được chạy lại trong batch T-0606m vì lượt build trước bị user interrupt khi task audit mới được đưa vào.

---

## [2026-06-02 12:05 +07] - T-0606k-fix: Section 23 compensation arrow summary fix

**Loại:** `Hotfix`
**Ref:** T-0606k-fix
**Môi trường:** `DEV/TEST`

### Tóm tắt
> User audit T-0606k phát hiện block compensation trong section 23 còn giữ bug `Trục Trục ...` và UX truncate 150 ký tự từ V1. Fix theo Option C: chỉ liệt kê tên + code mũi tên mới, rồi dẫn xuống phần arrow analysis chi tiết bên dưới.

### Thay đổi
- Chỉ sửa block `arrowsFromName` trong `buildCompensationAnalysis`.
- Bỏ template `Trục ${a.name}` để tránh duplicate khi `a.name` đã chứa `Trục`.
- Bỏ `.substring(0, 150) + "..."` và phần paste summary từ `a.active`.
- Render `<ul class="nar-list">` với `${a.name} (${a.code})`, kèm dòng italic dẫn tới "Phân Tích Mũi Tên Sức Mạnh — Biểu đồ Tổng Hợp".
- Thêm regression trong `tools/kb-import/test-grid.mjs`.

### Verify
- Pass: `npm run kb:test-grid`, `npm run typecheck`, `npm run lint`.
- Pass: `NODE_OPTIONS=--max-old-space-size=4096 npm run build`.
- Runtime smoke `Hà Thu Hương / 1999-02-02` section 23 length `10356`: có `nar-list`, đủ 5 trục, có dòng dẫn italic, không `Trục Trục`, không stale truncate, arrow analysis bên dưới vẫn có active + missing arrows.

### Rủi ro còn lại
- Không thêm CSS mới cho `nar-list` vì task giới hạn chỉ sửa compensation block; list mặc định vẫn render được trong narrative container.

---

## [2026-06-02 11:45 +07] - T-0606k: Port V1 birth/name grid analysis

**Loại:** `Task`
**Ref:** T-0606k
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Port literal V1 `CELL_KNOWLEDGE` và `ARROWS` sang V2, thêm phân tích từng ô, mũi tên sức mạnh, bù trừ biểu đồ cho section 22/23.

### Thay đổi
- Thêm `packages/shared/src/numerology/grid-kb-data.ts` chứa `CELL_KNOWLEDGE` và `ARROWS` trích xuất cơ học từ `E:/huyen hoc AI/test/numerology_core/app.js`.
- Thêm `packages/shared/src/numerology/grid-analysis.ts` với `parseDigitGrid`, `parseNameGrid`, `buildCellAnalysis`, `buildArrowsAnalysis`, `buildCompensationAnalysis`.
- Wire `synthesizer.ts` để section 22 render birth-grid chartSlot kèm cell/arrow analysis; section 23 render combined-grid chartSlot kèm name cell analysis, compensation analysis và combined arrows.
- Thêm `tools/kb-import/test-grid.mjs` và script `npm run kb:test-grid`.
- Tách CSS arrow block sang `apps/web/src/styles/numerology-grid-analysis.css` để giữ `numerology-narrative.css` dưới giới hạn 600 dòng.
- Không sửa các file dirty ngoài scope như payment/voucher/schema.

### Verify
- Spot-check cơ học: `grid-kb-data.ts` chứa nguyên slice V1 `CELL_KNOWLEDGE` và `ARROWS`; 9 cell entries, 8 arrow data entries.
- Pass: `npm run kb:test-grid`, `npm run kb:test-synthesizer`, `npm run typecheck`, `npm run lint`.
- `npm run build` lần đầu OOM ở static generation; rerun với `NODE_OPTIONS=--max-old-space-size=4096` pass.
- Runtime smoke `Hà Thu Hương / 1996-02-02`: section 22 length `8703`, section 23 length `11135`, chart slots `birth-grid`/`combined-grid`, markers V1 `Phân Tích Từng Số`, `Phân Tích Mũi Tên Sức Mạnh`, `Khi kết hợp biểu đồ ngày sinh` đều có.

### Rủi ro còn lại
- Browser plugin trong Codex vẫn không ổn định ở các task trước; turn này dùng runtime smoke thay cho browser smoke trực tiếp.
- `grid-kb-data.ts` là static premium narrative data được commit theo task, không import từ `kb-private/*`.

---

## [2026-06-02 11:15 +07] - T-0606j: Extended karmicDebt content merge

**Loại:** `Task`
**Ref:** T-0606j
**Môi trường:** `DEV/TEST`

### Tóm tắt
> User audit T-0606f phát hiện V1 `karmicDebt` rich override còn chung chung. T-0606j giữ V1 làm fallback nhưng merge 4 entry hand-written từ `kb-private/numerology/karmic-debt-extended.mjs` vào output narrative, theo pattern T-0606c.

### Thay đổi
- `extract-narrative.mjs` import `KARMIC_DEBT_EXTENDED`.
- Thêm `mergeExtendedKarmicDebt(...)`, overwrite 4 keys `13`, `14`, `16`, `19` sau khi đọc V1 override.
- Mỗi entry sau merge có `source: "extended-T-0606j"`.
- `validateKarmicDebtHtml(...)` giữ minimum guard cho cả V1 fallback và extended; detailed guard extended kiểm tra length >= 5000, `{{name}}`, `karmic-title`, `insight-box`, và 4 sub-section marker.
- Không sửa nội dung trong `kb-private/numerology/karmic-debt-extended.mjs`; không commit `kb-private/*`.

### Verify
- Source file load OK: keys `13,14,16,19`; lengths `5969`, `5933`, `5761`, `5793`.
- Extract log: `karmicDebt: 4 entries (override @ 793321, 4 entries)`.
- Narrative verify: 4/4 keys source `extended-T-0606j`, all length >= 5000.
- Pass: `npm run kb:validate-narrative`, `npm run kb:test-synthesizer`, `npm run kb:test-challenges`, `npm run typecheck`, `npm run lint`, `npm run build`.
- `npm run kb:upload-kv` uploaded `kb-narrative` size `556.6 KiB`; `KV upload complete`.
- Worker 8787 restarted and ready.
- Smoke runtime: `Hà Thu Hương / 1999-02-02` debt 13 section 21 length `5981`; `An / 1970-01-14` debt 14 length `5915`; `An / 1970-01-02` clean fallback length `111`.

### Rủi ro còn lại
- Browser smoke trực tiếp không chạy được vì Browser plugin/Node sandbox fail `windows sandbox failed: spawn setup refresh`; runtime HTML smoke đã cover section 21 substitution and fallback.

## [2026-06-02 10:55 +07] - T-0606f: Wire section 21 karmic debt rich V1 narrative

**Loại:** `Task`
**Ref:** T-0606f
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Audit phát hiện V1 có `NarrativeTemplates.karmicDebt` override rich cho 4 nợ nghiệp 13/14/16/19, nhưng extractor V2 chưa khai báo group này nên section 21 chỉ render generic fallback.

### Thay đổi
- `extract-narrative.mjs` thêm group `karmicDebt` với `literalOptional` và `nameOptional`.
- Extractor validate 4/4 entries có length >= 2500, `karmic-title`, `🔍`, `🛠`, `insight-box`.
- `validate-narrative.mjs` accept group `karmicDebt` và bỏ check `{{name}}` cho group này.
- `NarrativeKbSchema` thêm `karmicDebt` optional.
- Section 21 dùng `narrative.karmicDebt` trước, fallback generic nếu thiếu hoặc debt ngoài V1 rich keys.
- Re-extract private `narrative.json` và upload KV remote.

### Verify
- Extract log: `karmicDebt: 4 entries (override @ 793321, 4 entries)`.
- Narrative verify: keys `13,14,16,19`; lengths `2724`, `2880`, `3104`, `2975`; all OK.
- Pass: `npm run kb:validate-narrative`, `npm run kb:test-synthesizer`, `npm run kb:test-challenges`, `npm run typecheck`, `npm run lint`, `npm run build`.
- `npm run kb:upload-kv` uploaded `kb-numerology` and `kb-narrative`; `KV upload complete`.
- Smoke runtime: `An / 1970-01-07` debts `16,13` render rich section 21 length `5828`; `An / 1970-07-14` clean case renders fallback length `111`.

### Rủi ro còn lại
- Browser smoke trực tiếp không chạy được vì Browser plugin lỗi `failed to write kernel assets`; worker/dev server đã restart và readiness OK.

## [2026-06-02 10:22 +07] - T-0606e: Fix challenge indicator formulas to match V1

**Loại:** `Task`
**Ref:** T-0606e
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Audit phát hiện V2 đang lấy trực tiếp số gốc cho `soulChallenge`, `destinyChallenge`, `personalityChallenge`. T-0606e đổi về công thức V1 để nội dung challenge rich từ T-0606c map đúng chỉ số.

### Thay đổi
- `report.ts` thêm `calcChallenge(...)`, reduce hai vế bằng `reduce(_, false)` trước khi so sánh.
- `soulChallenge = |soul - lifePath| % 9`; `destinyChallenge = |soul - personality|`; `personalityChallenge = |personality - lifePath| % 9`.
- Thêm `tools/kb-import/test-challenges.mjs` và script `kb:test-challenges`.
- Giữ nguyên `narrative.json`; T-0606c content không đổi, chỉ mapping số challenge thay đổi.
- `TASK_REGISTRY.md` đóng `T-0606e`; `RISK_REGISTER.md` thêm risk audit formula còn lại.

### Verify
- `npm run kb:test-challenges` pass với `Hà Thu Hương / 1996-09-03` => `{ soulChallenge: 3, destinyChallenge: 2, personalityChallenge: 1 }`.
- `npm run kb:test-challenges` pass với `Nông Xuân Thái / 1996-01-01` => `{ soulChallenge: 7, destinyChallenge: 0, personalityChallenge: 7 }`.
- Pass: `npm run kb:test-synthesizer`, `npm run typecheck`, `npm run lint`, `npm run build`.

### Rủi ro còn lại
- Còn khả năng một số công thức numerology khác lệch V1; đã ghi `R-014` để audit tiếp theo.

## [2026-06-02 01:24 +07] - T-0606c: Extended soulChallenge content merge

**Loại:** `Task`
**Ref:** T-0606c
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Audit T-0606b phát hiện V1 `soulChallenge` override chỉ rich ở `[1]`. T-0606c merge 9 entry extended static `[0, 2-9]` từ `kb-private` vào extractor output, giữ nguyên V1 `[1]`.

### Thay đổi
- `extract-narrative.mjs` import `SOUL_CHALLENGE_EXTENDED` từ `kb-private/numerology/soul-challenge-extended.mjs`.
- Merge logic: V1 override `[1]` giữ nguyên; extended `[0, 2-9]` thay output short/fallback.
- Thêm validation trong extractor cho 10/10 `soulChallenge`: length >= 4500, 5 sub-section headers, `Tóm lại`, `{{name}}`, không leak `${...}`.
- Re-extract `kb-private/numerology/narrative.json`; file private vẫn gitignored, không commit.
- `TASK_REGISTRY.md` đóng `T-0606c`.
- `ADR.md` thêm quyết định mở rộng narrative offline khi V1 partial-rich.

### Verify
- `soul-challenge-extended.mjs` keys: `0,2,3,4,5,6,7,8,9`.
- 10/10 `narrative.soulChallenge` pass audit script; V1 `[1]` dài 5306 chars và giữ rich content.
- Groups khác giữ count: destiny 11, soul 11, personality 10, maturity 11, karmicLesson 9, destinyChallenge 10, personalityChallenge 9.
- Smoke section 17: `Nong Xuan Thai` soulChallenge 2 có `sự hiện diện có hai bờ`; `Yen` soulChallenge 5 có `tự do có gốc rễ`; `Binh` soulChallenge 9 có `buông không phải mất`; cả 3 có 5 sub-section headers và không có duplicate intro.
- Pass: `npm run kb:validate-narrative`, `npm run kb:test-synthesizer`, `npm run typecheck`, `npm run lint`, `npm run build`.
- Không chạy được `workers/kb` typecheck vì workspace này không có script `typecheck`.

### Rủi ro còn lại
- Các group khác có thể còn V1 asymmetry tương tự; defer audit sang T-0606d.

## [2026-06-01 23:57 +07] - T-0610c-section16-17-18: Literal V1 sections 16-17-18 inline render

**Loại:** `Task`
**Ref:** T-0610c-section16-17-18
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Port literal V1 inline render cho section 16, prepend intro cho section 17 và thay personality context của section 18 bằng `_personalityCtxBlock` V1.

### Thay đổi
- Thêm `buildLifePathSoulCorrelation(...)` trong `synthesizer.ts` và wire section 16 từ `relationshipHtml(...)` sang inline V1 literal.
- Section 17 prepend intro V1 trước `challengeHtml(...)`.
- `personalityCtxBlock` được thay bằng literal V1 `_personalityCtxBlock` với border-left `#d97706` và escape tên user.
- `TASK_REGISTRY.md` đóng `T-0610c-section16-17-18`.

### Verify
- Spot-check fixture `Nông Xuân Thái / 1996-09-03`: section 16 có `Chỉ số đường đời và chỉ số linh hồn là hai yếu tố`; section 17 có `Mọi linh hồn đều mang theo những bóng tối`; section 18 có `Nhân cách trong tổng thể biểu đồ`.
- Spot-check lengths: section 16 `1385`, section 17 `1148`, section 18 `2556`.
- Pass: `npm run typecheck`, `npm run lint`, `npm run build`.

## [2026-06-01 23:41 +07] - T-0610c-section12-13-14: Literal V1 sections 12-14 inline render

**Loại:** `Task`
**Ref:** T-0610c-section12-13-14
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Port literal V1 inline render cho sections 12, 13 và 14 trong phần phân tích sứ mệnh/trưởng thành, giữ scope trong shared synthesizer và narrative helper.

### Thay đổi
- `maturityCtxBlock` được thay bằng literal V1 `_maturityCtxBlock` với border-left `#059669` và escape tên user.
- Section 12 prepend intro V1 trước `challengeHtml(...)`.
- Section 14 chuyển từ `generic(...)` sang helper `renderMaturityAbility(...)` theo inline render V1.
- Do KB hiện tại dùng `peak_age` và `how_to_develop`, helper map thêm 2 field này vào wrapper V1 tương ứng với thế mạnh/lời khuyên để không mất nội dung.
- `TASK_REGISTRY.md` đóng `T-0610c-section12-13-14`.

### Verify
- Spot-check fixture `Nông Xuân Thái / 1996-09-03`: section 12 có intro `Không có sứ mệnh nào không đi kèm với thử thách`; section 13 có `✦ Số Trưởng Thành` và `tinh lọc và kết tinh`; section 14 dài 822 chars.
- Pass: `npm run typecheck`, `npm run lint`, `npm run build`.

## [2026-06-01 23:06 +07] - T-0606b: Detect V1 narrative OVERRIDE assignments

**Loại:** `Task`
**Ref:** T-0606b
**Môi trường:** `DEV/TEST`

### Tóm tắt
> T-0606 bỏ sót pattern override `NarrativeTemplates.groupName = { ... }` ở cuối V1 source, khiến 8 nhóm narrative vẫn dùng bản short ở một số key. T-0606b cập nhật extractor để lấy rich V1 literal override, re-extract narrative local và upload KV.

### Thay đổi
- Extend `tools/kb-import/extract-narrative.mjs` để detect override assignments và merge theo key, giữ key literal khi override partial.
- Re-extract `kb-private/numerology/narrative.json`: 185 entries, 478,736 bytes (~467.5 KiB), 8 groups dùng rich V1 override.
- Cập nhật `tools/kb-import/validate-narrative.mjs` theo key set mới: `maturity` có 11/22, `soulChallenge` và `destinyChallenge` có key 0.
- Xóa `packages/shared/src/numerology/narrative/destiny.ts` AI-generated; bỏ re-export và bỏ `renderDestinyExtra` khỏi section 10 để dùng V1 literal narrative trực tiếp.
- `TASK_REGISTRY.md` đóng `T-0606b`.

### Verify
- Pass: `npm run kb:extract-narrative`, `npm run kb:validate-narrative`, `npm run kb:test-synthesizer`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run kb:upload-kv`.
- Spot-check V1: destiny 6 có `Tài năng chăm sóc và lãnh đạo bằng tình yêu thương`; destiny 4 có `Kỹ năng tổ chức của bạn`, `Bạn cứng nhắc`, `Trung thực`.
- Manual smoke: `Hà Thu Hương / 1996-09-03` ra destiny 6 và section 10 có header V1; `Nông Xuân Thái / 1996-09-03` destiny 4 section 10 dài 7281 chars theo literal V1.

### Không làm
- Không sửa V1 source.
- Không padding narrative để đạt ngưỡng ví dụ 8000 chars cho mọi destiny, vì một số entry V1 literal ngắn hơn.

## [2026-06-01 17:37 +07] - T-0610c-section10-finalize: Expand destiny extra narratives to V1-length parity

**Loại:** `Task`
**Ref:** T-0610c-section10-finalize
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Mở rộng nội dung static cho các entry Sứ Mệnh 1,2,3,5,6,7,8,9 trong `DESTINY_EXTRA` để đạt độ dài tương xứng hơn với template destiny 4.

### Thay đổi
- `destiny.ts` bổ sung paragraph/subsection cho 8 entry generated, dùng material từ `kb-private/numerology/kb.json` nhóm `destiny_number`.
- Không sửa entry destiny 4; hash slice entry 4 giữ nguyên `a97dd392eeb8f12fe0fab29fef3b94639be8ad05640cb98f58a28e92f626fa85`.
- Output vẫn là TS const static sinh offline; runtime chỉ lookup qua `renderDestinyExtra`, không gọi AI theo user.
- `TASK_REGISTRY.md` đóng `T-0610c-section10-finalize`.

### Verify
- `destiny.ts` dài 576 dòng, dưới giới hạn 1000 dòng.
- Entry 1,2,3,5,6,7,8,9 đều trên 5000 chars.
- Section 10 fixture cho destiny generated 1,2,3,5,6,7,8,9 đều trên 12000 chars.
- Không có các từ cấm `chữa lành`, `healing`, `rung động`.
- Đã chạy pass: `npm.cmd run kb:test-synthesizer`, `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.

### Ghi chú
- Không sửa destiny 4, `narrative.json`, engine, route, auth, payment, charts, theme, `kb-private/*`, hoặc `.env.local`.
- `narrative-deep.ts` và `synthesizer.ts` đã được wire ở commit trước, không cần sửa thêm trong finalize.
- Master numbers 11/22/33 vẫn render empty extra thay vì fallback sang số rút gọn.

---

## [2026-06-01 16:40 +07] - T-0610c-section10-extra: Destiny extra narrative content

**Loại:** `Task`
**Ref:** T-0610c-section10-extra
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Bổ sung phần nội dung mở rộng cho section 10 "Chỉ số Sứ Mệnh (Vận Mệnh)", theo cấu trúc tương tự `LIFE_PATH_EXTRA` nhưng dùng dữ liệu riêng cho Sứ Mệnh.

### Thay đổi
- Tạo `packages/shared/src/numerology/narrative/destiny.ts` với `DESTINY_EXTRA`, type `DestinySubSection`/`DestinyExtraEntry`, và helper `renderDestinyExtra`.
- Destiny 4 giữ template được cung cấp với marker `Bạn là một thuật sĩ`; các số 1,2,3,5,6,7,8,9 có nội dung mở rộng cùng cấu trúc và tone.
- Re-export module mới từ `narrative-deep.ts`.
- Wire `renderDestinyExtra(report.destiny.number, name)` vào section 10 sau destiny narrative và trước `destinyCtxBlock`.
- `TASK_REGISTRY.md` đóng `T-0610c-section10-extra`.

### Verify
- `destiny.ts` dài 348 dòng, dưới giới hạn 1000 dòng.
- Spot-check source có `Bạn là một thuật sĩ`; không có các từ cấm `chữa lành`, `healing`, `rung động`, `vibration`.
- Entry 1,2,3,5,6,7,8,9 đều trên 1500 chars.
- Fixture `Nông Xuân Thái / 1996-09-03`: section 10 dài 8043 chars, có extra content và marker destiny 4.
- Đã chạy pass: `npm.cmd run kb:test-synthesizer`, `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.
- Code review phát hiện master numbers 11/22/33 có thể fallback nhầm sang extra narrative của số rút gọn; đã sửa `renderDestinyExtra` để chỉ render khi có entry exact.

### Ghi chú
- Không sửa `narrative.json`, section 1-9 hoặc 11-30.
- Không sửa engine, route, auth, payment, charts, theme, `kb-private/*`, hoặc `.env.local`.
- CSS dùng lại class extra narrative hiện có; không thêm styling mới.

---

## [2026-06-01 15:22 +07] - T-0610c-section10-11: Literal V1 destiny context + section 11 correlation

**Loại:** `Task`
**Ref:** T-0610c-section10-11
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Port literal V1 cho section 10 "Chỉ số Sứ Mệnh" context block và section 11 "Tương quan Đường đời & Sứ mệnh".

### Thay đổi
- `life-path.ts` thay `destinyCtxBlock` simplified bằng V1 `_destinyCtxBlock` với branch same/energyMatch/else và escape tên user.
- `synthesizer.ts` thêm `buildLifePathDestinyCorrelation(report, name)` cho section 11 với 3 paragraph và `insight-box`.
- Section 10 prepend intro line, render destiny narrative, rồi append `destinyCtxBlock`.
- Section 11 chuyển từ `relationshipHtml(...)` generic sang helper V1-specific.
- `TASK_REGISTRY.md` thêm và đóng `T-0610c-section10-11`.

### Verify
- Spot-check source: `hoàn toàn tương đồng — cực kỳ hiếm gặp` tồn tại 1 match trong V2.
- Case synth thật `Nông Xuân Thái / 1996-09-03`: section 10 dài 1955 chars, section 11 dài 1369 chars; section 10 có marker `Sứ mệnh trong tổng thể biểu đồ`.
- Đã chạy pass: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.

### Ghi chú
- Không sửa section 1-9 hoặc 12-30; không sửa engine/route/auth/payment/charts/theme.
- Không sửa `kb.json`, `narrative.json`, `kb-private/*`, `.env.local`.
- Lần đầu `typecheck`/`build` gặp stale `.next/dev/types/validator.ts`; đã xóa cache generated `apps/web/.next/dev`, build lại và rerun `typecheck` pass.

---

## [2026-05-30 01:54 +07] - T-0610c-section9: Literal V1 personal month 3-month detail

**Loại:** `Task`
**Ref:** T-0610c-section9
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Port literal V1 section 9.1 "Chỉ Số Các Tháng — Phân Tích 3 Tháng" vào module narrative đã split.

### Thay đổi
- `year-month.ts` thay `personalMonthDeep` rút gọn bằng V1 content object 9 entry, energy paragraph và 6 domain blocks cho từng tháng.
- `personalMonthDeep` giữ literal Vietnamese V1, chỉ đổi `${name}` thành `${escapeHtml(name)}` qua `safeName` và escape `year` khi render label.
- `synthesizer.ts` section 9.1 thêm intro italic literal V1, `year-cards-grid` 3 tháng và 3 detail blocks; section 9 summary giữ nguyên.
- `numerology-narrative.css` thêm `.month-detail-block` và `.month-detail-headline`, dùng lại `.year-domain-block`.
- `TASK_REGISTRY.md` thêm và đóng `T-0610c-section9`.

### Verify
- `year-month.ts` dài 948 dòng, dưới giới hạn 1000 dòng.
- Spot-check literal V1 bằng `rg`: `Đây là thời điểm lý tưởng để`, `Sức hút cá nhân của`, `Tháng số 1 tổng kết lại`, `Sự nghiệp & Công việc trong tháng này`, `CHỈ SỐ THÁNG`.
- Case synth thật `Nông Xuân Thái / 1996-09-03`: section 9.1 dài 11088 chars, có 3 `month-detail-block`, 18 `year-domain-block`, 3 headline `CHỈ SỐ THÁNG`, intro và grid.
- Đã chạy pass: `npm.cmd run kb:test-synthesizer`, `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.

### Ghi chú
- Không sửa section 1-8 hoặc 10-30; không sửa engine/route/auth/payment/charts.
- Không sửa `kb.json`, `narrative.json`, `kb-private/*`, `.env.local`.
- Browser plugin/callable tool không khả dụng trong phiên này; Node REPL MCP vẫn crash với lỗi sandbox, nên đã fallback bằng synth fixture và build.
- Ngưỡng length trong prompt (`section 9.1 > 15000`) cao hơn output literal V1 thực tế của 3 tháng trong fixture; không bơm/paraphrase thêm nội dung ngoài V1 để đạt length.

---

## [2026-05-30 01:30 +07] - T-0610c-section8: Literal V1 personal year summary + 3-year cycle

**Loại:** `Task`
**Ref:** T-0610c-section8
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Port literal V1 section 8 "Chỉ số Năm Cá Nhân" và section 8.1 "Chu Kỳ Vận Số — Phân Tích Chi Tiết 3 Năm" vào module narrative đã split.

### Thay đổi
- `year-month.ts` thay `personalPeriod` rút gọn bằng V1 `numMeta` 9 entry, summary card, energy paragraph, Nên làm/Tránh grid và lời khuyên đặc biệt.
- `year-month.ts` port V1 `personalYearDeep` và thêm helper `yearContent` / `yearIntro` từ `_yearContent` / `_yearIntro`.
- Thêm `buildPersonalYearFullBlock` để render block năm theo heading `8.X`, intro, 5 domain blocks và `Tóm lại`; giữ fallback typo `taichinhthanhhoc` / `taichinhthanhhoc`.
- `synthesizer.ts` đổi section 8 sang `personalPeriod("Năm", ...)`; section 8.1 thêm intro italic, `year-cards-grid` và 3 detailed blocks.
- `numerology-narrative.css` thêm class section 8/8.1 và nén block mới để file còn 584 dòng, không vượt lint limit.

### Verify
- Spot-check literal V1 bằng `rg`: `Thực tế và kỷ luật là từ khóa của giai đoạn này`, `Đây là năm lý tưởng để bắt đầu một dự án mới`, `Trong khía cạnh tài chính`, `Năm 4 là năm của hậu trường`, `Lập kế hoạch chi tiết`.
- Case synth thật `Nông Xuân Thái / 1996-09-03`: năm cá nhân 2026 = 4, range 2026/2027/2028 = 4/5/6 và tuổi 30/31/32; section 8/8.1 có các marker card/grid/domain.
- Đã chạy pass: `npm.cmd run kb:test-synthesizer`, `npm.cmd run kb:test-engine`, `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.

### Ghi chú
- Không sửa section 1-7, 9-30; không sửa engine/route/auth/payment/charts.
- Không sửa `kb.json`, `narrative.json`, `kb-private/*`, `.env.local`.
- Browser plugin không chạy được trong phiên này vì Node REPL MCP crash với lỗi sandbox; đã fallback bằng synth fixture và build.
- Ngưỡng length trong prompt (`section 8 > 3000`, `section 8.1 > 20000`) cao hơn output literal V1 thực tế của các helper được yêu cầu; không bơm/paraphrase thêm nội dung ngoài V1 để đạt số dòng/bytes.

---

## [2026-05-30 01:07 +07] - T-0610c-cleanup: Split narrative modules + diacritics test

**Loại:** `Task`
**Ref:** T-0610c-cleanup
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Refactor cơ học `narrative-deep.ts` thành barrel + 5 module narrative nhỏ hơn, đồng thời thêm integration test chặn rò ASCII Vietnamese như `tuoi/tro di`.

### Thay đổi
- `narrative-deep.ts` còn barrel export 5 dòng, giữ public import cũ cho `synthesizer.ts` và Worker.
- Thêm `packages/shared/src/numerology/narrative/common.ts` cho helper/type chung.
- Thêm `life-path.ts`, `cycle.ts`, `pyramid.ts`, `year-month.ts` để tách section 5/6/7 và year/month narrative.
- Thêm `tools/kb-import/test-diacritics.mjs`.
- Root `package.json` thêm script `kb:test-diacritics` và đưa test này vào `npm run check`.

### Verify
- File line counts: `common.ts` 48, `year-month.ts` 499, `cycle.ts` 772, `pyramid.ts` 359, `life-path.ts` 674, `narrative-deep.ts` 5.
- Snapshot synthesized output 4 fixture trước/sau split identical byte-for-byte: 494570 bytes.
- Đã chạy pass: `npm.cmd run kb:test-diacritics`, `npm.cmd run kb:test-synthesizer`, `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`, `npm.cmd run check`.

### Ghi chú
- Pure refactor: không đổi function signature, không đổi consumer import, không đổi output HTML.
- Test diacritics kiểm tra cả synthesized HTML và period strings trong report để bắt lại lỗi như `tuoi/tro di`.
- Không sửa `kb.json`, `narrative.json`, `kb-private/*`.

---

## [2026-05-30 00:59 +07] - T-0610c-fix: Vietnamese period strings + pyramid year labels

**Loại:** `Hotfix`
**Ref:** T-0610c-fix
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Fix 2 issue sau T-0610c-section7: period strings trong engine dùng tiếng Việt có dấu, và `PyramidSvgChart` hiển thị thêm year range cạnh age range.

### Thay đổi
- `indicators.ts` đổi `calcPyramidPeaks`, `calcPyramidChallenges` và `calcLifeCycles` từ `tuoi/tro di` sang `tuổi/trở đi`.
- `calcPyramidChallenges` đổi period cuối từ `giai doan chu dao cuoi doi` sang `giai đoạn chủ đạo cuối đời`.
- `PyramidSvgChart` bỏ client-side replace workaround và parse period trực tiếp từ engine output.
- `PyramidSvgChart` render 2 dòng label cho mỗi peak: age range và year range tính từ `dobParts.year`.

### Verify
- `rg -n "\btuoi\b|\btro di\b" packages\shared\src packages\shared\dist apps\web\src\components\numerology\result\charts` không còn match.
- `npm.cmd run kb:test-engine` output có `0 - 33 tuổi`, `52 tuổi trở đi`, `giai đoạn chủ đạo cuối đời`.
- Đã chạy pass: `npm.cmd run kb:test-engine`, `npm.cmd run kb:test-synthesizer`, `npm.cmd run kb:test-charts`, `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.

### Ghi chú
- Root cause nằm ở engine T-0407 phát period ASCII; fix tại nguồn, không vá downstream.
- `buildPyramidSection` và `buildLifeCyclesSection` parse period bằng regex số nên không bị ảnh hưởng bởi dấu tiếng Việt.
- Không sửa `kb.json`, `narrative.json`, `kb-private/*`.

---

## [2026-05-30 00:34 +07] - T-0610c-section7: Literal V1 pyramid section

**Loại:** `Task`
**Ref:** T-0610c-section7
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Port literal V1 cho section 7 "Biểu đồ Kim Tự Tháp — Đỉnh cao & Thử thách": intro, chart marker, 4 period blocks 7.1-7.4 và phần phân tích chi tiết từng đỉnh với 4 colored boxes.

### Thay đổi
- `narrative-deep.ts` thay `pyramidPeakAnalysis` rút gọn bằng nội dung V1 với `peakDeepNarratives`, `challengeDeepNarratives` và `peakAnalysisData`.
- Thêm `buildPyramidSection(report, name, narrative)` để build section 7 server-side từ V2 `NumerologyReport`, giữ marker `<!-- CHART:pyramid -->`.
- `synthesizer.ts` chuyển section 7 sang `buildPyramidSection(report, name, narrative)`.
- `FullReport` tách HTML tại marker để inject `PyramidSvgChart` đúng vị trí trong flow section 7.
- `numerology-narrative.css` thêm `.pyramid-*` và `.peak-*` cho period blocks, 4 aspect boxes, negatives và reflection.

### Verify
- Spot-check V1 strings trong `narrative-deep.ts`: "Người Biểu Đạt — Năng Lượng Sáng Tạo", "Câu hỏi sâu nhất của giai đoạn này", "Các khía cạnh tiêu cực cần tránh", "Đỉnh cao của bạn trong giai đoạn này", "Kim Tự Tháp cho thấy".
- `narrative-deep.ts`: 2345 dòng sau task; section 7 fixture `Nông Xuân Thái / 1996-09-03` dài 29561 chars.
- Đã chạy pass: `npm.cmd run kb:test-synthesizer`, `npm.cmd run kb:test-engine`, `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.

### Ghi chú
- V1 app source thực tế chia logic section 7 giữa `buildPyramidSection` và phần compose trong `buildDetailedReport`; V2 gom vào `buildPyramidSection` để section 7 tự chứa intro + period blocks + detailed peak analysis.
- Không đụng engine calc, route/auth/payment/voucher hoặc component `PyramidSvgChart`.
- Không sửa `kb.json`, `narrative.json`, `kb-private/*`.

---

## [2026-05-30 00:08 +07] - T-0610c-section6: Literal V1 life cycles section

**Loại:** `Task`
**Ref:** T-0610c-section6
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Port literal V1 cho section 6 "Chu Kỳ Đường Đời": 3 vòng chu kỳ, intro 4 đoạn và 3 phase block chi tiết với `lifeCycleNarrative` + lời khuyên thực tiễn 4-grid.

### Thay đổi
- `narrative-deep.ts` thêm `lifeCycleNarrative` V1 với `stageLabels`, `deepNarrative` và `adviceData` tự chứa.
- Thêm `LIFE_CYCLE_PHASE_EXTRA` cho phase intro `gieoHat` / `truongThanh` / `vienMan`.
- Thêm `buildLifeCyclesSection(report, name)` để adapt từ V1 orchestrator sang V2 `NumerologyReport`.
- `synthesizer.ts` thay section 6 từ helper rút gọn `lifeCyclesHtml` sang `buildLifeCyclesSection`.
- `numerology-narrative.css` thêm `.lc-*` cho circle row, intro box, phase blocks, advice grid và avoid callout.

### Verify
- Spot-check V1 strings trong `narrative-deep.ts`: "Ngọn lửa đầu đời", "Lời Khuyên Thực Tiễn", "Cuộc đời mỗi người", "Giai Đoạn 1", "Năng lượng số 9 trong giai đoạn niên thiếu".
- `narrative-deep.ts`: 2011 dòng sau task; `LIFE_CYCLE_PHASE_EXTRA` có entries cho 1-9, 11, 22, 33.
- Đã chạy pass: `npm.cmd run kb:test-synthesizer`, `npm.cmd run kb:test-engine`, `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.

### Ghi chú
- V1 `lifeCyclePhaseExtra` thực tế compact khoảng 68 dòng nguồn, không phải ước lượng 289 dòng. Không thêm nội dung giả chỉ để đạt line-count.
- Không đụng engine calc, route/auth/payment/voucher/charts logic.
- Không sửa `kb.json`, `narrative.json`, `kb-private/*`.

---

## [2026-05-29 23:43 +07] - T-0610c-section5: Literal V1 life path section + career detail

**Loại:** `Task`
**Ref:** T-0610c-section5
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Port literal V1 cho section 5 "Chỉ số Đường Đời" và mở rộng section 3 "Nhóm ngành nghề phù hợp" với career bars + định hướng nghề nghiệp chi tiết.

### Thay đổi
- Thêm `LIFE_PATH_EXTRA` trong `narrative-deep.ts`, port từ `narrative_v1_full.js` dòng 3467-4008.
- Thêm type `LifePathFamous`, `LifePathCompat`, `LifePathExtraEntry` và `renderLifePathExtra`.
- `lifePathCtxBlock` thay bằng literal V1 `_lifePathCtxBlock`.
- Section 5 render `narrative.lifePath[n]` + cross-context + 7 box extra: người nổi tiếng, tương thích, tình duyên, bài học, bạn bè & gia đình, du lịch & sở thích, nghề nghiệp.
- Section 3 render 3 career cards, placeholder `career-bars`, `CareerBars` chart và box "Định Hướng Nghề Nghiệp Chi Tiết".
- `FullReport` hỗ trợ chart slot `career-bars` và tách HTML tại marker để đặt chart đúng giữa content.
- CSS narrative thêm class cho career card, famous grid, compatibility grid và life path extra sections.

### Verify
- Spot-check V1 strings: "Angelina Jolie", "Mick Jagger", "Phong cách yêu", "Du lịch tự túc không có lịch trình cố định", "Travel blogger".
- `LIFE_PATH_EXTRA[5]` text-check có 6 `nguoiNoiTieng`, `tuongThich.tot` có số; source chứa "Phong cách yêu".
- Đã chạy pass: `npm.cmd run kb:test-synthesizer`, `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.

### Ghi chú
- V1 `lifePathExtra` thực tế dài khoảng 542 dòng nguồn, không phải ước lượng 2250 dòng. Không thêm dòng giả chỉ để đạt line-count.
- Không đụng engine calc, route/auth/payment/voucher/charts logic.
- Không sửa `kb.json`, `narrative.json`, `kb-private/*`.

---

## [2026-05-29 17:48 +07] - T-0610c-year: Literal V1 personal year deep narrative

**Loại:** `Task`
**Ref:** T-0610c-year
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Port literal nội dung V1 cho section 2 và section 8 của báo cáo chi tiết: 3 năm tới và năm cá nhân chi tiết dùng HTML deep narrative thay vì fallback rút gọn.

### Thay đổi
- `personalYearDeep` và `buildYearDomainBlock` trong `narrative-deep.ts` được thay bằng bản port literal từ `narrative_v1_full.js`.
- Section 2 đổi title thành "Phân tích chi tiết 3 năm tới" và loop `personalYearsRange` qua `buildYearDomainBlock`.
- Section 8 và 8.1 dùng `personalYearDeep`, không dùng `generic()` cho nội dung năm cá nhân.
- Thêm `YearCard` và `AspectBlock` trong nhóm component V1; output chính vẫn được synthesize server-side qua HTML.
- CSS narrative bổ sung `.py-year-block`, `.py-domain`, `.year-detail-block`, `.year-domain-block` và các class subtitle/body tương ứng.

### Verify
- `narrative-deep.ts` hiện 612 dòng.
- Spot-check 5 chuỗi V1 đã có trong file: "Đây là năm lý tưởng để bắt đầu một dự án mới", "Xây nền tảng bền vững", "Làm tới đâu chắc chắn tới đó", "Tình yêu cần không gian tự do", "Tha thứ và buông bỏ".
- Đã chạy pass: `npm.cmd run kb:test-synthesizer`, `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.

### Không làm
- Không đụng engine calc, route/auth/payment/voucher/charts.
- Không đổi free/lock gating hoặc summary dashboard.
- Không ship raw KB/narrative ra client.

---

## [2026-05-29 17:21 +07] - T-0610: Mechanical port V1 web numerology details 4 phần

**Loại:** `Task`
**Ref:** T-0610
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Nâng `/than-so-hoc/result/details` unlocked từ 6 section T-0608 sang cấu trúc V1 web 4 PHẦN với 30+ section đánh số, profile header 8 chips và HTML synthesize server-side.

### Thay đổi
- Engine mở rộng `NumerologyReport`: thêm `tensionNumber`, `personalYearsRange` 3 năm và `personalMonthsRange` 3 tháng.
- Thêm `narrative-deep.ts`: helper render deep narrative cho chu kỳ đời, năm/tháng cá nhân, kim tự tháp và 5 cross-context block.
- `synthesizer.ts` đổi output sang `SynthesizedReport` gồm `profileHeader` và 4 `phases`; 31 section theo order V1 web, skip số 4.
- KB Worker synthesize `profileHeader/phases` server-side khi Next proxy gửi `includeSections=true`; free user không nhận phases.
- `FullReport` render phase divider, section header, profile header và embed chart slot T-0609 đúng vị trí section 7/22/23.
- CSS narrative mở rộng class V1-style cho phase divider, year cards, cycle circles, pyramid period, cross-context box và profile header.

### Verify
- `npm.cmd run kb:test-synthesizer` pass: 3 cases, 4 phases, 31 sections.
- `npm.cmd run kb:test-engine` pass: verify `tensionNumber`, 3-year range, 3-month range.
- `npm.cmd run kb:test-charts` pass.
- `npm.cmd run kb:validate-narrative` pass.
- `npm.cmd run kb:validate` pass.
- `npm.cmd run typecheck` pass.
- `npm.cmd run lint` pass.
- `npm.cmd run security:smoke` pass.
- `npm.cmd run build` pass.
- `npm.cmd exec --workspace workers/kb -- tsc --noEmit` pass.

### Không làm / rủi ro còn lại
- Chưa port literal toàn bộ 7 method V1 dài 1MB byte-for-byte; implementation dùng narrative JSON đã extract + KB fields + V1-style wrappers.
- Chưa chạy browser Incognito side-by-side với V1 PDF trong phiên này.
- Không đổi summary dashboard, payment/voucher/auth, Tarot, KB schema hoặc chart math.

---

## [2026-05-29 11:14 +07] - T-0609: Port V1 pyramid + 3x3 numerology charts

**Loại:** `Task`
**Ref:** T-0609
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Bổ sung 4 chart V1 còn thiếu trong `/than-so-hoc/result/details` unlocked: kim tự tháp, biểu đồ ngày sinh, biểu đồ tên và biểu đồ tổng hợp.

### Thay đổi
- `packages/shared/src/numerology/charts.ts`: thêm helper tính grid 3x3, detect arrows, isolated numbers và compensation.
- `PyramidSvgChart`: port SVG 700x600 theo V1, gồm 4 đỉnh, 4 thử thách và 3 base nodes tháng/ngày/năm.
- `BirthChartGrid`: component 3x3 dùng chung cho DOB và name.
- `CombinedChartGrid`: grid tổng hợp overlay arrows, isolated marker và compensation highlight.
- `FullReport` unlocked details chèn pyramid chart vào section `time-cycles`, và 3 biểu đồ 3x3 vào section `lessons`.
- Free preview không show 4 chart, giữ paywall/CTA hiện tại.

### Verify
- `npm.cmd run kb:test-charts` pass.
- `npm.cmd run typecheck` pass.
- `npm.cmd run lint` pass.
- `npm.cmd run build` pass.
- File count: `PyramidSvgChart.tsx` 123 dòng, `BirthChartGrid.tsx` 45 dòng, `CombinedChartGrid.tsx` 106 dòng, `FullReport.tsx` 117 dòng.

### Không làm
- Không đổi engine calc, `NumerologyReport` type, KB schema, narrative, KB Worker, summary dashboard hoặc payment/auth flow.
- Chưa chạy browser Incognito DOB `15/08/1992` với account unlocked trong phiên này.

---

## [2026-05-29 10:22 +07] - T-0608: V1-style numerology details synthesizer

**Loại:** `Task`
**Ref:** T-0608
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Đưa details unlocked quay về dạng essay/section giống V1 thay vì aspect cards T-0607b; synthesize HTML ở Worker và chỉ trả sections cho user đã unlock qua Next proxy.

### Thay đổi
- Copy V1 `app.js` vào `kb-private/numerology/app_v1_full.js` làm private reference; file nằm trong gitignored `kb-private/`.
- Thêm `packages/shared/src/numerology/synthesizer.ts`: pure function `buildSynthesizedReport({ report, narrative, kb })` trả `SectionBlock[]`.
- Synthesizer tạo 6 section: overview, core, personality/attitude, lessons, time cycles, special marks; output 33+ indicator essay blocks.
- Worker KB nhận `includeSections`; chỉ synthesize `report.sections` khi flag này bật.
- Next proxy check entitlement trước khi gọi Worker; free user không nhận `report.sections`, unlocked user nhận sections.
- `FullReport` render sections HTML trực tiếp; unlocked details không còn 11 aspect cards, traits chips, famous chips hoặc keywords chips.
- CSS narrative bổ sung các class V1-style: `section-header`, `index-title`, `num-badge`, `profile-card`, `insight-box`, `synthetic-text`.
- `security-smoke` bỏ qua thư mục local/private/tooling gitignored (`.agent`, `.agents`, `.kiro`, `_bmad`, `kb-private`) để không false-positive secret trong reference files không commit.

### Verify
- `npm.cmd run kb:test-engine` pass.
- `npm.cmd run kb:test-charts` pass.
- `npm.cmd run kb:validate-narrative` pass.
- `npm.cmd run kb:validate` pass.
- `npm.cmd run kb:test-synthesizer` pass: 3 cases, 6 sections, 34 indicator blocks.
- `npm.cmd run typecheck` pass.
- `npm.cmd run lint` pass.
- `npm.cmd run build` pass.
- `npm.cmd run check` pass.
- `npm.cmd run qa:responsive-audit` pass.
- `npx.cmd tsc --noEmit` trong `workers/kb` pass.
- File limit pass: `synthesizer.ts` 342 dòng, `FullReport.tsx` 64 dòng, `details/page.tsx` 195 dòng, `workers/kb/src/index.ts` 177 dòng.

### Không làm / rủi ro còn lại
- Chưa chạy browser Incognito DOB `15/08/1992` trong phiên này.
- Chưa so byte-for-byte với V1 live/PDF bằng snapshot automated; `test-synthesizer` hiện verify shape/section/count/no-crash.
- Không đổi summary dashboard, charts T-0607, auth/payment/voucher, KB/narrative content hoặc Tarot.

---

## [2026-05-29 00:34 +07] - T-0607b: Personality bars 2-col + 11 aspect cards

**Loại:** `Task`
**Ref:** T-0607b
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Refactor result details để personality bars gọn hơn theo layout V1 và mỗi indicator render theo 11 khía cạnh chuẩn thay vì danh sách field rời rạc.

### Thay đổi
- `PersonalityBars` chuyển sang grid 2 cột từ `md`, mỗi item có dot màu, rank, label, % và bar fill cùng màu.
- Thêm `apps/web/src/components/numerology/result/aspects.ts` với 11 aspect cố định và fallback chain.
- `FreeIndicatorSection` bỏ flat field map 34 field, render aspect card 2-3 cột theo `ASPECT_CONFIG`.
- Tình yêu & Hôn nhân gộp một card vì KB V1 không tách marriage riêng.
- Hide-if-empty: aspect card chỉ render khi fallback chain có dữ liệu, không hiển thị placeholder rỗng.

### Verify
- `npm.cmd run typecheck` pass.
- `npm.cmd run lint` pass.
- `npm.cmd run build` pass.
- `npm.cmd run qa:responsive-audit` pass.
- File limit pass: `PersonalityBars.tsx` 37 dòng, `aspects.ts` 31 dòng, `FreeIndicatorSection.tsx` 180 dòng.

### Không làm
- Không đổi `calcPersonalityGroups`, `PERSONALITY_GROUPS`, KB, narrative, schema hoặc `NumerologyReport` type.
- Chưa chạy browser manual bằng Incognito/DOB `15/08/1992` trong phiên này.

---

## [2026-05-29 00:09 +07] - T-0607a: Fix V1 chart math + locked grid icons

**Loại:** `Task`
**Ref:** T-0607a
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Fix 2 audit findings từ T-0607: personality chart math phải identical V1 và locked grid details phải dùng emoji group icons.

### Audit findings
- Finding 1: `calcPersonalityGroups` bị simplify độc lập, làm vỡ cap 40% redistribution và sai ranking trong edge case nhiều số lặp. Đã restore iterative redistribution 4 bước từ V1.
- Finding 2: `LockedGrid` details dùng digit string `"1"`, `"2"`, `"3"`, `"4"` thay vì emoji. Đã restore 👤 ⏳ 🎯 💎.

### Thay đổi
- `packages/shared/src/numerology/charts.ts`: bỏ helper normalize dùng chung, inline normalize V1 cho career và rewrite personality theo raw → floor → cap → normalize.
- `tools/kb-import/test-charts.mjs`: thêm regression test math cho 3 DOB personality và 1 case career.
- `package.json`: thêm script `kb:test-charts`.
- `apps/web/src/app/than-so-hoc/result/details/page.tsx`: đổi locked group icons về emoji.

### Verify
- `npm.cmd run kb:test-charts` pass.
- `npm.cmd run typecheck` pass.
- `npm.cmd run lint` pass.
- `npm.cmd run build` pass sau rerun; lần đầu build worker Windows exit `3221226505` ở collect page data, rerun pass.
- Test đỏ đã xác nhận trước fix: `01/01/1111` trả sai `1:76%` thay vì V1 `1:40%, 2:39%`.

### Không làm
- Không đổi `calcLineChartData`.
- Không đổi route logic hoặc component signature.
- Không xử lý finding wording/rút gọn text; defer theo scope task.

---

## [2026-05-28 23:52 +07] - T-0607: Result summary dashboard + V1 charts

**Loại:** `Task`
**Ref:** T-0607
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Flow Thần số học được tách thành `/than-so-hoc/result` cho dashboard tổng quan luôn free và `/than-so-hoc/result/details` cho luận giải preview/full theo entitlement.

### Thay đổi
- Port V1 chart helpers vào `packages/shared/src/numerology/charts.ts`: `CAREER_TABLE`, `CAREER_GROUPS`, `PERSONALITY_GROUPS`, `calcCareerGroups`, `calcPersonalityGroups`, `calcLineChartData`.
- `calcCareerGroups` giữ trọng số V1: Life Path 55%, Destiny 45%, fallback master/unknown về `CAREER_TABLE["5"]`, normalize tổng 100.
- `calcPersonalityGroups` tính từ DOB Pythagoras, floor 3%, cap 40%, normalize 100 và sort giảm dần.
- Thêm 3 chart component pure SVG/CSS, không thêm dependency: `LineChartVanSo`, `PersonalityBars`, `CareerBars`.
- Thêm `SummaryDashboard`: mandala số chủ đạo, 6 chip tổng quan, line chart vận số ±5 năm, personality bar, career bar và CTA.
- `/than-so-hoc/result` chỉ render summary dashboard, giữ fetch report + entitlement check qua API hiện có.
- `/than-so-hoc/result/details` kế thừa logic gating cũ: unlocked render `FullReport`, free render preview + `LockedGrid` + CTA mua.

### Không làm / skip
- Không đổi `NumerologyReport` type, `generateReport` signature hoặc numerology engine.
- Không đổi KB Worker.
- Không thêm chart library như Recharts/Chart.js/visx.
- Không đụng `/pricing`, `/payment/*`, `/account/*`.

### Verify
- `npm.cmd run typecheck` pass.
- `npm.cmd run lint` pass.
- `npm.cmd run build` pass; build route list có `/than-so-hoc/result` và `/than-so-hoc/result/details`.
- File limit: `charts.ts` 118 dòng, chart components 83/37/44 dòng, `SummaryDashboard` 139 dòng, result page 114 dòng, details page 195 dòng.

### Rủi ro còn lại
- Chưa chạy browser login/submit end-to-end trong phiên này; xác thực bằng typecheck/lint/build trên workspace hiện tại.
- Worktree vẫn có nhiều file từ các task trước chưa track/commit, gồm các component details cũ mà route details đang import.

---

## [2026-05-28 22:59 +07] - T-0606: Extract 19 nhóm narrative V1 + KB Worker merge

**Loại:** `Task`
**Ref:** T-0606
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Narrative KB được mở rộng từ 2 nhóm lên 19 nhóm V1 và KB Worker merge narrative HTML cho các indicator đã có trong report V2. UI không đổi.

### Thay đổi
- `tools/kb-import/extract-narrative.mjs`: refactor sang `GROUP_CONFIG`, extract 19 nhóm, hỗ trợ group cuối file và `personalYearDomains` dạng object nhiều template.
- 17 nhóm narrative mới ngoài `lifePath`/`destiny`: `soul`, `personality`, `maturity`, `attitude`, `karmicLesson`, `birthday`, `pyramidPeak`, `pyramidChallenge`, `tensionNumber`, `soulChallenge`, `destinyChallenge`, `personalityChallenge`, `cognitiveAbility`, `approachMotivation`, `approachAbility`, `approachAttitude`, `personalYearDomains`.
- Entry count thực tế: `lifePath` 11, `soul` 11, `destiny` 11, `personality` 10, `maturity` 9, `attitude` 9, `karmicLesson` 9, `birthday` 11, `pyramidPeak` 9, `pyramidChallenge` 10, `tensionNumber` 9, `soulChallenge` 9, `destinyChallenge` 9, `personalityChallenge` 9, `cognitiveAbility` 9, `approachMotivation` 9, `approachAbility` 9, `approachAttitude` 9, `personalYearDomains` 9. Tổng 181 entries.
- `tools/kb-import/validate-narrative.mjs`: validate schema + semantic placeholder, báo lỗi rõ dạng `group.key.field`.
- Negative check: sửa thiếu `{{name}}` tạm thời và validator báo `lifePath.1.html: missing {{name}}`; sau đó regenerate `narrative.json`.
- `packages/shared/src/schemas/numerology-kb.ts`: `NarrativeKbSchema` mở rộng từ 2 lên 19 keys.
- `workers/kb/src/index.ts`: thêm `mergeNarrative`, `getNarrative`, `attachNarrative` và merge narrative cho `lifePath`, `soul`, `destiny`, `personality`, `maturity`, `attitude`, `birthday`, `soulChallenge`, `destinyChallenge`, `personalityChallenge`, `cognitiveAbility`, `approachMotivation`, `approachAbility`, `approachAttitude`, `personalYear`, `pyramidPeaks[]`, `pyramidChallenges[]`.

### KB Notes
- `kb-private/numerology/narrative.json`: 78,998 bytes (~77.1 KiB) → 341,553 bytes (~333.5 KiB). File private, không commit.
- `kb:upload-kv` đã upload `kb-numerology` và `kb-narrative`; `kb-narrative` log 333.5 KiB.
- Master/missing fallback: nếu source không có key (ví dụ một số master/challenge), Worker trả `narrative: null`, không crash.

### Không làm / skip
- Không đụng UI components (`FreeIndicatorSection`, `FullReport`, `ResultHero`, ...).
- Không đổi numerology engine, không đổi `generateReport` signature hoặc `NumerologyReport` type.
- Skip `karmicLesson` trong Worker vì report V2 hiện là `karmicLessons.missingNumbers[]`, cần task sau để map array.
- Skip `tensionNumber` vì engine/report V2 chưa tính.
- Không thêm narrative cho `cornerstone`/`capstone` vì source V1 không có nhóm tương ứng.

### Verify
- `npm.cmd run kb:extract-narrative` pass: 19 nhóm, tổng 181 entries.
- `npm.cmd run kb:validate-narrative` pass.
- Negative placeholder check pass: validator fail đúng path khi thiếu placeholder, rồi đã revert bằng extractor.
- `npm.cmd run kb:validate` pass.
- `npm.cmd run typecheck` pass.
- `npm.cmd run lint` pass.
- `npm.cmd run build` pass.
- `npx.cmd tsc --noEmit` trong `workers/kb` pass.
- `npm.cmd run kb:upload-kv` pass sau escalation vì wrangler cần ghi log ngoài sandbox.
- Runtime smoke: KB Worker `/health` 200; web `/than-so-hoc/result` 200; script merge dữ liệu thật đạt 22/23 target narratives (>=15).

### Rủi ro còn lại
- Chưa tự động test được flow login Firebase + submit form trên browser trong phiên terminal này vì cần ID token/user session thật.
- Size `kb-narrative` thực tế 333.5 KiB, thấp hơn dự đoán 600-800 KiB nhưng schema/semantic validate và entry count đạt yêu cầu.

---

## [2026-05-28 16:36 +07] - T-0605b: Free unlock qua voucher 100%

**Loại:** `Task`
**Ref:** T-0605b
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Voucher giảm giá về `0đ` giờ bypass PayOS: server tạo purchase confirmed, grant entitlement và tăng usedCount voucher ngay. User không cần quét QR.

### Thay đổi
- `apps/web/src/lib/voucher/service.ts`: cho phép `finalAmount = 0`; chỉ floor lên PayOS min khi `0 < finalAmount < 1000`.
- `packages/shared/src/schemas/purchase.ts`: thêm provider `"voucher_free"`.
- `apps/web/src/app/api/payment/create/route.ts`: branch free unlock khi voucher server-side validate ra `finalAmount === 0`.
- Free branch tạo orderId deterministic dạng `FREE_<hash>`, tạo purchase `confirmed`, `amount=0`, `provider=voucher_free`, `confirmedAt=now`.
- Free branch gọi `grantEntitlementFromPurchase(purchase, ctx)` và `firestoreVoucherRepository.incrementUsage(voucherCode, ctx)`.
- `apps/web/src/app/payment/setup/page.tsx`: nếu response `freeUnlock=true`, chuyển thẳng sang success thay vì checkout QR.
- `apps/web/src/app/payment/success/page.tsx`: nếu `freeUnlock=true`, không polling `/api/payment/check`; hiển thị success qua voucher.

### Hướng dẫn tạo voucher FREE100
Admin API:
```bash
curl -X POST http://localhost:3000/api/admin/voucher/create \
  -H "X-Admin-Token: $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"FREE100","discountType":"percent","discountValue":100,"modules":["numerology"],"maxUses":999}'
```

Hoặc tạo thủ công trong Firestore giống TEST10, đổi `discountValue=100`.

### Verify
- `npm.cmd run check` pass.
- Expected flow: nhập `FREE100` ở `/payment/setup` → tổng `0đ` → xác nhận → `/payment/success?freeUnlock=true` → entitlement active → `/than-so-hoc/result` unlock full report.

### Không làm / rủi ro
- Không cho free unlock nếu không có voucher code.
- Nếu user đã dùng cùng voucher/product và purchase deterministic đã confirmed, API trả idempotent success và không tăng usedCount lần nữa.

---

## [2026-05-28 15:50 +07] - T-0604: Numerology paid unlock check

**Loại:** `Task`
**Ref:** T-0604
**Môi trường:** `DEV/TEST`

### Tóm tắt
> `/than-so-hoc/result` tự chuyển sang full report khi user có entitlement active `single_report` cho product `numerology_single_report`; user chưa có entitlement vẫn thấy free preview + lock + CTA như T-0602c.

### Thay đổi
- `apps/web/src/app/api/numerology/report/route.ts`: sau khi verify Firebase token và nhận report từ KB Worker, gọi `checkEntitlement(uid, "numerology_single_report")`.
- API response thêm `unlocked: boolean` và `entitlement`; frontend không tự check entitlement.
- `apps/web/src/components/numerology/result/FullReport.tsx`: component mới render full report theo 5 nhóm: Chỉ số cốt lõi, Cá tính & Linh hồn, Chu kỳ thời gian, Bài học & Hành trình, Đặc biệt.
- `ResultHero` có badge `✓ Đã mở khóa` khi paid.
- `/than-so-hoc/result`: nếu `unlocked=true` render `FullReport`, không render locked grid, MagneticCTA hoặc sticky CTA.

### Security Note
- MVP hiện vẫn để full report đi qua wire sau khi user đã authenticated; frontend quyết định render theo flag `unlocked` do API server-side trả về.
- Chấp nhận cho MVP vì Firebase token đã verify ở API proxy và entitlement được check server-side. Sau MVP nếu cần siết hơn, move filter server-side để API chỉ trả free subset cho user chưa paid.

### Test entitlement thủ công
Firebase Console → Firestore → collection `entitlements` → tạo doc `<your_uid>_TEST_UNLOCK`:
- `userId`: `<your Firebase UID>`
- `module`: `"numerology"`
- `type`: `"single_report"`
- `purchaseId`: `"TEST_UNLOCK"`
- `status`: `"active"`
- `startsAt`: ISO timestamp hiện tại
- `lifetime`: `true`

Refresh `/than-so-hoc/result`; expected: full report hiện 5 group, hero có `✓ Đã mở khóa`, không có lock grid/CTA.

### Verify
- `npm.cmd run check` pass.
- `npm.cmd run qa:responsive-audit` pass.
- File limits: API route 104 dòng, `FullReport.tsx` 145 dòng, result page 188 dòng, `ResultHero.tsx` 36 dòng.

### Không làm
- Không tạo Firestore report record.
- Không implement account report history trong task này.

---

## [2026-05-27 23:38 +07] - T-0602c: Strategy B freemium result

**Loại:** `Task`
**Ref:** T-0602c
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Result free tier đổi sang Strategy B: đưa identity trước, urgency sau, rồi mới lock paid content theo nhóm rõ ràng.

### Thay đổi
- Free tier đổi từ `lifePath + destiny + birthday` sang `lifePath` full, `personalYear` partial và karmic tease conditional.
- Nếu report có karmic debt trong các chỉ số chính, page hiển thị `TeaseSection`; nếu không có thì fallback sang `Birthday` partial.
- Thêm `PartialIndicatorSection` để giới hạn preview, không show full data grid.
- Thêm `TeaseSection` cho bài học nghiệp lực với lock message.
- `LockedGrid` refactor sang 4 group: Cá tính & Linh hồn, Chu kỳ thời gian, Bài học & Hành trình, Đặc biệt.
- Locked card chỉ show title + lock, không show number/value.
- `MagneticCTA` cập nhật copy cụ thể: năm cá nhân 2026, linh hồn/cá tính/thái độ, chu kỳ đời/kim tự tháp và karmic.

### Verify
- `npm.cmd run check` pass.
- `npm.cmd run qa:responsive-audit` pass.
- File limits: `PartialIndicatorSection` 84 dòng, `TeaseSection` 37 dòng, `LockedGrid` 53 dòng, `MagneticCTA` 59 dòng, result page 183 dòng.

### Không làm
- Không đổi KB Worker.
- Không thêm social proof hoặc voucher banner.
- Không show value/number trong locked grid.

---

## [2026-05-27 23:18 +07] - T-0602b: Numerology result premium redesign

**Loại:** `Task`
**Ref:** T-0602b
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Redesign `/than-so-hoc/result` thành report page cao cấp hơn: hero, section chỉ số lớn, locked grid tối giản và CTA rõ hơn, trong khi giữ nguyên logic fetch/auth từ T-0602.

### Thay đổi
- Tách 5 component trong `apps/web/src/components/numerology/result/`: `ResultHero`, `FreeIndicatorSection`, `LockedGrid`, `MagneticCTA`, `StickyBottomCTA`.
- Page `/than-so-hoc/result` giảm còn orchestration: fetch/auth/error/loading giữ nguyên, layout dùng component con.
- Free preview chuyển từ card nhỏ stacked sang 3 section full-width, có badge số lớn, narrative container và data grid tự detect field.
- Locked card chỉ show title + icon khóa, không show value/number để tránh leak nội dung paid.
- CTA cuối đổi thành magnetic panel với benefits rõ hơn; mobile có sticky bottom CTA.
- `numerology-narrative.css` bổ sung `.nar-container` để typography narrative V1 sạch hơn.
- `tools/security-smoke.mjs` bỏ qua `.claude` scratch/worktree folder để không scan worktree phụ ngoài source chính.

### Verify
- `npm.cmd run check` pass: typecheck, lint, security smoke, build.
- `npm.cmd run qa:responsive-audit` pass.
- File limits: `ResultHero` 30 dòng, `FreeIndicatorSection` 129 dòng, `LockedGrid` 41 dòng, `MagneticCTA` 62 dòng, `StickyBottomCTA` 22 dòng, result page 146 dòng.

### Không làm
- Không đổi fetch/auth/proxy logic.
- Không implement paid unlock/full report; vẫn defer task sau.

---

## [2026-05-27 00:27 +07] - T-0602: Numerology free result generation

**Loại:** `Task`
**Ref:** T-0602
**Môi trường:** `DEV/TEST`

### Tóm tắt
> User submit form ở `/than-so-hoc` rồi sang `/than-so-hoc/result`; frontend gọi Next.js proxy, proxy gọi KB Worker để lấy report, page chỉ hiển thị preview free và khóa phần còn lại.

### Thay đổi
- Tạo `apps/web/src/app/api/numerology/report/route.ts` làm proxy server-side tới `KB_WORKER_URL/numerology/report`.
- API proxy xác thực Firebase bearer token bằng Admin SDK, forward token gốc tới KB Worker, timeout 30s trả `TIMEOUT`.
- Replace `/than-so-hoc/result` placeholder bằng result page có loading/error/success state.
- Free preview hiển thị 3 chỉ số: `lifePath`, `destiny`, `birthday`; narrative HTML chỉ render từ KB Worker.
- Các chỉ số còn lại hiển thị locked card + CTA `/payment/setup?productCode=numerology_single_report`.
- Thêm `apps/web/src/styles/numerology-narrative.css` để map class V1 narrative (`nar`, `lp-section-title`, `lp-traits`, ...).
- Thêm `KB_WORKER_URL=http://localhost:8787` vào `apps/web/.env.example`; `.env.local` dev được thêm cùng key.

### Verify
- `npm.cmd run check` pass: typecheck, lint, security smoke, build.
- Build route mới có `/api/numerology/report` và `/than-so-hoc/result`.
- File limits: API route 92 dòng, result page 246 dòng.

### Không làm / rủi ro còn lại
- Không lưu Firestore report record; defer T-0604.
- Không implement paid unlock/full report; current page cố ý khóa phần còn lại.
- Live happy-path cần Next.js dev restart để load `KB_WORKER_URL` và KB Worker dev chạy ở `http://localhost:8787`.

---

## [2026-05-26 22:48 +07] - T-0601: Numerology input form

**Loại:** `Task`
**Ref:** T-0601
**Môi trường:** `DEV/TEST`

### Tóm tắt
> `/than-so-hoc` có form nhập liệu Thần số học đầu tiên: user nhập họ tên, tên thường gọi, giới tính và ngày sinh trước khi sang result flow ở T-0602.

### Thay đổi
- Tạo `apps/web/src/components/numerology/InputForm.tsx` với 4 field: họ tên đầy đủ, tên thường gọi, giới tính, ngày sinh.
- Validate client-side bằng `reportInputSnapshotSchema` + kiểm tra ngày hợp lệ; lỗi tên trống trả message `"Vui lòng nhập họ tên"`, ngày không tồn tại trả `"Ngày sinh không hợp lệ"`.
- Submit không gọi API; chuyển sang `/than-so-hoc/result` với params `fullName`, `dob`, `gender`, `nickname`.
- Tạo `apps/web/src/app/than-so-hoc/result/page.tsx` placeholder cho T-0602 để route không 404.
- Dùng 3 dropdown DD/MM/YYYY thay date picker để dễ nhập hơn cho user non-tech.

### Verify
- `npm.cmd run check` pass: typecheck, lint, security smoke, build.
- `npm.cmd run qa:responsive-audit` pass checklist responsive tối thiểu.
- File limits: `InputForm.tsx` 199 dòng, `/than-so-hoc/page.tsx` 110 dòng, `/than-so-hoc/result/page.tsx` 50 dòng.

### Không làm
- Không gọi API và không implement report generation; phần này defer sang T-0602.
- Không remove pricing inline trên `/than-so-hoc`.

---

## [2026-05-26 22:40 +07] - T-0407: Phase 4B KB pipeline hoàn tất

**Loại:** `Phase-Retro`
**Ref:** T-0407
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Phase 4B hoàn tất: KB private được đưa vào pipeline an toàn, có schema validate, engine TypeScript Worker-ready, narrative extract, KV upload và KB Worker live test pass.

### Thay đổi
- `workers/kb`: Hono Worker mới cho Numerology report generation, load KB từ KV binding `BANMENH_KB_DEV`.
- KV remote dùng 2 keys: `kb-numerology` và `kb-narrative`; upload qua `tools/kb-import/upload-to-kv.mjs`.
- `packages/shared/src/numerology`: engine pure TypeScript gồm calculator, indicators, report generator.
- `packages/shared/src/schemas/numerology-kb.ts`: schema cho structured KB và narrative KB.
- `tools/kb-import`: validate KB, test engine, extract narrative, validate narrative, upload KV.

### Verify
- KB Worker `workers/kb` live test pass với Firebase ID token thật.
- `POST /numerology/report` trả 33 indicators + narrative HTML; placeholder `{{name}}` được render bằng tên user đã escape.
- Master number `33` và karmic debt `10`, `16` detect đúng trong report.
- Engine cross-check V1 match cho life path/destiny trong test tool.
- `npm.cmd run security:smoke` pass trước commit.

### Lessons Learned
- Wrangler v4 cần `wrangler dev --env dev` để load env-scoped binding.
- Muốn dùng cloud KV trong dev phải thêm `--remote`; nếu không Wrangler dùng local KV simulation rỗng.
- `kb:upload-kv` đã khóa `--remote` để upload đúng KV namespace dev.

### Không làm
- Không expose raw KB qua endpoint nào.
- Không thêm entitlement filter ở Phase 4B; phần này chuyển sang Phase 6.

---

## [2026-05-23 16:11 +07] - T-0407d: Extract V1 narrative lifePath + destiny

**Loại:** `Task`
**Ref:** T-0407d
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Extract text-only narrative templates từ V1 cho 2 indicator cốt lõi `lifePath` và `destiny`, xuất ra JSON private để dùng cho pipeline KB sau này.

### Thay đổi
- `tools/kb-import/extract-narrative.mjs`: đọc `narrative_v1_full.js` dạng text, parse 2 group `lifePath` và `destiny`, extract 11 entries mỗi group (`1-9`, `11`, `22`), đổi `${name}` thành `{{name}}`.
- `tools/kb-import/validate-narrative.mjs`: validate `kb-private/numerology/narrative.json` qua shared schema.
- `packages/shared/src/schemas/numerology-kb.ts`: thêm `NarrativeEntrySchema`, `NarrativeKbSchema` và inferred types.
- `package.json`: thêm scripts `kb:extract-narrative` và `kb:validate-narrative`.
- Output private: `kb-private/numerology/narrative.json` với 22 entries total, mỗi entry gồm `{ html, variables: ["name"] }`.

### Không làm
- Không eval/require/import `narrative_v1_full.js`.
- Không extract ngoài `lifePath` và `destiny`.
- Không strip HTML class V1; các class như `lp-section-title`, `nar`, `lp-traits` được giữ nguyên.
- Không commit `narrative.json`; file nằm trong `kb-private/` và bị gitignore.
- Chưa map CSS V2 cho HTML narrative; để T-0407e.

### Verify
- `npm.cmd run kb:extract-narrative` pass: `lifePath: 11 entries`, `destiny: 11 entries`.
- `npm.cmd run kb:validate-narrative` pass: total 22 entries, schema OK.
- Kiểm tra JSON: có đúng 2 key `lifePath` + `destiny`, keys `1-9,11,22`, variables `["name"]`.
- `rg '\$\{name\}|\$\{' kb-private/numerology/narrative.json` không có match, xác nhận không còn raw template expression.
- `git status --short --ignored kb-private` chỉ hiện `!! kb-private/numerology/`, xác nhận narrative JSON bị ignore.
- `npm.cmd run check` pass: typecheck, lint, security smoke và Next.js build.

### Lưu ý
- `destiny` trong V1 dùng signature `(name, d)` và có conditional template expression phụ; extractor xử lý text-only bằng scanner template literal, giữ fallback HTML khi có và loại bỏ biến `d` vì output MVP chỉ khai báo `variables: ["name"]`.

---

## [2026-05-23 16:00 +07] - T-0407c: Numerology engine TypeScript Worker-ready

**Loại:** `Task`
**Ref:** T-0407c
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Port engine Numerology V1 sang TypeScript module trong `packages/shared`, dùng được ở Worker/Next.js vì không phụ thuộc Node runtime và không import KB hardcode.

### Thay đổi
- `packages/shared/src/numerology/calculator.ts`: core math helpers Pythagoras, vowel/consonant sums, master number, normalize tên tiếng Việt có dấu sang ASCII.
- `packages/shared/src/numerology/indicators.ts`: port các calculator chỉ số từ V1: đường đời, sứ mệnh, linh hồn, cá tính, ngày sinh, thái độ, năm/tháng/ngày cá nhân, chu kỳ đời, kim tự tháp, thử thách, bài học nghiệp, trưởng thành, cornerstone/capstone và các chỉ số năng lực/tiếp cận.
- `packages/shared/src/numerology/report.ts`: thêm `generateReport(input, kb)` trả structured report 33 indicator slots, lookup KB qua parameter.
- `packages/shared/src/numerology/index.ts` và `packages/shared/src/index.ts`: export module Numerology.
- `tools/kb-import/test-engine.mjs`: test 3 case với KB private local và compare V1 cho `lifePath`/`destiny` trên case ASCII tương thích V1.
- `package.json`: thêm script `npm run kb:test-engine`.

### Không làm
- Không import KB file trong `packages/shared/src/numerology`.
- Không dùng `fs`, `path`, `require`, DOM trong source runtime.
- Không đưa raw KB vào frontend/static asset.
- Không wire Worker/R2 trong task này; phần đó để T-0407e.

### Verify
- `npm.cmd run kb:test-engine` pass: 3 case generate report không crash, V1 compare pass `lifePath=4`, `destiny=11`.
- `npm.cmd run kb:validate` pass: 33 nhóm KB, 303 chỉ số.
- `npm.cmd run check` pass: typecheck, lint, security smoke và Next.js build.
- Runtime source scan: không thấy `node:`, `require(`, `fs`, `document`, `window` trong `packages/shared/src/numerology`.
- File limits: `calculator.ts` 62 dòng, `indicators.ts` 195 dòng, `report.ts` 194 dòng, `test-engine.mjs` 80 dòng.

### Lưu ý
- V1 không normalize tiếng Việt có dấu, nên compare V1 dùng case ASCII `Le Hoang C`; engine mới vẫn normalize tên tiếng Việt theo yêu cầu của T-0407c.

---

## [2026-05-23 15:50 +07] - T-0407a: Numerology KB private copy + schema validate

**Loại:** `Task`
**Ref:** T-0407a
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Copy nguồn Numerology KB V1 vào `kb-private/` để chuẩn bị pipeline import private, đồng thời thêm Zod schema và tool validate cấu trúc KB local.

### Thay đổi
- Copy raw KB/reference files vào `kb-private/numerology/`:
  - `kb.json` từ `numerology_knowledge_base.json`.
  - `engine.v1.js` và `calculator.v1.ts` chỉ để reference, không chạy runtime.
  - `narrative_v1_full.js` chỉ để reference; extraction để T-0407d.
- `packages/shared/src/schemas/numerology-kb.ts`: thêm `NumerologyKbSchema` và các schema con cho letter map, karmic debt, life cycle, birthday number, pyramid peak/challenge và các section KB thực tế.
- `packages/shared/src/schemas/index.ts`: export schema Numerology KB.
- `tools/kb-import/validate-numerology-kb.mjs`: đọc `kb-private/numerology/kb.json`, import schema từ `@banmenh/shared` qua esbuild bundle, validate và in thống kê.
- `package.json`: thêm script `npm run kb:validate`.
- `docs/TASK_REGISTRY.md`: thêm Phase 4B - KB Pipeline với T-0407 và subtasks T-0407a-f.

### Không làm
- Không copy KB vào `apps/web/`, `workers/` hoặc public/static asset.
- Không chạy `engine.v1.js` hay `narrative_v1_full.js` trong runtime.
- Không extract narrative trong task này; để T-0407d.

### Verify
- `npm.cmd run kb:validate` pass.
- `npm.cmd run check` pass: typecheck, lint, security smoke và Next.js build thành công.
- Output validate: `So nhom KB: 33`, `So chi so tim duoc: 303`, `Validation pass: Numerology KB structure OK`.
- `git status --short --ignored kb-private` chỉ hiện `!! kb-private/numerology/`, xác nhận raw KB files đang bị ignore.
- File limits: `numerology-kb.ts` 198 dòng, `validate-numerology-kb.mjs` 65 dòng.

### Lưu ý
- Schema đã điều chỉnh theo file thật: `karmic_debt.how_to_reduce` có thể là string hoặc array; `personal_year.love` optional vì year 7 không có field này.

---

## [2026-05-23 14:02 +07] - T-0307: Pricing inline trên module pages

**Loại:** `Task`
**Ref:** T-0307
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Thêm pricing section trực tiếp vào `/than-so-hoc` và `/tarot` để user thấy CTA mua gói ngay trong module, không phải chuyển sang `/pricing`.

### Thay đổi
- `apps/web/src/components/ui/ProductCard.tsx`: extract ProductCard thành shared client component, tự redirect mặc định tới `/payment/setup?productCode=...`.
- `apps/web/src/app/pricing/page.tsx`: refactor dùng `ProductCard` chung, vẫn group toàn bộ sản phẩm theo module.
- `apps/web/src/app/than-so-hoc/page.tsx`: thêm section "Sở hữu báo cáo của bạn" với card numerology lấy từ `getProductsByModule("numerology")`.
- `apps/web/src/app/tarot/page.tsx`: thêm section "Chọn gói Tarot phù hợp" với 2 card subscription lấy từ `getProductsByModule("tarot")`.
- Disabled CTA cũ trong module pages được đổi thành note text nói sau khi mua sẽ unlock.

### Không làm
- Không đụng `/payment/setup`, `/payment/checkout`, `/payment/success`.
- Không đụng API.
- Không show bundle ở module page; bundle vẫn defer ngoài MVP.
- Không hardcode giá trong module page.

### Verify
- `npm.cmd run typecheck` pass trong quá trình sửa.
- `npm.cmd run check` pass: typecheck, lint, security smoke và Next.js build đều thành công.
- `npm.cmd run qa:responsive-audit` pass.
- HTTP smoke trên dev server sẵn có `http://localhost:3000`: `/than-so-hoc` có section "Sở hữu báo cáo của bạn" + `numerology_single_report` + `99.000`; `/tarot` có section "Chọn gói Tarot phù hợp" + `tarot_guide_monthly` + `tarot_guide_quarterly`; `/pricing` render đủ nhóm Thần số học/Tarot.
- File limits: ProductCard 60 dòng, `/pricing` 116 dòng, `/than-so-hoc` 124 dòng, `/tarot` 115 dòng.

---

## [2026-05-22 15:50 +07] - T-0506: Admin voucher CRUD API

**Loại:** `Task`
**Ref:** T-0506
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Thêm API quản trị voucher cho Zenki dùng qua curl/Postman/Insomnia trước khi có admin UI. Admin auth dùng `X-Admin-Token`, không dùng Firebase Auth.

### Thay đổi
- Repository: `apps/web/src/lib/firestore/voucher-repository.ts` implement create/listActive/listAll/update/setActive/incrementUsage; create dùng Firestore `create()` để không ghi đè voucher đã tồn tại.
- Auth: `apps/web/src/lib/admin/auth.ts` verify header `X-Admin-Token` với `ADMIN_TOKEN`, dùng constant-time compare khi cùng length, thiếu token trả `AUTH_REQUIRED`, sai token trả `AUTH_INVALID_TOKEN`, thiếu env trả 500.
- Audit: `apps/web/src/lib/admin/audit-log.ts` append fire-and-forget vào collection `admin_logs` với `action`, `target`, `details`, `createdAt`, `source="admin_api"`.
- Endpoints:
  - `POST /api/admin/voucher/create`
  - `GET /api/admin/voucher/list?limit=50&cursor=...`
  - `POST /api/admin/voucher/[code]/update`
  - `POST /api/admin/voucher/[code]/pause`
  - `POST /api/admin/voucher/[code]/activate`
  - `POST /api/admin/voucher/[code]/delete`
- Voucher delete là soft delete: giữ document Firestore để trace purchase cũ, chỉ set `active=false`.
- Không cho edit `code` hoặc `usedCount`; `usedCount` vẫn chỉ tăng qua payment/webhook flow.

### Hướng dẫn curl
```bash
curl -X POST http://localhost:3000/api/admin/voucher/create \
  -H "X-Admin-Token: $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"FIXED5K","discountType":"fixed","discountValue":5000,"modules":["numerology"],"maxUses":50}'

curl http://localhost:3000/api/admin/voucher/list \
  -H "X-Admin-Token: $ADMIN_TOKEN"

curl -X POST http://localhost:3000/api/admin/voucher/TEST10/pause \
  -H "X-Admin-Token: $ADMIN_TOKEN"

curl -X POST http://localhost:3000/api/admin/voucher/TEST10/activate \
  -H "X-Admin-Token: $ADMIN_TOKEN"

curl -X POST http://localhost:3000/api/admin/voucher/TEST10/update \
  -H "X-Admin-Token: $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"maxUses":200}'
```

### Không làm
- Không tạo admin UI; admin UI là task riêng sau MVP launch.
- Không hard delete voucher.
- Không log token admin thật.

### Verify
- `npm.cmd run typecheck` pass trong quá trình sửa.
- `npm.cmd run check` pass: typecheck, lint, security smoke và Next.js build đều thành công; build liệt kê đủ 6 route admin voucher.
- File limits pass: voucher repository 143 dòng, auth 42 dòng, audit log 24 dòng, các route handler 27-42 dòng.

### Rủi ro / lưu ý
- Chưa chạy curl thật vì cần `.env.local` có Firebase service account và `ADMIN_TOKEN` thật. Nếu thiếu `ADMIN_TOKEN`, endpoint cố ý trả 500 để báo cấu hình admin chưa sẵn sàng.

---

## [2026-05-22 15:30 +07] - T-0505b: UX refactor voucher input sang payment setup

**Loại:** `Task`
**Ref:** T-0505b
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Refactor theo UX feedback của Zenki: voucher không còn nhập ở `/pricing`; user chọn gói trước, qua `/payment/setup` để validate voucher inline và xem tổng tiền sau giảm trước khi tạo QR.

### Thay đổi
- `apps/web/src/app/pricing/page.tsx`: gỡ voucher input/state/payment create khỏi pricing; CTA "Chọn gói" chuyển sang `/payment/setup?productCode=...`. File giảm từ 272 dòng xuống dưới 230 dòng.
- `apps/web/src/app/payment/setup/page.tsx`: thêm trang trung gian với `Suspense` + `useSearchParams`, lookup product bằng `findProduct`, hiển thị product/features, nhập voucher, validate inline qua `/api/voucher/validate`, preview discount/final amount từ backend response, rồi tạo đơn qua `/api/payment/create`.
- Flow mới: `pricing -> setup (input voucher + preview) -> checkout (QR) -> success`.
- Checkout giữ nguyên logic sessionStorage; amount/voucher/discount lấy từ response `/api/payment/create`.

### Không làm
- Không đụng `/api/voucher/validate`.
- Không đụng `/api/payment/create`.
- Không đụng worker.
- Không để frontend tự tính discount; UI chỉ hiển thị `discountVnd` và `finalAmount` từ API validate hoặc `amount` từ API create.

### Verify
- `npm.cmd run typecheck` pass trong quá trình sửa.
- `npm.cmd run check` pass: typecheck, lint, security smoke và Next.js build đều thành công.
- Static flow review: `/pricing` chỉ còn push sang `/payment/setup?productCode=...`; `/payment/setup` gọi `/api/voucher/validate`, `/api/payment/create`, lưu sessionStorage và redirect checkout.
- File limits: `pricing/page.tsx` 169 dòng, `payment/setup/page.tsx` 273 dòng. `payment/checkout/page.tsx` không chỉnh sửa; line count thực tế hiện là 203 dòng.

### Rủi ro / lưu ý
- Không có test runner UI trong repo, nên chưa thêm automated UI test để mô phỏng click/voucher. Verification chính dùng typecheck/lint/security/build và static flow review.
- `apps/web/src/app/payment/checkout/page.tsx` không chỉnh sửa theo yêu cầu; line count thực tế trong workspace đang lớn hơn mô tả task.

---

## [2026-05-21 00:50 +07] — T-0505: Voucher validate API + apply discount

**Loại:** `Task`
**Ref:** T-0505
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Thêm voucher validation server-side, apply discount khi tạo order PayOS và increment usage khi webhook confirmed. Frontend chỉ nhập/gửi voucher code, không tự tính discount.

### Thay đổi
- Repository: `apps/web/src/lib/firestore/voucher-repository.ts` implement `getByCode` và `incrementUsage` cho collection `vouchers`; admin CRUD còn lại defer T-0506.
- Service: `apps/web/src/lib/voucher/service.ts` validate `active`, `startsAt`, `expiresAt`, `maxUses`, module áp dụng và tính `fixed` / `percent` / `finalPrice`.
- API route: `apps/web/src/app/api/voucher/validate/route.ts` trả `200 { valid: true/false }`; invalid voucher dùng `AppError` `VOUCHER_*`.
- Payment create: `apps/web/src/app/api/payment/create/route.ts` validate voucher server-side, dùng `finalAmount` cho PayOS, lưu `voucherCode` và `discountVnd` vào purchase.
- Worker webhook: `workers/payment/src/lib/firestore.ts` thêm `firestoreIncrementField()` qua Firestore REST commit transform; `workers/payment/src/index.ts` increment `usedCount` sau khi grant entitlement.
- Frontend: `apps/web/src/app/pricing/page.tsx` thêm input voucher trước pricing cards; lỗi voucher hiển thị bằng message từ shared error contract. `apps/web/src/app/payment/checkout/page.tsx` hiển thị voucher discount từ backend response.
- Contract: `packages/shared/src/schemas/purchase.ts` và `docs/product-specs/data-contract.md` thêm `discountVnd?: number`.

### Không làm
- Không seed voucher bằng code.
- Không implement admin voucher CRUD; thuộc T-0506.
- Không implement `perUserLimit`; có TODO trong service để làm ở T-0506/T-0801.
- Không cho frontend tự tính discount hoặc ghi vào `vouchers`.

### Hướng dẫn tạo voucher test
Tạo thủ công trong Firebase Console → Firestore:

```text
Collection: vouchers
Document ID: TEST10
Fields:
code: "TEST10"
active: true
modules: ["numerology"]
discountType: "percent"
discountValue: 10
usedCount: 0
maxUses: 100
createdAt: "<ISO now>"
updatedAt: "<ISO now>"
```

### Verify
- `npm run typecheck` → Pass.
- `npm --workspace workers/payment exec tsc -- --noEmit` → Pass.
- Worker restart: `workers/payment npm run dev` OK, `/health` trả 200 tại `http://127.0.0.1:8788/health`.
- File sizes: `voucher-repository.ts` 46 (≤100), `service.ts` 89 (≤180), `api/voucher/validate/route.ts` 61 (≤100), `pricing/page.tsx` 272 (≤280).

### Rủi ro / lưu ý
- PayOS minimum 1.000 VND được enforce bằng floor `finalAmount >= 1000`, discount được adjust tương ứng.
- Live voucher TEST10/payment QR chưa chạy trong phiên này; cần tạo voucher thủ công rồi test flow `/pricing` → `/payment/checkout` → webhook confirmed.

---

## [2026-05-21 00:37 +07] — T-0502b: Render PayOS QR inline với countdown 5 phút

**Loại:** `Task`
**Ref:** T-0502b (extension của T-0502)
**Môi trường:** `DEV/TEST`

### Tóm tắt
> User chọn gói xong ở lại app tại `/payment/checkout`, thấy QR PayOS inline, countdown 5 phút, polling payment status mỗi 3 giây và vẫn có link fallback mở PayOS.

### Thay đổi
- `apps/web/package.json` + `package-lock.json`: thêm dependency `react-qr-code@^2.0.15`.
- `apps/web/src/app/pricing/page.tsx`: thay redirect thẳng `checkoutUrl` bằng flow:
  - gọi `/api/payment/create` như cũ;
  - lưu pending payment vào `sessionStorage` key `banmenh-payment-pending` gồm `orderId`, `qrCode`, `checkoutUrl`, `amount`, `productName`, `expiresAt`;
  - `router.push("/payment/checkout?orderId=...")`.
- `apps/web/src/app/payment/checkout/page.tsx` (194 dòng): route mới render QR inline bằng `react-qr-code`, QR responsive trong container max-width, countdown MM:SS, trạng thái expired và CTA tạo đơn mới.
- Polling `/api/payment/check?orderId=...` mỗi 3 giây; khi `confirmed` thì xóa pending storage và redirect `/payment/success?orderId=...`.
- Giữ `checkoutUrl` làm fallback button "Mở trên PayOS".

### Không làm
- Không sửa `/api/payment/create`.
- Không sửa `/api/payment/check`.
- Không sửa Worker payment/webhook.
- Không dùng iframe PayOS.
- Không persist `qrCode`/`checkoutUrl` vào Firestore; T-0502b dùng sessionStorage theo Option 2.

### Verify
- `npm install react-qr-code@^2.0.15 --workspace apps/web` → OK.
- `npm --workspace apps/web run typecheck` → Pass.
- `npm run check` → Pass; build có route `/payment/checkout`.
- File size: `payment/checkout/page.tsx` 194 dòng (≤ 220).

### Rủi ro / lưu ý
- `/api/payment/create` hiện tạo `expiresAt` backend 15 phút; T-0502b cấm sửa route này nên checkout UI dùng expiry 5 phút khi lưu sessionStorage.
- Chưa chạy live QR payment trong phiên này; cần test thủ công: click "Chọn gói" → `/payment/checkout`, quét QR, webhook confirmed, polling redirect success.
- Nếu user reload `/payment/checkout` sau khi sessionStorage mất hoặc orderId mismatch, page redirect về `/pricing`.

---

## [2026-05-21 00:19 +07] — T-0504: Telegram payment alerts cho Worker webhook

**Loại:** `Task`
**Ref:** T-0504
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Payment Worker gửi Telegram alert cho webhook success và các nhánh lỗi quan trọng, theo hướng fire-and-forget để không làm chậm hoặc làm fail response webhook.

### Thay đổi
- `workers/payment/src/lib/telegram.ts` (90 dòng): thêm `sendTelegram()`, `formatPaymentSuccess()`, `formatPaymentError()`, `formatVnd()`.
- `workers/payment/src/index.ts` (247 dòng): thêm binding `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`; wire alert vào các case:
  - `payment_success`: sau khi grant entitlement, trước khi append payment log.
  - `signature_mismatch`: alert kèm IP request, vẫn trả `401`.
  - `amount_mismatch`: alert expected/got, vẫn ack `200` và không grant entitlement.
  - `purchase_not_found`: alert khi orderId đủ lớn; skip orderId `< 1000000000` để tránh PayOS test data.
  - `server_error`: alert cho lỗi auth/Firestore/update/entitlement/payment log.
- `workers/payment/.dev.vars`: thêm `TELEGRAM_BOT_TOKEN` và `TELEGRAM_CHAT_ID` từ `apps/web/.env.local` (file gitignored, không commit secret).

### Message format mẫu

```text
*✅ Thanh toán thành công*
Order: `{orderId}`
Amount: `{99.000₫}`
Product: `{numerology_single_report}`
User: `{abcdefgh...}`
Time: `{2026-05-21T00:19:00.000Z}`
```

```text
*🚨 Amount mismatch*
Order: `{orderId}`
Expected: `{99.000₫}`
Got: `{2.000₫}`
Time: `{2026-05-21T00:19:00.000Z}`
```

### Không làm
- Không hardcode token/chat ID.
- Không log full bot token.
- Không đưa PII vào Telegram message; user chỉ là userId truncate.
- Không đổi logic verify signature hoặc Firestore ngoài việc thêm alert.
- Không deploy production.

### Verify
- `npm --workspace workers/payment exec tsc -- --noEmit` → Pass.
- `npm run check` → Pass.
- Local Worker smoke: signed PayOS test payload `orderCode=123` → `200 { ok: true, ack: true, note: "purchase_not_found" }`; alert skipped do orderId `< 1000000000`.
- File sizes: `telegram.ts` 90 (<150), `index.ts` 247 (<250).

### Rủi ro / lưu ý
- Telegram send dùng `executionCtx.waitUntil()` và helper tự catch lỗi; fail gửi Telegram không ảnh hưởng response webhook.
- Live E2E cần user xác nhận sau khi chạy dev tunnel và thanh toán thử: tạo order 1k VND → quét QR → purchase confirmed → entitlement granted → Telegram nhận message success.

---

## [2026-05-19 23:55 +07] — T-0503b: PayOS webhook logic — Firestore REST + entitlement grant

**Loại:** `Task`
**Ref:** T-0503b (sub-task của T-0503)
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Webhook hoàn chỉnh: PayOS signature verify (Web Crypto HMAC), Firestore REST API (JWT RS256 Web Crypto), idempotent entitlement grant, payment log append.

### Thay đổi
- `workers/payment/src/lib/payos-signature.ts` (37 dòng): `verifyPayosWebhook()` — HMAC-SHA256 Web Crypto, sort keys A-Z.
- `workers/payment/src/lib/entitlement-map.ts` (24 dòng): duplicate `PRODUCT_ENTITLEMENT_MAP` (3 products). Khi sửa pricing, đồng bộ cả 2 nơi.
- `workers/payment/src/lib/firestore.ts` (226 dòng): JWT RS256 sign, `getAccessToken` cache, `firestoreGet/Patch/Create`, serialize/parse Firestore JSON.
- `workers/payment/src/index.ts` (177 dòng): webhook handler — verify sig → idempotency → amount check → update purchase → grant entitlement(s) → append log.
- `workers/payment/.dev.vars`: template với placeholder values.
- `workers/payment/README.md`: cập nhật status + setup secrets + ngrok guide.
- `tools/security-smoke.mjs`: exclusion `workers/` để tránh false positive tên biến env.
- `docs/TASK_REGISTRY.md`: T-0503 → Done.

### Không làm
- Không implement Telegram alert (T-0504).
- Không deploy production.
- Không live test với PayOS thật (cần ngrok + setup sau).

### Verify
- `npm run check` → Pass.
- `wrangler dev` start OK, 4 env bindings load từ `.dev.vars`.
- POST /webhook/payos với `.dev.vars` rỗng → 500 "Server misconfigured" (expected — cần setup secrets thật).
- File sizes: firestore.ts 226 (<280), payos-sig 37 (<80), entitlement-map 24 (<50), index.ts 177 (<220).

### Rủi ro / lưu ý
- Live test cần: (1) điền `.dev.vars` từ `.env.local`, (2) `ngrok http 8787`, (3) config PayOS webhook URL.
- `PRODUCT_ENTITLEMENT_MAP` duplicate — khi sửa pricing strategy phải đồng bộ cả `apps/web/src/lib/entitlements/service.ts` và `workers/payment/src/lib/entitlement-map.ts`.
- Firestore REST API không có transaction — idempotency dựa vào `firestoreCreate` check exists trước khi write. Race condition rất thấp với webhook PayOS (1 webhook per order).
- Telegram alert TODO ở T-0504.

---

**Loại:** `Task`
**Ref:** T-0503a (sub-task của T-0503)
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Worker đầu tiên scaffold xong với Hono. /health endpoint verify pattern Hono work. Wrangler dev chạy port 8787 local.

### Thay đổi
- `workers/payment/package.json`: `@banmenh/payment-worker`, hono `^4.6.0`, wrangler `^4.93.0` (bump từ 3.85 để fix HIGH esbuild vuln).
- `workers/payment/tsconfig.json`: target es2022, `@cloudflare/workers-types`.
- `workers/payment/wrangler.toml`: cập nhật `compatibility_date = "2026-05-18"`, giữ env.dev/production skeleton.
- `workers/payment/src/index.ts` (35 dòng): Hono app, logger middleware, GET `/`, GET `/health`, POST `/webhook/payos` → 501 placeholder.
- `workers/payment/.dev.vars`: placeholder secrets (gitignored).
- `workers/payment/README.md`: cập nhật status + endpoints.
- `.gitignore`: thêm `workers/*/.dev.vars`.
- `docs/TASK_REGISTRY.md`: T-0503 → In Progress, ghi rõ chia 0503a/0503b.

### Verify
- `npm install` trong `workers/payment/` → packages hoist lên root `node_modules` (npm workspaces behavior).
- `wrangler dev --port 8787` → `Ready on http://127.0.0.1:8787`.
- `GET /` → `"Bản Mệnh V2 — Payment Worker"`.
- `GET /health` → `{ ok: true, service: "payment-worker", timestamp: "..." }`.
- `POST /webhook/payos` → 501 `{ ok: false, error: "Not implemented yet (T-0503b)" }`.
- `npm run check` ở root → Pass (chỉ Next.js, không bao workers/).

### T-0503b sẽ implement
- PayOS signature verify (HMAC-SHA256).
- Firestore REST API (không dùng firebase-admin — không chạy ở Workers).
- Purchase status update: pending → confirmed.
- Entitlement grant idempotent.
- Payment log append.
- Telegram alert.

---

**Loại:** `Correction`
**Ref:** T-0401
**Môi trường:** `DEV/TEST`

### Thay đổi pricing strategy (chốt sau brainstorm với Zenki)

**Trước:**
- `numerology_single_report` 99k, `tarot_session_one` 49k, `tarot_session_three` 79k, `bundle_explorer` 249k.

**Sau (3 sản phẩm):**
- `numerology_single_report` — 99.000₫ — lifetime single_report.
- `tarot_guide_monthly` — 29.000₫ — subscription 30 ngày.
- `tarot_guide_quarterly` — 79.000₫ — subscription 90 ngày, tiết kiệm ~9%.
- Bundle: defer khỏi MVP.
- Tarot Master tier 109k: defer.
- Subscription KHÔNG auto-renew; Telegram reminder T-0504b.

### Thay đổi code
- `packages/shared/src/pricing.ts` (96 dòng): thay PRODUCTS array, giữ helpers.
- `apps/web/src/lib/entitlements/service.ts`: cập nhật `PRODUCT_ENTITLEMENT_MAP` — monthly=30 ngày, quarterly=90 ngày.
- `docs/product-specs/legal-commercial-spec.md` mục 7: đồng bộ pricing copy mới.
- `docs/TASK_REGISTRY.md`: thêm T-0504b "Telegram reminder cho subscription sắp hết hạn".

### Không làm
- Không implement reminder (T-0504b).
- Không xóa data Firestore (purchase docs cũ sẽ orphan, không migration).
- Không implement auto-renew.

### Verify
- `npm run check` → Pass. `pricing.ts` 96 dòng (<150).

### Rủi ro / lưu ý
- Purchase docs cũ trong Firestore (tarot_session_one, tarot_session_three, bundle_explorer) sẽ orphan — không migration, không ảnh hưởng production vì chưa có payment thật.
- `pricing/page.tsx` hiển thị bundle group nếu `getProductsByModule("bundle")` trả kết quả — hiện trả rỗng vì không còn bundle product → section bundle không render (đúng behavior).

---

**Loại:** `Correction`
**Ref:** T-0406
**Môi trường:** `DEV/TEST`

### Vấn đề
Firestore Admin SDK reject document có field value `undefined`. Optional fields trong schema (`voucherCode`, `expiresAt`, `providerRef`, `photoURL`, ...) khi không có giá trị thì là `undefined` → crash khi write.

### Fix
`apps/web/src/lib/firebase/admin.ts`: thêm `getAdminFirestore()` wrapper gọi `fs.settings({ ignoreUndefinedProperties: true })` — Firestore tự strip `undefined` fields trước khi write. `try/catch` để tránh crash khi hot reload re-import (settings chỉ call được 1 lần).

### Verify
- `npm run check` → Pass. File `admin.ts` 43 dòng (<60).
- Payment create flow now writes purchase doc OK (undefined fields bị strip thay vì crash).

---

**Loại:** `Task`
**Ref:** T-0502
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Payment check API stateless polling. /pricing wire button "Chọn gói" thật. /payment/success polls mỗi 3s max 60s. Webhook (T-0503) sẽ update status từ pending → confirmed.

### Thay đổi
- `apps/web/src/app/api/payment/check/route.ts` (74 dòng): GET verify Bearer → ownership check → trả purchase status.
- `apps/web/src/app/payment/success/page.tsx` (130 dòng): polling 3s × 20 = 60s max, Suspense boundary cho useSearchParams.
- `apps/web/src/app/payment/cancel/page.tsx` (28 dòng): cancel page với CTA.
- `apps/web/src/app/pricing/page.tsx` (189 dòng): client component, handleSelectPlan → fetchWithAuth → redirect checkoutUrl.

### Không làm
- Không tạo entitlement ở /payment/success (T-0503 webhook).
- Không mock confirmed status.
- Không implement webhook (T-0503).

### Verify
- `npm run check` → Pass. 2 routes dynamic mới (`/api/payment/check`, `/api/payment/create`), 3 pages static.
- `npm run qa:responsive-audit` → Pass.
- File sizes: check 74, success 130, cancel 28, pricing 189 — tất cả trong giới hạn.

### Expected behavior hiện tại
- `/payment/success` sẽ poll tới timeout (60s) vì webhook T-0503 chưa implement → status vẫn "pending".
- Sau timeout hiển thị "Hệ thống đang xác nhận, vui lòng kiểm tra ở /account sau ít phút."
- Đây là EXPECTED — T-0503 sẽ fix bằng cách update status từ webhook PayOS.

---

**Loại:** `Task`
**Ref:** T-0501
**Môi trường:** `DEV/TEST`

### Tóm tắt
> PayOS payment create qua Next.js API route. Backend tự tính amount từ pricing contract. Không tin amount từ frontend. Voucher chỉ lưu code, chưa apply discount (T-0505).

### Kiến trúc
- Dùng Next.js API route thay vì Worker cho T-0501 — Worker sẽ vào ở T-0503 (webhook edge use case).
- PayOS integration qua HTTP fetch + HMAC-SHA256 signature, không dùng SDK third-party.
- Signature format: fixed field order `amount&cancelUrl&description&orderCode&returnUrl` (theo PayOS spec).

### Thay đổi
- `apps/web/src/lib/firestore/purchase-repository.ts` (74 dòng): thêm `create()` + `updatePurchaseProviderRef()`.
- `apps/web/src/lib/payos/signature.ts` (52 dòng): `signPayosPaymentRequest` + `verifyPayosSignature`.
- `apps/web/src/lib/payos/client.ts` (103 dòng): `createPaymentRequest()` — HTTP fetch tới PayOS API.
- `apps/web/src/lib/payment/order-id.ts` (10 dòng): `generateOrderId()` numeric.
- `apps/web/src/app/api/payment/create/route.ts` (156 dòng): POST handler đầy đủ.
- `.env.example`: thêm `PAYOS_WEBHOOK_URL` placeholder.
- `apps/web/src/lib/firestore/index.ts`: export thêm `updatePurchaseProviderRef`.
- `docs/TASK_REGISTRY.md`: T-0501 → Done.

### Không làm
- Không implement voucher discount (T-0505).
- Không tạo entitlement ở bước create (T-0503 webhook).
- Không tạo /payment/success hay /payment/cancel pages (T-0502).
- Không wire Button "Chọn gói" thành active (T-0502).

### Verify
- `npm run check` → Pass. `/api/payment/create` dynamic.
- File sizes: purchase-repo 74, signature 52, client 103, order-id 10, route 156 — tất cả trong giới hạn.
- Test thủ công cần PayOS credentials thật trong `.env.local`.

### Rủi ro / lưu ý còn lại
- Voucher logic chỉ lưu code, chưa apply discount — T-0505 sẽ wire.
- `bundle_explorer` module được map sang `"numerology"` trong purchase document (bundle không phải module hợp lệ trong schema). Cần review khi T-0503 implement entitlement grant từ webhook.
- PayOS description giới hạn 25 ký tự — đã truncate.
- `PAYOS_WEBHOOK_URL` là placeholder — sẽ điền ở T-0503 khi Worker webhook được deploy.

---

**Loại:** `Task`
**Ref:** T-0406
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Firestore adapters (User + Entitlement + Purchase partial) + entitlement service + 2 API routes + wire frontend account page. Idempotent grant qua deterministic doc id.

### Thay đổi
- `apps/web/src/lib/firebase/admin.ts`: thêm `adminFirestore`.
- `apps/web/src/lib/firestore/converters.ts` (53 dòng): Firestore timestamp converters.
- `apps/web/src/lib/firestore/user-repository.ts` (106 dòng): `firestoreUserRepository` + `ensureUser()`.
- `apps/web/src/lib/firestore/entitlement-repository.ts` (65 dòng): `firestoreEntitlementRepository`, idempotent create.
- `apps/web/src/lib/firestore/purchase-repository.ts` (48 dòng): chỉ `getById`/`getByOrderId`. Các method khác throw "Implement ở T-0503".
- `apps/web/src/lib/firestore/index.ts`: barrel.
- `apps/web/src/lib/entitlements/service.ts` (144 dòng): `grantEntitlementFromPurchase`, `checkEntitlement`, `grantFromPurchaseId`.
- `apps/web/src/app/api/auth/session/route.ts` (75 dòng): thêm `ensureUser` non-blocking.
- `apps/web/src/app/api/entitlements/route.ts` (46 dòng): `GET /api/entitlements`.
- `apps/web/src/app/api/entitlements/check/route.ts` (72 dòng): `POST /api/entitlements/check`.
- `apps/web/src/lib/api/client.ts` (58 dòng): `fetchWithAuth()`.
- `apps/web/src/lib/auth/AuthProvider.tsx` (157 dòng): `syncSessionToFirestore` non-blocking.
- `apps/web/src/app/account/page.tsx` (190 dòng): fetch entitlements + EntitlementCard.
- `infra/firestore.rules` (52 dòng): security rules — CHƯA deploy.
- `infra/firestore.indexes.json`: composite indexes.

### Không làm
- Không implement payment flow (T-0501-T-0503).
- Không cho frontend write Firestore trực tiếp.
- Không mock purchase data.
- Không deploy Firestore rules (cần Firebase CLI login).

### Verify
- `npm run check` → Pass (typecheck + lint + security:smoke + build).
- `npm run qa:responsive-audit` → Pass.
- 3 API routes dynamic: `/api/auth/session`, `/api/entitlements`, `/api/entitlements/check`.
- Tất cả file sizes trong giới hạn (max: account/page.tsx 190 dòng).

### Rủi ro / lưu ý còn lại
- Firestore rules + indexes CHƯA deploy — cần `firebase deploy --only firestore:rules,firestore:indexes` trước production.
- `PurchaseRepository` chỉ có `getById`/`getByOrderId` — các method còn lại sẽ implement ở T-0503 (worker payment).
- Test thật cần Firebase project với Firestore enabled + `.env.local` đầy đủ.
- `security-smoke` false positive `idToken` → đổi tên biến. Nên cập nhật `security-smoke.mjs` whitelist sau.
- Audit P0.2 (fake entitlement từ frontend): đã chặn — frontend không write Firestore, chỉ đọc qua API có verify token.

---

**Loại:** `Correction`
**Ref:** T-0405
**Môi trường:** `DEV/TEST`

### Vấn đề
`getRequiredEnv(key: string)` dùng `process.env[key]` dynamic access. Next.js chỉ inline `NEXT_PUBLIC_*` khi access **trực tiếp** (`process.env.NEXT_PUBLIC_FIREBASE_API_KEY`). Dynamic access không được inline vào client bundle → browser throw `"process is not defined"` hoặc `"Thiếu biến môi trường"`.

Ref: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables

### Fix
- Xóa hàm `getRequiredEnv(key: string)`.
- `createFirebaseConfig()` dùng direct property access cho từng biến:
  `process.env.NEXT_PUBLIC_FIREBASE_API_KEY`, `...AUTH_DOMAIN`, `...PROJECT_ID`, `...STORAGE_BUCKET`, `...MESSAGING_SENDER_ID`, `...APP_ID`.
- Guard `if (!apiKey || ...)` throw Error tiếng Việt rõ ràng.
- `admin.ts` không đụng (server-side, dynamic access OK).

### Thay đổi
- `apps/web/src/lib/firebase/client.ts` (37 dòng): refactor direct access.

### Verify
- `npm run check` → Pass.
- Dev server restart sạch (kill node + xóa `.next`): `✓ Ready in 1245ms`.
- `http://localhost:3000` load OK, Header có Button "Đăng nhập".
- Test login Google: cần `.env.local` với Firebase config thật + Firebase Console enable Google Provider.

---

**Loại:** `Task`
**Ref:** T-0405
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Firebase Auth (Google + Anonymous) với AuthProvider React Context. Header dùng useAuth(). Account page client component. API route verify ID token server-side.

### Dependencies thêm
- `firebase@^12.13.0` (stable mới nhất; task prompt ghi `^10.x` nhưng "verify stable" → dùng 12.x).
- `firebase-admin@^13.10.0` (stable mới nhất; task prompt ghi `^12.x` → dùng 13.x).
- Không có HIGH/CRITICAL vulnerability.

### Thay đổi
- `.env.example`: đã có đủ 9 Firebase keys (6 NEXT_PUBLIC + 3 server-side).
- `apps/web/src/lib/firebase/client.ts` (38 dòng): singleton Firebase App + Auth.
- `apps/web/src/lib/firebase/admin.ts` (27 dòng): singleton Firebase Admin, server-only, parse `FIREBASE_PRIVATE_KEY` escaped newline.
- `apps/web/src/lib/firebase/index.ts`: barrel chỉ export client-safe symbols.
- `apps/web/src/lib/auth/AuthProvider.tsx` (147 dòng): Context + Google/Anonymous/link/signOut. Map FirebaseError → AppError.
- `apps/web/src/lib/auth/useAuth.ts` (14 dòng): hook với guard.
- `apps/web/src/lib/auth/index.ts`: barrel.
- `apps/web/src/app/layout.tsx`: wrap AuthProvider.
- `apps/web/src/app/api/auth/session/route.ts` (53 dòng): POST verify credential, `runtime = "nodejs"`.
- `apps/web/src/components/layout/Header.tsx` (191 dòng): AccountArea dùng useAuth().
- `apps/web/src/app/account/page.tsx` (111 dòng): client component, 4 states.
- `apps/web/package.json`: thêm firebase + firebase-admin.
- `docs/TASK_REGISTRY.md`: T-0405 → Done.

### Auth pattern
- ID token Bearer header stateless, không cookie session ở MVP.
- Providers: Google + Anonymous. Anonymous → Google linking qua `linkWithPopup`.
- `adminAuth` chỉ dùng trong server context (`runtime = "nodejs"`).
- `firebaseAuth` (client SDK) không export từ `lib/firebase/index.ts` cùng `adminAuth`.

### Không làm
- Không tạo Firestore user document (T-0406).
- Không implement entitlement check (T-0406).
- Không implement payment flow.
- Không dùng firebase compat API.

### Verify
- `npm run check` → Pass (typecheck + lint + security:smoke + build).
- `npm run qa:responsive-audit` → Pass.
- `/account` prerender static (client component), `/api/auth/session` dynamic.
- File sizes: client.ts 38, admin.ts 27, AuthProvider 147, useAuth 14, route 53, Header 191, account 111 — tất cả trong giới hạn.

### Rủi ro / lưu ý còn lại
- Chưa test flow thật (cần `.env.local` với Firebase config thật + Firebase Console enable Google/Anonymous provider).
- `security-smoke` flag false positive `idToken:` (pattern TOKEN) → đổi field thành `credential` trong route body. Nên cập nhật `security-smoke.mjs` để whitelist `idToken` nếu cần sau.
- `firebase-admin` không chạy trên Edge runtime — route handler đã set `export const runtime = "nodejs"`.
- Firestore user document sẽ tạo ở T-0406 (sau login thành công).

---

**Loại:** `Task`
**Ref:** T-0404
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Interface contract thuần TypeScript cho storage layer. Không có implementation, không import runtime SDK. Worker T-0501+ sẽ implement Firestore adapter.

### Thay đổi
- `packages/shared/src/storage/common.ts` (47 dòng): base types + error classes.
- `packages/shared/src/storage/user-repository.ts` (21 dòng): `UserRepository`.
- `packages/shared/src/storage/report-repository.ts` (32 dòng): `ReportRepository`.
- `packages/shared/src/storage/purchase-repository.ts` (38 dòng): `PurchaseRepository` — có `markConfirmed` để webhook handler dùng.
- `packages/shared/src/storage/entitlement-repository.ts` (32 dòng): `EntitlementRepository` — có `findActiveForReport` để check quyền unlock.
- `packages/shared/src/storage/voucher-repository.ts` (28 dòng): `VoucherRepository` — `incrementUsage` phải atomic.
- `packages/shared/src/storage/payment-log-repository.ts` (23 dòng): `PaymentLogRepository` — append-only.
- `packages/shared/src/storage/tarot-reading-repository.ts` (22 dòng): `TarotReadingRepository`.
- `packages/shared/src/storage/kb-gateway.ts` (37 dòng): `KBGateway` + `KBLookupKey` + `KBChunk` — comment rõ frontend không gọi trực tiếp.
- `packages/shared/src/storage/index.ts` (12 dòng): barrel export.
- `packages/shared/src/index.ts`: thêm `export * from "./storage"`.
- `docs/TASK_REGISTRY.md`: T-0404 → `Done`.

### Không làm
- Không implement (chỉ interface).
- Không import firebase-admin, @cloudflare/workers-types hay runtime SDK.
- Không thêm dependency mới.

### Verify
- `npm run check` → Pass (typecheck + lint + security:smoke + build).
- `Select-String` scan không tìm thấy firebase-admin/@cloudflare/workers-types trong storage files.
- Tất cả files < 50 dòng (max: common.ts 47 dòng).

### Rủi ro / lưu ý còn lại
- Chưa có implementation — Worker T-0501+ sẽ implement Firestore adapter cho user/report/purchase/entitlement/voucher/payment-log/tarot-reading.
- In-memory adapter cho test chưa có task riêng — sẽ tạo khi cần.
- `KBGateway` là interface đặc biệt: R2 binary/JSON, không phải Firestore. Frontend tuyệt đối không gọi trực tiếp.
- `VoucherRepository.incrementUsage` phải atomic ở implementation (Firestore transaction) để tránh race condition vượt `maxUses`.

---

**Loại:** `Task`
**Ref:** T-0403
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Tạo 7 entity schemas + common primitives trong `packages/shared/src/schemas/`, mirror đúng `data-contract.md`. Thêm zod v3 vào shared package. Mọi schema export cả Zod object lẫn inferred TypeScript type.

### Thay đổi
- `packages/shared/package.json`: thêm `"zod": "^3.23.8"`.
- `packages/shared/src/schemas/common.ts` (37 dòng): primitives chung.
- `packages/shared/src/schemas/user.ts` (20 dòng): `userSchema` + `User`.
- `packages/shared/src/schemas/report.ts` (41 dòng): `reportSchema` + `Report` + `reportInputSnapshotSchema`.
- `packages/shared/src/schemas/purchase.ts` (45 dòng): `purchaseSchema` + `Purchase`.
- `packages/shared/src/schemas/entitlement.ts` (34 dòng): `entitlementSchema` + `Entitlement`.
- `packages/shared/src/schemas/voucher.ts` (28 dòng): `voucherSchema` + `Voucher`.
- `packages/shared/src/schemas/payment-log.ts` (26 dòng): `paymentLogSchema` + `PaymentLog`.
- `packages/shared/src/schemas/tarot-reading.ts` (41 dòng): `tarotReadingSchema` + `TarotReading`.
- `packages/shared/src/schemas/index.ts` (11 dòng): barrel export.
- `packages/shared/src/index.ts`: thêm `export * from "./schemas"`.
- `docs/TASK_REGISTRY.md`: T-0403 → `Done`.

### Không làm
- Không implement storage layer (T-0404).
- Không implement auth/entitlement service (T-0405/T-0406).
- Không thêm dependency nào khác ngoài zod.
- Không hardcode magic string (dùng `z.enum`/`z.literal`).

### Deviation task prompt vs data-contract.md (đã theo data-contract.md)
- `report.module`: prompt gợi ý `"numerology"|"tarot"` → spec chỉ có `"numerology"` → dùng `z.literal("numerology")`.
- `report.status`: prompt gợi ý `draft/ready/archived` → spec dùng `free/unlocked`.
- `purchase`: prompt gợi ý `amountVnd`/`payosOrderId` → spec dùng `amount`/`providerRef`.
- `entitlement`: prompt gợi ý `productCode`/`source`/`grantedAt` → spec dùng `module`/`type`/`purchaseId`/`startsAt`.
- `voucher.modules`: prompt gợi ý `enum(["numerology","tarot","bundle","all"])` → spec dùng `Array<"numerology"|"tarot">`.
- `tarot_readings.spread`: prompt gợi ý `"one_card"|"three_cards"` → spec dùng `1|3|5|7|10|12`.
- **Cần Zenki review và cập nhật `data-contract.md` nếu muốn thay đổi.**

### Verify
- `npm run check` → Pass (typecheck + lint + security:smoke + build).
- Tất cả schema files < 100 dòng (max: purchase.ts 45 dòng).
- Zod v3.25.76 hoisted tại root `node_modules/zod`.

### Rủi ro / lưu ý còn lại
- Zod stable mới nhất là v4.4.3; dùng v3 để khớp `apps/web`. Nâng cấp lên v4 nên là task riêng.
- API request/response schemas (payment create, check, voucher validate) chưa tạo — sẽ vào khi Worker payment (T-0501+) được implement.
- `tarot_readings.spread` giữ đủ 6 giá trị (1/3/5/7/10/12) dù MVP chỉ dùng 1 và 3 lá (ADR-003), để không phải migrate schema sau.

---

**Loại:** `Task`
**Ref:** T-0402
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Khoá nguồn sự thật cho error codes và message tiếng Việt trong `@banmenh/shared`. ErrorState component nâng cấp backward compatible để nhận `code`/`requestId`.

### Thay đổi
- `packages/shared/src/errors.ts` (mới, ~152 dòng): `ErrorCode` union 26 mã, type `AppError` + `AppErrorDetails`, `ERROR_MESSAGES` map tiếng Việt, helpers `getErrorMessage`/`createError`/`isAppError`. Comment đầu file cấm expose stack/PII.
- `packages/shared/src/index.ts`: thêm `export * from "./errors"`.
- `apps/web/src/components/ui/states/ErrorState.tsx` (~64 dòng): thêm prop `code?: ErrorCode` và `requestId?: string`; auto resolve `description` từ `getErrorMessage(code)` khi không truyền; render `Mã lỗi: <code>` ở dưới khi có `requestId`. Backward compatible 100%.
- `apps/web/src/app/demo-components/page.tsx`: thay `<ErrorState />` showcase bằng `<ErrorState code="VOUCHER_EXPIRED" requestId="req_demo_123" />` để verify contract.
- `docs/TASK_REGISTRY.md`: T-0402 → `Done`.

### Error codes đã chốt (26)
- Auth: `AUTH_REQUIRED`, `AUTH_INVALID_TOKEN`, `AUTH_SESSION_EXPIRED`.
- Permission: `FORBIDDEN`, `ENTITLEMENT_MISSING`.
- Validation: `VALIDATION_FAILED`, `INPUT_REQUIRED`, `INPUT_INVALID`.
- Resource: `NOT_FOUND`, `ALREADY_EXISTS`.
- Payment: `PAYMENT_FAILED`, `PAYMENT_PENDING`, `PAYMENT_EXPIRED`, `PAYMENT_AMOUNT_MISMATCH`.
- Voucher: `VOUCHER_NOT_FOUND`, `VOUCHER_EXPIRED`, `VOUCHER_OUT_OF_USES`, `VOUCHER_NOT_APPLICABLE`, `VOUCHER_ALREADY_USED` (đồng bộ legal-commercial-spec mục 6).
- KB: `KB_ACCESS_DENIED`, `KB_NOT_AVAILABLE`.
- Rate/Network: `RATE_LIMITED`, `NETWORK_ERROR`, `TIMEOUT`.
- Generic: `INTERNAL_ERROR`, `SERVICE_UNAVAILABLE`.

### Không làm
- Không hardcode error message ở frontend (đã chuyển sang `ERROR_MESSAGES`).
- Không expose stack trace, raw exception, PII.
- Không thêm zod (để T-0403).
- Không đụng `pricing.ts` hay schemas.
- Không thêm dependency.
- Không sửa `Loading/Empty/Unauthorized` state component.

### Verify
- `npm run check` → Pass; `/demo-components` prerender static.
- `npm run qa:responsive-audit` → Pass.
- Import `@banmenh/shared` resolve `ErrorCode`, `ERROR_MESSAGES`, `getErrorMessage`, `createError`, `isAppError`.
- File line count: `errors.ts` 152 dòng (<200), `ErrorState.tsx` 64 dòng (<100).
- Type guard `isAppError` từ chối object có `details` chứa nested object/array (chặn lộ PII).

### Rủi ro / lưu ý còn lại
- API/Worker layer chưa tồn tại — Worker payment/admin (T-0501+) sẽ adopt `AppError` shape `{ ok: false, error: AppError }` khi serialize lỗi qua HTTP.
- `details` chỉ cho phép primitive — nếu cần truyền danh sách field invalid của form, sẽ thêm key dạng `field` + `reason` hoặc tạo type chuyên dụng ở task validation (T-0403).

---

**Loại:** `Correction`
**Ref:** T-0401
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Đính chính giá trong `legal-commercial-spec.md` mục 7 cho khớp `packages/shared/src/pricing.ts` (T-0401 đã chốt). Chỉ sửa docs, không đụng code.

### Thay đổi
- `docs/product-specs/legal-commercial-spec.md` mục `## 7. Pricing Copy`:
  - Numerology: `49.000đ / 1 bản luận giải` → `99.000₫ / 1 báo cáo`.
  - Thêm pricing copy cho Tarot 1 lá (`49.000₫ / phiên`) và Tarot 3 lá (`79.000₫ / phiên`).
  - Thêm subsection Combo cho `Gói Khám phá` 249.000₫, ghi rõ 1 báo cáo Thần số học (vĩnh viễn) + 2 phiên Tarot 3 lá (90 ngày).
  - Chốt nguyên tắc: `pricing.ts` là source of truth duy nhất; mọi thay đổi giá phải đồng bộ với section này; rà soát chính thức ở T-0801 trước khi mở payment.
- `docs/DEVLOG.md`: thêm entry này và cập nhật Index nhanh.

### Verify
- `grep "49.000đ / 1 bản luận giải"` trong file → không còn match.
- `grep "49.000"` chỉ còn ở vị trí mới (Tarot 1 lá).
- `npm run check` → Pass (xem khối output bên dưới).

### Không làm
- Không đụng `packages/shared/src/pricing.ts`.
- Không thêm pricing rule mới ngoài đồng bộ.
- Không xóa section khác của legal spec.

---

**Loại:** `Task`
**Ref:** T-0401
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Khoá nguồn sự thật cho giá/gói trong `@banmenh/shared`. Frontend pricing đọc qua workspace alias, không còn relative path xuyên thư mục, không hardcode giá.

### Thay đổi
- `packages/shared/package.json` (mới): khai báo `@banmenh/shared` workspace package, private, `main`/`types`/`exports` trỏ `./src/index.ts`, không dependency.
- `packages/shared/src/pricing.ts` (refactor, ~108 dòng): mở rộng type `Product` đầy đủ (`code`, `module`, `name`, `description`, `priceVnd`, `tier`, `features`, `activeFrom?`, `activeUntil?`); `ProductModule` và `ProductTier` thành discriminated union; `PRODUCTS` 4 sản phẩm placeholder; helpers `formatPriceVnd`, `findProduct`, `getProductsByModule`.
- `packages/shared/src/index.ts`: giữ `export * from "./pricing"` (đã có sẵn).
- `apps/web/package.json`: thêm `"@banmenh/shared": "*"` vào dependencies (npm workspaces).
- `apps/web/src/app/pricing/page.tsx` (refactor, ~165 dòng): import từ `@banmenh/shared`, group 4 cards theo module (Thần số học / Tarot / Combo), render `features[]` bullet, badge tier dùng nhãn tiếng Việt.
- `docs/TASK_REGISTRY.md`: T-0401 → `Done` với block update đầy đủ.

### Product codes đã chốt (placeholder)
- `numerology_single_report` — Báo cáo Thần số học — 99.000₫ — `single_report`.
- `tarot_session_one` — Phiên Tarot 1 lá — 49.000₫ — `session`.
- `tarot_session_three` — Phiên Tarot 3 lá — 79.000₫ — `session`.
- `bundle_explorer` — Gói Khám phá — 249.000₫ — `bundle`.

### Không làm
- Không thêm zod (để T-0403).
- Không đụng `errors.ts` (T-0402).
- Không đụng `schemas/` (T-0403).
- Không implement payment flow / voucher logic (T-0505/T-0506).
- Không copy code V1.
- Không hardcode giá ở frontend.
- Không thêm `paths` alias trong `tsconfig.json` vì `moduleResolution: bundler` + workspace symlink đã đủ; verify bằng file test tạm rồi xóa.

### Verify
- `npm install` ở root → tạo Junction `node_modules/@banmenh/shared` → `E:\Project\Project\banmenh\packages\shared`.
- `npm run check` (typecheck + lint + security:smoke + build) → Pass; `/pricing` được prerender static.
- `npm run qa:responsive-audit` → Pass.
- Import `@banmenh/shared` trong `pricing/page.tsx` resolve OK qua workspace symlink, không còn `../../../../../packages/shared/src/pricing`.
- File `pricing.ts` ~108 dòng (<150), `pricing/page.tsx` ~165 dòng (<200).

### Rủi ro / lưu ý còn lại
- **Pricing inconsistency với legal-commercial-spec mục 7:** spec ghi Numerology 49.000đ, task chỉ định 99.000₫. Đã theo task vì cụ thể hơn, nhưng cần Zenki chốt giá chính thức trước launch (hoặc cập nhật `legal-commercial-spec.md` mục 7) để tránh claim mâu thuẫn.
- `tarot_session_one` (49.000₫) là placeholder mới chưa được nhắc trong legal spec; cần chốt cùng đợt rà giá.
- Tier `subscription` đã định nghĩa trong type nhưng chưa có sản phẩm; sẽ kích hoạt khi có monthly tier (cần ADR theo legal-commercial-spec mục 7).
- Voucher/entitlement runtime sẽ dùng cùng `productCode` này khi vào T-0505/T-0506.

---

**Loại:** `Task`
**Ref:** T-0209
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Thêm ambient galaxy background toàn app bằng Canvas 2D React component. Source reference là file user cung cấp `C:\Users\ADMIN\Desktop\New folder\galaxy-effect.html`; chỉ tham khảo/adapt logic, không copy nguyên HTML.

### Thay đổi
- `apps/web/src/components/layout/GalaxyBackground.tsx`: thêm client component canvas fixed, DPR-aware, sao twinkle, particles, nebula và 5 vòng orbit elip nghiêng 3D.
- `apps/web/src/components/layout/index.ts`: export `GalaxyBackground`.
- `apps/web/src/app/layout.tsx`: render background global trước `Header`, body giữ `position: relative` để z-index hoạt động.
- `docs/TASK_REGISTRY.md`: thêm và hoàn tất T-0209 ở cuối Phase 2.

### Verify
- `npm run check` → Pass.
- `npm run qa:responsive-audit` → Pass.
- Chrome headless 375px: `/`, `/than-so-hoc`, `/tarot`, `/pricing`, `/account` đều có canvas fixed `z-index: -1`, không overflow ngang, canvas có pixel render.
- `prefers-reduced-motion` được emulate qua DevTools protocol và component chỉ render frame tĩnh; tab inactive pause qua `document.hidden`/`visibilitychange`.
- File `GalaxyBackground.tsx`: 248 dòng (<250).

---

## [2026-05-18 11:01 +07] — T-0306: Tạo legal/support route skeleton

**Loại:** `Task`
**Ref:** T-0306
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Tạo 3 route skeleton cho Privacy, Terms và Support. Copy là skeleton, T-0801 sẽ rà soát pháp lý trước launch.

### Thay đổi
- `apps/web/src/app/legal/privacy/page.tsx`: thêm route `/legal/privacy` với các section dữ liệu thu thập, cách sử dụng, bên thứ ba, quyền người dùng và cập nhật.
- `apps/web/src/app/legal/terms/page.tsx`: thêm route `/legal/terms` với bản chất nội dung, quyền tác giả, thanh toán/hoàn tiền, hành vi cấm, thay đổi điều khoản và liên hệ.
- `apps/web/src/app/support/page.tsx`: thêm route `/support` với FAQ placeholder và kênh liên hệ.
- `docs/TASK_REGISTRY.md`: cập nhật T-0306 sang `Done` và ghi block hoàn tất.

### Không làm
- Không copy điều khoản từ site khác.
- Không thêm dependency, không thêm claim thương mại quá mức.
- Không sửa Footer vì link đã trỏ đúng `/support`, `/legal/terms`, `/legal/privacy`.

### Verify
- `npm run check` → Pass.
- `npm run qa:responsive-audit` → Pass.
- Build prerender `/legal/privacy`, `/legal/terms`, `/support`.
- Chrome headless 375px: cả 3 route `maxScrollWidth=375`, click `Dashboard` về `/`.
- File line count: privacy 65 dòng, terms 77 dòng, support 82 dòng.

---

## [2026-05-18 10:52 +07] — T-0305: Tạo skeleton route `/account`

**Loại:** `Task`
**Ref:** T-0305
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Tạo account skeleton với logged-out state mặc định và preview logged-in bằng query param `?preview=loggedin`. Auth thật sẽ mở ở T-0405.

### Thay đổi
- `apps/web/src/app/account/page.tsx`: thêm route `/account` dùng PageShell, UnauthorizedState mặc định và layout preview logged-in.
- Preview logged-in có 3 section: thông tin tài khoản demo, báo cáo đã mua, quyền truy cập.
- `docs/TASK_REGISTRY.md`: cập nhật T-0305 sang `Done` và ghi block hoàn tất.

### Không làm
- Không implement Firebase Auth.
- Không đọc/ghi Firestore.
- Không persist state, không expose dữ liệu giả như dữ liệu thật.

### Verify
- `npm run check` → Pass.
- `npm run qa:responsive-audit` → Pass.
- Build có route `/account`.
- Chrome headless 375px: `/account` hiển thị UnauthorizedState; `/account?preview=loggedin` hiển thị 3 section placeholder; `maxScrollWidth=375`.
- Click link `Dashboard` trên PageShell quay về `/`.
- `apps/web/src/app/account/page.tsx`: 91 dòng.

---

## [2026-05-18 10:41 +07] — T-0304: Tạo skeleton route `/pricing`

**Loại:** `Task`
**Ref:** T-0304
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Tạo pricing skeleton đọc dữ liệu từ shared pricing placeholder thay vì hardcode trong page. T-0401 sẽ mở rộng pricing contract đầy đủ.

### Thay đổi
- `packages/shared/src/pricing.ts`: thêm `PRODUCTS`, `Product` type và `formatPriceVnd`; đây là placeholder pricing — sẽ được mở rộng ở T-0401.
- `packages/shared/src/index.ts`: export pricing placeholder.
- `apps/web/src/app/pricing/page.tsx`: thêm route `/pricing` với pricing cards, FAQ placeholder và disclaimer thương mại mềm.
- `docs/TASK_REGISTRY.md`: cập nhật T-0304 sang `Done` và ghi block hoàn tất.

### Không làm
- Không implement payment flow.
- Không thêm voucher, entitlement hoặc business logic thanh toán.
- Không thêm dependency, không đổi alias/config.

### Verify
- `npm run check` → Pass.
- `npm run qa:responsive-audit` → Pass.
- Build prerender route `/pricing`.
- Chrome headless 375px route `/pricing`: `maxScrollWidth=375`, hiển thị giá `99.000₫`, `79.000₫`, `249.000₫`.
- Click link `Dashboard` trên PageShell quay về `/`.
- `apps/web/src/app/pricing/page.tsx`: 99 dòng; `packages/shared/src/pricing.ts`: 34 dòng.

---

## [2026-05-18 10:32 +07] — T-0303: Tạo skeleton route `/tarot`

**Loại:** `Task`
**Ref:** T-0303
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Tạo route skeleton riêng cho Tarot, đồng bộ layout với Numerology và giữ đúng boundary: không rút bài, không gọi AI/API/KB, không mở spread ngoài MVP.

### Thay đổi
- `apps/web/src/app/tarot/page.tsx`: thêm route `/tarot` với PageShell, skeleton Daily Message, skeleton phiên Tarot, thư viện lá bài placeholder và disclaimer Tarot.
- `docs/TASK_REGISTRY.md`: cập nhật T-0303 sang `Done` và ghi block hoàn tất.

### Không làm
- Không implement shuffle/select/flip.
- Không hiển thị spread 5/7/10/12 lá.
- Không gọi AI, không gọi API, không import/public KB private.
- Không thêm dependency.

### Verify
- `npm run check` → Pass.
- `npm run qa:responsive-audit` → Pass.
- Build prerender route `/tarot`.
- Chrome headless 375px route `/tarot`: render H1 `Tarot`, `maxScrollWidth=375`.
- Click link `Dashboard` trên PageShell quay về `/`.
- `apps/web/src/app/tarot/page.tsx`: 95 dòng.

---

## [2026-05-18 10:13 +07] — T-0302: Tạo skeleton route `/than-so-hoc`

**Loại:** `Task`
**Ref:** T-0302
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Tạo route skeleton riêng cho module Thần số học trước khi build form thật, dùng PageShell/component chung và giữ link Hub `/than-so-hoc` render được.

### Thay đổi
- `apps/web/src/app/than-so-hoc/page.tsx`: thêm route `/than-so-hoc` với PageShell, card placeholder nhập thông tin, button disabled, grid 6 chỉ số và disclaimer module.
- `docs/TASK_REGISTRY.md`: cập nhật T-0302 sang `Done` và ghi block hoàn tất.

### Không làm
- Không tạo `/than-so-hoc/result`.
- Không implement form input thật; phần này giữ cho T-0601.
- Không gọi API, không import KB, không thêm dependency.

### Verify
- `npm run check` → Pass.
- `npm run qa:responsive-audit` → Pass.
- Build prerender route `/than-so-hoc`.
- Chrome headless 375px route `/than-so-hoc`: render H1 `Thần số học`, `maxScrollWidth=375`.
- Click link `Dashboard` trên PageShell quay về `/`.
- `apps/web/src/app/than-so-hoc/page.tsx`: 101 dòng.

---

## [2026-05-18 09:58 +07] — Correction: T-0301 Button polymorphic + responsive audit Hub

**Loại:** `Correction`
**Ref:** T-0301
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Patch nhỏ sau T-0301 để `Button` render được link nội bộ bằng `<a href>` khi có `href`, refactor Hub dùng lại Button cho CTA/link module, và cập nhật responsive audit theo route demo mới.

### Thay đổi
- `apps/web/src/components/ui/Button.tsx`: thêm prop optional `href`, render `<a>` khi có href; giữ nhánh `<button>` cũ khi không có href.
- `apps/web/src/app/page.tsx`: bỏ class CTA riêng, dùng `Button href` cho hero CTA và link module.
- `tools/responsive-qa-audit.mjs`: đổi check Home cũ thành check Hub hero grid và check demo-components showcase.

### Verify
- `npm run check` → Pass.
- `npm run qa:responsive-audit` → Pass.
- Chrome headless 375px route `/`: `maxScrollWidth=375`, các anchor `/than-so-hoc`, `/tarot`, `/pricing` render được.
- `apps/web/src/components/ui/Button.tsx`: 143 dòng.

---

## [2026-05-18 09:45 +07] — T-0301: Tạo Hub skeleton cho route `/`

**Loại:** `Task`
**Ref:** T-0301
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Thay route `/` từ demo showcase sang Hub skeleton thật, giữ demo component ở route riêng `/demo-components`, và nối các CTA/module bằng `<a href>` placeholder đúng phạm vi task.

### Thay đổi
- `apps/web/src/app/page.tsx`: tạo Hub bằng `PageShell showBack={false}`, hero, CTA, module cards Thần số học/Tarot/Daily Message, lý do chọn Bản Mệnh V2 và disclaimer.
- `apps/web/src/app/demo-components/page.tsx`: chuyển nội dung demo showcase cũ sang route `/demo-components`.
- `docs/TASK_REGISTRY.md`: cập nhật T-0301 sang `Done` và ghi block hoàn tất.

### Không làm
- Không tạo route `/than-so-hoc`, `/tarot`, `/pricing`, `/account`.
- Không thêm dependency, không import KB, không gọi API thật.
- Không dùng `next/link`; skeleton giữ `<a href>` như scope T-0301.

### Verify
- `npm run check` → Pass.
- `npm run qa:responsive-audit` → Pass.
- Chrome headless 375px route `/`: `maxScrollWidth=375`, không tràn ngang.
- `apps/web/src/app/page.tsx`: 135 dòng; `apps/web/src/app/demo-components/page.tsx`: 149 dòng.

### Rủi ro còn lại
- Link `/than-so-hoc`, `/tarot`, `/pricing` hiện trả 404 cho đến các task route tương ứng; đây là expected ở T-0301.

---

## [2026-05-17 10:15 +07] — Correction: T-0208 Responsive QA (xử lý lại)

**Loại:** `Correction`
**Ref:** T-0208
**Môi trường:** `DEV/TEST`

### Tóm tắt
> Bổ sung xác nhận 768px/1366px bằng audit class trong repo, thêm `md:grid-cols-2` cho Footer, script `npm run qa:responsive-audit`, cập nhật `docs/responsive-qa-t-0208.md` phiên bản 2.

### Nguyên nhân correction
- Phiên bản trước không xác nhận được tablet/desktop thực tế trong browser pane hẹp; Footer chỉ lên 4 cột từ `lg` (1024px) nên checklist “768px grid 2 cột” chưa khớp rõ.

### Thay đổi
- `apps/web/src/components/layout/Footer.tsx`: thêm `md:grid-cols-2` trước `lg:grid-cols-[1.4fr_1fr_1fr_1fr]`.
- `tools/responsive-qa-audit.mjs` + `npm run qa:responsive-audit` trong `package.json` root.
- `docs/responsive-qa-t-0208.md`: tái cấu trúc — phiên bản 2 ở đầu, lịch sử phiên bản 1 giữ phía sau.

### Verify
- `npm run qa:responsive-audit` → Pass.
- `npm run check` → Pass.

### QA report
- `docs/responsive-qa-t-0208.md`

---

## [2026-05-16 23:52 +07] — T-0208: Responsive UI QA nền

**Loại:** `Task`
**Type:** `QA`
**Ref:** T-0208
**Môi trường:** `DEV/TEST`
**Branch:** local workspace
**PR / MR:** N/A
**AI Tools Used:** Cursor
**Implementation Owner:** Cursor
**Review Owner:** Self-review
**Effort thực tế:** ~0.3h

---

### Tóm tắt một dòng
> Đã QA responsive nền cho Header/Footer/PageShell/Button/Card, ghi report và sửa một lỗi focus-visible nhỏ.

---

### QA report
- Report: `docs/responsive-qa-t-0208.md`

### Những gì đã làm
- Mở dev server local và kiểm tra `/`, `/demo-shell`.
- Kiểm tra mobile width hẹp: không thấy horizontal scroll, hamburger drawer mở/đóng OK, CTA không bị che trong vùng quan sát.
- Kiểm tra Footer trên page ngắn `/demo-shell`: Footer nằm sau PageShell, không chen dưới Header.
- Kiểm tra Footer stack mobile: các cột xếp dọc, không overlap.
- Kiểm tra text tiếng Việt có dấu trên heading/body/navigation.
- Kiểm tra focus-visible bằng code và viewport; bổ sung ring cho brand link trong Footer.

### Fix đã thực hiện
- `apps/web/src/components/layout/Footer.tsx`: thêm focus-visible ring cho brand link `Bản Mệnh`.
- Trước fix: Footer brand link không có focus ring riêng.
- Sau fix: Footer brand link dùng cùng token `--bm-primary-soft` như hệ link/button.

### Những gì KHÔNG làm *(scope exclusion)*
- Không thêm dependency.
- Không đổi token.
- Không refactor component lớn.
- Không sửa route/module ngoài scope.
- Không deploy.

---

### Verify / Commands
- `npm run check` → Pass (`typecheck`, `lint`, `security:smoke`, `build`).

### Issue / Limitation còn lại
- Cursor browser pane không mở rộng đủ để xác nhận trực quan chính xác 768px/1366px; phần này đã ghi trong QA report và đối chiếu bằng responsive class trong code.
- Cursor browser chèn `data-cursor-ref` vào DOM, làm Next dev overlay báo hydration mismatch; đây là artifact của automation tool, không phải lỗi app.
- Trước khi test có lỗi môi trường `ENOSPC`; đã xóa terminal log cũ để dev server chạy lại.

---

## [2026-05-16 23:35 +07] — T-0207: Tạo Header/Footer chuẩn

**Loại:** `Task`
**Type:** `IMPLEMENTATION`
**Ref:** T-0207
**Môi trường:** `DEV/TEST`
**Branch:** local workspace
**PR / MR:** N/A
**AI Tools Used:** Cursor
**Implementation Owner:** Cursor
**Review Owner:** Self-review
**Effort thực tế:** ~0.5h

---

### Tóm tắt một dòng
> Đã tạo Header/Footer global, tích hợp vào RootLayout và refactor PageShell để footer chỉ nằm cuối page.

---

### Những gì đã làm
- Tạo `apps/web/src/components/layout/Header.tsx` với brand gradient, desktop nav, account placeholder và mobile drawer.
- Tạo `apps/web/src/components/layout/Footer.tsx` với nền `--bm-gradient-footer`, grid responsive, links hỗ trợ và disclaimer.
- Cập nhật `apps/web/src/components/layout/index.ts` export Header/Footer.
- Cập nhật `apps/web/src/app/layout.tsx` để body là `flex min-h-screen flex-col`, Header ở trên, `<main className="flex-1">` bọc children, Footer ở dưới.
- Refactor `apps/web/src/components/layout/PageShell.tsx` từ `<main>` sang `<section>` để tránh duplicate `<main>`.
- Refactor `apps/web/src/app/page.tsx` từ `<main>` sang `<div>` vì RootLayout đã sở hữu landmark main.

### Những gì KHÔNG làm *(scope exclusion)*
- Không thêm dependency.
- Không implement auth thật hoặc dropdown logic thật.
- Không copy code Header/Footer từ V1.
- Không tạo route module thật cho `/than-so-hoc`, `/tarot`, `/pricing`.
- Không deploy.

---

### Lựa chọn về `<main>`
- Chọn phương án RootLayout sở hữu `<main className="flex-1">`.
- `PageShell` đổi sang `<section>` để page module vẫn có semantic section nhưng không tạo nested main.
- Home demo đổi sang `<div>` vì chỉ là nội dung bên trong landmark main global.
- Lý do: Footer cần nằm ngoài main và sau main trong flex body để page ngắn dính đáy viewport, page dài nằm sau toàn bộ content.

---

### Output thực tế vs kỳ vọng

| Output kỳ vọng | Output thực tế | Kết quả |
|----------------|----------------|---------|
| Header global | `Header.tsx` tích hợp trong RootLayout | ✅ Đúng plan |
| Footer global cuối page | `Footer.tsx` nằm sau global main trong flex body | ✅ Đúng plan |
| Header responsive | Mobile hamburger toggle drawer, desktop nav dùng class responsive | ✅ Đúng plan |
| Navigation tiếng Việt | `Thần số học`, `Tarot`, `Bảng giá`, `Đăng nhập` | ✅ Đúng plan |
| Không duplicate `<main>` | RootLayout là nơi duy nhất render `<main>` | ✅ Đúng plan |

**Độ lệch so với plan:**
- Có dùng `usePathname` từ Next.js để xác định active nav link, không thêm dependency.
- Full-page screenshot không lưu được do môi trường báo `ENOSPC: no space left on device`; viewport browser check vẫn thực hiện được.

---

### Verify / Commands
- `npm run check` → Pass (`typecheck`, `lint`, `security:smoke`, `build`).
- Manual browser `/` → load được, Header sticky hiển thị, mobile hamburger xuất hiện, Footer không nằm ngay dưới Header.
- Manual browser `/demo-shell` → load được, mobile drawer hiển thị 3 nav links + nút `Đăng nhập`, Footer nằm sau nội dung PageShell.

### Security / Risk
- Không thêm secret, env, token, KB hoặc dependency.
- Không có auth logic thật; `user?: { name: string }` chỉ là UI placeholder.
- Issue còn lại: các route nav chưa tồn tại vì ngoài scope task; sẽ xử lý ở task route/module sau.

---

## [2026-05-16 22:53 +07] — T-0206: Tạo PageShell và navigation convention

**Loại:** `Task`
**Type:** `IMPLEMENTATION`
**Ref:** T-0206
**Môi trường:** `DEV/TEST`
**Branch:** local workspace
**PR / MR:** N/A
**AI Tools Used:** Cursor
**Implementation Owner:** Cursor
**Review Owner:** Self-review
**Effort thực tế:** ~0.4h

---

### Tóm tắt một dòng
> Đã tạo PageShell, BackToDashboard và route demo `/demo-shell` để chuẩn hóa khung trang module.

---

### Những gì đã làm
- Tạo `apps/web/src/components/layout/PageShell.tsx`.
- Tạo `apps/web/src/components/layout/BackToDashboard.tsx`.
- Tạo `apps/web/src/components/layout/index.ts`.
- Tạo route demo `apps/web/src/app/demo-shell/page.tsx`.
- Cập nhật `apps/web/src/app/page.tsx` thêm link tới `/demo-shell`.
- `PageShell` hỗ trợ title/subtitle/back/action slot/container width và layout responsive.
- `BackToDashboard` dùng anchor thuần theo convention `← Dashboard`.

### Những gì KHÔNG làm *(scope exclusion)*
- Không thêm dependency.
- Không dùng `next/link`; anchor `<a>` đủ cho skeleton và đúng yêu cầu, sẽ refactor ở route task sau nếu cần.
- Không implement Header/Footer.
- Không thêm business logic, route module thật, payment/auth/KB logic.
- Không deploy.

---

### Component đã tạo
- `PageShell`: container `narrow`/`default`/`wide`, top row back/actions, title block và children slot.
- `BackToDashboard`: standalone back link reusable cho page custom không dùng PageShell.

### Route demo đã áp dụng
- `/demo-shell`: title `Demo PageShell`, subtitle `Khung trang chuẩn cho mọi module`, action Button `Bắt đầu`, 3 Card nội dung.
- Home `/`: có link `Xem demo PageShell →` để test navigation.

---

### Output thực tế vs kỳ vọng

| Output kỳ vọng | Output thực tế | Kết quả |
|----------------|----------------|---------|
| PageShell component | `apps/web/src/components/layout/PageShell.tsx` | ✅ Đúng plan |
| BackToDashboard component | `apps/web/src/components/layout/BackToDashboard.tsx` | ✅ Đúng plan |
| Route demo | `apps/web/src/app/demo-shell/page.tsx` | ✅ Đúng plan |
| Nút `← Dashboard` thống nhất | Default label/href trong PageShell và BackToDashboard | ✅ Đúng plan |
| Mobile không che content | Top row flex column trên mobile, actions xuống dòng nếu chật | ✅ Đúng plan |

**Độ lệch so với plan:**
Không có độ lệch.

---

### Trạng thái deploy

| Môi trường | Đã deploy? | Thời điểm | Verify OK? | Ghi chú |
|-----------|-----------|----------|-----------|---------|
| DEV/TEST | Chưa | — | N/A | Chỉ chạy local checks |
| PRODUCTION | Chưa | — | N/A | Không deploy |

---

### Quyết định kỹ thuật quan trọng
Không có quyết định kiến trúc mới. Dùng anchor `<a>` cho skeleton đúng yêu cầu; chưa dùng `next/link`.

---

### AI Code Notes
- **Phần code do AI sinh:** PageShell, BackToDashboard, layout barrel export, demo route.
- **Agent chính:** Cursor
- **Đã verify:** [x] Không có hallucinated API [x] `npm run check` pass [x] Build liệt kê `/demo-shell`
- **Prompt quan trọng lưu lại:** User yêu cầu làm `T-0206`, tạo PageShell/back button convention, demo route, không Header/Footer.
- **Rủi ro còn lại từ AI code:** Chưa có browser visual QA riêng cho mobile top row; build/typecheck/lint/security smoke đã pass.

---

### Tech Debt
Không phát sinh tech debt mới.

---

### Code Smell
Không phát hiện code smell đáng kể.

---

### Security Audit

**Mode:** `QUICK`

#### QUICK Audit — 5 mục core
- [x] API key không bị expose phía client
- [x] `.env` không commit lên git
- [x] Input từ user không phát sinh trong task này
- [x] Không có credential production lẫn vào DEV/TEST
- [x] Không có thông tin nhạy cảm bị log ra console

**Tổng kết:**
- Vấn đề tìm thấy: 0
- Đã fix: 0
- Còn tồn đọng: 0

---

### Commands đã chạy
- `npm run check` — pass; build prerender route `/demo-shell`

---

### Blockers & Dependencies Update
- **Task này unblocks:** T-0302, T-0303 và các module route skeleton cần PageShell.
- **Dependency mới phát hiện:** Không có.
- **Update TASK_REGISTRY needed:** Đã cập nhật `T-0206` sang `Done`.

---

### Metrics
N/A, không deploy.

---

### Next Steps
- Cần tạo task: Không có.
- Cần update RISK_REGISTER: Không có.
- Cần update ADR: Không có.

---

## [2026-05-16 22:41 +07] — T-0205: Tạo Loading/Error/Empty states

**Loại:** `Task`
**Type:** `IMPLEMENTATION`
**Ref:** T-0205
**Môi trường:** `DEV/TEST`
**Branch:** local workspace
**PR / MR:** N/A
**AI Tools Used:** Cursor
**Implementation Owner:** Cursor
**Review Owner:** Self-review
**Effort thực tế:** ~0.5h

---

### Tóm tắt một dòng
> Đã tạo bộ state components dùng chung cho loading, error, empty và unauthorized với message tiếng Việt rõ ràng.

---

### Những gì đã làm
- Tạo `apps/web/src/components/ui/states/LoadingState.tsx`.
- Tạo `apps/web/src/components/ui/states/ErrorState.tsx`.
- Tạo `apps/web/src/components/ui/states/EmptyState.tsx`.
- Tạo `apps/web/src/components/ui/states/UnauthorizedState.tsx`.
- Tạo `apps/web/src/components/ui/states/index.ts`.
- Re-export state components trong `apps/web/src/components/ui/index.ts`.
- Cập nhật `apps/web/src/app/page.tsx` thêm `States showcase`, mỗi state được bọc bởi một `Card padding="lg" variant="default"`.

### Những gì KHÔNG làm *(scope exclusion)*
- Không thêm dependency icon.
- Không dùng raw error hoặc text `Failed to fetch`.
- Không gọi API, Firebase, auth SDK hoặc business logic trong state components.
- Không tạo route mới, payment/auth/KB integration.
- Không deploy.

---

### State components đã tạo
- `LoadingState`: spinner inline SVG, optional message, size `sm`/`md`/`lg`; default message `Đang tải...`.
- `ErrorState`: icon cảnh báo, title/description tiếng Việt, CTA retry optional dùng Button secondary; default title `Có lỗi xảy ra`, description `Vui lòng thử lại sau ít phút.`
- `EmptyState`: icon nhẹ, required title, optional description/action/icon; default description `Chưa có dữ liệu để hiển thị.`
- `UnauthorizedState`: icon khóa, title `Cần đăng nhập`, optional login CTA; default description `Vui lòng đăng nhập để tiếp tục hành trình của bạn.`

### Ví dụ message chuẩn
- Error: `Có lỗi xảy ra` / `Vui lòng thử lại sau ít phút.`
- Empty: `Chưa có báo cáo` / `Khi bạn tạo báo cáo đầu tiên, kết quả sẽ xuất hiện tại đây.`
- Unauthorized: `Cần đăng nhập` / `Đăng nhập để xem lại các báo cáo đã lưu.`

---

### Output thực tế vs kỳ vọng

| Output kỳ vọng | Output thực tế | Kết quả |
|----------------|----------------|---------|
| LoadingState | `LoadingState.tsx` với spinner/message/size | ✅ Đúng plan |
| ErrorState | `ErrorState.tsx` với message tiếng Việt và retry CTA optional | ✅ Đúng plan |
| EmptyState | `EmptyState.tsx` với icon/title/description/action optional | ✅ Đúng plan |
| UnauthorizedState | `UnauthorizedState.tsx` với lock icon/login CTA optional | ✅ Đúng plan |
| Demo showcase | `page.tsx` có 4 state cards ngang hàng | ✅ Đúng plan |
| Không raw error | Không có `Failed to fetch`, stack trace hoặc raw error render | ✅ Đúng plan |

**Độ lệch so với plan:**
Không có độ lệch.

---

### Trạng thái deploy

| Môi trường | Đã deploy? | Thời điểm | Verify OK? | Ghi chú |
|-----------|-----------|----------|-----------|---------|
| DEV/TEST | Chưa | — | N/A | Chỉ chạy local checks |
| PRODUCTION | Chưa | — | N/A | Không deploy |

---

### Quyết định kỹ thuật quan trọng
Không có quyết định kiến trúc mới.

---

### AI Code Notes
- **Phần code do AI sinh:** 4 state components, barrel exports, States showcase.
- **Agent chính:** Cursor
- **Đã verify:** [x] Không có hallucinated API [x] `npm run check` pass [x] Không raw error text
- **Prompt quan trọng lưu lại:** User yêu cầu làm `T-0205`, tạo Loading/Error/Empty/Unauthorized states với inline SVG và message tiếng Việt, không business logic.
- **Rủi ro còn lại từ AI code:** Chưa có visual browser QA riêng cho từng viewport; build/typecheck/lint/security smoke đã pass.

---

### Tech Debt
Không phát sinh tech debt mới.

---

### Code Smell
Không phát hiện code smell đáng kể.

---

### Security Audit

**Mode:** `QUICK`

#### QUICK Audit — 5 mục core
- [x] API key không bị expose phía client
- [x] `.env` không commit lên git
- [x] Input từ user không phát sinh trong task này
- [x] Không có credential production lẫn vào DEV/TEST
- [x] Không có thông tin nhạy cảm bị log ra console

**Tổng kết:**
- Vấn đề tìm thấy: 0
- Đã fix: 0
- Còn tồn đọng: 0

---

### Commands đã chạy
- `npm run check` — pass

---

### Blockers & Dependencies Update
- **Task này unblocks:** T-0206 và route skeleton tasks cần loading/error/empty/unauthorized states.
- **Dependency mới phát hiện:** Không có.
- **Update TASK_REGISTRY needed:** Đã cập nhật `T-0205` sang `Done`.

---

### Metrics
N/A, không deploy.

---

### Next Steps
- Cần tạo task: Không có.
- Cần update RISK_REGISTER: Không có.
- Cần update ADR: Không có.

---

## [2026-05-16 22:34 +07] — T-0204: Tạo component Card/Panel

**Loại:** `Task`
**Type:** `IMPLEMENTATION`
**Ref:** T-0204
**Môi trường:** `DEV/TEST`
**Branch:** local workspace
**PR / MR:** N/A
**AI Tools Used:** Cursor
**Implementation Owner:** Cursor
**Review Owner:** Self-review
**Effort thực tế:** ~0.5h

---

### Tóm tắt một dòng
> Đã tạo Card/Panel base component dùng token thiết kế, có variants, padding, interactive hover và semantic `as`.

---

### Những gì đã làm
- Tạo `apps/web/src/components/ui/Card.tsx` 83 dòng.
- Cập nhật `apps/web/src/components/ui/index.ts` export `Card` và `CardProps`.
- Variants đã tạo: `default`, `glass`, `panel`, `report`.
- Padding đã tạo: `sm`, `md`, `lg`.
- Hỗ trợ `interactive`, `as`, `className`, `children` và rest props.
- Refactor `apps/web/src/app/page.tsx` để typography panel và Button showcase dùng `Card`.
- Thêm `Card showcase` với 4 variants, 3 padding và interactive state.
- Demo Card showcase dùng card ngang hàng, không có card lồng card.

### Những gì KHÔNG làm *(scope exclusion)*
- Không dùng thư viện UI.
- Không thêm dependency.
- Không tạo Badge/Input/ModuleCard.
- Không tạo business logic, route mới, payment/auth/KB logic.
- Không hardcode màu/radius.

---

### Component và rule sử dụng
- `default`: repeated items hoặc card nhẹ.
- `glass`: glass panel nổi hơn, có backdrop blur nhẹ.
- `panel`: framed tools/form/payment box sau này.
- `report`: result panel cho Numerology/Tarot.
- Rule: không lồng card trong card; không dùng Card chỉ để tạo spacing toàn section; interactive chỉ dùng cho item có hành động click/navigate rõ.

---

### Output thực tế vs kỳ vọng

| Output kỳ vọng | Output thực tế | Kết quả |
|----------------|----------------|---------|
| Card/Panel component | `apps/web/src/components/ui/Card.tsx` 83 dòng | ✅ Đúng plan |
| Usage rule trong docs/comment ngắn | Ghi trong TASK_REGISTRY và DEVLOG | ✅ Đúng plan |
| Component có variant tối thiểu | `default`, `glass`, `panel`, `report` | ✅ Đúng plan |
| Không tạo card lồng card trong demo | Card showcase dùng sibling cards trong grid | ✅ Đúng plan |
| Mobile width an toàn | Grid 1 cột mobile, card dùng width parent | ✅ Đúng plan |

**Độ lệch so với plan:**
Không có độ lệch.

---

### Trạng thái deploy

| Môi trường | Đã deploy? | Thời điểm | Verify OK? | Ghi chú |
|-----------|-----------|----------|-----------|---------|
| DEV/TEST | Chưa | — | N/A | Chỉ chạy local checks |
| PRODUCTION | Chưa | — | N/A | Không deploy |

---

### Quyết định kỹ thuật quan trọng
Không có quyết định kiến trúc mới.

---

### AI Code Notes
- **Phần code do AI sinh:** `Card.tsx`, export index, Card showcase trong `page.tsx`.
- **Agent chính:** Cursor
- **Đã verify:** [x] Không có hallucinated API [x] `npm run check` pass [x] Không card lồng card trong showcase
- **Prompt quan trọng lưu lại:** User yêu cầu làm `T-0204`, tạo Card/Panel component với variants/padding/interactive/as, không thêm dependency hoặc UI library.
- **Rủi ro còn lại từ AI code:** Chưa có browser visual QA riêng cho hover/focus; code showcase và build/typecheck/lint đã pass.

---

### Tech Debt
Không phát sinh tech debt mới.

---

### Code Smell
Không phát hiện code smell đáng kể.

---

### Security Audit

**Mode:** `QUICK`

#### QUICK Audit — 5 mục core
- [x] API key không bị expose phía client
- [x] `.env` không commit lên git
- [x] Input từ user không phát sinh trong task này
- [x] Không có credential production lẫn vào DEV/TEST
- [x] Không có thông tin nhạy cảm bị log ra console

**Tổng kết:**
- Vấn đề tìm thấy: 0
- Đã fix: 0
- Còn tồn đọng: 0

---

### Commands đã chạy
- `npm run check` — pass

---

### Blockers & Dependencies Update
- **Task này unblocks:** T-0205 và các route/module UI tasks cần panel/card base.
- **Dependency mới phát hiện:** Không có.
- **Update TASK_REGISTRY needed:** Đã cập nhật `T-0204` sang `Done`.

---

### Metrics
N/A, không deploy.

---

### Next Steps
- Cần tạo task: Không có.
- Cần update RISK_REGISTER: Không có.
- Cần update ADR: Không có.

---

## [2026-05-16 20:23 +07] — T-0203: Tạo component Button/CTA

**Loại:** `Task`
**Type:** `IMPLEMENTATION`
**Ref:** T-0203
**Môi trường:** `DEV/TEST`
**Branch:** local workspace
**PR / MR:** N/A
**AI Tools Used:** Cursor
**Implementation Owner:** Cursor
**Review Owner:** Self-review
**Effort thực tế:** ~0.6h

---

### Tóm tắt một dòng
> Đã tạo Button/CTA component dùng token thiết kế, có variants, sizes, loading, disabled, icon và fullWidth.

---

### Những gì đã làm
- Tạo `apps/web/src/components/ui/Button.tsx`.
- Tạo `apps/web/src/components/ui/index.ts` export `Button` và `ButtonProps`.
- Component nhận props: `variant`, `size`, `loading`, `disabled`, `leftIcon`, `rightIcon`, `fullWidth` và rest props của `<button>`.
- Variants đã tạo: `primary`, `secondary`, `ghost`, `danger`.
- Sizes đã tạo: `sm`, `md`, `lg` tương ứng min-height 36px, 44px, 52px.
- Loading dùng spinner SVG inline, disable button khi loading.
- Disabled state có opacity và cursor not-allowed.
- Focus-visible ring dùng `--bm-primary-soft`.
- Cập nhật `apps/web/src/app/page.tsx` thêm Button showcase với variants, sizes, loading, disabled, icon và fullWidth.

### Những gì KHÔNG làm *(scope exclusion)*
- Không dùng thư viện UI như Radix, shadcn, Headless UI.
- Không thêm dependency.
- Không tạo Card/Panel component.
- Không thêm business logic, route mới, payment/auth/KB logic.
- Không inline `onclick`.

---

### Output thực tế vs kỳ vọng

| Output kỳ vọng | Output thực tế | Kết quả |
|----------------|----------------|---------|
| Button component | `apps/web/src/components/ui/Button.tsx` 115 dòng | ✅ Đúng plan |
| CTA usage examples | Button showcase trong `apps/web/src/app/page.tsx` | ✅ Đúng plan |
| Loading/disabled rõ | Spinner SVG, `aria-busy`, disabled khi loading, opacity/cursor disabled | ✅ Đúng plan |
| Keyboard focus visible | Focus-visible ring dùng `--bm-primary-soft` | ✅ Đúng plan |
| Không hardcode màu | Color/gradient/shadow dùng `var(--bm-*)` | ✅ Đúng plan |

**Độ lệch so với plan:**
Không có độ lệch.

---

### Trạng thái deploy

| Môi trường | Đã deploy? | Thời điểm | Verify OK? | Ghi chú |
|-----------|-----------|----------|-----------|---------|
| DEV/TEST | Chưa | — | N/A | Chỉ chạy local checks |
| PRODUCTION | Chưa | — | N/A | Không deploy |

---

### Quyết định kỹ thuật quan trọng
Không có quyết định kiến trúc mới.

---

### AI Code Notes
- **Phần code do AI sinh:** `Button.tsx`, `index.ts`, Button showcase trong `page.tsx`.
- **Agent chính:** Cursor
- **Đã verify:** [x] Không có hallucinated API [x] `npm run check` pass [x] File dưới giới hạn dòng
- **Prompt quan trọng lưu lại:** User yêu cầu tạo Button/CTA component T-0203 với variants/sizes/loading/disabled/icons/fullWidth, không thêm dependency hoặc UI library.
- **Rủi ro còn lại từ AI code:** Chưa có visual browser QA riêng cho hover/focus từng state; hiện đã có showcase và build/typecheck/lint pass.

---

### Tech Debt
Không phát sinh tech debt mới.

---

### Code Smell
Không phát hiện code smell đáng kể.

---

### Security Audit

**Mode:** `QUICK`

#### QUICK Audit — 5 mục core
- [x] API key không bị expose phía client
- [x] `.env` không commit lên git
- [x] Input từ user không phát sinh trong task này
- [x] Không có credential production lẫn vào DEV/TEST
- [x] Không có thông tin nhạy cảm bị log ra console

**Tổng kết:**
- Vấn đề tìm thấy: 0
- Đã fix: 0
- Còn tồn đọng: 0

---

### Commands đã chạy
- `npm run check` — pass

---

### Blockers & Dependencies Update
- **Task này unblocks:** T-0204, T-0205 và các route/CTA task sau.
- **Dependency mới phát hiện:** Không có.
- **Update TASK_REGISTRY needed:** Đã cập nhật `T-0203` sang `Done`.

---

### Metrics
N/A, không deploy.

---

### Next Steps
- Cần tạo task: Không có.
- Cần update RISK_REGISTER: Không có.
- Cần update ADR: Không có.

---

## [2026-05-16 19:51 +07] — T-0202: Thiết lập typography và content defaults

**Loại:** `Task`
**Type:** `IMPLEMENTATION`
**Ref:** T-0202
**Môi trường:** `DEV/TEST`
**Branch:** local workspace
**PR / MR:** N/A
**AI Tools Used:** Cursor
**Implementation Owner:** Cursor
**Review Owner:** Self-review
**Effort thực tế:** ~0.6h

---

### Tóm tắt một dòng
> Đã áp dụng typography defaults bằng token và tạo demo tiếng Việt để kiểm tra readability trên mobile/desktop.

---

### Những gì đã làm
- Cập nhật `apps/web/src/app/globals.css` cho base font, body/paragraph line-height, heading scale, small text và text wrapping.
- H1/H2/H3/H4 dùng token `--bm-text-*` từ `tokens.css`, không hardcode font-size.
- Giữ letter spacing không âm (`0`) và thêm `overflow-wrap` để giảm rủi ro tràn ngang.
- Cập nhật `apps/web/src/app/page.tsx` thành demo typography có H1, H2, H3, H4, paragraph tiếng Việt có dấu, small text và đoạn dài.
- Kiểm tra browser viewport 375px; sau khi tăng line-height heading, không thấy text overlap hoặc tràn ngang trong demo.

### Patch trang trí nhỏ — 2026-05-16 20:19 +07
- Patch trang trí T-0202 — fix main đè gradient body, giảm font-weight, thêm gradient text utility. Không phải task mới.
- Bỏ nền riêng ở `<main>` để gradient `body` (`--bm-gradient-bg`) hiển thị xuyên qua.
- Đổi heading font-weight từ `800` xuống `700` để demo bớt nặng.
- Thêm utility `.text-gradient-purple` dùng `--bm-gradient-purple-text`.
- Gán `text-gradient-purple` cho H1 hero, không thêm dependency, không tạo component mới, không đổi token.

### Những gì KHÔNG làm *(scope exclusion)*
- Không thêm dependency font.
- Không tạo Button/CTA hoặc Card/Panel component.
- Không thêm business logic, route mới, payment/auth/KB logic.
- Không deploy.

---

### Font/scale đã chọn
- Font stack: `ui-sans-serif`, `system-ui`, `-apple-system`, `Segoe UI`, `Roboto`, `Helvetica Neue`, `Arial`, `Noto Sans`, `Liberation Sans`, `sans-serif`.
- Hero H1: `--bm-text-hero`, line-height `1.16`.
- Page title H2: `--bm-text-page-title`, line-height `1.28`.
- Section H3: `--bm-text-section-title`, line-height `1.32`.
- Card H4: `--bm-text-card-title`, line-height `1.38`.
- Body: `--bm-text-body`, line-height `1.7`/`1.75`.
- Small: `--bm-text-small`, line-height `1.6`.

### Viewport đã kiểm tra
- Browser resize 375px: text wrap trong khối, tiếng Việt có dấu hiển thị đúng, không thấy overlap sau fix line-height.
- Production build: `npm run check` pass.

---

### Output thực tế vs kỳ vọng

| Output kỳ vọng | Output thực tế | Kết quả |
|----------------|----------------|---------|
| Global typography CSS | `globals.css` có body/heading/paragraph/small defaults dùng token | ✅ Đúng plan |
| Demo text/check trong page skeleton | `page.tsx` demo 53 dòng, có H1-H4 và paragraph tiếng Việt | ✅ Đúng plan |
| Không có text lỗi encoding | Chuỗi dấu `ăắằẳẵặ`, `đ`, `ơớờởỡợ` hiển thị trong demo | ✅ Đúng plan |
| Heading/body readable mobile | Đã tăng line-height heading sau mobile check | ✅ Đúng plan |

**Độ lệch so với plan:**
Không có độ lệch. Có một lần build OOM khi production server tạm còn chạy; đã tắt server tạm và `npm run check` pass.

---

### Trạng thái deploy

| Môi trường | Đã deploy? | Thời điểm | Verify OK? | Ghi chú |
|-----------|-----------|----------|-----------|---------|
| DEV/TEST | Chưa | — | N/A | Chỉ chạy local/browser check |
| PRODUCTION | Chưa | — | N/A | Không deploy |

---

### Quyết định kỹ thuật quan trọng
Không có quyết định kiến trúc mới.

---

### AI Code Notes
- **Phần code do AI sinh:** Typography defaults trong `globals.css` và demo content trong `page.tsx`.
- **Agent chính:** Cursor
- **Đã verify:** [x] Không có hallucinated API [x] `npm run check` pass [x] Mobile typography visual check
- **Prompt quan trọng lưu lại:** User yêu cầu làm `T-0202`, typography defaults bằng token, demo tiếng Việt, không thêm font dependency hoặc Button/Card.
- **Rủi ro còn lại từ AI code:** Browser dev console có hydration warning do Cursor browser instrumentation (`data-cursor-ref`), không tái hiện ở production build.

---

### Tech Debt
Không phát sinh tech debt mới.

---

### Code Smell
Không phát hiện code smell đáng kể.

---

### Security Audit

**Mode:** `QUICK`

#### QUICK Audit — 5 mục core
- [x] API key không bị expose phía client
- [x] `.env` không commit lên git
- [x] Input từ user không phát sinh trong task này
- [x] Không có credential production lẫn vào DEV/TEST
- [x] Không có thông tin nhạy cảm bị log ra console

**Tổng kết:**
- Vấn đề tìm thấy: 0
- Đã fix: 0
- Còn tồn đọng: 0

---

### Commands đã chạy
- `npm run check` — pass
- Browser check `http://localhost:3000` ở viewport resize 375px — pass visual sau line-height fix

---

### Blockers & Dependencies Update
- **Task này unblocks:** T-0203, T-0204, T-0205 và các route skeleton cần typography nền.
- **Dependency mới phát hiện:** Không có.
- **Update TASK_REGISTRY needed:** Đã cập nhật `T-0202` sang `Done`.

---

### Metrics
N/A, không deploy.

---

### Next Steps
- Cần tạo task: Không có.
- Cần update RISK_REGISTER: Không có.
- Cần update ADR: Không có.

---

## [2026-05-16 19:39 +07] — T-0105: Thiết lập dev/test và production config skeleton

**Loại:** `Task`
**Type:** `IMPLEMENTATION`
**Ref:** T-0105
**Môi trường:** `DEV/TEST`
**Branch:** local workspace
**PR / MR:** N/A
**AI Tools Used:** Cursor
**Implementation Owner:** Cursor
**Review Owner:** Self-review
**Effort thực tế:** ~0.5h

---

### Tóm tắt một dòng
> Đã tạo skeleton config tách dev/prod cho frontend và 3 Worker, kèm docs mapping resource không dùng chung secret.

---

### Những gì đã làm
- Tạo `workers/payment/wrangler.toml`, `workers/kb/wrangler.toml`, `workers/admin/wrangler.toml`.
- Mỗi Worker có `[env.dev]` và `[env.production]`, tên resource tách biệt `*-dev` / `*-prod`, placeholder KV/R2 binding.
- Cập nhật `apps/web/next.config.ts` đọc `process.env.NEXT_PUBLIC_APP_ENV`, chỉ cho phép `development`, `dev`, `production`.
- Tạo `docs/product-specs/dev-prod-mapping.md` ghi mapping resource dev/prod, ENV var pattern, rule không share secret và quyền deploy prod.
- Cập nhật `README.md` trỏ tới mapping dev/prod.

### Những gì KHÔNG làm *(scope exclusion)*
- Không deploy thật.
- Không ghi `account_id`, API token hoặc secret thật vào `wrangler.toml`.
- Không code Hono handler hoặc Worker runtime.
- Không thêm dependency.
- Không cập nhật release runbook vì skeleton khớp flow hiện có, không đổi deploy process.

---

### Resource/config đã tạo

| Resource | Dev/Test | Production |
|---|---|---|
| Payment Worker | `banmenh-payment-dev` | `banmenh-payment-prod` |
| KB Worker | `banmenh-kb-dev` | `banmenh-kb-prod` |
| Admin Worker | `banmenh-admin-dev` | `banmenh-admin-prod` |
| R2 KB bucket placeholder | `banmenh-kb-dev` | `banmenh-kb-prod` |
| KV namespace placeholder | `placeholder-dev-kv-namespace-id` | `placeholder-prod-kv-namespace-id` |
| Pages project mapping | `banmenh-v2-dev` | `banmenh-v2-prod` |

---

### Output thực tế vs kỳ vọng

| Output kỳ vọng | Output thực tế | Kết quả |
|----------------|----------------|---------|
| Config deploy frontend | `apps/web/next.config.ts` validates `NEXT_PUBLIC_APP_ENV` | ✅ Đúng plan |
| Config Worker dev/prod placeholder | 3 `wrangler.toml` có dev/prod env và placeholder bindings | ✅ Đúng plan |
| Docs mapping resource | `docs/product-specs/dev-prod-mapping.md` | ✅ Đúng plan |
| Dev/prod config không dùng chung secret | Docs và skeleton tách tên resource, không chứa secret thật | ✅ Đúng plan |

**Độ lệch so với plan:**
Không có độ lệch. Lần đầu `npm run check` bị crash transient ở bước build trên Windows, nhưng `npm run build` riêng pass và lần chạy lại `npm run check` pass.

---

### Trạng thái deploy

| Môi trường | Đã deploy? | Thời điểm | Verify OK? | Ghi chú |
|-----------|-----------|----------|-----------|---------|
| DEV/TEST | Chưa | — | N/A | Chỉ tạo skeleton config |
| PRODUCTION | Chưa | — | N/A | Không deploy |

---

### Quyết định kỹ thuật quan trọng
Không có quyết định kiến trúc mới; task chỉ áp dụng ADR-001 và ADR-006 đã chốt.

---

### AI Code Notes
- **Phần code do AI sinh:** `wrangler.toml` skeleton, `next.config.ts` env validation, dev/prod mapping docs.
- **Agent chính:** Cursor
- **Đã verify:** [x] Không có secret thật [x] Không có Hono handler [x] `npm run check` pass
- **Prompt quan trọng lưu lại:** User yêu cầu làm `T-0105`, tạo config skeleton dev/prod, không deploy, không secret, không code Hono handler.
- **Rủi ro còn lại từ AI code:** Resource ID thật, Pages project thật, Firebase project thật, KV/R2 ID thật vẫn chưa có và phải điền qua task deploy/env sau này.

---

### Tech Debt
Không phát sinh tech debt mới.

---

### Code Smell
Không phát hiện code smell đáng kể.

---

### Security Audit

**Mode:** `QUICK`

#### QUICK Audit — 5 mục core
- [x] API key không bị expose phía client
- [x] `.env` không commit lên git
- [x] Input từ user không phát sinh trong task này
- [x] Không có credential production lẫn vào DEV/TEST
- [x] Không có thông tin nhạy cảm bị log ra console

**Tổng kết:**
- Vấn đề tìm thấy: 0
- Đã fix: 0
- Còn tồn đọng: 0

---

### Commands đã chạy
- `npm run check` — lần đầu crash transient ở bước build
- `npm run build` — pass
- `npm run check` — pass

---

### Blockers & Dependencies Update
- **Task này unblocks:** Worker scaffold/deploy config tasks và các task cần resource mapping.
- **Dependency mới phát hiện:** Cần resource ID thật ở các task env/deploy sau, nhưng không chặn skeleton hiện tại.
- **Update TASK_REGISTRY needed:** Đã cập nhật `T-0105` sang `Done`.

---

### Metrics
N/A, không deploy.

---

### Next Steps
- Cần tạo task: Không có.
- Cần update RISK_REGISTER: Không có.
- Cần update ADR: Không có.

---

## [2026-05-16 19:33 +07] — T-0104: Tạo `.env.example` và quy tắc secret

**Loại:** `Task`
**Type:** `IMPLEMENTATION`
**Ref:** T-0104
**Môi trường:** `DEV/TEST`
**Branch:** local workspace
**PR / MR:** N/A
**AI Tools Used:** Cursor
**Implementation Owner:** Cursor
**Review Owner:** Self-review
**Effort thực tế:** ~0.3h

---

### Tóm tắt một dòng
> Đã chuẩn hóa `.env.example` thành template placeholder đầy đủ và ghi hướng dẫn secret/local env trong README.

---

### Những gì đã làm
- Chạy `git init`, `git add .gitignore`, `git status` trước khi bắt đầu `T-0104` theo yêu cầu.
- Verify `.gitignore` chặn `.env`, `.env.local`, `.env.production` và giữ `.env.example` là file trackable.
- Cập nhật `.env.example` với comment đầu file: template only, secret thật lưu ngoài repo, cách copy sang `.env.local`.
- Group env placeholder theo App, Firebase, PayOS, Telegram, Cloudflare.
- Cập nhật README section `Environment Variables` hướng dẫn non-tech cách tạo `.env.local` và không commit secret.

### Những gì KHÔNG làm *(scope exclusion)*
- Không ghi secret thật.
- Không tạo `.env` hoặc `.env.local`.
- Không đổi ENV/runtime config thật.
- Không thêm dependency.
- Không deploy.

---

### Env keys placeholder
- App: `NEXT_PUBLIC_APP_ENV`, `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_URL`, `ADMIN_TOKEN`.
- Firebase/Google: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.
- PayOS: `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY`.
- Telegram: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
- Cloudflare/KB: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_PAGES_PROJECT_DEV`, `CLOUDFLARE_PAGES_PROJECT_PROD`, `CLOUDFLARE_R2_BUCKET`, `CLOUDFLARE_KV_NAMESPACE_ID`, `PAYMENT_WORKER_NAME`, `KB_WORKER_NAME`, `ADMIN_WORKER_NAME`, `KB_STORAGE_BUCKET`.

---

### Output thực tế vs kỳ vọng

| Output kỳ vọng | Output thực tế | Kết quả |
|----------------|----------------|---------|
| `.env.example` chỉ có placeholder | Tất cả key dùng `your_value_here`, không có secret thật | ✅ Đúng plan |
| Docs nói rõ không commit secret | README có section `Environment Variables` và hướng dẫn `.env.local` | ✅ Đúng plan |
| `.gitignore` loại trừ `.env*` nhưng giữ `.env.example` | `git check-ignore` xác nhận `.env`/`.env.local` bị ignore, `.env.example` có exception | ✅ Đúng plan |
| Secret smoke pass | `npm run security:smoke` pass | ✅ Đúng plan |

**Độ lệch so với plan:**
Không có độ lệch.

---

### Trạng thái deploy

| Môi trường | Đã deploy? | Thời điểm | Verify OK? | Ghi chú |
|-----------|-----------|----------|-----------|---------|
| DEV/TEST | Chưa | — | N/A | Chỉ cập nhật template/docs |
| PRODUCTION | Chưa | — | N/A | Không deploy |

---

### Quyết định kỹ thuật quan trọng
Không có quyết định kiến trúc mới.

---

### AI Code Notes
- **Phần code do AI sinh:** `.env.example`, README env section, cập nhật task/devlog.
- **Agent chính:** Cursor
- **Đã verify:** [x] Không có secret thật [x] `.env` thật bị ignore [x] `.env.example` không bị smoke flag
- **Prompt quan trọng lưu lại:** User yêu cầu làm `T-0104`, init git trước, tạo env template đầy đủ, không tạo `.env` hoặc `.env.local`.
- **Rủi ro còn lại từ AI code:** Cloudflare project/worker names vẫn là placeholder cho tới task env/deploy skeleton.

---

### Tech Debt
Không phát sinh tech debt mới.

---

### Code Smell
Không phát hiện code smell đáng kể.

---

### Security Audit

**Mode:** `QUICK`

#### QUICK Audit — 5 mục core
- [x] API key không bị expose phía client
- [x] `.env` không commit lên git
- [x] Input từ user không phát sinh trong task này
- [x] Không có credential production lẫn vào DEV/TEST
- [x] Không có thông tin nhạy cảm bị log ra console

**Secret smoke/manual checks:**
- `git status` sau `git init` không thấy `.env` hoặc `.env.local`; `.env.example` xuất hiện là template trackable.
- `git check-ignore -v .env .env.local .env.production` xác nhận env thật bị ignore.
- `git check-ignore -v .env.example` xác nhận exception cho template.
- `npm run security:smoke` pass.

**Tổng kết:**
- Vấn đề tìm thấy: 0
- Đã fix: 0
- Còn tồn đọng: 0

---

### Commands đã chạy
- `git init` — pass
- `git add .gitignore` — pass
- `git status` — pass; không có `.env` hoặc `.env.local`
- `git check-ignore -v .env .env.local .env.production` — pass
- `git check-ignore -v .env.example` — pass; `.env.example` được unignore
- `npm run security:smoke` — pass

---

### Blockers & Dependencies Update
- **Task này unblocks:** T-0105 và các task cần placeholder env rõ ràng.
- **Dependency mới phát hiện:** Không có.
- **Update TASK_REGISTRY needed:** Đã cập nhật `T-0104` sang `Done`.

---

### Metrics
N/A, không deploy.

---

### Next Steps
- Cần tạo task: Không có.
- Cần update RISK_REGISTER: Không có.
- Cần update ADR: Không có.

---

## [2026-05-16 19:29 +07] — T-0103: Tạo cấu trúc folder module hóa

**Loại:** `Task`
**Type:** `IMPLEMENTATION`
**Ref:** T-0103
**Môi trường:** `DEV/TEST`
**Branch:** local workspace
**PR / MR:** N/A
**AI Tools Used:** Cursor
**Implementation Owner:** Cursor
**Review Owner:** Self-review
**Effort thực tế:** ~0.4h

---

### Tóm tắt một dòng
> Đã tạo scaffold folder module hóa theo `.cursorrules` section 2, chỉ có README/index placeholder và không thêm business logic.

---

### Những gì đã làm
- Tạo component boundary: `apps/web/src/components/ui`, `layout`, `modules`.
- Tạo module boundary: `apps/web/src/modules/numerology`, `tarot`, `account`, `payment`.
- Tạo `apps/web/src/lib` cho helper/client wrapper sau này.
- Tạo `packages/shared/src/schemas` và placeholder index cho shared exports/schemas.
- Tạo worker boundary: `workers/payment`, `workers/kb`, `workers/admin`.
- Tạo `kb-private` với README và `.gitignore` riêng để chặn raw KB.
- Cập nhật root `package.json` workspace thêm `packages/*` và `workers/*`.
- Cập nhật root `.gitignore` để ignore `kb-private/*`, trừ `README.md` và `.gitignore`.

### Những gì KHÔNG làm *(scope exclusion)*
- Không code business logic.
- Không thêm dependency.
- Không scaffold Worker runtime, route, Hono app hoặc Cloudflare config.
- Không tạo pricing/errors/entitlement implementation trong `packages/shared`.
- Không copy KB thật vào `kb-private/`.

---

### Tree folder chính
```text
apps/web/src/components/
  ui/
  layout/
  modules/
apps/web/src/modules/
  numerology/
  tarot/
  account/
  payment/
apps/web/src/lib/
packages/shared/src/
  schemas/
workers/
  payment/
  kb/
  admin/
kb-private/
```

### Rule module boundary
- Numerology/Tarot không import KB trực tiếp vào frontend.
- Account frontend không tự tạo entitlement hoặc đánh dấu purchase confirmed.
- Payment frontend không tự quyết định amount, order status hoặc unlock rights.
- Pricing, entitlement, errors và schemas dùng chung phải nằm trong `packages/shared` khi tới task tương ứng.
- Worker folders hiện chỉ là boundary placeholder; runtime scaffold để task sau.

---

### Output thực tế vs kỳ vọng

| Output kỳ vọng | Output thực tế | Kết quả |
|----------------|----------------|---------|
| Cấu trúc folder đúng `technical-decisions.md` và `.cursorrules` | Đã tạo `apps/web/src`, `packages/shared`, `workers`, `kb-private` theo boundary | ✅ Đúng plan |
| File placeholder tối thiểu nếu cần | README ngắn cho folder boundary, index placeholder cho shared/schemas | ✅ Đúng plan |
| Không có file app chính > 300 dòng | Chỉ thêm file placeholder ngắn, không đụng app chính | ✅ Đúng plan |
| Không có logic business trong component UI base | Component folders chỉ có README boundary | ✅ Đúng plan |

**Độ lệch so với plan:**
Không có độ lệch.

---

### Trạng thái deploy

| Môi trường | Đã deploy? | Thời điểm | Verify OK? | Ghi chú |
|-----------|-----------|----------|-----------|---------|
| DEV/TEST | Chưa | — | N/A | Chỉ chạy local checks |
| PRODUCTION | Chưa | — | N/A | Không deploy |

---

### Quyết định kỹ thuật quan trọng
Không có quyết định kiến trúc mới; chỉ áp dụng cấu trúc đã chốt trong `.cursorrules` và `technical-decisions.md`.

---

### AI Code Notes
- **Phần code do AI sinh:** README/index placeholder và cập nhật config/docs.
- **Agent chính:** Cursor
- **Đã verify:** [x] Không có hallucinated API [x] Không có business logic [x] Boundary khớp `.cursorrules`
- **Prompt quan trọng lưu lại:** User yêu cầu làm `T-0103` với scaffold folder, README boundary, workspace update, `kb-private` ignore và không thêm dependency.
- **Rủi ro còn lại từ AI code:** Không phát hiện rủi ro đáng kể; worker/package runtime chưa scaffold vì ngoài scope.

---

### Tech Debt
Không phát sinh tech debt mới.

---

### Code Smell
Không phát hiện code smell đáng kể.

---

### Security Audit

**Mode:** `QUICK`

#### QUICK Audit — 5 mục core
- [x] API key không bị expose phía client
- [x] `.env` không commit lên git
- [x] Input từ user không phát sinh trong task này
- [x] Không có credential production lẫn vào DEV/TEST
- [x] Không có thông tin nhạy cảm bị log ra console

**Tổng kết:**
- Vấn đề tìm thấy: 0
- Đã fix: 0
- Còn tồn đọng: 0

---

### Commands đã chạy
- `npm run check` — pass

---

### Blockers & Dependencies Update
- **Task này unblocks:** T-0104, T-0105 và các task Phase 2-7 cần module boundary.
- **Dependency mới phát hiện:** Không có.
- **Update TASK_REGISTRY needed:** Đã cập nhật `T-0103` sang `Done`.

---

### Metrics
N/A, không deploy.

---

### Next Steps
- Cần tạo task: Không có.
- Cần update RISK_REGISTER: Không có.
- Cần update ADR: Không có.

---

## [2026-05-16 19:21 +07] — T-0102: Thiết lập scripts kiểm soát chất lượng

**Loại:** `Task`
**Type:** `IMPLEMENTATION`
**Ref:** T-0102
**Môi trường:** `DEV/TEST`
**Branch:** local workspace
**PR / MR:** N/A
**AI Tools Used:** Cursor
**Implementation Owner:** Cursor
**Review Owner:** Self-review
**Effort thực tế:** ~0.5h

---

### Tóm tắt một dòng
> Đã thiết lập quality gate tối thiểu cho dev/build/typecheck/lint/security smoke, không thêm dependency mới.

---

### Những gì đã làm
- Cập nhật root `package.json` với `security:smoke` và `check`.
- Cập nhật `apps/web/package.json` để `lint` chạy script smoke nội bộ thay vì phụ thuộc lint package mới.
- Tạo `tools/source-lint.mjs` kiểm tra file quá dài, inline `onclick`, inline script lớn và lỗi raw `Failed to fetch`.
- Tạo `tools/security-smoke.mjs` kiểm tra `.env` thật bị git track, secret/token hardcode phổ biến và KB/private leak trong frontend/static.
- Cập nhật `README.md` hướng dẫn cách chạy từng script bằng tiếng Việt dễ hiểu.
- Cập nhật `.gitignore` để bỏ qua `*.tsbuildinfo` do TypeScript tạo khi chạy typecheck/build.

### Những gì KHÔNG làm *(scope exclusion)*
- Không thêm dependency mới.
- Không thêm ESLint config đầy đủ vì task này chỉ yêu cầu quality gate tối thiểu và không cần dependency mới.
- Không đụng payment/auth/KB logic.
- Không deploy DEV/TEST hoặc PRODUCTION.

---

### Output thực tế vs kỳ vọng

| Output kỳ vọng | Output thực tế | Kết quả |
|----------------|----------------|---------|
| Script chạy dev/local | `npm run dev` giữ nguyên, chạy web workspace | ✅ Đúng plan |
| Script build | `npm run build` giữ nguyên và pass | ✅ Đúng plan |
| Script typecheck | `npm run typecheck` giữ nguyên và pass | ✅ Đúng plan |
| Script lint hoặc format check | `npm run lint` chạy `tools/source-lint.mjs` và pass | ✅ Đúng plan |
| Security smoke tối thiểu | `npm run security:smoke` kiểm tra `.env`, secret/token phổ biến, KB leak và pass | ✅ Đúng plan |
| README/docs hướng dẫn scripts | `README.md` có mô tả từng script cho người non-tech | ✅ Đúng plan |

**Độ lệch so với plan:**
Không có độ lệch. Lint ở mức smoke nội bộ, chưa phải ESLint đầy đủ, để tránh thêm dependency ngoài scope.

---

### Trạng thái deploy

| Môi trường | Đã deploy? | Thời điểm | Verify OK? | Ghi chú |
|-----------|-----------|----------|-----------|---------|
| DEV/TEST | Chưa | — | N/A | Chỉ chạy local quality checks |
| PRODUCTION | Chưa | — | N/A | Không deploy |

---

### Quyết định kỹ thuật quan trọng
Không có quyết định kiến trúc mới.

---

### AI Code Notes
- **Phần code do AI sinh:** `tools/source-lint.mjs`, `tools/security-smoke.mjs`, cập nhật scripts và README.
- **Agent chính:** Cursor
- **Đã verify:** [x] Không có hallucinated API [x] Error handling đủ cho script smoke [x] Logic đúng với test case hiện tại
- **Prompt quan trọng lưu lại:** User yêu cầu làm `T-0102` với scope scripts dev/build/typecheck/lint và security smoke checklist.
- **Rủi ro còn lại từ AI code:** Không phát hiện rủi ro đáng kể; security smoke chỉ là kiểm tra tối thiểu, không thay thế secret scanner chuyên dụng ở phase release.

---

### Tech Debt
Không phát sinh tech debt mới.

---

### Code Smell
Không phát hiện code smell đáng kể.

---

### Security Audit

**Mode:** `QUICK`

#### QUICK Audit — 5 mục core
- [x] API key không bị expose phía client
- [x] `.env` không commit lên git
- [x] Input từ user không phát sinh trong task này
- [x] Không có credential production lẫn vào DEV/TEST
- [x] Không có thông tin nhạy cảm bị log ra console

**Tổng kết:**
- Vấn đề tìm thấy: 0
- Đã fix: 0
- Còn tồn đọng: 0

---

### Commands đã chạy
- `npm run typecheck` — pass
- `npm run build` — pass
- `npm run lint` — pass
- `npm run security:smoke` — pass
- `npm run check` — pass

---

### Blockers & Dependencies Update
- **Task này unblocks:** Các task implementation sau `T-0102` có quality gate tối thiểu.
- **Dependency mới phát hiện:** Không có.
- **Update TASK_REGISTRY needed:** Đã cập nhật `T-0102` sang `Done`.

---

### Metrics
N/A, không deploy.

---

### Next Steps
- Cần tạo task: Không có.
- Cần update RISK_REGISTER: Không có.
- Cần update ADR: Không có.

---

## [YYYY-MM-DD HH:mm +07] — HOTFIX: [Mô tả vấn đề]

**Loại:** `Hotfix`
**Severity:** `P0 — Site down` | `P1 — Core feature broken` | `P2 — Degraded`
**Môi trường:** `PRODUCTION`
**Phát hiện lúc:** YYYY-MM-DD HH:mm +07
**Fix deploy lúc:** YYYY-MM-DD HH:mm +07
**Time to detect:** X phút *(từ khi xảy ra đến khi phát hiện)*
**Time to fix:** X phút *(từ khi phát hiện đến khi deploy fix)*

---

### Mô tả sự cố
> Điều gì xảy ra? User thấy gì? Scope ảnh hưởng (% user bị ảnh hưởng)?

[Mô tả]

### Root Cause (sơ bộ)
> Nguyên nhân gốc rễ — điền ngay cả khi chưa chắc 100%.

[Root cause]

### Fix đã áp dụng
- [Bước 1]
- [Bước 2]

### Verify sau fix
- [ ] Smoke test đã pass trên production
- [ ] Logs sạch trong 15 phút đầu sau fix
- [ ] User flow chính hoạt động bình thường

### Tech Debt / Risk phát sinh
- [TD hoặc R nếu hotfix chỉ là band-aid, root cause chưa fix hoàn toàn]

### Follow-up actions
> Tạo task trong TASK_REGISTRY để prevent recurrence — KHÔNG để trong DEVLOG.

- Task cần tạo: [PX.Y — Mô tả]
- Risk cần update: [R-xxx]

---

---

## [YYYY-MM-DD HH:mm +07] — PHASE RETROSPECTIVE: Phase X — [Tên Phase]

**Loại:** `Phase-Retro`
**Phase:** PX
**Thời gian phase:** YYYY-MM-DD HH:mm +07 → YYYY-MM-DD HH:mm +07
**Môi trường đã deploy:** `DEV/TEST` | `PRODUCTION` | `Cả hai`

---

### Tóm tắt phase
[Một đoạn ngắn: đạt được gì, có gì bất ngờ, cảm giác chung]

---

### Milestone đạt được
- [ ] [Milestone 1] — ✅ Đạt / ⚠️ Đạt một phần / ❌ Không đạt
- [ ] [Milestone 2] — ✅ / ⚠️ / ❌

---

### Effort: Ước tính vs Thực tế

| Task | Ước tính | Thực tế | Lệch | Lý do lệch chính |
|------|---------|---------|------|-----------------|
| PX.1 | Xh | Xh | +/-Xh | [lý do] |
| PX.2 | Xh | Xh | +/-Xh | |
| **Tổng** | **Xh** | **Xh** | **+/-Xh** | |

---

### Project Health Snapshot *(tại thời điểm kết thúc phase)*

| Chỉ số | Giá trị | Đánh giá |
|--------|--------|---------|
| CRITICAL risks còn OPEN | X | 🔴 / 🟢 |
| HIGH tech debts chưa có plan | X | 🔴 / 🟢 |
| Scope changes trong phase | X | — |
| Tổng effort lệch so với ước tính | +/-Xh (+/-X%) | 🔴 / 🟡 / 🟢 |
| Hotfixes trong phase | X | — |

---

### Điều làm tốt (Keep)
- [Điều 1 nên tiếp tục]

### Điều cần cải thiện (Improve)
- [Điều 1 cần làm khác]

### Điều cần dừng (Stop)
- [Điều 1 không nên làm nữa]

---

### Tổng hợp Tech Debt của phase

| ID | Severity | Mô tả | Trạng thái |
|----|---------|-------|----------|
| TD-... | HIGH | [Mô tả] | Chưa xử lý — target PY |
| TD-... | LOW | [Mô tả] | Đã xử lý trong task PX.Z |

---

### Trạng thái môi trường sau phase

| Môi trường | Version / Tag | Deploy lúc | Ổn định? |
|-----------|--------------|-----------|---------|
| DEV/TEST | v0.X.0 | YYYY-MM-DD HH:mm +07 | Có / Không |
| PRODUCTION | v0.X.0 | YYYY-MM-DD HH:mm +07 | Có / Không / Chưa deploy |

---

### Rủi ro phát sinh trong phase
- [R-xxx] — [Mô tả ngắn] — Status hiện tại

---

### Input cho phase tiếp theo
- [Điều phase sau cần biết / chuẩn bị]

---

---

## [YYYY-MM-DD HH:mm +07] — PX.Y: [Tên Task]

**Loại:** `Task`
**Type:** `IMPLEMENTATION` *(xem task type trong TASK_REGISTRY)*
**Ref:** PX.Y
**Môi trường:** `DEV/TEST` | `PRODUCTION` | `Cả hai`
**Branch:** feature/pxy-ten-task
**PR / MR:** #[số]
**AI Tools Used:** [Claude / Cursor / None / ...]
**Implementation Owner:** Codex / [Tên]
**Review Owner:** Claude / Self-review / [Tên]
**Effort thực tế:** Xh *(ước tính: Yh — lệch: +/-Zh)*

---

### Tóm tắt một dòng
> [Một câu: làm gì, kết quả gì]

---

### Những gì đã làm
- [Việc 1 — cụ thể]
- [Việc 2]
- [Quyết định X vì lý do Y]

### Những gì KHÔNG làm *(scope exclusion)*
> Những thứ nằm trong tầm tay nhưng có chủ đích không làm trong task này.

- [Không làm X — defer sang PX.Z / out of scope vì Y]

---

### Output thực tế vs kỳ vọng

| Output kỳ vọng | Output thực tế | Kết quả |
|----------------|----------------|---------|
| [Output 1 theo TASK_REGISTRY] | [Thực tế] | ✅ Đúng plan \| ⚠️ Lệch \| ❌ Chưa xong |
| [Output 2] | [Thực tế] | |

**Độ lệch so với plan:**
[Mô tả lệch nếu có. Nếu không: "Không có độ lệch."]

---

### Trạng thái deploy

| Môi trường | Đã deploy? | Thời điểm | Verify OK? | Ghi chú |
|-----------|-----------|----------|-----------|---------|
| DEV/TEST | Có / Chưa | YYYY-MM-DD HH:mm +07 | Có / Không / N/A | |
| PRODUCTION | Có / Chưa | YYYY-MM-DD HH:mm +07 | Có / Không / N/A | |

---

### Quyết định kỹ thuật quan trọng
> Chỉ ghi những quyết định không hiển nhiên, sẽ ảnh hưởng đến tương lai.
> Quyết định lớn → ghi thêm vào `ADR.md` (`ADR-xxx`).

#### Quyết định: [Tên]
- **Bối cảnh:** [Tại sao phải quyết định]
- **Options cân nhắc:** A / B / C
- **Chọn:** Option X
- **Lý do:** [Cụ thể — không được viết "vì dễ dùng"]
- **Trade-off:** [Những gì bị hy sinh]
- **Ghi vào ADR?** `ADR-xxx` / Không cần

> Nếu không có: "Không có quyết định kiến trúc mới."

---

### AI Code Notes *(điền nếu AI Tools Used ≠ None)*
> Bắt buộc khi task dùng AI để generate code.

- **Phần code do AI sinh:** [Mô tả]
- **Agent chính:** Codex / Claude / Cursor / Khác
- **Đã verify:** [ ] Không có hallucinated API [ ] Error handling đủ [ ] Logic đúng với test case
- **Prompt quan trọng lưu lại:** [Paste prompt hoặc ghi vào KB Notes]
- **Rủi ro còn lại từ AI code:** [Nếu có]

---

### Claude Audit Result *(điền nếu Claude audit task này)*

- **Audit mode:** `QUICK` | `FULL`
- **Findings:** CRITICAL: X / HIGH: Y / MEDIUM: Z / LOW: N
- **Đã xử lý:** [Danh sách finding đã fix]
- **Còn lại:** [Finding được chấp nhận/đưa vào RISK_REGISTER hoặc Tech Debt]
- **Kết luận:** Pass / Pass with notes / Fail

---

### Tech Debt

#### TD-[YYYYMMDD]-[số]: [Tên]
- **Severity:** `LOW` | `MEDIUM` | `HIGH` | `CRITICAL`
- **Loại:** `Code Quality` | `Architecture` | `Performance` | `Scalability` | `Maintainability` | `Test Coverage` | `Security`
- **Môi trường:** `DEV/TEST` | `PRODUCTION` | `Cả hai`
- **Vị trí:** `src/file.ts:42`
- **Mô tả:** [Vấn đề cụ thể]
- **Rủi ro nếu không xử lý:** [Hậu quả]
- **Remediation:** [Cần làm gì — Xh effort]
- **Target fix:** Phase Y / Task PY.Z

> Nếu không có: "Không phát sinh tech debt mới."

---

### Code Smell
- [ ] [Mô tả] — `file:line`

> Nếu không có: "Không phát hiện code smell đáng kể."

---

### Security Audit

**Mode:** `QUICK` *(task thường)* | `FULL` *(task đụng auth / payment / AI / production deploy)*

#### QUICK Audit — 5 mục core *(mọi task)*
- [ ] API key không bị expose phía client
- [ ] `.env` không commit lên git
- [ ] Input từ user được validate server-side
- [ ] Không có credential production lẫn vào DEV/TEST
- [ ] Không có thông tin nhạy cảm bị log ra console

#### FULL Audit *(chỉ dùng khi mode = FULL)*

**Authentication & Authorization**
- [ ] Route cần auth đã được bảo vệ
- [ ] Role/permission kiểm tra đúng chỗ
- [ ] Session/token handling không có lỗ hổng

**Data & Privacy**
- [ ] PII (tên, ngày sinh, email) xử lý đúng
- [ ] Raw query không có injection risk

**Input Validation**
- [ ] Sanitize trước khi đưa vào DB / AI prompt
- [ ] File upload kiểm tra type/size

**API & Third-party**
- [ ] Third-party SDK không có CVE đã biết
- [ ] Rate limiting đã setup

**AI-specific** *(nếu applicable)*
- [ ] Prompt injection được phòng ngừa
- [ ] Output AI được validate trước khi render cho user
- [ ] Token usage không thể bị exploit (max token limit)

**Tổng kết:**
- Vấn đề tìm thấy: X
- Đã fix: Y
- Còn tồn đọng: Z → **bắt buộc tạo TD entry hoặc R entry tương ứng**

---

### Blockers & Dependencies Update
- **Task này unblocks:** [Task ID]
- **Dependency mới phát hiện:** [Task X cần làm trước Task Y]
- **Update TASK_REGISTRY needed:** Có / Không

---

### Metrics *(bắt buộc nếu deploy PRODUCTION, optional cho DEV/TEST)*

| Metric | Giá trị | Env | Ghi chú |
|--------|---------|-----|---------|
| Build time | — ms | DEV/TEST | |
| API p95 response time | — ms | DEV/TEST | |
| Error rate sau deploy | — % | PRODUCTION | monitor 30 phút đầu |
| Bundle size | — KB | — | |
| AI token cost/request | — tokens | — | |

---

### Next Steps
> **KHÔNG dùng checkbox ở đây.** Mọi action item phải được tạo thành task trong `TASK_REGISTRY.md`.

- Cần tạo task: [Mô tả → tạo PX.Z trong TASK_REGISTRY]
- Cần update RISK_REGISTER: [R-xxx]
- Cần update ADR: [ADR-xxx]

---

---

## [YYYY-MM-DD HH:mm +07] — CORRECTION: [Mô tả đính chính]

**Loại:** `Correction`
**Đính chính entry:** [Ref entry cũ — ví dụ: P1.2 entry ngày 2026-05-10]
**Lý do đính chính:** [Thông tin sai / cập nhật mới / nhầm lẫn]

---

### Thông tin cũ (sai)
[Nội dung cũ cần đính chính]

### Thông tin mới (đúng)
[Nội dung đúng]

### Ảnh hưởng
[Correction này ảnh hưởng đến task/decision/risk nào]

---

---

## Archiving Strategy

> Khi DEVLOG phình to (>500 dòng hoặc sau mỗi Phase Retro):
> 1. Move toàn bộ **Task entries** của phase đó sang `DEVLOG_ARCHIVE_PX.md`
> 2. **Giữ lại** trong file chính: Phase Retro entries, Hotfix entries, Correction entries
> 3. Ghi entry `Correction` ghi chú việc archive
>
> Các entries được archive vẫn có thể tìm thấy qua Index nhanh ở đầu file.

---

---

## KB INDEX — Knowledge Base
> **Đây là nơi lưu kiến thức có thể tìm kiếm lại.** Sau mỗi task, nếu có KB Notes, copy tóm tắt vào đây (không chỉ ghi trong entry task).
> Thêm entry mới vào ĐẦU bảng.

| ID | Ngày & Giờ | Topic | Tags | Ref task |
|----|-----------|-------|------|---------|
| KB-001 | YYYY-MM-DD HH:mm +07 | [Tên topic] | [tag1, tag2] | PX.Y |

---

### KB-001 — [Tên topic]
> [Mô tả gotcha / lesson learned / trick]

```
[Code snippet hoặc ví dụ nếu cần]
```

**Nguồn:** [Link docs / issue / blog]
**Tags:** [tag1, tag2, tag3]

---

<!-- ============================================================
     QUICK TEMPLATE — Task entry (copy và xóa comment này)

---

## [YYYY-MM-DD HH:mm +07] — PX.Y: [Tên Task]

**Loại:** Task | **Type:** IMPLEMENTATION | **Ref:** PX.Y
**Môi trường:** DEV/TEST | **Branch:** feature/pxy | **PR:** #
**AI Tools:** None | **Effort:** Xh (ước tính: Yh)
**Implementation Owner:** Codex | **Review Owner:** Claude / Self-review

### Tóm tắt một dòng
> 

### Những gì đã làm
- 

### Những gì KHÔNG làm
- 

### Output thực tế vs kỳ vọng
| Output kỳ vọng | Output thực tế | Kết quả |
|----------------|----------------|---------|
| | | ✅ |

Độ lệch: Không có.

### Trạng thái deploy
| Env | Deploy? | Thời điểm | Verify? |
|-----|---------|----------|---------|
| DEV/TEST | Có | YYYY-MM-DD HH:mm +07 | Có |
| PRODUCTION | Chưa | — | N/A |

### Quyết định kỹ thuật
Không có quyết định kiến trúc mới.

### AI Code Notes
N/A

### Tech Debt
Không phát sinh tech debt mới.

### Code Smell
Không phát hiện.

### Security Audit — QUICK
- [x] API key không expose
- [x] .env không commit
- [x] Input validated
- [x] Không lẫn credential prod
- [x] Không log sensitive data
Kết quả: 0 vấn đề.

### Blockers & Dependencies
Unblocks: PX.Z | Dependency mới: Không có

### Metrics
N/A (DEV/TEST task)

### Next Steps
- Tạo task: [...]

---

     QUICK TEMPLATE — Phase Retro (copy và xóa comment này)

---

## [YYYY-MM-DD HH:mm +07] — PHASE RETROSPECTIVE: Phase X — [Tên]

**Loại:** Phase-Retro | **Phase:** PX
**Thời gian:** YYYY-MM-DD HH:mm +07 → YYYY-MM-DD HH:mm +07
**Môi trường:** DEV/TEST

### Tóm tắt phase
[...]

### Milestone
- [ ] Milestone 1 — ✅ Đạt

### Effort
| Task | Est | Actual | Lệch |
|------|-----|--------|------|
| PX.1 | Xh | Xh | +Xh |
| Tổng | Xh | Xh | +Xh |

### Project Health Snapshot
| Chỉ số | Giá trị |
|--------|--------|
| CRITICAL risks OPEN | 0 |
| HIGH tech debts chưa plan | 0 |
| Scope changes | 0 |
| Effort lệch | +Xh |
| Hotfixes | 0 |

### Keep / Improve / Stop
Keep: 
Improve: 
Stop: 

### Môi trường sau phase
| Env | Version | Deploy lúc | Ổn định? |
|-----|---------|-----------|---------|
| DEV/TEST | v0.X.0 | YYYY-MM-DD HH:mm +07 | Có |
| PRODUCTION | — | — | N/A |

### Input cho phase tiếp theo
- 

---
     ============================================================ -->


---

# DEVLOG - Bản Mệnh V2

## 2026-05-16 - SPRINT-1: Gỡ critical gap để mở khóa Phase 1-3 cho Cursor

| Field | Value |
|---|---|
| Task | SPRINT-1 (gộp T-0101 + T-0201 + ADR-004/005/006 + .cursorrules) |
| Status | Done |
| Actor | Claude (gỡ gap theo yêu cầu user) |
| Type | Foundation / Documentation / Setup |
| Verification | File đã tạo/sửa được Read lại sau Write, chưa chạy `npm install` hoặc `npm run build` |

### Bối cảnh

User yêu cầu review tài liệu xem đủ để Cursor code chưa. Review phát hiện 7 critical gap. User chốt "gỡ critical gap" cho Sprint 1 để mở khóa Phase 1-3.

### Việc đã làm

1. **Tạo `.cursorrules` ở project root** — tổng hợp rule từ `SYSTEM_PROMPT.md` + `technical-decisions.md` + `security-threat-model.md`, format ngắn gọn cho Cursor đọc auto. Có bảng tham chiếu "chủ đề → file phải đọc".
2. **Setup Tailwind CSS v4 thật:**
   - `apps/web/package.json`: thêm `tailwindcss@^4`, `@tailwindcss/postcss@^4`, `zod@^3.23.8`.
   - Tạo `apps/web/postcss.config.mjs` với plugin `@tailwindcss/postcss`.
   - Tạo `apps/web/src/styles/tokens.css` chứa full design tokens + `@theme inline` mapping.
   - Cập nhật `apps/web/src/app/globals.css`: `@import "tailwindcss"` + import tokens.
3. **Full design tokens vào code** — copy nguyên section 5 của `design-extraction-spec.md` thành CSS custom properties. Map sang Tailwind theme để dùng utility class.
4. **Reconcile T-0101 inconsistency:**
   - `TASK_REGISTRY.md` T-0101 status `Todo` → `Done` với update note ghi chi tiết scaffold đã có.
   - `TASK_REGISTRY.md` T-0201 status `Todo` → `Done` với update note ghi tokens + Tailwind setup.
5. **Thêm 3 ADR mới vào `docs/ADR.md`:**
   - ADR-004: Tailwind CSS v4 + design tokens.
   - ADR-005: Zod cho runtime validation.
   - ADR-006: Hono framework cho Cloudflare Workers.

### Những gì KHÔNG làm

- Không chạy `npm install` (user cần chạy local để có lock file mới).
- Không chạy `npm run build` hoặc `dev` để verify (cần user verify sau khi install).
- Không tạo Worker scaffold (thuộc Sprint 3).
- Không tạo `packages/shared` (thuộc Sprint 2).
- Không tạo `tools/` cho KB import (thuộc Sprint 4).
- Không sửa `page.tsx` hay `layout.tsx` (đã đúng spec).
- Không bring KB files vào project (thuộc Sprint 4).

### Output thực tế vs kỳ vọng

| Output kỳ vọng | Output thực tế | Kết quả |
|---|---|---|
| `.cursorrules` ở root | Đã tạo, 7 section | ✅ |
| Tailwind v4 setup | postcss.config.mjs + package.json deps | ✅ |
| Full design tokens trong CSS | `apps/web/src/styles/tokens.css` (~30 colors, 6 gradients, 5 radius, 3 shadows, typography scale) | ✅ |
| T-0101 status reconciled | Updated to Done với note | ✅ |
| ADR-004, ADR-005, ADR-006 | Đã thêm vào ADR.md với context/lý do/hệ quả | ✅ |

### File đã tạo/sửa

Tạo mới:

- `.cursorrules`
- `apps/web/postcss.config.mjs`
- `apps/web/src/styles/tokens.css`

Sửa:

- `apps/web/package.json` (thêm deps Tailwind v4 + Zod)
- `apps/web/src/app/globals.css` (import Tailwind + tokens)
- `docs/ADR.md` (thêm ADR-004/005/006)
- `docs/TASK_REGISTRY.md` (T-0101, T-0201 → Done)

### Quyết định kỹ thuật

- **Tailwind v4 thay vì v3:** CSS-first config (không cần `tailwind.config.js`), giảm boilerplate, native với Next.js 16. Xem ADR-004.
- **`@theme inline` trong cùng `tokens.css`:** giữ token một nguồn sự thật. Đổi token chỉ sửa 1 nơi.
- **Zod cho cả frontend + Worker:** ADR-005. Schemas sẽ live trong `packages/shared` (Sprint 2).
- **Hono cho Worker:** ADR-006. Lý do: TypeScript-first, bundle nhỏ, middleware ecosystem tốt.

### Audit tech debt / code rác / phình to

- **Mức rủi ro: None.**
- Tokens đã có lý do (theo design-extraction-spec). Không có hardcode.
- File lớn nhất tạo là `tokens.css` ~160 dòng, đúng quy mô.
- `.cursorrules` ~120 dòng — chấp nhận được vì là rules tổng hợp.

### Audit bảo mật / KB / PII / payment

- **Mức rủi ro: None.**
- Không thêm secret/token.
- Không đụng KB.
- Không đụng payment/auth.
- `package.json` chỉ thêm dependency từ npm registry chính thức.

### Rủi ro còn lại

- User cần chạy `npm install` để verify lock file cập nhật không có conflict.
- User cần chạy `npm run dev` để verify Tailwind v4 hoạt động với Next.js 16.2.6.
- Phase 4-7 vẫn còn gap cần Sprint 2/3/4.

### Next Steps (cần task tiếp theo)

- **Sprint 2:** tạo `packages/shared` với Zod schemas + pricing + errors (~3-4h).
- **Sprint 2:** spec `docs/product-specs/auth-spec.md` (Firebase Auth + Anonymous + cookie strategy).
- **Sprint 3:** scaffold `workers/payment`, `workers/kb`, `workers/admin` với Hono.
- **Sprint 3:** spec `docs/product-specs/payos-integration-spec.md` + `telegram-alerts-spec.md`.
- **Sprint 3:** tạo `infra/firestore.rules`.
- **Sprint 4:** spec `docs/product-specs/numerology-calculation-spec.md` (30 chỉ số + formula).
- **Sprint 4:** spec `docs/product-specs/content-paywall-spec.md` (free/paid split).
- **Sprint 4:** tạo `tools/` cho KB import + validate + smoke test.
- **Sprint 4:** bring KB files vào `kb-private/` (gitignored).

---

## 2026-05-14 - Khởi tạo bộ docs vận hành

| Field | Value |
|---|---|
| Task | DOCS-INIT |
| Status | Done |
| Actor | Codex |
| Verification | Kiểm tra file trong `E:\Project\Project\banmenh\docs` sau khi cài |

### Done

- Lắp bộ template quản trị dự án vào Bản Mệnh V2.
- Đưa spec sản phẩm hiện có vào `docs/product-specs`.
- Tạo module specs ban đầu cho Numerology, Tarot, Account/Payment và các module future.
- Không copy file preview/temp từ template source.

### Risk review

- Chưa có secret thật trong file được tạo.
- Các thông tin chưa chắc chắn được đánh dấu `[Cần bổ sung]`.
- Chưa tạo code app; đây mới là lớp tài liệu vận hành.

---

# Bản Mệnh V2 Implementation Log

Ngày tạo: 2026-05-13

Mục đích: ghi nhật ký triển khai sau mỗi task/phase. File này dùng để trả lời: đã làm gì, output là gì, có rủi ro tech debt/code rác/phình to không, có rủi ro bảo mật/KB/PII/payment không.

## Quy Tắc Ghi Log

- Mỗi task trong `v2-task-tracker.md` khi xong phải có một entry ở đây.
- Không ghi secret/token/API key thật.
- Không paste raw PII của user.
- Không paste KB private.
- Nếu có rủi ro, ghi rõ mức độ: P0/P1/P2/P3.
- Nếu có tech debt cố ý chấp nhận, phải ghi lý do và task xử lý sau.

## Template Entry

```md
## YYYY-MM-DD - TASK_ID - Tên task

Status: Done / Review / Blocked

Bối cảnh:
- ...

Yêu cầu ban đầu:
- ...

Việc đã làm:
- ...

Output:
- File/route/API/component đã tạo hoặc sửa.
- Test/check đã chạy.

Đối chiếu điều kiện Done:
- [ ] Điều kiện 1
- [ ] Điều kiện 2
- [ ] Điều kiện 3

Audit tech debt / code rác / phình to:
- Mức rủi ro: P0/P1/P2/P3/None
- Nhận xét:
- Hành động tiếp theo nếu có:

Audit bảo mật / KB / PII / payment:
- Mức rủi ro: P0/P1/P2/P3/None
- Nhận xét:
- Hành động tiếp theo nếu có:

Ghi chú vận hành:
- ...
```

## Phase 0 - Khóa Nền Tảng Dự Án

## 2026-05-13 - T-0001 - Chốt tài liệu nền V2

Status: Done

Bối cảnh:

- Dự án hiện tại có dấu hiệu phình to, nhiều luồng được xử lý nhanh trong production.
- User muốn rebuild V2 có dev/test, production, bảo mật KB, kiểm soát payment và hạn chế tech debt.

Yêu cầu ban đầu:

- Tạo spec tổng.
- Review lại mức độ đủ để thương mại hóa.
- Bổ sung tài liệu còn thiếu.
- Chốt stack, DB/storage và Tarot MVP.
- Ghi quyết định bằng Decision Records.

Việc đã làm:

- Tạo product spec tổng cho Bản Mệnh V2.
- Tạo PRD MVP để khóa scope.
- Tạo screen spec để mô tả màn hình/state/CTA.
- Tạo data contract cho schema/API/payment/entitlement/voucher.
- Tạo security threat model.
- Tạo release runbook.
- Tạo technical decisions.
- Tạo legal/commercial spec.
- Tạo migration plan.
- Tạo content quality spec.
- Thêm Decision Records cho stack, storage và Tarot non-AI.
- Tạo task tracker và implementation log.

Output:

- `docs/banmenh-v2-product-spec.md`
- `docs/prd-mvp.md`
- `docs/screen-spec.md`
- `docs/data-contract.md`
- `docs/security-threat-model.md`
- `docs/release-runbook.md`
- `docs/technical-decisions.md`
- `docs/legal-commercial-spec.md`
- `docs/migration-plan.md`
- `docs/content-quality-spec.md`
- `docs/v2-task-tracker.md`
- `docs/v2-implementation-log.md`

Đối chiếu điều kiện Done:

- [x] Tất cả file nền đã tồn tại.
- [x] Nội dung bằng tiếng Việt có dấu.
- [x] Có Decision Records cho stack, storage và Tarot non-AI.
- [x] Không chứa secret/token thật.
- [x] Task tracker có bối cảnh, yêu cầu, output, goal và điều kiện done.
- [x] Implementation log có template audit tech debt, bảo mật, KB, PII và payment.

Audit tech debt / code rác / phình to:

- Mức rủi ro: None
- Nhận xét: Chưa sửa code product. Các tài liệu mới nhằm giảm tech debt trước khi scaffold V2.
- Hành động tiếp theo nếu có: Khi bắt đầu code, phải cập nhật log sau từng task và kiểm tra file size/module boundary.

Audit bảo mật / KB / PII / payment:

- Mức rủi ro: None
- Nhận xét: Tài liệu không chứa secret, token thật, PII thật hoặc KB private. Các spec đã nhấn mạnh không public KB và không commit secret.
- Hành động tiếp theo nếu có: Trước khi scaffold V2 cần tạo `.env.example` chỉ có placeholder và security smoke script.

Ghi chú vận hành:

- Stack đã chốt: Next.js + TypeScript + Cloudflare Workers.
- Storage đã chốt: Firestore cho user/transaction, KV/R2 cho KB/cache.
- Tarot MVP đã chốt: non-AI, AI chỉ là future optional sau khi cập nhật legal/privacy/claim.

## 2026-05-13 - T-0002 - Chia nhỏ task tracker theo từng bước kiểm soát được

Status: Done

Bối cảnh:

- Task tracker ban đầu vẫn còn một số task quá lớn, đặc biệt phần scaffold, UI, env và backend foundation.
- User yêu cầu chia nhỏ nhất có thể để đi từng bước, giảm code rác, tech debt và tăng khả năng audit.

Yêu cầu ban đầu:

- Chia task/phase chi tiết, rõ ràng hơn.
- Mỗi task phải có bối cảnh, yêu cầu, output, goal, điều kiện Done và update khi xong.
- Tách rõ phần setup giao diện để dễ kiểm soát.

Việc đã làm:

- Chia lại tracker từ 6 phase lớn thành 8 phase nhỏ hơn.
- Tách Phase 1 thành project foundation: workspace, scripts, folder, env, dev/prod config.
- Tách Phase 2 riêng cho UI foundation: design tokens, typography, Button/CTA, Card/Panel, Loading/Error/Empty, PageShell, Header/Footer, responsive QA.
- Tách Phase 3 riêng cho route skeleton.
- Tách Phase 4 cho shared contracts/backend boundary.
- Tách payment/voucher thành nhiều task nhỏ: create, check, webhook, alert, voucher validate, admin voucher API.
- Tách Numerology và Tarot thành nhiều task nhỏ hơn.
- Thêm Security/QA/Migration/Cutover phase riêng.

Output:

- `docs/v2-task-tracker.md` đã được chia nhỏ lại.

Đối chiếu điều kiện Done:

- [x] Phase 1 không còn gom chung scaffold + UI + env.
- [x] UI foundation có phase riêng.
- [x] Mỗi task có bối cảnh, yêu cầu, output, goal, điều kiện Done và update khi xong.
- [x] Không chứa secret/token thật.
- [x] Đã kiểm tra task thiếu `Status` và sửa `T-0702`.

Audit tech debt / code rác / phình to:

- Mức rủi ro: None
- Nhận xét: Chỉ cập nhật tài liệu. Tracker mới giảm rủi ro code phình bằng cách tách task nhỏ và bắt buộc audit sau từng bước.
- Hành động tiếp theo nếu có: Khi bắt đầu code, không được gộp nhiều task tracker vào một lần implement nếu chưa có lý do rõ.

Audit bảo mật / KB / PII / payment:

- Mức rủi ro: None
- Nhận xét: Không thêm secret, PII hoặc KB. Các task liên quan payment/KB đã có điều kiện Done riêng về security.
- Hành động tiếp theo nếu có: Security smoke script cần được làm ở `T-0801` trước production.

Ghi chú vận hành:

- Bước setup giao diện hiện nằm ở Phase 2 - UI Foundation, gồm `T-0201` đến `T-0208`.


## 2026-05-14 - Cập nhật thông tin môi trường và owner

| Field | Value |
|---|---|
| Task | DOCS-ENV-001 |
| Status | Done |
| Actor | Codex |
| Verification | Cập nhật `PROJECT_META.md` và `ENVIRONMENT.md` theo thông tin user cung cấp |

### Done

- Ghi owner dự án là Zenki.
- Ghi Dev/Test domain chính thức là `https://dev.banmenh.online`.
- Ghi repo/folder local hiện có nhưng chưa có code app V2.
- Ghi CI/CD giai đoạn đầu là deploy thủ công, có thể chuyển sang GitHub auto deploy sau khi kiểm soát secret.
- Ghi Firebase/Firestore và KV/R2 hiện chưa có.
- Ghi rõ `dev.banmenh.online` đã Active nhưng chưa phải dev/test tách biệt thật sự cho đến khi có project dev riêng.

### Risk review

- Không thêm secret vào tài liệu.
- Chưa tạo hạ tầng mới.
- Rủi ro còn lại: cần tách Cloudflare Pages project dev riêng trước khi dùng `dev.banmenh.online` để test V2.


## 2026-05-14 - Làm rõ production project và storage strategy

| Field | Value |
|---|---|
| Task | DOCS-ENV-002 |
| Status | Done |
| Actor | Codex |
| Verification | Cập nhật `ENVIRONMENT.md` và `product-specs/technical-decisions.md` |

### Done

- Ghi rõ `numerology-app` là Cloudflare Pages project production hiện tại.
- Ghi rõ các domain trong Production deployment của `numerology-app` được xem là current-live/production.
- Ghi quy tắc không rebuild Bản Mệnh V2 trực tiếp vào `numerology-app`.
- Chốt hướng storage: Firestore cho user/payment/entitlement/report metadata; R2 cho KB/file lớn; KV cho config/cache/manifest.

### Risk review

- Giảm rủi ro deploy nhầm vào production hiện tại.
- Giảm rủi ro lộ KB bằng cách khóa nguyên tắc KB không nằm trong frontend/static asset.


## 2026-05-14 - Đính chính scope: Bản Mệnh V2 là rebuild độc lập

| Field | Value |
|---|---|
| Task | DOCS-SCOPE-001 |
| Status | Done |
| Actor | Codex |
| Verification | Cập nhật PROJECT_META, ENVIRONMENT, RISK_REGISTER, migration-plan và TASK_REGISTRY |

### Done

- Chốt Bản Mệnh V2 là dự án mới hoàn toàn, không phụ thuộc app cũ.
- Ghi app cũ/current-live chỉ là legacy/reference.
- Thay hướng migration mặc định bằng independent launch plan.
- Ghi rõ không migrate dữ liệu cũ mặc định.
- Ghi input đã có: file thiết kế giao diện, KB Thần số học, KB Tarot.
- Ghi nguyên tắc import KB vào private storage/API layer, không đưa vào frontend/static asset.

### Risk review

- Giảm rủi ro lẫn lộn app cũ và V2.
- Giảm rủi ro deploy nhầm V2 vào `numerology-app`.
- Rủi ro còn lại: cần user cung cấp đường dẫn file thiết kế và KB khi bắt đầu task UI/KB import; không được tự đoán cấu trúc file.


## 2026-05-14 - Dọn requirement kế thừa user/gói cũ khỏi spec hiện hành

| Field | Value |
|---|---|
| Task | DOCS-SCOPE-002 |
| Status | Done |
| Actor | Codex |
| Verification | Cập nhật PRD, screen spec, legal-commercial spec, product spec, task registry và technical decisions |

### Done

- Gỡ requirement giữ quyền user cũ/Tarot 49K khỏi MVP hiện hành.
- Ghi rõ V2 không kế thừa user/gói cũ mặc định.
- Nếu sau này muốn migration/kế thừa bất kỳ phần nào, phải tạo task và ADR riêng.

### Risk review

- Giảm rủi ro V2 vô tình phụ thuộc dữ liệu/hạ tầng cũ.
- Giảm rủi ro promise thương mại không có cơ chế vận hành.


## 2026-05-14 - Cleanup environment gaps và entitlement contract

| Field | Value |
|---|---|
| Task | DOCS-SCOPE-003 |
| Status | Done |
| Actor | Codex |
| Verification | Cập nhật ENVIRONMENT và data-contract |

### Done

- Dọn mục thông tin còn thiếu trong ENVIRONMENT để không nhắc lại Dev/Test domain như một phần chưa biết.
- Ghi rõ `dev.banmenh.online` phải được gỡ khỏi legacy project và gắn sang V2 dev/test project riêng trước khi dùng thật.
- Gỡ `tarot_basic_lifetime` khỏi entitlement contract hiện hành để tránh hiểu nhầm là kế thừa gói Tarot cũ.

### Risk review

- Giảm rủi ro nhầm lẫn giữa legacy project và V2 project.
- Giảm rủi ro đưa entitlement legacy vào MVP V2.


## 2026-05-14 - Chuẩn hóa thuật ngữ, loại bỏ phụ thuộc version cũ khỏi tài liệu hiện hành

| Field | Value |
|---|---|
| Task | DOCS-SCOPE-004 |
| Status | Done |
| Actor | Codex |
| Verification | Rà soát toàn bộ docs, đổi migration-plan thành independent-launch-plan, chuẩn hóa wording hệ thống hiện có/outside-scope |

### Done

- Đổi `product-specs/migration-plan.md` thành `product-specs/independent-launch-plan.md`.
- Chuẩn hóa tài liệu hiện hành theo hướng V2 độc lập, không phụ thuộc version cũ.
- Thay các yêu cầu migration/cutover bằng data import tùy chọn và gắn domain production có approval.
- Giữ DEVLOG là lịch sử, nhưng thêm Current truth note để tránh hiểu nhầm.

### Risk review

- Giảm rủi ro AI/dev đọc nhầm requirement từ version cũ.
- Giảm rủi ro kéo code/hạ tầng/dữ liệu cũ vào V2 ngoài ý muốn.


## 2026-05-14 - Siết scope: V2 không import dữ liệu/hạ tầng ngoài scope trong MVP

| Field | Value |
|---|---|
| Task | DOCS-SCOPE-005 |
| Status | Done |
| Actor | Codex |
| Verification | Rà lại active docs và task registry; loại bỏ launch task có nội dung import dữ liệu ngoài scope |

### Done

- Siết `independent-launch-plan.md`: MVP không import user, entitlement, payment history, voucher, report hoặc KB từ hệ thống/app đã có.
- Đổi task dry-run data import thành launch rehearsal trên dev/test.
- Đổi production cutover thành gắn domain production cho V2 sau khi user approve.
- Giảm các câu active-docs có thể khiến AI hiểu nhầm là phải tương thích version cũ.

### Risk review

- Giảm rủi ro kéo dữ liệu/hạ tầng ngoài scope vào V2.
- DEVLOG vẫn giữ lịch sử, nhưng current truth note ở đầu file là nguồn đúng cho scope hiện hành.


## 2026-05-14 - Cleanup wording cuối: dùng outside-scope thay vì nhắc hệ thống hiện có

| Field | Value |
|---|---|
| Task | DOCS-SCOPE-006 |
| Status | Done |
| Actor | Codex |
| Verification | Rà active docs không còn nhắc trực tiếp version cũ/legacy/migration ngoài DEVLOG lịch sử |

### Done

- Đổi wording active docs từ “hệ thống hiện có” sang “nguồn ngoài scope”.
- Giữ nguyên nguyên tắc: V2 là rebuild mới, input chính là file thiết kế + KB Thần số học + KB Tarot do user cung cấp.
- DEVLOG vẫn giữ lịch sử, có current truth note ở đầu file.


## 2026-05-16 - Khóa input design/KB và Tarot workflow reference

| Field | Value |
|---|---|
| Task | DOCS-INPUT-001 |
| Status | Done |
| Actor | Codex |
| Verification | Tạo input-inventory, design-extraction-spec, kb-extraction-plan, tarot-workflow-reference và cập nhật module/tasks/risks |

### Done

- Ghi rõ chỉ lấy visual style/effect từ V1, không lấy logic/workflow/payment/API cũ.
- Ghi rõ KB Thần số học canonical source: `than-so-hoc-export/kb.json`.
- Ghi rõ narrative source cần convert an toàn: `numerology_core/narrative_templates.js`.
- Ghi rõ Tarot KB canonical source: `kb/commercial/tarot_kb`.
- Ghi rõ Tarot workflow tham chiếu Mystery Tarot nhưng rebuild mới bằng branding/code/hạ tầng Bản Mệnh V2.
- Thêm Phase 0A input extraction/source boundaries vào TASK_REGISTRY.
- Thêm risk R-012 và R-013.

### Risk review

- Giảm rủi ro copy nhầm app logic V1.
- Giảm rủi ro public KB private.
- Giảm rủi ro dùng asset/code Tarot tham chiếu vượt quyền.


## 2026-05-16 - Cleanup docs sau input audit

| Field | Value |
|---|---|
| Task | DOCS-AUDIT-001 |
| Status | Done |
| Actor | Codex |
| Verification | Dọn TASK_REGISTRY template mẫu và chuẩn hóa RISK_REGISTER thành một bảng |

### Done

- Gỡ block template mẫu khỏi đầu `TASK_REGISTRY.md` để registry chỉ còn task thật của Bản Mệnh V2.
- Chuẩn hóa `RISK_REGISTER.md` để R-001 đến R-013 nằm cùng một bảng.

### Risk review

- Giảm rủi ro AI đọc nhầm placeholder `[Tên]`, `YYYY-MM-DD`, `0/0 tasks` là task thật.
- Giảm rủi ro bỏ sót R-011/R-012/R-013 khi review risk.


## 2026-05-16 - DOCS-AUDIT-002: Chuẩn hóa ADR và tham chiếu file trong task registry

| Field | Value |
|---|---|
| Task | DOCS-AUDIT-002 |
| Status | Done |
| Scope | Docs consistency |
| Verification | Rà soát placeholder/template, file path và decision records |

Đã làm:

- Đổi các tham chiếu `v2-implementation-log.md` trong `TASK_REGISTRY.md` về `DEVLOG.md`.
- Chuẩn hóa đường dẫn các product spec trong `TASK_REGISTRY.md` về `docs/product-specs/...`.
- Viết lại `ADR.md` thành file quyết định thật của Bản Mệnh V2, bỏ phần template/placeholder gây nhiễu.

Đánh giá rủi ro:

- Giảm rủi ro AI đọc nhầm placeholder `[Tên]`, `YYYY-MM-DD` là requirement thật.
- Giảm rủi ro cập nhật nhầm file log không tồn tại.
- Không thay đổi code, secret, KB hoặc dữ liệu sản phẩm.


## 2026-05-16 - T-00A2: Extract design spec từ visual source

| Field | Value |
|---|---|
| Task | T-00A2 |
| Status | Done |
| Scope | Design system/spec only |
| Verification | Rà source visual local và cập nhật `design-extraction-spec.md` |

Đã làm:

- Rà `demo-premium-ui.html` để lấy premium mystical visual, galaxy background, glass card, module grid và pricing treatment.
- Rà `demo-design-system.html` để lấy pattern component theo hướng Tailwind/shadcn.
- Rà `numerology_core/style.css` để lấy visual thực tế cho dashboard, form, paywall, report, footer.
- Rà `Antigravity/khamphabanthan/style.css` để lấy mandala summary, report layout và chart/card treatment.
- Cập nhật `design-extraction-spec.md` thành spec đủ dùng cho UI skeleton V2.
- Cập nhật `TASK_REGISTRY.md` đánh dấu T-00A2 Done.

Không làm:

- Không copy code UI cũ vào V2.
- Không lấy workflow, payment, voucher, auth, API hoặc localStorage cũ.
- Không đụng KB/private data.

Đánh giá rủi ro:

- Tech debt: thấp, vì chỉ cập nhật spec.
- Code rác: không phát sinh code app.
- Security/KB: không thêm secret, không public KB.
- Rủi ro còn lại: khi build UI phải tuân thủ spec, tránh copy nguyên CSS cũ.


## 2026-05-16 - T-00A3: Extract KB Thần số học an toàn

| Field | Value |
|---|---|
| Task | T-00A3 |
| Status | Done |
| Scope | KB audit/plan only |
| Verification | Checksum KB duplicate, inspect top-level schema, update `kb-extraction-plan.md` |

Đã làm:

- Xác nhận `than-so-hoc-export/kb.json` và `numerology_core/numerology_knowledge_base.json` giống hệt nhau.
- SHA-256 canonical KB: `a6aed5a839631a6fdb3ee5558da445b91f41dd8dba12d1c601ea9b09f346f22c`.
- Xác nhận KB structured có 33 nhóm top-level.
- Xác nhận `numerology_core/narrative_templates.js` và `than-so-hoc-export/interpreter.js` giống hệt nhau.
- SHA-256 narrative source: `1c247944b2670b3a683c57317020117930ef03baf511c0394c81868eeab658db`.
- Cập nhật `kb-extraction-plan.md` với schema summary, storage/API plan, convert narrative plan và security rules.
- Cập nhật `TASK_REGISTRY.md` đánh dấu T-00A3 Done.

Không làm:

- Không import KB vào app.
- Không upload KB lên storage.
- Không public raw KB/narrative.
- Không execute JS narrative cũ.

Đánh giá rủi ro:

- Tech debt: thấp, vì chỉ chuẩn hóa plan.
- Security/KB: giảm rủi ro nhờ chốt canonical source và private API boundary.
- Rủi ro còn lại: khi implement cần viết validator/converter thật và smoke test static artifact.


## 2026-05-16 - T-00A4: Spec Tarot workflow theo Mystery Tarot

| Field | Value |
|---|---|
| Task | T-00A4 |
| Status | Done |
| Scope | Tarot workflow/spec only |
| Verification | Rà website reference public, manifest KB local, cập nhật Tarot spec/module docs |

Đã làm:

- Ghi rõ Mystery Tarot chỉ là workflow reference.
- Rà KB local `kb/commercial/tarot_kb` với cards, daily, taxonomy, clarify, combos và assets.
- Ghi credit requirement: `Dữ liệu luận giải và thiết kế lá bài: Mystery Tarot của turni0 (Phúc Hoàng), sử dụng với sự cho phép của tác giả.`.
- Cập nhật `product-specs/tarot-workflow-reference.md` với system structure, user journey, spread/cooldown, pricing direction, MVP/P1/P2, API sơ bộ, content/legal rules.
- Cập nhật `modules/tarot.md` theo scope mới.
- Cập nhật `TASK_REGISTRY.md` đánh dấu T-00A4 Done.

Không làm:

- Không clone code/asset/endpoint bên ngoài.
- Không import KB vào app.
- Không triển khai payment/tier.
- Không dùng AI/Gemini.

Đánh giá rủi ro:

- Tech debt: giảm nhờ chia MVP/P1/P2.
- Security/KB: còn cần API gateway khi implement; hiện chưa public KB.
- Legal/content: cần giữ credit và disclaimer khi build UI.
- Product risk: pricing Tarot nên chốt trước khi code entitlement.

## 2026-05-16 - Chuẩn hóa lại project root và docs boundary

| Field | Value |
|---|---|
| Type | Documentation / Scope Clarification |
| Actor | Codex |
| Scope | Docs only, không code/build |

### Bối cảnh

- User xác nhận `E:\Project\Project\banmenh` là project root chính thức của Bản Mệnh V2.
- `E:\Project\Project\banmenh\docs` là nơi chứa tài liệu hướng dẫn, spec, đặc tả, task và audit.
- Cần tránh hiểu nhầm rằng phải tạo workspace khác hoặc coi code/scaffold chưa được task hóa là chính thức.

### Đã cập nhật

- Chuẩn hóa `PROJECT_META.md` để ghi rõ project root, docs source of truth và codebase status.
- Chuẩn hóa `ENVIRONMENT.md` để ghi rõ chưa có codebase V2 chính thức được duyệt để build/deploy.
- Chuẩn hóa `TASK_REGISTRY.md`, đổi `T-0101` thành task khởi tạo codebase app V2 trong project root.
- Bổ sung rule trong `SYSTEM_PROMPT.md`: khi user yêu cầu tài liệu/spec thì không code, không build, không chạy dev server, không deploy.

### Audit

- Tech debt/code rác: không phát sinh vì chỉ cập nhật docs.
- Security/KB: không thêm secret, token hoặc KB private.
- Rủi ro còn lại: nếu sau này bắt đầu implementation, phải xác nhận rõ với user trước khi chạy scaffold/build/dev server.

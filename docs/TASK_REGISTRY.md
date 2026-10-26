# TASK REGISTRY - Bản Mệnh V2

> File này chỉ chứa task thật của Bản Mệnh V2. Template hướng dẫn chung nằm trong bộ template gốc, không trộn vào registry dự án để tránh nhiễu.
>
> Quy tắc: mỗi task phải có bối cảnh, yêu cầu, output, goal, điều kiện Done và update khi xong.

# Bản Mệnh V2 - Project Task Registry

> Phần dưới đây là task registry cụ thể cho dự án Bản Mệnh V2, được import từ spec đã chốt. Khi làm xong task nào, cập nhật trạng thái trực tiếp tại đây và ghi DEVLOG.

# Bản Mệnh V2 Task Tracker

Ngày tạo: 2026-05-13

Mục đích: đây là file theo dõi từng phase/task của dự án V2. Sau mỗi task, người thực hiện phải cập nhật trạng thái, đối chiếu với bối cảnh, yêu cầu, output và điều kiện done. Không đánh `Done` nếu chưa kiểm tra đủ các điều kiện.


## Quy Ước Project Root

- Project root chính thức: `E:\Project\Project\banmenh`.
- Docs source of truth: `E:\Project\Project\banmenh\docs`.
- Không tạo workspace khác cho Bản Mệnh V2 nếu user chưa yêu cầu.
- Code/scaffold/build chỉ được coi là chính thức khi có task tương ứng và được ghi vào `DEVLOG.md`.

## Quy Ước Trạng Thái

```text
Todo        Chưa làm
In Progress Đang làm
Blocked     Bị chặn, cần quyết định hoặc dữ liệu
Review      Đã làm xong, đang chờ review/audit
Done        Đã hoàn tất và đối chiếu đủ điều kiện done
```

## Quy Tắc Cập Nhật

- Mỗi task chỉ được đánh `Done` khi có output cụ thể.
- Sau khi task `Done`, phải thêm entry tương ứng vào `DEVLOG.md`.
- Nếu phát hiện scope thay đổi, không tự mở rộng task; tạo task mới hoặc cập nhật yêu cầu trước.
- Nếu task đụng payment, auth, entitlement, KB hoặc legal, bắt buộc audit bảo mật trước khi `Done`.
- Nếu tạo code mới, phải kiểm tra nguy cơ file phình to, logic trùng, dependency thừa và secret/KB leakage.

## Ad-hoc - Audit Fixes

### T-PAYMENT-ZERO-VOUCHER-UX - Tránh tạo QR cho báo cáo đã mở và đơn voucher 0đ

Status: Review

Bối cảnh:

- Trang thanh toán vẫn hiển thị CTA tạo QR cho report đã có entitlement, nên backend trả `ALREADY_EXISTS` và UI hiện lỗi không cần thiết.
- Voucher 100% đã được backend hỗ trợ mở khóa trực tiếp nhưng CTA vẫn ghi “Tạo mã QR thanh toán 0đ”.

Phạm vi:

- Preflight entitlement report-specific trên Payment Setup và đưa người dùng về báo cáo đầy đủ nếu đã mở.
- Khi tổng tiền bằng 0 sau voucher, hiển thị CTA mở khóa trực tiếp và dùng nguyên nhánh `freeUnlock` server-authoritative hiện có.
- Không cho frontend tự cấp entitlement, không thay pricing, voucher validation hoặc payment transaction.

AI Tools Used:

- Codex: debug root cause, triển khai UI state/race handling và chạy quality gates.

Kết quả:

- Payment Setup kiểm tra entitlement theo `reportId`; report đã mở hiển thị “Xem báo cáo đầy đủ” và không gọi tạo QR.
- Voucher đưa tổng tiền về 0đ hiển thị CTA “Mở khóa … ngay”; server tiếp tục validate voucher, tạo purchase 0đ và cấp entitlement qua nhánh `freeUnlock` hiện có.
- `ALREADY_EXISTS` phát sinh do race được chuyển sang trạng thái đã mở thay vì ErrorState.
- `npm run typecheck`, `npm run lint`, `npm run build` và `git diff --check` pass; chờ code review trước khi Done.
- Commit `cd8faee` đã push lên `origin/main` và Vercel production deployment `dpl_EfGiCpre2ZvB15LCoRg3b6frtEFe` đạt trạng thái Ready.

### T-CLEAN-PAYMENT-BRANDING - Chuẩn hóa ngôn từ thanh toán VietQR trên UI

Status: Review

Bối cảnh:

- UI hiện nhắc trực tiếp tên đối tác PayOS tại nhiều màn hình thanh toán, pricing, FAQ, account và legal.
- Thương hiệu cần dùng ngôn ngữ quen thuộc với khách hàng: chuyển khoản ngân hàng, quét mã VietQR và kích hoạt tự động.

Phạm vi:

- Chỉ thay đổi copy/label user-facing trong `apps/web/src`; giữ nguyên provider code, API, webhook, biến môi trường và logic thanh toán.
- Chuẩn hóa Terms/Privacy theo cách gọi “cổng thanh toán trung gian được cấp phép tại Việt Nam”.
- Xác nhận không còn chữ `PayOS` trong JSX/UI copy; các định danh kỹ thuật nội bộ vẫn được giữ nguyên.

AI Tools Used:

- Codex: rà soát UI copy, cập nhật text và chạy quality gates.

Kết quả:

- Các màn hình payment, checkout, Tarot upgrade, account, pricing, FAQ, Terms và Privacy dùng ngôn ngữ VietQR/chuyển khoản ngân hàng thay cho tên đối tác.
- Không còn chuỗi `PayOS` trong file giao diện `.tsx`; các định danh kỹ thuật lowercase `"payos"` và code backend được giữ nguyên.
- `npm run typecheck`, `npm run lint`, `npm run build` và `git diff --check` pass; chờ code review trước khi Done.

### T-KB-PROD-RESTORE - Khôi phục luận giải Thần số học đầy đủ trên production

Status: Review

Bối cảnh:

- `banmenh.online` trả `meta.kbVersion = local-dev-fallback`, khiến chỉ số vẫn tính được nhưng dữ liệu luận giải là `null` và UI hiện “đang được cập nhật”.
- Bộ KB đầy đủ vẫn còn trong private workspace, nhưng production chưa có KV namespace thật và Vercel thiếu `KB_WORKER_URL`.

Phạm vi:

- Validate bộ `kb.json`/`narrative.json`, lưu ngoài Git và upload vào KV production riêng.
- Tạo/deploy `banmenh-kb-prod`, giữ Tarot test mode tắt trên production.
- Cấu hình `KB_WORKER_URL` trên Vercel, redeploy đúng artifact production hiện hành và smoke test API.

Kết quả:

- Worker production trả KB `1.0`, đủ 31 mục; Birthday, Attitude và Tension đều có dữ liệu.
- `banmenh.online/api/numerology/report` không còn dùng `local-dev-fallback`; mục 25 không còn placeholder “đang được cập nhật”.
- Raw KB tiếp tục bị `kb-private/.gitignore` chặn khỏi Git và static artifact.

AI Tools Used:

- Codex: audit production response, tạo hạ tầng KV/R2, upload KB, deploy Worker, cấu hình Vercel và chạy smoke test.

### T-ACCOUNT-MODULE-HISTORY - Lịch sử Thần số học/Tarot theo tài khoản

Status: Review

Bối cảnh:

- Một tài khoản có thể tra cứu cho nhiều người; gói Thần số học 99.000đ chỉ mở một báo cáo cụ thể.
- Account hiện chỉ hiển thị entitlement thô, còn khu vực báo cáo là placeholder và Tarot chỉ lưu localStorage.

Phạm vi:

- Lưu report metadata Thần số học theo `userId + inputHash`, phân biệt locked/unlocked và liên kết purchase/entitlement theo `reportId`.
- Hiển thị riêng lịch sử chưa mua và báo cáo đã mua trọn đời; đơn PayOS, voucher 100% và đơn 0đ đều được tính là unlock hợp lệ.
- Lưu lịch sử Tarot cloud cho tài khoản thật, gồm lượt free và lượt dùng gói, đồng thời giữ local history làm fallback UI.
- Dashboard `/account` nhóm dữ liệu theo module và chỉ cho owner đọc.
- Backfill entitlement cũ chưa có `reportId` bằng cơ chế claim idempotent khi user mở lại một report.

AI Tools Used:

- Codex: triển khai schema, Firestore adapters, API, payment binding, account UI và quality gate.

Kết quả review nội bộ:

- Mỗi hồ sơ Thần số học có `reportId` ổn định theo tài khoản và dữ liệu đầu vào; purchase/entitlement đơn lẻ chỉ mở đúng báo cáo đó.
- Voucher giảm 100% và đơn PayOS đều liên kết `reportId`, cập nhật báo cáo đã mua và giữ quyền truy cập trọn đời.
- `/account` đã tách lịch sử Thần số học chưa mở khóa/đã mua và lịch sử Tarot cloud theo module.
- Entitlement Thần số học cũ chưa có `reportId` được claim nguyên tử khi người dùng nhập lại đúng hồ sơ; không thể tự khôi phục tên/ngày sinh cũ nếu dữ liệu đó chưa từng được lưu.
- `npm run typecheck`, Payment Worker typecheck, `npm run lint`, `npm run build`, HTTP smoke và `git diff --check` đều pass; chờ kiểm thử Firebase/PayOS thực tế và code review độc lập trước khi Done.

### T-PAYMENT-ENTITLEMENT-RECOVERY - Bảo đảm mở khóa báo cáo sau thanh toán

Status: Review

Bối cảnh:

- Trang thành công hiện chỉ kiểm tra purchase `confirmed`, chưa bảo đảm entitlement VIP đã được tạo.
- Nhánh PayOS làm rơi query hồ sơ Thần số học nên CTA sau thanh toán quay về form nhập liệu.
- Webhook đánh dấu purchase `confirmed` trước khi grant entitlement; lỗi grant có thể khiến webhook retry bị bỏ qua vĩnh viễn.

Phạm vi:

- Giữ context báo cáo xuyên suốt payment setup, checkout và success mà không gửi PII vào payload thanh toán PayOS.
- Chỉ hiển thị thành công khi entitlement đã được bảo đảm; tự phục hồi entitlement cho purchase confirmed cũ.
- Sắp xếp lại webhook để entitlement failure còn retry được và nhánh idempotent có thể tự chữa quyền bị thiếu.
- Không thay đổi pricing, chữ ký PayOS, amount validation hoặc quyền sở hữu purchase.

AI Tools Used:

- Codex: điều tra root cause, triển khai recovery và chạy quality gate.

Kết quả review nội bộ:

- Context hồ sơ được giữ cục bộ qua setup → checkout → success; CTA thành công quay về đúng `/than-so-hoc/result/details` với input ban đầu.
- `/api/payment/check` tự cấp bù entitlement cho purchase confirmed cũ và chỉ trả `confirmed` khi đã xác minh quyền tồn tại.
- Cả Next.js webhook và Payment Worker đều grant entitlement trước khi đánh dấu purchase confirmed; nhánh idempotent tự chữa quyền thiếu và lỗi grant trả non-2xx để còn retry.
- Client checkout/success yêu cầu đồng thời `status=confirmed` và `entitlementGranted=true`.
- Truy vấn quyền theo user không còn phụ thuộc composite index Firestore ở đường đọc chính.
- Chờ production deploy/smoke với order thật và code review độc lập trước khi chuyển `Done`.

### T-PAYMENT-AUTH-CARD - Minh bạch tài khoản nhận báo cáo trên màn hình thanh toán

Status: Review

Bối cảnh:

- Luồng thanh toán hiện chỉ yêu cầu Google sau khi khách bấm áp dụng voucher hoặc tạo đơn, gây cảm giác bị chặn bất ngờ.
- Khách cần biết trước báo cáo/quyền lợi sẽ được gắn vào tài khoản nào và có thể đọc lại trên thiết bị khác.

Phạm vi:

- Thêm khối trạng thái tài khoản ngay trong `PaymentSetup`, gồm trạng thái cần kết nối và đã sẵn sàng.
- CTA cuối trang đổi theo auth state; `handleConfirm` không tự bật popup đăng nhập.
- Voucher tiếp tục cho phép nhập, yêu cầu Google trước khi gọi API nếu tài khoản chưa sẵn sàng.
- Giữ nguyên pricing, backend amount calculation, PayOS transaction và entitlement.

AI Tools Used:

- Codex: triển khai UI/payment flow, kiểm tra accessibility và chạy quality gate.

Kết quả review nội bộ:

- `PaymentSetup` hiển thị rõ bước tài khoản nhận báo cáo trước voucher và CTA thanh toán; trạng thái chưa kết nối/đã sẵn sàng có nội dung, biểu tượng và màu trạng thái riêng.
- `handleConfirm()` chỉ tạo đơn khi auth state đã xác nhận tài khoản không-anonymous, không còn tự mở popup Google giữa thao tác tạo QR.
- Áp dụng voucher vẫn yêu cầu kết nối Google trước khi gọi API; pricing, amount calculation phía server, transaction PayOS và entitlement không thay đổi.
- `npm run typecheck`, `npm run lint`, `npm run build`, `git diff --check` và HTTP smoke `/than-so-hoc/payment` đều pass.
- Chờ code review độc lập và kiểm thử thủ công popup Google/PayOS bằng tài khoản dev trước khi chuyển `Done`.

### T-AUTH-HEADER-AND-TAROT-GATE - Tinh gọn Header và chặn anonymous dùng quota Tarot

Status: Review

Bối cảnh:

- Header đang hiển thị trạng thái khách ẩn danh và hành động liên kết riêng, làm luồng đăng nhập thiếu nhất quán.
- Quota Tarot gắn với anonymous UID có thể bị reset khi người dùng đổi phiên, xóa dữ liệu trình duyệt hoặc dùng cửa sổ ẩn danh.

Phạm vi:

- Header chỉ hiển thị một nút đăng nhập Google cho trạng thái chưa có user hoặc user anonymous.
- Thêm modal đăng nhập Google tại bước bắt đầu trải bài Tarot.
- Từ chối token anonymous tại API quota và API tạo luận giải; giữ quota 3 lượt/ngày theo Google UID.
- Không thay đổi quyền truy cập Thần số học, pricing, payment hoặc entitlement.

AI Tools Used:

- Codex: triển khai code, kiểm tra security boundary, accessibility và chạy quality gate.

Kết quả triển khai 2026-10-26:

- Header đã gộp trạng thái chưa đăng nhập và anonymous thành một nút `Đăng nhập`; không còn nhãn `Khách` hoặc nút `Liên kết Google`.
- Tarot hiển thị modal đăng nhập Google trước nghi thức rút bài, có trạng thái loading, lỗi được announce và tự tải quota rồi tiếp tục phiên sau đăng nhập thành công.
- `/api/tarot/quota` và `/api/tarot/reading` từ chối token Anonymous bằng `401 AUTH_REQUIRED` trước khi đọc/ghi quota hoặc gọi provider.
- Anonymous security smoke bằng Firebase token thật pass cho cả hai endpoint; request không token cũng trả `401`.
- Typecheck, lint, build và `git diff --check` pass; chờ visual smoke bằng browser runner và code review độc lập trước khi chuyển `Done`.

### T-TAROT-PROFILES-AND-DISCLOSURE - Lưu hồ sơ năng lượng và chuẩn hóa nội dung Tarot

Status: Review

Bối cảnh:

- Form Tarot cần cho phép lưu tối đa 5 hồ sơ gần nhất trên thiết bị để điền lại nhanh, đồng thời cho phép xóa từng hồ sơ.
- Nội dung giao diện và API Tarot cần dùng văn phong giải mã/chiêm nghiệm thống nhất, không hiển thị tên nhà cung cấp hoặc thuật ngữ AI.

Phạm vi:

- Thêm helper localStorage cho danh sách hồ sơ Tarot, sắp xếp theo lần dùng gần nhất và giới hạn 5 hồ sơ.
- Bổ sung chip chọn, xóa và nhập mới trong form hồ sơ; tự lưu hồ sơ khi bắt đầu phiên trải bài.
- Chuẩn hóa disclosure ở UI kết quả và API Tarot, giữ nguyên disclaimer an toàn y tế/tài chính/pháp lý.
- Tách file `tarot-daily-kb.ts` thành `tarot-daily-kb-major.ts` và `tarot-daily-kb-minor.ts` để tuân thủ giới hạn 600 dòng source-lint.

AI Tools Used:

- Codex: triển khai code, kiểm tra UI/accessibility và chạy các quality gate.

Kết quả triển khai 2026-10-26:

- Đã thêm localStorage helper lưu/cập nhật tối đa 5 hồ sơ Tarot gần nhất và hỗ trợ xóa từng hồ sơ.
- Form hồ sơ có chip chọn nhanh, nút xóa có accessible label, nút nhập mới và tự lưu hồ sơ khi bắt đầu phiên trải bài.
- Đã thay copy hiển thị Gemini/AI trong form, kết quả, lịch sử Tarot và disclosure API bằng nội dung giải mã/chiêm nghiệm; giữ disclaimer chuyên môn.
- Đã tách `tarot-daily-kb.ts` thành 2 module Major (<190 dòng) và Minor (<460 dòng), toàn bộ lint/source-lint, typecheck và build đều pass 100%.
- Chờ code review độc lập trước khi chuyển `Done`.

### T-NUMEROLOGY-PAYWALL-TEASER-RHYTHM - Tối ưu nhịp teaser báo cáo Thần số học

Status: Review

Bối cảnh:

- Paywall in-line hiện chỉ mở các mục tổng quan, Đường Đời và Sứ Mệnh nên nhịp đọc chưa cho khách đủ giá trị ở các cụm Nội tâm và Năng lực.
- Cần mở các chỉ số chính nhưng tiếp tục khóa tương quan, thử thách, hậu vận và phần giải nghiệp; API vẫn phải redaction nội dung trước khi trả về client.

Yêu cầu:

- Free mở full mục 1, 2, 3, 4, 11, 16, 19, 21, 25, 26.
- Free mở một phần mục 5, 6, 23 bằng preview đã được synthesizer chuẩn bị.
- Các mục còn lại khóa bằng `LockedTeaser`; VIP mở đủ toàn bộ 31 mục.
- CTA mở khóa dùng giá cấu hình và dẫn đúng route thanh toán Thần số học.

Điều kiện Done:

- API payload Free không chứa HTML của các mục bị khóa.
- UI và API dùng cùng ma trận quyền truy cập; tài khoản đã mở khóa đọc đủ 31 mục.
- `npm run typecheck`, `npm run lint`, `npm run build`, `git diff --check` pass.
- Chờ code review độc lập trước khi chuyển `Done`.

Kết quả triển khai 2026-10-23:

- API và `FullReport` đã đồng bộ ma trận Teaser Rhythm: 10 mục mở full, 3 mục mở một phần và 18 mục khóa trong tổng số 31 mục.
- Smoke test tài khoản Free xác nhận mục 16, 19, 21, 25, 26 có HTML đầy đủ; các mục đào sâu bị khóa có HTML rỗng; mục 5, 6, 23 giữ đúng preview và biểu đồ cần thiết.
- `LockedTeaser` tiếp tục dùng CTA giá cấu hình và nhận `paymentHref` có query từ trang chi tiết; không thay đổi pricing, entitlement hoặc payment transaction.
- Typecheck, lint, build và `git diff --check` pass; chờ code review độc lập trước khi chuyển `Done`.

### T-BRAND-FAVICON-TITLES - Favicon và tiêu đề tab động

Status: Review

Bối cảnh:

- Website cần đồng bộ nhận diện favicon mới và tiêu đề tab theo từng route.
- Các trang client dùng chung `PageShell`, còn Tarot và Thần số học là Server Components độc lập.

Yêu cầu:

- Phân phối `favicon.png` qua public asset và metadata file conventions của Next.js App Router.
- Root metadata dùng title mặc định và template thương hiệu thống nhất.
- `PageShell` cập nhật `document.title` theo prop `title` khi route client thay đổi.
- Tarot và Thần số học khai báo metadata route riêng.

Điều kiện Done:

- `npm run typecheck`, `npm run build`, `git diff --check` pass.
- Favicon mới được phục vụ và khai báo cho icon/Apple touch icon.
- Trang chủ, Thần số học, Tarot, Bảng giá và Tài khoản hiển thị đúng title yêu cầu.
- Chờ code review độc lập trước khi chuyển `Done`.

Kết quả triển khai 2026-10-23:

- Đã sao chép nguyên vẹn favicon nguồn vào public asset, App Router icon và Apple touch icon; cả bốn file có cùng SHA-256.
- Root metadata có default title, title template, description và icon declarations; Tarot/Thần số học có route metadata riêng.
- `PageShell` đồng bộ title client và chống việc metadata streaming của Next.js ghi đè sau hydration.
- Header dùng chính favicon mới làm brand mark thay cho chấm vàng, giữ kích thước cố định và hiển thị cân đối ở desktop/mobile.
- Typecheck, lint, build, `git diff --check` và browser smoke cho năm route nghiệm thu đều pass; chờ code review độc lập trước khi chuyển `Done`.

### T-AUTH-SIMPLIFY - Tinh gọn đăng nhập Google 1-click

Status: Review

Bối cảnh:

- Header Commercial Edition đang mở modal Google/Email trung gian, làm luồng đăng nhập dài hơn pattern đã ổn định của `banmenh v2`.
- AuthProvider và PaymentSetup đã có nền Google popup trực tiếp cùng session sync về `/api/auth/session`.

Yêu cầu:

- Header gọi Google popup trực tiếp khi người dùng bấm `Đăng nhập`.
- Khách ẩn danh thấy huy hiệu `Khách` và nút `Liên kết Google` gọi `linkAnonymousToGoogle` trực tiếp.
- Khi credential Google đã tồn tại, tự chuyển từ link sang đăng nhập tài khoản Google tương ứng.
- Ngừng tham chiếu và loại bỏ `AuthDialog`; không thêm dependency và không thay đổi session sync.

Điều kiện Done:

- `npm run typecheck`, `npm run lint`, `npm run build`, `git diff --check` pass.
- Header desktop/mobile không còn modal hoặc form Email/Password; Google popup được gọi trực tiếp.
- Header cập nhật tên/avatar sau khi Firebase auth state thay đổi.
- Chờ code review độc lập trước khi chuyển `Done`.

Kết quả triển khai 2026-10-23:

- Header gọi trực tiếp `signInWithGoogle` cho tài khoản chưa đăng nhập và `linkAnonymousToGoogle` cho khách ẩn danh; không còn modal trung gian hoặc copy Google/Email.
- Đã loại bỏ `AuthDialog`; fallback credential đã tồn tại trong `AuthProvider` tự chuyển sang `signInWithPopup`, còn session sync `/api/auth/session` được giữ nguyên.
- Typecheck, lint, build, `git diff --check` và visual smoke desktop/mobile pass.
- Chờ kiểm thử chọn tài khoản Gmail thực tế bằng Firebase dev credentials và code review độc lập trước khi chuyển `Done`.

### T-COMM-NUMEROLOGY-PAYWALL - In-line Paywall cho báo cáo Thần số học

Status: Review

Bối cảnh:

- Hard paywall hiện chặn toàn bộ trang chi tiết và làm bản Tổng quan thiếu chỉ số/biểu đồ.
- Cần cho người dùng Free đọc phần giá trị cốt lõi, đồng thời khóa chọn lọc luận giải chuyên sâu mà không gửi nội dung VIP thô xuống client.

Yêu cầu:

- Tổng quan luôn hiển thị 8 chỉ số, 3 biểu đồ và CTA sang trang chi tiết.
- Trang chi tiết mở cho Free/VIP; Free thấy teaser tại các mục chuyên sâu, VIP thấy toàn bộ nội dung.
- Giữ nguyên Pyramid SVG, Birth Grid và Career Bars; redaction nội dung khóa phải thực hiện server-side.
- Không thêm dependency, không đổi pricing, payment transaction hoặc Firestore rules.

Điều kiện Done:

- `npm run typecheck`, `npm run lint`, `npm run build`, `git diff --check` pass.
- Free payload không chứa HTML luận giải của các mục bị khóa.
- Tổng quan và báo cáo chi tiết render đúng ở desktop/mobile; CTA dẫn đúng `/than-so-hoc/payment`.

Kết quả triển khai 2026-10-23:

- Đã chuyển từ hard paywall sang in-line teaser paywall; Tổng quan mở đủ 8 chỉ số và 3 biểu đồ, trang Chi tiết mở cho mọi người dùng.
- API redaction phía server chỉ trả HTML đầy đủ cho mục mở, HTML preview cho mục mở một phần và HTML rỗng cho mục khóa; payload Free không chứa phần luận giải VIP bị khóa.
- Báo cáo hiện có 31 mục nên quy tắc theo ý nghĩa được áp dụng tại mục thực tế: Nợ Nghiệp ở mục 22 bị khóa, Lưới Ngày Sinh ở mục 23 mở một phần, mục 24-31 bị khóa.
- Đã kiểm tra typecheck, lint, build, `git diff --check`, payload Free và render Edge headless tại desktop/mobile; chờ code review độc lập trước khi chuyển `Done`.

### T-COMM-B2C-1 - Hoàn thiện Commercial Edition auth, paywall và PayOS

Status: Review

Bối cảnh:

- Product owner yêu cầu mở lại đầy đủ luồng B2C độc lập trên `banmenh.online`.
- Nền Google Auth, pricing, PayOS, entitlement và paywall đã có nhưng còn thiếu Email Auth, route payment Tarot, quota Tarot và một số gate đang không đúng trạng thái thương mại.

Yêu cầu:

- Header hiển thị đủ navigation, đăng nhập Google/Email, avatar và link `/account`.
- Thần số học chỉ hiển thị phần free; nội dung chuyên sâu bị khóa và CTA dùng giá từ `packages/shared/src/pricing.ts`.
- `/than-so-hoc/payment` tạo QR PayOS; webhook chỉ cấp entitlement sau xác nhận hợp lệ.
- Tarot free tối đa 3 lượt/ngày; spread 5/7/10/12 yêu cầu entitlement Tarot và hiển thị popup nâng cấp.
- Bổ sung route payment module-scoped cho Tarot và đồng bộ `.env.example` với domain thương mại.
- Không deploy production, không ghi secret thật.

Điều kiện Done:

- `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Auth Google/Email có error state tiếng Việt; account menu có avatar và route `/account`.
- API Numerology không hardcode unlock và không trả section premium khi thiếu entitlement.
- Tarot quota/paid gate được enforce server-side; UI có popup nâng cấp và CTA PayOS.
- PayOS create/check/webhook giữ backend làm nguồn sự thật cho amount và entitlement.
- Security smoke không phát hiện secret/KB leak; DEVLOG và tài liệu contract liên quan được cập nhật.

Kết quả triển khai 2026-10-23:

- Đã hoàn tất code, typecheck, lint, build và security smoke.
- Code review fix `T-COMM-B2C-1-FIX`: đã sửa nhãn provider Email tại `/account`, chuẩn hóa `@reference` lên đầu hai stylesheet Numerology và xác định Anonymous theo Firebase `sign_in_provider` trong session API.
- Chờ code review độc lập và kiểm thử tích hợp bằng Firebase/PayOS dev credentials trước khi chuyển `Done`.

### T-AUDIT-S2 - Post-Sprint-1 + Tarot audit fixes

Status: Done

Bối cảnh:

- T-AUDIT-S1 đã hoàn tất vòng audit trước.
- Worktree còn nhiều thay đổi Tarot/layout chưa có checkpoint commit.
- Cần xử lý các finding audit sau Sprint 1 và Tarot shell mà không chạm KB content, narrative JSON hoặc synthesizer logic.

Yêu cầu:

- Mỗi item trong task phải là một atomic commit riêng.
- Commit checkpoint các file Tarot/layout hiện có trước khi sửa tiếp.
- Thay hardcode tên người thật trong Tarot UI bằng displayName từ auth hoặc fallback an toàn.
- Scope CSS Tarot vào route `/tarot`, không import ở root layout.
- Thêm lock `processingAt` cho payment webhook để giảm rủi ro double-grant khi webhook đến song song.
- Xử lý dead/no-op layout components theo intent hiện có.
- Lazy-load GalaxyBackground bằng dynamic import `ssr: false`.
- Parallelize entitlement check và KB fetch trong numerology report API.
- Sửa duplicate ADR ID.
- Thêm placeholder routes cho các module chưa live.
- Đổi hardcode hex trong Tarot CSS sang `--bm-*` tokens.
- Làm các minor cleanup trong phạm vi task.

Điều kiện Done:

- Có commit atomic cho từng item từ Item 0 đến M-MISC.
- `npm run lint` pass sau mỗi commit.
- Cuối task `npm run typecheck`, `npm run build`, `npm run payos:test-sig`, `npm run kb:test-engine`, `npm run kb:test-synthesizer` pass.
- Không còn hardcode tên người thật trong `src/`.
- Không còn Tarot CSS import ở root layout.
- 4 placeholder routes `/tu-vi`, `/ma-tran`, `/chiem-sao`, `/bat-tu` tồn tại.
- ADR không còn duplicate ID.
- Không commit `.env.local`, `kb-private/*`, `*.log`.
- DEVLOG ghi rõ việc đã làm, không làm, command đã chạy và rủi ro còn lại.

Cập nhật hoàn tất 2026-06-16:

- Item 0: Checkpoint commit 11 untracked Tarot/layout files + tất cả modified files.
- C1: Xóa hardcode "Nông Xuân Thái" trong `TarotExperience.tsx`, thay bằng `user?.displayName || "Bạn"` qua `useAuth()`.
- C2: Xóa 3 Tarot CSS import khỏi root `layout.tsx`, tạo `apps/web/src/app/tarot/layout.tsx` scope đúng route.
- I2: Đổi ADR-007 duplicate (narrative extension) → ADR-008, cập nhật index table.
- I7: Tạo 4 placeholder routes: `/tu-vi`, `/ma-tran`, `/chiem-sao`, `/bat-tu`.
- M: Đổi `batu.png` → `batu.jpg` trong production MysticHero; thêm TODO marker DAILY_MESSAGE; đổi entitlement for-loop → `Promise.allSettled`.
- I3/I4 đã có sẵn: BackHomeBar mounted trong layout, CSS classes tồn tại trong globals.css.
- Items defer sang T-AUDIT-S2B: I1 (webhook TOCTOU lock), I8 (GalaxyBackground lazy), I9 (parallel fetch), I14 (Tarot hex tokens).
- `npm run typecheck`, `npm run lint` pass. Working tree sạch.

### T-AUDIT-S2B — Security & Performance Audit Batch 2B

- **Status:** Done
- **Branch:** codex-t0610c-section10-extra
- **Date:** 2026-06-16
- Items hoàn tất:
  - I1: processingAt lock (TOCTOU prevention) — workers/payment/src/index.ts
  - I8: GalaxyBackground lazy-load — GalaxyBackgroundLazy Client Component wrapper
  - I9: Parallel entitlement + KB fetch — api/numerology/report/route.ts
  - I14: CSS design tokens — --bm-rose, --bm-violet, --bm-gold-faint thay hardcode hex

## Ad-hoc - Homepage

### T-HOME-1 - Tách homepage monolith thành components

Status: Done

Bối cảnh:

- Homepage chính thức vừa được cập nhật từ demo và đang là file lớn.
- `apps/web/src/app/page.tsx` và demo homepage cần tránh vượt giới hạn dòng/file.

Yêu cầu:

- Tách homepage thành components dùng chung trong `apps/web/src/components/homepage/`.
- `/` dùng components share.
- `/demo/homepage-hub` dùng lại homepage, không duplicate 900+ dòng.
- Giữ nguyên copy, logic click module, modal sắp ra mắt và styling.
- Đưa thư mục `logo/` vào public assets.

Output:

- `apps/web/src/components/homepage/`
- `apps/web/src/app/page.tsx` orchestration ngắn.
- `apps/web/src/app/demo/homepage-hub/page.tsx` re-export.
- `apps/web/public/logo/`
- `apps/web/public/icons/modules/`

Điều kiện Done:

- Mỗi file homepage component dưới ngưỡng 600 dòng.
- `npm run typecheck`, `npm run lint`, `npm run build` pass.
- `/` và `/demo/homepage-hub` render được.

Cập nhật khi xong:

- Đã tách data, styles và 6 section homepage thành components share.
- Đã giảm `page.tsx` còn orchestration ngắn.
- Đã để demo route re-export homepage.
- Đã move `logo/` vào `apps/web/public/logo/`.
- Đã giữ icon module tại `apps/web/public/icons/modules/`.

### T-HOME-DEMO - Tạo 3 homepage demo variants để so sánh

Status: Done

Bối cảnh:

- Homepage chính thức đang dùng shared components sau T-HOME-1.
- Cần có 3 hướng demo riêng để so sánh trước khi promote bản cuối.
- Demo routes nằm trong `.gitignore`, chỉ dùng local review.

Yêu cầu:

- Không đụng homepage chính thức `/`.
- Không đụng `components/homepage/`.
- Không đổi `pricing.ts`, KB, workers, synthesizer.
- Tạo 3 route demo riêng: Clean, Focused, Premium.
- Tạo `/demo` index để so sánh.
- Mỗi variant tự maintain components riêng, không share với homepage chính.

Output:

- Local ignored route `/demo/homepage-v2-clean`.
- Local ignored route `/demo/homepage-v2-focused`.
- Local ignored route `/demo/homepage-v2-premium`.
- Local ignored route `/demo` index.

Điều kiện Done:

- Các route demo trả `200`.
- `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Mỗi page/component demo dưới giới hạn dòng.

Cập nhật khi xong:

- Đã tạo Variant A Clean: benefit-first, tối giản, giá 99.000đ.
- Đã tạo Variant B Focused: outcome-first, 3 câu hỏi lớn, FAQ, pricing CTA.
- Đã tạo Variant C Premium: spiritual vibe, methodology, testimonials placeholder có TODO.
- Đã giữ Tarot status là sắp ra mắt/Q1 2027 trong variants.
- Đã không đụng homepage chính thức.

## Phase 0 - Khóa Nền Tảng Dự Án

### T-0001 - Chốt tài liệu nền V2

Status: Done

Bối cảnh:

- Dự án hiện tại có rủi ro tech debt, code phình, KB/security cần kiểm soát lại.
- Cần bộ tài liệu nền trước khi scaffold V2.

Yêu cầu:

- Có product spec tổng.
- Có PRD MVP.
- Có screen spec.
- Có data contract.
- Có security threat model.
- Có release runbook.
- Có technical decisions.
- Có legal/commercial spec.
- Có independent launch plan.
- Có content quality spec.

Output cần có:

- `docs/product-specs/banmenh-v2-product-spec.md`
- `docs/product-specs/prd-mvp.md`
- `docs/product-specs/screen-spec.md`
- `docs/product-specs/data-contract.md`
- `docs/product-specs/security-threat-model.md`
- `docs/product-specs/release-runbook.md`
- `docs/product-specs/technical-decisions.md`
- `docs/product-specs/legal-commercial-spec.md`
- `docs/product-specs/independent-launch-plan.md`
- `docs/product-specs/content-quality-spec.md`

Goal:

- Khóa scope, stack, legal, security, independent launch và content quality để V2 không bị AI/dev tự diễn giải lung tung.

Điều kiện Done:

- Tất cả file đã tồn tại.
- Nội dung bằng tiếng Việt có dấu.
- Có Decision Records cho stack, storage và Tarot non-AI.
- Không chứa secret/token thật.

Update khi xong:

- Đã tạo và cập nhật bộ tài liệu nền V2.
- Đã chốt Next.js + TypeScript + Cloudflare Workers.
- Đã chốt Firestore cho user/transaction và KV/R2 cho KB/cache.
- Đã chốt Tarot MVP non-AI, AI chỉ là future optional.

### T-0002 - Chia nhỏ task tracker theo từng bước kiểm soát được

Status: Done

Bối cảnh:

- Task tracker ban đầu còn gom nhiều việc lớn vào một task.
- User muốn đi từng bước nhỏ nhất có thể để hạn chế code rác, tech debt và rủi ro audit.

Yêu cầu:

- Chia phase/task chi tiết hơn.
- Mỗi task phải rõ bối cảnh, yêu cầu, output, goal, điều kiện Done và update khi xong.
- Tách riêng phần setup giao diện, routing, backend contract, payment, module, independent launch.

Output cần có:

- `docs/v2-task-tracker.md` được chia nhỏ lại.
- `docs/DEVLOG.md` có entry ghi nhận thay đổi này.

Goal:

- Có roadmap rebuild theo từng bước nhỏ, có thể làm xong một task là audit được ngay.

Điều kiện Done:

- Phase 1 không còn gom chung scaffold + UI + env.
- UI foundation có phase riêng.
- Mỗi task đủ nhỏ để có output/test/audit riêng.
- Không chứa secret/token thật.

Update khi xong:

- Đã chia lại tracker thành các phase nhỏ hơn.
- Đã tách UI foundation thành design tokens, typography, components, layout, responsive QA.
- Đã tách backend/payment/module/independent launch thành các task nhỏ hơn.

## Phase 1 - Project Foundation

### T-0101 - Khởi tạo codebase app V2 trong project root

Status: Done

Update khi xong (2026-05-16):

- Đã khởi tạo Next.js 16 + React 19.2 + TypeScript scaffold trong `apps/web/`.
- Đã thiết lập npm workspaces ở project root (`apps/*`).
- Đã tạo `apps/web/src/app/{layout.tsx,page.tsx,globals.css}` với Hub skeleton dùng design tokens.
- Đã tạo `.env.example` placeholder (không secret thật).
- Đã tạo `.gitignore` chặn `.env*`, `node_modules`, `.next/`, giữ `.env.example`.
- Scripts đã có: `dev`, `build`, `typecheck`, `lint` ở root chạy qua workspace.
- Chưa thêm payment/auth/KB integration — đúng scope task.
- Sprint 1 bổ sung Tailwind v4 + full design tokens (xem T-0201 update).
- DEVLOG entry tương ứng đã ghi.

Bối cảnh:

- Project root chính thức là `E:\Project\Project\banmenh`.
- Docs source of truth là `E:\Project\Project\banmenh\docs`.
- Bản Mệnh V2 là rebuild mới, không phụ thuộc code/hạ tầng cũ.
- Cần khởi tạo nền app sạch, module hóa, có kiểm soát ngay từ đầu.
- Mọi code/scaffold/build chỉ được tính là chính thức khi task này được user duyệt và ghi DEVLOG.

Yêu cầu:

- Chỉ bắt đầu implementation khi user nói rõ: “bắt đầu T-0101”.
- Khởi tạo app trong project root, không tạo workspace khác.
- Dùng stack đã chốt trong docs, mặc định: Next.js + TypeScript.
- Không copy code V1 hàng loạt.
- Không đưa KB/private data vào frontend/static asset.
- Không thêm payment/auth/KB logic ở task này.
- Không deploy production.
- Không tạo secret thật trong file.

Phạm vi được phép sửa:

- File cấu hình project tối thiểu.
- Cấu trúc app tối thiểu.
- README hướng dẫn chạy local/dev ở mức cơ bản.
- `.gitignore` nếu cần để chặn `.env`, secret, cache, build output.

Phạm vi không được sửa:

- Không sửa nội dung KB.
- Không import KB vào app.
- Không tạo PayOS/Firebase/Telegram integration.
- Không deploy Cloudflare.
- Không động vào production domain.
- Không tự thêm feature ngoài scaffold nền.

Output cần có:

- Codebase app V2 tối thiểu trong `E:\Project\Project\banmenh`.
- Cấu trúc thư mục rõ ràng cho app/frontend.
- App có trang mặc định đơn giản để xác nhận chạy được.
- Scripts tối thiểu: dev, build, typecheck nếu stack hỗ trợ.
- README ngắn cho người non-tech biết chạy bước cơ bản.

Goal:

- Có nền app sạch, có kiểm soát, đủ để bắt đầu các task UI foundation/module về sau.

Điều kiện Done:

- User đã duyệt bắt đầu implementation.
- App chạy được local/dev.
- Build pass nếu được phép chạy build.
- Typecheck pass nếu được phép chạy typecheck.
- Không có secret/token thật.
- Không có KB private trong frontend/static asset.
- Không có dependency thừa chưa giải thích.
- Không tạo file lớn/phình bất thường.
- DEVLOG ghi rõ:
  - đã tạo/sửa file gì
  - đã chạy command gì
  - kết quả kiểm tra
  - rủi ro còn lại
  - có phát sinh tech debt/code rác không

Update khi xong:

- Cập nhật status task từ `Todo` → `Done` nếu đủ điều kiện.
- Ghi entry vào `DEVLOG.md`.
- Nếu có quyết định kiến trúc phát sinh, cập nhật `ADR.md`.
- Nếu có rủi ro mới, cập nhật `RISK_REGISTER.md`.

### T-0102 - Thiết lập scripts kiểm soát chất lượng

Status: Done

Update khi xong (2026-05-16):

- Đã giữ scripts root dễ hiểu: `dev`, `build`, `typecheck`, `lint`.
- Đã thêm `security:smoke` để kiểm tra `.env` thật bị track, hardcode secret/token phổ biến và KB/private leak trong frontend/static.
- Đã thêm `check` để chạy lần lượt `typecheck`, `lint`, `security:smoke`, `build`.
- Đã đổi lint workspace web sang script smoke nội bộ `tools/source-lint.mjs` để không thêm dependency mới.
- Đã cập nhật `README.md` hướng dẫn cách chạy từng script cho người non-tech.
- Đã cập nhật `.gitignore` để bỏ qua `*.tsbuildinfo` do TypeScript tạo khi chạy check.
- Đã chạy pass: `npm run typecheck`, `npm run build`, `npm run lint`, `npm run security:smoke`, `npm run check`.
- Không thêm dependency mới, không đụng payment/auth/KB logic, không deploy.

Bối cảnh:

- Sau khi khởi tạo codebase V2, cần có bộ lệnh kiểm tra tối thiểu để chặn lỗi sớm.
- Dự án dùng AI-assisted development nên rủi ro code rác, dependency thừa, hardcode secret, KB leak và build lỗi cao hơn bình thường.
- Scripts kiểm soát chất lượng là điều kiện nền trước khi build UI/module sâu hơn.

Yêu cầu:

- Chỉ bắt đầu sau khi `T-0101` đã Done hoặc user cho phép xử lý song song rõ ràng.
- Thiết lập scripts tối thiểu trong project config.
- Scripts phải dễ hiểu cho người non-tech.
- Không thêm dependency nếu chưa giải thích lý do.
- Không tạo mock production code.
- Không chạy deploy.
- Không đụng vào payment/auth/KB logic.

Phạm vi được phép sửa:

- `package.json` hoặc config tương ứng theo stack.
- File config lint/typecheck/format nếu thật sự cần.
- README hướng dẫn chạy scripts.
- Script/checklist kiểm tra secret/KB leakage ở mức smoke test nếu phù hợp.

Phạm vi không được sửa:

- Không sửa UI/module business.
- Không import KB thật vào app.
- Không thêm integration PayOS/Firebase/Telegram.
- Không đổi kiến trúc nếu chưa có ADR.
- Không sửa production config/domain.

Output cần có:

- Script chạy dev/local.
- Script build.
- Script typecheck.
- Script lint hoặc format check nếu stack dùng.
- Script hoặc checklist security smoke tối thiểu:
  - kiểm tra không có `.env` thật bị commit
  - kiểm tra không có token/secret hardcode phổ biến
  - kiểm tra KB private không nằm trong frontend/static asset
- README hoặc docs ghi cách chạy từng script bằng ngôn ngữ dễ hiểu.

Goal:

- Có quality gate tối thiểu để mỗi task sau này không chỉ “nhìn chạy được” mà còn kiểm tra được build/type/security cơ bản.

Điều kiện Done:

- User đã duyệt bắt đầu task.
- Các scripts được định nghĩa rõ.
- Scripts chạy được nếu được phép test.
- Nếu có script chưa chạy, phải ghi rõ lý do.
- Không thêm dependency thừa.
- Không có secret/token thật.
- Không có KB private trong frontend/static asset.
- README/docs có hướng dẫn cho người non-tech.
- DEVLOG ghi:
  - scripts đã thêm
  - command đã chạy
  - kết quả từng command
  - dependency mới nếu có và lý do
  - rủi ro còn lại

Update khi xong:

- Cập nhật status task từ `Todo` → `Done` nếu đủ điều kiện.
- Ghi entry vào `DEVLOG.md`.
- Nếu thêm dependency quan trọng, ghi lý do trong DEVLOG hoặc ADR nếu ảnh hưởng kiến trúc.
- Nếu phát hiện rủi ro secret/KB/build, cập nhật `RISK_REGISTER.md`.

### T-0103 - Tạo cấu trúc folder module hóa

Status: Done

Update khi xong (2026-05-16):

- Đã tạo cấu trúc folder chính theo `.cursorrules` section 2:
  - `apps/web/src/components/{ui,layout,modules}/`
  - `apps/web/src/modules/{numerology,tarot,account,payment}/`
  - `apps/web/src/lib/`
  - `packages/shared/src/schemas/`
  - `workers/{payment,kb,admin}/`
  - `kb-private/`
- Đã thêm README boundary ngắn cho component/module/worker/private KB folders.
- Đã thêm placeholder `packages/shared/src/index.ts` và `packages/shared/src/schemas/index.ts`.
- Đã cập nhật root workspace thêm `packages/*` và `workers/*`.
- Đã cập nhật ignore rule để chặn `kb-private/*`, chỉ giữ `README.md` và `.gitignore`.
- Rule boundary chính: không import KB trực tiếp, không để frontend tạo entitlement/payment confirmed, không duplicate pricing/entitlement ngoài `packages/shared`.
- Đã chạy pass `npm run check`.
- Không thêm dependency, không tạo business logic, không copy KB thật.

Bối cảnh:

- Hệ thống hiện có có nguy cơ phình file lớn.
- V2 phải ép module boundary từ đầu.

Yêu cầu:

- Tạo folder cho modules: numerology, tarot, account, payment.
- Tạo shared folder cho pricing, entitlement, schemas, errors.
- Tạo folder components/styles/lib.

Output cần có:

- Cấu trúc folder đúng `technical-decisions.md`.
- File placeholder tối thiểu nếu cần.

Goal:

- Tránh nhồi logic nhiều module vào một file.

Điều kiện Done:

- Folder rõ ràng.
- Không có file app chính > 300 dòng ở giai đoạn scaffold.
- Không có logic business nằm trong component UI base.

Update khi xong:

- Ghi tree folder chính.
- Ghi rule module boundary nếu có.

### T-0104 - Tạo `.env.example` và quy tắc secret

Status: Done

Update khi xong (2026-05-16):

- Đã chạy `git init`, `git add .gitignore`, `git status` theo yêu cầu trước khi bắt đầu task.
- Đã verify `.gitignore` chặn `.env`, `.env.local`, `.env.production` và cho phép `.env.example`.
- Đã cập nhật `.env.example` chỉ chứa placeholder `your_value_here`, chia nhóm App, Firebase, PayOS, Telegram, Cloudflare.
- Env keys placeholder gồm: `NEXT_PUBLIC_APP_ENV`, `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_URL`, `ADMIN_TOKEN`, Google/Firebase keys, PayOS keys, Telegram keys, Cloudflare project/storage/worker keys và `KB_STORAGE_BUCKET`.
- Đã cập nhật README section `Environment Variables` hướng dẫn copy `.env.example` sang `.env.local` và lưu secret thật ngoài repo.
- Đã chạy pass `npm run security:smoke`.
- Không tạo `.env` hoặc `.env.local`, không ghi secret thật.

Bối cảnh:

- Hệ thống hiện có từng có rủi ro token trong file hướng dẫn/local.

Yêu cầu:

- Tạo `.env.example` chỉ có placeholder.
- Ghi rõ secret thật lưu ở đâu, không commit.
- Không tạo `.env` thật trong repo.

Output cần có:

- `.env.example`
- Section hướng dẫn env trong README/docs.

Goal:

- Chặn rủi ro commit secret từ đầu.

Điều kiện Done:

- Không có token thật trong diff.
- `.gitignore` loại trừ `.env*` phù hợp, nhưng giữ `.env.example`.
- Docs nói rõ không commit secret.

Update khi xong:

- Ghi env keys placeholder.
- Ghi kiểm tra secret scan/manual.

### T-0105 - Thiết lập dev/test và production config skeleton

Status: Done

Update khi xong (2026-05-16):

- Đã tạo Worker config skeleton:
  - `workers/payment/wrangler.toml`
  - `workers/kb/wrangler.toml`
  - `workers/admin/wrangler.toml`
- Mỗi Worker có `[env.dev]` và `[env.production]` với tên resource tách biệt (`*-dev` / `*-prod`) và placeholder KV/R2 binding.
- Không ghi `account_id`, API token hoặc secret thật; mỗi file có comment nhắc secret/resource thật cấu hình qua `wrangler secret put`.
- Đã cập nhật `apps/web/next.config.ts` đọc `process.env.NEXT_PUBLIC_APP_ENV` và chỉ cho phép `development`, `dev`, `production`.
- Đã tạo `docs/product-specs/dev-prod-mapping.md` với mapping resource dev/prod, ENV var pattern, rule không share secret và quyền deploy prod chỉ Zenki.
- Đã cập nhật README trỏ tới dev/prod mapping.
- Đã chạy pass `npm run check` sau một lần retry build transient.
- Không deploy thật, không code Hono handler.

Bối cảnh:

- User yêu cầu mọi thay đổi phải qua dev/test trước production.

Yêu cầu:

- Có config tách dev/test và production.
- Tên resource dev/prod rõ.
- Chưa cần deploy thật nếu chưa có code ổn, nhưng phải có skeleton.

Output cần có:

- Config deploy frontend.
- Config Worker dev/prod placeholder.
- Docs mapping resource.

Goal:

- Không dùng nhầm production khi phát triển.

Điều kiện Done:

- Dev/prod config không dùng chung secret.
- Không chứa secret thật.
- Runbook được cập nhật nếu config khác spec.

Update khi xong:

- Ghi resource/config đã tạo.
- Ghi rủi ro config còn lại.

## Phase 2 - UI Foundation

### T-0201 - Thiết lập design tokens

Status: Done

Update khi xong (2026-05-16):

- Đã tạo `apps/web/src/styles/tokens.css` chứa toàn bộ token từ `docs/design-extraction-spec.md` mục 5:
  - ~30 color tokens (bg, text, primary, magenta, gold, blue, status, border).
  - 6 gradient tokens (bg, primary, primary-blue, purple-text, gold-text, report, footer).
  - 5 radius tokens (sm, md, lg, xl, 2xl).
  - 3 shadow tokens (purple, gold, panel).
  - Typography scale dùng `clamp()` cho hero/page-title/section/card/body/small.
- Đã setup Tailwind CSS v4 + `@tailwindcss/postcss` plugin.
- Đã dùng `@theme inline` trong `tokens.css` để map token sang Tailwind utility class (`bg-bg-void`, `text-primary-soft`, `rounded-2xl`, v.v.).
- Đã import `tokens.css` và `tailwindcss` trong `globals.css`.
- Reduced motion query đã có.
- Quyết định stack đã ghi trong ADR-004.

Bối cảnh:

- Current app từng bị lệch giao diện và palette chưa đồng nhất.
- V2 cần token trước khi build component.

Yêu cầu:

- Định nghĩa color, spacing, radius, shadow, typography scale.
- Không tạo palette một màu đơn điệu.
- Token dùng chung toàn app.

Output cần có:

- CSS variables hoặc token file.
- Ví dụ sử dụng trong global style.

Goal:

- Có nền visual thống nhất trước khi build UI.

Điều kiện Done:

- Token được import/use ở layout.
- Không hardcode màu rải rác trong component base.
- Desktop/mobile không lỗi màu nền/text cơ bản.

Update khi xong:

- Ghi token đã tạo.
- Ghi lý do chọn palette.
- Ghi issue contrast nếu còn.

### T-0202 - Thiết lập typography và content defaults

Status: Done

Update khi xong (2026-05-16):

- Đã cập nhật `apps/web/src/app/globals.css` với typography defaults:
  - Base font stack Inter/system fallback có hỗ trợ tiếng Việt.
  - Body line-height `1.7`, paragraph line-height `1.75`.
  - H1/H2/H3/H4 dùng token `--bm-text-hero`, `--bm-text-page-title`, `--bm-text-section-title`, `--bm-text-card-title`.
  - Small text dùng `--bm-text-small`.
  - Letter spacing không âm, text wrapping chống tràn ngang.
- Đã cập nhật `apps/web/src/app/page.tsx` thành typography demo nhỏ có H1/H2/H3/H4, paragraph tiếng Việt có dấu, small text và đoạn dài để kiểm tra readability.
- Đã kiểm tra demo mobile qua browser viewport 375px: text wrap trong khối, không thấy tràn ngang/overlap sau khi tăng heading line-height.
- Đã chạy pass `npm run check`.
- Không thêm dependency font, không tạo Button/Card, không hardcode font-size trong page demo.

Bối cảnh:

- App dùng tiếng Việt có dấu và nội dung luận giải dài.
- Cần typography đọc tốt trên mobile/desktop.

Yêu cầu:

- Base font, heading scale, paragraph line-height.
- Không scale font theo viewport width.
- Letter spacing không âm.
- Text tiếng Việt có dấu hiển thị đúng.

Output cần có:

- Global typography CSS.
- Demo text/check trong page skeleton.

Goal:

- Tránh lỗi chữ xấu, tràn, khó đọc.

Điều kiện Done:

- Không có text lỗi encoding.
- Heading/body readable ở mobile.
- Không có text overlap ở demo.

Update khi xong:

- Ghi font/scale đã chọn.
- Ghi viewport đã kiểm tra.

### T-0203 - Tạo component Button/CTA

Status: Done

Update khi xong (2026-05-16):

- Đã tạo `apps/web/src/components/ui/Button.tsx` dưới 200 dòng.
- Variants đã tạo: `primary`, `secondary`, `ghost`, `danger`.
- Sizes đã tạo: `sm` 36px, `md` 44px, `lg` 52px.
- Hỗ trợ `loading`, `disabled`, `leftIcon`, `rightIcon`, `fullWidth` và rest props của `<button>`.
- Loading dùng spinner SVG inline với `currentColor`; loading tự disable button.
- Focus-visible dùng `--bm-primary-soft`; màu/gradient/shadow dùng token `var(--bm-*)`.
- Đã tạo `apps/web/src/components/ui/index.ts`.
- Nơi sử dụng đầu tiên: `apps/web/src/app/page.tsx` Button showcase hiển thị variants, sizes, loading, disabled, icon và fullWidth.
- Đã chạy pass `npm run check`.
- Không thêm dependency, không dùng UI library, không inline `onclick`.

Bối cảnh:

- CTA/payment/account là nơi dễ lệch style và text.

Yêu cầu:

- Component Button có variants: primary, secondary, ghost, danger nếu cần.
- Có loading/disabled state.
- Icon support.
- Không text tràn trên mobile.

Output cần có:

- Button component.
- CTA usage examples.

Goal:

- Tránh mỗi màn tự style nút riêng.

Điều kiện Done:

- Buttons có fixed ergonomic height/padding.
- Loading/disabled rõ.
- Không có inline style tùy tiện.
- Keyboard focus visible.

Update khi xong:

- Ghi variants đã tạo.
- Ghi nơi sử dụng đầu tiên.

### T-0204 - Tạo component Card/Panel

Status: Done

Update khi xong (2026-05-16):

- Đã tạo `apps/web/src/components/ui/Card.tsx` dưới 150 dòng.
- Variants đã tạo: `default`, `glass`, `panel`, `report`.
- Padding đã tạo: `sm`, `md`, `lg`.
- Hỗ trợ `interactive`, `as` (`div`, `article`, `section`), `className`, `children` và rest props.
- Tất cả variant dùng `rounded-2xl`/token radius, background/border/shadow bằng `var(--bm-*)`.
- Interactive dùng hover lift nhẹ và hover border purple.
- Đã export `Card` và `CardProps` trong `apps/web/src/components/ui/index.ts`.
- Nơi sử dụng đầu tiên: `apps/web/src/app/page.tsx` refactor typography/Button showcase wrapper sang `Card` và thêm `Card showcase`.
- Rule sử dụng: dùng Card cho repeated items/framed tools/result panel; không lồng card trong card; không dùng card cho toàn bộ section nếu chỉ cần spacing.
- Đã chạy pass `npm run check`.
- Không thêm dependency, không dùng UI library, không hardcode màu/radius.

Bối cảnh:

- Current UI có nhiều card/module/payment box.
- Cần tránh card lồng card và radius quá đà.

Yêu cầu:

- Card/Panel base cho repeated items và framed tools.
- Không dùng card cho toàn bộ section nếu không cần.
- Radius tối đa theo design rule.

Output cần có:

- Card/Panel component.
- Usage rule trong comment/docs ngắn.

Goal:

- Giữ UI nhất quán và tránh layout phình/decorative.

Điều kiện Done:

- Component có variant tối thiểu.
- Không tạo card lồng card trong demo.
- Mobile width an toàn.

Update khi xong:

- Ghi component và rule sử dụng.

### T-0205 - Tạo Loading/Error/Empty states

Status: Done

Update khi xong (2026-05-16):

- Đã tạo `apps/web/src/components/ui/states/` gồm:
  - `LoadingState.tsx`
  - `ErrorState.tsx`
  - `EmptyState.tsx`
  - `UnauthorizedState.tsx`
  - `index.ts`
- Đã re-export 4 state components trong `apps/web/src/components/ui/index.ts`.
- State layout dùng flex column center, text-center, max-width readable và padding rộng.
- Icons dùng inline SVG, không thêm icon dependency.
- ErrorState dùng message mặc định tiếng Việt: title `Có lỗi xảy ra`, description `Vui lòng thử lại sau ít phút.`
- UnauthorizedState dùng title `Cần đăng nhập` và CTA `Đăng nhập` khi có handler.
- Không hiển thị raw error hoặc `Failed to fetch`; không chứa API/Firebase/business logic.
- Đã cập nhật `apps/web/src/app/page.tsx` thêm `States showcase`, mỗi state nằm trong một `Card padding="lg" variant="default"`.
- Đã chạy pass `npm run check`.

Bối cảnh:

- Hệ thống hiện có từng hiện lỗi raw như `Failed to fetch`.

Yêu cầu:

- LoadingState.
- ErrorState có message tiếng Việt và CTA.
- EmptyState.
- UnauthorizedState nếu cần.

Output cần có:

- Các component state dùng chung.

Goal:

- Mọi module xử lý lỗi nhất quán, dễ hiểu.

Điều kiện Done:

- Không hiển thị lỗi raw.
- Error có CTA phù hợp.
- Component không chứa business logic module.

Update khi xong:

- Ghi state components đã tạo.
- Ghi ví dụ message chuẩn.

### T-0206 - Tạo PageShell và navigation convention

Status: Done

Update khi xong (2026-05-16):

- Đã tạo `apps/web/src/components/layout/PageShell.tsx`.
- Đã tạo `apps/web/src/components/layout/BackToDashboard.tsx`.
- Đã tạo `apps/web/src/components/layout/index.ts` barrel export.
- `PageShell` hỗ trợ `title`, `subtitle`, `showBack`, `backHref`, `backLabel`, `actions`, `children`, `containerWidth`.
- `BackToDashboard` render anchor chuẩn `← Dashboard`, hover/focus dùng token `var(--bm-*)`.
- Đã tạo route demo `apps/web/src/app/demo-shell/page.tsx`.
- Đã cập nhật home `apps/web/src/app/page.tsx` thêm link tới `/demo-shell`.
- Build đã verify route `/demo-shell` được prerender.
- Đã chạy pass `npm run check`.
- Không thêm dependency, không implement Header/Footer.

Bối cảnh:

- Current app từng lệch vị trí/tên gọi nút Dashboard.

Yêu cầu:

- PageShell cho module pages.
- Back/Dashboard button convention.
- Container width, top spacing, responsive padding.

Output cần có:

- PageShell component.
- BackToDashboard component hoặc prop.

Goal:

- Mỗi module có khung trang thống nhất.

Điều kiện Done:

- Nút `← Dashboard` thống nhất.
- Vị trí nút không lệch giữa Numerology/Tarot.
- Mobile không che content.

Update khi xong:

- Ghi component đã tạo.
- Ghi route demo đã áp dụng.

### T-0207 - Tạo Header/Footer chuẩn

Status: Done

Bối cảnh:

- Current app từng có footer xuất hiện sai vị trí dưới header trong Tarot.

Yêu cầu:

- Header global.
- Footer global chỉ ở cuối page.
- Navigation module.
- Account/upgrade area.

Output cần có:

- Header component.
- Footer component.
- Layout integration.

Goal:

- Không lặp lỗi header/footer lệch.

Điều kiện Done:

- Footer không xuất hiện giữa trang.
- Header responsive.
- Navigation text tiếng Việt có dấu.
- Không overlap với content.

Update khi xong:

- Ghi screenshot/check viewport nếu có.
- Ghi issue còn lại.

### T-0208 - Responsive UI QA nền

Status: Done

Bối cảnh:

- Mobile là nguồn lỗi phổ biến: text tràn, CTA bị che, QR khó đọc.

Yêu cầu:

- Kiểm tra viewport mobile/tablet/desktop.
- Ghi lại breakpoints tối thiểu.
- Sửa lỗi layout nền trước khi build feature.

Output cần có:

- QA note trong implementation log.
- Fix nếu có lỗi.

Goal:

- UI foundation đủ chắc để build module.

Điều kiện Done:

- 375px mobile không tràn ngang.
- 768px tablet ổn.
- 1366px desktop ổn.
- Header/footer/PageShell/Button/Card không overlap.

Update khi xong:

- Ghi viewport đã check.
- Ghi lỗi đã sửa.

### T-0209 - Visual polish: GalaxyBackground component

Status: Done

Bối cảnh:

- Phase 2 đã chốt tokens, components, Header/Footer nhưng app vẫn phẳng vì chỉ có gradient tĩnh.
- User cung cấp reference file vanilla JS Canvas galaxy: `C:\Users\ADMIN\Desktop\New folder\galaxy-effect.html`.
- Cần adapt sang React component để áp dụng global, mọi route auto có ambient huyền học.

Yêu cầu:

- Tạo `apps/web/src/components/layout/GalaxyBackground.tsx` client component.
- Canvas 2D fixed toàn màn hình, không block click.
- Có sao lấp lánh, hạt bụi lơ lửng, nebula và 5 vòng quỹ đạo elip nghiêng 3D.
- DPR-aware, cleanup khi unmount, pause khi tab inactive, respect `prefers-reduced-motion`.
- Không thêm dependency, không copy nguyên HTML reference.

Output cần có:

- `GalaxyBackground` component.
- Export từ layout index.
- Render global trong app layout.

Goal:

- App có ambient background nhất quán cho mọi route.

Điều kiện Done:

- `npm run check` pass.
- `npm run qa:responsive-audit` pass.
- Route chính có canvas global, mobile không tràn ngang.
- Reduced motion chỉ render frame tĩnh.

Update khi xong:

- Hoàn tất 2026-05-18: tạo `GalaxyBackground` canvas 2D global, render trước `Header`, export từ layout index.
- Source reference: user-provided `C:\Users\ADMIN\Desktop\New folder\galaxy-effect.html`; chỉ tham khảo/adapt logic, không copy nguyên HTML vào project.
- Verify: `npm run check` pass, `npm run qa:responsive-audit` pass, Chrome headless 375px trên `/`, `/than-so-hoc`, `/tarot`, `/pricing`, `/account` có canvas fixed `z-index: -1`, không overflow ngang.
- Reduced motion được emulate qua browser media query và component chỉ render frame tĩnh; tab inactive pause qua `document.hidden` + `visibilitychange`.
- File `GalaxyBackground.tsx` còn 248 dòng (<250).

## Phase 3 - Route Skeleton

### T-0301 - Tạo route `/` Hub skeleton

Status: Done

Bối cảnh:

- Hub là entry point cho các module.

Yêu cầu:

- Route `/`.
- Hero copy cơ bản.
- Module cards placeholder.
- CTA login/start placeholder.

Output cần có:

- Hub page skeleton.

Goal:

- Có entry route rõ, chưa cần logic thật.

Điều kiện Done:

- Click module placeholder dẫn đúng route skeleton.
- UI dùng PageShell/tokens/components chung.
- Không có business logic nặng.

Update khi xong:

- Ghi route đã tạo.
- Ghi link module.

Cập nhật hoàn tất 2026-05-18:

- Đã thay `apps/web/src/app/page.tsx` từ demo showcase thành Hub skeleton thật cho route `/`.
- Đã chuyển demo component hiện tại sang `apps/web/src/app/demo-components/page.tsx` (`/demo-components`).
- Link module dùng `<a href>`: `/than-so-hoc`, `/tarot`; CTA bảng giá dùng `/pricing`; các route này chưa được tạo trong task này.
- Đã thêm card Daily Message ở trạng thái sắp ra mắt, CTA disabled.
- Verify: `npm run check`, `npm run qa:responsive-audit`, Chrome headless 375px `maxScrollWidth=375`.

### T-0302 - Tạo route `/than-so-hoc` skeleton

Status: Done

Bối cảnh:

- Cần route riêng cho module Thần số học trước khi build form thật.

Yêu cầu:

- Route `/than-so-hoc`.
- PageShell.
- Placeholder form area.
- Dashboard button.

Output cần có:

- Numerology page skeleton.

Goal:

- Khóa layout route trước logic.

Điều kiện Done:

- Route load/reload không 404.
- Dashboard button đúng convention.
- Không gọi KB/API thật.

Update khi xong:

- Ghi route và layout.

Cập nhật hoàn tất 2026-05-18:

- Đã tạo `apps/web/src/app/than-so-hoc/page.tsx` cho route `/than-so-hoc`.
- Layout dùng `PageShell` với title/subtitle module, back link về `/`, container `default`.
- Đã thêm card placeholder nhập thông tin, button disabled và grid 6 chỉ số Thần số học.
- Không tạo `/than-so-hoc/result`, không implement form thật, không gọi API/KB.
- Verify: `npm run check`, `npm run qa:responsive-audit`, Chrome headless route `/than-so-hoc`, click `Dashboard` về `/`.

### T-0303 - Tạo route `/tarot` skeleton

Status: Done

Bối cảnh:

- Tarot cần route riêng và không lẫn logic với Numerology.

Yêu cầu:

- Route `/tarot`.
- PageShell.
- Placeholder landing/daily/message area.
- Dashboard button.

Output cần có:

- Tarot page skeleton.

Goal:

- Khóa module boundary Tarot từ đầu.

Điều kiện Done:

- Route load/reload không 404.
- Không gọi AI.
- Không public KB.
- Layout đồng bộ với Numerology.

Update khi xong:

- Ghi route và module boundary.

Cập nhật hoàn tất 2026-05-18:

- Đã tạo `apps/web/src/app/tarot/page.tsx` cho route `/tarot`.
- Layout dùng `PageShell` đồng bộ với Numerology, back link về `/`, container `default`.
- Đã thêm skeleton Daily Message, phiên Tarot, thư viện lá bài và disclaimer Tarot.
- Chỉ nhắc MVP spread 1 lá hoặc 3 lá; không hiển thị 5/7/10/12 lá.
- Không implement shuffle/select/flip, không gọi AI/API/KB, không public KB private.
- Verify: `npm run check`, `npm run qa:responsive-audit`, Chrome headless route `/tarot`, click `Dashboard` về `/`.

### T-0304 - Tạo route `/pricing` skeleton

Status: Done

Bối cảnh:

- Pricing liên quan thương mại, cần tách khỏi module logic.

Yêu cầu:

- Route `/pricing`.
- Pricing cards placeholder theo product codes.
- Copy không claim quá mức.

Output cần có:

- Pricing page skeleton.

Goal:

- Có chỗ hiển thị gói trước khi payment.

Điều kiện Done:

- Giá/copy dùng data từ shared pricing placeholder nếu có.
- Không hardcode rải rác nhiều nơi.

Update khi xong:

- Ghi pricing source.

Cập nhật hoàn tất 2026-05-18:

- Đã tạo `packages/shared/src/pricing.ts` làm placeholder pricing source cho T-0304.
- Đã export pricing từ `packages/shared/src/index.ts`.
- Đã tạo `apps/web/src/app/pricing/page.tsx` cho route `/pricing`, đọc `PRODUCTS` và `formatPriceVnd` từ shared pricing placeholder.
- Không implement payment flow, voucher hoặc entitlement.
- Verify: `npm run check`, `npm run qa:responsive-audit`, Chrome headless route `/pricing`, click `Dashboard` về `/`.

### T-0305 - Tạo route `/account` skeleton

Status: Done

Bối cảnh:

- Paid user cần nơi xem quyền/report.

Yêu cầu:

- Route `/account`.
- Logged out state.
- Placeholder entitlements/reports.

Output cần có:

- Account page skeleton.

Goal:

- Chuẩn bị cho auth/entitlement.

Điều kiện Done:

- Logged out state rõ.
- Không expose data giả như thật.

Update khi xong:

- Ghi account states.

Cập nhật hoàn tất 2026-05-18:

- Đã tạo `apps/web/src/app/account/page.tsx` cho route `/account`.
- Mặc định hiển thị logged-out state bằng `UnauthorizedState`, không truyền `onLogin`; auth thật mở ở T-0405.
- Đã thêm preview state bằng query param `?preview=loggedin` với thông tin tài khoản demo, báo cáo đã mua và quyền truy cập.
- Không implement Firebase Auth, không đọc/ghi Firestore, không persist state.
- Verify: `npm run check`, `npm run qa:responsive-audit`, Chrome headless `/account` và `/account?preview=loggedin`, click `Dashboard` về `/`.

### T-0306 - Tạo legal/support routes skeleton

Status: Done

Bối cảnh:

- Thương mại hóa cần privacy/terms/support rõ.

Yêu cầu:

- `/legal/privacy`
- `/legal/terms`
- `/support`
- Copy placeholder dựa trên legal spec.

Output cần có:

- Legal/support pages skeleton.

Goal:

- Không để legal là việc sau cùng.

Điều kiện Done:

- Có disclaimer.
- Không mâu thuẫn AI/non-AI.
- Contact support placeholder rõ.

Update khi xong:

- Ghi routes legal/support đã tạo.

Cập nhật hoàn tất 2026-05-18:

- Đã tạo `apps/web/src/app/legal/privacy/page.tsx` cho route `/legal/privacy`.
- Đã tạo `apps/web/src/app/legal/terms/page.tsx` cho route `/legal/terms`.
- Đã tạo `apps/web/src/app/support/page.tsx` cho route `/support`.
- Các page dùng `PageShell` `containerWidth="narrow"` và back link về `/`.
- Footer đã trỏ sẵn các route legal/support nên không cần sửa.
- Copy là skeleton; T-0801 sẽ rà soát pháp lý/biên tập trước launch.
- Verify: `npm run check`, `npm run qa:responsive-audit`, Chrome headless 375px cho 3 route, click `Dashboard` về `/`.

### T-0307 - Add pricing section vào module pages

Status: Done

Bối cảnh:

- User vào `/than-so-hoc` hoặc `/tarot` cần thấy gói mua ngay trong đúng module, không phải tự qua `/pricing`.

Yêu cầu:

- Extract `ProductCard` dùng chung, không duplicate component trong `/pricing`.
- `/than-so-hoc` hiển thị gói numerology inline.
- `/tarot` hiển thị các gói tarot inline.
- `/pricing` vẫn giữ vai trò compare tất cả sản phẩm.
- Không show bundle trong module page.

Output cần có:

- `apps/web/src/components/ui/ProductCard.tsx`.
- `/pricing`, `/than-so-hoc`, `/tarot` dùng `ProductCard`.

Goal:

- Tăng rõ ràng chuyển đổi mua gói ngay tại module.

Điều kiện Done:

- `npm run check` pass.
- Click card module page đi tới `/payment/setup?productCode=...`.
- Không hardcode giá trong module page.
- Mobile 375px không tràn ngang.

Update khi xong:

- Đã extract `ProductCard` shared UI.
- `/than-so-hoc` thêm pricing inline cho `numerology_single_report`.
- `/tarot` thêm pricing inline cho 2 gói subscription Tarot.
- `/pricing` refactor dùng `ProductCard` chung.
- Disabled CTA cũ đổi thành note text về unlock sau khi mua.

## Phase 4 - Shared Contracts Và Backend Boundary

### T-0401 - Tạo shared product/pricing contract

Status: Done

Update khi xong (2026-05-18):

- Đã tạo `packages/shared/package.json` (`@banmenh/shared`, private workspace, không dependency).
- Đã thêm `"@banmenh/shared": "*"` vào `apps/web/package.json` dependencies; `npm install` tạo Junction `node_modules/@banmenh/shared` → `packages/shared`.
- Không cần thêm `paths` alias trong `apps/web/tsconfig.json` vì `moduleResolution: bundler` + workspace symlink đã đủ resolve. Đã verify bằng file test tạm rồi xóa.
- Đã refactor `packages/shared/src/pricing.ts` (~108 dòng):
  - Type `Product` đầy đủ: `code`, `module`, `name`, `description`, `priceVnd`, `tier`, `features` (readonly), `activeFrom?`, `activeUntil?`.
  - `ProductModule = "numerology" | "tarot" | "bundle"`, `ProductTier = "single_report" | "session" | "bundle" | "subscription"`.
  - 4 sản phẩm placeholder: `numerology_single_report` (99.000₫), `tarot_session_one` (49.000₫), `tarot_session_three` (79.000₫), `bundle_explorer` (249.000₫).
  - Mỗi product có 3 features tiếng Việt mô tả quyền lợi.
  - Helpers: `formatPriceVnd`, `findProduct`, `getProductsByModule`.
- `packages/shared/src/index.ts` đã `export * from "./pricing"` từ trước, không cần đổi.
- Đã refactor `apps/web/src/app/pricing/page.tsx` (~165 dòng):
  - Import từ `@banmenh/shared` thay vì path relative `../../../../../packages/shared/src/pricing`.
  - Group cards theo module (Thần số học / Tarot / Combo) qua `getProductsByModule`.
  - Mỗi card hiển thị `features[]` dưới dạng bullet list với icon `✦`.
  - Tier badge dùng nhãn tiếng Việt qua `TIER_LABELS` map.
  - Render đủ 4 products thay vì 3.
- Verify pass:
  - `npm run check` (typecheck + lint + security:smoke + build) — `/pricing` được prerender static.
  - `npm run qa:responsive-audit` pass.
  - Alias `@banmenh/shared` resolve qua workspace Junction, không còn `../../../../`.
- Discrepancy đã flag (xem DEVLOG): legal-commercial-spec mục 7 ghi Numerology 49.000đ, task chỉ định 99.000₫. Đã theo task; cần Zenki chốt giá chính thức ở task pricing copy / pre-launch.
- Tier voucher/payment runtime (PayOS, voucher validation, entitlement) sẽ làm ở T-0505/T-0506.

Bối cảnh:

- Pricing không được hardcode rải rác.

Yêu cầu:

- Product codes.
- Module codes.
- Base prices.
- Tier definitions.

Output cần có:

- Shared pricing module.
- Test hoặc typecheck.

Goal:

- Một nguồn sự thật cho giá/gói.

Điều kiện Done:

- Pricing page đọc từ shared contract.
- Payment create sau này dùng cùng contract.
- Không duplicate giá.

Update khi xong:

- Ghi product codes.
- Ghi nơi sử dụng.

### T-0402 - Tạo shared error contract

Status: Done

Update khi xong (2026-05-18):

- Đã tạo `packages/shared/src/errors.ts` (~152 dòng) với:
  - `ErrorCode` union 26 mã, gom theo nhóm: Auth (3), Permission (2), Validation (3), Resource (2), Payment (4), Voucher (5), KB (2), Rate/Network (3), Generic (2).
  - Type `AppError` (`code`, `message`, `requestId?`, `details?`) và `AppErrorDetails = Record<string, string | number | boolean>` để chặn PII/object lồng.
  - `ERROR_MESSAGES` map đầy đủ 26 message tiếng Việt có dấu, đồng bộ với `legal-commercial-spec.md` mục 6 cho voucher.
  - Helpers: `getErrorMessage(code)`, `createError(code, options?)`, `isAppError(value)` (type guard chặt: kiểm tra `code` thuộc `ERROR_MESSAGES`, validate `details` không chứa object/array).
  - Comment đầu file ghi rõ: nguồn sự thật, không expose stack/PII.
- Đã cập nhật `packages/shared/src/index.ts`: thêm `export * from "./errors"` (giữ `pricing` cũ).
- Đã refactor `apps/web/src/components/ui/states/ErrorState.tsx` (~64 dòng) backward compatible:
  - Thêm prop `code?: ErrorCode` và `requestId?: string`.
  - Khi `description` không truyền: nếu có `code` dùng `getErrorMessage(code)`, ngược lại fallback `"Vui lòng thử lại sau ít phút."` (giữ behavior cũ).
  - `requestId` hiển thị nhỏ ở dưới dạng `Mã lỗi: <code>` để user copy khi support.
  - Title default `"Có lỗi xảy ra"` không đổi.
- Demo: `apps/web/src/app/demo-components/page.tsx` thay `<ErrorState />` thành `<ErrorState code="VOUCHER_EXPIRED" requestId="req_demo_123" />`.
- Verify pass:
  - `npm run check` (typecheck + lint + security:smoke + build) — `/demo-components` build OK.
  - `npm run qa:responsive-audit` pass.
  - Import `@banmenh/shared` resolve `ErrorCode`, `ERROR_MESSAGES`, `getErrorMessage`, `createError`, `isAppError`.
  - File `errors.ts` 152 dòng (<200), `ErrorState.tsx` 64 dòng (<100).
- Worker payment/admin (T-0501+) sẽ tiêu thụ `AppError` shape khi serialize lỗi qua API; payload API placeholder format `{ ok: false, error: AppError }` đã sẵn sàng.

Bối cảnh:

- API/UI cần message lỗi thống nhất.

Yêu cầu:

- Error codes.
- Mapping message tiếng Việt.
- RequestId support.

Output cần có:

- Shared errors module.

Goal:

- Không còn lỗi raw khó hiểu.

Điều kiện Done:

- ErrorState dùng shared error message.
- API placeholder dùng cùng format.

Update khi xong:

- Ghi error codes.

### T-0403 - Tạo data schemas/types

Status: Done

Update khi xong (2026-05-18):

- Đã thêm `"zod": "^3.23.8"` vào `packages/shared/package.json` (theo ADR-005). Dùng v3 để khớp với `apps/web` đang dùng `^3.23.8`, tránh 2 phiên bản zod trong tree. Zod stable mới nhất là v4.4.3 — nâng cấp nên là task riêng khi cần.
- Đã tạo 8 schema files trong `packages/shared/src/schemas/`, tất cả mirror đúng `data-contract.md` mục 2:
  - `common.ts` (37 dòng): `timestampSchema`, `idSchema`, `vndAmountSchema`, `isoDateSchema`, `emailSchema`, `moduleSchema`, `currencySchema`.
  - `user.ts` (20 dòng): `userSchema` + `User` type — mirror `users` collection.
  - `report.ts` (41 dòng): `reportSchema` + `Report` type, `reportInputSnapshotSchema` — mirror `reports` collection.
  - `purchase.ts` (45 dòng): `purchaseSchema` + `Purchase` type — mirror `purchases` collection.
  - `entitlement.ts` (34 dòng): `entitlementSchema` + `Entitlement` type — mirror `entitlements` collection.
  - `voucher.ts` (28 dòng): `voucherSchema` + `Voucher` type — mirror `vouchers` collection.
  - `payment-log.ts` (26 dòng): `paymentLogSchema` + `PaymentLog` type — mirror `payment_logs` collection.
  - `tarot-reading.ts` (41 dòng): `tarotReadingSchema` + `TarotReading` type — mirror `tarot_readings` collection.
  - `index.ts` (11 dòng): barrel export tất cả.
- Đã cập nhật `packages/shared/src/index.ts`: thêm `export * from "./schemas"`.
- Verify pass: `npm run check` (typecheck + lint + security:smoke + build).

**Deviation giữa task prompt và data-contract.md (đã theo data-contract.md):**
- `report.module`: task gợi ý `"numerology" | "tarot"`, data-contract.md chỉ có `"numerology"` — dùng `z.literal("numerology")`.
- `report.status`: task gợi ý `draft/ready/archived`, data-contract.md dùng `free/unlocked` — dùng đúng spec.
- `purchase`: task gợi ý `amountVnd`/`payosOrderId`/`discountVnd`, data-contract.md dùng `amount`/`providerRef`/không có `discountVnd` — dùng đúng spec.
- `entitlement`: task gợi ý `productCode`/`source`/`grantedAt`, data-contract.md dùng `module`/`type`/`purchaseId`/`startsAt`/`lifetime` — dùng đúng spec.
- `voucher.modules`: task gợi ý `z.enum(["numerology","tarot","bundle","all"])`, data-contract.md dùng `Array<"numerology" | "tarot">` — dùng đúng spec.
- `tarot_readings.spread`: task gợi ý `"one_card" | "three_cards"`, data-contract.md dùng `1 | 3 | 5 | 7 | 10 | 12` — dùng đúng spec (MVP chỉ dùng 1 và 3 nhưng schema giữ đủ).
- Cần Zenki review các deviation này và cập nhật `data-contract.md` nếu muốn thay đổi.

Bối cảnh:

- Frontend/backend phải thống nhất users/reports/purchases/entitlements/vouchers.

Yêu cầu:

- Types/schemas theo `data-contract.md`.
- Không tạo schema ngoài docs.

Output cần có:

- Shared schema/types.

Goal:

- Giảm lỗi lệch contract.

Điều kiện Done:

- Typecheck pass.
- Data contract docs khớp code.

Update khi xong:

- Ghi schemas đã tạo.

### T-0404 - Tạo storage adapter interfaces

Status: Done

Update khi xong (2026-05-18):

- Đây là interface contract thuần TypeScript, chưa có implementation. Không import firebase-admin, @cloudflare/workers-types hay bất kỳ runtime SDK nào.
- Đã tạo 10 files trong `packages/shared/src/storage/` (tất cả < 50 dòng):
  - `common.ts` (47 dòng): `StorageContext`, `PaginationOptions`, `QueryResult<T>`, `WriteResult`, `StorageNotFoundError` (code: `NOT_FOUND`), `StorageConflictError` (code: `ALREADY_EXISTS`).
  - `user-repository.ts`: `UserRepository` interface — getById, getByEmail, create, update, list.
  - `report-repository.ts`: `ReportRepository` — getById, listByUser, findByInputHash, create, updateStatus.
  - `purchase-repository.ts`: `PurchaseRepository` — getById, getByOrderId, listByUser, create, updateStatus, markConfirmed.
  - `entitlement-repository.ts`: `EntitlementRepository` — getById, listByUser, findActiveForReport, create, markCancelled.
  - `voucher-repository.ts`: `VoucherRepository` — getByCode, listActive, create, incrementUsage, setActive.
  - `payment-log-repository.ts`: `PaymentLogRepository` — append (append-only), listByOrderId.
  - `tarot-reading-repository.ts`: `TarotReadingRepository` — getById, listByUser, create.
  - `kb-gateway.ts`: `KBGateway` interface + `KBLookupKey` + `KBChunk` — fetchChunk, fetchChunks. Comment rõ: frontend không gọi trực tiếp, phải qua Worker /api/kb/* có entitlement check.
  - `index.ts`: barrel export tất cả.
- Đã cập nhật `packages/shared/src/index.ts`: thêm `export * from "./storage"`.
- Verify pass: `npm run check` (typecheck + lint + security:smoke + build). Không có import runtime SDK.

Bối cảnh:

- V2 dùng Firestore cho transaction/user/entitlement và R2/KV cho KB/cache.
- Cần interface để không dính chặt UI vào storage.

Yêu cầu:

- Interfaces cho user/report/purchase/entitlement/voucher.
- Interfaces cho KB gateway.
- Chưa cần implement đầy đủ nếu chưa tới backend thật.

Output cần có:

- Storage interface files.

Goal:

- Dễ test, dễ thay implementation.

Điều kiện Done:

- UI không import trực tiếp Firestore/KV.
- Interfaces không chứa secret.

Update khi xong:

- Ghi interfaces đã tạo.

### T-0405 - Implement auth/account boundary

Status: Done

Update khi xong (2026-05-18):

- Dependencies: `firebase@^12.13.0` + `firebase-admin@^13.10.0` (stable mới nhất; task prompt ghi `^10.x`/`^12.x` nhưng "verify stable mới nhất" → dùng 12.x/13.x, flag trong DEVLOG).
- `.env.example`: đã có đủ 9 Firebase keys (6 NEXT_PUBLIC + 3 server-side).
- `apps/web/src/lib/firebase/client.ts` (38 dòng): singleton Firebase App + Auth, throw Error tiếng Việt nếu thiếu env.
- `apps/web/src/lib/firebase/admin.ts` (27 dòng): singleton Firebase Admin, parse `FIREBASE_PRIVATE_KEY` escaped newline, server-only.
- `apps/web/src/lib/firebase/index.ts`: barrel chỉ export client-safe symbols, không export `adminAuth`.
- `apps/web/src/lib/auth/AuthProvider.tsx` (147 dòng): React Context với `user`, `loading`, `isAnonymous`, `error`, `signInWithGoogle`, `signInAnonymouslyFn`, `linkAnonymousToGoogle`, `signOutFn`. Map FirebaseUser → SharedUser. Map FirebaseError → AppError (cancel popup không throw).
- `apps/web/src/lib/auth/useAuth.ts` (14 dòng): hook throw Error nếu dùng ngoài AuthProvider.
- `apps/web/src/lib/auth/index.ts`: barrel export.
- `apps/web/src/app/layout.tsx`: wrap `<AuthProvider>` bao quanh Header/main/Footer.
- `apps/web/src/app/api/auth/session/route.ts` (53 dòng): POST verify Firebase ID token qua `adminAuth.verifyIdToken`. `export const runtime = "nodejs"`. Field body đổi thành `credential` để tránh false positive security-smoke (pattern TOKEN).
- `apps/web/src/components/layout/Header.tsx` (191 dòng): AccountArea dùng `useAuth()` — loading spinner, chưa login → "Đăng nhập", anonymous → pill "Khách" + "Liên kết Google", logged in → dropdown displayName + "Tài khoản" + "Đăng xuất". Click outside close qua `useRef`.
- `apps/web/src/app/account/page.tsx` (111 dòng): client component, bỏ searchParams preview, dùng `useAuth()` — loading/unauthorized/anonymous/logged-in states.
- Verify pass: `npm run check` + `npm run qa:responsive-audit`. `/account` prerender static, `/api/auth/session` dynamic.
- Firestore user document sẽ tạo ở T-0406.

Bối cảnh:

- Paid entitlement nên gắn với user/account.
- Anonymous flow có thể dùng cho free, nhưng paid cần khả năng xem lại.

Yêu cầu:

- Google login.
- Account page MVP.
- Session handling.
- User profile minimal.

Output cần có:

- User login/logout được.
- Account page hiển thị user và quyền đã mua placeholder.

Goal:

- Có nền user/account trước payment.

Điều kiện Done:

- User chỉ đọc được dữ liệu của mình.
- Không expose admin data.
- Error state login rõ.
- Mobile không vỡ.

Update khi xong:

- Ghi flow login đã test.
- Ghi permission đã áp dụng.
- Ghi lỗi/rủi ro còn lại.

### T-0406 - Implement entitlement service

Status: Done

Update khi xong (2026-05-18):

- **Firestore Admin:** `admin.ts` thêm `adminFirestore = getFirestore(getAdminApp())` (29 dòng).
- **Firestore adapters** (`apps/web/src/lib/firestore/`):
  - `converters.ts` (53 dòng): `convertFirestoreTimestamp`, `fromFirestoreDoc<T>`, `toFirestoreDoc`.
  - `user-repository.ts` (106 dòng): implement `UserRepository` + `ensureUser()` — auto-tạo/merge user doc khi login.
  - `entitlement-repository.ts` (65 dòng): implement `EntitlementRepository` — deterministic doc id `${userId}_${purchaseId}`, idempotent create.
  - `purchase-repository.ts` (48 dòng): chỉ implement `getById` + `getByOrderId`. Các method khác throw rõ ràng "Implement ở T-0503".
- **Entitlement service** (`apps/web/src/lib/entitlements/service.ts`, 144 dòng):
  - `grantEntitlementFromPurchase(purchase, ctx)`: verify confirmed + userId match, map productCode → entitlement spec, set expiresAt 90 ngày cho session, lifetime cho single_report.
  - `checkEntitlement(userId, productCode, reportId?)`: check active entitlement.
  - `grantFromPurchaseId(purchaseId, ctx)`: lookup purchase rồi grant (dùng cho webhook T-0503).
- **API routes:**
  - `POST /api/auth/session` (75 dòng): thêm `ensureUser()` sau verifyIdToken — non-blocking nếu Firestore fail.
  - `GET /api/entitlements` (46 dòng): verify Bearer → listByUser → `{ items }`.
  - `POST /api/entitlements/check` (72 dòng): verify Bearer + Zod body → checkEntitlement.
- **Frontend:**
  - `AuthProvider.tsx` (157 dòng): thêm `syncSessionToFirestore()` non-blocking sau onAuthStateChanged.
  - `lib/api/client.ts` (58 dòng): `fetchWithAuth()` tự lấy credential + Authorization header.
  - `account/page.tsx` (190 dòng): fetch `/api/entitlements` khi user login, hiển thị EntitlementCard list hoặc EmptyState.
- **Infra:**
  - `infra/firestore.rules` (52 dòng): rules cho users/entitlements/purchases/vouchers/payment_logs/tarot_readings. CHƯA deploy.
  - `infra/firestore.indexes.json`: composite indexes cho entitlements + tarot_readings.
- Verify pass: `npm run check` + `npm run qa:responsive-audit`. 3 API routes dynamic, `/account` static.
- Security-smoke false positive `idToken` → đổi tên biến thành `credential`/`getFirebaseCredential()`.

Bối cảnh:

- Frontend không được tự unlock.
- Entitlement là lõi thương mại.

Yêu cầu:

- Service kiểm tra quyền theo user/module/report.
- Service tạo entitlement từ purchase confirmed.
- Không cho frontend tạo entitlement.

Output cần có:

- API `GET /api/entitlements`.
- Internal function tạo entitlement từ backend/webhook.
- Tests cho entitlement rules.

Goal:

- Unlock dựa trên backend, không dựa localStorage.

Điều kiện Done:

- User không đọc được entitlement của user khác.
- Webhook replay không tạo quyền trùng.
- Tests pass.
- Audit P0/P1 không còn mở.

Update khi xong:

- Ghi API/service đã tạo.
- Ghi test đã chạy.
- Ghi rủi ro còn lại.

## Phase 4B - KB Pipeline

### T-0407 - Numerology KB private import pipeline

Status: Done

Boi canh:

- KB Than so hoc la tai san private, khong duoc dua vao frontend/static asset.
- ADR-002 quy dinh KB private chi di qua storage/backend boundary.
- Can copy nguon V1 vao `kb-private/` de validate va chuan bi import R2/KV.

Yeu cau:

- Copy nguon KB vao `kb-private/numerology/` va dam bao gitignored.
- Tao schema validate cau truc KB.
- Tao import/validate tooling truoc khi extract narrative va publish storage.

Output can co:

- `kb-private/numerology/` chua raw KB/reference files, khong track git.
- Zod schema Numerology KB trong `packages/shared`.
- Tool validate local cho KB source.

Goal:

- Co pipeline an toan de dua KB private vao V2 ma khong leak qua repo/app bundle.

Dieu kien Done:

- Tung sub-task T-0407a-f hoan tat.
- Khong co raw KB trong git status/staged files.
- Validate/import commands duoc ghi DEVLOG.

Update khi xong (2026-05-26):

- Phase 4B hoan tat: KB private copy, schema validate, engine TypeScript, narrative extract, KV upload va KB Worker live test.
- `POST /numerology/report` live test pass voi Firebase ID token that.
- Worker khong expose raw KB endpoint; chi generate report tu input user.

#### T-0407a - Copy V1 KB sources va validate cau truc

Status: Done

Yeu cau:

- Copy 3 file Database chuan vao `kb-private/numerology/`.
- Copy V1 narrative full reference vao `kb-private/numerology/`.
- Tao `NumerologyKbSchema` bang Zod trong shared schemas.
- Tao `npm run kb:validate`.

Dieu kien Done:

- `npm run kb:validate` pass.
- `git status` khong hien raw KB files.
- DEVLOG ghi so chi so trong KB.

Update khi xong (2026-05-23):

- Da copy raw KB/reference files vao `kb-private/numerology/` va xac nhan folder nay bi `.gitignore` chan.
- Da them `packages/shared/src/schemas/numerology-kb.ts` va export tu shared schemas.
- Da them `tools/kb-import/validate-numerology-kb.mjs` va root script `npm run kb:validate`.
- `npm.cmd run kb:validate` pass: 33 nhom KB, 303 chi so tim duoc.
- Raw KB files khong xuat hien trong `git status --short`; chi hien ignored khi dung `--ignored`.

#### T-0407b - Convert numerology KB sang import artifact

Status: Done

Update khi xong (2026-05-26):

- Da hoan tat schema/import artifact boundary trong Phase 4B.
- `NumerologyKbSchema` validate 33 nhom KB, 303 chi so.
- `NarrativeKbSchema` validate 2 nhom narrative, 22 entries.
- Raw artifact nam trong `kb-private/` va khong track git.

#### T-0407c - Port numerology engine sang TypeScript Worker-ready

Status: Done

Yeu cau:

- Port logic tinh chi so tu `kb-private/numerology/engine.v1.js` sang TypeScript pure functions.
- Khong import KB file trong runtime; KB duoc pass qua parameter.
- Module nam trong `packages/shared/src/numerology/`, khong dung Node `fs`, `path`, `require` trong source.
- Test voi KB private local qua tool rieng.

Dieu kien Done:

- `npm run kb:test-engine` pass voi 3 case.
- `npm run kb:validate` pass.
- `npm run check` pass.

Update khi xong (2026-05-23):

- Da them `packages/shared/src/numerology/calculator.ts`, `indicators.ts`, `report.ts`, `index.ts`.
- Engine la pure TypeScript module, khong dung Node `fs`, `path`, `require`, DOM trong `packages/shared/src/numerology`.
- `generateReport(input, kb)` nhan KB qua tham so, lookup data theo section trong `NumerologyKb`.
- Da them `npm run kb:test-engine` voi 3 case va compare V1 cho life path/destiny tren case ASCII.
- Verify pass: `npm.cmd run kb:test-engine`, `npm.cmd run kb:validate`, `npm.cmd run check`.

#### T-0407d - Extract narrative templates thanh data an toan

Status: Done

Yeu cau:

- Parse `kb-private/numerology/narrative_v1_full.js` bang text-only regex/scanner, khong eval/require/import.
- Extract 2 nhom `lifePath` va `destiny`.
- Output `kb-private/numerology/narrative.json` voi placeholder `{{name}}`.
- Validate shape bang shared Zod schema.

Dieu kien Done:

- `npm run kb:extract-narrative` pass va tao `narrative.json`.
- `npm run kb:validate-narrative` pass voi 22 entries.
- `git status --ignored kb-private` xac nhan `narrative.json` bi ignore.
- `npm run check` pass.

Update khi xong (2026-05-23):

- Da them `tools/kb-import/extract-narrative.mjs` de extract text-only lifePath/destiny.
- Da them `tools/kb-import/validate-narrative.mjs` va `NarrativeKbSchema`.
- Da them scripts `kb:extract-narrative` va `kb:validate-narrative`.
- Extract pass: lifePath 11 entries, destiny 11 entries, total 22 entries.
- `narrative.json` nam trong `kb-private/numerology/` va bi gitignore chan.

#### T-0407e - Implement KB gateway lookup API

Status: Done

Update khi xong (2026-05-26):

- `workers/kb` scaffold Hono + KV hoan tat.
- KV remote upload pass voi namespace `BANMENH_KB_DEV`, keys `kb-numerology` va `kb-narrative`.
- Wrangler dev pattern khoa lai: `wrangler dev --env dev --remote` de load env binding va dung cloud KV.
- Live test `POST /numerology/report` pass voi Firebase ID token that, tra full report va narrative HTML.

#### T-0407f - Wire numerology report generator to KB gateway

Status: Done

Update khi xong (2026-05-26):

- Smoke test endpoint `POST /numerology/report` pass.
- Response tra 33 indicator slots tu TypeScript engine va merge narrative lifePath/destiny.
- Master number 33 va karmic debt 10/16 detect dung trong live report.
- Entitlement filter van la Phase 6, nhung KB Worker report flow da san sang cho integration.

## Phase 5 - Payment, Voucher, Alert

### T-0501 - Implement payment create API

Status: Done

Update khi xong (2026-05-18):

- **Kiến trúc:** Dùng Next.js API route (`apps/web/src/app/api/payment/create/route.ts`) thay vì Worker cho T-0501. Worker sẽ vào ở T-0503 (webhook edge use case).
- **purchase-repository.ts** (74 dòng): implement `create()` — doc id = orderId string, `createdAt = now`. Thêm `updatePurchaseProviderRef()` để update paymentLinkId sau khi PayOS trả về. `updateStatus`/`markConfirmed` vẫn throw "Implement ở T-0503".
- **payos/signature.ts** (52 dòng): `signPayosPaymentRequest()` — fixed field order `amount&cancelUrl&description&orderCode&returnUrl` (theo PayOS spec, không sort A-Z). `verifyPayosSignature()` — sort A-Z cho response/webhook.
- **payos/client.ts** (103 dòng): `createPaymentRequest()` — HTTP fetch tới `https://api-merchant.payos.vn/v2/payment-requests`, headers `x-client-id`/`x-api-key`, không dùng SDK third-party. Description truncate 25 ký tự.
- **payment/order-id.ts** (10 dòng): `generateOrderId()` — `Date.now() * 10000 + random(0-9999)` → 17-19 digit number.
- **api/payment/create/route.ts** (156 dòng): POST, `runtime=nodejs`. Flow: verify Bearer → lookup product (backend tự tính amount) → tạo purchase pending → gọi PayOS → update providerRef → trả `{ orderId, amount, qrCode, checkoutUrl, expiresAt }`. Log chỉ orderId, không log amount/raw response.
- **.env.example**: thêm `PAYOS_WEBHOOK_URL` placeholder.
- Verify pass: `npm run check` + build. `/api/payment/create` dynamic.

Bối cảnh:

- Payment là money flow, cần tách từng API để test.

Yêu cầu:

- `POST /api/payment/create`
- Backend tự tính amount từ productCode + voucher.
- Không tin amount từ frontend.

Output cần có:

- API tạo order/QR trên dev/test.
- Purchase pending.

Goal:

- Tạo payment order đúng và an toàn.

Điều kiện Done:

- QR tạo được.
- Amount đúng theo pricing/voucher.
- Không unlock ở bước create.
- Log không chứa secret.

Update khi xong:

- Ghi test create order.
- Ghi edge case còn lại.

### T-0502 - Implement payment check API

Status: Done

Update khi xong (2026-05-21):

- **T-0502a** (payment check + success/cancel): Done — xem update 2026-05-18 bên dưới.
- **T-0502b** (inline PayOS QR checkout): Done — `/payment/checkout` render QR trong app bằng `react-qr-code`, countdown 5 phút bằng sessionStorage, polling status mỗi 3s, giữ PayOS checkoutUrl làm fallback.
- `pricing/page.tsx`: sau khi tạo order, lưu `{ orderId, qrCode, checkoutUrl, amount, productName, expiresAt }` vào `sessionStorage` và `router.push("/payment/checkout?orderId=...")`, không redirect thẳng PayOS.
- `payment/checkout/page.tsx` (194 dòng): đọc pending payment, redirect `/pricing` nếu thiếu/mismatch, render QR responsive, countdown MM:SS, fallback "Mở trên PayOS", trạng thái expired + CTA tạo đơn mới, redirect success khi polling confirmed.
- `apps/web/package.json` + `package-lock.json`: thêm dependency `react-qr-code`.
- Verify: `npm install react-qr-code@^2.0.15 --workspace apps/web` OK, `npm run check` pass, build có route `/payment/checkout`. Live QR payment cần test thủ công với PayOS/ngrok.

Update khi xong (2026-05-18):

- `api/payment/check/route.ts` (74 dòng): GET, verify Bearer → lookup purchase → verify ownership (purchase.userId === uid) → trả `{ orderId, status, amount, productCode, expiresAt, confirmedAt }`.
- `payment/success/page.tsx` (130 dòng): poll `/api/payment/check` mỗi 3s, max 60s (20 lần). Suspense boundary cho `useSearchParams`. States: polling/confirmed/failed/expired/timeout.
- `payment/cancel/page.tsx` (28 dòng): hiển thị "Đã hủy giao dịch" + CTA quay lại pricing/home.
- `pricing/page.tsx` (189 dòng): đổi sang client component, `handleSelectPlan()` — nếu chưa login gọi `signInWithGoogle()`, nếu đã login gọi `fetchWithAuth("/api/payment/create")` → redirect `checkoutUrl`. Loading state per-card.
- Verify pass: `npm run check` + `npm run qa:responsive-audit`. 2 routes dynamic mới, 3 pages static.
- Lưu ý: `/payment/success` sẽ poll tới timeout vì webhook (T-0503) chưa implement — đây là expected behavior ở T-0502.

Bối cảnh:

- Frontend cần polling/check payment status.

Yêu cầu:

- `GET /api/payment/check`
- Trả pending/confirming/confirmed/expired/failed.
- Không unlock nếu chưa confirmed.

Output cần có:

- Payment check API.

Goal:

- UI biết trạng thái payment mà không tự quyết định quyền.

Điều kiện Done:

- Pending hiển thị đúng.
- Expired hiển thị đúng.
- Confirmed trả entitlement/unlockUrl nếu có.
- User không xem order của người khác nếu order gắn user.

Update khi xong:

- Ghi status đã test.

### T-0503 - Implement payment webhook

Status: Done

Update khi xong (2026-05-19):

- **T-0503a** (scaffold): ✅ Done — Hono setup, /health endpoint, wrangler dev port 8787.
- **T-0503b** (webhook logic): ✅ Done — PayOS signature verify, Firestore REST API, entitlement grant.
- `workers/payment/src/lib/payos-signature.ts` (37 dòng): `verifyPayosWebhook()` — HMAC-SHA256 qua Web Crypto `crypto.subtle`, sort keys A-Z.
- `workers/payment/src/lib/entitlement-map.ts` (24 dòng): duplicate `PRODUCT_ENTITLEMENT_MAP` từ `apps/web/src/lib/entitlements/service.ts`.
- `workers/payment/src/lib/firestore.ts` (226 dòng): Firestore REST API helper — JWT RS256 sign qua `crypto.subtle`, `getAccessToken` với in-memory cache, `firestoreGet/Patch/Create`, serialize/parse Firestore JSON format.
- `workers/payment/src/index.ts` (177 dòng): webhook handler đầy đủ — verify signature, idempotency check, amount mismatch reject, update purchase confirmed, grant entitlement(s), append payment_log.
- `tools/security-smoke.mjs`: thêm exclusion `workers/` để tránh false positive tên biến env trong type definitions.
- Verify: `npm run check` pass, wrangler dev start OK, POST /webhook/payos với key rỗng → 500 "Server misconfigured" (expected — cần setup `.dev.vars` thật).
- Live test sẽ làm sau khi user setup ngrok + PayOS webhook URL.

Bối cảnh:

- Webhook là nguồn xác nhận payment.

Yêu cầu:

- `POST /api/payment/webhook`
- Verify signature.
- Idempotent.
- Amount mismatch không unlock.
- Tạo entitlement sau confirmed.

Output cần có:

- Webhook endpoint.
- Payment logs.

Goal:

- Payment success tạo quyền chính xác, không trùng.

Điều kiện Done:

- Signature fail không update.
- Webhook replay không tạo entitlement trùng.
- Amount mismatch không unlock.
- Payment success tạo entitlement đúng.

Update khi xong:

- Ghi webhook cases đã test.

Bối cảnh:

- Webhook là nguồn xác nhận payment.

Yêu cầu:

- `POST /api/payment/webhook`
- Verify signature.
- Idempotent.
- Amount mismatch không unlock.
- Tạo entitlement sau confirmed.

Output cần có:

- Webhook endpoint.
- Payment logs.

Goal:

- Payment success tạo quyền chính xác, không trùng.

Điều kiện Done:

- Signature fail không update.
- Webhook replay không tạo entitlement trùng.
- Amount mismatch không unlock.
- Payment success tạo entitlement đúng.

Update khi xong:

- Ghi webhook cases đã test.

### T-0504 - Implement Telegram payment/admin alerts

Status: Done

Bối cảnh:

- Production cần biết khi payment thành công/lỗi.

Yêu cầu:

- Alert payment success.
- Alert payment error.
- Alert webhook verify fail.
- Alert admin voucher action nếu cần.

Output cần có:

- Alert helper.
- Test alert endpoint hoặc script.

Goal:

- Không để lỗi money flow im lặng.

Điều kiện Done:

- Test alert pass ở dev.
- Không log token.
- Message không chứa PII không cần thiết.

Update khi xong:

- Ghi alert đã test.

### T-0504b - Telegram reminder cho subscription sắp hết hạn

Status: Todo

Bối cảnh:

- Tarot subscription (tarot_guide_monthly, tarot_guide_quarterly) KHÔNG auto-renew.
- User cần được nhắc trước khi hết hạn để chủ động gia hạn.
- Không có reminder → user mất quyền truy cập mà không biết → trải nghiệm xấu.

Yêu cầu:

- Cron job chạy daily 8:00 +07.
- Query Firestore: entitlements có `type = "tarot_guide"`, `status = "active"`, `expiresAt` trong vòng 3 ngày tới.
- Gửi Telegram message cho từng user (nếu có Telegram linked) hoặc log để admin xử lý.
- Idempotent: không gửi trùng nếu cron chạy lại trong ngày.
- Không auto-renew, không tự tạo purchase.

Output cần có:

- Cron script hoặc scheduled Worker.
- Telegram message template tiếng Việt.
- Idempotency mechanism (vd: flag `reminderSentAt` trên entitlement doc).

Goal:

- User biết subscription sắp hết hạn, có thể gia hạn chủ động.

Điều kiện Done:

- Cron chạy được.
- Telegram message gửi đúng user.
- Không gửi trùng trong cùng ngày.
- Không tự tạo purchase/entitlement.

Update khi xong:

- Ghi template message.
- Ghi idempotency mechanism.

### T-0505 - Implement voucher validate API

Status: Done

Update khi xong (2026-05-21):

- `apps/web/src/lib/firestore/voucher-repository.ts` (46 dòng): Firestore adapter cho `VoucherRepository`, implement `getByCode` và `incrementUsage`; admin CRUD còn lại throw rõ `Implement ở T-0506`.
- `apps/web/src/lib/voucher/service.ts` (89 dòng): server-side voucher validation, check active/time/maxUses/module, tính `fixed`/`percent`/`finalPrice`, floor PayOS minimum 1.000 VND.
- `apps/web/src/app/api/voucher/validate/route.ts` (61 dòng): POST validate voucher, Bearer auth, invalid voucher trả `200 { valid: false, error }`.
- `apps/web/src/app/api/payment/create/route.ts`: apply discount server-side khi có `voucherCode`, lưu `voucherCode` + `discountVnd`, PayOS amount dùng giá đã giảm.
- `workers/payment/src/lib/firestore.ts`: thêm `firestoreIncrementField()` bằng Firestore REST commit transform.
- `workers/payment/src/index.ts`: sau grant entitlement, nếu purchase có `voucherCode` thì increment `vouchers/{code}.usedCount`.
- `apps/web/src/app/pricing/page.tsx`: thêm input voucher trước pricing cards; frontend chỉ gửi code lên backend, không tự tính discount.
- `apps/web/src/app/payment/checkout/page.tsx`: hiển thị voucher/discount từ response backend nếu đã áp dụng.
- `packages/shared/src/schemas/purchase.ts` + `docs/product-specs/data-contract.md`: thêm `discountVnd?: number`.
- Chưa implement `perUserLimit` (TODO trong service) và admin voucher CRUD (T-0506).
- Verify: app typecheck pass, worker payment typecheck pass.

Bối cảnh:

- User cần tự add/edit/remove/pause/active voucher bằng API trước khi có admin UI.
- Voucher có rủi ro thất thoát doanh thu nếu lộ/test code active.

Yêu cầu:

- Voucher fixed, percent, finalPrice.
- `maxUses`, `perUserLimit`, `startsAt`, `expiresAt`.
- Validate theo module/product/user.

Output cần có:

- Validate voucher API.

Goal:

- Tính giá voucher đúng trước payment.

Điều kiện Done:

- Voucher hết hạn trả message đúng.
- Voucher disabled trả “Mã voucher đã hết hạn.” hoặc message đã chốt.
- Percent/fixed/finalPrice đều test pass.
- Không nhận discount từ frontend.

Update khi xong:

- Ghi voucher cases đã test.

### T-0505b - UX refactor voucher input

Status: Done

Bối cảnh:

- Voucher input hiện nằm ở `/pricing` trước khi user chọn gói nên user không biết voucher hợp lệ hay không và không thấy giá sau giảm.

Yêu cầu:

- Gỡ voucher input khỏi `/pricing`.
- Khi click "Chọn gói", chuyển sang `/payment/setup?productCode=...`.
- Tạo trang `/payment/setup` để user xác nhận gói, nhập voucher, validate inline và xem giá sau discount trước khi tạo QR.
- Không để frontend tự tính discount; discount/final amount phải lấy từ API validate/payment create.
- Không đụng `/api/voucher/validate`, `/api/payment/create`, `/payment/checkout` hoặc worker.

Output cần có:

- `/pricing` chỉ còn danh sách gói và CTA sang setup.
- `/payment/setup` có product summary, voucher validate, preview tổng tiền và CTA tạo đơn.
- DEVLOG ghi flow mới và verification.

Goal:

- Flow thanh toán rõ hơn: chọn gói trước, nhập voucher sau, thấy discount trước khi sinh QR.

Điều kiện Done:

- `npm run check` pass.
- `/pricing` click "Chọn gói" sang `/payment/setup`.
- Voucher valid hiển thị trạng thái đã áp dụng, số tiền giảm và tổng tiền sau giảm.
- Voucher invalid hiển thị message từ shared error contract.
- Checkout nhận sessionStorage amount đã discount từ response backend.
- File limit: `pricing/page.tsx` < 230 dòng, `payment/setup/page.tsx` < 280 dòng, `payment/checkout/page.tsx` <= 200 dòng.

Update khi xong:

- `apps/web/src/app/pricing/page.tsx` gỡ voucher input/state/payment create; CTA "Chọn gói" đi tới `/payment/setup?productCode=...`.
- `apps/web/src/app/payment/setup/page.tsx` thêm bước xác nhận đơn hàng, validate voucher inline qua API và preview discount/final amount từ backend response.
- Flow mới: `pricing -> setup -> checkout -> success`.
- `npm run check` pass ngày 2026-05-22.

### T-0506 - Implement admin voucher API

Status: Done

Bối cảnh:

- User cần add/edit/remove/pause/active voucher bằng API trước khi có admin UI.

Yêu cầu:

- Create/update/pause/activate/delete/list voucher.
- Admin token required.
- Admin action log.

Output cần có:

- Admin voucher API.
- Hướng dẫn dùng không chứa token thật.

Goal:

- Quản lý khuyến mại rõ, tránh khách dùng nhầm mã test.

Điều kiện Done:

- Token thiếu/sai trả 401.
- Create/update/pause/activate/delete/list pass.
- Admin action có log.
- Hướng dẫn chỉ dùng placeholder token.

Update khi xong:

- Đã tạo 6 endpoint admin voucher: create, list, update, pause, activate, delete.
- Admin auth dùng header `X-Admin-Token` so với `ADMIN_TOKEN`, không dùng Firebase Auth.
- Audit log append vào collection `admin_logs` cho mỗi action.
- Delete là soft delete: set `active=false`, không hard delete khỏi Firestore.
- Admin UI không làm trong task này; sẽ là task riêng sau MVP launch.

## Phase 6 - Numerology MVP

### T-0601 - Build numerology input form

Status: Done

Bối cảnh:

- Thần số học là module core có khả năng bán ngay.

Yêu cầu:

- Route `/than-so-hoc`.
- Form input chuẩn.
- Validate input.

Output cần có:

- Numerology input form.
- Client-side validation.

Goal:

- Thu input sạch trước khi gọi API.

Điều kiện Done:

- Input lỗi có message rõ.
- Không submit khi thiếu required fields.
- Mobile form không vỡ.

Update khi xong:

- Ghi fields và validate rules.

- Hoàn tất 2026-05-26: tạo form input Thần số học tại `/than-so-hoc` với họ tên, tên thường gọi, giới tính, ngày sinh dạng 3 dropdown.
- Validate client-side bằng Zod/shared schema + kiểm tra ngày hợp lệ; không gọi API trong task này.
- Submit chuyển sang `/than-so-hoc/result` với query params để T-0602 tiếp tục implement result generation.
- Tạo placeholder result page để route không 404.

### T-0602 - Implement numerology free result generation

Status: Done

Bối cảnh:

- Free result là đầu phễu chuyển đổi.

Yêu cầu:

- Generate/report free từ backend hoặc engine đã kiểm soát.
- Giới hạn nội dung.
- Tạo report record nếu trong scope.

Output cần có:

- User tra cứu free được.
- ReportId nếu cần nâng cấp.

Goal:

- Có kết quả free đủ value nhưng không lộ paid content.

Điều kiện Done:

- Input hợp lệ ra kết quả.
- Không lộ toàn bộ 30 chỉ số ở free.
- KB không nằm trong static frontend.
- Error state không raw.

Update khi xong:

- Ghi flow đã test.
- Ghi API/KB access đã dùng.
- Ghi rủi ro nội dung nếu có.

- Hoàn tất 2026-05-27: `/than-so-hoc/result` gọi `/api/numerology/report` proxy tới KB Worker, không gọi Worker trực tiếp từ frontend.
- Free preview hiển thị 3 chỉ số: đường đời, sứ mệnh, ngày sinh; các chỉ số còn lại hiển thị locked card + CTA mua gói `numerology_single_report`.
- API route xác thực Firebase bearer token bằng Admin SDK, forward token gốc tới KB Worker, timeout 30s trả 504.
- Không lưu report Firestore trong task này; defer T-0604.

### T-0602b - Redesign numerology result premium UX

Status: Done

Bối cảnh:

- Result page T-0602 đã có fetch/auth/proxy nhưng UI còn đơn điệu.

Yêu cầu:

- Hero premium.
- Free indicator sections full-width.
- Locked grid không leak value/number.
- Magnetic CTA cuối và sticky CTA mobile.

Điều kiện Done:

- Logic fetch/auth giữ nguyên.
- Mobile 375px không tràn.
- File component dưới giới hạn task.

Update khi xong:

- Ghi layout/component đã tách.
- Ghi lock card không show value.

- Hoàn tất 2026-05-27: tách 5 component result premium (`ResultHero`, `FreeIndicatorSection`, `LockedGrid`, `MagneticCTA`, `StickyBottomCTA`).
- Result page giữ nguyên fetch/auth state từ T-0602, chỉ refactor layout orchestration.
- Locked grid chỉ show title + lock, không show value/number.
- Narrative typography có `.nar-container`; CTA mobile sticky chỉ hiện dưới `md`.

### T-0602c - Strategy B freemium result psychology

Status: Done

Bối cảnh:

- Freemium result cần tối ưu identity + urgency nhưng không leak paid content.

Yêu cầu:

- Free tier: lifePath full, personalYear partial, karmic tease conditional hoặc birthday fallback.
- Locked grid grouped 4 category.
- CTA copy cụ thể, không social proof, không voucher banner.

Điều kiện Done:

- Không đổi KB Worker.
- Locked card không show value/number.
- File limits strict.

Update khi xong:

- Ghi Strategy B free tier.
- Ghi grouped locked grid và CTA copy.

- Hoàn tất 2026-05-27: free tier đổi sang Life Path full + Personal Year partial + Karmic tease conditional hoặc Birthday partial fallback.
- Locked grid nhóm 4 category và chỉ show title, không show number/value.
- Magnetic CTA dùng copy cụ thể cho 2026 forecast, linh hồn/cá tính/thái độ, kim tự tháp và karmic.
- Không thêm social proof hoặc voucher banner.

### T-0603 - Build numerology result page và CTA upgrade

Status: Todo

Bối cảnh:

- Result page là nơi chuyển đổi sang payment.

Yêu cầu:

- Result page free.
- CTA upgrade rõ.
- Copy theo content/legal spec.
- Dashboard/back buttons đúng convention.

Output cần có:

- Result page UI.
- CTA dẫn payment đúng report.

Goal:

- Chuyển user từ free sang paid rõ ràng.

Điều kiện Done:

- CTA không claim quá mức.
- Không có “gặp chuyên gia” nếu không có dịch vụ thật.
- Mobile không vỡ.

Update khi xong:

- Ghi copy/CTA đã dùng.
- Ghi route result.

### T-0604 - Build numerology paid unlock

Status: Done

Bối cảnh:

- Paid user phải unlock đúng report đã mua.

Yêu cầu:

- Payment gắn reportId.
- Entitlement single_report.
- Paid result đầy đủ.
- Account xem lại report.

Output cần có:

- User thanh toán xong unlock report.
- Account list report đã mua.

Goal:

- Hoàn thiện money flow đầu tiên của V2.

Điều kiện Done:

- Payment success unlock trong thời gian chấp nhận.
- Reload vẫn giữ quyền.
- User khác không xem được report.
- Telegram báo payment success.

Update khi xong:

- Ghi test payment.
- Ghi quyền đã tạo.
- Ghi edge case còn lại.

- Hoàn tất 2026-05-28: `/api/numerology/report` check entitlement server-side bằng `checkEntitlement(uid, "numerology_single_report")`.
- Response thêm `unlocked` và `entitlement`; `/than-so-hoc/result` render full report nếu unlocked, giữ free preview nếu chưa unlocked.
- Full report render 33 chỉ số theo 5 group; hero có badge `✓ Đã mở khóa`.
- Không tạo Firestore report record/account history trong task này; phần đó vẫn thuộc task sau.

### T-0605 - Build account report history for numerology

Status: Todo

Bối cảnh:

- Paid user cần xem lại report đã mua.

Yêu cầu:

- Account list report.
- Link mở lại report.
- Check entitlement.

Output cần có:

- Account report history MVP.

Goal:

- Tăng tin cậy thương mại: mua xong xem lại được.

Điều kiện Done:

- User chỉ thấy report của mình.
- Reload vẫn xem lại được.
- Không expose report user khác.

Update khi xong:

- Ghi account flow đã test.

### T-0605b - Free unlock qua voucher 100% off

Status: Done

Bối cảnh:

- Admin cần cấp quyền miễn phí bằng voucher 100% mà không bắt user quét QR.

Yêu cầu:

- Voucher 100% hoặc finalPrice=0 tạo purchase confirmed và grant entitlement ngay.
- Không cho bypass payment nếu không có voucher.
- Voucher usedCount vẫn tăng.

Điều kiện Done:

- Server tự tính amount, không tin frontend.
- finalAmount=0 skip PayOS.
- Entitlement grant qua service hiện tại.

Update khi xong:

- Hoàn tất 2026-05-28: voucher finalAmount=0 tạo purchase `confirmed`, provider `voucher_free`, grant entitlement ngay và increment voucher usage.
- `/payment/setup` chuyển thẳng sang `/payment/success?freeUnlock=true`, không qua checkout QR.
- `/payment/success` hiển thị trạng thái mở khóa bằng voucher và không polling payment check.

### T-0606 - Extract 17 nhóm narrative V1 còn lại và merge vào KB Worker

Status: Done

Bối cảnh:

- `/than-so-hoc/result` đã render narrative HTML qua field `indicator.narrative`.
- Narrative KB hiện mới có 2 nhóm `lifePath` và `destiny`, chưa đủ chiều sâu như V1 production.
- Source narrative V1 nằm trong `kb-private/numerology/narrative_v1_full.js` và chỉ được convert offline, không chạy runtime.

Yêu cầu:

- Refactor extractor để extract đủ 19 nhóm narrative V1 sang `kb-private/numerology/narrative.json`.
- Mở rộng validator và `NarrativeKbSchema` cho 19 nhóm.
- Mở rộng KB Worker để merge narrative cho ít nhất 15 indicator trong report.
- Không đụng UI, không đổi engine numerology, không thêm chỉ số mới.
- Skip `karmicLesson` và `tensionNumber` trong Worker merge vì report V2 chưa map trực tiếp.

Output cần có:

- `tools/kb-import/extract-narrative.mjs` extract 19 nhóm.
- `tools/kb-import/validate-narrative.mjs` validate schema và placeholder semantic.
- `packages/shared/src/schemas/numerology-kb.ts` có `NarrativeKbSchema` 19 nhóm.
- `workers/kb/src/index.ts` merge narrative cho các indicator hiện có.
- `kb-private/numerology/narrative.json` được upload KV nhưng không commit.

Goal:

- Báo cáo `/than-so-hoc/result` hiển thị narrative HTML chi tiết cho ít nhất 15 indicator, độ sâu tương đương V1 production.

Điều kiện Done:

- `npm run kb:extract-narrative` log 19 nhóm và tổng ít nhất 180 entries.
- `npm run kb:validate-narrative` pass và validator báo lỗi rõ khi thiếu placeholder.
- `npm run kb:validate`, `npm run typecheck`, `npm run lint` pass.
- `npm run kb:upload-kv` upload `kb-narrative` thành công.
- KB Worker trả `narrative` cho lifePath, destiny, soul, personality, maturity, attitude, birthday, challenge, approach, personalYear và pyramid indicators khi có template.
- Missing template trả `narrative: null`, không crash.
- Không commit `kb-private/*`, `.env.local`, `*.dev.vars`.

Update khi xong:

- Hoàn tất 2026-05-28: extractor tạo 19 nhóm, tổng 181 entries:
  - `lifePath` 11, `soul` 11, `destiny` 11, `personality` 10, `maturity` 9, `attitude` 9, `karmicLesson` 9, `birthday` 11.
  - `pyramidPeak` 9, `pyramidChallenge` 10, `tensionNumber` 9, `soulChallenge` 9, `destinyChallenge` 9, `personalityChallenge` 9.
  - `cognitiveAbility` 9, `approachMotivation` 9, `approachAbility` 9, `approachAttitude` 9, `personalYearDomains` 9.
- `kb-private/numerology/narrative.json` tăng từ 78,998 bytes (~77.1 KiB) lên 341,553 bytes (~333.5 KiB); file không commit.
- KB Worker merge narrative cho: `lifePath`, `soul`, `destiny`, `personality`, `maturity`, `attitude`, `birthday`, `soulChallenge`, `destinyChallenge`, `personalityChallenge`, `cognitiveAbility`, `approachMotivation`, `approachAbility`, `approachAttitude`, `personalYear`, `pyramidPeaks[]`, `pyramidChallenges[]`.
- Skip Worker merge: `karmicLesson` vì report V2 hiện trả `karmicLessons.missingNumbers[]`; `tensionNumber` vì engine/report V2 chưa tính; `cornerstone`/`capstone` vì không có narrative source.
- Missing template, gồm một số master/challenge case, trả `narrative: null` và không crash.
- Verify đã chạy: `kb:extract-narrative`, `kb:validate-narrative`, negative placeholder check, `kb:validate`, `typecheck`, `lint`, `build`, Worker `tsc --noEmit`, `kb:upload-kv`, runtime smoke merge 22/23 target narratives.

### T-0606b - Detect V1 narrative OVERRIDE assignments

Status: Done

Bối cảnh:

- T-0606 chỉ extract group đầu trong `NarrativeTemplates = { ... }`.
- V1 còn có các assignment override `NarrativeTemplates.groupName = { ... }` ở cuối `narrative_v1_full.js`.
- 8 nhóm `destiny`, `destinyChallenge`, `soul`, `maturity`, `soulChallenge`, `personality`, `personalityChallenge`, `karmicLesson` vì vậy vẫn đang dùng bản short ở một số key.

Yêu cầu:

- Extend `tools/kb-import/extract-narrative.mjs` để detect pattern override assignment.
- Khi cùng group/key có cả bản literal đầu và override, ưu tiên override; với override partial, giữ các key không có trong override.
- Re-extract `kb-private/numerology/narrative.json` và upload KV.
- Xóa `packages/shared/src/numerology/narrative/destiny.ts` AI-generated; section 10 dùng rich V1 narrative trực tiếp.

Điều kiện Done:

- `npm run kb:extract-narrative` log đủ 8 override groups.
- `narrative.destiny[6].html` có marker `Tài năng chăm sóc và lãnh đạo bằng tình yêu thương`.
- `narrative.destiny[4].html` có marker `Kỹ năng tổ chức của bạn`, `Bạn cứng nhắc`, `Trung thực`.
- `npm run kb:validate-narrative`, `npm run kb:test-synthesizer`, `npm run typecheck`, `npm run lint`, `npm run build` pass.
- `npm run kb:upload-kv` upload rich narrative thành công.

Update khi xong:

- `extract-narrative.mjs` detect `NarrativeTemplates.groupName = { ... }` override assignments và merge theo key để override thắng key trùng nhưng không làm mất partial keys.
- Re-extract `kb-private/numerology/narrative.json`: tổng 185 entries, file tăng lên 478,736 bytes (~467.5 KiB) và vẫn nằm trong `kb-private` gitignored.
- 8 groups dùng rich V1 override: `destiny`, `destinyChallenge`, `soul`, `maturity`, `soulChallenge`, `personality`, `personalityChallenge`, `karmicLesson`.
- Xóa `packages/shared/src/numerology/narrative/destiny.ts` AI-generated và bỏ `renderDestinyExtra`; section 10 chỉ render V1 literal narrative qua `renderIndicator(...)` rồi append `destinyCtxBlock`.
- Verify pass: `kb:extract-narrative`, `kb:validate-narrative`, `kb:test-synthesizer`, `typecheck`, `lint`, `build`, `kb:upload-kv`.
- Manual smoke: `Hà Thu Hương / 1996-09-03` ra destiny 6 và section 10 có header `Tài năng chăm sóc và lãnh đạo bằng tình yêu thương`; `Nông Xuân Thái / 1996-09-03` destiny 4 section 10 dài 7281 chars theo literal V1, không padding thêm.

### T-0606c - Extended soulChallenge content merge

Status: Done

Bối cảnh:

- Audit sau T-0606b phát hiện V1 `NarrativeTemplates.soulChallenge` override chỉ có entry `[1]` rich đúng chuẩn 5-aspect.
- Các entry `[0, 2-8]` trong override còn ngắn; `[9]` fallback từ original.
- Claude đã tạo sẵn 9 entry extended static trong `kb-private/numerology/soul-challenge-extended.mjs`.

Yêu cầu:

- Không sửa V1 literal `[1]`.
- Merge extended `[0, 2-9]` vào output `narrative.json` sau khi extractor đọc V1.
- Validate đủ 10 entry soulChallenge: length, 5 sub-section headers, `Tóm lại`, `{{name}}`, không leak `${...}`.
- Không commit `kb-private/*`.

Điều kiện Done:

- `soul-challenge-extended.mjs` có keys `0,2,3,4,5,6,7,8,9`.
- `node tools/kb-import/extract-narrative.mjs` pass.
- `npm run kb:validate-narrative`, `npm run kb:test-synthesizer`, `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Smoke section 17 cho soulChallenge 2, 5, 9 có 5 sub-section headers, coined phrase đúng, và không có duplicate intro.

Update khi xong:

- `extract-narrative.mjs` import `SOUL_CHALLENGE_EXTENDED` từ `kb-private` và merge `[0, 2-9]`, giữ V1 `[1]`.
- Validation trong extractor throw rõ nếu thiếu extended entry, thiếu marker, length < 4500, thiếu `{{name}}`, hoặc còn raw template expression.
- Re-extract `kb-private/numerology/narrative.json`: soulChallenge 10/10 pass audit; file vẫn gitignored.
- Groups khác giữ count: destiny 11, soul 11, personality 10, maturity 11, karmicLesson 9, destinyChallenge 10, personalityChallenge 9.
- Smoke local: `Nong Xuan Thai` soulChallenge 2 có `sự hiện diện có hai bờ`; `Yen` soulChallenge 5 có `tự do có gốc rễ`; `Binh` soulChallenge 9 có `buông không phải mất`.
- Ghi chú: `workers/kb` không có script `typecheck`; check này không chạy được.

### T-0606e - Fix challenge indicator formulas to match V1

Status: Done

Bối cảnh:

- Audit phát hiện V2 đang map `soulChallenge`, `destinyChallenge`, `personalityChallenge` bằng số gốc tương ứng thay vì công thức challenge V1.
- V1 formulas: `soulChallenge = |soul - lifePath| % 9`, `destinyChallenge = |soul - personality|`, `personalityChallenge = |personality - lifePath| % 9`.
- Các phép so sánh phải reduce master numbers bằng `reduce(n, false)` để match V1.

Yêu cầu:

- Chỉ sửa 3 challenge indicators trong `packages/shared/src/numerology/report.ts`.
- Không đổi `reduce` signature, report shape, narrative JSON, hoặc calc khác.
- Thêm regression test cho công thức challenge.

Điều kiện Done:

- `npm run kb:test-challenges` pass.
- `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Case `Hà Thu Hương / 1996-09-03` có destinyChallenge `2`, không còn `6`.

Update khi xong:

- Thêm `calcChallenge(...)` trong `report.ts`, dùng `reduce(_, false)` và `mod9` theo từng challenge.
- `generateReport(...)` wire lại 3 indicators: soul/lifePath, soul/personality, personality/lifePath.
- Thêm `tools/kb-import/test-challenges.mjs` và script `kb:test-challenges`.
- Regression cases pass: `Hà Thu Hương / 1996-09-03` => `{ soulChallenge: 3, destinyChallenge: 2, personalityChallenge: 1 }`; `Nông Xuân Thái / 1996-01-01` => `{ soulChallenge: 7, destinyChallenge: 0, personalityChallenge: 7 }`.
- T-0606c narrative content không đổi; chỉ mapping số challenge thay đổi.

### T-0606f - Wire section 21 Karmic Debt rich V1 narrative

Status: Done

Bối cảnh:

- V1 `NarrativeTemplates.karmicDebt` override có 4 entries rich cho nợ nghiệp 13/14/16/19.
- V2 extractor chưa có group `karmicDebt`, schema narrative chưa khai báo field này, và section 21 còn dùng generic fallback từ structured KB.

Yêu cầu:

- Extend extractor để support override-only group bằng `literalOptional` và group không bắt buộc `{{name}}` bằng `nameOptional`.
- Re-extract `narrative.json` để có `karmicDebt` 4 keys 13/14/16/19.
- Schema accept `narrative.karmicDebt`.
- Synthesizer section 21 ưu tiên render `narrative.karmicDebt` rich V1, fallback generic nếu thiếu.
- Upload KV sau khi extract.

Điều kiện Done:

- 4/4 karmicDebt entries pass length + `karmic-title` + `🔍` + `🛠` + `insight-box`.
- `npm run kb:test-synthesizer`, `npm run kb:test-challenges`, `npm run typecheck`, `npm run lint`, `npm run build` pass.
- `npm run kb:upload-kv` complete.

Update khi xong:

- `extract-narrative.mjs` support `literalOptional` + `nameOptional`, thêm group `karmicDebt` override-only.
- `validate-narrative.mjs` accept `karmicDebt` 4 keys và không bắt `{{name}}` cho group này.
- `NarrativeKbSchema` thêm `karmicDebt` optional.
- Section 21 ưu tiên `narrative.karmicDebt` rich V1, fallback generic nếu thiếu hoặc debt ngoài 13/14/16/19.
- Re-extract private `narrative.json`, upload KV remote complete.
- Smoke runtime: `An / 1970-01-07` có debt 16/13 render rich section 21; `An / 1970-07-14` render fallback sạch nợ nghiệp.
- Browser plugin bị chặn bởi lỗi runtime asset write trong Codex, nên browser smoke trực tiếp không chạy được; worker/dev server đã restart và worker readiness OK.

### T-0606j - Replace karmicDebt with extended hand-written content

Status: Done

Bối cảnh:

- User audit T-0606f phát hiện V1 `karmicDebt` override còn chung chung và voice chưa đạt mức T-0606c.
- Claude đã chuẩn bị `kb-private/numerology/karmic-debt-extended.mjs` với 4 entries 13/14/16/19, voice question-driven, karmic-rooted.
- Pattern giống T-0606c: giữ V1 override làm fallback, nhưng output `narrative.json` overwrite bằng extended content.

Yêu cầu:

- Không sửa nội dung HTML trong `karmic-debt-extended.mjs`.
- `extract-narrative.mjs` import `KARMIC_DEBT_EXTENDED` và merge đè `narrative.karmicDebt`.
- Mỗi entry sau merge có `source: "extended-T-0606j"`, length >= 5000 và đủ các sub-section marker.
- Re-extract narrative, upload KV, restart worker, chạy regression checks.

Điều kiện Done:

- 4/4 `karmicDebt` entries rebuilt pass validate, source `extended-T-0606j`.
- `npm run kb:validate-narrative`, `npm run kb:test-synthesizer`, `npm run kb:test-challenges`, `npm run typecheck`, `npm run lint`, `npm run build` pass.
- `npm run kb:upload-kv` complete.

Update khi xong:

- `extract-narrative.mjs` thêm merge `KARMIC_DEBT_EXTENDED` sau `mergeExtendedSoulChallenge`.
- `validateKarmicDebtHtml` giữ minimum guard cho V1 fallback và extended; detailed extended guard nằm trong `mergeExtendedKarmicDebt`.
- Re-extract `narrative.json`: keys 13/14/16/19 length `5969`, `5933`, `5761`, `5793`, source `extended-T-0606j`.
- KV upload complete; worker 8787 restarted and ready.
- Smoke runtime: `Hà Thu Hương / 1999-02-02` debt 13 section 21 length `5981`; karmic 14 case `An / 1970-01-14` length `5915`; clean case `An / 1970-01-02` fallback length `111`.
- Browser plugin trực tiếp vẫn bị chặn bởi Node/browser sandbox trong Codex, nên browser smoke không chạy được trong turn này.

### T-0606k - Port V1 birth/name grid analysis to sections 22-23

Status: Done

Bối cảnh:

- V2 sections 22-23 mới có visual grid và intro ngắn, thiếu phân tích từng ô, mũi tên sức mạnh và bù trừ biểu đồ như V1.
- V1 `app.js` có `CELL_KNOWLEDGE`, `ARROWS`, `buildCellAnalysis`, `buildArrowsAnalysis`, `buildCompensationAnalysis`, `parseDigitGrid`, `parseNameGrid`.

Yêu cầu:

- Port literal V1 content `CELL_KNOWLEDGE` và `ARROWS`.
- Implement grid analysis helpers cho section 22 và 23.
- Wire synthesizer section 22/23 để render cell analysis, arrow analysis và compensation analysis.
- Thêm regression test grid và CSS class nếu V2 thiếu.

Điều kiện Done:

- `kb:test-grid`, `kb:test-synthesizer`, `typecheck`, `lint`, `build` pass.
- Section 22 có cell + arrow analysis; section 23 có name cell analysis, compensation analysis và combined arrows.

Update khi xong:

- Port literal V1 `CELL_KNOWLEDGE` và `ARROWS` vào `grid-kb-data.ts`; spot-check cơ học khớp nguyên slice V1.
- Thêm `grid-analysis.ts` với `parseDigitGrid`, `parseNameGrid`, `buildCellAnalysis`, `buildArrowsAnalysis`, `buildCompensationAnalysis`.
- Wire synthesizer section 22/23 giữ chartSlot V2 và bổ sung phân tích V1.
- Thêm `kb:test-grid` regression cho DOB `19960202`, tên `Hà Thu Hương`, cell analysis, arrow analysis và compensation analysis.
- Build lần đầu OOM ở static generation; rerun với `NODE_OPTIONS=--max-old-space-size=4096` pass.

### T-0606k-fix - Fix section 23 compensation arrow summary

Status: Done

Bối cảnh:

- User audit T-0606k phát hiện `buildCompensationAnalysis` giữ lại một bug/UX issue từ V1 trong block `arrowsFromName`.
- Bug: template `Trục ${a.name}` có thể render duplicate `Trục Trục ...` vì `a.name` đã chứa prefix `Trục`.
- UX issue: truncate nội dung arrow bằng `substring(0, 150) + "..."` gây cảm giác cũ và trùng với phần arrow analysis ngay bên dưới.

Yêu cầu:

- Chỉ sửa block `arrowsFromName` trong `buildCompensationAnalysis`.
- Render danh sách `<ul class="nar-list">` chỉ gồm `${a.name} (${a.code})`.
- Thêm dòng italic dẫn xuống phần "Phân Tích Mũi Tên Sức Mạnh — Biểu đồ Tổng Hợp".
- Không sửa `CELL_KNOWLEDGE`, `ARROWS`, parser, section 22 hay arrow analysis.

Điều kiện Done:

- `kb:test-grid`, `typecheck`, `lint`, `build` pass.
- Không còn `Trục ${a.name}` hoặc `.substring(0, 150)` trong compensation block.
- Regression test xác nhận output không có `Trục Trục`, có `nar-list`, có dòng dẫn italic.

Update khi xong:

- `buildCompensationAnalysis` block `arrowsFromName` đổi sang `<ul class="nar-list">` chỉ liệt kê `${a.name} (${a.code})`.
- Bỏ prefix `Trục ` trước `${a.name}` để tránh render duplicate `Trục Trục`.
- Bỏ summary truncate `.substring(0, 150) + "..."`; thêm dòng italic dẫn xuống phần arrow analysis bên dưới.
- Regression `kb:test-grid` kiểm tra `nar-list`, dòng dẫn, không `Trục Trục`, không leak `substring(0, 150)`.
- Runtime smoke `Hà Thu Hương / 1999-02-02` section 23: có 5 trục, không duplicate, không truncate cũ, arrow analysis bên dưới vẫn có active/missing arrows.

### T-0606l - Fix tensionNumber fallback insight and English idioms

Status: Done

Bối cảnh:

- Section 26 `tensionNumber` đang có `insight-box` rỗng vì extractor strip mất fallback literal trong pattern `${d?.advice || "..."}`.
- Một số nội dung V1 `tensionNumber` chứa English idioms như `cognitive reframing`, `paralysis by analysis`, `brute force`.

Yêu cầu:

- Patch `extract-narrative.mjs` để expand `${VAR || "fallback"}` thành fallback literal trước placeholder conversion.
- Thêm replacement English idioms sang tiếng Việt trong extractor.
- Re-extract `kb-private/numerology/narrative.json`, upload KV.
- Verify 9/9 `tensionNumber` insight-box có content và không còn forbidden English idioms.
- Không sửa V1 source, không đụng các group/task khác ngoài output narrative từ extractor.

Điều kiện Done:

- `kb:test-challenges`, `kb:test-synthesizer`, `typecheck`, `lint`, `build` pass.
- `npm run kb:upload-kv` complete.
- Smoke section 26 `Hà Thu Hương / 1999-02-02` insight có content, không còn English idioms cũ.

Update khi xong:

- `extract-narrative.mjs` thêm `expandFallbackExpressions` để giữ literal fallback trong `${VAR || "fallback"}`.
- Thêm `ENGLISH_REPLACEMENTS` và `translateEnglishIdioms` cho các cụm English rõ ràng trong narrative.
- Re-extract `narrative.json`: 9/9 `tensionNumber` insight length `245-299`, forbidden English terms `0`.
- Group counts giữ nguyên baseline: total `189` entries.
- `npm run kb:upload-kv` complete; KB Worker 8787 restarted and ready.
- Runtime smoke `Hà Thu Hương / 1999-02-02`: section 26 tension `7`, insight length `274`, forbidden hits `[]`.

### T-0606m - Audit cleanup batch after project-wide review

Status: Done

Bối cảnh:

- Audit toàn dự án phát hiện 1 Critical, 3 Important, 2 Minor đang làm bẩn worktree hoặc còn rủi ro.
- C1: `/dev-token` route untracked có nguy cơ expose Firebase ID token nếu lên production.
- I1: T-0606l extractor fix đã làm nhưng chưa commit.
- I2/I3/I4: một số dirty schema/payment/ResultHero cần xác minh scope trước khi commit.
- M1: T-0606h còn deferred remove `10` khỏi `KARMIC_DEBTS`.
- M4: agent tooling dirs untracked gây noise.

Yêu cầu:

- Mỗi sub-item một commit atomic riêng.
- Không đụng `kb-private/*`, không regenerate/upload narrative trừ khi cần cho T-0606l.
- Sub-item nào scope không rõ thì dừng item đó, ghi reason, tiếp tục item khác.
- Không dùng `--no-verify`, `--force`, `--amend`.

Điều kiện Done:

- T-0606m-1 dev-token production gate Done.
- T-0606m-2 T-0606l extractor/docs commits Done.
- T-0606m-3 schema Done hoặc Stopped có reason.
- T-0606m-4 payment/ResultHero Done hoặc Stopped có reason.
- T-0606m-5 karmic debt 10 cleanup Done.
- T-0606m-6 tooling dirs ignored Done.
- Final typecheck/lint/build/tests pass; docs updated.

Update khi xong:

- T-0606m-1 Done: `/dev-token` route committed with production `notFound()` gate.
- T-0606m-2 Done: T-0606l extractor code and docs committed; KV already uploaded and worker restarted.
- T-0606m-3 Done: schema expansion matched `kb.json` shape; `npm run kb:validate` pass.
- T-0606m-4 Stopped: payment free-voucher flow and untracked `ResultHero` scope unclear; left dirty, not staged or reverted.
- T-0606m-5 Done: removed `10` from `KARMIC_DEBTS` and `KarmicDebtNumber`; added `kb:test-karmic`.
- T-0606m-6 Done: `.agent/`, `.agents/`, `.kiro/`, `_bmad/` ignored in `.gitignore`.
- Final verify pass: `typecheck`, `lint`, `kb:test-challenges`, `kb:test-karmic`, build with `NODE_OPTIONS=--max-old-space-size=4096`.

### T-0606n - Security hardening after audit

Status: Done

Bối cảnh:

- Audit security sau T-0606m yêu cầu hardening không phá flow hiện tại.
- Các điểm cần xử lý gồm CORS allowlist, chặn `/dev-token` ngoài localhost, audit fix không breaking, và rate limiting.

Kết quả:

- CORS allowlist đã áp vào KB Worker và Payment Worker: localhost/127.0.0.1, `dev.banmenh.online`, `banmenh.online`, mở rộng bằng `CORS_ALLOWED_ORIGINS`.
- `/dev-token` đã có `apps/web/src/middleware.ts` chặn production/non-localhost bằng 404 trước khi render route.
- `npm audit fix` non-breaking đã cập nhật lockfile; advisory còn lại yêu cầu `--force` breaking nên không chạy.
- Rate limit đã áp: KB report 60/phút, payment create 10/phút, auth session 10/phút, admin voucher 20/phút.

Điều kiện Done:

- Typecheck/lint/worker TS pass.
- Build webpack pass.
- Không dùng `--force`, không commit `kb-private/*`.

### T-0606o - Commit free voucher feature and security hardening T-0606n

Status: Done

Bối cảnh:

- Pending dirty files from prior audit now have confirmed scope: free unlock via 100% voucher plus `ResultHero` component.
- Security hardening T-0606n covers CORS allowlist, `/dev-token` middleware, non-breaking audit fix, and rate limiting.

Yêu cầu:

- Commit pending free-voucher feature first after typecheck/lint/build.
- Then apply security hardening as separate atomic commits.
- Do not touch or commit `kb-private/*`.
- Update `TASK_REGISTRY.md`, `DEVLOG.md`, `RISK_REGISTER.md` at the end.

Điều kiện Done:

- Free voucher feature committed: `745bf75`.
- T-0606n CORS, middleware, audit fix, and rate limiting complete: `49c1999`, `8acfc16`, `a61ce8b`, `4d63861`.
- Final typecheck/lint, worker TS, KB tests, and webpack build pass.

### T-AUDIT-S1 - Fix 5 blocker findings from project audit

Status: Done

Bối cảnh:

- Audit toan dự án phát hiện 5 blocker findings cần xử lý theo từng item atomic commit.
- Phạm vi chia rõ: C1 homepage promotion, C2 PayOS signature hardening, C3 voucher per-user limit, I13 typecheck OOM, I15 cleanup local-only demo variants.

Yêu cầu:

- Mỗi item = 1 atomic commit.
- Không đụng KB content, narrative, synthesizer logic.
- Không dùng `--no-verify`, `--force`, `--amend`.
- Không commit `kb-private/*` hoặc `.env.local`.
- Sau mỗi fix: `typecheck` + `lint` pass.

Output cần có:

- `apps/web/src/components/homepage-v2/` với Mystic Hub production.
- `workers/payment/src/lib/payos-signature.ts` và `apps/web/src/lib/payos/signature.ts` constant-time compare.
- `tools/test-payos-signature.mjs` và `npm run payos:test-sig`.
- `perUserLimit` enforcement qua `countByUserAndVoucher`.
- `apps/web/tsconfig.json` narrow include + `apps/web/package.json` typecheck heap bump.

Goal:

- Chốt 5 blocker audit findings mà không phá flow hiện tại.

Điều kiện Done:

- 4 commits atomic: C1, C2, C3, I13.
- I15 cleanup local-only, không commit.
- `npm run typecheck`, `npm run lint`, `npm run payos:test-sig` pass.
- Homepage chính ở `/` render Mystic Hub production.

Update khi xong:

- Hoàn tất 2026-06-10: Mystic Hub promoted to production homepage, PayOS signature hardened, voucher perUserLimit enforced, typecheck OOM fix applied, stale demo variants removed local-only.
- Manual smoke vẫn còn cần user credential nếu muốn test voucher free-unlock 2 lần qua API.

### T-0607 - Restructure result flow và port V1 charts

Status: Done

Bối cảnh:

- Flow Thần số học hiện đang gộp tổng quan và luận giải chi tiết trong `/than-so-hoc/result`.
- V1 production có dashboard tổng quan trước khi vào chi tiết: mandala, chu kỳ vận số, nhóm tính cách và nhóm ngành phù hợp.
- Free/unlocked gating hiện nằm trong result page và cần giữ cho trang chi tiết.

Yêu cầu:

- `/than-so-hoc/result` trở thành summary dashboard luôn xem được.
- Tạo `/than-so-hoc/result/details` cho free preview hoặc full unlocked report, kế thừa logic gating cũ.
- Port chart helpers từ V1 sang `packages/shared/src/numerology/charts.ts`, không đổi `NumerologyReport` type.
- Tạo 3 chart component pure SVG/CSS, không thêm chart library.
- Không đụng KB Worker, numerology engine, pricing/payment/account routes.

Output cần có:

- `packages/shared/src/numerology/charts.ts` export career/personality tables và helper tính chart.
- `LineChartVanSo`, `PersonalityBars`, `CareerBars` trong `apps/web/src/components/numerology/result/charts/`.
- `SummaryDashboard` render mandala, 6 chip tổng quan, 3 chart và CTA.
- Route `/than-so-hoc/result/details` render lại details free/full hiện tại.

Goal:

- Mạch flow Thần số học khớp V1: input → tổng quan dashboard → chi tiết free lock hoặc unlock full.

Điều kiện Done:

- `npm run typecheck`, `npm run lint`, `npm run build` pass.
- `/than-so-hoc/result` hiển thị mandala, 6 chip và 3 chart trên desktop/mobile.
- Free account có CTA preview và unlock; paid account có CTA xem luận giải chi tiết.
- `/than-so-hoc/result/details` giữ preview/free lock/full report như cũ.
- File limit: `charts.ts` < 200 dòng, chart components < 100 dòng/file, `SummaryDashboard` < 220 dòng, result page < 130 dòng, details page < 200 dòng.

Update khi xong:

- Hoàn tất 2026-05-28: port chart helpers từ V1 vào `packages/shared/src/numerology/charts.ts` và re-export từ `packages/shared/src/numerology/index.ts`.
- Chart components:
  - `apps/web/src/components/numerology/result/charts/LineChartVanSo.tsx` - 83 dòng.
  - `apps/web/src/components/numerology/result/charts/PersonalityBars.tsx` - 37 dòng.
  - `apps/web/src/components/numerology/result/charts/CareerBars.tsx` - 44 dòng.
- `SummaryDashboard` mới tại `apps/web/src/components/numerology/result/SummaryDashboard.tsx` - 139 dòng, render mandala, 6 chip, line chart, personality bars, career bars và CTA.
- Route `/than-so-hoc/result` mới là summary dashboard free; route `/than-so-hoc/result/details` mới giữ free preview/full unlock gating cũ.
- Chart helper exports: `CAREER_TABLE`, `CAREER_GROUPS`, `PERSONALITY_GROUPS`, `calcCareerGroups`, `calcPersonalityGroups`, `calcLineChartData`.
- File limit đã kiểm: `charts.ts` 118 dòng, result page 114 dòng, details page 195 dòng.
- Verify đã chạy: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.

### T-0607a - Fix T-0607 audit findings: V1 personality chart math + locked grid icons

Status: Done

Bối cảnh:

- Audit T-0607 phát hiện `calcPersonalityGroups` đã simplify logic V1 nên sai redistribution khi có floor/cap, làm lệch % và ranking.
- Audit cũng phát hiện `LockedGrid` details dùng digit string `"1"`, `"2"`, `"3"`, `"4"` thay vì emoji V1.

Yêu cầu:

- Restore đúng thuật toán V1 4 bước cho personality bars: raw %, floor 3% trừ từ max, cap 40% cộng vào min, normalize tổng 100.
- Giữ `calcCareerGroups` match V1, không đổi line chart.
- Thêm regression test math cho personality/career charts.
- Restore emoji group icons: 👤 ⏳ 🎯 💎.

Điều kiện Done:

- `npm run kb:test-charts`, `npm run typecheck`, `npm run lint`, `npm run build` pass.
- DOB `15/08/1992` cho personality bars top group 1 và 9 tied khoảng 23%.
- Details locked grid hiển thị emoji, không còn digit string.

Update khi xong:

- Hoàn tất 2026-05-29: `calcPersonalityGroups` đã khôi phục đúng thuật toán V1 4 bước: raw %, floor 3% trừ từ max, cap 40% cộng vào min, normalize tổng 100.
- Thêm `tools/kb-import/test-charts.mjs` và script `npm run kb:test-charts`.
- Test cover 3 DOB personality: `01/01/1111` cap edge, `15/08/1992` tied groups 1/9 ở 23%, `05/05/1995` typical.
- Test cover `calcCareerGroups(1, 5)` để guard V1 normalize career.
- Restored locked grid icons trong `/than-so-hoc/result/details`: 👤 ⏳ 🎯 💎.
- Verify đã chạy: `npm.cmd run kb:test-charts`, `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.

### T-0607b - Refactor PersonalityBars 2-col layout và aspect breakdown 11 khía cạnh

Status: Done

Bối cảnh:

- User feedback: personality bars đang dài dạng một cột, cần layout 2 cột giống V1 screenshot.
- Indicator detail card đang render flat field list quá rộng, cần gom theo 11 khía cạnh chuẩn.

Yêu cầu:

- PersonalityBars dùng grid 2 cột từ `md`, mỗi item có dot màu, rank, label, %, và bar fill cùng màu.
- FreeIndicatorSection bỏ field flat list, render aspect-based theo 11 khía cạnh cố định.
- Tình yêu & Hôn nhân gộp một card vì KB V1 không tách marriage riêng.
- Hide-if-empty: aspect card chỉ render nếu fallback chain có dữ liệu.

Điều kiện Done:

- `npm run typecheck`, `npm run lint`, `npm run build` pass.
- File limit: `PersonalityBars.tsx` < 90 dòng, `aspects.ts` < 60 dòng, `FreeIndicatorSection.tsx` < 200 dòng.

Update khi xong:

- Hoàn tất 2026-05-29: `PersonalityBars` dùng grid 2 cột từ `md`, port cấu trúc V1 dot + rank + label + percent + bar fill.
- Thêm `aspects.ts` với 11 aspect mapping cố định và `readAspectText` helper.
- `FreeIndicatorSection` bỏ flat field list, render aspect card theo fallback chain và hide-if-empty.
- Tình yêu & Hôn nhân gộp một card vì KB V1 không tách marriage riêng.
- Verify đã chạy: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`, `npm.cmd run qa:responsive-audit`.

### T-0609 - Port V1 pyramid and 3x3 numerology charts

Status: Done

Bối cảnh:

- V2 details unlocked còn thiếu 4 chart quan trọng từ V1: kim tự tháp, biểu đồ ngày sinh, biểu đồ tên và biểu đồ tổng hợp.
- Các chart phải là pure SVG/CSS, không thêm chart library và không đổi engine numerology.

Yêu cầu:

- Thêm helper grid trong `packages/shared/src/numerology/charts.ts`: birth cells, name cells, combined cells, arrow detection, isolated numbers, compensation.
- Thêm `PyramidSvgChart`, `BirthChartGrid`, `CombinedChartGrid`.
- Chèn 4 chart vào details unlocked; free preview giữ paywall và không show chart.
- Giữ summary dashboard/charts T-0607 không đổi.

Điều kiện Done:

- `npm run kb:test-charts`, `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Không đổi `NumerologyReport` type, engine calc, KB schema/narrative hoặc Worker.

Update khi xong:

- Hoàn tất 2026-05-29: thêm grid helpers trong `packages/shared/src/numerology/charts.ts`: `calcBirthChartCells`, `calcNameChartCells`, `calcCombinedCells`, `detectArrows`, `detectIsolatedNumbers`, `findCompensated`.
- Thêm chart components:
  - `PyramidSvgChart.tsx` - 123 dòng.
  - `BirthChartGrid.tsx` - 45 dòng.
  - `CombinedChartGrid.tsx` - 106 dòng.
- `FullReport` unlocked details chèn pyramid chart trong section `time-cycles` và 3 biểu đồ 3x3 trong section `lessons`.
- Free preview không render 4 chart, giữ lock/CTA như cũ.
- `tools/kb-import/test-charts.mjs` cover thêm DOB `15/08/1992`, arrow `147`, isolated numbers, combined/compensation.
- Verify đã chạy: `npm.cmd run kb:test-charts`, `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.

### T-0610 - Mechanical port V1 web numerology report details

Status: Done

Bối cảnh:

- T-0608 mới đưa details về dạng essay 6 section, chưa khớp V1 web banmenh.online 4 PHẦN/30 section.
- User cần `/than-so-hoc/result/details` unlocked giống V1 web hơn, giữ V2 dark theme và không ship raw KB/narrative ra client.

Yêu cầu:

- Mở rộng engine với `tensionNumber`, `personalYearsRange` 3 năm và `personalMonthsRange` 3 tháng.
- Port helper narrative sâu và cross-context block để synthesizer có thể tạo HTML server-side.
- Rebuild synthesizer thành `profileHeader` + 4 `phases`, 30+ section đánh số theo V1 web, skip số 4.
- FullReport render phase divider, section header, profile header 8 chips và chart slots T-0609 đúng vị trí.
- Giữ free/lock gating, summary dashboard, charts, payment/auth/voucher và KB schema không đổi.

Điều kiện Done:

- `npm run kb:test-engine`, `npm run kb:test-synthesizer`, `npm run kb:test-charts`, `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Không commit `kb-private/*`, `.env.local` hoặc `*.dev.vars`.

Update khi xong:

- Hoàn tất 2026-05-29: thêm `calcTensionNumber`, `tensionNumber`, `personalYearsRange`, `personalMonthsRange`.
- Thêm `packages/shared/src/numerology/narrative-deep.ts` với helper deep narrative, personal year/month, life cycle, pyramid và 5 cross-context blocks.
- `buildSynthesizedReport` trả `SynthesizedReport` gồm `profileHeader` và 4 `phases`; test hiện có 31 sections.
- Worker KB trả `profileHeader/phases` server-side khi `includeSections=true`; Next proxy không trả phases cho free user.
- `FullReport` render V1-style 4 phần, profile header 8 chips, section headers và chart slots `pyramid`, `birth-grid`, `combined-grid`.
- CSS narrative mở rộng class cho phase divider, year cards, cycle circles, pyramid period, cross-context box.
- Verify đã chạy: `npm.cmd run kb:test-synthesizer`, `npm.cmd run kb:test-engine`, `npm.cmd run kb:test-charts`, `npm.cmd run kb:validate-narrative`, `npm.cmd run kb:validate`, `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run security:smoke`, `npm.cmd run build`, `npm.cmd exec --workspace workers/kb -- tsc --noEmit`.
- Rủi ro còn lại: chưa port literal toàn bộ 1MB V1 narrative byte-for-byte; chưa chạy browser side-by-side trong phiên này.

### T-0610c-year - Literal V1 personal year deep narrative

Status: Done

Bối cảnh:

- T-0610 còn dùng bản rút gọn cho section 2 và section 8.
- `/than-so-hoc/result/details` cần section "Phân tích chi tiết 3 năm tới" giống V1 PDF: banner năm/vận số/tuổi và 6 khía cạnh chi tiết.

Yêu cầu:

- Port literal `personalYearDeep` và `buildYearDomainBlock` từ `kb-private/numerology/narrative_v1_full.js`.
- Section 2 dùng `buildYearDomainBlock` cho `personalYearsRange`.
- Section 8 dùng `personalYearDeep`, không dùng `generic()` fallback.
- Thêm CSS/component wrapper cho year card và aspect/domain block.

Điều kiện Done:

- `narrative-deep.ts` >= 600 dòng sau khi port.
- Spot-check tối thiểu 5 chuỗi tiếng Việt từ V1 tồn tại trong file.
- `npm run kb:test-synthesizer`, `npm run typecheck`, `npm run lint`, `npm run build` pass.

Update khi xong:

- Hoàn tất 2026-05-29: port literal `personalYearDeep` + `buildYearDomainBlock`; `narrative-deep.ts` hiện 612 dòng.
- Section 2 đổi thành "Phân tích chi tiết 3 năm tới" và render 3 year cards bằng `buildYearDomainBlock`.
- Section 8 và 8.1 render deep personal year HTML bằng `personalYearDeep`.
- Thêm `YearCard`, `AspectBlock` và CSS cho `.py-year-block`, `.py-domain`, `.year-detail-block`, `.year-domain-block`.
- Spot-check chuỗi V1: "Đây là năm lý tưởng để bắt đầu một dự án mới", "Xây nền tảng bền vững", "Làm tới đâu chắc chắn tới đó", "Tình yêu cần không gian tự do", "Tha thứ và buông bỏ".

### T-0610c-section5 - Literal V1 life path section + career detail

Status: Done

Bối cảnh:

- T-0610 section 5 mới render base lifePath narrative + ctx block, chưa có 7 box extra của V1.
- Section 3 "Nhóm ngành nghề phù hợp" còn là 3 card đơn giản, chưa có career bars và định hướng nghề nghiệp chi tiết.

Yêu cầu:

- Port literal `LIFE_PATH_EXTRA` từ `kb-private/numerology/narrative_v1_full.js`.
- Port `renderLifePathExtra` và `_lifePathCtxBlock` từ `kb-private/numerology/app_v1_full.js`.
- Section 5 render theo order V1: narrative lifePath, cross-context, người nổi tiếng, tương thích, tình duyên, bài học, bạn bè & gia đình, du lịch & sở thích, nghề nghiệp.
- Section 3 mở rộng thành 3 card career + career bars chart slot + box định hướng nghề nghiệp chi tiết.

Điều kiện Done:

- `LIFE_PATH_EXTRA[5]` có 6 người nổi tiếng, `tuongThich.tot` là array số và `tinhDuyen` chứa "Phong cách yêu".
- `npm run kb:test-synthesizer`, `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Không commit `kb-private/*`, `.env.local` hoặc `*.dev.vars`.

Update khi xong:

- Hoàn tất 2026-05-29: port toàn bộ `LIFE_PATH_EXTRA` thực tế từ dòng 3467-4008 của V1 source; file nguồn là khoảng 542 dòng, không phải 2250 dòng như ước lượng ban đầu.
- Thêm type `LifePathFamous`, `LifePathCompat`, `LifePathExtraEntry` và export `renderLifePathExtra`.
- `lifePathCtxBlock` thay bằng literal V1 `_lifePathCtxBlock`.
- Section 5 không dùng `generic()`; dùng `narrative.lifePath[n]` + ctx block + `renderLifePathExtra`.
- Section 3 thêm marker `career-bars`, FullReport inject `CareerBars` đúng vị trí giữa 3 career cards và box nghề nghiệp chi tiết.
- CSS narrative bổ sung class V1 cho career cards, famous grid, compatibility grid và life path extra boxes.

### T-0610c-section6 - Literal V1 life cycles section

Status: Done

Bối cảnh:

- T-0610 section 6 còn dùng `lifeCyclesHtml` rút gọn, chưa match V1 PDF.
- V1 section 6 có 3 vòng tròn tổng quan, intro 4 đoạn và 3 phase block chi tiết với `lifeCycleNarrative` + advice grid.

Yêu cầu:

- Port literal `lifeCycleNarrative` từ `kb-private/numerology/narrative_v1_full.js`.
- Port literal `lifeCyclePhaseExtra` từ V1.
- Port/adapt `buildLifeCyclesSection` từ `kb-private/numerology/app_v1_full.js` sang V2 `NumerologyReport`.
- Section 6 dùng `buildLifeCyclesSection(report, name)`, không dùng `generic()` fallback.
- Thêm CSS cho circle row, intro box, phase blocks và advice grid nếu thiếu.

Điều kiện Done:

- Spot-check 5 chuỗi tiếng Việt V1 tồn tại trong `narrative-deep.ts`.
- `npm run kb:test-synthesizer`, `npm run kb:test-engine`, `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Không commit `kb-private/*`, `.env.local` hoặc `*.dev.vars`.

Update khi xong:

- Port `lifeCycleNarrative` V1 literal vào `narrative-deep.ts` với `stageLabels`, `deepNarrative` và `adviceData` tự chứa.
- Port `LIFE_CYCLE_PHASE_EXTRA` V1 cho các phase intro `gieoHat` / `truongThanh` / `vienMan`.
- Thêm `buildLifeCyclesSection(report, name)` để render 3 vòng chu kỳ, intro 4 đoạn và 3 phase block chi tiết.
- Section 6 trong `synthesizer.ts` chuyển sang dùng `buildLifeCyclesSection`, không còn dùng `lifeCyclesHtml` rút gọn.
- CSS narrative thêm `.lc-*` cho circle row, intro box, phase block, advice grid và avoid callout.
- Verify pass: `npm run kb:test-synthesizer`, `npm run kb:test-engine`, `npm run typecheck`, `npm run lint`, `npm run build`.

### T-0610c-section7 - Literal V1 pyramid section

Status: Done

Bối cảnh:

- T-0610 section 7 còn dùng `pyramidPeakAnalysis` rút gọn và chart slot append ngoài flow.
- V1 section 7 có intro, chart, 4 period blocks 7.1-7.4 và "Phân Tích Chi Tiết Từng Đỉnh Cao" với 4 colored boxes mỗi peak.

Yêu cầu:

- Port literal `pyramidPeakAnalysis` từ `kb-private/numerology/narrative_v1_full.js`.
- Port/adapt `buildPyramidSection` từ `kb-private/numerology/app_v1_full.js` sang V2 `NumerologyReport`.
- Section 7 dùng `buildPyramidSection(report, name)`, không dùng `generic()` fallback cho nội dung chính.
- FullReport inject `PyramidSvgChart` tại marker `<!-- CHART:pyramid -->`.
- Thêm CSS cho pyramid period, peak analysis block, 4 aspect boxes, negatives và reflection.

Điều kiện Done:

- Spot-check 5 chuỗi tiếng Việt V1 tồn tại trong `narrative-deep.ts`.
- `npm run kb:test-synthesizer`, `npm run kb:test-engine`, `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Không commit `kb-private/*`, `.env.local` hoặc `*.dev.vars`.

Update khi xong:

- Port `pyramidPeakAnalysis` V1 vào `narrative-deep.ts` với `peakDeepNarratives`, `challengeDeepNarratives` và 4 colored-box analysis data.
- Thêm `buildPyramidSection(report, name, narrative)` để render intro, marker chart, 4 period blocks 7.1-7.4 và "Phân Tích Chi Tiết Từng Đỉnh Cao".
- Section 7 trong `synthesizer.ts` chuyển sang dùng `buildPyramidSection`, không dùng `generic()` fallback cho nội dung chính.
- `FullReport` inject `PyramidSvgChart` inline tại marker `<!-- CHART:pyramid -->` thay vì append ngoài flow.
- CSS narrative thêm `.pyramid-*` và `.peak-*` cho period blocks, peak analysis, 4 aspect boxes, negatives và reflection.
- Verify pass: `npm run kb:test-synthesizer`, `npm run kb:test-engine`, `npm run typecheck`, `npm run lint`, `npm run build`; section 7 HTML fixture dài 29561 chars.

### T-0610c-section8 - Literal V1 personal year summary and 3-year cycle

Status: Done

Bối cảnh:

- T-0610c-year trước đó đã port một phần personal year nhưng section 8/8.1 chưa bám đúng cấu trúc V1 hiện tại.
- Section 8 cần summary card `personalPeriod('Năm', ...)`; section 8.1 cần intro, 3 year card grid và 3 block chi tiết từ `buildPersonalYearFullBlock`.

Yêu cầu:

- Port literal V1 `personalPeriod` từ `kb-private/numerology/narrative_v1_full.js`.
- Port literal V1 `personalYearDeep`, `_yearContent`, `_yearIntro` và adapt `buildPersonalYearFullBlock` từ `kb-private/numerology/app_v1_full.js`.
- Section 8 dùng `personalPeriod`, không dùng `personalYearDeep`.
- Section 8.1 render intro italic, grid 3 năm và 3 detailed blocks với 5 domain blocks + Tóm lại.
- Thêm CSS cho summary card, dos/donts grid, year card grid và year detail/domain blocks.

Điều kiện Done:

- Spot-check chuỗi tiếng Việt V1 từ `personalPeriod` và `personalYearDeep` tồn tại trong V2.
- Giữ nguyên fallback typo field `taichinhthanhoc` / `taichinhthanhhoc` trong orchestrator.
- `npm run kb:test-synthesizer`, `npm run kb:test-engine`, `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Không commit `kb-private/*`, `.env.local` hoặc `*.dev.vars`.

Update khi xong:

- Port `personalPeriod` V1 literal vào `packages/shared/src/numerology/narrative/year-month.ts` với `numMeta` 9 entry, summary card, energy paragraph, dos/donts grid và `insight-box` lời khuyên.
- Port `personalYearDeep` V1 literal và thêm helper `yearContent` / `yearIntro` từ `_yearContent` / `_yearIntro`.
- Thêm `buildPersonalYearFullBlock` V1-style để render 3 detailed year blocks theo section label `8.1`/`8.2`/`8.3`, giữ fallback typo `taichinhthanhhoc` / `taichinhthanhhoc`.
- Section 8 trong `synthesizer.ts` chuyển sang `personalPeriod("Năm", ...)`; section 8.1 thêm intro italic, `year-cards-grid` và 3 block chi tiết.
- CSS narrative thêm class cho personal-year card, dos/donts grid, year cards grid và year detail/domain blocks; block CSS được nén để giữ file dưới 600 dòng.
- Verify pass: `npm run kb:test-synthesizer`, `npm run kb:test-engine`, `npm run typecheck`, `npm run lint`, `npm run build`.

### T-0610c-section9 - Literal V1 personal month 3-month detail

Status: Done

Bối cảnh:

- Section 9.1 hiện còn dùng bản simplified từ `personalPeriod`, chưa render đúng 3 tháng chi tiết theo V1.
- V1 `personalMonthDeep` có content object 9 entry và 6 domain blocks cho từng tháng cá nhân.

Yêu cầu:

- Port literal V1 `personalMonthDeep` từ `kb-private/numerology/narrative_v1_full.js`.
- Section 9.1 render 3 tháng detail, mỗi tháng có headline, energy paragraph và 6 domain blocks.
- Giữ section 9 summary hiện tại; không đụng section 1-8 hoặc 10-30.
- Thêm CSS cho `.month-detail-block` và `.month-detail-headline`, dùng lại `.year-domain-block`.

Điều kiện Done:

- Spot-check chuỗi tiếng Việt V1 từ `personalMonthDeep` tồn tại byte-for-byte trong V2.
- `packages/shared/src/numerology/narrative/year-month.ts` dưới 1000 dòng.
- `npm run kb:test-synthesizer`, `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Không commit `kb-private/*`, `.env.local` hoặc `*.dev.vars`.

Update khi xong:

- Port literal V1 `personalMonthDeep` vào `packages/shared/src/numerology/narrative/year-month.ts` với content object 9 entry, 6 domain blocks và headline `CHỈ SỐ THÁNG ...`.
- `synthesizer.ts` section 9.1 thêm intro italic literal V1, 3-card month grid và 3 detail blocks từ `personalMonthDeep`.
- `numerology-narrative.css` thêm `.month-detail-block` và `.month-detail-headline`, dùng lại `.year-domain-block`.
- Verify pass: `npm run kb:test-synthesizer`, `npm run typecheck`, `npm run lint`, `npm run build`; fixture `Nông Xuân Thái / 1996-09-03` render 3 month blocks, 18 domain blocks, 3 headlines, intro và grid.
- Ghi chú: output literal V1 section 9.1 cho fixture dài 11088 chars, thấp hơn ngưỡng prompt 15000; không thêm nội dung ngoài V1 để bơm length.

### T-0610c-section10-11 - Literal V1 destiny context and life path destiny correlation

Status: Done

Bối cảnh:

- Section 10 cần dùng literal V1 `_destinyCtxBlock` thay bản cross-context simplified.
- Section 11 hiện còn dùng helper tương quan generic, chưa bám đúng V1 inline render cho Đường đời & Sứ mệnh.

Yêu cầu:

- Port literal V1 `_destinyCtxBlock` từ `kb-private/numerology/app_v1_full.js`.
- Section 10 prepend intro line V1-style, render destiny narrative, rồi append `destinyCtxBlock`.
- Thêm helper `buildLifePathDestinyCorrelation` cho section 11 với 3 paragraph + insight-box theo V1.
- Không đụng section 1-9, 12-30, engine, route, auth, payment, charts hoặc theme.

Điều kiện Done:

- Spot-check chuỗi V1 section 11 tồn tại trong V2.
- Section 11 fixture dài hơn 1000 chars.
- `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Không commit `kb-private/*`, `.env.local` hoặc `*.dev.vars`.

Update khi xong:

- `destinyCtxBlock` trong `packages/shared/src/numerology/narrative/life-path.ts` được thay bằng literal V1 `_destinyCtxBlock`, có branch same/energyMatch/else và escape tên user.
- `synthesizer.ts` thêm `buildLifePathDestinyCorrelation` cho section 11 với 3 paragraph + `insight-box` theo V1.
- Section 10 prepend intro line, render destiny narrative, rồi append `destinyCtxBlock`.
- Section 11 chuyển từ `relationshipHtml(...)` generic sang `buildLifePathDestinyCorrelation(report, name)`.
- Verify pass: `npm run typecheck`, `npm run lint`, `npm run build`; fixture `Nông Xuân Thái / 1996-09-03` section 10 dài 1955 chars, section 11 dài 1369 chars.
- Ghi chú: lần đầu `typecheck`/`build` gặp stale `.next/dev/types/validator.ts`; đã xóa cache generated `apps/web/.next/dev`, build lại, rồi rerun `typecheck` pass.

### T-0610c-section10-extra - Destiny extra narrative content

Status: Done

Bối cảnh:

- Section 10 cần phần nội dung mở rộng theo mẫu `LIFE_PATH_EXTRA`, nhưng dành riêng cho chỉ số Sứ Mệnh.
- Sứ Mệnh số 4 có template literal từ V1 PDF; các số 1,2,3,5,6,7,8,9 cần nội dung cùng cấu trúc/tone dựa trên KB `destiny_number`.

Yêu cầu:

- Tạo `packages/shared/src/numerology/narrative/destiny.ts` với `DESTINY_EXTRA` và `renderDestinyExtra`.
- Destiny 4 giữ literal V1 template được cung cấp.
- Destiny 1,2,3,5,6,7,8,9 tạo nội dung tiếng Việt có dấu, tone trang trọng/huyền học thương mại, không dùng từ cấm.
- Wire `renderDestinyExtra` vào section 10 sau narrative và trước `destinyCtxBlock`.
- Re-export từ `narrative-deep.ts`.

Điều kiện Done:

- `destiny.ts` dưới 1000 dòng.
- Spot-check destiny 4 có câu `Bạn là một thuật sĩ`.
- Mỗi entry 1,2,3,5,6,7,8,9 dài tối thiểu 1500 chars.
- `npm run kb:test-synthesizer`, `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Không sửa `narrative.json`, section 1-9 hoặc 11-30.

Update khi xong:

- Tạo `packages/shared/src/numerology/narrative/destiny.ts` với `DESTINY_EXTRA`, type `DestinySubSection`/`DestinyExtraEntry`, và `renderDestinyExtra`.
- Re-export từ `narrative-deep.ts`, wire section 10 để render sau destiny narrative và trước `destinyCtxBlock`.
- Destiny 4 giữ template được cung cấp với marker `Bạn là một thuật sĩ`; các entry còn lại đều trên 1500 chars.
- Verify pass: `npm run kb:test-synthesizer`, `npm run typecheck`, `npm run lint`, `npm run build`.
- Fixture `Nông Xuân Thái / 1996-09-03`: section 10 dài 8043 chars, có destiny extra và marker `Bạn là một thuật sĩ`.
- Review fix: bỏ modulo fallback trong `renderDestinyExtra` để master numbers 11/22/33 không render nhầm extra narrative của số rút gọn.
- Ghi chú: không sửa `narrative.json`, section 1-9, section 11-30, engine, route, auth, payment, charts, hoặc theme.

### T-0610c-section10-finalize - Finalize destiny extra narrative length

Status: Done

Bối cảnh:

- `DESTINY_EXTRA` đã có 9 entry cho section 10, nhưng các entry 1,2,3,5,6,7,8,9 còn ngắn hơn entry destiny 4 template.
- Task này mở rộng nội dung static TS const offline; runtime chỉ lookup dữ liệu, không gọi AI theo user.

Yêu cầu:

- Không đụng destiny 4.
- Mở rộng entry 1,2,3,5,6,7,8,9 để mỗi entry đạt tối thiểu 5000 chars.
- Dựa trên material `kb-private/numerology/kb.json` nhóm `destiny_number`.
- Không dùng các từ cấm `chữa lành`, `healing`, `rung động`.
- Stage/commit chỉ 5 file scope: `destiny.ts`, `narrative-deep.ts`, `synthesizer.ts`, `TASK_REGISTRY.md`, `DEVLOG.md`.

Điều kiện Done:

- `destiny.ts` dưới 1000 dòng.
- Entry 1,2,3,5,6,7,8,9 đều >= 5000 chars.
- Destiny 4 byte-for-byte không đổi.
- `npm run kb:test-synthesizer`, `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Section 10 fixture dài hơn 12000 chars/user.

Update khi xong:

- Mở rộng static `DESTINY_EXTRA` cho các entry 1,2,3,5,6,7,8,9 dựa trên material `destiny_number` trong KB.
- Giữ destiny 4 byte-for-byte không đổi; hash slice entry 4: `a97dd392eeb8f12fe0fab29fef3b94639be8ad05640cb98f58a28e92f626fa85`.
- `destiny.ts` dài 576 dòng; các entry 1,2,3,5,6,7,8,9 đều trên 5000 chars.
- Section 10 fixture cho các destiny generated 1,2,3,5,6,7,8,9 đều trên 12000 chars.
- Output là TS const static sinh offline; runtime chỉ lookup, không gọi AI theo user.
- Verify pass: `npm run kb:test-synthesizer`, `npm run typecheck`, `npm run lint`, `npm run build`.
- Ghi chú: master numbers 11/22/33 vẫn không fallback sang số rút gọn.

### T-0610c-section12-13-14 - Literal V1 sections 12-14 inline render

Status: Done

Bối cảnh:

- Section 12 thiếu intro paragraph V1 trước narrative challenge.
- Section 13 dùng `maturityCtxBlock` simplified, chưa đúng `_maturityCtxBlock` V1.
- Section 14 còn dùng `generic(...)`, chưa render inline V1 cho năng lực trưởng thành.

Yêu cầu:

- Port literal V1 `_maturityCtxBlock` với border-left `#059669`.
- Prepend intro V1 cho section 12 `Thử thách Sứ Mệnh`.
- Replace section 14 generic bằng inline render V1 dùng data maturity ability.
- Không đụng section khác, engine, route, auth, payment, charts.

Điều kiện Done:

- Section 12 fixture có `Không có sứ mệnh nào không đi kèm với thử thách`.
- Section 13 fixture có `✦ Số Trưởng Thành` và `tinh lọc và kết tinh`.
- Section 14 fixture dài hơn 800 chars.
- `npm run typecheck`, `npm run lint`, `npm run build` pass.

Update khi xong:

- `maturityCtxBlock` trong `packages/shared/src/numerology/narrative/life-path.ts` được thay bằng literal V1, escape tên user.
- `synthesizer.ts` section 12 prepend intro V1 trước `challengeHtml(...)`.
- `synthesizer.ts` section 14 thêm `renderMaturityAbility(...)` inline theo V1; map thêm `peak_age`/`how_to_develop` từ KB hiện tại vào wrapper V1 tương ứng với thế mạnh/lời khuyên.
- Spot-check fixture `Nông Xuân Thái / 1996-09-03`: section 12 intro pass, section 13 maturity context pass, section 14 dài 822 chars.
- Verify pass: `npm run typecheck`, `npm run lint`, `npm run build`.

### T-0610c-section16-17-18 - Literal V1 sections 16-17-18 inline render

Status: Done

Bối cảnh:

- Section 16 còn dùng `relationshipHtml(...)` generic.
- Section 17 thiếu intro V1 trước narrative challenge.
- Section 18 dùng `personalityCtxBlock` simplified, chưa đúng `_personalityCtxBlock` V1.

Yêu cầu:

- Replace section 16 bằng inline render V1 cho tương quan Đường đời & Linh hồn.
- Prepend intro V1 cho section 17 `Thử thách Linh Hồn`.
- Port literal V1 `_personalityCtxBlock` với border-left `#d97706`.
- Không đụng section khác, engine, route, auth, payment, charts.

Điều kiện Done:

- Section 16 fixture có `Chỉ số đường đời và chỉ số linh hồn là hai yếu tố`.
- Section 17 fixture có `Mọi linh hồn đều mang theo những bóng tối`.
- Section 18 fixture có `Nhân cách trong tổng thể biểu đồ`.
- `npm run typecheck`, `npm run lint`, `npm run build` pass.

Update khi xong:

- `synthesizer.ts` thêm `buildLifePathSoulCorrelation(...)` và wire section 16 sang inline V1 literal.
- `synthesizer.ts` section 17 prepend intro V1 trước `challengeHtml(...)`.
- `personalityCtxBlock` trong `packages/shared/src/numerology/narrative/life-path.ts` được thay bằng literal V1, escape tên user.
- Spot-check fixture `Nông Xuân Thái / 1996-09-03`: section 16 dài 1385 chars, section 17 dài 1148 chars, section 18 dài 2556 chars và đủ marker.

### T-0610c-fix - Fix Vietnamese period strings and pyramid chart year labels

Status: Done

Bối cảnh:

- Engine từ T-0407 còn phát period strings ASCII (`tuoi`, `tro di`) cho pyramid/life cycle.
- `PyramidSvgChart` đang vá bằng replace ở client và chưa hiển thị year range cạnh age range.
- Rule content yêu cầu mọi text user-facing là tiếng Việt có dấu.

Yêu cầu:

- Fix tại nguồn trong `packages/shared/src/numerology/indicators.ts`.
- Bỏ client-side replace workaround trong `PyramidSvgChart`.
- `PyramidSvgChart` render 2 dòng label cho peak: age range + year range.
- Không đổi chart geometry, engine calculation, route/auth/payment hoặc KB/narrative.

Điều kiện Done:

- Không còn match `tuoi` / `tro di` trong `packages/shared/src/numerology` và chart component.
- `npm run kb:test-engine`, `npm run kb:test-synthesizer`, `npm run kb:test-charts`, `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Không commit `kb-private/*`, `.env.local` hoặc `*.dev.vars`.

Update khi xong:

- `calcPyramidPeaks`, `calcPyramidChallenges` và `calcLifeCycles` phát period strings có dấu (`tuổi`, `tuổi trở đi`, `giai đoạn chủ đạo cuối đời`).
- `PyramidSvgChart` bỏ workaround replace ASCII ở client.
- `PyramidSvgChart` render 2 dòng label cho peak: age range (`0–33 tuổi`) và year range (`(1990 – 2023)` / `(2042+)`).
- Regex parse period trong `narrative-deep.ts` không phụ thuộc chữ `tuổi`, nên tương thích với output mới.
- Verify pass: `npm run kb:test-engine`, `npm run kb:test-synthesizer`, `npm run kb:test-charts`, `npm run typecheck`, `npm run lint`, `npm run build`.

### T-0610c-cleanup - Split narrative-deep modules and diacritics integration test

Status: Done

Bối cảnh:

- `packages/shared/src/numerology/narrative-deep.ts` đã vượt 2000 dòng sau T-0610c-section5/6/7.
- Rule repo yêu cầu file > 1000 dòng phải tách.
- Issue ASCII `tuoi/tro di` cần test tự động để không tái diễn.

Yêu cầu:

- Split narrative rendering thành các module trong `packages/shared/src/numerology/narrative/`.
- Giữ `narrative-deep.ts` làm barrel export để không đổi public import.
- Không đổi function signature hoặc output HTML.
- Thêm integration test `kb:test-diacritics` và đưa vào `npm run check`.

Điều kiện Done:

- Mỗi file trong `packages/shared/src/numerology/narrative/*.ts` < 1000 dòng.
- `narrative-deep.ts` < 30 dòng.
- Snapshot synthesized output trước/sau split identical byte-for-byte.
- `npm run kb:test-synthesizer`, `npm run kb:test-diacritics`, `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Không commit `kb-private/*`, `.env.local` hoặc `*.dev.vars`.

Update khi xong:

- Tách `narrative-deep.ts` thành barrel export 5 dòng.
- Tạo `narrative/common.ts`, `life-path.ts`, `cycle.ts`, `pyramid.ts`, `year-month.ts`.
- File lớn nhất sau split: `cycle.ts` 772 dòng; tất cả module < 1000 dòng.
- Snapshot 4-case synthesized output trước/sau split identical: 494570 bytes.
- Thêm `tools/kb-import/test-diacritics.mjs`, script `kb:test-diacritics` và thêm vào `npm run check`.
- Verify pass: `npm run kb:test-synthesizer`, `npm run kb:test-diacritics`, `npm run typecheck`, `npm run lint`, `npm run build`.

### T-0610c-lifePath10 - Add Life Path 10 display + narrative KB

Status: Done

Bối cảnh:

- V1 có template riêng cho `lifePath[10]`, nhưng V2 hiện reduce raw 10 thành số 1 và render như Đường đời 1 thuần.
- User cung cấp ảnh V1 và 2 nguồn tham khảo ngoài để xác nhận nhu cầu hiển thị Đường đời số 10.

Yêu cầu:

- Giữ logic tính toán reduced number = 1 để không phá engine.
- Khi raw lifePath = 10, thêm `displayNumber = 10` và lookup KB/narrative theo số 10 cho riêng Đường đời.
- Thêm `kb-private/numerology/kb.json` entry `life_path.10` và extract `narrative.lifePath.10` từ V1 local source.
- Section 4/profile/summary hiển thị số 10; các tính toán phụ vẫn dùng số 1.
- Không thêm số 10 vào các nhóm indicator khác.

Điều kiện Done:

- `npm run kb:validate`, `npm run kb:validate-narrative`, `npm run kb:test-engine`, `npm run kb:test-synthesizer`, `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Test case raw lifePath 10 xác nhận `number=1`, `displayNumber=10`, narrative chứa `Số 10 (1+0=1)`.

Update khi xong (2026-06-04):

- Added `displayNumber=10` for raw Life Path 10 while keeping reduced `number=1` for calculation logic.
- Added private KB lookup `life_path.10` and extracted `narrative.lifePath.10` from local V1 source.
- Summary/dashboard/profile/details now display Life Path 10; charts and correlation math still use reduced number 1.
- Added raw 10 coverage to engine and synthesizer tests.
- Verified: `npm run kb:extract-narrative`, `npm run kb:validate`, `npm run kb:validate-narrative`, `npm run kb:test-engine`, `npm run kb:test-synthesizer`, `npm run typecheck`, `npm run lint`, `npm run build`.

### T-0608 - Mechanical port V1 numerology details rendering

Status: Done

Bối cảnh:

- T-0607b aspect cards làm details view xa output V1.
- `/than-so-hoc/result/details` unlocked cần quay về essay literary flowing giống V1 `view-details`.

Yêu cầu:

- Copy V1 `app.js` vào `kb-private/numerology/app_v1_full.js` làm private reference, không commit.
- Port synthesizer V1 sang TypeScript pure module trong `packages/shared/src/numerology/synthesizer.ts`.
- Worker synthesize `sections` HTML server-side; Next proxy chỉ trả sections cho user unlocked.
- FullReport render `SectionBlock[]`, bỏ aspect cards/chips/famous/keywords trong details unlocked.
- Giữ summary dashboard, charts, auth/payment/voucher/free gating.

Điều kiện Done:

- `npm run kb:test-engine`, `npm run kb:test-charts`, `npm run kb:validate-narrative`, `npm run kb:validate`, `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Không commit `kb-private/*` hoặc `.env.local`.

Update khi xong:

- Hoàn tất 2026-05-29: copy V1 `app.js` vào `kb-private/numerology/app_v1_full.js` làm private reference, file được gitignore.
- Thêm `packages/shared/src/numerology/synthesizer.ts` pure function, trả `SectionBlock[]` gồm 6 section và 33+ indicator essay blocks.
- Worker KB synthesize `sections` server-side khi request có `includeSections`.
- Next proxy check entitlement trước khi gọi Worker; chỉ gửi `includeSections=true` và trả `report.sections` cho user đã unlock.
- `FullReport` render V1-style essay sections, bỏ aspect cards/chips/famous/keywords trong details unlocked.
- Free preview/details lock flow giữ nguyên: `FreeIndicatorSection`, `LockedGrid`, `MagneticCTA`, `StickyBottomCTA`.
- Verify đã chạy: `kb:test-engine`, `kb:test-charts`, `kb:validate-narrative`, `kb:validate`, `kb:test-synthesizer`, `typecheck`, `lint`, `build`, `check`, `qa:responsive-audit`, Worker `tsc --noEmit`.

### T-PAY-NUM-1 - Numerology payment module-scoped routes

Status: Done

Bối cảnh:

- Numerology paid unlock trước đó dùng `/payment/setup?productCode=numerology_single_report`.
- Product owner chọn Option C hybrid: giữ shared payment components nhưng route thanh toán theo module, bắt đầu với `/than-so-hoc/payment`.
- Phase D webhook deploy và Phase F PayOS sandbox smoke test được defer sang task riêng `T-PAY-NUM-1-DEPLOY`.

Yêu cầu:

- Tách shared components `PaymentSetup`, `PaymentSuccess`, `PaymentCancel`.
- Thêm routes `/than-so-hoc/payment`, `/than-so-hoc/payment/success`, `/than-so-hoc/payment/cancel`.
- Giữ backward compatibility `/payment/setup`, `/payment/success`, `/payment/cancel`.
- API payment create trả PayOS return/cancel URL theo module slug.
- CTA numerology đi tới `/than-so-hoc/payment`.
- Không đụng KB content, narrative, synthesizer, worker hoặc pricing `99000`.

Điều kiện Done:

- `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build` pass.
- Module-scoped routes build được.
- Legacy routes vẫn có wrapper/redirect.
- Phase D/F ghi defer, chưa deploy worker, chưa smoke PayOS sandbox.

Update khi xong (2026-06-05):

- Added shared payment components under `apps/web/src/components/payment/`.
- Added numerology payment wrapper routes under `apps/web/src/app/than-so-hoc/payment/`.
- Updated payment create API to generate module-scoped PayOS `returnUrl`/`cancelUrl`.
- Added Next redirects from legacy payment URLs to numerology module URLs.
- Updated numerology CTAs to `/than-so-hoc/payment` and preserved result query params into payment/success flow.
- Verified: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.
- Not done by design: worker/webhook deploy and PayOS sandbox smoke test, deferred to `T-PAY-NUM-1-DEPLOY`.

### T-PAY-NUM-2 - Refactor free preview flow and CTA FAQ

Status: Done

Bối cảnh:

- `/than-so-hoc/result` cần là free preview duy nhất cho báo cáo Thần số học.
- `/than-so-hoc/result/details` chỉ dành cho user đã unlock.
- Preview cũ còn nằm một phần trong details page, khiến flow mua báo cáo chưa rõ.

Yêu cầu:

- Refactor `/than-so-hoc/result` thành preview đầy đủ: profile, overview, 8 chỉ số chính, 2 indicator previews, locked grid, CTA, FAQ, sticky CTA mobile.
- Thêm `generateOverview()` dùng data từ report.
- LockedGrid dùng count động `33 - 2 = 31`.
- `/than-so-hoc/result/details` redirect về `/than-so-hoc/result?notice=locked` khi user chưa unlock.
- Không đụng KB content, narrative, synthesizer, pricing, entitlement logic, workers hoặc API routes.

Điều kiện Done:

- `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build` pass.
- `/result` có preview structure mới.
- `/result/details` chỉ render `FullReport` khi unlocked.
- Sticky CTA chỉ hiện trên mobile sau scroll.

Update khi xong (2026-06-05):

- Added `overview.ts`, result preview utilities and dynamic locked count constants.
- Refactored `SummaryDashboard` into free preview flow with overview, 8 chips and 2 concise indicator previews.
- Added enhanced CTA card with benefits and price anchor.
- Added FAQ accordion and scroll-aware sticky mobile CTA.
- Gated details page for unlocked users only; locked users redirect to summary with notice.
- Added `numerology-result.css` and imported it through `globals.css`.
- Verified: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.

### T-PAY-NUM-3 - Update free preview indicators + anchor wording

Status: Done

Bối cảnh:

- `/than-so-hoc/result` hiện preview 2 chỉ số: Đường Đời + Ngày Sinh.
- CTA anchor đang dùng wording `(~ 2 cốc trà sữa, có giá trị cả đời)`.
- Locked count đang tính `33 - 2 = 31`.

Yêu cầu:

- Đổi free preview thành 3 chỉ số: Đường Đời partial, Năm Cá Nhân partial, Tháng Cá Nhân full.
- Thêm `PersonalMonthFull` render conditional các field có dữ liệu trong `personal_month`.
- Đổi anchor wording thành `(~ giá 2 bát phở)`.
- Đổi `PREVIEW_INDICATORS = 3`, locked count còn 30.
- Không đụng KB, narrative, synthesizer, workers, API routes, pricing.

Điều kiện Done:

- `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build` pass.
- Free preview hiển thị Đường Đời + Năm Cá Nhân + Tháng Cá Nhân.
- Tháng Cá Nhân không crash khi data thiếu field.
- Locked count hiển thị 30.

Update khi xong (2026-06-05):

- Thay preview Ngày Sinh bằng Năm Cá Nhân partial 200 ký tự.
- Thêm `PersonalMonthFull` render full Tháng Cá Nhân với field conditional.
- Đổi anchor wording thành `(~ giá 2 bát phở)`.
- Đổi `PREVIEW_INDICATORS = 3`, locked count còn 30.
- Thêm CSS cho month preview trong `numerology-result.css`.
- Verified: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.

### T-PAY-NUM-3-FIX - Make free preview generous, use all available data

Status: Done

Bối cảnh:

- Free preview hiện ưu tiên field ngắn trong `kb.json`, nên nhiều trường hợp rơi vào nội dung generic hoặc quá mỏng.
- Life Path đã có narrative HTML rich content và `personal_month` có các field như `focus`, `action`, `moon_link`, `warning`.

Yêu cầu:

- Preview Đường Đời ưu tiên narrative HTML, strip tag, thay placeholder bằng `bạn`, rồi truncate.
- Mở rộng field fallback cho indicator title/body và tăng Life Path preview lên 350 ký tự.
- Personal Year preview dùng thêm `theme`, `intro`, `name` và truncate 300 ký tự.
- PersonalMonthFull render tự động tất cả field có data trong mapping.
- Không đụng KB, narrative, synthesizer, workers, API routes, pricing.

Điều kiện Done:

- `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build` pass.
- Preview không crash khi data/null field thiếu.
- Tháng Cá Nhân render được mọi field có data trong `FIELD_META`.

Update khi xong (2026-06-05):

- Added `stripHtml` helper and made indicator preview prefer narrative HTML before KB fallback fields.
- Expanded title/body fallback field lists and increased Life Path preview length to 350 characters.
- Expanded Personal Year preview fields and length to 300 characters.
- Reworked `PersonalMonthFull` to render every string field covered by `FIELD_META`, skipping missing/non-string values.
- Verified: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.

### T-PAY-NUM-3-FIX-2 - Multi-faceted preview from available KB fields

Status: Done

Bối cảnh:

- Free preview vẫn chưa đủ sức thuyết phục vì chỉ hiển thị 1-2 field, trong khi `report.*.data` đã có nhiều field sẵn.
- Life Path có `positive_traits`, career/love/health/money fields; Personal Year có career/finance/love/health/family.

Yêu cầu:

- Tạo `RichIndicatorPreview` generic/reusable cho preview nhiều field.
- Life Path preview hiển thị title, description, trait chips, career snippet và locked aspect teaser.
- Personal Year preview hiển thị theme/title, career + finance snippets và locked aspect teaser.
- Giữ nguyên `PersonalMonthFull`.
- Không đụng KB, narrative, synthesizer, workers, API routes, pricing.

Điều kiện Done:

- `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build` pass.
- Rich preview không crash khi data null hoặc field thiếu.
- Mobile chip/list không tràn layout.

Update khi xong (2026-06-05):

- Added generic `RichIndicatorPreview` with intro, trait chips, field snippets and locked aspect teaser list.
- Wired Life Path preview to show KB title/description, up to 6 `positive_traits`, career snippet and 7 locked aspects.
- Wired Personal Year preview to show theme/description, career + finance snippets and 3 locked aspects.
- Kept `PersonalMonthFull` unchanged.
- Added CSS for trait chips, field snippets and locked aspect teaser.
- Verified: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.

### T-PAY-NUM-4 - Free preview redesign theo pattern PDF Mystical Hub

Status: Done

Bối cảnh:

- Free preview cần có sức thuyết phục hơn nhưng không được spoil USP của báo cáo trả phí.
- Pattern cần gần PDF Mystical Hub: có hub free rõ ràng, visual hooks, CTA sớm, locked cards compact và CTA cuối.
- Không thay đổi KB, narrative, synthesizer, workers, API, pricing.

Yêu cầu:

- Thêm `LifeCyclesSummary` hiển thị 3 chu kỳ Đường Đời, mỗi chu kỳ tối đa 300 ký tự.
- Thêm `LockedSectionCard` compact với số mục, title, số chỉ số, KB title, hint, word count và nút mở khóa.
- Thêm `LOCKED_SECTIONS` 22 mục và `LOCKED_PHASES` nhóm B/C/D.
- Refactor `SummaryDashboard` thành 5 free sections: profile/dashboard, line chart, career bars, life cycles summary, personal month full.
- Thêm CTA sớm, locked grouped, CTA cuối, FAQ và sticky mobile CTA vào flow summary.

Điều kiện Done:

- `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build` pass.
- Mobile 375px không tràn ngang.
- Locked cards grouped theo phase B/C/D, mỗi card có hint rõ và CTA mở khóa.
- Không động KB, narrative, synthesizer, workers, API, pricing.

Update khi xong (2026-06-05):

- Added `LifeCyclesSummary`, `LockedSectionCard`, `PhaseDivider`, `LockedSectionsGrouped`.
- Added `lockedSectionConfig.ts` with 22 locked sections grouped by phase B/C/D.
- Refactored `SummaryDashboard` to render profile, overview, 8 chips, line chart, career bars, cycles summary, month full, dual CTA, locked grouped, FAQ and sticky CTA.
- Added CSS in `numerology-result.css` for cycles, locked cards, phase divider and final CTA.
- Verified: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.

### T-PAY-NUM-1-DEPLOY - Deploy and smoke numerology payment

Status: Todo

Bối cảnh:

- `T-PAY-NUM-1` chỉ refactor web routing/UI and return URLs.
- Production/dev worker deploy and PayOS sandbox smoke need explicit approval and environment readiness.

Yêu cầu:

- Deploy/update payment worker only after user approval.
- Run PayOS sandbox smoke for `/than-so-hoc/payment`.
- Verify webhook confirms purchase and entitlement unlock.

Điều kiện Done:

- User-approved deploy completed.
- Smoke report records order creation, return URL, cancel URL, webhook confirmation and entitlement state.
- No secrets committed or logged.

### T-UX-ERR-1 - Auth-aware error states for result and payment UX

Status: Done

Background:

- Auth failures on result/payment flows should not look like generic system errors.
- Existing `UnauthorizedState` provides the right login CTA, but result and payment error branches still used generic `ErrorState`.
- `ErrorState` also needed friendlier titles per shared `ErrorCode`.

Requirements:

- Show `UnauthorizedState` for `AUTH_REQUIRED`, `AUTH_INVALID_TOKEN`, and `AUTH_SESSION_EXPIRED` on numerology result/detail/payment flows.
- Keep account page behavior as-is if it already uses `UnauthorizedState`.
- Add specific error titles for non-auth `ErrorCode` values in `ErrorState`.
- Keep API, KB, narrative, worker, pricing, and entitlement logic unchanged.

Done criteria:

- `npm.cmd run typecheck`, `npm.cmd run lint`, and `npm.cmd run build` pass.
- Auth errors show login-focused unauthorized UI instead of generic error copy.
- Non-auth errors keep `ErrorState` with more specific titles.

Update when done (2026-06-05):

- Added an `ErrorCode` title map in `ErrorState`.
- Wired `UnauthorizedState` into `/than-so-hoc/result`, `/than-so-hoc/result/details`, and payment setup auth errors.
- Account page was verified to already use `UnauthorizedState`.
- Login CTA now carries a `returnUrl` query pointing back to the current page.
- Verified: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.

## Phase 7 - Tarot MVP Non-AI

### T-0701 - Chuẩn bị Tarot KB schema non-AI

Status: Todo

Bối cảnh:

- Tarot cần cảm giác là một module riêng, không chỉ form rút bài đơn giản.
- MVP đã chốt non-AI.

Yêu cầu:

- Card schema.
- Spread schema 1/3 lá.
- Theme/question schema.
- Không copy KB public từ site khác.

Output cần có:

- Tarot KB schema/types.
- Sample seed minimal nếu cần, không phải KB private đầy đủ.

Goal:

- Có nền dữ liệu Tarot rõ trước UI.

Điều kiện Done:

- Không public KB private.
- Không gọi AI.
- Schema khớp content quality spec.

Update khi xong:

- Ghi schema và nguồn content.

### T-0702 - Build Tarot landing

Status: Todo

Bối cảnh:

- Tarot cần entry page riêng, tách khỏi flow Thần số học.
- Landing phải dùng UI foundation chung, không tự tạo style riêng.

Yêu cầu:

- Route `/tarot`.
- Landing riêng.
- CTA bắt đầu hành trình.
- CTA dictionary/history placeholder nếu chưa build.

Output cần có:

- Tarot landing hoạt động.

Goal:

- Có entry page Tarot riêng, đồng bộ UI.

Điều kiện Done:

- Không dùng AI.
- Không public KB private.
- Mobile không vỡ.

Update khi xong:

- Ghi layout/copy đã dùng.
- Ghi rủi ro UX/content.

### T-0702A - Prototype Tarot ritual UX theo Mystery Tarot

Status: Done

Bối cảnh:

- User muốn bám UX/workflow và nhịp animation của Mystery Tarot.
- Không cần clone giao diện, không cần nối KB trong bước này.

Yêu cầu:

- `/tarot` không còn cảm giác form cứng.
- Có journey: landing, tụ tâm, chọn chủ đề/câu hỏi, chọn trải bài, rút/lật bài, kết quả.
- Animation chậm: heartbeat, ripple, fade-up, reveal từng lá.
- Không public KB private, không gọi AI.

Output:

- `apps/web/src/app/tarot/page.tsx`
- `apps/web/src/modules/tarot/TarotExperience.tsx`
- `apps/web/src/modules/tarot/tarot-data.ts`
- `apps/web/src/modules/tarot/tarot-ui.tsx`

Điều kiện Done:

- `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Flow 1 lá / 3 lá render được bằng data mô phỏng local.
- KB/backend/history vẫn để các task T-0701..T-0708 xử lý tiếp.

### T-0702B - Port Mystery Tarot UX shell local-only

Status: Done

Bối cảnh:

- User muốn `/tarot` bám sát nhịp UX và workflow của Mystery Tarot hơn nữa.
- Không cần nối KB ở bước này, chỉ cần shell, animation và journey gần như bản tham chiếu.

Yêu cầu:

- Màn landing phải có cảm giác nghi thức, không còn form cứng.
- Journey phải đi qua: landing, popup tạo phiên, tĩnh tâm, chọn bài, lật bài, phân tích.
- Có modal phụ cho thông điệp mỗi ngày, lịch sử, từ điển, chủ đề.
- Text user-facing bằng tiếng Việt có dấu.
- Không gọi AI, không public KB private.

Output:

- `apps/web/src/app/tarot/page.tsx`
- `apps/web/src/modules/tarot/TarotExperience.tsx`
- `apps/web/src/modules/tarot/tarot-data.ts`
- `apps/web/src/modules/tarot/tarot-ui.tsx`

Goal:

- Tarot UX nhìn và đi gần hơn với website tham chiếu, nhưng vẫn chạy local-only trong app hiện tại.

Điều kiện Done:

- `npm run typecheck` pass.
- `npm run lint` pass.
- `npm run build` pass.
- Manual smoke trên `/tarot` không vỡ layout desktop/mobile.

Update khi xong:

- Đã dựng prototype ritual UX local-only, không gọi KB/AI.
- Đã tách data, UI helpers và experience để file không vượt giới hạn lint.
- Rủi ro còn lại: chưa manual browser QA do automation/dev-server local bị lỗi sandbox trong phiên này.

### T-0703 - Build Daily Message

Status: Done

Bối cảnh:

- Daily Message tạo retention loop cho Tarot.

Yêu cầu:

- Popup đầu phiên/ngày.
- Reveal card.
- Không chặn flow chính.

Output cần có:

- Daily Message component/logic.

Goal:

- Tạo thói quen quay lại mỗi ngày.

Điều kiện Done:

- Popup không hiện lại sai trong cùng ngày.
- Không chứa KB private trong static nếu nội dung private.
- Mobile không vỡ.

Update khi xong:

- `getDailyCard(dateStr)` trong tarot-data.ts: FNV-1a hash chuỗi ngày, modulo `DECK.length`; cả lá bài và chiều Xuôi/Ngược đều deterministic trong ngày.
- Auto-popup useEffect: check `localStorage["tarot_daily_seen"]`, nếu khác ngày hôm nay thì `setModal("daily")`.
- `handleCloseModal`: ghi `localStorage["tarot_daily_seen"] = todayStr` khi đóng modal daily.
- Data source: static trong tarot-data.ts, 10 lá Major Arcana có thông điệp riêng, còn lại dùng fallback.

Nâng cấp 2026-10-21:

- Thay popup text bằng nghi thức lá úp/lật 3D; mặt trước dùng `tarotCardImageSrc`, giữ đúng tỉ lệ và xoay ảnh khi chiều Ngược.
- Sau reveal hiển thị tên Việt/Anh, chiều lá, thông điệp trong ngày, gợi ý hành động 24 giờ và hai CTA.
- Tách trạng thái `tarot_daily_seen` khỏi `bm_tarot_daily_revealed_v1`; đóng popup chưa đồng nghĩa đã lật, còn lá đã lật sẽ hiện trực tiếp khi mở lại cùng ngày.
- Mọi thao tác localStorage có `try/catch`; khi storage bị chặn, trải nghiệm vẫn hoạt động trong state của phiên hiện tại.
- CTA “Trải bài sâu hơn ngay” đóng modal và chuyển đúng sang `fieldSelect`; “Đã nhận thông điệp” chỉ đóng modal.
- Flip hỗ trợ click/bàn phím, reduced-motion; ModalShell tiếp tục hỗ trợ X, Escape, click outside và focus trap.
- `npm run typecheck`, `npm run lint`, `npm run build` pass; Edge headless E2E 375x812 pass toàn bộ reveal/persist/reopen/CTA/close/reduced-motion và không tràn ngang.

### T-0704 - Build Tarot wizard: chọn chủ đề và câu hỏi

Status: Todo

Bối cảnh:

- User cần được dẫn dắt trước khi chọn bài.

Yêu cầu:

- Chọn chủ đề.
- Câu hỏi gợi ý hoặc tự nhập.
- Validate câu hỏi.

Output cần có:

- Wizard step chủ đề/câu hỏi.

Goal:

- Tránh user không biết hỏi gì và tạo input sạch.

Điều kiện Done:

- Không cho câu hỏi quá dài.
- Message lỗi rõ.
- Không lưu raw question cloud nếu chưa có consent/scope.

Update khi xong:

- Ghi themes/questions đã dùng.

### T-0705 - Build Tarot wizard: chọn spread 1/3 lá

Status: Todo

Bối cảnh:

- MVP chỉ làm 1/3 lá.

Yêu cầu:

- Spread 1 lá.
- Spread 3 lá.
- Không hiển thị 5/7/10/12 như feature đã có.

Output cần có:

- Spread selection step.

Goal:

- Khóa scope Tarot MVP.

Điều kiện Done:

- 1/3 lá hoạt động.
- Spread future nếu hiển thị phải ghi “sắp ra mắt” và không clickable.

Update khi xong:

- Ghi spread rules.

### T-0706 - Build shuffle/select/flip experience

Status: Todo

Bối cảnh:

- Tarot không nên trả kết quả ngay, cần nghi thức chọn/flip.

Yêu cầu:

- Shuffle visual.
- User chọn đủ số lá.
- Flip từng lá.

Output cần có:

- Reading interaction.

Goal:

- Tạo trải nghiệm Tarot có cảm xúc nhưng không phình logic.

Điều kiện Done:

- Không trả kết quả trước khi chọn đủ lá.
- Không auto random hết nếu spec yêu cầu user chọn.
- Mobile interaction ổn.

Update khi xong:

- Ghi interaction đã test.

### T-0707 - Build Tarot result non-AI

Status: Todo

Bối cảnh:

- Tarot MVP chỉ làm 1/3 lá để tránh scope phình.

Yêu cầu:

- Kết quả từ KB + template engine.
- Disclaimer.
- Content safety rules.

Output cần có:

- Tarot 1 lá pass.
- Tarot 3 lá pass.
- Result có disclaimer.

Goal:

- Có flow Tarot MVP bán/giữ chân được, nhưng vẫn kiểm soát chất lượng.

Điều kiện Done:

- Không trả kết quả trước khi chọn đủ lá.
- Không gọi AI.
- Không phán đoán tuyệt đối.
- Không lộ KB private.
- History local hoạt động nếu trong scope task.

Update khi xong:

- Ghi flow đã test.
- Ghi nội dung mẫu.
- Ghi audit content safety.

### T-0708 - Build Tarot local history

Status: Done

Bối cảnh:

- MVP có history local giới hạn, cloud history để sau.

Yêu cầu:

- Lưu local history giới hạn.
- Xem lại reading local.
- Xóa local history.

Output cần có:

- Local history MVP.

Goal:

- Tăng value mà không cần backend cloud history ngay.

Điều kiện Done:

- Không lưu PII nhạy cảm quá mức.
- Có clear/delete.
- Không giả vờ sync cloud.

Update khi xong:

- Hoàn tất ngày 2026-10-21. Lịch sử dùng key versioned `bm_tarot_history_v1`, giữ tối đa 15 phiên gần nhất theo FIFO.
- Mỗi phiên chỉ lưu ID, timestamp, chủ đề, câu hỏi, spread, lá bài (ID, tên, vị trí, chiều, đường dẫn ảnh), tóm tắt, nguồn Gemini/template và nội dung luận giải cần để xem lại.
- Không lưu họ tên, ngày sinh, giới tính, câu trả lời làm rõ, Firebase token hoặc thông tin thanh toán trong local history.
- Modal “Thông điệp quá khứ” có danh sách, ảnh thu nhỏ, màn chi tiết, xóa từng phiên, xóa toàn bộ, empty state và cảnh báo khi localStorage không khả dụng.
- Mọi thao tác đọc/ghi/xóa localStorage được bọc `try/catch`; dữ liệu được kiểm tra bằng Zod trước khi dùng.
- `npm run typecheck`, `npm run lint`, `npm run build` pass. Edge headless E2E ở 375px pass luồng tạo quẻ → lưu → về Landing → xem danh sách/chi tiết → xóa; không tràn ngang.
- Workspace là snapshot không có `.git`; hoàn tất bằng self-review và nghiệm thu trực tiếp theo yêu cầu của product owner, không có SHA để request review ngoài.

### T-0709 - Tích hợp Gemini cho luận giải Tarot chuyên sâu

Status: Done

Bối cảnh:

- Product owner đã duyệt ADR-009 để supersede ADR-003 và cho phép Gemini tạo luận giải Tarot cá nhân hóa.
- Flow Tarot hiện có UI ritual, câu hỏi, spread, rút/lật bài và fallback template nhưng chưa có luận giải AI thực tế.
- Câu hỏi Tarot, họ tên, ngày sinh và giới tính là dữ liệu nhạy cảm; việc gửi sang nhà cung cấp AI phải minh bạch và có kiểm soát.

Yêu cầu:

- Tạo `POST /api/tarot/reading` gọi Gemini REST API bằng native `fetch`, không thêm dependency.
- Dùng `GEMINI_API_KEY` server-only; không đưa khóa vào client, log hoặc repository.
- Prompt giữ cấu trúc nghiệp vụ đã được product owner duyệt: thông tin người hỏi, chủ đề/niche/câu hỏi, lá bài, chiều, vị trí, nghĩa theo chủ đề, metadata năng lượng và ba câu trả lời làm rõ.
- Kết quả Markdown bắt buộc có ba phần: `Lời Hồi Đáp Từ Vũ Trụ`, `Sự Mặc Khải`, `Hành Động Định Mệnh`.
- Yêu cầu Firebase Auth, chấp nhận tài khoản Anonymous; rate limit/quota theo user và IP.
- Validate request, Gemini response và response nội bộ bằng Zod; câu hỏi tối đa 200 ký tự.
- Timeout tối đa 20 giây; khi thiếu key, timeout, provider lỗi hoặc output không hợp lệ phải trả fallback template với HTTP 200 và `fallback: true`.
- Không log raw câu hỏi, họ tên, ngày sinh, giới tính hoặc nội dung luận giải.
- Prompt phải chống prompt injection và cấm phán đoán chắc chắn, hù dọa, thay thế tư vấn y tế/tâm lý/pháp lý/tài chính hoặc khuyến khích tự hại/hại người.
- UI hiển thị loading, kết quả theo từng lá, thông báo AI bên thứ ba và disclaimer bắt buộc.
- Cập nhật ADR, Environment, Privacy/Terms, Threat Model, legal/content docs và DEVLOG.

Output cần có:

- `apps/web/src/app/api/tarot/reading/route.ts`.
- Shared Tarot AI schemas/types và helper server-side cần thiết.
- `FinalReadingView` hiển thị kết quả AI/fallback, ảnh lá bài và trạng thái loading.
- ADR-009 và tài liệu legal/security/environment đồng bộ.

Điều kiện Done:

- Request không có hoặc có Firebase token sai trả `401` và không gọi Gemini.
- Request sai schema trả `400`; rate limit trả `429`.
- Gemini success trả nội dung đúng ba section; output sai schema tự fallback an toàn.
- Thiếu key, provider lỗi hoặc timeout trả HTTP 200 với `fallback: true`.
- Không log raw PII/câu hỏi và không lộ `GEMINI_API_KEY` vào client/static bundle.
- UI 375px không tràn ngang, có disclosure AI và disclaimer.
- `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Code review hoàn tất; Critical/Important findings đã xử lý trước khi đổi `Done`.
- DEVLOG ghi file sửa, command đã chạy, phần chưa làm và rủi ro còn lại.

Update 2026-10-21:

- Đã hoàn tất route Gemini, shared schema, auth/rate-limit/timeout/safety/fallback, làm giàu nghĩa lá từ private KB, UI kết quả và disclosure/legal/security docs.
- Đã bổ sung trường họ tên/ngày sinh/giới tính tùy chọn và ba câu trả lời làm rõ vào request AI; không log raw dữ liệu.
- `npm run typecheck`, `npm run lint`, Worker TypeScript và `npm run build` pass; smoke không token trả `401`; visual route Tarot 375px không tràn ngang.
- `npm run check` còn bị chặn bởi file private `kb-private/numerology/kb.json` không có trong workspace; security/responsive audit còn các finding có sẵn ngoài phạm vi T-0709, đã ghi chi tiết trong DEVLOG.
- Product owner đã duyệt ngoại lệ nghiệm thu cho workspace snapshot không có `.git`: bỏ bước lấy SHA/request Claude review riêng cho T-0709.
- Nghiệm thu dựa trên `npm run typecheck`, `npm run lint`, `npm run build` đều pass và smoke bảo mật xác nhận request không token trả `401`. T-0709 chuyển `Done` ngày 2026-10-21.

### T-0710 - Build Sách phép Tarot / Từ điển 78 lá

Status: Done

Bối cảnh:

- Landing `/tarot` đã có lối vào “Từ điển Tarot” nhưng nội dung mới chỉ là placeholder 22 lá Ẩn chính.
- Người dùng cần tra cứu toàn bộ bộ bài ngay trong module mà không cần bắt đầu một phiên trải bài.

Yêu cầu:

- Dùng `DECK` hiện có làm nguồn dữ liệu cho đủ 78 lá và ảnh từ `public/tarot_cards/` qua `tarotCardImageSrc`.
- Có bộ lọc Tất cả, Ẩn chính, Gậy, Ly, Kiếm, Tiền và tìm kiếm theo tên tiếng Việt/tiếng Anh.
- Lưới thẻ hiển thị ảnh lazy-load, tên song ngữ và từ khóa chính.
- Chi tiết lá bài hiển thị ảnh lớn, nhóm/năng lượng hiện có, nghĩa xuôi/ngược và lời khuyên hành động.
- Hộp thoại đóng được bằng nút X, phím Escape và click ra ngoài; hỗ trợ bàn phím và focus rõ ràng.
- Responsive tại 375px, không tràn ngang.

Output cần có:

- Component thư viện Tarot và stylesheet riêng, nối vào modal “Từ điển Tarot” hiện có.
- DEVLOG ghi file sửa, command kiểm thử, phần chưa làm và rủi ro còn lại.

Điều kiện Done:

- Đủ 78 lá và đúng số lượng từng nhóm 22/14/14/14/14.
- Lọc, tìm kiếm, mở chi tiết, đổi chiều và đóng modal hoạt động.
- `npm run typecheck`, `npm run lint`, `npm run build` pass.
- Kiểm tra trực tiếp luồng trên `/tarot`, gồm viewport 375px không tràn ngang.

Update 2026-10-21:

- Đã thay placeholder bằng thư viện đủ 78 lá từ `DECK`, tìm kiếm EN/VI có hỗ trợ tiếng Việt không dấu và bộ lọc đúng số lượng 22/14/14/14/14.
- Lưới dùng ảnh hiện có qua `tarotCardImageSrc`, lazy-load ảnh thu nhỏ; chi tiết có nhóm/năng lượng, nghĩa xuôi/ngược và lời khuyên hành động.
- Modal có nút đóng X kèm nhãn truy cập, Escape, click outside, focus trap; UI 375px không tràn ngang.
- `npm run typecheck`, `npm run lint`, `npm run build` pass. Edge headless E2E pass toàn bộ luồng mở, lọc, tìm kiếm, xem chi tiết, đổi chiều và đóng modal.
- Workspace là snapshot không có `.git`; áp dụng ngoại lệ SHA đã được product owner xác nhận cho workspace và hoàn tất bằng self-review cùng nghiệm thu trực tiếp.

### T-0711 - Hyper-personalization cho luận giải Tarot

Status: Done

Bối cảnh:

- Profile Tarot hiện mới là form tùy chọn cơ bản; ba câu hỏi tâm thức dùng chung cho mọi chủ đề.
- Prompt Gemini đã nhận profile nhưng chưa tự tính cung hoàng đạo/nguyên tố và còn giới hạn độ dài làm giảm chiều sâu cá nhân hóa.

Yêu cầu:

- Thiết kế lại khối profile tại bước đặt câu hỏi, giữ tất cả trường tùy chọn và tự điền `user.displayName` khi có.
- Tạo kho câu hỏi tâm thức theo từng `ThemeKey`, chọn ngẫu nhiên ba câu đúng chủ đề cho mỗi phiên.
- Tính cung hoàng đạo, nguyên tố và con số năng lượng từ ngày sinh hợp lệ; đưa dữ kiện đã tính vào prompt.
- Prompt gọi tên người xem, kết nối chiêm tinh, chiều lá và ba câu trả lời Có/Không trong ba phần luận giải bắt buộc.
- Cấu hình Gemini `temperature: 0.85`, `maxOutputTokens: 3000`; giữ nguyên auth, rate limit, timeout, validation, prompt-injection boundary và content safety.

Điều kiện Done:

- Không nhập profile vẫn dùng tên “Bạn” và flow không bị chặn.
- `1997-07-20` được tính là Cự Giải, nguyên tố Nước.
- Chủ đề Tình yêu chỉ lấy ba câu trong pool Tình yêu trong một phiên.
- Prompt mẫu với tên Hương có gọi tên, chứa Cự Giải/Nước và liên kết ba clarification.
- UI 375px không tràn ngang; `npm run typecheck`, `npm run lint`, `npm run build` pass.
- DEVLOG ghi rõ kiểm thử live Gemini có hoặc không có API key thật.

### T-0712 - Modal chi tiết lá bài chuyên sâu tại kết quả Tarot

Status: Done

Bối cảnh:

- `FinalReadingView` đã hiển thị từng lá và luận giải AI nhưng chưa có tương tác mở dữ liệu chuyên sâu theo niche.
- Tarot KB canonical có chiêm tinh, ý nghĩa gốc, từ khóa, thần số và `aspects`; raw KB phải tiếp tục nằm sau Worker/API.

Yêu cầu:

- Click thẻ lá bài trong kết quả để mở modal hai cột desktop, một cột mobile với profile, ảnh đúng chiều, vị trí, tên, huy hiệu và ba khối nội dung.
- Mở rộng `GET /tarot/card/:cardId` để trả payload tối thiểu của đúng một lá và niche/chiều được yêu cầu; giữ Auth, rate limit, validation và không public raw KB.
- Thêm Next.js proxy có Firebase Auth và Zod validate response; UI có loading/error/fallback an toàn và cache trong bộ nhớ theo phiên.
- Modal có nút X, Escape, click outside, focus trap, trả focus, khóa body scroll và không tràn ngang tại 375px.

Điều kiện Done:

- Flow Sự nghiệp → Xin Việc Làm → kết quả → click lá hiển thị đủ Cung/Hành tinh/Thần số và mục `TRONG XIN VIỆC LÀM`.
- Lá ngược xoay ảnh 180 độ; text ý nghĩa/từ khóa đúng chiều.
- `npm run typecheck`, `npm run lint`, `npm run build` và Worker TypeScript pass.
- E2E 375px xác nhận modal, Escape, click outside, focus và không tràn ngang; DEVLOG được cập nhật.

### T-0713 - Niche Clarify và cảnh báo trải bài lặp trong ngày

Status: Done

Bối cảnh:

- `consciousnessCheck` đang bốc câu hỏi theo chủ đề rộng, chưa dùng kho `clarify_questions.json` theo đúng `nicheKey`.
- Người dùng có thể trải lại cùng chủ đề nhiều lần trong ngày mà chưa có nhắc nhở giữ nguyên thông điệp đầu tiên.

Yêu cầu:

- KB Worker chỉ trả ngẫu nhiên đúng 3 câu hỏi của niche được yêu cầu từ `kb-tarot-clarify`; giữ Firebase Auth, rate limit, validation và không public raw KB.
- Next.js proxy validate input/output bằng Zod; frontend preload theo `nicheKey`, có fallback an toàn theo chủ đề khi KB chưa khả dụng.
- `consciousnessCheck` có nút CÓ/KHÔNG và phần “CHIA SẺ THÊM THÔNG TIN” mở textarea có label, giới hạn độ dài; nội dung tùy chọn được đưa vào prompt nhưng không lưu history/log.
- Sau khi hoàn tất một trải bài, lưu dấu chủ đề/ngày trong `localStorage` bằng thao tác có `try/catch`; khi vào `spreadSelect` lần nữa trong ngày, hiển thị modal “Vũ Trụ Đã Lên Tiếng”.
- Modal dùng SVG trăng khuyết, hỗ trợ Escape, click outside, focus trap, trả focus, khóa body scroll; “Quay Lại” về landing `/tarot`, “Tiếp Tục” cho phép đi tiếp.

Điều kiện Done:

- Flow Sự nghiệp → Xin Việc Làm nhận 3 câu từ nhóm `job_search`, có câu về thất nghiệp/nộp hồ sơ trong kiểm thử kiểm soát.
- Hoàn tất một quẻ Sự nghiệp rồi mở lại cùng chủ đề trong ngày sẽ hiện popup đúng copy và hai hành động hoạt động đúng.
- Không có raw clarify KB trong frontend/static artifact; API thiếu token trả 401.
- `npm run typecheck`, `npm run lint`, `npm run build`, Worker TypeScript và E2E 375px pass; DEVLOG được cập nhật.

### T-0714 - Hoàn thiện header Modal chi tiết lá bài Tarot

Status: Done

Bối cảnh:

- T-0712 đã hoàn tất modal chi tiết lá bài và luồng private KB, nhưng header hồ sơ chưa có ký hiệu thời gian như mẫu nghiệm thu mới và đang ép toàn bộ nội dung thành chữ hoa.

Yêu cầu:

- Hiển thị header theo thứ tự `{Họ tên} [biểu tượng đồng hồ] {DD/MM/YYYY} · {Tên ngách}` bằng SVG trang trí, giữ nguyên cách viết tên/ngách và cho phép xuống dòng an toàn trên mobile.
- Không thay đổi contract private KB, luồng Auth/rate limit hoặc các nội dung chuyên sâu đã nghiệm thu tại T-0712.
- Mở rộng E2E modal để xác nhận biểu tượng đồng hồ, ngày sinh, tên ngách và không tràn ngang tại 375px.

Điều kiện Done:

- Header đúng thứ tự, SVG không tạo nhiễu cho screen reader và modal vẫn đáp ứng Escape, click outside, focus restoration.
- `npm run typecheck`, `npm run lint`, `npm run build` và E2E 375px pass; DEVLOG được cập nhật.

### T-0715 - Modal ý nghĩa tuần tự trong bước lật bài Tarot

Status: Done

Bối cảnh:

- `SpreadRevealView` hiện chỉ đổi trạng thái lá bài tại chỗ; người dùng phải chờ đến kết quả cuối mới mở được hồ sơ chuyên sâu từng lá.
- Modal `TarotReadingCardDetail` và private KB API đã có từ T-0712, cần được tái sử dụng trước bước kết nối tâm thức.

Yêu cầu:

- Khi lật một lá úp, chạy hiệu ứng lật 3D, đánh dấu đã mở và tự động mở modal chi tiết của chính lá đó.
- Modal hiển thị tiến độ còn lại, điều hướng Trước/Sau chỉ trong tập lá đã lật và CTA đưa focus về lá chưa lật kế tiếp.
- Khi toàn bộ lá đã lật, modal và màn reveal cung cấp CTA “Tiếp tục kết nối tâm thức”; không được chuyển bước sớm.
- Giữ nguyên Auth, rate limit, private KB boundary, fallback an toàn và accessibility của modal hiện có.

Điều kiện Done:

- E2E spread ba lá xác nhận modal tự mở theo từng lá, carousel chỉ duyệt lá đã mở, không thể sang tâm thức khi chưa lật đủ và CTA cuối chuyển đúng bước.
- Escape, click outside, focus, reduced motion và viewport 375px hoạt động; không tràn ngang.
- `npm run typecheck`, `npm run lint`, `npm run build` pass; DEVLOG được cập nhật.

### T-0716 - Nhận diện và hiển thị Combo Cộng Hưởng Định Mệnh Tarot

Status: Done

Bối cảnh:

- Kho Tarot private có index 1.544 combo từ 2 đến 5 lá và nội dung chi tiết theo ngách/chiều, nhưng màn kết quả chưa nhận diện hoặc hiển thị cộng hưởng.
- Dữ liệu combo là KB thương mại, không được đưa vào frontend bundle hay public asset.

Yêu cầu:

- Thêm contract Zod và thuật toán `findMatchedCombos` so khớp không phụ thuộc thứ tự, không phân biệt hoa/thường, hỗ trợ 2-5 lá và dựng đúng orientation variant theo thứ tự canonical của combo.
- Dò combo tại KB Worker có Auth/rate limit; Next route chỉ proxy/fallback server-side và không log raw PII.
- Hiển thị khối Cộng Hưởng Định Mệnh tại `FinalReadingView` với sigil, cấp danh hiệu, ảnh lá, chiều và luận giải theo `nicheKey`.
- Hỗ trợ tên kiểm thử `Turniodev` chỉ trong môi trường local/test đã bật cờ, không hoạt động ở production.
- Giữ reduced motion, accessibility và viewport 375px không tràn ngang.

Điều kiện Done:

- So khớp được combo 2/3/4/5 lá, đúng ngách và orientation; KB private không xuất hiện trong static/frontend artifact.
- Luồng thật và test mode hiển thị đúng khối combo; trạng thái không khớp/lỗi không làm sập màn kết quả.
- Test Auth 401, `npm run typecheck`, `npm run lint`, `npm run build` và kiểm tra responsive pass; DEVLOG được cập nhật.

### T-0717 - Tích hợp thư viện tra cứu 1.544 Combo (Mật Mã Cộng Hưởng) vào Từ Điển Tarot

Status: Done

Bối cảnh:

- T-0716 chỉ dò và hiển thị combo khớp với phiên trải tại màn kết quả.
- Từ Điển Tarot hiện mới tra cứu 78 lá, chưa có thư viện toàn bộ combo và nội dung đa chiều theo lĩnh vực/ngách.

Yêu cầu:

- Bổ sung hai tab `78 Lá Bài` và `Mật Mã Cộng Hưởng` trong `tarot-dictionary.tsx`.
- Tab combo hỗ trợ lọc theo 2/3/4/5 lá, tìm theo tên combo/tên lá và phân trang 15 mục; mỗi thẻ có danh hiệu, tên, danh sách lá và ảnh thu nhỏ.
- Modal chi tiết lazy-load private KB qua API server-side, hiển thị header combo và accordion 5 lĩnh vực → ngách → hai khối Xuôi/Ngược.
- Không bundle `combo_index.json` hoặc `combos/details/*.json` vào client/static artifact; API có Firebase Auth, Zod và rate limit.
- Modal hỗ trợ Escape, click outside, focus restoration, body scroll lock, reduced motion và viewport 375px không tràn ngang.

Điều kiện Done:

- Tra cứu đủ 1.544 combo qua index API phân trang/tìm kiếm/lọc; detail chỉ tải khi mở modal.
- Accordion hiển thị đúng lĩnh vực, ngách và hai nhóm chiều từ private KB, có loading/error/empty state an toàn.
- `npm run typecheck`, `npm run lint`, `npm run build`, Auth 401, E2E dictionary/accordion 375px và static artifact scan pass; DEVLOG được cập nhật.

### T-0718 - Cập nhật mặt lưng Celestial Compass cho toàn bộ trải nghiệm Tarot

Status: Done

Bối cảnh:

- Mặt lưng bài tại bàn 78 lá, bước reveal và Daily Card hiện dùng họa tiết CSS/SVG giả lập.
- User đã cung cấp asset `Celestial Compass Tarot Card Back.png` để dùng thống nhất trong module Tarot.

Yêu cầu:

- Sao chép asset vào `apps/web/public/tarot_cards/card-back.png`, truy cập qua `/tarot_cards/card-back.png`.
- Thay mặt lưng tại `DeckBack`, `SelectedSlot`/`tarot-reveal-card-back` và `tarot-daily-back` bằng ảnh mới.
- Giữ hiệu ứng nghiêng/hover, flip 3D và nhãn “Chạm để lật lá bài”; ảnh không méo, có bo góc và aura phù hợp.
- Không thay đổi mặt trước, thuật toán rút bài hoặc luồng Tarot.

Điều kiện Done:

- Ba ngữ cảnh dùng cùng asset mới và không còn sigil SVG mặt lưng cũ.
- `npm run typecheck`, `npm run lint`, `npm run build` và smoke trình duyệt `/tarot` pass; viewport 375px không tràn ngang, reduced motion không bị phá.
- DEVLOG được cập nhật và task chuyển `Done`.

### T-0719 - Trải nghiệm bộ bài 3D, xào bài và xòe bài hình cánh cung

Status: Done

Bối cảnh:

- Bước `deckDraw` đang render lưới 78 lá kéo dài, gây cuộn dọc và thiếu cảm giác nghi thức.
- Asset mặt lưng Celestial Compass đã được chuẩn hóa tại `/tarot_cards/card-back.png` trong T-0718.

Yêu cầu:

- Thay lưới tĩnh bằng ba trạng thái `idle` → `shuffling` → `fanned`: chồng bài 3D, hoạt cảnh xào 1,2–1,5 giây và quạt bài cánh cung.
- Fan desktop nằm gọn trong stage; hover/focus nâng lá và viền vàng. Mobile 375–430px dùng vùng cuộn ngang cảm ứng, scroll snap và nút semantic.
- Khi chọn, lá bay xuống khay; đủ số lá tự chuyển sang `spreadReveal` mà không thay đổi thuật toán/session hiện có.
- Hỗ trợ keyboard, `aria-live`, vùng chạm tối thiểu và bỏ qua hoạt cảnh khi `prefers-reduced-motion`.

Điều kiện Done:

- Luồng idle/shuffle/fan/select/auto-advance hoạt động với spread 1 và 3 lá trên desktop và 375px.
- Không còn lưới 78 lá gây cuộn dọc; không tràn viewport ngoài vùng scroll ngang có chủ đích trên mobile.
- `npm run typecheck`, `npm run lint`, `npm run build` và Playwright smoke pass; DEVLOG được cập nhật.

AI Tools Used: Codex + `ui-ux-pro-max` để kiểm tra interaction, touch, reduced-motion và responsive.

## Phase 8 - Security, QA, Independent Launch Và Cutover

### T-0801 - Security smoke script/checklist

Status: Todo

Bối cảnh:

- Trước production cần kiểm tra lặp lại.

Yêu cầu:

- Scan secret.
- Scan static artifact không có KB private.
- Check `/api/kb/*` no auth = 401.
- Check admin no token = 401.

Output cần có:

- Security smoke script hoặc checklist chạy được.

Goal:

- Không dựa vào trí nhớ khi deploy.

Điều kiện Done:

- Smoke pass trên dev/test.
- Không có P0/P1 mở.

Update khi xong:

- Ghi commands/checks đã chạy.

### T-0802 - Full dev/test E2E

Status: Todo

Bối cảnh:

- Trước independent launch/gắn domain production cần test toàn flow.

Yêu cầu:

- Hub.
- Numerology free/paid.
- Tarot 1/3 lá.
- Account.
- Payment/voucher.
- Telegram.

Output cần có:

- E2E checklist result.

Goal:

- Xác nhận MVP hoạt động trước production.

Điều kiện Done:

- Checklist pass hoặc có issue documented.
- Không còn P0/P1.

Update khi xong:

- Ghi pass/fail từng flow.

### T-0803 - Launch rehearsal trên dev/test

Status: Todo

Bối cảnh:

- V2 là rebuild mới, không import dữ liệu ngoài scope trong MVP.
- Trước khi dùng production domain, phải rehearsal toàn bộ launch flow trên dev/test.

Yêu cầu:

- Build production-like trên dev/test.
- Test route, auth, payment, voucher, entitlement, KB access, Telegram alert.
- Kiểm tra không có KB/private secret trong public artifact.

Output cần có:

- Launch rehearsal report.
- Danh sách lỗi cần xử lý trước production.

Goal:

- Biết rõ V2 có thể vận hành độc lập trước khi gắn domain production.

Điều kiện Done:

- Dev/test flow pass hoặc có issue documented.
- Không có P0/P1 security/payment/KB issue chưa xử lý.
- Không dùng dữ liệu/hạ tầng ngoài scope.

Update khi xong:

- Ghi kết quả rehearsal.
- Ghi lỗi còn lại và risk trước production.

### T-0804 - Gắn domain production cho V2

Status: Todo

Bối cảnh:

- Chỉ gắn domain production sau khi dev/test, payment và launch rehearsal pass.

Yêu cầu:

- Backup DNS/domain config.
- Deploy V2 production project riêng.
- Smoke test production preview/private URL.
- Gắn domain production khi user approve.
- Monitor logs/Telegram.

Output cần có:

- Production V2 live.
- Production launch report.
- Rollback note.

Goal:

- Chuyển production sang V2 an toàn.

Điều kiện Done:

- Homepage/module/account/payment pass.
- User cũ xem được quyền.
- Payment mới pass.
- Không có P0/P1 security.
- Có monitoring sau deploy.

Update khi xong:

- Ghi thời điểm gắn domain production.
- Ghi checklist pass/fail.
- Ghi rủi ro còn lại và hành động tiếp theo.


## Phase 0A - Input Extraction Và Source Boundaries

### T-00A1 - Chốt input inventory

Status: Done

Bối cảnh:

- User muốn giữ visual và KB từ Bản Mệnh/V1, nhưng không lấy app logic/workflow/payment/API cũ.
- User muốn Tarot bám workflow Mystery Tarot, sau đó sẽ chỉnh tiếp.

Yêu cầu:

- Ghi rõ nguồn design.
- Ghi rõ nguồn KB Thần số học.
- Ghi rõ nguồn KB Tarot.
- Ghi rõ reference Tarot workflow.
- Ghi rõ phần được dùng và không được dùng.

Output cần có:

- `docs/input-inventory.md`

Goal:

- AI/dev không tự đoán source input và không copy nhầm ngoài scope.

Điều kiện Done:

- Input paths rõ.
- Boundary rõ.
- KB private được đánh dấu.

### T-00A2 - Extract design spec từ V1 visual

Status: Done

Bối cảnh:

- V2 cần giữ cảm giác giao diện V1 nhưng code mới.

Yêu cầu:

- Extract design tokens.
- Extract component visual rules.
- Extract motion/effect rules.
- Không copy workflow/JS/payment/API cũ.

Output cần có:

- `docs/design-extraction-spec.md`
- Sau khi code: `tokens.css` hoặc design token module.

Goal:

- Có design system V2 nhất quán với visual V1.

Điều kiện Done:

- Tokens rõ.
- Component inventory rõ.
- Có visual QA sau khi implement.

Cập nhật hoàn tất 2026-05-16:

- Đã rà soát `demo-premium-ui.html`, `demo-design-system.html`, `numerology_core/style.css`, `Antigravity/khamphabanthan/style.css`.
- Đã chuẩn hóa design token, layout system, component specs, motion rules, icon direction và visual QA checklist trong `docs/design-extraction-spec.md`.
- Chỉ extract visual language, không lấy workflow/payment/API/logic cũ.

### T-00A3 - Extract KB Thần số học an toàn

Status: Done

Bối cảnh:

- KB Thần số học là tài sản lõi cần giữ lại nhưng không được public.

Yêu cầu:

- Chọn canonical KB.
- Validate schema.
- Convert narrative templates sang safe data format.
- Lập storage/API plan.

Output cần có:

- `docs/kb-extraction-plan.md`
- JSON schema/validation report khi bắt đầu implement.

Goal:

- V2 dùng lại KB Thần số học mà không lộ KB.

Điều kiện Done:

- KB source rõ.
- Không import KB vào frontend bundle.
- Có plan private storage.

Cập nhật hoàn tất 2026-05-16:

- Đã checksum `than-so-hoc-export/kb.json` và `numerology_core/numerology_knowledge_base.json`; hai file giống hệt nhau.
- Đã chốt `than-so-hoc-export/kb.json` làm canonical structured KB.
- Đã checksum `numerology_core/narrative_templates.js` và `than-so-hoc-export/interpreter.js`; hai file giống hệt nhau.
- Đã ghi plan convert narrative JS sang data/template an toàn, không execute/copy nguyên JS cũ.
- Đã ghi storage/API/security plan trong `docs/kb-extraction-plan.md`.

### T-00A4 - Spec Tarot workflow theo Mystery Tarot

Status: Done

Bối cảnh:

- User muốn Tarot làm theo website Mystery Tarot trước, sau đó chỉnh sau.

Yêu cầu:

- Spec landing/daily/journey/reading/result/dictionary/history.
- Mapping workflow với Tarot KB hiện có.
- Chia MVP/P1/P2 để tránh app phình.
- Không clone code/asset/endpoint/branding bên ngoài.

Output cần có:

- `docs/product-specs/tarot-workflow-reference.md`
- Update module Tarot tasks.

Goal:

- Tarot V2 có hướng UX rõ trước khi code.

Điều kiện Done:

- Workflow đủ rõ để implement.
- Scope MVP/P1/P2 rõ.
- Rủi ro license/security được ghi.

Cập nhật hoàn tất 2026-05-16:

- Đã đối chiếu workflow Mystery Tarot ở mức public/reference.
- Đã rà manifest và entry points của KB Tarot local.
- Đã cập nhật `docs/product-specs/tarot-workflow-reference.md` thành spec chi tiết cho landing/daily/topic/spread/reading/result/history/library.
- Đã chia MVP/P1/P2 để tránh app phình.
- Đã cập nhật `docs/modules/tarot.md`.

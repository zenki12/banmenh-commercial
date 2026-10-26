# Bản Mệnh V2 Screen Spec

Ngày cập nhật: 2026-05-13

Tài liệu này mô tả màn hình, trạng thái và tiêu chí pass/fail để AI/dev không tự diễn giải quá rộng.

## 1. Global Layout

Áp dụng cho tất cả route:

- Header có logo, module navigation, pricing, account, upgrade.
- Footer chỉ xuất hiện ở cuối trang, không xen giữa nội dung module.
- Nút quay lại Dashboard dùng cùng tên: `← Dashboard`.
- Vị trí nút Dashboard:
  - Trang module: góc trên trái vùng content.
  - Trang kết quả: cạnh nút quay lại/tóm tắt nếu có.
- Mobile không được che CTA chính.

State bắt buộc:

- Loading.
- Empty.
- Error có hướng dẫn hành động.
- Unauthorized.
- Payment pending.
- Payment success.
- Payment expired.

## 2. Hub `/`

Mục tiêu: cho user hiểu Bản Mệnh là hub các hệ thống luận giải.

Nội dung:

- Hero: “Khám Phá Bản Thân”.
- CTA chính: “Bắt đầu miễn phí”.
- CTA phụ: “Đăng nhập bằng Google”.
- Module cards: Thần số học, Tarot, Tử vi, Ma trận định mệnh, Chòm sao, Bát tự.

Tiêu chí pass:

- Click module Thần số học mở `/than-so-hoc`.
- Click module Tarot mở `/tarot`.
- Không có text lỗi encoding.
- Icon module thống nhất giữa dashboard và pricing.

## 3. Thần Số Học `/than-so-hoc`

Form:

- Họ và tên khai sinh: required.
- Tên thường dùng / biệt danh: optional.
- Giới tính: Nam/Nữ.
- Ngày/tháng/năm sinh dương lịch: required.

Submit:

- CTA: “Tra cứu Thần số học ngay”.
- Validate input trước khi gọi API.
- Nếu API fail: hiện lỗi dễ hiểu, không chỉ “Failed to fetch”.

Kết quả free:

- Có phần tóm tắt.
- Có CTA nâng cấp.
- Không lộ toàn bộ 30 chỉ số.

Tiêu chí pass:

- Nhập data hợp lệ nhận kết quả.
- Reload trang kết quả không vỡ.
- CTA nâng cấp dẫn tới payment đúng module/report.

## 4. Kết Quả Thần Số Học

Header:

- Tiêu đề rõ: “Báo cáo Thần số học”.
- Tên user và ngày sinh.
- Nút: `← Tóm tắt`, `← Dashboard`.

Free CTA:

- Copy đề xuất:
  - “Bạn đang xem bản tóm tắt miễn phí. Mở khóa bản đầy đủ để xem trọn bộ chỉ số, phân tích từng giai đoạn cuộc đời và tải báo cáo cá nhân hóa.”
  - Bullet: “30 chỉ số chuyên sâu”, “Diễn giải theo từng giai đoạn”, “Lưu và xem lại bất cứ lúc nào”.
- Không dùng claim “gặp chuyên gia” nếu không có dịch vụ thật.

Paid:

- Không hiện CTA nâng cấp.
- Có quyền tải/lưu nếu tính năng đã build thật.

## 5. Tarot `/tarot`

Landing:

- Daily Message popup nếu user chưa xem trong ngày.
- CTA chính: “Bắt đầu hành trình”.
- CTA phụ: “Lịch sử trải bài”, “Từ điển Tarot”.

Wizard MVP:

1. Chọn chủ đề.
2. Chọn câu hỏi gợi ý hoặc tự nhập.
3. Chọn spread 1 hoặc 3 lá.
4. Shuffle/chọn bài.
5. Flip bài.
6. Xem kết quả.

Tiêu chí pass:

- Không trả kết quả trước khi user chọn đủ lá.
- Mỗi lá hiển thị tên, chiều xuôi/ngược, vị trí và ý nghĩa.
- Kết quả có disclaimer tham khảo.

## 6. Pricing / Upgrade

Yêu cầu:

- Thần số học: 49.000đ / 1 bản luận giải.
- Tarot entitlement của V2 thiết kế mới; không tự kế thừa gói Tarot cũ.
- Nếu có tier Tarot mới, phải hiển thị rõ quyền từng tier.
- Voucher error message bằng tiếng Việt có dấu.

Payment screen:

- Hiển thị QR, số tiền, nội dung chuyển khoản, countdown.
- Nếu thành công: hiện trạng thái thành công và nút unlock/xem kết quả.
- Nếu hết hạn: yêu cầu tạo QR mới.
- Nếu lỗi: có nút thử lại và hỗ trợ.

## 7. Account

MVP:

- Hiển thị thông tin user.
- Danh sách quyền đã mua.
- Nhóm Thần số học gồm lịch sử tra cứu chưa mở khóa và danh sách báo cáo đã mua trọn đời; một tài khoản có thể lưu nhiều report cho nhiều người.
- Báo cáo chưa mở có CTA thanh toán gắn đúng `reportId`; báo cáo đã mở có CTA đọc toàn bộ nội dung.
- Nhóm Tarot hiển thị lịch sử phiên cloud của tài khoản, gồm lượt free và lượt dùng gói/voucher.
- Logout.

Không làm trong MVP:

- Billing portal phức tạp.
- Subscription management nếu chưa có subscription thật.


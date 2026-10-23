# Bản Mệnh V2 Legal & Commercial Spec

Ngày cập nhật: 2026-05-13

Tài liệu này không thay thế tư vấn luật sư. Đây là spec sản phẩm để tránh claim sai, thiếu disclaimer hoặc vận hành thanh toán mập mờ.

## 1. Nguyên Tắc

- Nội dung huyền học chỉ mang tính tham khảo/tự phản tỉnh.
- Không claim chắc chắn tương lai, chữa bệnh, cam kết tài chính hoặc thay thế chuyên gia.
- Giá, quyền truy cập, thời hạn, hoàn tiền phải rõ trước khi user thanh toán.
- Luận giải Tarot chuyên sâu có thể được Gemini hỗ trợ tạo nội dung theo ADR-009.
- UI, Privacy/Terms phải nói rõ việc dùng AI và không được claim “Không AI” cho flow này.

## 2. Disclaimer Bắt Buộc

Đặt ở footer, trang kết quả và Terms:

```text
Nội dung trên Bản Mệnh chỉ mang tính tham khảo, hỗ trợ tự phản tỉnh và giải trí có định hướng. Kết quả không thay thế tư vấn y tế, tâm lý, pháp lý, tài chính hoặc các quyết định chuyên môn. Bạn chịu trách nhiệm với các quyết định cá nhân của mình.
```

Không được dùng:

- “Chính xác tuyệt đối”.
- “Cam kết thay đổi vận mệnh”.
- “Đảm bảo giàu có/kết hôn/thăng chức”.
- “Chẩn đoán bệnh”.
- “Tư vấn tài chính/pháp lý chuyên nghiệp”.

## 3. Privacy Requirements

Dữ liệu có thể thu thập:

- Email/tên tài khoản Google.
- Họ tên khai sinh.
- Tên thường dùng/biệt danh.
- Ngày sinh.
- Giới tính.
- Câu hỏi Tarot.
- Lịch sử thanh toán.
- Lịch sử report/reading nếu user đăng nhập.

Privacy copy phải nói rõ:

- Thu thập dữ liệu gì.
- Dùng để làm gì.
- Lưu trong bao lâu.
- Ai có quyền truy cập.
- Có gửi sang bên thứ ba không.
- User yêu cầu xóa dữ liệu như thế nào.

Các module dùng công thức/KB xác định trước có thể mô tả:

```text
Kết quả này được tạo từ hệ thống công thức và kho tri thức nội bộ của Bản Mệnh; phần này không sử dụng AI tạo sinh.
```

Đối với luận giải Tarot có AI theo ADR-009:

```text
Thông tin của phiên Tarot, gồm tên hiển thị nếu có, ngày sinh/giới tính nếu bạn cung cấp, chủ đề, câu hỏi, lá bài và câu trả lời làm rõ, có thể được gửi tới Google Gemini để hỗ trợ cá nhân hóa diễn giải. Bản Mệnh không gửi thông tin thanh toán, thông tin xác thực hoặc admin secret sang nhà cung cấp AI.
```

Không được để hai claim mâu thuẫn. Nếu bật AI sau này, phải cập nhật Privacy/Terms trước khi deploy production.

## 4. Terms Requirements

Terms cần có:

- Mô tả dịch vụ.
- Điều kiện sử dụng.
- Tài khoản và bảo mật tài khoản.
- Thanh toán.
- Voucher/khuyến mại.
- Chính sách hoàn tiền.
- Giới hạn trách nhiệm.
- Quyền sở hữu nội dung/KB.
- Hành vi bị cấm.
- Cách liên hệ hỗ trợ.

## 5. Refund Policy

Đề xuất chính sách rõ và dễ vận hành:

```text
Với sản phẩm luận giải số được mở khóa ngay sau thanh toán, Bản Mệnh chỉ hỗ trợ hoàn tiền khi có lỗi kỹ thuật khiến bạn không thể truy cập nội dung đã mua và đội ngũ hỗ trợ không thể khắc phục trong thời gian hợp lý.
```

Cần nói rõ:

- Không hoàn tiền vì user “không thấy đúng”.
- Có hỗ trợ nếu thanh toán thành công nhưng không unlock.
- Thời hạn gửi yêu cầu hỗ trợ: ví dụ 7 ngày từ lúc thanh toán.
- Kênh hỗ trợ: Zalo/email.

## 6. Voucher Policy

Voucher phải hiển thị rõ:

- Mã voucher.
- Giá trị giảm.
- Module áp dụng.
- Thời hạn.
- Giới hạn số lượt.
- Giới hạn mỗi user nếu có.

Thông báo lỗi chuẩn:

- “Mã voucher không tồn tại.”
- “Mã voucher đã hết hạn.”
- “Mã voucher đã hết lượt sử dụng.”
- “Mã voucher không áp dụng cho gói này.”
- “Bạn đã dùng mã này trước đó.”

## 7. Pricing Copy

Giá chính thức và copy pricing đến từ `packages/shared/src/pricing.ts` (T-0401). File này là nguồn sự thật duy nhất. Tài liệu này phải phản ánh đúng giá đã chốt trong code.

Thần số học:

- "99.000₫ / 1 báo cáo" — mở khóa vĩnh viễn cho hồ sơ đã mua.
- Không dùng chữ "không giới hạn" nếu chỉ áp dụng cho một report.

Tarot (subscription, KHÔNG auto-renew):

- Tarot 1 tháng: "29.000₫ / 30 ngày" — trải bài 1/3 lá không giới hạn và mở trải bài 5/7/10/12 lá.
- Tarot 3 tháng: "79.000₫ / 90 ngày" — cùng quyền lợi trải bài trong 90 ngày, tiết kiệm ~9% so với mua từng tháng.
- Phải ghi rõ "Hiệu lực X ngày" — không gọi là subscription tự động.
- Không auto-renew; có Telegram reminder 3 ngày trước hết hạn (T-0504b).
- Không hứa quyền/gói ngoài scope trong V2 nếu chưa có chính sách riêng được user approve.

Bundle:

- Defer khỏi MVP. Không hiển thị trên pricing page cho đến khi có task riêng.

Lưu ý chung:

- Mọi thay đổi giá phải đồng bộ giữa `pricing.ts` và section này.
- Giá hiện tại là placeholder pre-launch; sẽ được rà soát chính thức ở T-0801 trước khi mở payment thật.

## 8. Commercial Risk Checklist

```text
[ ] Giá hiển thị trước khi thanh toán
[ ] Số tiền QR đúng sau voucher
[ ] Quyền nhận được sau thanh toán rõ ràng
[ ] Refund policy có trên Terms
[ ] Disclaimer có trên footer/result
[ ] Không claim quá mức
[ ] AI/non-AI claim nhất quán với implementation thật
[ ] Voucher policy rõ
[ ] Contact support rõ
```

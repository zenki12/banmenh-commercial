"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Tôi có thể đọc lại bao nhiêu lần?",
    a: "Không giới hạn. Báo cáo được lưu trong tài khoản của bạn để truy cập vĩnh viễn.",
  },
  {
    q: "Nếu nhập sai tên hoặc ngày sinh thì sao?",
    a: "Bạn có thể liên hệ support trong 24h, chúng tôi sẽ hỗ trợ sửa thông tin miễn phí.",
  },
  {
    q: "Báo cáo cá nhân hóa thế nào?",
    a: "Báo cáo được tính từ họ tên và ngày sinh bạn nhập, sau đó ghép với hệ thống luận giải riêng cho từng tổ hợp chỉ số.",
  },
  {
    q: "Khác gì với các trang thần số học khác?",
    a: "Bản Mệnh tập trung vào 33 chỉ số, chu kỳ thời gian, lưới Pythagoras và phần luận giải sâu hơn cho từng nhóm chỉ số.",
  },
  {
    q: "Thanh toán quét mã có an toàn không?",
    a: "Giao dịch được xử lý an toàn qua cổng thanh toán trung gian đạt chuẩn bảo mật ngân hàng. Bản Mệnh không lưu thông tin tài khoản ngân hàng của bạn.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bm-faq">
      <h2>Câu hỏi thường gặp</h2>
      {FAQS.map((faq, idx) => (
        <div key={faq.q} className="bm-faq-item">
          <button
            className="bm-faq-q"
            onClick={() => setOpen(open === idx ? null : idx)}
            aria-expanded={open === idx}
            type="button"
          >
            <span>{faq.q}</span>
            <span className={`bm-faq-chevron ${open === idx ? "open" : ""}`} aria-hidden="true">
              ▾
            </span>
          </button>
          {open === idx ? <div className="bm-faq-a">{faq.a}</div> : null}
        </div>
      ))}
    </section>
  );
}

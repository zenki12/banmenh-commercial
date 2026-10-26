"use client";

import { useState } from "react";

export function MysticPricing() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="mystic-section" id="pricing">
      <div className="mystic-container">
        <button
          type="button"
          className="unlock-packages-toggle"
          aria-expanded={isOpen}
          aria-controls="unlock-packages-panel"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="unlock-packages-title">
            <span className="unlock-packages-spark" aria-hidden="true">
              ✦
            </span>
            <span>CÁC GÓI ĐANG MỞ KHÓA</span>
          </span>
          <span className="unlock-packages-meta">
            <span>{isOpen ? "Thu gọn" : "Bấm để xem gói"}</span>
            <span className={`unlock-packages-chevron${isOpen ? " open" : ""}`} aria-hidden="true">
              ↓
            </span>
          </span>
        </button>

        {isOpen ? (
          <div id="unlock-packages-panel" className="unlock-packages-panel">
            <div className="pricing-card">
              <div>
                <p className="section-kicker">Gói đầu tiên</p>
                <h2>Báo cáo Thần Số Học cá nhân</h2>
                <p className="pricing-copy">
                  Hệ thống đầu tiên trong hệ sinh thái Bản Mệnh, mở khóa đầy đủ phần luận giải hiện có.
                </p>
                <ul className="feature-list">
                  <li>✦ 33 chỉ số phân tích chuyên sâu</li>
                  <li>✦ 50.000+ chữ luận giải cá nhân hóa</li>
                  <li>✦ Truy cập vĩnh viễn không gia hạn</li>
                  <li>✦ Năm cá nhân, tháng cá nhân và chu kỳ vận số</li>
                  <li>✦ Thanh toán quét mã VietQR tự động 24/7</li>
                </ul>
                <p className="early-note">
                  💫 Gói mở khóa trọn bộ 6 hệ thống sẽ ra mắt cùng Tarot. Những người tham gia sớm sẽ có giá ưu đãi
                  đặc biệt.
                </p>
              </div>

              <div className="pricing-action">
                <div className="price">99.000đ</div>
                <p>Vĩnh viễn</p>
                <a className="mystic-btn mystic-btn-primary" href="/than-so-hoc">
                  Khám phá toàn bộ chỉ số →
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

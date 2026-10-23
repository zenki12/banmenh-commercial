import { getProductsByModule } from "@banmenh/shared";
import type { Metadata } from "next";
import { MysticStyles } from "../../components/homepage-v2/MysticStyles";
import { InputForm } from "../../components/numerology/InputForm";
import { NumerologyAuthNotice } from "../../components/numerology/NumerologyAuthNotice";
import { Card, ProductCard } from "../../components/ui";

export const metadata: Metadata = {
  title: "Thần số học",
};

const numerologyMetrics = [
  {
    icon: "3",
    title: "Số Đường đời",
    description: "Gợi ý nhịp phát triển chính, xu hướng trải nghiệm và bài học nổi bật từ ngày sinh.",
  },
  {
    icon: "4",
    title: "Sứ mệnh",
    description: "Tóm tắt hướng thể hiện qua tên khai sinh và cách bạn đóng góp giá trị cho xung quanh.",
  },
  {
    icon: "2",
    title: "Linh hồn",
    description: "Làm rõ động lực bên trong, điều bạn coi trọng và nhu cầu cảm xúc cốt lõi.",
  },
  {
    icon: "4",
    title: "Cá tính",
    description: "Mô tả cách năng lượng cá nhân thường được người khác cảm nhận từ bên ngoài.",
  },
  {
    icon: "9",
    title: "Năm cá nhân",
    description: "Cho biết bối cảnh chủ đạo của năm hiện tại để bạn quan sát cơ hội và thử thách.",
  },
  {
    icon: "6",
    title: "Tháng cá nhân",
    description: "Gợi ý nhịp ngắn hạn trong từng tháng, giúp bạn điều chỉnh hành động thực tế hơn.",
  },
];

const processSteps = [
  "Nhập họ tên, tên thường gọi, giới tính và ngày sinh.",
  "Nhận dashboard tổng quan miễn phí với các chỉ số chính.",
  "Mở khóa bản luận giải đầy đủ khi bạn muốn đọc sâu hơn.",
];

export default function NumerologyPage() {
  const products = getProductsByModule("numerology");

  return (
    <>
      <MysticStyles />
      <div className="mystic-page">
        <section className="mystic-hero">
          <div className="mystic-container">
            <div className="mystic-hero-grid numerology-entry-grid">
              <div className="mystic-hero-left">
                <div className="mystic-pill">✦ Module đang mở · Báo cáo cá nhân hóa · Không cần kiến thức nền</div>
                <h1>
                  Khám phá hồ sơ <span className="mystic-gradient">Thần số học</span> của bạn
                </h1>
                <p className="mystic-subtitle">
                  Nhập thông tin cơ bản để tạo bản phân tích Thần số học theo ngày sinh và tên gọi.
                  Bản tổng quan giúp bạn nắm nhanh các chỉ số chính trước khi mở phần luận giải đầy đủ.
                </p>
                <div className="mt-7 grid gap-3 text-[var(--bm-text-soft)]">
                  {processSteps.map((step, index) => (
                    <div className="flex items-start gap-3" key={step}>
                      <span className="mt-1 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-[var(--bm-border-gold)] bg-[rgba(251,191,36,0.08)] text-xs font-black text-[var(--bm-gold-bright)]">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
                <div className="mystic-trust">
                  <span>✓ Tổng quan miễn phí</span>
                  <span>✓ Luận giải theo từng mục</span>
                  <span>✓ Lưu cùng tài khoản</span>
                </div>
              </div>

              <div>
                <NumerologyAuthNotice />
                <InputForm />
              </div>
            </div>
          </div>
        </section>

        <section className="mystic-section pt-0">
          <div className="mystic-container">
            <div className="section-head">
              <p className="section-kicker">Chỉ số cốt lõi</p>
              <h2>Bản đồ số học được chia thành từng lớp dễ đọc</h2>
              <p>
                Báo cáo không chỉ đưa ra con số, mà còn diễn giải theo nhóm ý nghĩa để bạn dễ quan
                sát tính cách, động lực, chu kỳ hiện tại và hướng phát triển.
              </p>
            </div>

            <div className="benefits-grid">
              {numerologyMetrics.map((metric) => (
                <Card key={metric.title} as="article" className="benefit-card mystic-card hover-lift" padding="lg" variant="panel">
                  <div className="benefit-icon mb-5 inline-flex size-12 items-center justify-center rounded-xl text-xl text-[var(--bm-gold-bright)]">
                    {metric.icon}
                  </div>
                  <h3>{metric.title}</h3>
                  <p>{metric.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mystic-section pt-0">
          <div className="mystic-container">
            <div className="section-head">
              <p className="section-kicker">Mở khóa</p>
              <h2>Sở hữu bản luận giải đầy đủ</h2>
              <p>
                Bản tổng quan giúp bạn xem nhanh các chỉ số chính. Khi cần đọc sâu hơn, bạn có thể
                mở khóa báo cáo Thần số học đầy đủ và xem lại trong tài khoản.
              </p>
            </div>

            <div className="grid gap-5">
              {products.map((product) => (
                <ProductCard key={product.code} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="mystic-section pt-0 pb-16">
          <div className="mystic-container">
            <Card as="section" className="cta-banner text-left sm:text-center" padding="lg" variant="panel">
              <div className="section-kicker">Lưu ý</div>
              <h2 className="mt-3">Luận giải để tham khảo, chiêm nghiệm và định hướng</h2>
              <p className="mx-auto mt-4 max-w-3xl text-[var(--bm-text-soft)]">
                Thần số học trong Bản Mệnh là công cụ tự quan sát. Nội dung không khẳng định tương
                lai chắc chắn, không thay thế tư vấn y tế, pháp lý, tài chính, đầu tư hoặc tâm lý,
                và không nên là căn cứ duy nhất cho các quyết định quan trọng.
              </p>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}

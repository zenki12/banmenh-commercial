"use client";

import {
  getProductsByModule,
  type Product,
} from "@banmenh/shared";
import { useRouter } from "next/navigation";
import { PageShell } from "../../components/layout";
import { Card, ProductCard } from "../../components/ui";

const MODULE_GROUPS: ReadonlyArray<{
  module: Product["module"];
  title: string;
  description: string;
}> = [
  {
    module: "numerology",
    title: "Thần số học",
    description: "Báo cáo cá nhân hóa từ tên và ngày sinh.",
  },
  {
    module: "tarot",
    title: "Tarot",
    description: "Phiên rút bài soi chiếu câu hỏi cụ thể.",
  },
  {
    module: "bundle",
    title: "Combo tiết kiệm",
    description: "Gói ghép Thần số học và Tarot với giá ưu đãi.",
  },
];

const faqs = [
  {
    question: "Sau khi mua sẽ nhận gì?",
    answer:
      "Mỗi gói liệt kê quyền lợi rõ ngay trên thẻ giá. Quyền truy cập được kích hoạt sau khi backend xác nhận thanh toán.",
  },
  {
    question: "Có dùng voucher không?",
    answer:
      "Voucher được nhập sau khi chọn gói. Bạn sẽ thấy trạng thái hợp lệ và tổng tiền sau giảm trước khi tạo QR.",
  },
  {
    question: "Chính sách hoàn tiền?",
    answer:
      "Hỗ trợ hoàn tiền khi có lỗi kỹ thuật khiến bạn không thể truy cập nội dung đã mua. Liên hệ qua trang Hỗ trợ.",
  },
];

export default function PricingPage() {
  const router = useRouter();

  function handleSelectPlan(productCode: string) {
    if (productCode === "numerology_single_report") {
      router.push("/than-so-hoc");
      return;
    }
    router.push(`/payment/setup?productCode=${encodeURIComponent(productCode)}`);
  }

  return (
    <PageShell
      title="Bảng giá"
      subtitle="Chọn gói phù hợp với hành trình của bạn"
      showBack={false}
      containerWidth="default"
    >
      {MODULE_GROUPS.map((group) => {
        const products = getProductsByModule(group.module);
        if (products.length === 0) return null;
        const gridClass = products.length >= 2 ? "grid gap-5 md:grid-cols-2" : "grid gap-5";
        return (
          <section className="mt-10 first:mt-0" key={group.module}>
            <div className="max-w-2xl">
              <h2>{group.title}</h2>
              <p className="mt-3 text-[var(--bm-text-soft)]">{group.description}</p>
            </div>
            <div className={`mt-6 ${gridClass}`}>
              {products.map((product) => (
                <ProductCard
                  key={product.code}
                  onSelect={handleSelectPlan}
                  product={product}
                />
              ))}
            </div>
          </section>
        );
      })}

      <section className="mt-14">
        <div className="max-w-2xl">
          <h2>Câu hỏi thường gặp</h2>
        </div>
        <div className="mt-8 grid gap-4">
          {faqs.map((faq) => (
            <Card as="article" key={faq.question} padding="md" variant="default">
              <h4>{faq.question}</h4>
              <p className="mt-3 text-[var(--bm-text-soft)]">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <Card as="section" padding="lg" variant="panel">
          <h2>Lưu ý thương mại</h2>
          <p className="mt-4 text-[var(--bm-text-soft)]">
            Giá, quyền truy cập và điều kiện hỗ trợ sẽ được trình bày rõ trước khi
            thanh toán. Với sản phẩm luận giải mở khóa ngay, yêu cầu hỗ trợ hoặc
            hoàn tiền sẽ được xem xét theo lỗi kỹ thuật truy cập nội dung.
          </p>
        </Card>
      </section>
    </PageShell>
  );
}

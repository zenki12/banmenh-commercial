"use client";

import Link from "next/link";
import { useState } from "react";
import { Card } from "../../../components/ui";
import { MysticStyles } from "../../../components/homepage-v2/MysticStyles";

const highlights = [
  {
    title: "Dùng để tham khảo",
    text: "Báo cáo và nội dung luận giải hỗ trợ tự quan sát, không thay thế tư vấn chuyên môn.",
  },
  {
    title: "Quyền truy cập rõ ràng",
    text: "Nội dung trả phí được mở khóa theo tài khoản sau khi hệ thống xác nhận giao dịch thành công.",
  },
  {
    title: "Tôn trọng nội dung",
    text: "Không sao chép, bán lại, phân phối hàng loạt hoặc khai thác trái phép nội dung của Bản Mệnh.",
  },
];

type TermSection = {
  title: string;
  body: string[];
  list?: string[];
  note?: string;
};

const sections: TermSection[] = [
  {
    title: "1. Giới thiệu dịch vụ",
    body: [
      "Bản Mệnh là nền tảng cung cấp nội dung và báo cáo cá nhân hóa dựa trên dữ liệu do người dùng chủ động cung cấp.",
      "Các sản phẩm và tính năng có thể bao gồm:",
    ],
    list: [
      "Thần số học.",
      "Tarot.",
      "Tử vi.",
      "Bản đồ sao.",
      "Ma trận định mệnh.",
      "Bát tự.",
      "Báo cáo tính cách, tiềm năng cá nhân và vận trình theo thời gian.",
      "Các công cụ phân tích và luận giải khác được phát triển trên nền tảng.",
    ],
    note:
      "Ở giai đoạn hiện tại, Thần số học là module đang mở chính thức. Các module còn lại có thể được giới thiệu, thử nghiệm hoặc mở theo lộ trình sản phẩm. Một số nội dung Tarot chuyên sâu có thể được Google Gemini hỗ trợ tạo theo dữ liệu phiên Tarot; các phần khác tiếp tục dùng hệ thống công thức, kho tri thức và nội dung đã biên tập.",
  },
  {
    title: "2. Tài khoản người dùng",
    body: ["Khi sử dụng dịch vụ, bạn có trách nhiệm:"],
    list: [
      "Cung cấp thông tin chính xác, hợp pháp và thuộc quyền sử dụng của bạn.",
      "Bảo mật thông tin đăng nhập và thiết bị truy cập của mình.",
      "Không chia sẻ tài khoản cho mục đích vi phạm pháp luật, gian lận thanh toán hoặc gây ảnh hưởng đến hệ thống.",
      "Chịu trách nhiệm đối với mọi hoạt động phát sinh từ tài khoản của mình.",
    ],
    note:
      "Bản Mệnh có quyền tạm ngừng hoặc chấm dứt quyền truy cập đối với tài khoản có dấu hiệu gian lận, lạm dụng, khai thác trái phép hoặc vi phạm điều khoản sử dụng.",
  },
  {
    title: "3. Nội dung và bản quyền",
    body: [
      "Toàn bộ nội dung trên nền tảng thuộc quyền sở hữu của Bản Mệnh hoặc các bên được cấp phép hợp pháp, bao gồm nhưng không giới hạn:",
    ],
    list: [
      "Báo cáo và nội dung luận giải.",
      "Giao diện người dùng, thiết kế, hình ảnh và thương hiệu.",
      "Kho tri thức, cấu trúc dữ liệu, thuật toán và quy trình xử lý.",
      "Các tài liệu, biểu mẫu, mô tả sản phẩm và nội dung thương mại.",
    ],
    note:
      "Người dùng được quyền sử dụng nội dung đã mua hoặc được cấp quyền truy cập cho mục đích cá nhân. Nghiêm cấm sao chép hàng loạt, phân phối lại, bán lại, sử dụng cho mục đích thương mại hoặc khai thác trái phép dữ liệu/kết quả luận giải nếu chưa có sự đồng ý bằng văn bản từ Bản Mệnh.",
  },
  {
    title: "4. Thanh toán và quyền truy cập",
    body: [
      "Một số nội dung hoặc tính năng trên nền tảng có thể yêu cầu thanh toán để mở khóa.",
      "Các giao dịch được thực hiện thông qua cổng thanh toán trung gian được cấp phép tại Việt Nam cho các luồng thanh toán phù hợp.",
      "Sau khi thanh toán thành công:",
    ],
    list: [
      "Quyền truy cập sẽ được kích hoạt tự động hoặc trong thời gian hợp lý theo từng sản phẩm.",
      "Người dùng có thể xem lại các nội dung đã mở khóa trong phạm vi tài khoản của mình.",
      "Giá, voucher, quyền truy cập và thời hạn sử dụng sẽ được hiển thị theo từng gói tại thời điểm thanh toán.",
    ],
    note:
      "Frontend không tự xác nhận thanh toán hoặc tự cấp quyền mở khóa. Quyền truy cập chỉ được ghi nhận khi backend xác nhận giao dịch hợp lệ.",
  },
  {
    title: "5. Chính sách hoàn tiền",
    body: [
      "Do đặc thù của sản phẩm số, dịch vụ được xem là đã hoàn thành khi báo cáo được tạo thành công, nội dung được hiển thị cho người dùng hoặc quyền truy cập đã được kích hoạt.",
      "Bản Mệnh không áp dụng hoàn tiền đối với các trường hợp:",
    ],
    list: [
      "Đã xem hoặc đã mở khóa nội dung.",
      "Không đồng ý với kết quả luận giải.",
      "Thay đổi nhu cầu sử dụng sau khi thanh toán.",
      "Nhập sai thông tin nhưng báo cáo đã được tạo theo dữ liệu người dùng cung cấp.",
    ],
    note:
      "Ngoại lệ có thể được xem xét trong trường hợp lỗi kỹ thuật từ hệ thống, thanh toán thành công nhưng không nhận được quyền truy cập, hoặc giao dịch bị ghi nhận sai/trùng lặp.",
  },
  {
    title: "6. Miễn trừ trách nhiệm",
    body: [
      "Vui lòng đọc kỹ nội dung này trước khi sử dụng dịch vụ.",
      "Các báo cáo, nội dung luận giải và phân tích trên Bản Mệnh được xây dựng dựa trên hệ thống tri thức, phương pháp luận và dữ liệu người dùng cung cấp.",
      "Tuy nhiên:",
    ],
    list: [
      "Nội dung chỉ mang tính tham khảo, chiêm nghiệm và khám phá bản thân.",
      "Không được xem là tư vấn chuyên môn trong lĩnh vực y tế, pháp lý, tài chính, đầu tư hoặc tâm lý.",
      "Không bảo đảm tính chính xác tuyệt đối đối với các dự đoán, xu hướng hoặc diễn biến trong tương lai.",
      "Người dùng tự chịu trách nhiệm đối với các quyết định cá nhân được đưa ra dựa trên thông tin từ nền tảng.",
    ],
    note:
      "Nội dung do AI hỗ trợ có thể không chính xác, không đầy đủ hoặc không phù hợp với hoàn cảnh cụ thể. Bản Mệnh không chịu trách nhiệm đối với các tổn thất trực tiếp hoặc gián tiếp phát sinh từ việc sử dụng nội dung luận giải sai mục đích.",
  },
  {
    title: "7. Sử dụng AI trong luận giải Tarot",
    body: [
      "Khi sử dụng luận giải Tarot chuyên sâu, bạn đồng ý rằng dữ liệu cần thiết của phiên Tarot có thể được gửi tới Google Gemini để tạo nội dung cá nhân hóa.",
      "Bạn không được nhập dữ liệu trái pháp luật, bí mật của người khác, thông tin thanh toán, credential hoặc nội dung nhằm lạm dụng hay phá vỡ cơ chế an toàn của hệ thống.",
    ],
    list: [
      "AI không dự đoán chắc chắn tương lai hoặc định mệnh.",
      "AI không thay thế tư vấn y tế, tâm lý, pháp lý, tài chính hoặc đầu tư.",
      "Bản Mệnh có thể áp dụng quota, rate limit hoặc tạm dừng tính năng để bảo vệ hệ thống và kiểm soát chi phí.",
      "Khi AI không khả dụng, hệ thống có thể hiển thị nội dung dự phòng từ kho tri thức hoặc template an toàn.",
    ],
  },
  {
    title: "8. Hành vi không được phép",
    body: ["Người dùng không được:"],
    list: [
      "Can thiệp trái phép vào hệ thống.",
      "Khai thác lỗ hổng bảo mật hoặc thử vượt quyền truy cập.",
      "Tự động thu thập dữ liệu bằng công cụ, bot hoặc phần mềm trái phép.",
      "Mạo danh người khác hoặc sử dụng thông tin không thuộc quyền của mình.",
      "Lạm dụng voucher, thanh toán, quyền truy cập hoặc tính năng tài khoản.",
      "Sử dụng dịch vụ cho mục đích vi phạm pháp luật.",
      "Phát tán nội dung gây ảnh hưởng đến uy tín hoặc hoạt động của nền tảng.",
    ],
    note:
      "Bản Mệnh có quyền hạn chế, tạm ngừng hoặc chấm dứt quyền truy cập đối với các hành vi vi phạm.",
  },
  {
    title: "9. Thay đổi dịch vụ",
    body: ["Bản Mệnh có thể cập nhật dịch vụ khi cần thiết, bao gồm:"],
    list: [
      "Cập nhật tính năng.",
      "Điều chỉnh nội dung sản phẩm.",
      "Thay đổi giao diện.",
      "Thay đổi chính sách vận hành.",
      "Thử nghiệm hoặc mở thêm module mới theo lộ trình.",
    ],
    note:
      "Các thay đổi nhằm nâng cao chất lượng dịch vụ, bảo vệ hệ thống hoặc đáp ứng yêu cầu pháp lý. Những thay đổi quan trọng sẽ được công bố trên nền tảng.",
  },
  {
    title: "10. Điều chỉnh điều khoản",
    body: [
      "Điều khoản sử dụng có thể được cập nhật theo từng thời điểm để phản ánh thay đổi của sản phẩm, hạ tầng, quy trình vận hành hoặc yêu cầu pháp lý.",
      "Việc tiếp tục sử dụng dịch vụ sau khi điều khoản được cập nhật đồng nghĩa với việc bạn chấp nhận các thay đổi đó.",
    ],
  },
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: TermSection;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="faq-item">
      <button aria-expanded={isOpen} className="faq-button" onClick={onToggle} type="button">
        <span>{item.title}</span>
        <span aria-hidden="true" className={`faq-icon ${isOpen ? "open" : ""}`}>
          v
        </span>
      </button>
      {isOpen ? (
        <div className="faq-answer">
          <div className="space-y-4">
            {item.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {item.list ? (
              <ul className="list-disc space-y-2 pl-5">
                {item.list.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : null}
            {item.note ? <p>{item.note}</p> : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export default function TermsPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <MysticStyles />
      <main className="mystic-page">
        <section className="mystic-section pt-6">
          <div className="mystic-container">
            <div className="section-head max-w-4xl">
              <div className="section-kicker">Điều khoản</div>
              <h2>Điều khoản sử dụng dịch vụ</h2>
              <p>
                Khi truy cập, đăng ký tài khoản hoặc sử dụng bất kỳ dịch vụ nào trên Bản Mệnh, bạn
                đồng ý tuân thủ các điều khoản sử dụng được quy định dưới đây.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {highlights.map((item) => (
                <Card key={item.title} as="article" className="mystic-card hover-lift" padding="lg" variant="panel">
                  <div className="pillar-icon">✦</div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mystic-section pt-0">
          <div className="mystic-container">
            <div className="faq-list max-w-none">
              {sections.map((item, index) => (
                <AccordionItem
                  key={item.title}
                  item={item}
                  isOpen={index === openIndex}
                  onToggle={() => setOpenIndex(index === openIndex ? -1 : index)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mystic-section pt-0 pb-16">
          <div className="mystic-container">
            <Card as="section" className="cta-banner text-left sm:text-center" padding="lg" variant="panel">
              <div className="section-kicker">Liên hệ</div>
              <h2 className="mt-3">Cần hỗ trợ về điều khoản, thanh toán hoặc quyền truy cập?</h2>
              <p className="mx-auto mt-4 max-w-3xl text-[var(--bm-text-soft)]">
                Nếu bạn có câu hỏi liên quan đến điều khoản sử dụng, giao dịch thanh toán hoặc nội
                dung đã mở khóa, vui lòng liên hệ đội ngũ hỗ trợ của Bản Mệnh.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 sm:justify-center">
                <Link className="mystic-btn mystic-btn-primary" href="/support">
                  Liên hệ hỗ trợ
                </Link>
                <Link className="mystic-btn mystic-btn-secondary" href="/legal/privacy">
                  Chính sách bảo mật
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}

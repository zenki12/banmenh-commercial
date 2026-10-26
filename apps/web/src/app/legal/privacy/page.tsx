"use client";

import Link from "next/link";
import { useState } from "react";
import { Card } from "../../../components/ui";
import { MysticStyles } from "../../../components/homepage-v2/MysticStyles";

const highlights = [
  {
    title: "Thu thập tối thiểu",
    text: "Chúng tôi chỉ thu thập những thông tin cần thiết để vận hành tài khoản, tạo báo cáo cá nhân hóa và xử lý giao dịch.",
  },
  {
    title: "Sử dụng đúng mục đích",
    text: "Mọi dữ liệu được sử dụng nhằm cung cấp dịch vụ, hỗ trợ người dùng và cải thiện trải nghiệm sản phẩm.",
  },
  {
    title: "Quyền kiểm soát thuộc về bạn",
    text: "Bạn có thể yêu cầu xem lại, chỉnh sửa hoặc xóa dữ liệu cá nhân liên quan đến tài khoản của mình.",
  },
];

type Section = {
  title: string;
  body: string[];
  list?: string[];
  note?: string;
  groups?: Array<{ heading: string; items: string[] }>;
};

const sections: Section[] = [
  {
    title: "1. Phạm vi áp dụng",
    body: [
      "Chính sách này mô tả cách Bản Mệnh thu thập, sử dụng, lưu trữ và bảo vệ thông tin khi bạn:",
    ],
    list: [
      "Tạo tài khoản.",
      "Sử dụng các tính năng và module luận giải.",
      "Tạo báo cáo cá nhân hóa.",
      "Thực hiện thanh toán hoặc mua sản phẩm trên nền tảng.",
    ],
    note: "Việc sử dụng dịch vụ đồng nghĩa với việc bạn đồng ý với các nội dung được mô tả trong chính sách này.",
  },
  {
    title: "2. Thông tin chúng tôi thu thập",
    body: ["Bản Mệnh chỉ thu thập các thông tin cần thiết để cung cấp dịch vụ."],
    groups: [
      {
        heading: "Thông tin tài khoản",
        items: ["Email đăng ký.", "Tên hiển thị.", "Thông tin xác thực đăng nhập."],
      },
      {
        heading: "Thông tin phục vụ tạo báo cáo",
        items: [
          "Họ và tên.",
          "Ngày sinh.",
          "Giới tính (nếu có).",
          "Chủ đề, câu hỏi Tarot, các lá bài và câu trả lời làm rõ do người dùng cung cấp.",
          "Các thông tin được người dùng chủ động cung cấp cho từng module.",
        ],
      },
      {
        heading: "Thông tin giao dịch",
        items: [
          "Lịch sử mua hàng.",
          "Trạng thái thanh toán.",
          "Mã ưu đãi.",
          "Quyền truy cập các nội dung đã mở khóa.",
        ],
      },
      {
        heading: "Thông tin kỹ thuật",
        items: ["Thiết bị truy cập.", "Trình duyệt sử dụng.", "Địa chỉ IP.", "Thời gian truy cập hệ thống."],
      },
    ],
  },
  {
    title: "3. Mục đích sử dụng dữ liệu",
    body: ["Thông tin được sử dụng nhằm:"],
    list: [
      "Tạo báo cáo và nội dung cá nhân hóa.",
      "Lưu trữ kết quả để người dùng có thể xem lại.",
      "Xác thực tài khoản và quản lý quyền truy cập.",
      "Xử lý thanh toán và đối soát giao dịch.",
      "Hỗ trợ khách hàng khi phát sinh vấn đề.",
      "Cải thiện chất lượng sản phẩm và trải nghiệm sử dụng.",
      "Phát hiện, ngăn chặn hành vi gian lận hoặc lạm dụng hệ thống.",
    ],
  },
  {
    title: "4. Cam kết về quyền riêng tư",
    body: ["Bản Mệnh tôn trọng quyền riêng tư của người dùng và cam kết:"],
    list: [
      "Không bán dữ liệu cá nhân cho bên thứ ba.",
      "Không trao đổi hoặc chia sẻ dữ liệu người dùng vì mục đích thương mại.",
      "Không công khai thông tin cá nhân hoặc nội dung báo cáo cá nhân hóa của người dùng.",
      "Chỉ sử dụng dữ liệu trong phạm vi cần thiết để cung cấp và vận hành dịch vụ.",
    ],
    note:
      "Dữ liệu luận giải, báo cáo cá nhân và các nội dung liên quan đến tài khoản chỉ được hiển thị cho chính chủ tài khoản hoặc người được chủ tài khoản chia sẻ.",
  },
  {
    title: "5. Bên thứ ba và hạ tầng vận hành",
    body: [
      "Để cung cấp dịch vụ ổn định và an toàn, Bản Mệnh có thể sử dụng một số nền tảng và dịch vụ hỗ trợ vận hành.",
      "Các dịch vụ này chỉ được sử dụng trong phạm vi cần thiết cho việc:",
    ],
    list: ["Xác thực tài khoản.", "Lưu trữ dữ liệu.", "Xử lý thanh toán.", "Hỗ trợ tạo luận giải Tarot cá nhân hóa bằng AI.", "Bảo mật hệ thống.", "Giám sát vận hành."],
    note:
      "Ví dụ: Firebase cho xác thực người dùng, Firestore cho lưu trữ dữ liệu, Cloudflare cho bảo mật và tối ưu hiệu năng, cổng thanh toán trung gian được cấp phép tại Việt Nam cho thanh toán và Google Gemini cho luận giải Tarot có AI. Khi dùng luận giải Tarot chuyên sâu, tên hiển thị nếu có, ngày sinh/giới tính nếu bạn cung cấp, chủ đề, câu hỏi, lá bài và câu trả lời làm rõ có thể được gửi tới Google Gemini. Bản Mệnh không gửi thông tin thanh toán, thông tin xác thực hoặc khóa bí mật sang nhà cung cấp AI.",
  },
  {
    title: "6. Xử lý dữ liệu Tarot bằng AI",
    body: [
      "Luận giải Tarot chuyên sâu có thể được Google Gemini hỗ trợ tạo nội dung. Trước khi gửi yêu cầu, hệ thống yêu cầu phiên đăng nhập, giới hạn tần suất và chỉ gửi dữ liệu cần thiết cho lượt luận giải.",
      "Nội dung AI có thể không chính xác hoặc không phù hợp với mọi hoàn cảnh. Kết quả luôn mang tính chiêm nghiệm, không phải kết luận chắc chắn hoặc tư vấn chuyên môn.",
    ],
    list: [
      "Câu hỏi được giới hạn độ dài và không được ghi nguyên văn vào log vận hành.",
      "Hệ thống không gửi dữ liệu thanh toán, credential, token hoặc admin secret tới Gemini.",
      "Khi Gemini lỗi hoặc quá thời gian chờ, hệ thống chuyển sang nội dung dự phòng từ template an toàn.",
      "Bạn không nên nhập bí mật, thông tin tài chính, hồ sơ y tế hoặc dữ liệu cá nhân của người khác vào câu hỏi Tarot.",
    ],
  },
  {
    title: "7. Thanh toán an toàn",
    body: [
      "Các giao dịch thanh toán trên Bản Mệnh được xử lý thông qua đối tác thanh toán được cấp phép.",
      "Bản Mệnh không lưu trữ:",
    ],
    list: ["Mật khẩu ngân hàng.", "Mã PIN.", "Mã OTP.", "Thông tin thẻ thanh toán nhạy cảm."],
    note:
      "Quyền truy cập các nội dung trả phí chỉ được kích hoạt sau khi hệ thống xác nhận giao dịch thành công.",
  },
  {
    title: "8. Bảo vệ dữ liệu",
    body: ["Chúng tôi áp dụng các biện pháp kỹ thuật và quy trình vận hành phù hợp nhằm bảo vệ dữ liệu người dùng."],
    list: [
      "Mã hóa kết nối truyền dữ liệu.",
      "Kiểm soát quyền truy cập hệ thống.",
      "Theo dõi và phát hiện các hoạt động bất thường.",
      "Sao lưu dữ liệu định kỳ.",
      "Hạn chế tối đa việc truy cập dữ liệu ngoài phạm vi công việc.",
    ],
    note:
      "Mặc dù luôn nỗ lực bảo vệ dữ liệu, không có hệ thống nào có thể đảm bảo an toàn tuyệt đối trước mọi rủi ro trên Internet.",
  },
  {
    title: "9. Lưu trữ và xóa dữ liệu",
    body: [
      "Một số dữ liệu được lưu giữ nhằm:",
      "Lịch sử Tarot cục bộ được lưu trên chính trình duyệt của bạn, không đồng bộ lên máy chủ công cộng. Bản ghi này có thể gồm thời gian, chủ đề, câu hỏi, các lá bài và nội dung luận giải để bạn xem lại.",
    ],
    list: [
      "Duy trì tài khoản người dùng.",
      "Hiển thị lại báo cáo đã tạo.",
      "Khôi phục quyền truy cập đã mua.",
      "Đối soát giao dịch và xử lý hỗ trợ.",
      "Cho phép xóa từng phiên hoặc toàn bộ lịch sử Tarot ngay trong mục Thông điệp quá khứ.",
    ],
    note:
      "Bạn có thể yêu cầu xem dữ liệu đang được lưu trữ, chỉnh sửa thông tin không chính xác hoặc xóa dữ liệu không còn cần thiết. Một số dữ liệu có thể được giữ lại trong thời gian nhất định để đáp ứng yêu cầu pháp lý hoặc phục vụ đối soát giao dịch.",
  },
  {
    title: "10. Quyền của người dùng",
    body: ["Bạn có quyền:"],
    list: [
      "Truy cập dữ liệu cá nhân liên quan đến tài khoản.",
      "Yêu cầu chỉnh sửa thông tin không chính xác.",
      "Yêu cầu xóa dữ liệu theo phạm vi hệ thống cho phép.",
      "Yêu cầu giải thích cách dữ liệu được sử dụng.",
      "Khiếu nại nếu cho rằng dữ liệu bị sử dụng không đúng mục đích.",
    ],
  },
  {
    title: "11. Cập nhật chính sách",
    body: ["Chính sách này có thể được điều chỉnh khi:"],
    list: [
      "Sản phẩm mở rộng tính năng mới.",
      "Có thay đổi về hạ tầng kỹ thuật.",
      "Có thay đổi về quy trình vận hành hoặc yêu cầu pháp lý.",
    ],
    note: "Phiên bản mới nhất sẽ luôn được công bố trên trang này.",
  },
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: Section;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="faq-item">
      <button
        aria-expanded={isOpen}
        className="faq-button"
        onClick={onToggle}
        type="button"
      >
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

            {item.groups ? (
              <div className="space-y-4">
                {item.groups.map((group) => (
                  <div key={group.heading}>
                    <h4 className="text-base font-bold text-white">{group.heading}</h4>
                    <ul className="mt-2 list-disc space-y-2 pl-5">
                      {group.items.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}

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

export default function PrivacyPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <MysticStyles />
      <main className="mystic-page">
        <section className="mystic-section pt-6">
          <div className="mystic-container">
            <div className="section-head max-w-4xl">
              <div className="section-kicker">Bảo mật</div>
              <h2>Chính sách bảo mật &amp; quyền riêng tư của Bản Mệnh</h2>
              <p>
                Cách Bản Mệnh thu thập, sử dụng và bảo vệ dữ liệu trong quá trình tạo báo cáo,
                quản lý tài khoản và xử lý thanh toán.
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
              <h2 className="mt-3">Cần hỗ trợ về quyền riêng tư hoặc dữ liệu cá nhân?</h2>
              <p className="mx-auto mt-4 max-w-3xl text-[var(--bm-text-soft)]">
                Nếu bạn muốn xem lại, chỉnh sửa hoặc xóa dữ liệu cá nhân, hãy liên hệ đội ngũ hỗ
                trợ của Bản Mệnh. Chúng tôi sẽ tiếp nhận và phản hồi trong thời gian sớm nhất.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 sm:justify-center">
                <Link className="mystic-btn mystic-btn-primary" href="/support">
                  Liên hệ hỗ trợ
                </Link>
                <Link className="mystic-btn mystic-btn-secondary" href="/legal/terms">
                  Điều khoản sử dụng
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}

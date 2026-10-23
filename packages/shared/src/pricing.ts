// Shared product/pricing contract — nguồn sự thật duy nhất cho giá và gói.
// Được kiểm soát bởi T-0401. Mọi thay đổi giá phải qua đây, không hardcode
// nơi khác. Voucher/payment runtime sẽ vào ở T-0505/T-0506.
//
// Pricing strategy (chốt sau brainstorm 2026-05-18):
// - Numerology: per-action lifetime (99k)
// - Tarot: subscription 30-day pass (29k) + 90-day pass (79k), KHÔNG auto-renew
// - Bundle: defer khỏi MVP
// - Tarot Master tier: defer

export type ProductModule = "numerology" | "tarot" | "bundle";

export type ProductTier =
  | "single_report"
  | "session"
  | "bundle"
  | "subscription";

export type Product = {
  /** Mã sản phẩm duy nhất, snake_case. Khớp với `purchases.productCode`. */
  code: string;
  module: ProductModule;
  name: string;
  description: string;
  /** Giá niêm yết VND, không decimals. */
  priceVnd: number;
  tier: ProductTier;
  /** 3-5 bullet mô tả quyền lợi gói. */
  features: readonly string[];
  /** ISO date (YYYY-MM-DD). Mặc định luôn active nếu không set. */
  activeFrom?: string;
  activeUntil?: string;
};

export const PRODUCTS = [
  {
    code: "numerology_single_report",
    module: "numerology",
    name: "Báo cáo Thần số học",
    description:
      "Báo cáo cá nhân hóa đầy đủ chỉ số, mở khóa vĩnh viễn cho hồ sơ đã mua.",
    priceVnd: 99000,
    tier: "single_report",
    features: [
      "Đầy đủ 6+ chỉ số cốt lõi (Đường đời, Sứ mệnh, Linh hồn, Cá tính, Năm cá nhân, Tháng cá nhân)",
      "Luận giải chi tiết từng chỉ số",
      "Lưu vĩnh viễn trong tài khoản, đọc lại bất kỳ lúc nào",
    ],
  },
  {
    code: "tarot_guide_monthly",
    module: "tarot",
    name: "Tarot 1 tháng",
    description:
      "Mở toàn bộ trải bài Tarot và không giới hạn lượt trong 30 ngày.",
    priceVnd: 29000,
    tier: "subscription",
    features: [
      "Không giới hạn trải bài 1 lá và 3 lá",
      "Mở trải bài VIP 5, 7, 10 và 12 lá",
      "Lưu tối đa 15 phiên trên thiết bị",
      "Hiệu lực 30 ngày",
    ],
  },
  {
    code: "tarot_guide_quarterly",
    module: "tarot",
    name: "Tarot 3 tháng",
    description:
      "Mở toàn bộ trải bài Tarot trong 90 ngày, không giới hạn lượt và tiết kiệm 9%.",
    priceVnd: 79000,
    tier: "subscription",
    features: [
      "Không giới hạn trải bài 1 lá và 3 lá",
      "Mở trải bài VIP 5, 7, 10 và 12 lá",
      "Lưu tối đa 15 phiên trên thiết bị",
      "Hiệu lực 90 ngày — tiết kiệm 8.000₫ (~9%) so với mua từng tháng",
      "Reminder qua Telegram khi sắp hết hạn",
    ],
  },
] as const satisfies readonly Product[];

/** Định dạng giá VND theo locale vi-VN, ví dụ 99.000₫. */
export function formatPriceVnd(price: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(price)}₫`;
}

/** Tìm sản phẩm theo `code`. Trả về `undefined` nếu không tồn tại. */
export function findProduct(code: string): Product | undefined {
  return PRODUCTS.find((product) => product.code === code);
}

/** Lọc danh sách sản phẩm theo module. */
export function getProductsByModule(
  module: Product["module"],
): readonly Product[] {
  return PRODUCTS.filter((product) => product.module === module);
}

# Bản Mệnh V2 Data Contract

Ngày cập nhật: 2026-05-13

Tài liệu này định nghĩa dữ liệu/API cốt lõi để frontend, backend và payment không tự hiểu khác nhau.

## 1. Nguyên Tắc

- Backend là nguồn sự thật cho user, payment, entitlement và voucher.
- Frontend không tự tạo quyền unlock.
- Mọi money flow phải có `orderId`.
- Mọi webhook phải idempotent.
- Không log raw PII nếu không cần thiết.

## 2. Collections / Tables

### users

```ts
{
  id: string,
  email?: string,
  displayName?: string,
  photoURL?: string,
  provider: "google" | "email" | "anonymous",
  createdAt: string,
  updatedAt: string
}
```

### reports

```ts
{
  id: string,
  userId?: string,
  module: "numerology",
  inputHash: string,
  inputSnapshot: {
    fullName: string,
    nickname?: string,
    gender?: "male" | "female",
    birthDate: string
  },
  status: "free" | "unlocked",
  createdAt: string,
  updatedAt: string
}
```

### purchases

```ts
{
  id: string,
  orderId: string,
  userId?: string,
  module: "numerology" | "tarot",
  productCode: string,
  amount: number,
  currency: "VND",
  status: "pending" | "confirming" | "confirmed" | "failed" | "expired",
  provider: "payos",
  providerRef?: string,
  voucherCode?: string,
  discountVnd?: number,
  createdAt: string,
  confirmedAt?: string,
  expiresAt?: string
}
```

### entitlements

```ts
{
  id: string,
  userId?: string,
  module: "numerology" | "tarot",
  type: "single_report" | "tarot_guide" | "tarot_master",
  reportId?: string,
  purchaseId: string,
  status: "active" | "expired" | "cancelled",
  startsAt: string,
  expiresAt?: string,
  lifetime?: boolean
}
```

### vouchers

```ts
{
  code: string,
  active: boolean,
  modules: Array<"numerology" | "tarot">,
  discountType: "fixed" | "percent" | "finalPrice",
  discountValue?: number,
  finalPrice?: number,
  maxUses?: number,
  usedCount: number,
  perUserLimit?: number,
  startsAt?: string,
  expiresAt?: string,
  note?: string,
  createdAt: string,
  updatedAt: string
}
```

### payment_logs

```ts
{
  id: string,
  orderId?: string,
  level: "info" | "warn" | "error",
  event: string,
  message: string,
  metadata?: Record<string, unknown>,
  createdAt: string
}
```

### tarot_readings

```ts
{
  id: string,
  userId?: string,
  theme: string,
  subTheme?: string,
  question?: string,
  spread: 1 | 3 | 5 | 7 | 10 | 12,
  cards: Array<{
    cardId: number,
    reversed: boolean,
    position: number
  }>,
  analysis?: string,
  createdAt: string
}
```

### tarot_daily_usage

```ts
{
  id: string, // `${userId}_${date}`
  userId: string,
  date: string, // YYYY-MM-DD theo Asia/Ho_Chi_Minh
  count: number,
  updatedAt: string
}
```

- Chỉ backend được đọc/ghi collection này.
- Mỗi lượt free được tăng trong Firestore transaction để không vượt quota khi request đồng thời.

## 3. API Contract

### `GET /api/tarot/quota`

- Bắt buộc Firebase Bearer token, chấp nhận tài khoản Anonymous cho hạn mức khách.
- Trả `hasPlan`, `used`, `limit` và `remaining`; gói Tarot đang hoạt động dùng `null` cho giới hạn không giới hạn.

### `POST /api/tarot/reading`

- Bắt buộc Firebase Bearer token.
- Backend tăng quota free trong transaction trước khi tạo luận giải.
- Trả `403 ENTITLEMENT_MISSING` cho spread 5/7/10/12 khi thiếu gói; trả `429 RATE_LIMITED` khi đã dùng 3 lượt free trong ngày.

### `POST /api/payment/create`

Request:

```ts
{
  module: "numerology" | "tarot",
  productCode: string,
  reportId?: string,
  voucherCode?: string,
  returnUrl?: string
}
```

Response:

```ts
{
  ok: true,
  orderId: string,
  amount: number,
  qrCode: string,
  checkoutUrl?: string,
  expiresAt: string
}
```

### `GET /api/payment/check?orderId=...`

Response:

```ts
{
  ok: true,
  orderId: string,
  status: "pending" | "confirming" | "confirmed" | "failed" | "expired",
  entitlementId?: string,
  unlockUrl?: string
}
```

### `POST /api/payment/webhook`

Yêu cầu:

- Verify signature.
- Không tin amount/order từ client.
- Nếu webhook lặp, không tạo entitlement trùng.
- Nếu status đã confirmed, trả success idempotent.

### `POST /api/vouchers/validate`

Request:

```ts
{
  code: string,
  module: "numerology" | "tarot",
  productCode: string,
  userId?: string
}
```

Response:

```ts
{
  ok: true,
  code: string,
  discountType: "fixed" | "percent" | "finalPrice",
  discountValue?: number,
  finalPrice?: number,
  originalAmount: number,
  payableAmount: number
}
```

### `GET /api/entitlements`

Response:

```ts
{
  ok: true,
  entitlements: Array<{
    module: string,
    type: string,
    status: string,
    reportId?: string,
    expiresAt?: string,
    lifetime?: boolean
  }>
}
```

### `POST /api/tarot/combo`

- Bắt buộc Firebase Bearer token (kể cả Anonymous) và rate limit theo user/IP.
- Next route chỉ chuyển danh sách lá tối thiểu sang KB Worker; combo index/detail luôn ở KV/R2 hoặc local server fallback, không trả raw index.

Request:

```ts
{
  nicheKey: string, // lowercase snake_case, tối đa 64 ký tự
  cards: Array<{
    id: number, // 0..77
    nameEn: string,
    nameVi: string,
    orientation: "upright" | "reversed"
  }>, // 1..12; combo thật chỉ hỗ trợ 2..5 lá
  testModeRequested?: boolean
}
```

Response HTTP 200 kể cả khi không khớp:

```ts
{
  ok: true,
  combos: Array<{
    id: string,
    size: 2 | 3 | 4 | 5,
    title: string,
    description: string,
    text: string,
    orientationVariant: string, // ví dụ Up_Rev
    cards: Array<{ id: number, nameEn: string, nameVi: string, orientation: "upright" | "reversed" }>
  }>, // tối đa 3, ưu tiên combo nhiều lá hơn
  testMode: boolean
}
```

- Matching không phân biệt hoa/thường, không phụ thuộc thứ tự lá trong phiên và chuẩn hóa số `Two` ↔ `2`.
- `orientationVariant` được dựng theo thứ tự canonical trong combo index để đọc đúng nội dung theo `nicheKey`; thiếu đúng variant thì bỏ combo, không đoán nội dung.
- `testModeRequested` chỉ có hiệu lực ở local/dev được bật cờ và bị chặn cứng trên hostname production.

### `GET /api/tarot/combos`

- Dùng cho tab `Mật Mã Cộng Hưởng`; bắt buộc Firebase Bearer token (kể cả Anonymous), rate limit theo user/IP và Zod cho query/response.
- Chỉ trả metadata cần hiển thị theo trang, tối đa 15 combo/request; không trả `detail_file`, raw index hoặc nội dung luận giải đa chiều.

Query:

```ts
{
  page?: number,       // >= 1
  pageSize?: 15,       // cố định 15
  size?: "all" | "2" | "3" | "4" | "5",
  q?: string           // tối đa 100 ký tự; tìm tên combo hoặc tên lá
}
```

Response:

```ts
{
  ok: true,
  items: Array<{
    id: string,
    size: 2 | 3 | 4 | 5,
    title: string,
    description: string,
    cards: Array<{ id: number, nameEn: string, nameVi: string }>
  }>, // tối đa 15
  total: number,
  page: number,
  pageSize: 15,
  totalPages: number
}
```

### `GET /api/tarot/combos/:comboId`

- Lazy-load đúng một combo khi người dùng mở chi tiết; bắt buộc Firebase Bearer token, rate limit, ID allowlist và Zod output.
- Worker đọc detail từ R2; local development chỉ fallback server-side vào KB canonical. Client không nhận đường dẫn file nguồn hoặc mixed orientation variants.

Response:

```ts
{
  ok: true,
  combo: {
    id: string,
    size: 2 | 3 | 4 | 5,
    title: string,
    description: string,
    cards: Array<{ id: number, nameEn: string, nameVi: string }>
  },
  domains: Array<{
    key: "love" | "finance" | "health" | "career" | "self",
    label: string,
    niches: Array<{
      key: string,
      label: string,
      upright: string,
      reversed: string
    }>
  }> // đúng 5 lĩnh vực
}
```

## 4. Indexes Và Constraints

- `purchases.orderId` unique.
- `entitlements.purchaseId` unique nếu một purchase chỉ tạo một entitlement.
- `reports.inputHash + userId` có thể index để tìm lại report.
- `vouchers.code` unique uppercase.
- `payment_logs.orderId` index.
- `tarot_readings.userId + createdAt` index.

## 5. Retention

- Payment logs: giữ tối thiểu 180 ngày.
- Raw webhook payload: nếu lưu, phải redact dữ liệu nhạy cảm.
- Tarot local history: client tự giữ, có giới hạn.
- Cloud history: cần delete/export khi user yêu cầu trong tương lai.

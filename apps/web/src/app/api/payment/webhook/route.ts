export const runtime = "nodejs";

import { createError, type Purchase } from "@banmenh/shared";
import { NextResponse } from "next/server";
import { grantEntitlementFromPurchase } from "../../../../lib/entitlements/service";
import { adminFirestore } from "../../../../lib/firebase/admin";
import { firestoreVoucherRepository } from "../../../../lib/firestore";
import { verifyPayosSignature } from "../../../../lib/payos/signature";

type PayosWebhookPayload = {
  code: string;
  desc: string;
  data: Record<string, unknown>;
  signature: string;
};

function isWebhookPayload(body: unknown): body is PayosWebhookPayload {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.code === "string" &&
    typeof b.signature === "string" &&
    typeof b.data === "object" &&
    b.data !== null
  );
}

/**
 * PayOS dashboard ping GET để kiểm tra webhook URL còn sống hay không.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    method: "GET not used for webhook delivery",
    expected: "POST",
    service: "banmenh-payment-webhook",
  });
}

/**
 * Xử lý webhook từ PayOS khi giao dịch chuyển khoản thành công.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!isWebhookPayload(body)) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  const { data, signature } = body;
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY?.trim();

  if (!checksumKey) {
    console.error("[payment/webhook] PAYOS_CHECKSUM_KEY is not configured");
    return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
  }

  // 1. Verify PayOS HMAC SHA256 signature
  const valid = verifyPayosSignature(data, signature, checksumKey);
  if (!valid) {
    // PayOS khi bấm nút "Kiểm tra Webhook" hoặc "Xác nhận Webhook" trên Dashboard
    // sẽ gửi một gói tin test mẫu (có thể chứa data giả hoặc test orderCode 0/123).
    // Nếu là ping test hoặc data không có orderCode thực sự, phản hồi 200 để PayOS xác nhận URL hợp lệ.
    const isWebhookTestPing = data && (data.orderCode === 0 || data.orderCode === 123 || String(data.description || "").toLowerCase().includes("test"));
    if (isWebhookTestPing) {
      console.log("[payment/webhook] Acknowledging PayOS test webhook verification");
      return NextResponse.json({ ok: true, ack: true, test: true });
    }

    console.warn("[payment/webhook] PayOS signature mismatch");
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
  }

  const orderId = String(data.orderCode ?? "");
  if (!orderId) {
    return NextResponse.json({ ok: false, error: "Missing orderCode" }, { status: 400 });
  }

  // 2. Lookup purchase trong Firestore
  const purchaseRef = adminFirestore.collection("purchases").doc(orderId);
  const purchaseSnap = await purchaseRef.get();

  if (!purchaseSnap.exists) {
    console.warn(`[payment/webhook] Purchase not found for orderId=${orderId}`);
    return NextResponse.json({ ok: true, ack: true, note: "purchase_not_found" });
  }

  const purchase = purchaseSnap.data() as {
    orderId: string;
    userId: string;
    module: "numerology" | "tarot";
    productCode: string;
    amount: number;
    status: string;
    createdAt?: string;
    confirmedAt?: string;
    providerRef?: string;
    voucherCode?: string;
    processingAt?: number;
  };

  const now = new Date().toISOString();
  const providerRef = String(data.transactionId ?? data.reference ?? purchase.providerRef ?? "");
  const fullPurchase: Purchase = {
    id: orderId,
    orderId,
    userId: purchase.userId,
    module: purchase.module,
    productCode: purchase.productCode,
    amount: purchase.amount,
    status: "confirmed",
    createdAt: purchase.createdAt || now,
    confirmedAt: purchase.confirmedAt || now,
    provider: "payos",
    currency: "VND",
    providerRef,
    voucherCode: purchase.voucherCode,
  };

  // 3. Idempotency + self-heal: đơn confirmed vẫn phải bảo đảm entitlement tồn tại.
  if (purchase.status === "confirmed") {
    try {
      await grantEntitlementFromPurchase(fullPurchase, { userId: purchase.userId });
    } catch (err) {
      console.error(`[payment/webhook] Failed to recover entitlement for orderId=${orderId}:`, err);
      return NextResponse.json({ ok: false, error: "Entitlement error" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, idempotent: true, orderId });
  }

  // 4. Khóa xử lý đồng thời (lock processingAt trong 30 giây)
  const LOCK_TTL_MS = 30_000;
  const processingAt = Number(purchase.processingAt ?? 0);
  if (processingAt && Date.now() - processingAt < LOCK_TTL_MS) {
    return NextResponse.json(
      { ok: false, processing: true, orderId },
      { status: 503 },
    );
  }

  try {
    await purchaseRef.update({ processingAt: Date.now() });
  } catch {
    // Non-fatal
  }

  // 5. Kiểm tra số tiền nhận được có khớp với đơn hàng không
  const webhookAmount = Number(data.amount);
  const purchaseAmount = Number(purchase.amount);
  if (webhookAmount !== purchaseAmount) {
    console.error(
      `[payment/webhook] Amount mismatch orderId=${orderId} expected=${purchaseAmount} got=${webhookAmount}`,
    );
    return NextResponse.json({ ok: true, ack: true, note: "amount_mismatch" });
  }

  // 6. Cấp quyền trước khi công bố đơn confirmed. Nếu bước này lỗi, PayOS
  // nhận 500 và có thể retry; purchase chưa bị kẹt ở trạng thái thành công giả.
  try {
    await grantEntitlementFromPurchase(fullPurchase, { userId: purchase.userId });
    console.log(`[payment/webhook] Granted entitlement for userId=${purchase.userId} orderId=${orderId}`);
  } catch (err) {
    console.error(`[payment/webhook] Failed to grant entitlement for orderId=${orderId}:`, err);
    try {
      await purchaseRef.update({ processingAt: 0 });
    } catch {
      // Retry sau vẫn tự phục hồi khi lock hết hạn.
    }
    return NextResponse.json({ ok: false, error: "Entitlement error" }, { status: 500 });
  }

  // 7. Chỉ đánh dấu confirmed sau khi quyền đã được bảo đảm.
  try {
    await purchaseRef.update({
      status: "confirmed",
      confirmedAt: now,
      providerRef,
    });
  } catch (err) {
    console.error(`[payment/webhook] Failed to update purchase status for orderId=${orderId}:`, err);
    return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 });
  }

  // 8. Tăng lượt sử dụng voucher nếu có áp dụng
  if (purchase.voucherCode) {
    try {
      await firestoreVoucherRepository.incrementUsage(purchase.voucherCode, { userId: purchase.userId });
    } catch (err) {
      console.warn(`[payment/webhook] Failed to increment voucher usage for ${purchase.voucherCode}:`, err);
    }
  }

  // 9. Ghi log thanh toán thành công
  try {
    const logId = `${orderId}_${Date.now()}`;
    await adminFirestore.collection("payment_logs").doc(logId).set({
      orderId,
      level: "info",
      event: "webhook_success",
      message: "Confirmed by PayOS webhook",
      amount: webhookAmount,
      createdAt: now,
    });
  } catch {
    // Non-fatal
  }

  return NextResponse.json({ ok: true, orderId });
}

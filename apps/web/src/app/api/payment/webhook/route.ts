export const runtime = "nodejs";

import { createError } from "@banmenh/shared";
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
    voucherCode?: string;
    processingAt?: number;
  };

  // 3. Idempotency: Nếu đã confirmed trước đó, trả 200 ngay lập tức
  if (purchase.status === "confirmed") {
    return NextResponse.json({ ok: true, idempotent: true, orderId });
  }

  // 4. Khóa xử lý đồng thời (lock processingAt trong 30 giây)
  const LOCK_TTL_MS = 30_000;
  const processingAt = Number(purchase.processingAt ?? 0);
  if (processingAt && Date.now() - processingAt < LOCK_TTL_MS) {
    return NextResponse.json({ ok: true, processing: true, orderId });
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

  // 6. Cập nhật trạng thái purchase thành confirmed
  const now = new Date().toISOString();
  const providerRef = String(data.transactionId ?? data.reference ?? "");

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

  // 7. Cấp quyền truy cập (Entitlement) cho người dùng
  try {
    const fullPurchase = {
      ...purchase,
      id: orderId,
      status: "confirmed" as const,
      confirmedAt: now,
      provider: "payos" as const,
      currency: "VND" as const,
      providerRef,
    };
    await grantEntitlementFromPurchase(fullPurchase, { userId: purchase.userId });
    console.log(`[payment/webhook] Granted entitlement for userId=${purchase.userId} orderId=${orderId}`);
  } catch (err) {
    console.error(`[payment/webhook] Failed to grant entitlement for orderId=${orderId}:`, err);
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

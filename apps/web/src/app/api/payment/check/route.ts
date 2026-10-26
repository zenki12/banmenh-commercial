// Server-only route handler. firebase-admin không chạy trên Edge runtime.
export const runtime = "nodejs";

import { createError } from "@banmenh/shared";
import { NextResponse } from "next/server";
import {
  checkEntitlement,
  grantEntitlementFromPurchase,
} from "../../../../lib/entitlements/service";
import { adminAuth } from "../../../../lib/firebase/admin";
import { firestorePurchaseRepository } from "../../../../lib/firestore";

function getBearerToken(request: Request): string | null {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

export async function GET(request: Request) {
  // 1. Auth
  const bearer = getBearerToken(request);
  if (!bearer) {
    return NextResponse.json(
      { error: createError("AUTH_REQUIRED") },
      { status: 401 },
    );
  }

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(bearer);
    uid = decoded.uid;
  } catch {
    return NextResponse.json(
      { error: createError("AUTH_INVALID_TOKEN") },
      { status: 401 },
    );
  }

  // 2. Query param orderId
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json(
      { error: createError("VALIDATION_FAILED") },
      { status: 400 },
    );
  }

  // 3. Lookup purchase
  const purchase = await firestorePurchaseRepository.getByOrderId(orderId, {
    userId: uid,
  });

  if (!purchase) {
    return NextResponse.json(
      { error: createError("NOT_FOUND") },
      { status: 404 },
    );
  }

  // 4. Verify ownership — chống user xem order của user khác
  if (purchase.userId !== uid) {
    return NextResponse.json(
      { error: createError("FORBIDDEN") },
      { status: 403 },
    );
  }

  let responseStatus = purchase.status;
  let entitlementGranted = false;

  // Purchase confirmed là bằng chứng thanh toán phía server. Luôn bảo đảm quyền
  // tương ứng tồn tại trước khi client được phép hiển thị màn hình thành công.
  // Nhánh này đồng thời tự phục hồi các đơn cũ đã confirmed nhưng webhook bỏ sót quyền.
  if (purchase.status === "confirmed") {
    try {
      await grantEntitlementFromPurchase(purchase, { userId: uid });
      entitlementGranted = (
        await checkEntitlement(uid, purchase.productCode)
      ).has;
      if (!entitlementGranted) responseStatus = "confirming";
    } catch (error) {
      console.error(`[payment/check] entitlement recovery failed for orderId=${orderId}:`, error);
      responseStatus = "confirming";
    }
  }

  return NextResponse.json({
    orderId: purchase.orderId,
    status: responseStatus,
    amount: purchase.amount,
    productCode: purchase.productCode,
    expiresAt: purchase.expiresAt ?? null,
    confirmedAt: purchase.confirmedAt ?? null,
    entitlementGranted,
  });
}

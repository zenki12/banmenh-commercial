export const runtime = "nodejs";

import { createError } from "@banmenh/shared";
import { NextResponse } from "next/server";
import { adminAuth } from "../../../lib/firebase/admin";
import {
  firestoreEntitlementRepository,
  firestorePurchaseRepository,
  firestoreReportRepository,
} from "../../../lib/firestore";

function bearerToken(request: Request): string | null {
  const authorization = request.headers.get("Authorization");
  return authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
}

export async function GET(request: Request) {
  const bearer = bearerToken(request);
  if (!bearer) {
    return NextResponse.json({ error: createError("AUTH_REQUIRED") }, { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(bearer);
    if (decoded.firebase?.sign_in_provider === "anonymous") {
      return NextResponse.json({ error: createError("AUTH_REQUIRED") }, { status: 401 });
    }
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: createError("AUTH_INVALID_TOKEN") }, { status: 401 });
  }

  const [reports, entitlements] = await Promise.all([
    firestoreReportRepository.listByUser(uid, { limit: 100 }, { userId: uid }),
    firestoreEntitlementRepository.listByUser(uid, { userId: uid }),
  ]);
  const entitlementByReport = new Map(
    entitlements
      .filter((item) => item.reportId && item.status === "active")
      .map((item) => [item.reportId as string, item]),
  );
  const purchasePairs = await Promise.all(
    [...entitlementByReport.values()].map(async (entitlement) => [
      entitlement.purchaseId,
      await firestorePurchaseRepository.getById(entitlement.purchaseId, { userId: uid }),
    ] as const),
  );
  const purchaseById = new Map(purchasePairs);

  const items = reports.items.map((report) => {
    const entitlement = entitlementByReport.get(report.id);
    const purchase = entitlement ? purchaseById.get(entitlement.purchaseId) : null;
    return {
      ...report,
      status: entitlement ? "unlocked" as const : "free" as const,
      entitlementId: entitlement?.id ?? report.entitlementId,
      purchaseId: entitlement?.purchaseId ?? report.purchaseId,
      unlockedAt: entitlement?.startsAt ?? report.unlockedAt,
      unlockSource: purchase?.provider === "voucher_free"
        ? "voucher_free" as const
        : purchase?.provider === "payos"
          ? "payos" as const
          : report.unlockSource,
    };
  });

  return NextResponse.json({ items });
}

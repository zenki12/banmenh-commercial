export const runtime = "nodejs";

import { createError } from "@banmenh/shared";
import { NextResponse } from "next/server";
import { adminAuth } from "../../../../lib/firebase/admin";
import { firestoreTarotReadingRepository } from "../../../../lib/firestore";

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
  try {
    const result = await firestoreTarotReadingRepository.listByUser(
      uid,
      { limit: 100 },
      { userId: uid },
    );
    return NextResponse.json({ items: result.items });
  } catch (error) {
    console.error("[tarot/history] Failed to list readings:", error);
    return NextResponse.json({ error: createError("INTERNAL_ERROR") }, { status: 500 });
  }
}

export const runtime = "nodejs";

import { createError, TAROT_GOOGLE_AUTH_REQUIRED_MESSAGE } from "@banmenh/shared";
import { NextResponse } from "next/server";
import { adminAuth } from "../../../../lib/firebase/admin";
import { getTarotQuota } from "../../../../lib/tarot/quota";

function bearerToken(request: Request): string | null {
  const authorization = request.headers.get("Authorization");
  return authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
}

export async function GET(request: Request) {
  const bearer = bearerToken(request);
  if (!bearer) {
    return NextResponse.json({ error: createError("AUTH_REQUIRED") }, { status: 401 });
  }
  try {
    const decoded = await adminAuth.verifyIdToken(bearer);
    if (decoded.firebase?.sign_in_provider === "anonymous") {
      return NextResponse.json(
        {
          error: {
            ...createError("AUTH_REQUIRED"),
            message: TAROT_GOOGLE_AUTH_REQUIRED_MESSAGE,
          },
        },
        { status: 401 },
      );
    }
    return NextResponse.json({ ok: true, ...(await getTarotQuota(decoded.uid)) });
  } catch {
    return NextResponse.json({ error: createError("AUTH_INVALID_TOKEN") }, { status: 401 });
  }
}

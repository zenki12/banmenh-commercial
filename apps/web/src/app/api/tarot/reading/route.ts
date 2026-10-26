// Server-only route handler. Firebase Admin và GEMINI_API_KEY không được đưa vào client bundle.
export const runtime = "nodejs";

import {
  createError,
  TAROT_GOOGLE_AUTH_REQUIRED_MESSAGE,
  tarotAiReadingRequestSchema,
  tarotAiReadingResponseSchema,
  type TarotAiReadingRequest,
  type TarotAiReadingResponse,
} from "@banmenh/shared";
import { NextResponse } from "next/server";
import { z } from "zod";
import { adminAuth } from "../../../../lib/firebase/admin";
import { firestoreTarotReadingRepository } from "../../../../lib/firestore";
import {
  buildFallbackReading,
  buildSensitiveTopicReading,
  generateGeminiReading,
  requiresImmediateSafetyFallback,
} from "../../../../lib/tarot/gemini";
import { tarotRateLimitResponse } from "../../../../lib/tarot/rate-limit";
import { consumeTarotReading } from "../../../../lib/tarot/quota";
import { getLocalTarotCardAspectMeaning } from "../../../../lib/tarot/local-tarot-kb";

const DISCLOSURE =
  "Thông điệp mang tính chất chiêm nghiệm và định hướng tinh thần, hỗ trợ bạn tự phản tỉnh và quan sát bản thân.";

async function persistReading(
  uid: string,
  input: TarotAiReadingRequest,
  response: TarotAiReadingResponse,
  hasPlan: boolean,
): Promise<TarotAiReadingResponse> {
  try {
    await firestoreTarotReadingRepository.create(
      {
        userId: uid,
        theme: input.themeLabel,
        subTheme: input.nicheLabel,
        question: input.question,
        spread: input.spread,
        cards: input.cards.map((card, index) => ({
          cardId: card.id,
          reversed: card.orientation === "reversed",
          position: index,
        })),
        analysis: response.reading.overview,
        reading: response.reading,
        source: response.source,
        profileSnapshot: input.profile,
        accessSource: hasPlan ? "subscription" : "free",
      },
      { userId: uid },
    );
  } catch (error) {
    console.error("[tarot/reading] Failed to persist reading history:", error);
  }
  return response;
}

const kbMeaningResponseSchema = z.object({
  ok: z.literal(true),
  text: z.string().max(5_000),
});

function bearerToken(request: Request): string | null {
  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.slice(7);
}

async function enrichWithPrivateKb(
  input: TarotAiReadingRequest,
  bearer: string | null,
): Promise<TarotAiReadingRequest> {
  const base = process.env.NEXT_PUBLIC_KB_WORKER_URL?.trim().replace(/\/$/, "");

  const cards = await Promise.all(input.cards.map(async (card) => {
    // 1. Thử lấy từ Cloudflare KB Worker nếu có bật
    if (base && !base.includes("localhost:8787") && !base.includes("127.0.0.1:8787")) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3_000);
      try {
        const query = new URLSearchParams({
          niche: input.nicheKey,
          reversed: String(card.orientation === "reversed"),
        });
        const headers: Record<string, string> = {};
        if (bearer) headers.Authorization = `Bearer ${bearer}`;
        const response = await fetch(`${base}/tarot/card/${card.id}?${query}`, {
          headers,
          signal: controller.signal,
        });
        if (response.ok) {
          const parsed = kbMeaningResponseSchema.safeParse(await response.json());
          if (parsed.success && parsed.data.text.trim()) {
            return { ...card, aspectMeaning: parsed.data.text.trim() };
          }
        }
      } catch {
        // Fallback xuống local
      } finally {
        clearTimeout(timeout);
      }
    }

    // 2. Nạp trực tiếp từ kho KB lá bài chuyên sâu cục bộ
    const local = getLocalTarotCardAspectMeaning(card.id, input.nicheKey, card.orientation === "reversed");
    if (local) {
      return {
        ...card,
        aspectMeaning: local.aspectMeaning,
        element: local.element || card.element,
        planet: local.planet || card.planet,
        zodiac: local.zodiac || card.zodiac,
        numerology: local.numerology || card.numerology,
      };
    }

    return card;
  }));

  return { ...input, cards };
}

export async function POST(request: Request) {
  const bearer = bearerToken(request);
  if (!bearer) {
    return NextResponse.json({ error: createError("AUTH_REQUIRED") }, { status: 401 });
  }
  let uid: string;
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
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: createError("AUTH_INVALID_TOKEN") }, { status: 401 });
  }

  const rateLimitError = tarotRateLimitResponse(request, uid);
  if (rateLimitError) return rateLimitError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: createError("VALIDATION_FAILED") }, { status: 400 });
  }

  const parsed = tarotAiReadingRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: createError("VALIDATION_FAILED") }, { status: 400 });
  }

  const access = await consumeTarotReading(uid, parsed.data.spread);
  if (!access.allowed) {
    const code = access.reason === "plan_required" ? "ENTITLEMENT_MISSING" : "RATE_LIMITED";
    const message = access.reason === "plan_required"
      ? "Trải bài 5, 7, 10 và 12 lá yêu cầu gói Tarot đang hoạt động."
      : "Bạn đã dùng hết 3 lượt trải bài miễn phí hôm nay.";
    return NextResponse.json({
      error: {
        ...createError(code),
        message,
        details: {
          reason: access.reason ?? "daily_limit",
          used: access.quota.used,
          limit: access.quota.limit ?? -1,
        },
      },
    }, { status: access.reason === "plan_required" ? 403 : 429 });
  }

  const input = await enrichWithPrivateKb(parsed.data, bearer);
  const fallback = requiresImmediateSafetyFallback(input.question)
    ? buildSensitiveTopicReading(input)
    : buildFallbackReading(input);

  if (requiresImmediateSafetyFallback(input.question)) {
    const response = tarotAiReadingResponseSchema.parse({
      ok: true,
      fallback: true,
      source: "template",
      reading: fallback,
      disclosure: DISCLOSURE,
    });
    return NextResponse.json(await persistReading(uid, input, response, access.quota.hasPlan));
  }

  const providerCredential = process.env.GEMINI_API_KEY?.trim();
  if (!providerCredential) {
    console.error("[tarot/reading] Missing GEMINI_API_KEY");
    const response = tarotAiReadingResponseSchema.parse({
      ok: true,
      fallback: true,
      source: "template",
      reading: fallback,
      disclosure: DISCLOSURE,
    });
    return NextResponse.json(await persistReading(uid, input, response, access.quota.hasPlan));
  }

  try {
    const reading = await generateGeminiReading(input, providerCredential);
    const response = tarotAiReadingResponseSchema.parse({
      ok: true,
      fallback: false,
      source: "gemini",
      reading,
      disclosure: DISCLOSURE,
    });
    return NextResponse.json(await persistReading(uid, input, response, access.quota.hasPlan));
  } catch (err) {
    console.error("[tarot/reading] Gemini error:", err);
    const response = tarotAiReadingResponseSchema.parse({
      ok: true,
      fallback: true,
      source: "template",
      reading: fallback,
      disclosure: DISCLOSURE,
    });
    return NextResponse.json(await persistReading(uid, input, response, access.quota.hasPlan));
  }
}

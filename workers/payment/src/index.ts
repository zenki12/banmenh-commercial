// Bản Mệnh — Payment Worker (Cloudflare Workers + Hono)
// T-0503a: scaffold + /health. T-0503b: webhook logic.

import { Hono } from "hono";
import { logger } from "hono/logger";
import { PRODUCT_ENTITLEMENT_MAP } from "./lib/entitlement-map";
import {
  firestoreCreate,
  firestoreGet,
  firestoreIncrementField,
  firestorePatch,
  getAccessToken,
} from "./lib/firestore";
import { verifyPayosWebhook } from "./lib/payos-signature";
import { formatPaymentError, formatPaymentSuccess, sendTelegram } from "./lib/telegram";

type Env = {
  PAYOS_CHECKSUM_KEY: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_CLIENT_EMAIL: string;
  FIREBASE_PRIVATE_KEY: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  CORS_ALLOWED_ORIGINS?: string;
};

type PurchaseRecord = Record<string, unknown>;

// Zod không available ở Workers — validate thủ công
function isWebhookBody(
  body: unknown,
): body is { code: string; desc: string; data: Record<string, unknown>; signature: string } {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.code === "string" &&
    typeof b.signature === "string" &&
    typeof b.data === "object" &&
    b.data !== null
  );
}

const app = new Hono<{ Bindings: Env }>();

app.use("*", logger());

const DEFAULT_ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://dev.banmenh.online",
  "https://banmenh.online",
]);

function getAllowedOrigins(env: Env): Set<string> {
  const origins = new Set(DEFAULT_ALLOWED_ORIGINS);
  for (const origin of env.CORS_ALLOWED_ORIGINS?.split(",") ?? []) {
    const trimmed = origin.trim();
    if (trimmed) origins.add(trimmed);
  }
  return origins;
}

async function ensureEntitlements(
  projectId: string,
  accessToken: string,
  purchase: PurchaseRecord,
  orderId: string,
  now: string,
): Promise<void> {
  const specs = PRODUCT_ENTITLEMENT_MAP[String(purchase.productCode ?? "")];
  const userId = String(purchase.userId ?? "");
  if (!specs?.length || !userId) {
    throw new Error("Purchase không có entitlement mapping hoặc userId hợp lệ.");
  }

  await Promise.all(
    specs.map(async (spec) => {
      const entitlementId = `${userId}_${orderId}${spec.idSuffix ?? ""}`;
      const expiresAt = spec.expiresInDays
        ? new Date(Date.now() + spec.expiresInDays * 86400000).toISOString()
        : undefined;
      await firestoreCreate(projectId, accessToken, "entitlements", entitlementId, {
        userId,
        module: spec.module,
        type: spec.type,
        purchaseId: orderId,
        status: "active",
        startsAt: now,
        expiresAt,
        lifetime: !spec.expiresInDays,
      });
    }),
  );
}

app.use("*", async (c, next) => {
  const origin = c.req.header("Origin");
  const allowedOrigin = origin && getAllowedOrigins(c.env).has(origin) ? origin : null;
  const corsHeaders = {
    Vary: "Origin",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Authorization,Content-Type",
  };

  if (c.req.method === "OPTIONS") {
    if (!allowedOrigin) return c.body(null, 403);
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Origin": allowedOrigin,
      },
    });
  }

  await next();

  c.header("Vary", "Origin");
  if (allowedOrigin) c.header("Access-Control-Allow-Origin", allowedOrigin);
});

app.get("/", (c) => c.text("Bản Mệnh — Payment Worker"));

app.get("/health", (c) =>
  c.json({ ok: true, service: "payment-worker", timestamp: new Date().toISOString() }),
);

// PayOS dashboard verify webhook URL bằng GET request.
app.get("/webhook/payos", (c) =>
  c.json({
    ok: true,
    method: "GET not used for webhook delivery",
    expected: "POST",
    service: "payment-worker",
  }),
);

app.post("/webhook/payos", async (c) => {
  const env = c.env;
  const now = new Date().toISOString();
  const notifyTelegram = (text: string) => {
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
      console.warn("[telegram] missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID, skip alert");
      return;
    }

    try {
      c.executionCtx.waitUntil(sendTelegram(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID, text));
    } catch (err) {
      console.warn("[telegram] waitUntil failed:", err);
    }
  };

  const serverErrorMessage = (err: unknown) =>
    err instanceof Error ? err.message : String(err ?? "unknown");

  // 1. Parse body
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false, error: "Invalid JSON" }, 400);
  }

  if (!isWebhookBody(body)) {
    return c.json({ ok: false, error: "Missing required fields" }, 400);
  }

  const { data, signature } = body;

  // 2. Verify PayOS signature
  if (!env.PAYOS_CHECKSUM_KEY) {
    console.error("[webhook] PAYOS_CHECKSUM_KEY not configured");
    return c.json({ ok: false, error: "Server misconfigured" }, 500);
  }
  const valid = await verifyPayosWebhook(data, signature, env.PAYOS_CHECKSUM_KEY);
  if (!valid) {
    const orderId = String(data.orderCode ?? "unknown");
    console.warn("[webhook] signature mismatch");
    notifyTelegram(
      formatPaymentError("signature_mismatch", orderId, {
        ip: c.req.header("CF-Connecting-IP") ?? c.req.header("X-Forwarded-For") ?? "unknown",
      }),
    );
    return c.json({ ok: false, error: "Invalid signature" }, 401);
  }

  const orderId = String(data.orderCode);
  const sa = {
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };

  // 3. Get access token
  let accessToken: string;
  try {
    accessToken = await getAccessToken(sa);
  } catch (err) {
    console.error("[webhook] getAccessToken failed:", err);
    notifyTelegram(
      formatPaymentError("server_error", orderId, {
        message: serverErrorMessage(err),
      }),
    );
    return c.json({ ok: false, error: "Auth error" }, 500);
  }

  // 4. Lookup purchase
  const purchase = await firestoreGet(sa.projectId, accessToken, "purchases", orderId);
  if (!purchase) {
    console.warn(`[webhook] purchase not found orderId=${orderId}, ack 200`);
    if (Number(orderId) >= 1000000000) {
      notifyTelegram(formatPaymentError("purchase_not_found", orderId));
    }
    return c.json({ ok: true, ack: true, note: "purchase_not_found" });
  }

  // 5. Idempotency + self-heal: confirmed vẫn phải có entitlement.
  if (purchase.status === "confirmed") {
    try {
      await ensureEntitlements(sa.projectId, accessToken, purchase, orderId, now);
    } catch (err) {
      console.error(`[webhook] entitlement recovery failed orderId=${orderId}:`, err);
      return c.json({ ok: false, error: "Entitlement error" }, 500);
    }
    return c.json({ ok: true, idempotent: true, orderId });
  }

  // 5b. processingAt lock — prevents double-grant if PayOS delivers two webhooks
  // for the same order before the Firestore update completes.
  const LOCK_TTL_MS = 30_000;
  const processingAt = Number(purchase.processingAt ?? 0);
  if (processingAt && Date.now() - processingAt < LOCK_TTL_MS) {
    return c.json({ ok: false, processing: true, orderId }, 503);
  }
  try {
    await firestorePatch(sa.projectId, accessToken, "purchases", orderId, { processingAt: Date.now() }, ["processingAt"]);
  } catch (err) {
    console.error("[webhook] processingAt lock failed:", err);
    // Non-fatal: continue processing; double-grant risk is low without the lock.
  }

  // 6. Amount check — KHÔNG tin amount từ webhook nếu không khớp
  const webhookAmount = Number(data.amount);
  const purchaseAmount = Number(purchase.amount);
  if (webhookAmount !== purchaseAmount) {
    console.error(
      `[webhook] amount mismatch orderId=${orderId} expected=${purchaseAmount} got=${webhookAmount}`,
    );
    notifyTelegram(
      formatPaymentError("amount_mismatch", orderId, {
        expected: purchaseAmount,
        got: webhookAmount,
      }),
    );
    return c.json({ ok: true, ack: true, note: "amount_mismatch" });
  }

  // 7. Grant entitlement trước. Nếu lỗi, giữ purchase chưa confirmed để PayOS retry.
  try {
    await ensureEntitlements(sa.projectId, accessToken, purchase, orderId, now);
  } catch (err) {
    console.error(`[webhook] entitlement grant failed orderId=${orderId}:`, err);
    try {
      await firestorePatch(
        sa.projectId,
        accessToken,
        "purchases",
        orderId,
        { processingAt: 0 },
        ["processingAt"],
      );
    } catch {
      // Lock tự hết hạn nếu không thể xóa ngay.
    }
    notifyTelegram(
      formatPaymentError("server_error", orderId, {
        message: serverErrorMessage(err),
      }),
    );
    return c.json({ ok: false, error: "Entitlement error" }, 500);
  }

  // 8. Chỉ update purchase → confirmed sau khi entitlement đã tồn tại.
  try {
    await firestorePatch(
      sa.projectId,
      accessToken,
      "purchases",
      orderId,
      {
        status: "confirmed",
        confirmedAt: now,
        providerRef: String(data.transactionId ?? data.reference ?? ""),
      },
      ["status", "confirmedAt", "providerRef"],
    );
  } catch (err) {
    console.error("[webhook] firestorePatch purchase failed:", err);
    notifyTelegram(
      formatPaymentError("server_error", orderId, {
        message: serverErrorMessage(err),
      }),
    );
    return c.json({ ok: false, error: "DB error" }, 500);
  }

  const voucherCode = String(purchase.voucherCode ?? "").trim().toUpperCase();
  if (voucherCode) {
    try {
      await firestoreIncrementField(
        sa.projectId,
        accessToken,
        "vouchers",
        voucherCode,
        "usedCount",
      );
    } catch (err) {
      console.error(`[webhook] increment voucher usage ${voucherCode} failed:`, err);
      notifyTelegram(
        formatPaymentError("server_error", orderId, {
          message: serverErrorMessage(err),
        }),
      );
    }
  }

  notifyTelegram(
    formatPaymentSuccess(
      orderId,
      Number(purchase.amount),
      String(purchase.productCode),
      String(purchase.userId ?? ""),
    ),
  );

  // 9. Append payment log
  try {
    const logId = `${orderId}_${Date.now()}`;
    await firestoreCreate(sa.projectId, accessToken, "payment_logs", logId, {
      orderId,
      level: "info",
      event: "webhook_success",
      message: "Confirmed by PayOS webhook",
      createdAt: now,
    });
  } catch (err) {
    console.warn("[webhook] payment_log append failed:", err);
    notifyTelegram(
      formatPaymentError("server_error", orderId, {
        message: serverErrorMessage(err),
      }),
    );
  }

  return c.json({ ok: true, orderId, status: "confirmed" });
});

export default app;

export const runtime = "nodejs";

import {
  buildSynthesizedReport,
  createError,
  generateReport,
  type NarrativeKb,
  type NumerologyKb,
  type Phase,
  type ReportUnlockSource,
} from "@banmenh/shared";
import { NextResponse } from "next/server";
import { z } from "zod";
import { checkEntitlement } from "../../../../lib/entitlements/service";
import { adminAuth } from "../../../../lib/firebase/admin";
import {
  firestorePurchaseRepository,
  firestoreReportRepository,
  numerologyInputHash,
} from "../../../../lib/firestore";

const bodySchema = z.object({
  fullName: z.string().trim().min(1).max(200),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  nickname: z.string().trim().max(120).optional(),
  gender: z.enum(["male", "female"]).optional(),
});

async function readJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function bearerToken(request: Request): string | null {
  const authorization = request.headers.get("Authorization");
  return authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
}

async function buildDevFallbackReport(input: z.infer<typeof bodySchema>) {
  const fallbackKb = {
    meta: { version: "local-dev-fallback" },
    karmic_debt: {},
  } as unknown as NumerologyKb;
  const report = await generateReport(input, fallbackKb);
  const synthesized = buildSynthesizedReport({
    report,
    narrative: {} as NarrativeKb,
    kb: fallbackKb,
  });
  return { ...report, ...synthesized };
}

const FREE_FULL_SECTIONS = new Set(["1", "2", "3", "4", "11", "16", "19", "21", "25", "26"]);
const FREE_PARTIAL_SECTIONS = new Set(["5", "6", "23"]);

function redactReportForAccess(report: unknown, unlocked: boolean): unknown {
  if (!report || typeof report !== "object") return report;
  const source = report as Record<string, unknown>;
  if (!Array.isArray(source.phases)) return report;

  const phases = (source.phases as Phase[]).map((phase) => ({
    ...phase,
    sections: phase.sections.map((item) => {
      const { previewHtml, ...section } = item;
      if (unlocked || FREE_FULL_SECTIONS.has(item.number)) {
        return { ...section, access: "full" as const };
      }
      if (FREE_PARTIAL_SECTIONS.has(item.number)) {
        return {
          ...section,
          access: "partial" as const,
          html: previewHtml ?? "",
        };
      }
      return {
        ...section,
        access: "locked" as const,
        chartSlot: undefined,
        html: "",
      };
    }),
  }));

  return { ...source, phases };
}

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return NextResponse.json({ error: createError("VALIDATION_FAILED") }, { status: 400 });
  }

  const bearer = bearerToken(request);
  let uid: string | null = null;
  if (bearer) {
    try {
      uid = (await adminAuth.verifyIdToken(bearer)).uid;
    } catch {
      return NextResponse.json({ error: createError("AUTH_INVALID_TOKEN") }, { status: 401 });
    }
  }

  let unlocked = false;
  let reportId: string | null = null;
  if (uid) {
    try {
      const inputSnapshot = {
        fullName: parsed.data.fullName,
        nickname: parsed.data.nickname,
        gender: parsed.data.gender,
        birthDate: parsed.data.dob,
      };
      const savedReport = await firestoreReportRepository.create(
        {
          userId: uid,
          module: "numerology",
          inputHash: numerologyInputHash(inputSnapshot),
          inputSnapshot,
          status: "free",
          reportVersion: "v1",
        },
        { userId: uid },
      );
      reportId = savedReport.id;
      const access = await checkEntitlement(uid, "numerology_single_report", reportId);
      unlocked = access.has;
      if (access.entitlement) {
        const purchase = await firestorePurchaseRepository.getById(
          access.entitlement.purchaseId,
          { userId: uid },
        );
        const unlockSource: ReportUnlockSource = purchase?.provider === "voucher_free"
          ? "voucher_free"
          : purchase?.provider === "payos"
            ? "payos"
            : "legacy";
        await firestoreReportRepository.updateAccess(
          reportId,
          {
            status: "unlocked",
            purchaseId: access.entitlement.purchaseId,
            entitlementId: access.entitlement.id,
            unlockSource,
            unlockedAt: access.entitlement.startsAt,
          },
          { userId: uid },
        );
      }
    } catch (error) {
      console.warn("[numerology/report] entitlement check failed; serving free preview", error);
    }
  }

  const workerUrl = process.env.KB_WORKER_URL ?? "http://localhost:8787";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  const [kbFetchResult] = await Promise.allSettled([
    fetch(`${workerUrl.replace(/\/$/, "")}/numerology/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
      },
      body: JSON.stringify({ ...parsed.data, includeSections: true }),
      signal: controller.signal,
    }),
  ]);

  if (kbFetchResult.status === "rejected") {
    clearTimeout(timeout);
    console.warn("[numerology/report] KB worker unreachable, using local fallback calculation:", kbFetchResult.reason);
    const report = await buildDevFallbackReport(parsed.data);
    return NextResponse.json({
      ok: true,
      report: redactReportForAccess(report, unlocked),
      unlocked,
      reportId,
    });
  }

  try {
    const response = kbFetchResult.value;

    if (!response.ok) {
      console.warn(`[numerology/report] Worker returned status ${response.status}, using local fallback calculation`);
      const report = await buildDevFallbackReport(parsed.data);
      return NextResponse.json({
        ok: true,
        report: redactReportForAccess(report, unlocked),
        unlocked,
        reportId,
      });
    }

    const text = await response.text();
    let payload: unknown = text;
    try {
      payload = JSON.parse(text);
    } catch {
      // Worker should return JSON, but keep status forwarding if it does not.
    }

    const indicatorCount =
      typeof payload === "object" &&
      payload !== null &&
      "report" in payload &&
      typeof (payload as { report?: { meta?: { indicatorCount?: unknown } } }).report?.meta
        ?.indicatorCount === "number"
        ? (payload as { report: { meta: { indicatorCount: number } } }).report.meta.indicatorCount
        : 0;
    console.log(`[numerology/report] access=public status=${response.status} indicators=${indicatorCount}`);

    if (typeof payload === "string") {
      return new NextResponse(payload, { status: response.status });
    }
    if (response.ok && typeof payload === "object" && payload !== null && "report" in payload) {
      const responsePayload = payload as { report?: unknown };
      const report =
        responsePayload.report && typeof responsePayload.report === "object"
          ? { ...(responsePayload.report as Record<string, unknown>) }
          : responsePayload.report;
      return NextResponse.json(
        { ...payload, report: redactReportForAccess(report, unlocked), unlocked, reportId },
        { status: response.status },
      );
    }
    return NextResponse.json(payload, { status: response.status });
  } catch (err) {
    console.warn("[numerology/report] Worker call failed, using local fallback calculation:", err);
    const report = await buildDevFallbackReport(parsed.data);
    return NextResponse.json({
      ok: true,
      report: redactReportForAccess(report, unlocked),
      unlocked,
      reportId,
    });
  } finally {
    clearTimeout(timeout);
  }
}

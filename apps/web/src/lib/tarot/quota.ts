import { checkEntitlement } from "../entitlements/service";
import { adminFirestore } from "../firebase/admin";

export const FREE_TAROT_DAILY_LIMIT = 3;

export type TarotQuotaStatus = {
  date: string;
  hasPlan: boolean;
  limit: number | null;
  used: number;
  remaining: number | null;
};

function vietnamDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

async function hasTarotPlan(userId: string): Promise<boolean> {
  return (await checkEntitlement(userId, "tarot_guide_monthly")).has;
}

function usageRef(userId: string, date: string) {
  return adminFirestore.collection("tarot_daily_usage").doc(`${userId}_${date}`);
}

export async function getTarotQuota(userId: string): Promise<TarotQuotaStatus> {
  const date = vietnamDateKey();
  const [paid, usage] = await Promise.all([
    hasTarotPlan(userId),
    usageRef(userId, date).get(),
  ]);
  const used = Math.max(0, Number(usage.data()?.count ?? 0));
  return {
    date,
    hasPlan: paid,
    limit: paid ? null : FREE_TAROT_DAILY_LIMIT,
    used,
    remaining: paid ? null : Math.max(0, FREE_TAROT_DAILY_LIMIT - used),
  };
}

export async function consumeTarotReading(
  userId: string,
  spread: number,
): Promise<{ allowed: boolean; reason?: "plan_required" | "daily_limit"; quota: TarotQuotaStatus }> {
  const paid = await hasTarotPlan(userId);
  const date = vietnamDateKey();
  if (paid) {
    return {
      allowed: true,
      quota: { date, hasPlan: true, limit: null, used: 0, remaining: null },
    };
  }

  if (spread > 3) {
    const quota = await getTarotQuota(userId);
    return { allowed: false, reason: "plan_required", quota };
  }

  const ref = usageRef(userId, date);
  let used = 0;
  const allowed = await adminFirestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    used = Math.max(0, Number(snapshot.data()?.count ?? 0));
    if (used >= FREE_TAROT_DAILY_LIMIT) return false;
    used += 1;
    transaction.set(ref, {
      userId,
      date,
      count: used,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  });

  return {
    allowed,
    reason: allowed ? undefined : "daily_limit",
    quota: {
      date,
      hasPlan: false,
      limit: FREE_TAROT_DAILY_LIMIT,
      used,
      remaining: Math.max(0, FREE_TAROT_DAILY_LIMIT - used),
    },
  };
}

"use client";

import type { Entitlement, Report, TarotReading } from "@banmenh/shared";
import { useEffect, useState } from "react";
import { PageShell } from "../../components/layout";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  UnauthorizedState,
} from "../../components/ui";
import { fetchWithAuth } from "../../lib/api/client";
import { useAuth } from "../../lib/auth";

const ENTITLEMENT_TYPE_LABELS: Record<string, string> = {
  single_report: "Báo cáo lẻ",
  tarot_guide: "Phiên Tarot",
  tarot_master: "Tarot Master",
};

const MODULE_LABELS: Record<string, string> = {
  numerology: "Thần số học",
  tarot: "Tarot",
  bundle: "Combo",
};

function reportParams(report: Report) {
  const params = new URLSearchParams({
    fullName: report.inputSnapshot.fullName,
    dob: report.inputSnapshot.birthDate,
    reportId: report.id,
  });
  if (report.inputSnapshot.nickname) params.set("nickname", report.inputSnapshot.nickname);
  if (report.inputSnapshot.gender) params.set("gender", report.inputSnapshot.gender);
  return params;
}

function NumerologyReportCard({ report }: { report: Report }) {
  const params = reportParams(report);
  const unlocked = report.status === "unlocked";
  const sourceLabel = report.unlockSource === "voucher_free"
    ? "Voucher / 0đ"
    : report.unlockSource === "payos"
      ? "PayOS"
      : report.unlockSource === "admin"
        ? "Được tặng"
        : "Quyền cũ đã khôi phục";

  return (
    <Card as="article" padding="md" variant="glass">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="truncate font-bold text-[var(--bm-text-main)]">
            {report.inputSnapshot.fullName}
          </h4>
          <p className="mt-1 text-sm text-[var(--bm-text-soft)]">
            Ngày sinh: {new Date(`${report.inputSnapshot.birthDate}T00:00:00`).toLocaleDateString("vi-VN")}
          </p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${unlocked ? "border-[color-mix(in_srgb,var(--bm-success-soft)_35%,transparent)] text-[var(--bm-success-soft)]" : "border-[var(--bm-border-purple)] text-[var(--bm-primary-soft)]"}`}>
          {unlocked ? "Đã mở khóa" : "Chưa mở khóa"}
        </span>
      </div>
      <p className="mt-3 text-xs text-[var(--bm-text-muted)]">
        Tra cứu: {new Date(report.updatedAt).toLocaleDateString("vi-VN")}
        {unlocked ? ` · ${sourceLabel} · Truy cập trọn đời` : " · Bản xem trước"}
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button
          fullWidth
          href={`/than-so-hoc/result/details?${params.toString()}`}
          size="sm"
          variant={unlocked ? "primary" : "secondary"}
        >
          {unlocked ? "Xem báo cáo đầy đủ" : "Xem bản miễn phí"}
        </Button>
        {!unlocked ? (
          <Button
            fullWidth
            href={`/than-so-hoc/payment?${params.toString()}`}
            size="sm"
            variant="primary"
          >
            Mở khóa 99.000đ
          </Button>
        ) : null}
      </div>
    </Card>
  );
}

function TarotReadingCard({ reading }: { reading: TarotReading }) {
  return (
    <Card as="article" padding="md" variant="glass">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-bold text-[var(--bm-text-main)]">{reading.theme}</h4>
          <p className="mt-1 text-sm text-[var(--bm-text-soft)]">
            {reading.profileSnapshot?.name || "Bạn"} · Trải bài {reading.spread} lá
          </p>
        </div>
        <span className="rounded-full border border-[var(--bm-border-subtle)] px-3 py-1 text-xs font-bold text-[var(--bm-gold-bright)]">
          {reading.accessSource === "subscription" ? "Từ gói Tarot" : reading.accessSource === "voucher" ? "Voucher" : "Miễn phí"}
        </span>
      </div>
      {reading.question ? (
        <p className="mt-3 text-sm font-semibold text-[var(--bm-text-main)]">{reading.question}</p>
      ) : null}
      {reading.analysis ? (
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--bm-text-muted)]">{reading.analysis}</p>
      ) : null}
      <p className="mt-3 text-xs text-[var(--bm-text-muted)]">
        {new Date(reading.createdAt).toLocaleString("vi-VN")}
      </p>
    </Card>
  );
}

function EntitlementCard({ item }: { item: Entitlement }) {
  const expiresLabel = item.lifetime
    ? "Vĩnh viễn"
    : item.expiresAt
      ? `Hết hạn: ${new Date(item.expiresAt).toLocaleDateString("vi-VN")}`
      : null;

  return (
    <Card as="article" padding="md" variant="glass">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-[var(--bm-text-main)]">
            {ENTITLEMENT_TYPE_LABELS[item.type] ?? item.type}
          </p>
          <p className="mt-1 text-sm text-[var(--bm-text-soft)]">
            {MODULE_LABELS[item.module] ?? item.module}
          </p>
        </div>
        <span className="rounded-full border border-[var(--bm-border-subtle)] bg-[var(--bm-bg-glass)] px-2 py-0.5 text-xs text-[var(--bm-gold-bright)]">
          {item.status === "active" ? "Đang hoạt động" : item.status}
        </span>
      </div>
      {expiresLabel ? (
        <p className="mt-3 text-xs text-[var(--bm-text-muted)]">{expiresLabel}</p>
      ) : null}
    </Card>
  );
}

export default function AccountPage() {
  const { user, loading, isAnonymous, signInWithGoogle, linkAnonymousToGoogle } =
    useAuth();
  const [entitlements, setEntitlements] = useState<Entitlement[] | null>(null);
  const [entitlementsLoading, setEntitlementsLoading] = useState(false);
  const [reports, setReports] = useState<Report[] | null>(null);
  const [tarotReadings, setTarotReadings] = useState<TarotReading[] | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(false);

  useEffect(() => {
    if (!user || isAnonymous) return;
    setEntitlementsLoading(true);
    fetchWithAuth<{ items: Entitlement[] }>("/api/entitlements")
      .then((data) => setEntitlements(data.items))
      .catch(() => setEntitlements([]))
      .finally(() => setEntitlementsLoading(false));
    setHistoryLoading(true);
    setHistoryError(false);
    Promise.all([
      fetchWithAuth<{ items: Report[] }>("/api/reports"),
      fetchWithAuth<{ items: TarotReading[] }>("/api/tarot/history"),
    ])
      .then(([reportData, tarotData]) => {
        setReports(reportData.items);
        setTarotReadings(tarotData.items);
      })
      .catch(() => {
        setReports([]);
        setTarotReadings([]);
        setHistoryError(true);
      })
      .finally(() => setHistoryLoading(false));
  }, [user, isAnonymous]);

  const lockedReports = reports?.filter((report) => report.status !== "unlocked") ?? [];
  const unlockedReports = reports?.filter((report) => report.status === "unlocked") ?? [];
  const legacyNumerologyCredits = entitlements?.filter(
    (item) =>
      item.module === "numerology" &&
      item.type === "single_report" &&
      item.status === "active" &&
      !item.reportId,
  ).length ?? 0;

  if (loading) {
    return (
      <PageShell title="Tài khoản" showBack={false}>
        <LoadingState message="Đang tải tài khoản..." />
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell title="Tài khoản" showBack={false}>
        <Card as="section" padding="lg" variant="glass">
          <UnauthorizedState
            description="Đăng nhập để xem báo cáo và quyền truy cập của bạn."
            onLogin={signInWithGoogle}
          />
        </Card>
      </PageShell>
    );
  }

  if (isAnonymous) {
    return (
      <PageShell
        title="Tài khoản"
        subtitle="Tài khoản khách"
        showBack={false}
      >
        <Card as="section" padding="lg" variant="glass">
          <h3>Tài khoản tạm thời</h3>
          <p className="mt-4 text-[var(--bm-text-soft)]">
            Đây là tài khoản tạm. Liên kết Google để giữ dữ liệu khi đổi thiết bị.
          </p>
          <Button className="mt-6" onClick={linkAnonymousToGoogle} variant="primary">
            Liên kết Google
          </Button>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Tài khoản"
      subtitle="Quản lý báo cáo và quyền truy cập của bạn"
      showBack={false}
      containerWidth="default"
    >
      <section>
        <h2>Thông tin tài khoản</h2>
        <Card as="div" className="mt-6" padding="lg" variant="glass">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-bold text-[var(--bm-text-main)]">
                {user.displayName ?? "Người dùng"}
              </p>
              {user.email ? (
                <p className="mt-1 text-sm text-[var(--bm-text-soft)]">
                  {user.email}
                </p>
              ) : null}
            </div>
            <span className="w-fit rounded-full border border-[var(--bm-border-subtle)] bg-[var(--bm-bg-glass)] px-3 py-1 text-xs font-bold text-[var(--bm-gold-bright)]">
              {user.provider === "google" ? "Google" : user.provider === "email" ? "Email" : "Khách"}
            </span>
          </div>
        </Card>
      </section>

      {historyError ? (
        <Card as="section" className="mt-8" padding="md" variant="glass">
          <ErrorState
            description="Không thể tải lịch sử báo cáo lúc này. Quyền truy cập của bạn vẫn được giữ nguyên."
            onRetry={() => window.location.reload()}
            retryLabel="Tải lại lịch sử"
            title="Lịch sử tạm thời chưa khả dụng"
          />
        </Card>
      ) : null}

      <section className="mt-14">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--bm-primary-soft)]">Module</p>
        <h2 className="mt-2">Thần số học</h2>
        {legacyNumerologyCredits > 0 ? (
          <Card as="div" className="mt-6 border-[var(--bm-border-purple)]" padding="md" variant="glass">
            <p className="font-bold text-[var(--bm-text-main)]">
              Bạn có {legacyNumerologyCredits} quyền báo cáo cũ chưa gắn hồ sơ
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--bm-text-soft)]">
              Tra cứu lại đúng hồ sơ đã mua trước đây. Hệ thống sẽ tự gắn một quyền trọn đời vào báo cáo đó và không yêu cầu thanh toán lại.
            </p>
            <Button className="mt-4" href="/than-so-hoc" size="sm" variant="secondary">
              Tra cứu để khôi phục báo cáo
            </Button>
          </Card>
        ) : null}
        {historyLoading ? <div className="mt-6"><LoadingState message="Đang tải lịch sử Thần số học..." /></div> : (
          <div className="mt-6 space-y-10">
            <div>
              <h3>Lịch sử tra cứu chưa mở khóa</h3>
              {lockedReports.length ? (
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  {lockedReports.map((report) => <NumerologyReportCard key={report.id} report={report} />)}
                </div>
              ) : (
                <Card as="div" className="mt-4" padding="md" variant="default">
                  <EmptyState title="Không có báo cáo đang khóa" description="Các hồ sơ tra cứu miễn phí chưa mua sẽ xuất hiện tại đây." />
                </Card>
              )}
            </div>
            <div>
              <h3>Báo cáo đã mua</h3>
              {unlockedReports.length ? (
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  {unlockedReports.map((report) => <NumerologyReportCard key={report.id} report={report} />)}
                </div>
              ) : (
                <Card as="div" className="mt-4" padding="md" variant="default">
                  <EmptyState title="Chưa có báo cáo đã mua" description="Báo cáo mở bằng PayOS, voucher 100% hoặc đơn 0đ sẽ xuất hiện tại đây." />
                </Card>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="mt-14">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--bm-primary-soft)]">Module</p>
        <h2 className="mt-2">Tarot</h2>
        <p className="mt-2 text-sm text-[var(--bm-text-soft)]">Tổng hợp các lần trải bài miễn phí và trải bài từ gói Tarot của tài khoản.</p>
        {historyLoading ? <div className="mt-6"><LoadingState message="Đang tải lịch sử Tarot..." /></div> : tarotReadings?.length ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {tarotReadings.map((reading) => <TarotReadingCard key={reading.id} reading={reading} />)}
          </div>
        ) : (
          <Card as="div" className="mt-6" padding="md" variant="default">
            <EmptyState title="Chưa có lịch sử Tarot" description="Các trải bài hoàn tất khi đăng nhập sẽ xuất hiện tại đây." />
          </Card>
        )}
      </section>

      <section className="mt-14">
        <h2>Quyền truy cập</h2>
        {entitlementsLoading ? (
          <div className="mt-6">
            <LoadingState message="Đang tải quyền truy cập..." />
          </div>
        ) : entitlements && entitlements.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {entitlements.map((item) => (
              <EntitlementCard item={item} key={item.id} />
            ))}
          </div>
        ) : (
          <Card as="div" className="mt-6" padding="md" variant="default">
            <EmptyState
              title="Chưa có quyền truy cập"
              description="Các gói đã mua sẽ hiển thị trạng thái và thời hạn tại đây."
            />
          </Card>
        )}
      </section>

      <p className="mt-10 max-w-3xl text-sm text-[var(--bm-text-muted)]">
        Bản Mệnh chỉ lưu dữ liệu cần thiết để phục vụ tra cứu và thanh toán.
        Chi tiết xem trang{" "}
        <a
          className="underline hover:text-[var(--bm-text-soft)]"
          href="/legal/privacy"
        >
          Bảo mật
        </a>
        .
      </p>
    </PageShell>
  );
}

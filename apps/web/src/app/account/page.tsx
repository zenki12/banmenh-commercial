"use client";

import type { Entitlement } from "@banmenh/shared";
import { useEffect, useState } from "react";
import { PageShell } from "../../components/layout";
import {
  Button,
  Card,
  EmptyState,
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

  useEffect(() => {
    if (!user || isAnonymous) return;
    setEntitlementsLoading(true);
    fetchWithAuth<{ items: Entitlement[] }>("/api/entitlements")
      .then((data) => setEntitlements(data.items))
      .catch(() => setEntitlements([]))
      .finally(() => setEntitlementsLoading(false));
  }, [user, isAnonymous]);

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

      <section className="mt-14">
        <h2>Báo cáo đã mua</h2>
        <Card as="div" className="mt-6" padding="md" variant="default">
          <EmptyState
            title="Chưa có báo cáo"
            description="Khi bạn hoàn tất thanh toán, báo cáo sẽ xuất hiện tại đây."
          />
        </Card>
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

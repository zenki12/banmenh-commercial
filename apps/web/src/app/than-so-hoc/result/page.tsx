"use client";

import {
  createError,
  isAppError,
  type AppError,
  type NumerologyReport,
} from "@banmenh/shared";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

import { PageShell } from "../../../components/layout";
import { SummaryDashboard } from "../../../components/numerology/result/SummaryDashboard";
import { ErrorState, LoadingState } from "../../../components/ui";
import { fetchWithAuth } from "../../../lib/api/client";

type ReportResponse = {
  ok: true;
  report: NumerologyReport;
  reportId: string | null;
};

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [report, setReport] = useState<NumerologyReport | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  const input = useMemo(() => {
    const fullName = searchParams.get("fullName")?.trim() ?? "";
    const dob = searchParams.get("dob")?.trim() ?? "";
    const gender = searchParams.get("gender") ?? undefined;
    const nickname = searchParams.get("nickname")?.trim() || undefined;
    return { fullName, dob, gender, nickname };
  }, [searchParams]);

  const fetchReport = useCallback(async () => {
    if (!input.fullName || !input.dob) {
      router.replace("/than-so-hoc");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth<ReportResponse>("/api/numerology/report", {
        method: "POST",
        body: JSON.stringify(input),
      });
      setReport(response.report);
      setReportId(response.reportId);
    } catch (err) {
      setError(isAppError(err) ? err : createError("INTERNAL_ERROR"));
    } finally {
      setLoading(false);
    }
  }, [input, router]);

  useEffect(() => {
    void fetchReport();
  }, [fetchReport]);

  if (loading) {
    return <LoadingState message="Đang phân tích dashboard Thần số học..." />;
  }
  if (error) {
    return <ErrorState code={error.code} requestId={error.requestId} onRetry={fetchReport} />;
  }
  if (!report) {
    return <ErrorState code="KB_NOT_AVAILABLE" onRetry={fetchReport} />;
  }

  return (
    <PageShell title="Tổng quan Thần số học" showBack backHref="/than-so-hoc" backLabel="Nhập lại">
      <SummaryDashboard
        dob={input.dob}
        report={report}
        reportId={reportId}
        userName={input.fullName}
      />
      <p className="mt-10 text-sm leading-6 text-[var(--bm-text-muted)]">
        Hãy xem bản tổng quan này như một la bàn tự quan sát: giúp bạn nhận ra xu hướng nổi bật,
        hiểu rõ hơn cách mình vận hành và chọn điều phù hợp để đào sâu trong phần luận giải chi tiết.
      </p>
    </PageShell>
  );
}

export default function NumerologyResultPage() {
  return (
    <Suspense fallback={<LoadingState message="Đang tải dashboard..." />}>
      <ResultContent />
    </Suspense>
  );
}

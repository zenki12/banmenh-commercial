"use client";

import {
  calcCareerGroups,
  calcLineChartData,
  calcPersonalityGroups,
  type IndicatorResult,
  type NumerologyReport,
} from "@banmenh/shared";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { Button, Card } from "../../ui";
import { CareerBars } from "./charts/CareerBars";
import { LineChartVanSo } from "./charts/LineChartVanSo";
import { PersonalityBars } from "./charts/PersonalityBars";
import { generateOverview } from "./overview";

type SummaryDashboardProps = {
  report: NumerologyReport;
  userName: string;
  dob: string;
  showCta?: boolean;
};

const indicatorChips = [
  ["Đường Đời", "lifePath"],
  ["Sứ mệnh", "destiny"],
  ["Linh hồn", "soul"],
  ["Nhân cách", "personality"],
  ["Trưởng thành", "maturity"],
  ["Thái độ", "attitude"],
  ["Năm cá nhân", "personalYear"],
  ["Tháng cá nhân", "personalMonth"],
] as const satisfies ReadonlyArray<readonly [string, keyof NumerologyReport]>;

function detailsHref(search: { toString: () => string }) {
  const query = search.toString();
  return query ? `/than-so-hoc/result/details?${query}` : "/than-so-hoc/result/details";
}

function displayNumber(indicator: IndicatorResult) {
  return indicator.displayNumber ?? indicator.number;
}

function formatDOB(dob: string) {
  const [year, month, day] = dob.split("-");
  return day && month && year ? `${day}/${month}/${year}` : dob;
}

export function SummaryDashboard({
  report,
  userName,
  dob,
  showCta = true,
}: SummaryDashboardProps) {
  const searchParams = useSearchParams();
  const detailUrl = detailsHref(searchParams);
  const currentYear = report.personalYear.year;
  const lineData = useMemo(
    () => calcLineChartData(report, currentYear, -5, 5),
    [currentYear, report],
  );
  const personalityGroups = useMemo(
    () => calcPersonalityGroups(report.input.dobParts),
    [report.input.dobParts],
  );
  const careerGroups = useMemo(
    () => calcCareerGroups(report.lifePath.number, report.destiny.number),
    [report.destiny.number, report.lifePath.number],
  );

  return (
    <div className="min-w-0 max-w-full space-y-8 overflow-hidden">
      <section className="min-w-0 max-w-full rounded-lg border border-white/10 bg-[#0c0816]/86 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:p-7">
        <div className="grid gap-4 border-b border-white/10 pb-5 text-sm sm:grid-cols-2">
          <div>
            <div className="text-white/48">Họ và tên</div>
            <div className="mt-1 text-lg font-semibold text-[#f5e8c7]">{userName}</div>
          </div>
          <div>
            <div className="text-white/48">Ngày sinh</div>
            <div className="mt-1 text-lg font-semibold text-[#f5e8c7]">{formatDOB(dob)}</div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col items-center gap-6 py-6 sm:py-8">
          <div className="relative grid size-40 max-w-full place-items-center rounded-full bg-[radial-gradient(circle_at_center,rgba(247,201,72,0.22),rgba(168,85,247,0.12)_48%,rgba(12,8,22,0.18)_70%)] shadow-[0_0_72px_rgba(247,201,72,0.28)] ring-4 ring-[#f7c948]/70 sm:size-64">
            <div className="absolute inset-4 rounded-full border border-white/12" />
            <div className="text-center">
              <div className="text-xs font-semibold text-white/58 sm:text-sm">SỐ CHỦ ĐẠO</div>
              <div className="mt-2 text-6xl font-black leading-none text-[#f7c948] sm:text-8xl">
                {displayNumber(report.lifePath)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bm-result-overview">
        <h2>Tổng quan</h2>
        <p>{generateOverview(report, userName)}</p>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[var(--bm-text-main)]">Các chỉ số chính</h2>
          <p className="mt-2 text-sm text-[var(--bm-text-soft)]">
            Bảng số khái quát để bạn nhìn nhanh cấu trúc năng lượng của hồ sơ.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {indicatorChips.map(([label, key]) => {
            const indicator = report[key] as IndicatorResult;
            return (
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-center" key={key}>
                <div className="text-3xl font-black text-[#f5e8c7]">{displayNumber(indicator)}</div>
                <div className="mt-1 text-xs text-white/58">{label}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#f5e8c7]">Chu kỳ vận số của bạn</h2>
        <LineChartVanSo data={lineData} />
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-[#f5e8c7]">Nhóm tính cách theo biểu đồ ngày sinh</h2>
          <p className="text-sm leading-6 text-white/62">
            Các nhóm tính cách bẩm sinh được phân tích từ biểu đồ Pythagoras ngày sinh.
          </p>
        </div>
        <PersonalityBars groups={personalityGroups} />
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-[#f5e8c7]">Nhóm ngành phù hợp</h2>
          <p className="text-sm leading-6 text-white/62">
            Gợi ý định hướng dựa trên Số Đường Đời và Số Sứ Mệnh.
          </p>
        </div>
        <CareerBars groups={careerGroups} />
      </section>

      {showCta ? (
        <Card as="section" className="text-center" padding="lg" variant="glass">
          <h2>Luận giải chi tiết</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--bm-text-soft)]">
            Xem toàn bộ các chỉ số và phần luận giải chuyên sâu trong một báo cáo liền mạch.
          </p>
          <Button className="mt-6" href={detailUrl} size="lg" variant="primary">
            Xem chi tiết luận giải
          </Button>
        </Card>
      ) : null}
    </div>
  );
}

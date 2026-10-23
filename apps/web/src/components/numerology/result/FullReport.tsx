import {
  calcBirthChartCells,
  calcCombinedCells,
  calcCareerGroups,
  calcNameChartCells,
  DEFAULT_GRID_ARROWS,
  detectArrows,
  detectIsolatedNumbers,
  findCompensated,
  PYTHAGORAS_CHART,
  type NumerologyReport,
  type Phase,
  type SynthesizedReport,
} from "@banmenh/shared";
import { Button, Card } from "../../ui";
import { BirthChartGrid } from "./charts/BirthChartGrid";
import { CareerBars } from "./charts/CareerBars";
import { CombinedChartGrid } from "./charts/CombinedChartGrid";
import { PyramidSvgChart } from "./charts/PyramidSvgChart";
import { FloatingReportNav } from "./FloatingReportNav";
import { PhaseDivider, ProfileHeaderCard, SectionHeader } from "./v1";

export type NumerologyReportWithSections = NumerologyReport & {
  profileHeader?: SynthesizedReport["profileHeader"];
  phases?: Phase[];
};

type FullReportProps = {
  report: NumerologyReportWithSections;
  userName: string;
  unlocked: boolean;
  paymentHref: string;
  price: string;
};

type SectionAccess = NonNullable<Phase["sections"][number]["access"]>;

export function LockedTeaser({ paymentHref, price }: { paymentHref: string; price: string }) {
  return (
    <div
      className="mt-6 rounded-xl border border-[var(--bm-border-purple)] p-5 sm:p-6"
      style={{ backgroundColor: "color-mix(in srgb, var(--bm-primary) 8%, transparent)" }}
    >
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="text-xl">🔒</span>
        <div className="min-w-0 flex-1">
          <p className="font-bold leading-7 text-[var(--bm-text-main)]">
            Bạn cần nâng cấp VIP để xem được luận giải của mục này!
          </p>
          <Button className="mt-4" href={paymentHref} size="sm" variant="primary">
            Mở khóa báo cáo — {price}
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmptySections({ userName }: { userName: string }) {
  return (
    <Card as="article" variant="glass" padding="lg">
      <h2>Báo cáo đang được chuẩn bị</h2>
      <p className="mt-3 text-[var(--bm-text-soft)]">
        Báo cáo đầy đủ của {userName} đã mở khóa, nhưng phần luận giải chi tiết chưa được trả về từ KB Worker.
      </p>
    </Card>
  );
}

function BirthGridSlot({ report }: { report: NumerologyReport }) {
  return (
    <div className="mt-6 max-w-md">
      <BirthChartGrid cells={calcBirthChartCells(report.input.dobParts)} source="dob" title="Biểu đồ Ngày Sinh" />
    </div>
  );
}

function CombinedGridSlot({ report }: { report: NumerologyReport }) {
  const dobCells = calcBirthChartCells(report.input.dobParts);
  const nameCells = calcNameChartCells(report.input.fullName, PYTHAGORAS_CHART);
  const combinedCells = calcCombinedCells(dobCells, nameCells);
  const arrows = detectArrows(combinedCells, DEFAULT_GRID_ARROWS);
  const presentArrows = arrows.filter((arrow) => arrow.present);
  const isolated = detectIsolatedNumbers(combinedCells, presentArrows);
  const compensated = findCompensated(dobCells, nameCells);

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-2">
      <BirthChartGrid cells={nameCells} source="name" title="Biểu đồ Tên" />
      <CombinedChartGrid
        combinedCells={combinedCells}
        compensated={compensated}
        detectedArrows={arrows}
        dobCells={dobCells}
        isolated={isolated}
        nameCells={nameCells}
      />
    </div>
  );
}

function ChartSlot({ slot, report }: { slot?: Phase["sections"][number]["chartSlot"]; report: NumerologyReport }) {
  if (slot === "pyramid") {
    return (
      <PyramidSvgChart
        challenges={report.pyramidChallenges}
        dobParts={report.input.dobParts}
        peaks={report.pyramidPeaks}
      />
    );
  }
  if (slot === "birth-grid") return <BirthGridSlot report={report} />;
  if (slot === "combined-grid") return <CombinedGridSlot report={report} />;
  if (slot === "career-bars") {
    return <CareerBars groups={calcCareerGroups(report.lifePath.number, report.destiny.number)} />;
  }
  return null;
}

type QuickIntroTone = NonNullable<NonNullable<Phase["sections"][number]["quickIntro"]>["tone"]>;

const quickIntroToneClass: Record<QuickIntroTone, string> = {
  blue: "border-[var(--bm-cyan)]",
  gold: "border-[var(--bm-gold-bright)]",
  purple: "border-[var(--bm-primary-soft)]",
  red: "border-[var(--bm-danger-soft)]",
};

function QuickIntro({ item }: { item: Phase["sections"][number] }) {
  if (!item.quickIntro) return null;
  const tone = item.quickIntro.tone ?? "gold";
  return (
    <div className={`mt-5 border-l-2 ${quickIntroToneClass[tone]} py-1 pl-4`}>
      <div className="flex flex-wrap items-baseline gap-2">
        {item.quickIntro.badge ? (
          <span className="rounded-full border border-[var(--bm-border-gold)] px-2.5 py-0.5 text-xs font-black text-[var(--bm-gold-bright)]">
            {item.quickIntro.badge}
          </span>
        ) : null}
        <p className="text-base font-bold leading-7 text-[var(--bm-text-main)]">{item.quickIntro.headline}</p>
      </div>
      <p className="mt-2 max-w-[72ch] text-sm leading-7 text-[var(--bm-text-soft)]">{item.quickIntro.summary}</p>
    </div>
  );
}

function SectionBody({
  access,
  item,
  paymentHref,
  price,
  report,
}: {
  access: SectionAccess;
  item: Phase["sections"][number];
  paymentHref: string;
  price: string;
  report: NumerologyReport;
}) {
  if (access === "locked") {
    return <LockedTeaser paymentHref={paymentHref} price={price} />;
  }

  let content;
  if (item.chartSlot === "pyramid" && item.html.includes("<!-- CHART:pyramid -->")) {
    const [beforeChart, afterChart = ""] = item.html.split("<!-- CHART:pyramid -->");
    content = (
      <>
        <div className="nar-container mt-5" dangerouslySetInnerHTML={{ __html: beforeChart }} />
        <div className="mt-6">
          <ChartSlot report={report} slot={item.chartSlot} />
        </div>
        {afterChart ? <div className="nar-container mt-5" dangerouslySetInnerHTML={{ __html: afterChart }} /> : null}
      </>
    );
  } else if (item.chartSlot === "career-bars") {
    const [beforeChart, afterChart = ""] = item.html.split("<!-- CHART:career-bars -->");
    content = (
      <>
        <div className="nar-container mt-5" dangerouslySetInnerHTML={{ __html: beforeChart }} />
        <div className="mt-6">
          <ChartSlot report={report} slot={item.chartSlot} />
        </div>
        {afterChart ? <div className="nar-container mt-5" dangerouslySetInnerHTML={{ __html: afterChart }} /> : null}
      </>
    );
  } else {
    content = (
      <>
        <ChartSlot report={report} slot={item.chartSlot} />
        <div className="nar-container mt-5" dangerouslySetInnerHTML={{ __html: item.html }} />
      </>
    );
  }

  return (
    <>
      {content}
      {access === "partial" ? <LockedTeaser paymentHref={paymentHref} price={price} /> : null}
    </>
  );
}

function resolveAccess(item: Phase["sections"][number], unlocked: boolean): SectionAccess {
  if (unlocked) return "full";
  if (item.access) return item.access;
  if (["1", "2", "3", "4", "11", "16", "19", "21", "25", "26"].includes(item.number)) return "full";
  if (["5", "6", "23"].includes(item.number)) return "partial";
  return "locked";
}

export function FullReport({ paymentHref, price, report, unlocked, userName }: FullReportProps) {
  const phases = report.phases ?? [];
  const profileHeader =
    report.profileHeader ?? {
      name: userName,
      dob: report.input.dob,
      lifePathNumber: report.lifePath.displayNumber ?? report.lifePath.number,
      chips8: [],
    };

  if (!phases.length) return <EmptySections userName={userName} />;

  return (
    <>
      <div className="grid gap-12">
        <ProfileHeaderCard {...profileHeader} />
        {phases.map((phase) => (
          <section className="grid gap-6" key={phase.letter}>
            <PhaseDivider letter={phase.letter} title={phase.title} />
            {phase.sections.map((item) => {
              const access = resolveAccess(item, unlocked);
              return (
                <Card as="article" className="v1-report-section scroll-mt-24" id={item.id} key={item.id} variant="glass" padding="lg">
                  <SectionHeader number={item.number} title={item.title} titleBadge={item.titleBadge} />
                  <QuickIntro item={item} />
                  {item.intro ? <p className="mt-4 text-[var(--bm-text-soft)]">{item.intro}</p> : null}
                  <SectionBody
                    access={access}
                    item={item}
                    paymentHref={paymentHref}
                    price={price}
                    report={report}
                  />
                </Card>
              );
            })}
          </section>
        ))}
      </div>
      <FloatingReportNav phases={phases} />
    </>
  );
}

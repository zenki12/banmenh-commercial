import type { NarrativeKb, NumerologyKb } from "../schemas/numerology-kb";
import {
  buildLifeCyclesSection,
  buildPersonalYearFullBlock,
  buildPyramidSection,
  buildYearDomainBlock,
  destinyCtxBlock,
  escapeHtml,
  generic,
  LIFE_PATH_EXTRA,
  lifePathCtxBlock,
  maturityCtxBlock,
  personalMonthDeep,
  personalPeriod,
  personalityCtxBlock,
  readString,
  renderLifePathExtra,
  renderLifePathTenLiteral,
  soulCtxBlock,
  type NarrativeContext,
} from "./narrative-deep";
import type { IndicatorResult, KarmicLessonsResult, NumerologyReport } from "./report";
import {
  buildArrowsAnalysis,
  buildCellAnalysis,
  buildCompensationAnalysis,
  combineGridCells,
  parseDigitGrid,
  parseNameGrid,
} from "./grid-analysis";

export type SynthesizerInput = {
  report: NumerologyReport;
  narrative: NarrativeKb;
  kb: NumerologyKb;
};

export type SectionBlock = {
  id: string;
  number: string;
  title: string;
  titleBadge?: string;
  quickIntro?: {
    badge?: string;
    headline: string;
    summary: string;
    tone?: "gold" | "purple" | "blue" | "red";
  } | null;
  intro?: string;
  html: string;
  /** Bản HTML đã lược bỏ nội dung VIP, chỉ dùng trước khi API redaction cho tài khoản Free. */
  previewHtml?: string;
  /** Quyền hiển thị do API gắn sau khi kiểm tra entitlement. */
  access?: "full" | "partial" | "locked";
  chartSlot?: "pyramid" | "birth-grid" | "combined-grid" | "career-bars";
};

type QuickIntro = NonNullable<SectionBlock["quickIntro"]>;
type QuickIntroTone = NonNullable<QuickIntro["tone"]>;

export type Phase = {
  letter: "A" | "B" | "C" | "D";
  title: string;
  sections: SectionBlock[];
};

export type SynthesizedReport = {
  profileHeader: {
    name: string;
    dob: string;
    lifePathNumber: number;
    chips8: Array<{ label: string; num: number }>;
  };
  phases: Phase[];
};

type NarrativeGroup = keyof NarrativeKb;

function replaceVars(html: string, vars: Record<string, string | number>): string {
  let out = html;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{{${key}}}`, escapeHtml(String(value)));
  }
  return out;
}

function fromNarrative(
  narrative: NarrativeKb,
  group: NarrativeGroup,
  number: number | string,
  vars: Record<string, string | number>,
): string | null {
  const entry = narrative[group]?.[String(number)];
  return entry ? replaceVars(entry.html, vars) : null;
}

function renderIndicator(
  narrative: NarrativeKb,
  group: NarrativeGroup | null,
  label: string,
  indicator: IndicatorResult,
  name: string,
  vars: Record<string, string | number> = {},
): string {
  const html = group ? fromNarrative(narrative, group, indicator.number, { name, number: indicator.number, ...vars }) : null;
  return html ?? generic(label, indicator.number, name, indicator.data);
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function renderMaturityAbility(report: NumerologyReport, name: string): string {
  const ma = report.maturityAbility;
  const data = asRecord(ma.data) as {
    title?: string;
    description?: string;
    meaning?: string;
    strengths?: string;
    advice?: string;
    peak_age?: string;
    how_to_develop?: string;
  };
  const safeName = escapeHtml(name);
  let html = `<p class="nar">Khi bước qua ngưỡng cửa của tuổi trung niên, <strong>${safeName}</strong> sẽ khám phá ra những nguồn sức mạnh và tài năng mới mà trước đó chưa được phát huy hoàn toàn. Con số <strong>${ma.number}</strong> đóng vai trò như một "bộ khuếch đại" — nó làm cho những phẩm chất đặc biệt của bạn trở nên mạnh mẽ và rõ ràng hơn bao giờ hết.</p>`;
  if (data.title) html += `<p class="nar"><strong>${escapeHtml(data.title)}</strong></p>`;

  const desc =
    data.description ||
    data.meaning ||
    `Năng lực số ${ma.number} trong giai đoạn trưởng thành mang đến cho bạn khả năng nhìn nhận cuộc sống từ một góc độ mới mẻ và sâu sắc hơn. Những người xung quanh sẽ nhận ra sự thay đổi tích cực này — bạn trở nên điềm tĩnh hơn, sáng suốt hơn và có ảnh hưởng lớn hơn.`;
  html += `<p class="nar">${escapeHtml(desc)}</p>`;

  const strengths = data.strengths || data.peak_age;
  const advice = data.advice || data.how_to_develop;
  if (strengths) html += `<p class="nar"><strong>✦ Thế mạnh đặc biệt giai đoạn này:</strong> ${escapeHtml(strengths)}</p>`;
  if (advice) html += `<div class="insight-box">💡 <strong>Lời khuyên để phát huy tối đa:</strong> ${escapeHtml(advice)}</div>`;

  return html;
}

function buildBirthGridNarrative(report: NumerologyReport, name: string, includeArrows = true): string {
  const dobGridData = parseDigitGrid(report.input.dob);
  return (
    `<p class="nar">Ma trận 3×3 của Pythagoras đặt từng chữ số trong ngày sinh vào ô tương ứng theo vị trí số học. Ngày sinh của <strong>${escapeHtml(name)}</strong> (${escapeHtml(report.input.dob)}) cho ra biểu đồ sau — các ô đầy là điểm mạnh năng lượng bẩm sinh; ô trống là những bài học cần được bổ sung từ biểu đồ tên.</p>` +
    buildCellAnalysis(dobGridData, "dob") +
    (includeArrows ? buildArrowsAnalysis(dobGridData, "Biểu đồ Ngày Sinh") : "")
  );
}

function buildNameCombinedGridNarrative(report: NumerologyReport, name: string): string {
  const dobGridData = parseDigitGrid(report.input.dob);
  const nameGridData = parseNameGrid(report.input.fullName);
  const combinedGridData = combineGridCells(dobGridData, nameGridData);
  return (
    buildCellAnalysis(nameGridData, "name") +
    buildCompensationAnalysis(dobGridData, nameGridData, combinedGridData, name) +
    buildArrowsAnalysis(combinedGridData, "Biểu đồ Tổng Hợp")
  );
}

function section(
  number: string,
  title: string,
  html: string,
  options: Pick<SectionBlock, "intro" | "chartSlot" | "previewHtml" | "quickIntro" | "titleBadge"> = {},
): SectionBlock {
  return {
    id: `section-${number.replace(/[^\dA-Za-z]+/g, "-").replace(/^-|-$/g, "")}`,
    number,
    title,
    html,
    ...options,
  };
}

function intro(
  badge: string | undefined,
  headline: string,
  summary: string,
  tone: QuickIntroTone = "gold",
): QuickIntro {
  return { badge, headline, summary, tone };
}

function dataTitle(indicator: IndicatorResult): string {
  return readString(indicator.data, ["title", "theme", "name", "keywords"]);
}

function dataSummary(indicator: IndicatorResult, fallback: string): string {
  return readString(indicator.data, ["description", "meaning", "summary", "lesson", "advice", "theme"]) || fallback;
}

function displayNumber(indicator: IndicatorResult): number {
  return indicator.displayNumber ?? indicator.number;
}

function lifePathDisplayNumber(report: NumerologyReport): number {
  return displayNumber(report.lifePath);
}

function indicatorIntro(label: string, indicator: IndicatorResult, fallback: string): NonNullable<SectionBlock["quickIntro"]> {
  const title = dataTitle(indicator);
  const number = displayNumber(indicator);
  return intro(
    String(number),
    `${label} của bạn là số ${number}${title ? ` — ${title}` : ""}.`,
    dataSummary(indicator, fallback),
  );
}

function withQuickIntros(phases: Phase[], report: NumerologyReport): Phase[] {
  const missing = report.karmicLessons.missingNumbers.join(", ") || "không có số thiếu rõ rệt";
  const firstPeak = report.pyramidPeaks[0]?.number;
  const firstCycle = report.lifeCycles[0]?.number;

  function build(item: SectionBlock): NonNullable<SectionBlock["quickIntro"]> | undefined {
    switch (item.number) {
      case "1":
        return intro(
          undefined,
          "Tổng quan này gom các chỉ số cốt lõi trong bản đồ Thần số học của bạn.",
          "Hãy xem đây như trang định vị nhanh trước khi đi vào từng lớp luận giải chi tiết.",
          "purple",
        );
      case "2":
        return intro(
          "3 năm",
          "Ba năm gần nhất cho thấy luồng vận số đang mở ra trước mắt bạn.",
          "Phần này giúp bạn nhìn nhanh chủ đề chính của từng năm để chọn nhịp hành động phù hợp.",
          "blue",
        );
      case "3":
        return intro(
          undefined,
          "Nhóm ngành nghề phù hợp được tổng hợp từ Đường đời, Sứ mệnh và Ngày sinh.",
          "Đây là góc nhìn tham chiếu về môi trường làm việc, năng lực nổi bật và kiểu đóng góp dễ phát huy.",
          "blue",
        );
      case "4":
        return indicatorIntro(
          "Chỉ số Đường Đời",
          report.lifePath,
          "Con số này gợi mở bài học lớn của cuộc đời, cách bạn trưởng thành và hướng phát triển tự nhiên nhất.",
        );
      case "5":
        return intro(
          firstCycle ? String(firstCycle) : undefined,
          "Chu kỳ Đường Đời cho thấy ba giai đoạn phát triển chính của bạn.",
          "Mỗi chu kỳ là một nhịp trưởng thành khác nhau: gieo hạt, chín muồi và thu hoạch kinh nghiệm sống.",
          "purple",
        );
      case "6":
        return intro(
          firstPeak ? String(firstPeak) : undefined,
          "Biểu đồ Kim Tự Tháp cho thấy các đỉnh cao và thử thách theo từng chặng tuổi.",
          "Phần này giúp bạn quan sát chủ đề nổi bật của từng giai đoạn, không phải để đoán chắc tương lai.",
          "blue",
        );
      case "7":
        return indicatorIntro(
          "Chỉ số Năm Cá Nhân",
          report.personalYear,
          "Con số này gợi mở chủ đề năng lượng chính của năm hiện tại và cách bạn nên ưu tiên nguồn lực.",
        );
      case "8":
        return intro(
          "3 năm",
          "Chu kỳ vận số mở rộng giúp bạn đọc sâu hơn ba năm liên tiếp.",
          "Thay vì nhìn từng năm rời rạc, phần này cho thấy nhịp chuyển động nối tiếp giữa hiện tại và tương lai gần.",
          "blue",
        );
      case "9":
        return indicatorIntro(
          "Chỉ số Tháng Cá Nhân",
          report.personalMonth,
          "Con số này gợi mở sắc thái năng lượng của tháng hiện tại trong bối cảnh năm cá nhân.",
        );
      case "10":
        return intro(
          "3 tháng",
          "Ba tháng cá nhân cho thấy nhịp vận hành ngắn hạn của bạn.",
          "Phần này phù hợp để quan sát ưu tiên gần, điều chỉnh hành động và tránh đi ngược dòng năng lượng tháng.",
          "blue",
        );
      case "11":
        return indicatorIntro(
          "Chỉ số Sứ Mệnh",
          report.destiny,
          "Con số này gợi mở cách bạn đóng góp, tạo giá trị và biểu hiện năng lực ra thế giới bên ngoài.",
        );
      case "12":
        return intro(
          `${lifePathDisplayNumber(report)} ↔ ${report.destiny.number}`,
          "Tương quan Đường đời và Sứ mệnh cho thấy hướng sống và cách đóng góp gặp nhau ở đâu.",
          "Khi hai năng lượng này hòa nhịp, bạn dễ hành động đúng với bản chất và mục tiêu dài hạn hơn.",
          "purple",
        );
      case "13":
        return indicatorIntro(
          "Thử thách Sứ Mệnh",
          report.destinyChallenge,
          "Con số này gợi mở điểm cần rèn luyện để bạn thể hiện sứ mệnh một cách chín chắn hơn.",
        );
      case "14":
        return indicatorIntro(
          "Chỉ số Trưởng Thành",
          report.maturity,
          "Con số này gợi mở năng lượng sẽ rõ dần khi bạn bước vào giai đoạn chín muồi của cuộc đời.",
        );
      case "15":
        return indicatorIntro(
          "Năng lực giai đoạn Trưởng Thành",
          report.maturityAbility,
          "Con số này gợi mở năng lực có thể được khai mở mạnh hơn khi trải nghiệm sống đủ sâu.",
        );
      case "16":
        return indicatorIntro(
          "Chỉ số Linh Hồn",
          report.soul,
          "Con số này gợi mở điều bạn thật sự khao khát bên trong, kể cả khi chưa luôn thể hiện ra ngoài.",
        );
      case "17":
        return intro(
          `${lifePathDisplayNumber(report)} ↔ ${report.soul.number}`,
          "Tương quan Đường đời và Linh hồn cho thấy hành trình bên ngoài có đồng điệu với khao khát bên trong hay không.",
          "Đây là điểm soi chiếu quan trọng để bạn sống bớt xé ngang giữa trách nhiệm và nhu cầu nội tâm.",
          "purple",
        );
      case "18":
        return indicatorIntro(
          "Thử thách Linh Hồn",
          report.soulChallenge,
          "Con số này gợi mở bài học nội tâm cần được chữa lành, chấp nhận hoặc rèn luyện.",
        );
      case "19":
        return indicatorIntro(
          "Chỉ số Nhân Cách",
          report.personality,
          "Con số này gợi mở cách người khác dễ cảm nhận về bạn trong tiếp xúc ban đầu.",
        );
      case "20":
        return indicatorIntro(
          "Thử thách Nhân Cách",
          report.personalityChallenge,
          "Con số này gợi mở điểm dễ gây hiểu lầm hoặc giới hạn trong cách bạn biểu hiện ra ngoài.",
        );
      case "21":
        return intro(
          missing,
          `Các bài học nghiệp của bạn tập trung ở số ${missing}.`,
          "Đây là những năng lượng còn thiếu hoặc cần được chủ động rèn luyện thông qua trải nghiệm sống.",
          "red",
        );
      case "22":
        return intro(
          undefined,
          "Nợ nghiệp cho thấy những bài học sâu cần được nhìn nhận bằng trách nhiệm và sự tỉnh thức.",
          "Nếu xuất hiện, các số này không phải lời kết án, mà là lời nhắc về cách chuyển hóa thói quen và lựa chọn.",
          "red",
        );
      case "23":
        return intro(
          undefined,
          "Biểu đồ Ngày sinh cho thấy cách các con số bẩm sinh phân bố trong lưới Pythagoras.",
          "Phần này giúp bạn quan sát điểm mạnh tự nhiên, khoảng trống và các trục năng lượng nổi bật.",
          "blue",
        );
      case "24":
        return intro(
          undefined,
          "Biểu đồ Tên và Biểu đồ Tổng hợp cho thấy năng lượng tên gọi bù đắp cho ngày sinh như thế nào.",
          "Đây là góc nhìn về năng lượng được bổ sung, mũi tên sức mạnh và những điểm cần cân bằng.",
          "blue",
        );
      case "25":
        return indicatorIntro(
          "Chỉ số Thái Độ",
          report.attitude,
          "Con số này gợi mở phản ứng tự nhiên của bạn trước môi trường, cơ hội và thử thách ban đầu.",
        );
      case "26":
        return indicatorIntro(
          "Chỉ số Ngày Sinh",
          report.birthday,
          "Con số này gợi mở món quà tự nhiên, tài năng bẩm sinh và cách bạn dễ tỏa sáng nhất.",
        );
      case "27":
        return indicatorIntro(
          "Chỉ số Vượt Khó",
          report.tensionNumber,
          "Con số này gợi mở kiểu áp lực nội tâm và cách bạn học vượt qua mâu thuẫn bên trong.",
        );
      case "28":
        return indicatorIntro(
          "Chỉ số Năng Lực Tư Duy",
          report.cognitiveAbility,
          "Con số này gợi mở cách bạn tiếp nhận, xử lý và kết nối thông tin khi ra quyết định.",
        );
      case "29":
        return indicatorIntro(
          "Chỉ số Động Lực Tiếp Cận",
          report.approachMotivation,
          "Con số này gợi mở động cơ khiến bạn chủ động bước vào một tình huống, con người hoặc cơ hội mới.",
        );
      case "30":
        return indicatorIntro(
          "Chỉ số Năng Lực Tiếp Cận",
          report.approachAbility,
          "Con số này gợi mở năng lực giúp bạn biến sự tiếp cận ban đầu thành kết nối hoặc hành động cụ thể.",
        );
      case "31":
        return indicatorIntro(
          "Chỉ số Thái Độ Tiếp Cận",
          report.approachAttitude,
          "Con số này gợi mở sắc thái thái độ bạn mang theo khi bắt đầu tương tác với người, việc hoặc mục tiêu mới.",
        );
      default:
        return intro(
          undefined,
          `${item.title} là một lát cắt trong bản đồ Thần số học của bạn.`,
          "Hãy dùng phần này như một gợi ý tham chiếu để quan sát bản thân rõ hơn.",
          "purple",
        );
    }
  }

  return phases.map((phase) => ({
    ...phase,
    sections: phase.sections.map((item) => ({
      ...item,
      quickIntro: item.quickIntro === null ? undefined : (item.quickIntro ?? build(item)),
    })),
  }));
}

function buildProfileHeader(report: NumerologyReport): SynthesizedReport["profileHeader"] {
  const lpNum = lifePathDisplayNumber(report);
  return {
    name: report.input.fullName,
    dob: report.input.dob,
    lifePathNumber: lpNum,
    chips8: [
      { label: "Đường Đời", num: lpNum },
      { label: "Sứ Mệnh", num: report.destiny.number },
      { label: "Linh Hồn", num: report.soul.number },
      { label: "Nhân Cách", num: report.personality.number },
      { label: "Trưởng Thành", num: report.maturity.number },
      { label: "Thái Độ", num: report.attitude.number },
      { label: "Năm cá nhân", num: report.personalYear.number },
      { label: "Tháng cá nhân", num: report.personalMonth.number },
    ],
  };
}

function overviewHtml(report: NumerologyReport, name: string): string {
  const lpNum = lifePathDisplayNumber(report);
  const chips = buildProfileHeader(report).chips8
    .map(
      (chip) =>
        `<span class="pn-item"><span class="pn-label">${escapeHtml(chip.label)}</span><span class="pn-val">${chip.num}</span></span>`,
    )
    .join("");
  return `<div class="profile-card"><div class="profile-avatar"><span class="avatar-number">${lpNum}</span><span class="avatar-label">Chủ Đạo</span></div><div class="profile-info"><div class="profile-name">${escapeHtml(name)}</div><div class="profile-dob">Ngày sinh: ${escapeHtml(report.input.dob)}</div><div class="profile-nums">${chips}</div></div></div>
  <p class="nar">Bản báo cáo này được xây dựng riêng cho <strong>${escapeHtml(name)}</strong> — phân tích đầy đủ các chỉ số dựa trên <strong>họ tên khai sinh</strong> và <strong>ngày/tháng/năm sinh</strong> theo hệ Pythagoras.</p>
  <p class="nar">Hãy đọc từng phần với tâm thái cởi mở và suy ngẫm. Thần số học không phải lời tiên tri — đó là tấm gương phản chiếu bản chất sâu xa nhất của bạn, để bạn hiểu rõ hơn về chính mình và đưa ra những lựa chọn có ý thức hơn.</p>`;
}

function careerCard(label: string, text: string): string {
  if (!text) return "";
  return `<div class="career-card"><div class="career-card-label">${escapeHtml(label)}</div><div class="career-card-text">${escapeHtml(text)}</div></div>`;
}

function careerHtml(report: NumerologyReport, name: string): string {
  const lpNum = lifePathDisplayNumber(report);
  const lpCareer = readString(report.lifePath.data, ["career", "career_fit", "mission"]);
  const destCareer = readString(report.destiny.data, ["career", "career_fit", "mission"]);
  const bdayCareer = readString(report.birthday.data, ["career_fit", "career", "mission"]);
  const cards = [
    careerCard("ĐƯỜNG ĐỜI", lpCareer),
    careerCard("SỨ MỆNH", destCareer),
    careerCard("NGÀY SINH", bdayCareer),
  ]
    .filter(Boolean)
    .join("");
  const lpExtra = LIFE_PATH_EXTRA[lpNum] ?? LIFE_PATH_EXTRA[report.lifePath.number];
  const detail = lpExtra?.ngheNghiep
    ? `<div class="lp-extra-section">
        <div class="lp-extra-heading">💼 Định Hướng Nghề Nghiệp Chi Tiết</div>
        <div class="lp-extra-body">${lpExtra.ngheNghiep}</div>
      </div>`
    : "";

  return `<p class="nar">Nhóm ngành nghề phù hợp của <strong>${escapeHtml(name)}</strong> được tổng hợp từ các chỉ số cốt lõi, đặc biệt là Đường đời, Sứ mệnh và Ngày sinh.</p><div class="career-cards-grid">${cards}</div><!-- CHART:career-bars -->${detail}`;
}

function relationshipHtml(titleText: string, first: number, second: number, name: string): string {
  const harmony = first === second ? "hoàn toàn đồng nhất" : Math.abs(first - second) <= 2 ? "có độ cộng hưởng tốt" : "tạo ra hai lực kéo khác nhau cần được dung hòa";
  return `<p class="nar">${titleText} của <strong>${escapeHtml(name)}</strong> là cặp số <strong>${first}</strong> và <strong>${second}</strong>. Hai năng lượng này ${harmony}, vì vậy nên đọc cùng nhau thay vì tách rời.</p><div class="insight-box">📌 <strong>Lời khuyên:</strong> Khi hai chỉ số bổ trợ, hãy dùng chúng như lực đẩy. Khi chúng căng nhau, hãy xem đó là tín hiệu cần cân bằng giữa điều bạn muốn, cách bạn hành động và vai trò bạn đang sống.</div>`;
}

export function buildLifePathDestinyCorrelation(report: NumerologyReport, name: string): string {
  const lpNum = lifePathDisplayNumber(report);
  const destNum = report.destiny.number;
  const lp_dest_same = report.lifePath.number === destNum;
  const reducedLp = report.lifePath.number % 9 || 9;
  const reducedDest = destNum % 9 || 9;
  const lp_dest_harmony = ([1, 3, 5, 9].includes(reducedLp) && [1, 3, 5, 9].includes(reducedDest))
    || ([2, 4, 6, 8].includes(reducedLp) && [2, 4, 6, 8].includes(reducedDest));
  const compat = lp_dest_same
    ? `hoàn toàn tương đồng — cực kỳ hiếm gặp và đặc biệt. Con đường bạn đi chính là bản sắc bạn mang, giúp bạn tập trung vào mục tiêu gần như không có mâu thuẫn nội tâm`
    : (lp_dest_harmony
      ? `tương hợp tốt. Những điểm mạnh trong tính cách của bạn được thúc đẩy và thể hiện rõ ràng hơn, giúp bạn phát triển mạnh mẽ hơn`
      : `có những điểm đối đầu nhau. Tuy nhiên bạn vẫn có thể hóa giải nếu nỗ lực học hỏi và phát triển bản thân`);
  const lpTitle = readString(report.lifePath.data, ["title"]) || `năng lượng số ${lpNum}`;
  const safeName = escapeHtml(name);
  return `<p class="nar">Trong thần số học, Chỉ số Đường Đời và Chỉ số Sứ Mệnh là hai yếu tố có mối quan hệ chặt chẽ với nhau, cùng tồn tại trong một người. Chỉ số đường đời cho biết mục đích tổng thể của một người trong cuộc sống, còn chỉ số sứ mệnh cho biết cách thức một người thực hiện mục đích đó.</p>
<p class="nar">Cặp số <strong>Đường Đời ${lpNum} — Sứ Mệnh ${destNum}</strong> của <strong>${safeName}</strong> ${compat}. Khi chỉ số đường đời và sứ mệnh bổ sung hoặc cộng hưởng với nhau, những điểm mạnh trong tính cách của bạn được thúc đẩy và thể hiện rõ ràng hơn. Ngược lại, nếu đối đầu hoặc mâu thuẫn, một số năng lượng tích cực có thể bị mờ nhạt và bạn có thể cảm thấy bối rối, khó khăn trong việc đưa ra quyết định.</p>
<p class="nar">Số đường đời <strong>${lpNum}</strong> gắn liền với ${escapeHtml(lpTitle)}. Bạn luôn giữ vững lập trường khi đã xác định một vấn đề là đúng. Bên cạnh đó, số sứ mệnh <strong>${destNum}</strong> định hình cách bạn tính toán, phân tích và thực hiện mục tiêu. Khi cả hai bổ sung cho nhau sẽ giúp bạn ngày càng chắc chắn hơn trong các quyết định và giảm thiểu rủi ro trong cuộc sống.</p>
<div class="insight-box">📌 <strong>Lưu ý:</strong> Hãy đọc kỹ luận giải về cả hai chỉ số này và kết hợp chúng lại để có bức tranh toàn diện nhất về hành trình của mình.</div>`;
}

function buildLifePathSoulCorrelation(report: NumerologyReport, name: string): string {
  const lpNum = lifePathDisplayNumber(report);
  const soulNum = report.soul.number;
  const lpSoulSame = report.lifePath.number === soulNum;
  const compat = lpSoulSame
    ? `hoàn toàn đồng nhất: mục tiêu, tham vọng và những mong muốn sâu bên trong bạn hòa hợp, đồng điệu với nhau, giúp bạn phát triển mạnh mẽ hơn`
    : `có những điểm giao thoa. Bề ngoài bạn thể hiện năng lượng đường đời ${lpNum}, nhưng sâu bên trong bạn đang khao khát những điều mà linh hồn số ${soulNum} hướng tới`;
  const lpTitle = readString(report.lifePath.data, ["title"]) || `năng lượng tiêu biểu của số ${lpNum}`;
  const safeName = escapeHtml(name);
  return `<p class="nar">Chỉ số đường đời và chỉ số linh hồn là hai yếu tố có mối quan hệ chặt chẽ với nhau. Chỉ số đường đời cho biết năng lượng tổng quát của một người (các điểm mạnh, điểm yếu, xu hướng tính cách, các bài học trong cuộc đời, bản ngã nguyên thủy...); còn chỉ số linh hồn cho biết mong muốn, khao khát sâu bên trong của mỗi người.</p>
<p class="nar">Cặp số đường đời <strong>${lpNum}</strong> - linh hồn <strong>${soulNum}</strong> của <strong>${safeName}</strong> là ${compat}. Ưu điểm của số đường đời ${lpNum} là ${escapeHtml(lpTitle)}. Khi có thêm chỉ số linh hồn ${soulNum} trong bộ số, tính cách của bạn được bổ sung những nét đặc biệt riêng, tạo ra sự hòa hợp sâu sắc hơn.</p>
<p class="nar">Khi chỉ số đường đời và linh hồn bổ sung hoặc cộng hưởng với nhau, bạn sẽ cảm thấy hài lòng và thỏa mãn với hầu hết những gì mình đang làm; kiên trì và quyết tâm vượt qua mọi khó khăn để đạt được mục tiêu. Ngược lại, nếu có sự đối đầu, bạn có thể mắc kẹt và gặp khó khăn trong việc đưa ra quyết định. Tuy nhiên, bạn vẫn có thể hóa giải nếu nỗ lực học hỏi, thay đổi và phát triển bản thân.</p>
<div class="insight-box">📌 <strong>Lời khuyên:</strong> Hãy đọc thêm các luận giải về cả chỉ số Đường Đời và Linh Hồn để hiểu bức tranh tổng quát về cuộc đời mình.</div>`;
}

function karmicLessonsHtml(report: NumerologyReport, narrative: NarrativeKb, name: string): string {
  const lessons = report.karmicLessons as KarmicLessonsResult;
  if (!lessons.missingNumbers.length) {
    return `<div class="insight-box">✅ <strong>Biểu đồ tên không thiếu số nổi bật.</strong> Điều này không có nghĩa là không có bài học, mà là các bài học nghiệp không hiện lên theo dạng thiếu số rõ rệt.</div>`;
  }
  return `<p class="nar">Các số <strong>${lessons.missingNumbers.join(", ")}</strong> vắng mặt trong biểu đồ tên. Mỗi số thiếu tương ứng với một bài học nghiệp cần được nhận diện và rèn luyện.</p>${lessons.data
    .map((item) => renderIndicator(narrative, "karmicLesson", "Bài học nghiệp", { number: item.number, raw: item.number, isMaster: false, data: item.info }, name))
    .join("")}`;
}

function karmicDebtHtml(report: NumerologyReport, narrative: NarrativeKb, kb: NumerologyKb, name: string): string {
  const numbers = [
    report.lifePath.karmicDebt,
    report.destiny.karmicDebt,
    report.soul.karmicDebt,
    report.personality.karmicDebt,
    report.maturity.karmicDebt,
  ].filter((value, index, list): value is NonNullable<typeof value> => Boolean(value) && list.indexOf(value) === index);
  if (!numbers.length) return `<div class="insight-box">✅ <strong>Không phát hiện nợ nghiệp 13/14/16/19 trong các chỉ số chính.</strong></div>`;
  return numbers
    .map((num) => {
      const narrativeHtml = fromNarrative(narrative, "karmicDebt", num, { name });
      if (narrativeHtml) return narrativeHtml;
      const data = (kb.karmic_debt as Record<string, unknown>)[String(num)];
      return `<div class="karmic-debt-box">${generic(`Nợ nghiệp ${num}`, num, name, data)}</div>`;
    })
    .join("");
}

function lifePathHtml(report: NumerologyReport, narrative: NarrativeKb, ctx: NarrativeContext, name: string): string {
  const lpNum = lifePathDisplayNumber(report);
  const narrativeHtml =
    fromNarrative(narrative, "lifePath", lpNum, { name, number: lpNum }) ??
    (lpNum === 10 ? renderLifePathTenLiteral(name) : "");
  const extraHtml = renderLifePathExtra(lpNum, name);
  return [narrativeHtml, lifePathCtxBlock(lpNum, ctx, name), extraHtml].join("");
}

function challengeHtml(
  narrative: NarrativeKb,
  group: NarrativeGroup,
  label: string,
  indicator: IndicatorResult,
  name: string,
): string {
  return renderIndicator(narrative, group, label, indicator, name);
}

export function buildSynthesizedReport(input: SynthesizerInput): SynthesizedReport {
  const { report, narrative, kb } = input;
  const name = report.input.fullName;
  const ctx: NarrativeContext = {
    lifePath: lifePathDisplayNumber(report),
    soul: report.soul.number,
    destiny: report.destiny.number,
    personality: report.personality.number,
    maturity: report.maturity.number,
    birthday: report.birthday.number,
    attitude: report.attitude.number,
  };

  const phases: Phase[] = [
    {
      letter: "A",
      title: "TỔNG QUAN & BIỂU ĐỒ VẬN SỐ",
      sections: [
        section("1", "Tổng hợp các chỉ số thần số học", overviewHtml(report, name)),
        section(
          "2",
          "Phân tích chi tiết 3 năm tới",
          `<p class="nar">Biểu đồ vận số cá nhân cho thấy dòng năng lượng của các năm gần hiện tại. Phần dưới đây mở rộng 3 năm tới để bạn dễ định hướng.</p>${report.personalYearsRange
            .map((item) => buildYearDomainBlock(item.number, item.year, item.age, name))
            .join("")}`,
        ),
        section("3", "Nhóm ngành nghề phù hợp", careerHtml(report, name), { chartSlot: "career-bars" }),
      ],
    },
    {
      letter: "B",
      title: "PHÂN TÍCH ĐƯỜNG ĐỜI",
      sections: [
        section(
          "4",
          "Chỉ số Đường Đời (Số Chủ Đạo)",
          `<p class="nar"><strong>Số Đường Đời ${lifePathDisplayNumber(report)}</strong> — Đây là chỉ số cốt lõi định hình toàn bộ hành trình cuộc đời của bạn.</p>` +
            lifePathHtml(report, narrative, ctx, name),
          {
          titleBadge: String(lifePathDisplayNumber(report)),
          quickIntro: null,
          },
        ),
        section("5", "Chu Kỳ Đường Đời", buildLifeCyclesSection(report, name), {
          previewHtml: buildLifeCyclesSection(report, name, 1),
        }),
        section(
          "6",
          "Biểu đồ Kim Tự Tháp — Đỉnh cao & Thử thách",
          buildPyramidSection(report, name, narrative),
          {
            chartSlot: "pyramid",
            previewHtml: buildPyramidSection(report, name, narrative, true),
          },
        ),
        section(
          "7",
          "Chỉ số Năm Cá Nhân",
          `<p class="nar"><strong>Năm Cá Nhân ${report.personalYear.number}</strong> — ${escapeHtml(readString(report.personalYear.data, ["title"]))} (${report.personalYear.year})</p>` +
            personalPeriod("Năm", report.personalYear.number, report.personalYear.year, name, report.personalYear.data),
        ),
        section(
          "8",
          "Chu Kỳ Vận Số — Phân Tích Chi Tiết 3 Năm",
          `<p class="nar" style="font-style:italic;">Mỗi năm trong cuộc đời bạn mang một con số cá nhân riêng biệt, lặp lại theo vòng 9 năm. Những con số này cho biết luồng năng lượng chủ đạo của năm đó — ảnh hưởng toàn diện đến sự nghiệp, tài chính, tình yêu, sức khỏe và các mối quan hệ xã hội. Hiểu và đi theo luồng năng lượng này giúp bạn hành động đúng thời điểm và tránh đi ngược lại dòng chảy tự nhiên.</p>` +
            `<div class="year-cards-grid">` +
            report.personalYearsRange
              .map(
                (item) =>
                  `<div class="year-card-tab"><div class="year-card-label">NĂM ${item.year}</div><div class="year-card-num">${item.number}</div><div class="year-card-age">${item.year - report.input.dobParts.year} tuổi</div></div>`,
              )
              .join("") +
            `</div>` +
            report.personalYearsRange
              .map((item, idx) => buildPersonalYearFullBlock(item.number, item.year, item.year - report.input.dobParts.year, name, idx + 1))
              .join(""),
        ),
        section("9", "Chỉ số Tháng Cá Nhân", personalPeriod(`Tháng ${report.personalMonth.month}`, report.personalMonth.number, `${report.personalMonth.month}/${report.personalYear.year}`, name, report.personalMonth.data)),
        section(
          "10",
          "Chỉ Số Các Tháng — Phân Tích 3 Tháng",
          `<p class="nar" style="font-style:italic;">Những con số này cho biết ở mỗi tháng sẽ có những điều gì có khả năng xảy ra và bạn nên tập trung làm việc theo con số nào, theo con số này nào sẽ ở mức độ sâu hơn so với chỉ số năm.</p>` +
            `<div class="year-cards-grid">` +
            report.personalMonthsRange
              .map(
                (item) =>
                  `<div class="year-card-tab"><div class="year-card-label">THÁNG ${item.month}/${item.year}</div><div class="year-card-num">${item.number}</div></div>`,
              )
              .join("") +
            `</div>` +
            report.personalMonthsRange.map((item, idx) => personalMonthDeep(item, name, `10.${idx + 1}`)).join(""),
        ),
      ],
    },
    {
      letter: "C",
      title: "PHÂN TÍCH SỨ MỆNH & NỘI TÂM",
      sections: [
        section(
          "11",
          "Chỉ số Sứ Mệnh (Vận Mệnh)",
          `<p class="nar"><strong>Sứ Mệnh số ${report.destiny.number}</strong> — ${escapeHtml(readString(report.destiny.data, ["title"]))}. Đây là chỉ số thể hiện cách bạn đạt được mục tiêu và đóng góp cho thế giới.</p>` +
            renderIndicator(narrative, "destiny", "Sứ mệnh", report.destiny, name) +
            destinyCtxBlock(report.destiny.number, ctx, name),
        ),
        section("12", "Tương quan Đường đời & Sứ mệnh", buildLifePathDestinyCorrelation(report, name)),
        section(
          "13",
          "Thử thách Sứ Mệnh",
          `<p class="nar">Không có sứ mệnh nào không đi kèm với thử thách. Với <strong>${escapeHtml(name)}</strong>, thử thách số <strong>${report.destinyChallenge.number}</strong> xuất hiện không phải để ngăn cản bạn — mà để rèn luyện bạn trở thành phiên bản đủ mạnh để thực sự sống đúng sứ mệnh đó.</p>` +
            challengeHtml(narrative, "destinyChallenge", "Thử thách Sứ mệnh", report.destinyChallenge, name),
        ),
        section("14", "Chỉ số Trưởng Thành", renderIndicator(narrative, "maturity", "Trưởng thành", report.maturity, name) + maturityCtxBlock(report.maturity.number, ctx, name)),
        section("15", "Năng lực trong giai đoạn Trưởng Thành", renderMaturityAbility(report, name)),
        section("16", "Chỉ số Linh Hồn (Mong ước sâu thẳm)", renderIndicator(narrative, "soul", "Linh hồn", report.soul, name) + soulCtxBlock(report.soul.number, ctx, name)),
        section("17", "Tương quan Đường đời & Linh hồn", buildLifePathSoulCorrelation(report, name)),
        section("18", "Thử thách Linh Hồn", challengeHtml(narrative, "soulChallenge", "Thử thách Linh hồn", report.soulChallenge, name)),
        section("19", "Chỉ số Nhân Cách", renderIndicator(narrative, "personality", "Nhân cách", report.personality, name) + personalityCtxBlock(report.personality.number, ctx, name)),
        section("20", "Thử thách Nhân Cách", challengeHtml(narrative, "personalityChallenge", "Thử thách Nhân cách", report.personalityChallenge, name)),
        section("21", "Các bài học nghiệp (Karmic Lessons)", karmicLessonsHtml(report, narrative, name)),
        section("22", "Các chỉ số Nợ Nghiệp (Karmic Debt)", karmicDebtHtml(report, narrative, kb, name)),
      ],
    },
    {
      letter: "D",
      title: "PHÂN TÍCH NĂNG LỰC & BIỂU ĐỒ SỨC MẠNH",
      sections: [
        section("23", "Biểu đồ Sức Mạnh — Lưới Ngày Sinh (Pythagoras)", buildBirthGridNarrative(report, name), {
          chartSlot: "birth-grid",
          previewHtml: buildBirthGridNarrative(report, name, false),
        }),
        section("24", "Biểu đồ Tên & Biểu đồ Tổng Hợp", buildNameCombinedGridNarrative(report, name), { chartSlot: "combined-grid" }),
        section("25", "Chỉ số Thái Độ", renderIndicator(narrative, "attitude", "Thái độ", report.attitude, name)),
        section("26", "Chỉ số Ngày Sinh (Tài năng Tự nhiên)", renderIndicator(narrative, "birthday", "Ngày sinh", report.birthday, name)),
        section("27", "Chỉ số Vượt Khó (Tension Number)", renderIndicator(narrative, "tensionNumber", "Vượt khó", report.tensionNumber, name)),
        section("28", "Chỉ số Năng Lực Tư Duy", renderIndicator(narrative, "cognitiveAbility", "Năng lực tư duy", report.cognitiveAbility, name)),
        section("29", "Chỉ số Động Lực Tiếp Cận", renderIndicator(narrative, "approachMotivation", "Động lực tiếp cận", report.approachMotivation, name)),
        section("30", "Chỉ số Năng Lực Tiếp Cận", renderIndicator(narrative, "approachAbility", "Năng lực tiếp cận", report.approachAbility, name)),
        section("31", "Chỉ số Thái Độ Tiếp Cận", renderIndicator(narrative, "approachAttitude", "Thái độ tiếp cận", report.approachAttitude, name)),
      ],
    },
  ];

  return { profileHeader: buildProfileHeader(report), phases: withQuickIntros(phases, report) };
}

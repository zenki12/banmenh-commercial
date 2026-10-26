import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const SOURCE_PATH = "E:/huyen hoc AI/test/kb/commercial/tarot_kb/cards/cards.json";
const TARGET_DIR_1 = "E:/Project/Project/banmenh-commercial/apps/web/src/modules/tarot";
const TARGET_DIR_2 = "E:/Project/Project/ban-menh-mb-main/apps/web/src/modules/tarot";

try {
  console.log(`Đang đọc file gốc từ ${SOURCE_PATH}...`);
  const raw = readFileSync(SOURCE_PATH, "utf-8");
  const json = JSON.parse(raw);

  const majorMap = {};
  const minorMap = {};

  for (const c of json.cards) {
    const upright = c.generalUpright || c.upright || "";
    const reversed = c.generalReversed || c.reversed || "";
    const advice = c.advice || "";

    const entry = {
      id: c.id,
      nameEn: c.name,
      nameVi: c.nameVi,
      upright: upright.trim(),
      reversed: reversed.trim(),
      advice: advice.trim(),
    };

    if (c.id < 22) {
      majorMap[c.id] = entry;
    } else {
      minorMap[c.id] = entry;
    }
  }

  const majorContent = `// 22 Lá Ẩn Chính (Major Arcana)
import type { TarotDailyCardMeaning } from "./tarot-daily-kb";

export const TAROT_DAILY_MAJOR: Record<number, TarotDailyCardMeaning> = ${JSON.stringify(majorMap, null, 2)};
`;

  const minorContent = `// 56 Lá Ẩn Phụ (Minor Arcana)
import type { TarotDailyCardMeaning } from "./tarot-daily-kb";

export const TAROT_DAILY_MINOR: Record<number, TarotDailyCardMeaning> = ${JSON.stringify(minorMap, null, 2)};
`;

  const mainContent = `// Kho 78 thông điệp Tarot hàng ngày tuyển chọn từ Mystery Tarot (Phúc Hoàng / turni0)
// Tự động phân tách module để tuân thủ giới hạn 600 dòng source-lint.

export type TarotDailyCardMeaning = {
  id: number;
  nameEn: string;
  nameVi: string;
  upright: string;
  reversed: string;
  advice: string;
};

import { TAROT_DAILY_MAJOR } from "./tarot-daily-kb-major";
import { TAROT_DAILY_MINOR } from "./tarot-daily-kb-minor";

export const TAROT_DAILY_KB: Record<number, TarotDailyCardMeaning> = {
  ...TAROT_DAILY_MAJOR,
  ...TAROT_DAILY_MINOR,
};
`;

  const targets = [TARGET_DIR_1, TARGET_DIR_2];
  for (const dir of targets) {
    try {
      writeFileSync(path.join(dir, "tarot-daily-kb-major.ts"), majorContent, "utf-8");
      writeFileSync(path.join(dir, "tarot-daily-kb-minor.ts"), minorContent, "utf-8");
      writeFileSync(path.join(dir, "tarot-daily-kb.ts"), mainContent, "utf-8");
      console.log(`✓ Đã cập nhật thành công bộ 3 file tại: ${dir}`);
    } catch (err) {
      console.warn(`Không thể ghi file sang ${dir}:`, err.message);
    }
  }

  console.log(`Hoàn tất nạp ${Object.keys(majorMap).length + Object.keys(minorMap).length} lá bài Tarot tinh hoa (tuân thủ < 600 dòng)!`);
} catch (err) {
  console.error("Lỗi khi trích xuất:", err);
  process.exit(1);
}

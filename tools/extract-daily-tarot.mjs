import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const SOURCE_PATH = "E:/huyen hoc AI/test/kb/commercial/tarot_kb/cards/cards.json";
const TARGET_PATH_1 = "E:/Project/Project/banmenh-commercial/apps/web/src/modules/tarot/tarot-daily-kb.ts";
const TARGET_PATH_2 = "E:/Project/Project/ban-menh-mb-main/apps/web/src/modules/tarot/tarot-daily-kb.ts";

try {
  console.log(`Đang đọc file gốc từ ${SOURCE_PATH}...`);
  const raw = readFileSync(SOURCE_PATH, "utf-8");
  const json = JSON.parse(raw);

  const cardMap = {};

  for (const c of json.cards) {
    const upright = c.generalUpright || c.upright || "";
    const reversed = c.generalReversed || c.reversed || "";
    const advice = c.advice || "";

    cardMap[c.id] = {
      id: c.id,
      nameEn: c.name,
      nameVi: c.nameVi,
      upright: upright.trim(),
      reversed: reversed.trim(),
      advice: advice.trim(),
    };
  }

  const fileContent = `// Kho 78 thông điệp Tarot hàng ngày tuyển chọn từ Mystery Tarot (Phúc Hoàng / turni0)
// Tự động trích xuất để nạp trực tiếp vào client bundle, đảm bảo hoạt động cả trên Vercel & Local.

export type TarotDailyCardMeaning = {
  id: number;
  nameEn: string;
  nameVi: string;
  upright: string;
  reversed: string;
  advice: string;
};

export const TAROT_DAILY_KB: Record<number, TarotDailyCardMeaning> = ${JSON.stringify(cardMap, null, 2)};
`;

  writeFileSync(TARGET_PATH_1, fileContent, "utf-8");
  console.log(`✓ Đã tạo thành công: ${TARGET_PATH_1}`);

  try {
    writeFileSync(TARGET_PATH_2, fileContent, "utf-8");
    console.log(`✓ Đã cập nhật thành công: ${TARGET_PATH_2}`);
  } catch (err) {
    console.warn(`Không thể ghi file sang ${TARGET_PATH_2}:`, err.message);
  }

  console.log(`Hoàn tất nạp ${Object.keys(cardMap).length} lá bài Tarot tinh hoa!`);
} catch (err) {
  console.error("Lỗi khi trích xuất:", err);
  process.exit(1);
}

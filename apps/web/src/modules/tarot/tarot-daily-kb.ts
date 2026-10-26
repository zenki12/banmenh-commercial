// Kho 78 thông điệp Tarot hàng ngày tuyển chọn từ Mystery Tarot (Phúc Hoàng / turni0)
// Tự động phân tách module (Major & Minor) để tuân thủ giới hạn 600 dòng source-lint.

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

export type Phase =
  | "landing"
  | "fieldSelect"
  | "nicheSelect"
  | "question"
  | "spreadSelect"
  | "ritualLoading"
  | "deckDraw"
  | "spreadReveal"
  | "consciousnessCheck"
  | "finalReading";

export type Spread = 1 | 3 | 5 | 7 | 10 | 12;
export type ThemeKey = "love" | "career" | "finance" | "health" | "self" | "general";
export type Orientation = "upright" | "reversed";

export type DeckCard = {
  id: number;
  nameVi: string;
  nameEn: string;
  archetype: string;
  keywords: string[];
  upright: string;
  reversed: string;
  advice: string;
};

export type DailyCard = DeckCard & {
  orientation: Orientation;
  body: string;
};

export type DrawnCard = DeckCard & {
  orientation: Orientation;
  position: string;
};

export type ReadingSession = {
  theme: ThemeKey;
  themeLabel: string;
  spread: Spread;
  question: string;
  cards: DrawnCard[];
};

export type ReadingSection = {
  title: string;
  body: string;
};

export const CONSCIOUSNESS_QUESTION_POOLS: Record<ThemeKey, readonly string[]> = {
  love: [
    "Bạn có đang sợ bị bỏ rơi đến mức chấp nhận một mối quan hệ không rõ ràng không?",
    "Bạn có còn dùng một tổn thương cũ để đo lường sự chân thành của người hiện tại không?",
    "Bạn có đang hy sinh nhiều hơn điều mình thực sự muốn nhưng vẫn mong đối phương tự hiểu không?",
    "Bạn có thường bỏ qua ranh giới cảm xúc của mình chỉ để giữ một người ở lại không?",
    "Bạn có đang bám vào tiềm năng của mối quan hệ thay vì nhìn vào cách nó thực sự diễn ra không?",
    "Bạn có đang chờ một lời xác nhận từ người ấy để cảm thấy mình đủ giá trị không?",
  ],
  career: [
    "Bạn có đang chọn sự an toàn dù biết nó khiến đam mê và năng lực của mình dần nhỏ lại không?",
    "Bạn có từng nghĩ thành quả của mình chỉ là may mắn và sợ người khác phát hiện mình chưa đủ giỏi không?",
    "Bạn có đang ở lại một môi trường làm việc làm mình kiệt sức chỉ vì sợ bắt đầu lại không?",
    "Bạn có đang chạy theo chức danh hoặc sự công nhận nhiều hơn điều mình thật sự muốn xây dựng không?",
    "Bạn có trì hoãn một bước tiến quan trọng vì sợ phải chịu trách nhiệm lớn hơn không?",
    "Bạn có đang im lặng trước một điều bất công ở nơi làm việc để tránh xung đột không?",
  ],
  finance: [
    "Bạn có đang để nỗi sợ thiếu tiền điều khiển cả những quyết định không thực sự liên quan đến tiền không?",
    "Bạn có trì hoãn việc nhìn thẳng vào thu chi vì lo rằng con số thực tế sẽ khiến mình bất an không?",
    "Bạn có đang dùng mua sắm hoặc tích lũy như một cách làm dịu cảm giác thiếu an toàn bên trong không?",
    "Bạn có biết bước tài chính cần làm tiếp theo nhưng vẫn né tránh vì sợ mình không duy trì được không?",
    "Bạn có đang so sánh tiến độ tài chính của mình với người khác đến mức mất phương hướng riêng không?",
    "Bạn có đang đánh đổi sự ổn định dài hạn để tìm một kết quả nhanh trong ngắn hạn không?",
  ],
  self: [
    "Bạn có đang trì hoãn điều mình thật sự muốn vì sợ phiên bản mới của mình sẽ không được mọi người chấp nhận không?",
    "Bạn có đang nói mình chưa sẵn sàng trong khi điều giữ chân bạn thực ra là nỗi sợ thất bại không?",
    "Mong muốn và hành động hằng ngày của bạn có đang đi về hai hướng khác nhau không?",
    "Bạn có thường nghiêm khắc với bản thân hơn cách mình đối xử với một người mình yêu thương không?",
    "Bạn có đang giữ một vai trò cũ dù nó không còn phản ánh con người hiện tại của mình không?",
    "Bạn có đang chờ cảm giác tự tin xuất hiện trước khi cho phép mình bắt đầu không?",
  ],
  general: [
    "Bạn có đang né tránh một sự thật vì biết rằng thừa nhận nó sẽ buộc mình phải thay đổi không?",
    "Bạn có đang cố kiểm soát điều nằm ngoài khả năng của mình thay vì tập trung vào phần mình có thể hành động không?",
    "Bạn có đang lặp lại một lựa chọn quen thuộc dù kết quả của nó nhiều lần khiến mình thất vọng không?",
    "Bạn có đang đặt nhu cầu của người khác lên trước tiếng nói bên trong mình không?",
    "Bạn có biết điều gì cần buông nhưng vẫn giữ lại vì nó từng khiến mình cảm thấy an toàn không?",
    "Bạn có đang chờ một dấu hiệu hoàn hảo thay vì tin vào dữ kiện đã đủ rõ trước mắt không?",
  ],
  health: [
    "Bạn có đang bỏ qua tín hiệu cần nghỉ ngơi vì cảm thấy mình phải luôn hữu ích không?",
    "Nhịp sống hiện tại của bạn có đang lấy đi nhiều năng lượng hơn mức nó bồi đắp không?",
    "Bạn có đang trì hoãn việc tìm hỗ trợ chuyên môn cho một điều khiến mình lo lắng kéo dài không?",
    "Bạn có đang dùng sự bận rộn để tránh lắng nghe cảm xúc và nhu cầu thật của cơ thể không?",
    "Bạn có đang kỳ vọng mình hồi phục nhanh hơn nhịp độ thực tế cho phép không?",
    "Bạn có sẵn sàng điều chỉnh một thói quen nhỏ thay vì ép mình thay đổi tất cả cùng lúc không?",
  ],
};

export function selectConsciousnessQuestions(
  theme: ThemeKey,
  random: () => number = Math.random,
): [string, string, string] {
  const pool = [...CONSCIOUSNESS_QUESTION_POOLS[theme]];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }
  return [pool[0], pool[1], pool[2]];
}

type ThemeOption = {
  key: ThemeKey;
  label: string;
  hint: string;
};

type SpreadOption = {
  value: Spread;
  label: string;
  hint: string;
};

type StageCopy = {
  badge: string;
  title: string;
  subtitle: string;
  lead: string;
  bullets: string[];
  sidebarTitle: string;
  sidebarBody: string;
  metrics: string[];
};

export const LANDING_COPY = {
  badge: "TAROT · NGHI THỨC MỞ BÀI",
  title: ["Đặt câu hỏi.", "Chọn lá bài.", "Mở thông điệp."],
  subtitle:
    "Luồng Tarot được thiết kế như một nghi thức ngắn: chọn chủ đề, đặt câu hỏi, rút bài và chỉ xem luận giải sau khi toàn bộ lá đã được mở.",
  bullets: [
    "Chọn lĩnh vực và niche trước khi đặt câu hỏi.",
    "Tự tay rút từng lá từ bộ 78 lá.",
    "Bản cuối có đủ slot để nối KB Tarot thật.",
  ],
  facts: ["1 / 3 / 5 / 7 / 10 / 12 lá", "Thông điệp mỗi ngày", "Lưu lịch sử sau khi có tài khoản"],
} as const;

export const THEME_OPTIONS: ThemeOption[] = [
  { key: "love", label: "Tình yêu", hint: "Quan hệ, cảm xúc và cách hai người kết nối." },
  { key: "career", label: "Sự nghiệp", hint: "Công việc, định hướng và cơ hội phát triển." },
  { key: "finance", label: "Tài chính", hint: "Dòng tiền, quyết định chi tiêu và đầu tư." },
  { key: "health", label: "Sức khỏe", hint: "Nhịp sống, năng lượng và nhu cầu cân bằng." },
  { key: "self", label: "Bản thân", hint: "Bài học cá nhân, tiềm năng và hướng đi." },
  { key: "general", label: "Tổng quan", hint: "Một góc nhìn rộng khi bạn chưa muốn đóng khung câu hỏi." },
];

export const SPREAD_OPTIONS: SpreadOption[] = [
  { value: 1, label: "1 lá", hint: "Thông điệp trọng tâm cho hiện tại." },
  { value: 3, label: "3 lá", hint: "Quá khứ, hiện tại và xu hướng tiếp theo." },
  { value: 5, label: "5 lá", hint: "Bối cảnh, trở ngại, nguồn lực, lời khuyên và kết quả gần." },
  { value: 7, label: "7 lá", hint: "Một lớp đọc sâu hơn cho câu hỏi có nhiều tầng." },
  { value: 10, label: "10 lá", hint: "Khung đọc rộng theo cấu trúc Celtic Cross." },
  { value: 12, label: "12 lá", hint: "Dòng chảy 12 tháng hoặc 12 mặt của một chủ đề." },
];

export const SAMPLE_QUESTIONS = [
  "Tôi nên nhìn mối quan hệ hiện tại như thế nào?",
  "Điều gì đang chặn dòng công việc của tôi?",
  "Tôi cần tập trung vào điều gì trong giai đoạn này?",
  "Bài học chính của tình huống hiện tại là gì?",
];

export { NICHE_QUESTIONS } from "./tarot-questions";

// TODO(T-TAROT-KB): Replace with runtime fetch from KB worker when Tarot KB is ready.
export const DAILY_MESSAGE = {
  title: "Thông điệp mỗi ngày",
  card: "Ngôi Sao",
  body:
    "Hôm nay, hãy giữ một khoảng lặng ngắn trước khi quyết định. Lá bài nhắc bạn nhìn lại điều đang nuôi dưỡng niềm tin thay vì phản ứng quá nhanh.",
};

// Kept for backward compat. Client code should call getDailyCard(todayStr) directly.
export const DAILY_CARD = {
  card: DAILY_MESSAGE.card,
  body: DAILY_MESSAGE.body,
};

export const MINI_MODALS = {
  daily: {
    title: "Thông điệp mỗi ngày",
    body:
      "Mỗi ngày có thể mở bằng một lá bài ngắn để quan sát nhịp tâm thế, điều cần lưu ý và một hành động nhỏ nên giữ trong ngày.",
  },
  history: {
    title: "Thông điệp quá khứ",
    body:
      "Các phiên trải bài gần nhất được lưu cục bộ để bạn có thể đọc lại thông điệp trên chính trình duyệt này.",
  },
  dictionary: {
    title: "Từ điển Tarot",
    body:
      "Từ điển tổng hợp ý nghĩa lá bài, chiều xuôi, chiều ngược, từ khóa và cách đọc theo từng lĩnh vực.",
  },
  topics: {
    title: "Chủ đề phổ biến",
    body:
      "Các chủ đề được quan tâm nhiều nhất sẽ được gom lại để người dùng chọn nhanh câu hỏi phù hợp.",
  },
} as const;

export const MAJOR_NAMES = [
  ["Kẻ Khờ", "The Fool", "Khởi đầu"],
  ["Pháp Sư", "The Magician", "Hành động"],
  ["Nữ Tư Tế", "The High Priestess", "Trực giác"],
  ["Hoàng Hậu", "The Empress", "Nuôi dưỡng"],
  ["Hoàng Đế", "The Emperor", "Cấu trúc"],
  ["Giáo Hoàng", "The Hierophant", "Niềm tin"],
  ["Những Người Yêu", "The Lovers", "Lựa chọn"],
  ["Chiến Xa", "The Chariot", "Tiến lên"],
  ["Sức Mạnh", "Strength", "Nội lực"],
  ["Ẩn Sĩ", "The Hermit", "Chiêm nghiệm"],
  ["Bánh Xe Vận Mệnh", "Wheel of Fortune", "Chu kỳ"],
  ["Công Lý", "Justice", "Cân bằng"],
  ["Người Treo Ngược", "The Hanged Man", "Đổi góc nhìn"],
  ["Cái Chết", "Death", "Kết thúc"],
  ["Tiết Độ", "Temperance", "Điều hòa"],
  ["Ác Quỷ", "The Devil", "Ràng buộc"],
  ["Tòa Tháp", "The Tower", "Phá vỡ"],
  ["Ngôi Sao", "The Star", "Hy vọng"],
  ["Mặt Trăng", "The Moon", "Mơ hồ"],
  ["Mặt Trời", "The Sun", "Rõ ràng"],
  ["Phán Xét", "Judgement", "Thức tỉnh"],
  ["Thế Giới", "The World", "Hoàn tất"],
] as const;

const SUITS = [
  { vi: "Gậy", en: "Wands", focus: "động lực và hành động", keyword: "hành động" },
  { vi: "Cốc", en: "Cups", focus: "cảm xúc và kết nối", keyword: "cảm xúc" },
  { vi: "Kiếm", en: "Swords", focus: "suy nghĩ và quyết định", keyword: "tư duy" },
  { vi: "Đồng", en: "Pentacles", focus: "vật chất và nền tảng", keyword: "thực tế" },
] as const;

const RANKS = [
  ["Át", "Ace", "mầm khởi đầu"],
  ["Hai", "Two", "sự cân bằng"],
  ["Ba", "Three", "mở rộng"],
  ["Bốn", "Four", "ổn định"],
  ["Năm", "Five", "thử thách"],
  ["Sáu", "Six", "hài hòa"],
  ["Bảy", "Seven", "kiểm tra"],
  ["Tám", "Eight", "nhịp đều"],
  ["Chín", "Nine", "thu hoạch"],
  ["Mười", "Ten", "hoàn vòng"],
  ["Tiểu Đồng", "Page", "tín hiệu mới"],
  ["Kỵ Sĩ", "Knight", "động lực tiến lên"],
  ["Hoàng Hậu", "Queen", "khả năng tích hợp"],
  ["Vua", "King", "quyền chủ động"],
] as const;

function majorCard([nameVi, nameEn, archetype]: (typeof MAJOR_NAMES)[number], id: number): DeckCard {
  return {
    id,
    nameVi,
    nameEn,
    archetype,
    keywords: [archetype, "quan sát", "chuyển hướng"],
    upright: `${nameVi} mở ra lớp nghĩa về ${archetype.toLowerCase()}. Lá này nhắc bạn nhìn rõ điều đang xuất hiện và chọn phản ứng có ý thức hơn.`,
    reversed: `${nameVi} ở chiều ngược cho thấy năng lượng ${archetype.toLowerCase()} đang bị giữ lại, lệch nhịp hoặc chưa được dùng đúng chỗ.`,
    advice: `Hãy gọi tên phần ${archetype.toLowerCase()} trong tình huống và chọn một bước nhỏ để đưa nó về trạng thái rõ ràng hơn.`,
  };
}

function minorCard(suit: (typeof SUITS)[number], rank: (typeof RANKS)[number], id: number): DeckCard {
  const [rankVi, rankEn, archetype] = rank;
  const nameVi = `${rankVi} ${suit.vi}`;
  const nameEn = `${rankEn} of ${suit.en}`;
  return {
    id,
    nameVi,
    nameEn,
    archetype: `${archetype} trong ${suit.focus}`,
    keywords: [archetype, suit.keyword, "điều chỉnh"],
    upright: `${nameVi} cho thấy ${archetype} đang vận hành trong tầng ${suit.focus}. Đây là dấu hiệu cần nhìn vào hành động cụ thể thay vì chỉ đoán cảm giác.`,
    reversed: `${nameVi} ở chiều ngược cho thấy ${suit.focus} có thể đang bị chậm, bị kéo lệch hoặc chưa được đặt vào đúng vị trí.`,
    advice: `Hãy chọn một việc nhỏ liên quan đến ${suit.focus} và làm nó rõ hơn trong 24 giờ tới.`,
  };
}

export const DECK: DeckCard[] = [
  ...MAJOR_NAMES.map((card, index) => majorCard(card, index)),
  ...SUITS.flatMap((suit, suitIndex) => RANKS.map((rank, rankIndex) => minorCard(suit, rank, 22 + suitIndex * 14 + rankIndex))),
];

const DAILY_CARD_MESSAGES: Record<string, string> = {
  "Kẻ Khờ": "Hôm nay hợp để thử một bước mới, nhưng hãy giữ sự tỉnh táo trước khi nhảy vào điều chưa rõ.",
  "Pháp Sư": "Bạn đang có đủ công cụ cần thiết. Hãy chọn một việc cụ thể và biến ý tưởng thành hành động nhỏ.",
  "Nữ Tư Tế": "Trực giác đang nói nhỏ hơn lý trí. Hãy dành vài phút lắng lại trước khi phản hồi.",
  "Hoàng Hậu": "Điều cần nuôi dưỡng hôm nay là sự mềm mại. Một hành động chăm sóc nhỏ có thể đổi nhịp cả ngày.",
  "Hoàng Đế": "Hãy đặt lại ranh giới và cấu trúc. Sự rõ ràng sẽ giúp bạn bớt bị kéo theo cảm xúc nhất thời.",
  "Giáo Hoàng": "Một lời khuyên có nền tảng sẽ hữu ích hơn tự đoán một mình. Hãy quay về nguyên tắc bạn tin là đúng.",
  "Những Người Yêu": "Ngày hôm nay nhấn mạnh lựa chọn từ trái tim nhưng cần sự thành thật. Đừng né điều cần được gọi tên.",
  "Chiến Xa": "Năng lượng tiến lên đang mạnh. Chọn hướng rõ ràng, rồi đi từng bước thay vì kéo mình theo nhiều phía.",
  "Sức Mạnh": "Sự kiên nhẫn là sức mạnh chính hôm nay. Bạn không cần thắng bằng áp lực, chỉ cần không bỏ rơi mình.",
  "Ẩn Sĩ": "Một khoảng lặng sẽ giúp bạn thấy điều đang bị nhiễu. Hãy tạm lùi lại trước khi đưa ra kết luận.",
};

const DAILY_FALLBACK_BODY =
  "Lá bài hôm nay mời bạn quan sát kỹ nhịp cảm xúc và chọn một hành động nhỏ, rõ ràng, thay vì phản ứng quá nhanh.";

export function getDailyCard(dateStr: string, seed?: string): DailyCard {
  const combinedKey = seed ? `${dateStr}_${seed}` : dateStr;
  const hash = Array.from(combinedKey).reduce((value, char) => {
    return Math.imul(value ^ char.charCodeAt(0), 16777619) >>> 0;
  }, 2166136261);
  const card = DECK[hash % DECK.length] ?? DECK[0];
  const orientation: "upright" | "reversed" = (hash >>> 8) % 2 === 0 ? "upright" : "reversed";

  const body = orientation === "reversed"
    ? card.reversed
    : (DAILY_CARD_MESSAGES[card.nameVi] ?? card.upright);

  return {
    ...card,
    orientation,
    body,
  };
}

export const POSITION_LABELS: Record<Spread, string[]> = {
  1: ["Thông điệp trọng tâm"],
  3: ["Quá khứ", "Hiện tại", "Xu hướng"],
  5: ["Bối cảnh", "Trở ngại", "Nguồn lực", "Lời khuyên", "Kết quả gần"],
  7: ["Nền tảng", "Điều nổi lên", "Thử thách", "Nguồn lực", "Điều cần buông", "Hành động", "Thông điệp"],
  10: ["Trung tâm", "Thử thách", "Gốc rễ", "Quá khứ gần", "Điều cản trở", "Tương lai gần", "Bản thân", "Môi trường", "Hy vọng", "Kết luận"],
  12: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
};

export const STAGE_COPY: Record<Exclude<Phase, "landing">, StageCopy> = {
  fieldSelect: stage("II", "Chọn lĩnh vực", "Vũ trụ cần biết bạn muốn khám phá điều gì trước tiên", "Bản đồ Tarot rõ hơn khi câu hỏi được đặt vào đúng lớp đời sống.", ["6 chủ đề lớn", "Niche nhỏ ở bước sau", "Sẵn slot KB chủ đề"]),
  nicheSelect: stage("II", "Lĩnh vực chi tiết", "Thu hẹp ngữ cảnh để thông điệp sắc nét hơn", "Một niche cụ thể giúp câu hỏi bớt chung chung và giúp phần luận giải đi thẳng vào trọng tâm.", ["Niche cụ thể", "Tìm kiếm nhanh", "Câu hỏi sát hơn"]),
  question: stage("III", "Câu hỏi của bạn", "Hãy đặt câu hỏi với tất cả sự thành tâm", "Câu hỏi càng rõ, phần đọc càng ít mơ hồ. Bạn có thể chọn gợi ý hoặc tự nhập.", ["Gợi ý", "Tự nhập", "Giới hạn 200 ký tự"]),
  spreadSelect: stage("IV", "Chọn kiểu trải bài", "Mỗi kiểu trải bài mang một chiều sâu khác nhau", "Số lá quyết định độ rộng của bản đọc: từ thông điệp nhanh đến cấu trúc nhiều tầng.", ["1 lá", "3 lá", "Mở rộng sau"]),
  ritualLoading: stage("V", "Nghi thức mở bài", "Giữ nhịp thở trước khi lá bài lên tiếng", "Đây là khoảnh khắc chuyển từ câu hỏi sang trải nghiệm rút bài.", ["Tập trung", "Lắng nghe", "Chuẩn bị deck"]),
  deckDraw: stage("VI", "Rút bài", "Chọn từ bộ 78 lá", "Người dùng tự chọn lá để giữ cảm giác nghi thức và quyền tham gia vào lượt đọc.", ["78 lá", "Rút tuần tự", "Có tray chọn"]),
  spreadReveal: stage("VII", "Lật lá", "Mỗi lá đã chọn sẽ mở nghĩa riêng", "Bước này giúp người dùng đọc từng lá trước khi xem phần tổng hợp cuối.", ["Flip từng lá", "Vị trí riêng", "Sẵn card asset"]),
  consciousnessCheck: stage("VIII", "Kết nối tâm thức", "Ba xác nhận trước khi đọc kết quả", "Các câu hỏi ngắn giúp phần luận giải bám sát trạng thái hiện tại của người hỏi.", ["3 xác nhận", "Có/Không", "Tăng ngữ cảnh"]),
  finalReading: stage("IX", "Luận giải cuối cùng", "Bản tổng hợp sau cùng đã sẵn chỗ cho KB", "Kết quả chia thành các khối riêng để sau này thay bằng nội dung KB thật.", ["Tổng quan", "Mạch chính", "Hành động"]),
};

function stage(badge: string, title: string, subtitle: string, body: string, metrics: string[]): StageCopy {
  return {
    badge,
    title,
    subtitle,
    lead: body,
    bullets: metrics,
    sidebarTitle: "Vai trò của bước này",
    sidebarBody: body,
    metrics,
  };
}

export function getThemeLabel(theme: ThemeKey) {
  return THEME_OPTIONS.find((item) => item.key === theme)?.label ?? "Tổng quan";
}

export function drawCards(spread: Spread) {
  const labels = POSITION_LABELS[spread];
  const pool = [...DECK].sort(() => Math.random() - 0.5);
  return labels.map((position, index) => {
    const card = pool[index % pool.length];
    return {
      ...card,
      orientation: Math.random() > 0.26 ? "upright" : "reversed",
      position,
    } satisfies DrawnCard;
  });
}

export function getCardMessage(card: DrawnCard) {
  return card.orientation === "upright" ? card.upright : card.reversed;
}

export function buildReadingSections(session: ReadingSession): ReadingSection[] {
  const first = session.cards[0];
  const middle = session.cards[Math.floor(session.cards.length / 2)];
  const last = session.cards[session.cards.length - 1];
  return [
    {
      title: "Tổng quan",
      body: `Phiên trải ${session.spread} lá cho chủ đề ${session.themeLabel.toLowerCase()} mở bằng ${first?.nameVi ?? "lá đầu tiên"} và khép bằng ${last?.nameVi ?? "lá cuối"}. Đây là khung đọc để quan sát mạch chính của câu hỏi: ${session.question}`,
    },
    {
      title: "Mạch chính",
      body: `Lá trung tâm là ${middle?.nameVi ?? "lá trung tâm"}. Trong bản thật, khối này sẽ nhận nội dung KB theo lá, vị trí, chiều lá, lĩnh vực và câu hỏi của người dùng.`,
    },
    {
      title: "Điểm cần chú ý",
      body: "Các lá được đọc cùng nhau để tìm điểm đang lặp lại: nơi năng lượng bị dồn lại, nơi cần rõ ràng hơn và nơi nên tạm dừng trước khi quyết định.",
    },
    {
      title: "Hành động tiếp theo",
      body: "Hãy chọn một bước nhỏ có thể làm trong 24 giờ tới. Tarot ở đây không ép kết luận, mà giúp bạn nhìn rõ điều cần quan sát và điều có thể thử nghiệm.",
    },
  ];
}

export function buildReadingSummary(session: ReadingSession) {
  return buildReadingSections(session)
    .map((section) => `${section.title}: ${section.body}`)
    .join("\n\n");
}

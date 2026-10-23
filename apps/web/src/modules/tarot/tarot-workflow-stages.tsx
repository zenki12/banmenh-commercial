import type { TarotAiReading } from "@banmenh/shared";
import { useMemo, useState } from "react";
import { Button, Card } from "../../components/ui";
import { TarotProfileFields } from "./tarot-profile-fields";
import { TarotDestinyCombos } from "./tarot-destiny-combo";
import { TarotDeckRitual } from "./tarot-deck-ritual";
import { TarotReadingCardDetail } from "./tarot-reading-card-detail";
import type { TarotTopic } from "./tarot-topics";
import { AnalysisCard, RitualPulse, SpreadOption, ThemeOption } from "./tarot-ui";
import { tarotCardImageSrc } from "./tarot-kb";
import {
  MINI_MODALS,
  NICHE_QUESTIONS,
  SAMPLE_QUESTIONS,
  SPREAD_OPTIONS,
  type ReadingSection,
  type ReadingSession,
  type Spread,
  type ThemeKey,
} from "./tarot-data";

export { SpreadRevealView } from "./tarot-spread-reveal";

export type TarotModalKey = keyof typeof MINI_MODALS | null;

type QuestionMode = "suggested" | "custom";

export function FieldSelectView({
  activeTheme,
  onAdvance,
  onSkip,
  topics,
}: {
  activeTheme: ThemeKey;
  onAdvance: (theme: ThemeKey) => void;
  onSkip: () => void;
  topics: TarotTopic[];
}) {
  return (
    <div className="tarot-stage-block">
      <Card className="tarot-stage-highlight" padding="lg" variant="glass">
        <div className="tarot-stage-highlight-title">
          <span>✦</span>
          <strong>Chọn một chủ đề để mở cánh cửa đầu tiên</strong>
        </div>
        <p>
          Từ đây, Tarot sẽ đi vào đúng mạch câu hỏi của bạn. Mỗi chủ đề là một lớp đọc riêng, và mỗi lớp sẽ mở tiếp
          các niche nhỏ ở bước sau.
        </p>
      </Card>

      <div className="tarot-topic-grid">
        {topics.map((item) => (
          <TopicCard active={item.key === activeTheme} key={item.key} item={item} onClick={() => onAdvance(item.key)} />
        ))}
      </div>

      <div className="tarot-stage-actions">
        <Button onClick={onSkip} variant="secondary">
          Bỏ qua bước chọn chủ đề
        </Button>
      </div>
    </div>
  );
}

function TopicCard({
  active,
  item,
  onClick,
}: {
  active: boolean;
  item: TarotTopic;
  onClick: () => void;
}) {
  return (
    <button
      className={active ? "tarot-option active tarot-topic-card" : "tarot-option tarot-topic-card"}
      onClick={onClick}
      type="button"
    >
      <span>{item.icon}</span>
      <strong>{item.label}</strong>
      <em>{item.subtitle}</em>
      <p>{item.lead}</p>
    </button>
  );
}

export function NicheSelectView({
  niches,
  onChoose,
  query,
  setQuery,
  topic,
}: {
  niches: TarotTopic["niches"];
  onChoose: (label: string, kbKey: string) => void;
  query: string;
  setQuery: (value: string) => void;
  topic: TarotTopic;
}) {
  return (
    <div className="tarot-stage-block">
      <Card className="tarot-stage-highlight" padding="lg" variant="glass">
        <div className="tarot-stage-highlight-title">
          <strong>Lĩnh vực {topic.label}</strong>
        </div>
        <p>{topic.lead}</p>
      </Card>

      <label className="tarot-search-wrap">
        <span>Tìm nhanh chủ đề</span>
        <input
          className="tarot-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ví dụ: gia đình, đồng nghiệp, đầu tư..."
          type="search"
          value={query}
        />
      </label>

      <div className="tarot-niche-list">
        {niches.length > 0 ? (
          niches.map((item) => (
            <button className="tarot-niche" key={item.label} onClick={() => onChoose(item.label, item.kbKey)} type="button">
              <span className="niche-label">{item.label}</span>
              <span className="niche-hint">{item.hint}</span>
              <i aria-hidden="true">→</i>
            </button>
          ))
        ) : (
          <Card padding="md" variant="glass">
            <p className="text-[var(--bm-text-soft)]">Không thấy kết quả phù hợp. Hãy đổi từ khóa hoặc quay lại danh sách đầy đủ.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

export function QuestionView({
  nicheKey,
  onBack,
  onContinue,
  onSelectQuestion,
  onSkip,
  profileDob,
  profileGender,
  profileName,
  question,
  questionMode,
  setProfileDob,
  setProfileGender,
  setProfileName,
  setQuestion,
  setQuestionMode,
}: {
  nicheKey: string;
  onBack: () => void;
  onContinue: () => void;
  onSelectQuestion: (value: string) => void;
  onSkip: () => void;
  profileDob: string;
  profileGender: string;
  profileName: string;
  question: string;
  questionMode: QuestionMode;
  setProfileDob: (value: string) => void;
  setProfileGender: (value: string) => void;
  setProfileName: (value: string) => void;
  setQuestion: (value: string) => void;
  setQuestionMode: (value: QuestionMode) => void;
}) {
  const questions = useMemo(() => {
    const pool = NICHE_QUESTIONS[nicheKey] ?? SAMPLE_QUESTIONS;
    return [...pool].sort(() => Math.random() - 0.5);
  }, [nicheKey]);

  return (
    <div className="tarot-stage-block">
      <Card className="tarot-stage-highlight tarot-stage-highlight--question" padding="lg" variant="glass">
        <div className="tarot-stage-highlight-title">
          <strong>Câu hỏi của bạn</strong>
        </div>
        <p>Đặt câu hỏi ngắn gọn, cụ thể, và đủ thành tâm. Hệ thống sẽ bám vào câu này ở các bước sau.</p>
      </Card>

      <div className="tarot-segmented">
        <button className={questionMode === "suggested" ? "active" : ""} onClick={() => setQuestionMode("suggested")} type="button">
          Câu hỏi gợi ý
        </button>
        <button className={questionMode === "custom" ? "active" : ""} onClick={() => setQuestionMode("custom")} type="button">
          Tự nhập
        </button>
      </div>

      {questionMode === "suggested" ? (
        <div className="tarot-question-cloud">
          {questions.map((item) => (
            <button className={question === item ? "active" : ""} key={item} onClick={() => onSelectQuestion(item)} type="button">
              {item}
            </button>
          ))}
        </div>
      ) : (
        <label className="block">
          <textarea
            className="tarot-textarea"
            maxLength={200}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Điều bạn muốn vũ trụ giải đáp... (tùy chọn)"
            value={question}
          />
          <span className="tarot-counter">{question.length} / 200</span>
        </label>
      )}

      <TarotProfileFields
        dob={profileDob}
        gender={profileGender}
        name={profileName}
        onDobChange={setProfileDob}
        onGenderChange={setProfileGender}
        onNameChange={setProfileName}
      />

      <div className="tarot-stage-actions">
        <Button onClick={onBack} variant="secondary">
          Quay lại
        </Button>
        <Button onClick={onSkip} variant="ghost">
          Bỏ qua câu hỏi gợi ý
        </Button>
        <Button onClick={onContinue}>Tiếp tục</Button>
      </div>
    </div>
  );
}

export function SpreadSelectView({
  hasPlan,
  onBack,
  onContinue,
  onLockedSpread,
  quotaRemaining,
  setSpread,
  spread,
}: {
  hasPlan: boolean;
  onBack: () => void;
  onContinue: () => void;
  onLockedSpread: () => void;
  quotaRemaining: number | null;
  setSpread: (value: Spread) => void;
  spread: Spread;
}) {
  return (
    <div className="tarot-stage-block">
      <Card className="tarot-stage-highlight tarot-stage-highlight--spread" padding="lg" variant="glass">
        <div className="tarot-stage-highlight-title">
          <strong>Chọn kiểu trải bài</strong>
        </div>
        <p>
          Mỗi kiểu trải bài là một khung đọc khác nhau. Chọn ít lá khi muốn gọn ý, chọn nhiều lá khi cần đi sâu hơn
          vào diễn biến, lực kéo và kết quả.
        </p>
      </Card>

      <p className="rounded-xl border border-[var(--bm-border-subtle)] bg-[var(--bm-bg-glass)] p-4 text-sm font-bold text-[var(--bm-text-soft)]">
        {hasPlan
          ? "Gói Tarot đang hoạt động: không giới hạn lượt và đã mở toàn bộ trải bài VIP."
          : `Gói miễn phí: còn ${quotaRemaining ?? 3}/3 lượt hôm nay. Trải bài từ 5 lá yêu cầu nâng cấp.`}
      </p>

      <div className="tarot-spread-grid">
        {SPREAD_OPTIONS.map((item) => {
          const locked = item.value > 3 && !hasPlan;
          return (
          <SpreadOption
            active={item.value === spread}
            hint={item.hint}
            label={item.label}
            locked={locked}
            key={item.value}
            value={item.value}
            onClick={() => locked ? onLockedSpread() : setSpread(item.value)}
          />
          );
        })}
      </div>

      <div className="tarot-stage-actions">
        <Button onClick={onBack} variant="secondary">
          Quay lại
        </Button>
        <Button onClick={onContinue}>Mở bài</Button>
      </div>
    </div>
  );
}

export function RitualLoadingView({ session }: { session: ReadingSession }) {
  return (
    <section className="tarot-stage tarot-stage--ritual tarot-fade-up">
      <div className="tarot-stage-shell tarot-stage-shell--centered">
        <div className="tarot-stage-topbar">
          <div className="tarot-stage-tabs" aria-hidden="true">
            {[1, 2, 3, 4].map((item) => (
              <span className="done" key={item} />
            ))}
          </div>
        </div>
        <div className="tarot-ritual-layout">
          <RitualPulse />
          <h2>Hãy nghiêm túc suy nghĩ và tự trả lời...</h2>
          <p className="tarot-ritual-question">“{session.question}”</p>
          <p className="tarot-ritual-caption">Chậm lại một nhịp. Vũ trụ đang lắng nghe.</p>
        </div>
      </div>
    </section>
  );
}

export function DeckDrawView({
  onChoose,
  selectedIndexes,
  session,
}: {
  onChoose: (deckIndex: number) => void;
  selectedIndexes: number[];
  session: ReadingSession;
}) {
  return (
    <section className="tarot-stage tarot-stage--deck tarot-fade-up">
      <div className="tarot-stage-shell tarot-stage-shell--wide">
        <div className="tarot-stage-reading-header">
          <p>{session.themeLabel} · {session.spread} lá</p>
          <h2>Rút bài từ bộ 78 lá</h2>
          <span>Chạm vào các lá bài để chọn đúng số lượng theo kiểu trải đã chọn.</span>
        </div>

        <TarotDeckRitual onChoose={onChoose} selectedIndexes={selectedIndexes} session={session} />
      </div>
    </section>
  );
}

export function ConsciousnessCheckView({
  onAnswer,
  prompts,
  session,
  step,
}: {
  onAnswer: (answer: boolean) => void;
  prompts: readonly [string, string, string];
  session: ReadingSession;
  step: number;
}) {
  return (
    <section className="tarot-stage tarot-stage--consciousness tarot-fade-up">
      <div className="tarot-stage-shell tarot-stage-shell--centered">
        <div className="tarot-stage-reading-header tarot-stage-reading-header--compact">
          <p>{session.themeLabel} · Kết nối tâm thức</p>
          <h2>Hãy dành vài nhịp để tự đối thoại</h2>
          <span>Câu hỏi này giúp gỡ lớp diễn giải cuối cùng trước khi sang phần luận giải.</span>
        </div>

        <Card className="tarot-consciousness-card" padding="lg" variant="glass">
          <div className="tarot-star">✦</div>
          <h1>Kết nối tâm thức</h1>
          <p>Vũ trụ cần bạn xác nhận 3 điều để thông điệp được giải mã chính xác hơn cho hoàn cảnh hiện tại.</p>
          <p className="tarot-consciousness-progress">Câu {step + 1} / 3</p>
          <div className="tarot-consciousness-question">{prompts[step]}</div>
          <div className="tarot-consciousness-actions">
            <Button onClick={() => onAnswer(true)} variant="secondary">
              Có
            </Button>
            <Button onClick={() => onAnswer(false)} variant="secondary">
              Không
            </Button>
          </div>
          <button className="tarot-link-button" onClick={() => onAnswer(false)} type="button">
            Chia sẻ thêm thông tin
          </button>
        </Card>
      </div>
    </section>
  );
}

export function FinalReadingView({
  aiDisclosure,
  aiError,
  aiFallback,
  aiLoading,
  aiReading,
  nicheKey,
  nicheLabel,
  onReset,
  profileDob,
  profileName,
  readingSections,
  session,
}: {
  aiDisclosure?: string;
  aiError?: string | null;
  aiFallback?: boolean;
  aiLoading: boolean;
  aiReading: TarotAiReading | null;
  nicheKey: string;
  nicheLabel: string;
  onReset: () => void;
  profileDob: string;
  profileName: string;
  readingSections: ReadingSection[];
  session: ReadingSession;
}) {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  return (
    <section className="tarot-stage tarot-stage--final tarot-fade-up">
      <div className="tarot-stage-shell tarot-stage-shell--wide">
        <div className="tarot-stage-reading-header">
          <p>{session.themeLabel} · Thông điệp sau cùng</p>
          <h2>Thông điệp từ vũ trụ</h2>
          <span>Luận giải kết hợp câu hỏi, ngữ cảnh và toàn bộ các lá bài bạn đã mở.</span>
        </div>

        {aiLoading ? (
          <Card className="tarot-ai-loading" padding="lg" variant="glass">
            <div aria-hidden="true" className="tarot-ai-orbit">✦</div>
            <h3>Đang kết nối các lớp thông điệp</h3>
            <p>Hệ thống đang luận giải mối liên hệ giữa câu hỏi, vị trí và chiều của từng lá bài.</p>
          </Card>
        ) : (
          <div className="tarot-final-grid">
            <div className="tarot-final-story">
              {aiReading ? (
                <>
                  <TarotDestinyCombos
                    nicheKey={nicheKey}
                    profileName={profileName}
                    session={session}
                  />
                  <Card as="article" className="tarot-final-section" padding="lg" variant="glass">
                    <h3>Lời Hồi Đáp Từ Vũ Trụ</h3>
                    <p>{aiReading.overview}</p>
                  </Card>

                  {aiReading.cards.map((item, index) => {
                    const card = session.cards[index];
                    return card ? (
                      <button
                        aria-label={`Xem chi tiết chuyên sâu lá ${card.nameVi}`}
                        className="tarot-ai-card-trigger"
                        key={`${item.position}-${item.cardName}`}
                        onClick={() => setSelectedCardIndex(index)}
                        type="button"
                      >
                        <Card className="tarot-ai-card-reading" padding="lg" variant="glass">
                          <img
                            alt={`${card.nameVi} - ${card.orientation === "upright" ? "Xuôi" : "Ngược"}`}
                            className={`tarot-ai-card-image ${card.orientation === "reversed" ? "is-reversed" : ""}`}
                            src={tarotCardImageSrc(card)}
                          />
                          <div>
                            <p className="tarot-ai-card-position">{item.position}</p>
                            <h3>{item.cardName}</h3>
                            <p>{item.interpretation}</p>
                            <span className="tarot-ai-card-detail-hint">Xem chi tiết lá bài</span>
                          </div>
                        </Card>
                      </button>
                    ) : null;
                  })}

                  <Card as="article" className="tarot-final-section" padding="lg" variant="glass">
                    <h3>Góc Nhìn Sâu Hơn & Nút Thắt</h3>
                    <p>{aiReading.synergy}</p>
                  </Card>

                  <Card as="article" className="tarot-final-section" padding="lg" variant="glass">
                    <h3>Gợi Ý Hành Động Thực Tế</h3>
                    <ul className="tarot-ai-advice-list">
                      {aiReading.advice.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </Card>
                </>
              ) : (
                readingSections.map((section) => (
                  <Card as="article" className="tarot-final-section tarot-final-section--placeholder" key={section.title} padding="lg" variant="glass">
                    <h3>{section.title}</h3>
                    <p>{section.body}</p>
                  </Card>
                ))
              )}
            </div>

            <div className="tarot-final-aside">
              <Card className="tarot-final-card" padding="lg" variant="glass">
                <h3>Nguồn luận giải</h3>
                <p>{aiFallback ? "Gemini tạm thời không khả dụng; hệ thống đang hiển thị bản đọc dự phòng từ template an toàn." : "Nội dung được Gemini hỗ trợ diễn giải từ dữ liệu của phiên Tarot."}</p>
              </Card>
              <AnalysisCard card={session.cards[0]} />
              {session.cards[1] ? <AnalysisCard card={session.cards[1]} /> : null}
            </div>
          </div>
        )}

        {aiError ? <p className="tarot-ai-error" role="status">{aiError}</p> : null}

        <Card className="tarot-final-card" padding="lg" variant="glass">
          <h3>Bộ lá đã mở</h3>
          <div className="tarot-final-cards">
            {session.cards.map((card) => (
              <span key={`${card.id}-${card.position}`}>
                {card.position}: {card.nameVi} · {card.orientation === "upright" ? "Xuôi" : "Ngược"}
              </span>
            ))}
          </div>
        </Card>

        <Card className="tarot-ai-disclosure" padding="lg" variant="glass">
          <h3>Minh bạch về AI</h3>
          <p>{aiDisclosure ?? "Một số nội dung có thể được xử lý bởi nhà cung cấp AI bên thứ ba để hỗ trợ cá nhân hóa diễn giải."}</p>
          <p>
            Thông điệp mang tính chất chiêm nghiệm và định hướng tinh thần, không thay thế lời khuyên y tế, tài chính hay pháp lý. Nội dung trên Bản Mệnh chỉ mang tính tham khảo, hỗ trợ tự phản tỉnh và giải trí có định hướng; bạn chịu trách nhiệm với các quyết định cá nhân của mình.
          </p>
        </Card>

        <div className="tarot-center-action">
          <Button onClick={onReset} size="lg">
            Trở về đầu hành trình
          </Button>
        </div>
      </div>

      {selectedCardIndex !== null && session.cards[selectedCardIndex] ? (
        <TarotReadingCardDetail
          card={session.cards[selectedCardIndex]}
          dob={profileDob}
          fallbackAspectMeaning={aiReading?.cards[selectedCardIndex]?.interpretation ?? ""}
          name={profileName}
          nicheKey={nicheKey}
          nicheLabel={nicheLabel}
          onClose={() => setSelectedCardIndex(null)}
        />
      ) : null}
    </section>
  );
}

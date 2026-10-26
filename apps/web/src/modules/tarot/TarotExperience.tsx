"use client";

import {
  ERROR_MESSAGES,
  isAppError,
  type TarotAiReadingRequest,
  type TarotAiReadingResponse,
} from "@banmenh/shared";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Card } from "../../components/ui";
import { fetchWithAuth } from "../../lib/api/client";
import { useAuth } from "../../lib/auth";
import {
  buildReadingSections,
  getCardMessage,
  getDailyCard,
  MINI_MODALS,
  SAMPLE_QUESTIONS,
  STAGE_COPY,
  drawCards,
  getThemeLabel,
  selectConsciousnessQuestions,
  type Phase,
  type ReadingSection,
  type ReadingSession,
  type Spread,
  type ThemeKey,
} from "./tarot-data";
import { LandingView } from "./tarot-landing";
import { useTarotProfileName } from "./tarot-profile-state";
import { saveProfile } from "./tarot-saved-profiles";
import {
  clearTarotHistory,
  createTarotHistoryEntry,
  deleteTarotHistoryEntry,
  loadTarotHistory,
  saveTarotHistory,
  type TarotHistoryEntry,
} from "./tarot-history";
import { TarotHistoryView } from "./tarot-history-view";
import { TarotDictionary } from "./tarot-dictionary";
import { TarotDailyCard } from "./tarot-daily-card";
import { NicheConsciousnessCheckView } from "./tarot-niche-consciousness";
import { loadNicheClarifyQuestions } from "./tarot-niche-clarify";
import {
  hasCompletedTarotTheme,
  localTarotDateKey,
  markTarotThemeCompleted,
} from "./tarot-repeat-warning";
import { TarotUniverseWarning } from "./tarot-universe-warning";
import { ALL_TOPICS, TOPICS } from "./tarot-topics";
import {
  DAILY_REVEALED_KEY,
  DAILY_SEEN_KEY,
  getOrCreateDeviceSeed,
  hasDailyDate,
  storeDailyDate,
} from "./tarot-daily-storage";
import { ModalShell } from "./tarot-ui";
import { TarotUpgradeModal } from "./tarot-upgrade-modal";
import {
  DeckDrawView,
  FieldSelectView,
  FinalReadingView,
  NicheSelectView,
  QuestionView,
  RitualLoadingView,
  SpreadRevealView,
  SpreadSelectView,
  type TarotModalKey,
} from "./tarot-workflow-stages";

type QuestionMode = "suggested" | "custom";

const DEFAULT_QUESTION = "Tôi nên nhìn tình huống hiện tại như thế nào?";
const STAGE_SEQUENCE: Exclude<Phase, "landing">[] = [
  "fieldSelect",
  "nicheSelect",
  "question",
  "spreadSelect",
  "ritualLoading",
  "deckDraw",
  "spreadReveal",
  "consciousnessCheck",
  "finalReading",
];

type TarotQuota = {
  hasPlan: boolean;
  limit: number | null;
  used: number;
  remaining: number | null;
};

export function TarotExperience() {
  const { signInAnonymouslyFn, user } = useAuth();
  const [phase, setPhase] = useState<Phase>("landing");
  const [modal, setModal] = useState<TarotModalKey>(null);
  const [dailyRevealed, setDailyRevealed] = useState(false);
  const [theme, setTheme] = useState<ThemeKey>("love");
  const [niche, setNiche] = useState("Tổng quan");
  const [nicheKbKey, setNicheKbKey] = useState("general");
  const [nicheQuery, setNicheQuery] = useState("");
  const [question, setQuestion] = useState("");
  const [questionMode, setQuestionMode] = useState<QuestionMode>("suggested");
  const [profileName, setProfileName] = useTarotProfileName(user?.displayName);
  const [profileDob, setProfileDob] = useState("");
  const [profileGender, setProfileGender] = useState("");
  const [consciousnessPrompts, setConsciousnessPrompts] = useState(() => selectConsciousnessQuestions("love"));
  const [spread, setSpread] = useState<Spread>(3);
  const [session, setSession] = useState<ReadingSession | null>(null);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [consciousnessStep, setConsciousnessStep] = useState(0);
  const [clarifications, setClarifications] = useState<TarotAiReadingRequest["clarifications"]>([]);
  const [additionalContext, setAdditionalContext] = useState("");
  const [repeatWarningOpen, setRepeatWarningOpen] = useState(false);
  const [repeatWarningBypassed, setRepeatWarningBypassed] = useState(false);
  const [aiResponse, setAiResponse] = useState<TarotAiReadingResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [history, setHistory] = useState<TarotHistoryEntry[]>([]);
  const [historyStorageAvailable, setHistoryStorageAvailable] = useState(true);
  const [quota, setQuota] = useState<TarotQuota | null>(null);
  const [upgradeReason, setUpgradeReason] = useState<"daily_limit" | "plan_required" | null>(null);
  const [deviceSeed, setDeviceSeed] = useState("");
  useEffect(() => {
    setDeviceSeed(getOrCreateDeviceSeed());
  }, []);
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const localDate = useMemo(() => localTarotDateKey(), []);
  const userSeed = user?.id || deviceSeed;
  const dailyCard = useMemo(() => getDailyCard(todayStr, userSeed), [todayStr, userSeed]);
  const topic = useMemo(() => ALL_TOPICS.find((item) => item.key === theme) ?? ALL_TOPICS[0], [theme]);
  const readingSections = useMemo<ReadingSection[]>(() => (session ? buildReadingSections(session) : []), [session]);
  const filteredNiches = useMemo(() => {
    const haystack = nicheQuery.trim().toLowerCase();
    if (!haystack) return topic.niches;
    return topic.niches.filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(haystack));
  }, [nicheQuery, topic.niches]);
  const readyForAnalysis = Boolean(session && flippedIndexes.length >= session.cards.length);
  const stageIndex = phase === "landing" ? -1 : STAGE_SEQUENCE.indexOf(phase);
  const stage = phase === "landing" ? null : STAGE_COPY[phase];
  const displayName = user?.displayName?.trim() || "Bạn";
  const usesStageShell =
    phase === "fieldSelect" || phase === "nicheSelect" || phase === "question" || phase === "spreadSelect";
  useEffect(() => {
    if (phase !== "ritualLoading") return undefined;
    const timer = window.setTimeout(() => setPhase("deckDraw"), 1800);
    return () => window.clearTimeout(timer);
  }, [phase]);
  useEffect(() => {
    setDailyRevealed(hasDailyDate(DAILY_REVEALED_KEY, todayStr));
    if (!hasDailyDate(DAILY_SEEN_KEY, todayStr)) {
      setModal("daily");
    }
  }, [todayStr]);
  useEffect(() => {
    if (!user) return;
    void refreshQuota();
  }, [user]);

  async function refreshQuota() {
    try {
      const next = await fetchWithAuth<{ ok: true } & TarotQuota>("/api/tarot/quota");
      setQuota(next);
    } catch {
      // Quota vẫn được enforce server-side; UI giữ trạng thái mặc định nếu tạm thời không tải được.
    }
  }
  async function fetchAiReading(
    drawnCards: ReadingSession["cards"],
    answers: TarotAiReadingRequest["clarifications"],
  ) {
    setAiLoading(true);
    setAiError(null);
    try {
      if (!user) await signInAnonymouslyFn();
      const response = await fetchWithAuth<TarotAiReadingResponse>("/api/tarot/reading", {
        method: "POST",
        body: JSON.stringify({
          profile: {
            name: profileName.trim() || displayName,
            dob: profileDob,
            gender: profileGender,
          },
          themeLabel: session?.themeLabel ?? getThemeLabel(theme),
          nicheLabel: niche,
          nicheKey: nicheKbKey,
          question: session?.question ?? question,
          spread: session?.spread ?? spread,
          cards: drawnCards.map((card) => ({
            id: card.id,
            nameVi: card.nameVi,
            nameEn: card.nameEn,
            orientation: card.orientation,
            position: card.position,
            aspectMeaning: getCardMessage(card),
            meaning: getCardMessage(card),
            keywords: card.keywords,
          })),
          clarifications: answers,
          additionalContext,
        }),
      });
      setAiResponse(response);
      void refreshQuota();
      if (session) {
        const saved = saveTarotHistory(createTarotHistoryEntry(session, response));
        setHistory(saved.entries);
        setHistoryStorageAvailable(saved.storageAvailable);
      }
    } catch (error) {
      if (isAppError(error)) {
        const reason = error.details?.reason;
        if (reason === "daily_limit" || reason === "plan_required") {
          setUpgradeReason(reason);
          void refreshQuota();
        }
      }
      setAiError(isAppError(error) ? error.message : ERROR_MESSAGES.NETWORK_ERROR);
    } finally {
      setAiLoading(false);
    }
  }
  function finalizeSession() {
    if (spread > 3 && !quota?.hasPlan) {
      setUpgradeReason("plan_required");
      return;
    }
    if (spread <= 3 && quota?.remaining === 0 && !quota.hasPlan) {
      setUpgradeReason("daily_limit");
      return;
    }
    if (profileName.trim() || profileDob.trim()) {
      saveProfile({ name: profileName, dob: profileDob, gender: profileGender });
    }
    const cleanQuestion = question.trim() || DEFAULT_QUESTION;
    setSession({ theme, themeLabel: getThemeLabel(theme), spread, question: cleanQuestion, cards: drawCards(spread) });
    setSelectedIndexes([]);
    setFlippedIndexes([]);
    setConsciousnessStep(0);
    setClarifications([]);
    setAdditionalContext("");
    setAiResponse(null);
    setAiError(null);
    setPhase("ritualLoading");
  }
  function chooseDeckCard(deckIndex: number) {
    if (!session || selectedIndexes.includes(deckIndex) || selectedIndexes.length >= session.cards.length) return;
    const next = [...selectedIndexes, deckIndex];
    setSelectedIndexes(next);
    if (next.length >= session.cards.length) {
      const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 20 : 520;
      window.setTimeout(() => setPhase("spreadReveal"), delay);
    }
  }
  function reset() {
    setPhase("landing");
    setSession(null);
    setSelectedIndexes([]);
    setFlippedIndexes([]);
    setConsciousnessStep(0);
    setClarifications([]);
    setAdditionalContext("");
    setNiche("Tổng quan");
    setNicheKbKey("general");
    setNicheQuery("");
    setAiResponse(null);
    setAiLoading(false);
    setAiError(null);
    setRepeatWarningOpen(false);
    setRepeatWarningBypassed(false);
  }
  function enterSpreadSelect() {
    setPhase("spreadSelect");
    if (!repeatWarningBypassed && hasCompletedTarotTheme(theme, localDate)) setRepeatWarningOpen(true);
  }
  function handleCloseModal() {
    if (modal === "daily") {
      storeDailyDate(DAILY_SEEN_KEY, todayStr);
    }
    setModal(null);
  }

  function handleDailyReveal() {
    setDailyRevealed(true);
    storeDailyDate(DAILY_REVEALED_KEY, todayStr);
  }

  function handleDailyBegin() {
    storeDailyDate(DAILY_SEEN_KEY, todayStr);
    setModal(null);
    setPhase("fieldSelect");
  }

  function handleOpenModal(nextModal: TarotModalKey) {
    if (nextModal === "history") {
      const loaded = loadTarotHistory();
      setHistory(loaded.entries);
      setHistoryStorageAvailable(loaded.storageAvailable);
    }
    if (nextModal === "daily") {
      setDailyRevealed(hasDailyDate(DAILY_REVEALED_KEY, todayStr));
    }
    setModal(nextModal);
  }

  return (
    <div className="relative overflow-hidden pb-12">
      {phase === "landing" ? (
        <LandingView
          onBegin={() => setPhase("fieldSelect")}
          onOpenModal={handleOpenModal}
          onQuickStart={() => setPhase("nicheSelect")}
          setTheme={setTheme}
          theme={theme}
        />
      ) : null}

      {usesStageShell ? (
        <StageShell
          onHome={reset}
          phase={phase}
          stageIndex={stageIndex}
          stage={stage}
          themeLabel={session?.themeLabel ?? getThemeLabel(theme)}
          niche={niche}
          question={session?.question ?? question}
          spread={session?.spread ?? spread}
          topHint={topic.lead}
          userName={displayName}
        >
          {phase === "fieldSelect" ? (
            <FieldSelectView activeTheme={theme} onAdvance={(nextTheme) => {
              setTheme(nextTheme);
              setNiche("Tổng quan");
              setConsciousnessPrompts(selectConsciousnessQuestions(nextTheme));
              setAdditionalContext("");
              setRepeatWarningBypassed(false);
              setPhase("nicheSelect");
            }} onSkip={() => setPhase("question")} topics={ALL_TOPICS} />
          ) : null}
          {phase === "nicheSelect" ? (
            <NicheSelectView
              query={nicheQuery}
              setQuery={setNicheQuery}
              niches={filteredNiches}
              onChoose={(label, kbKey) => {
                setNiche(label);
                setNicheKbKey(kbKey);
                setQuestion(SAMPLE_QUESTIONS[0]);
                void loadNicheClarifyQuestions(
                  kbKey,
                  theme,
                  () => user ? Promise.resolve() : signInAnonymouslyFn(),
                ).then(setConsciousnessPrompts);
                setPhase("question");
              }}
              topic={topic}
            />
          ) : null}
          {phase === "question" ? (
            <QuestionView
              nicheKey={nicheKbKey}
              onBack={() => setPhase("nicheSelect")}
              onContinue={enterSpreadSelect}
              onSkip={() => {
                setQuestion(DEFAULT_QUESTION);
                enterSpreadSelect();
              }}
              onSelectQuestion={setQuestion}
              profileDob={profileDob}
              profileGender={profileGender}
              profileName={profileName}
              question={question}
              questionMode={questionMode}
              setProfileDob={setProfileDob}
              setProfileGender={setProfileGender}
              setProfileName={setProfileName}
              setQuestionMode={setQuestionMode}
              setQuestion={setQuestion}
            />
          ) : null}
          {phase === "spreadSelect" ? (
            <SpreadSelectView
              hasPlan={quota?.hasPlan ?? false}
              onBack={() => setPhase("question")}
              onContinue={finalizeSession}
              onLockedSpread={() => setUpgradeReason("plan_required")}
              quotaRemaining={quota?.remaining ?? 3}
              spread={spread}
              setSpread={setSpread}
            />
          ) : null}
        </StageShell>
      ) : null}

      {phase === "ritualLoading" && session ? <RitualLoadingView session={session} /> : null}
      {phase === "deckDraw" && session ? <DeckDrawView onChoose={chooseDeckCard} selectedIndexes={selectedIndexes} session={session} /> : null}
      {phase === "spreadReveal" && session ? (
        <SpreadRevealView
          flippedIndexes={flippedIndexes}
          nicheKey={nicheKbKey}
          nicheLabel={niche}
          onAnalysis={() => setPhase("consciousnessCheck")}
          onFlip={(index) => {
            if (!flippedIndexes.includes(index)) setFlippedIndexes((current) => [...current, index]);
          }}
          profileDob={profileDob}
          profileName={profileName.trim() || displayName}
          readyForAnalysis={readyForAnalysis}
          session={session}
        />
      ) : null}
      {phase === "consciousnessCheck" && session ? (
        <NicheConsciousnessCheckView
          additionalContext={additionalContext}
          onAdditionalContextChange={setAdditionalContext}
          prompts={consciousnessPrompts}
          onAnswer={(answer) => {
            const prompt = consciousnessPrompts[consciousnessStep] ?? consciousnessPrompts[0];
            const nextAnswers = [...clarifications, { question: prompt, answer }];
            setClarifications(nextAnswers);
            if (consciousnessStep >= 2) {
              markTarotThemeCompleted(theme, localDate);
              setPhase("finalReading");
              void fetchAiReading(session.cards, nextAnswers);
            } else {
              setConsciousnessStep((current) => current + 1);
            }
          }}
          session={session}
          step={consciousnessStep}
        />
      ) : null}
      {phase === "finalReading" && session ? (
        <FinalReadingView
          aiError={aiError}
          aiLoading={aiLoading}
          aiReading={aiResponse?.reading ?? null}
          nicheKey={nicheKbKey}
          nicheLabel={niche}
          onReset={reset}
          profileDob={profileDob}
          profileName={profileName.trim() || displayName}
          readingSections={readingSections}
          session={session}
        />
      ) : null}

      {repeatWarningOpen ? (
        <TarotUniverseWarning
          onBack={() => {
            setRepeatWarningOpen(false);
            reset();
          }}
          onContinue={() => {
            setRepeatWarningBypassed(true);
            setRepeatWarningOpen(false);
          }}
        />
      ) : null}

      {upgradeReason ? (
        <TarotUpgradeModal onClose={() => setUpgradeReason(null)} reason={upgradeReason} />
      ) : null}

      {modal ? (
        <ModalShell
          label={MINI_MODALS[modal].title}
          onClose={handleCloseModal}
          panelClassName={modal === "dictionary" ? "tarot-dictionary-modal-panel" : undefined}
        >
          {modal !== "dictionary" && modal !== "daily" ? (
            <h2 className="mb-4 text-2xl font-black text-[var(--bm-text-main)]">
              {MINI_MODALS[modal].title}
            </h2>
          ) : null}
          {modal === "daily" && (
            <TarotDailyCard
              card={dailyCard}
              onBegin={handleDailyBegin}
              onClose={handleCloseModal}
              onReveal={handleDailyReveal}
              revealed={dailyRevealed}
            />
          )}
          {modal === "history" && (
            <TarotHistoryView
              entries={history}
              onClear={() => {
                const result = clearTarotHistory();
                setHistory(result.entries);
                setHistoryStorageAvailable(result.storageAvailable);
              }}
              onDelete={(id) => {
                const result = deleteTarotHistoryEntry(id);
                setHistory(result.entries);
                setHistoryStorageAvailable(result.storageAvailable);
              }}
              storageAvailable={historyStorageAvailable}
            />
          )}
          {modal === "dictionary" && <TarotDictionary />}
          {modal === "topics" && (
            <div className="tarot-modal-topics">
              {TOPICS.map((topic) => (
                <div className="tarot-modal-topic-item" key={topic.key}>
                  <span className="tarot-modal-topic-icon">{topic.icon}</span>
                  <div>
                    <strong className="text-[var(--bm-text-main)]">{topic.label}</strong>
                    <p className="text-sm text-[var(--bm-text-muted)]">{topic.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ModalShell>
      ) : null}
    </div>
  );
}

function StageShell({
  children,
  onHome,
  phase,
  stage,
  stageIndex,
  themeLabel,
  niche,
  question,
  spread,
  topHint,
  userName,
}: {
  children: ReactNode;
  onHome: () => void;
  phase: Exclude<Phase, "landing">;
  stage: (typeof STAGE_COPY)[Exclude<Phase, "landing">] | null;
  stageIndex: number;
  themeLabel: string;
  niche: string;
  question: string;
  spread: Spread;
  topHint: string;
  userName: string;
}) {
  return (
    <section className="tarot-stage">
      <div className="tarot-stage-shell tarot-fade-up">
        <div className="tarot-stage-topbar">
          <button className="tarot-home-button" onClick={onHome} type="button">← Tarot</button>
          <div className="tarot-stage-tabs" aria-hidden="true">
            {STAGE_SEQUENCE.map((item, index) => (
              <span className={index === stageIndex ? "active" : index < stageIndex ? "done" : ""} key={item} />
            ))}
          </div>
        </div>

        <div className="tarot-stage-body">
          <div className="tarot-stage-heading">
            <div className="tarot-stage-badge">✦</div>
            <h1 className="tarot-stage-title">{stage?.title ?? "Hành trình Tarot"}</h1>
            <p className="tarot-stage-subtitle">{stage?.subtitle ?? "Mỗi bước là một lớp đi sâu hơn vào câu hỏi."}</p>
          </div>

          {(themeLabel || niche) && (
            <div className="tarot-stage-context">
              {themeLabel && <span>{themeLabel}</span>}
              {niche && <span>{niche}</span>}
              {question && <span className="tarot-stage-context-question">{question}</span>}
            </div>
          )}

          <main className="tarot-stage-main">{children}</main>
        </div>
      </div>
    </section>
  );
}

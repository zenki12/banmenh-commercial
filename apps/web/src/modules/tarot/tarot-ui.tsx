import { useEffect, useRef, type ReactNode } from "react";
import { Button, Card } from "../../components/ui";
import { getCardMessage, type DrawnCard, type Spread } from "./tarot-data";
import { TAROT_CARD_BACK_SRC, tarotCardImageSrc } from "./tarot-kb";

export function RitualPulse() {
  return (
    <div className="relative grid size-64 place-items-center">
      <span className="tarot-ripple absolute left-1/2 top-1/2 size-64 rounded-full border border-[rgba(251,191,36,0.28)]" />
      <span
        className="tarot-ripple absolute left-1/2 top-1/2 size-52 rounded-full border border-[rgba(167,139,250,0.22)]"
        style={{ animationDelay: "0.55s" }}
      />
      <span
        className="tarot-ripple absolute left-1/2 top-1/2 size-40 rounded-full border border-[rgba(251,191,36,0.18)]"
        style={{ animationDelay: "1.1s" }}
      />
      <div className="tarot-heartbeat grid size-36 place-items-center rounded-full border border-[var(--bm-border-gold)] bg-[rgba(251,191,36,0.12)] text-6xl text-[var(--bm-gold-bright)] shadow-[0_0_60px_rgba(251,191,36,0.28)]">
        ✦
      </div>
    </div>
  );
}

export function ThemeOption({
  active,
  hint,
  label,
  onClick,
}: {
  active: boolean;
  hint: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border p-4 text-left transition",
        active
          ? "border-[var(--bm-border-gold)] bg-[rgba(251,191,36,0.11)] shadow-[0_0_28px_rgba(251,191,36,0.12)]"
          : "border-[var(--bm-border-subtle)] bg-[rgba(255,255,255,0.035)] hover:border-[var(--bm-border-purple)]",
      ].join(" ")}
    >
      <div className="font-black text-[var(--bm-text-main)]">{label}</div>
      <p className="mt-2 text-sm leading-6 text-[var(--bm-text-muted)]">{hint}</p>
    </button>
  );
}

export function SpreadOption({
  active,
  hint,
  label,
  locked = false,
  value,
  onClick,
}: {
  active: boolean;
  hint: string;
  label: string;
  locked?: boolean;
  value: Spread;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border p-4 text-left transition",
        active
          ? "border-[var(--bm-border-gold)] bg-[rgba(251,191,36,0.11)]"
          : "border-[var(--bm-border-subtle)] bg-[rgba(255,255,255,0.035)] hover:border-[var(--bm-border-purple)]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-black text-[var(--bm-text-main)]">{label}</span>
        <span className="rounded-full border border-[var(--bm-border-gold)] px-3 py-1 text-xs font-black text-[var(--bm-gold-bright)]">
          {locked ? "VIP · Khóa" : `${value} lá`}
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--bm-text-muted)]">{hint}</p>
    </button>
  );
}

export function SelectedSlot({
  card,
  flipped,
  index,
  onFlip,
}: {
  card: DrawnCard;
  flipped: boolean;
  index: number;
  onFlip: () => void;
}) {
  return (
    <article className="tarot-fade-up">
      <div className="mb-3 text-center text-xs font-black uppercase tracking-[0.18em] text-[var(--bm-text-muted)]">
        {card.position}
      </div>
      <button
        aria-label={flipped ? `Xem lại chi tiết lá ${card.nameVi}` : `Lật lá bài ${index + 1}: ${card.position}`}
        className={`tarot-reveal-card ${flipped ? "is-flipped" : ""}`}
        id={`tarot-reveal-card-${index}`}
        type="button"
        onClick={onFlip}
      >
        <span className="tarot-reveal-card-inner">
          <span aria-hidden={flipped} className="tarot-reveal-card-face tarot-reveal-card-back">
            <img
              alt=""
              className="tarot-reveal-card-back-image"
              decoding="async"
              height={1536}
              src={TAROT_CARD_BACK_SRC}
              width={1024}
            />
            <span className="tarot-reveal-card-prompt">Chạm để lật lá số {index + 1}</span>
          </span>

          <span aria-hidden={!flipped} className="tarot-reveal-card-face tarot-reveal-card-front">
            <img
              alt=""
              className={card.orientation === "reversed" ? "is-reversed" : undefined}
              height={210}
              loading="lazy"
              src={tarotCardImageSrc(card)}
              width={120}
            />
            <span className="tarot-reveal-card-copy">
              <strong>{card.nameVi}</strong>
              <span>{card.nameEn}</span>
              <small>{card.orientation === "upright" ? "Chiều xuôi" : "Chiều ngược"}</small>
            </span>
          </span>
        </span>
      </button>
    </article>
  );
}

export function AnalysisCard({ card }: { card: DrawnCard }) {
  return (
    <Card as="article" padding="lg" variant="glass">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--bm-text-muted)]">
            {card.position}
          </p>
          <h3 className="mt-2 text-2xl font-black text-[var(--bm-text-main)]">{card.nameVi}</h3>
          <p className="mt-1 text-sm text-[var(--bm-text-muted)]">{card.nameEn}</p>
        </div>
        <span className="rounded-full border border-[var(--bm-border-gold)] px-3 py-1 text-xs font-black text-[var(--bm-gold-bright)]">
          {card.orientation === "upright" ? "Xuôi" : "Ngược"}
        </span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {card.keywords.map((keyword) => (
          <span
            key={keyword}
            className="rounded-full border border-[var(--bm-border-purple)] bg-[rgba(124,58,237,0.11)] px-3 py-1 text-xs font-bold text-[var(--bm-primary-soft)]"
          >
            {keyword}
          </span>
        ))}
      </div>
      <p className="mt-5 leading-8 text-[var(--bm-text-soft)]">{getCardMessage(card)}</p>
      <p className="mt-4 rounded-2xl border border-[var(--bm-border-gold)] bg-[rgba(251,191,36,0.08)] p-4 text-sm leading-7 text-[var(--bm-text-soft)]">
        <strong className="text-[var(--bm-gold-bright)]">Gợi ý:</strong> {card.advice}
      </p>
    </Card>
  );
}

export function ModalShell({
  children,
  closeText = "Đóng",
  label = "Hộp thoại Tarot",
  onClose,
  panelClassName,
}: {
  children: ReactNode;
  closeText?: string;
  label?: string;
  onClose: () => void;
  panelClassName?: string;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const controls = [...dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )];
      if (controls.length === 0) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(2,6,23,0.74)] px-4 py-6 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        aria-label={label}
        aria-modal="true"
        className={`max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-[var(--bm-border-purple)] bg-[rgba(13,8,28,0.96)] p-5 shadow-[0_0_80px_rgba(124,58,237,0.26)] sm:p-7 ${panelClassName ?? ""}`}
        ref={dialogRef}
        role="dialog"
      >
        <div className="tarot-modal-close-row mb-5 flex justify-end">
          <Button aria-label="Đóng hộp thoại" onClick={onClose} size="sm" variant="secondary">
            <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
            </svg>
            {closeText ? <span>{closeText}</span> : null}
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

import { findProduct, formatPriceVnd } from "@banmenh/shared";
import { Button } from "../../components/ui";
import { ModalShell } from "./tarot-ui";

export function TarotUpgradeModal({
  onClose,
  reason,
}: {
  onClose: () => void;
  reason: "daily_limit" | "plan_required";
}) {
  const product = findProduct("tarot_guide_monthly");
  const price = formatPriceVnd(product?.priceVnd ?? 0);
  return (
    <ModalShell label="Nâng cấp gói Tarot" onClose={onClose}>
      <div className="text-center">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--bm-gold-bright)]">
          Tarot Guide
        </p>
        <h2 className="mt-3 text-3xl font-black text-[var(--bm-text-main)]">
          {reason === "daily_limit" ? "Bạn đã dùng hết 3 lượt miễn phí hôm nay" : "Trải bài này thuộc gói VIP"}
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-[var(--bm-text-soft)]">
          Nâng cấp để trải bài 1 và 3 lá không giới hạn, đồng thời mở các trải bài chuyên sâu 5, 7, 10 và 12 lá trong 30 ngày.
        </p>
      </div>
      <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-[var(--bm-border-gold)] bg-[rgba(251,191,36,0.08)] p-5">
        <p className="text-center text-3xl font-black text-[var(--bm-gold-bright)]">{price} / 30 ngày</p>
        <ul className="mt-5 space-y-3 text-sm text-[var(--bm-text-soft)]">
          {(product?.features ?? []).map((feature) => (
            <li className="flex gap-3" key={feature}>
              <span aria-hidden="true" className="text-[var(--bm-success-soft)]">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto mt-6 grid max-w-lg gap-3 sm:grid-cols-2">
        <Button fullWidth href="/tarot/payment" size="lg">Mở khóa gói Tarot ngay</Button>
        <Button fullWidth onClick={onClose} size="lg" variant="secondary">Để sau</Button>
      </div>
    </ModalShell>
  );
}

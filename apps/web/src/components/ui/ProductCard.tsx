"use client";

import {
  formatPriceVnd,
  type Product,
} from "@banmenh/shared";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { Card } from "./Card";

export type ProductCardProps = {
  product: Product;
  onSelect?: (productCode: string) => void;
};

const TIER_LABELS: Record<Product["tier"], string> = {
  single_report: "Báo cáo lẻ",
  session: "Phiên",
  bundle: "Combo",
  subscription: "Định kỳ",
};

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const router = useRouter();

  function handleSelect() {
    if (onSelect) {
      onSelect(product.code);
      return;
    }
    if (product.code === "numerology_single_report") {
      router.push("/than-so-hoc");
      return;
    }
    router.push(`/payment/setup?productCode=${encodeURIComponent(product.code)}`);
  }

  return (
    <Card
      as="article"
      className="flex h-full flex-col"
      interactive
      padding="lg"
      variant="glass"
    >
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl">{product.name}</h3>
          <span className="rounded-full border border-[var(--bm-border-subtle)] bg-[var(--bm-bg-glass)] px-3 py-1 text-xs font-bold text-[var(--bm-gold-bright)]">
            {TIER_LABELS[product.tier]}
          </span>
        </div>
        <p className="mt-5 text-3xl font-bold text-[var(--bm-text-main)]">
          {formatPriceVnd(product.priceVnd)}
        </p>
        <p className="mt-4 text-[var(--bm-text-soft)]">{product.description}</p>
        <ul className="mt-5 space-y-2 text-sm text-[var(--bm-text-soft)]">
          {product.features.map((feature) => (
            <li className="flex items-start gap-2" key={feature}>
              <span aria-hidden className="text-[var(--bm-gold-bright)]">
                ✦
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button className="mt-8" fullWidth onClick={handleSelect} variant="primary">
        Chọn gói
      </Button>
    </Card>
  );
}

// Frontend Tarot KB client. Raw KB stays behind workers/kb.

export const TAROT_KB_API =
  process.env.NODE_ENV === "production"
    ? "https://banmenh-kb-prod.workers.dev"
    : "http://localhost:8787";

export const TAROT_CARD_BACK_SRC = "/tarot_cards/card-back.png";

export function getVariantKey(reversedFlags: boolean[]): string {
  const n = reversedFlags.length;
  if (n <= 3) return reversedFlags.map((value) => (value ? "Rev" : "Up")).join("_");
  if (reversedFlags.every((value) => !value)) return "All_Up";
  if (reversedFlags.every((value) => value)) return "All_Rev";
  return "Mixed";
}

export async function fetchCardMeaning(
  credential: string,
  cardId: number,
  nicheKey: string,
  isReversed: boolean,
): Promise<string> {
  const url = `${TAROT_KB_API}/tarot/card/${cardId}?niche=${nicheKey}&reversed=${isReversed}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${credential}` } });
  if (!res.ok) return "";
  const data = await res.json() as { ok: boolean; text?: string };
  return data.text ?? "";
}

export async function fetchComboReading(
  credential: string,
  cardNames: string[],
  nicheKey: string,
  reversedFlags: boolean[],
): Promise<{ found: boolean; title?: string; text: string }> {
  const variant = getVariantKey(reversedFlags);
  const url = `${TAROT_KB_API}/tarot/combo?cards=${encodeURIComponent(cardNames.join(","))}&niche=${nicheKey}&variant=${variant}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${credential}` } });
  if (!res.ok) return { found: false, text: "" };
  const data = await res.json() as { ok: boolean; found: boolean; combo?: { title: string }; text?: string };
  return { found: data.found, title: data.combo?.title, text: data.text ?? "" };
}

export function cardImageSrc(cardFileName: string): string {
  const file = cardFileName.replace(/^assets\/cards\//, "").replace(/^cards\//, "");
  return `/tarot_cards/${file}`;
}

export function tarotCardImageSrc(card: { id: number; nameEn: string }): string {
  const slug = card.nameEn.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const suffix = card.id === 62 ? "-1" : "";
  return cardImageSrc(`${card.id}-${slug}${suffix}.jpg`);
}

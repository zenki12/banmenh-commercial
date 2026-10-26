export type TarotSavedProfile = {
  id: string;
  name: string;
  dob: string;
  gender: string;
  updatedAt: number;
};

const STORAGE_KEY = "bm_tarot_saved_profiles_v1";
const MAX_SAVED_PROFILES = 5;

function normalizeName(value: string) {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ");
}

function createProfileId(name: string, dob: string) {
  const identity = `${normalizeName(name).toLocaleLowerCase("vi-VN")}|${dob.trim()}`;
  let hash = 2166136261;

  for (let index = 0; index < identity.length; index += 1) {
    hash ^= identity.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `tarot-profile-${(hash >>> 0).toString(36)}`;
}

function isSavedProfile(value: unknown): value is TarotSavedProfile {
  if (!value || typeof value !== "object") return false;
  const profile = value as Partial<TarotSavedProfile>;
  return (
    typeof profile.id === "string" &&
    typeof profile.name === "string" &&
    typeof profile.dob === "string" &&
    typeof profile.gender === "string" &&
    typeof profile.updatedAt === "number" &&
    Number.isFinite(profile.updatedAt)
  );
}

function sortAndLimit(profiles: TarotSavedProfile[]) {
  return [...profiles]
    .sort((first, second) => second.updatedAt - first.updatedAt)
    .slice(0, MAX_SAVED_PROFILES);
}

function persistProfiles(profiles: TarotSavedProfile[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch {
    // Trình duyệt có thể chặn localStorage; trải bài vẫn hoạt động bình thường.
  }
}

export function getSavedProfiles(): TarotSavedProfile[] {
  if (typeof window === "undefined") return [];

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) return [];
    const parsed: unknown = JSON.parse(storedValue);
    if (!Array.isArray(parsed)) return [];
    return sortAndLimit(parsed.filter(isSavedProfile));
  } catch {
    return [];
  }
}

export function saveProfile(profile: { name: string; dob: string; gender: string }) {
  const name = normalizeName(profile.name);
  const dob = profile.dob.trim();
  const gender = profile.gender.trim();
  if (!name && !dob) return getSavedProfiles();

  const id = createProfileId(name, dob);
  const remainingProfiles = getSavedProfiles().filter((item) => item.id !== id);
  const nextProfiles = sortAndLimit([
    { id, name, dob, gender, updatedAt: Date.now() },
    ...remainingProfiles,
  ]);
  persistProfiles(nextProfiles);
  return nextProfiles;
}

export function deleteSavedProfile(id: string): TarotSavedProfile[] {
  const nextProfiles = getSavedProfiles().filter((profile) => profile.id !== id);
  persistProfiles(nextProfiles);
  return nextProfiles;
}

import { LOCAL_STORAGE_KEYS, STORAGE_SCHEMA_VERSION, STORAGE_VERSION_KEY } from "@/constants";

// #22: centralized safeRead with try/catch (also covers #2)
function safeRead<T>(key: string, fallback: T, validate?: (v: unknown) => boolean): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (validate && !validate(parsed)) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

// --- Schema migration ---

function getCurrentVersion(): number {
  const v = localStorage.getItem(STORAGE_VERSION_KEY);
  return v ? parseInt(v, 10) || 0 : 0;
}

function setVersion(v: number) {
  localStorage.setItem(STORAGE_VERSION_KEY, String(v));
}

// ponytail: add new migration functions here when schema changes
// Each migrator brings storage from version N-1 to N.
const migrations: Record<number, () => void> = {
  // Version 1: initial schema, just stamp the version. No data transform needed
  // for existing users since the keys are the same.
  1: () => {
    // Ensure custom tags keys are strings (not numeric)
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.CUSTOM_TAGS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const cleaned: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(parsed)) {
          cleaned[String(k)] = v;
        }
        localStorage.setItem(LOCAL_STORAGE_KEYS.CUSTOM_TAGS_KEY, JSON.stringify(cleaned));
      } catch {
        // corrupted: nuke it
        localStorage.removeItem(LOCAL_STORAGE_KEYS.CUSTOM_TAGS_KEY);
      }
    }
  },
};

export function migrateStorage() {
  let current = getCurrentVersion();
  while (current < STORAGE_SCHEMA_VERSION) {
    current++;
    const migrator = migrations[current];
    if (migrator) {
      try {
        migrator();
      } catch {
        // ponytail: if migration fails, reset to defaults rather than crash
        localStorage.removeItem(LOCAL_STORAGE_KEYS.FAVORITE_POSITIONS_KEY);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.CUSTOM_TAGS_KEY);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.HIDE_FAVORITES_SECTION_KEY);
      }
    }
  }
  setVersion(STORAGE_SCHEMA_VERSION);
}

// --- Favorites ---

export function getFavoriteList(): number[] {
  return safeRead(LOCAL_STORAGE_KEYS.FAVORITE_POSITIONS_KEY, [] as number[], Array.isArray);
}

export function updateFavoriteList(data: number[]): void {
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.FAVORITE_POSITIONS_KEY,
    JSON.stringify(data)
  );
}

export function toggleFavoritesSection(state: boolean): void {
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.HIDE_FAVORITES_SECTION_KEY,
    state.toString()
  );
}

export function getFavoritesSectionState(): boolean {
  return (
    localStorage.getItem(LOCAL_STORAGE_KEYS.HIDE_FAVORITES_SECTION_KEY) ===
    "true"
  );
}

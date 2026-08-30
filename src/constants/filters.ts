export const SEX_LEVELS = {
  SAFE: "Safe",
  DANGEROUS: "Dangerous",
  BE_CAREFUL: "Be careful",
} as const;

const LEVEL_KEYS = ["SAFE", "DANGEROUS", "BE_CAREFUL"] as const;

export function normalizeLevel(level?: string | null): string | null {
  const key = (level ?? "").toUpperCase().replace(/\s+/g, "_");
  return (LEVEL_KEYS as readonly string[]).includes(key) ? key : null;
}

const LEVEL_FILTER_SET = new Set<string>(LEVEL_KEYS);
export const isLevelFilter = (f: string) => LEVEL_FILTER_SET.has(f);

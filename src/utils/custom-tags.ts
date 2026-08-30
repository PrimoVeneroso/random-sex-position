import { useSyncExternalStore } from "react";
import { LOCAL_STORAGE_KEYS } from "@/constants";
import type { DataItem } from "../../data";

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function getCustomTags(): Record<string, Partial<DataItem>> {
  return safeRead(LOCAL_STORAGE_KEYS.CUSTOM_TAGS_KEY, {});
}

export function updateCustomTags(id: number, tags: Partial<DataItem>) {
  const all = getCustomTags();
  const key = String(id);
  const next = { ...all[key], ...tags };
  if (Object.values(next).every(v => v === false)) delete all[key];
  else all[key] = next;
  localStorage.setItem(LOCAL_STORAGE_KEYS.CUSTOM_TAGS_KEY, JSON.stringify(all));
  // Dispatch storage event for cross-component sync
  window.dispatchEvent(new Event('storage'));
}

export function useCustomTags() {
  const raw = useSyncExternalStore(
    (cb) => { window.addEventListener("storage", cb); return () => window.removeEventListener("storage", cb); },
    () => localStorage.getItem(LOCAL_STORAGE_KEYS.CUSTOM_TAGS_KEY) ?? "{}",
    () => "{}"
  );
  return JSON.parse(raw) as Record<string, Partial<DataItem>>;
}

import { useCallback, useSyncExternalStore } from "react";

/**
 * Cookie consent (EU ePrivacy / GDPR). The site sets no cookies of its own
 * beyond this stored choice; "functional" gates the Google Maps embed.
 */
export type Consent = { necessary: true; functional: boolean; at: number };

const KEY = "formedics-cookie-consent";
const EVENT = "formedics-consent";
const OPEN_EVENT = "formedics-consent-open";

let cache: Consent | null | undefined;

function read(): Consent | null {
  if (cache !== undefined) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Consent>) : null;
    cache = parsed && typeof parsed.functional === "boolean" ? { necessary: true, functional: parsed.functional, at: parsed.at ?? 0 } : null;
  } catch {
    cache = null;
  }
  return cache;
}

export function writeConsent(functional: boolean) {
  const c: Consent = { necessary: true, functional, at: Date.now() };
  cache = c;
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    // storage blocked: the choice lives for this page view only
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Ask the banner to reopen (footer "Cookie settings"). */
export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key !== null && e.key !== KEY) return;
    cache = undefined; // re-read the choice made in another tab
    cb();
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** Current consent; null until the visitor has chosen (and always null during SSR). */
export function useConsent() {
  const consent = useSyncExternalStore(subscribe, read, () => null);
  const set = useCallback((functional: boolean) => writeConsent(functional), []);
  return { consent, set };
}

export function subscribeOpenSettings(cb: () => void) {
  window.addEventListener(OPEN_EVENT, cb);
  return () => window.removeEventListener(OPEN_EVENT, cb);
}

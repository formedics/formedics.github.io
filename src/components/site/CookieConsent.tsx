import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { subscribeOpenSettings, useConsent } from "@/lib/consent";
import { useLocale } from "@/lib/i18n";

/**
 * EU cookie banner: equal-weight "Accept all" / "Only necessary", plus a
 * settings view with per-category switches. Shown until a choice is stored,
 * and again on request from the footer.
 */
export function CookieConsent() {
  const { t } = useLocale();
  const { consent, set } = useConsent();
  const [mounted, setMounted] = useState(false);
  const [forced, setForced] = useState(false);
  const [settings, setSettings] = useState(false);
  const [functional, setFunctional] = useState(false);
  const first = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => subscribeOpenSettings(() => {
    setFunctional(consent?.functional ?? false);
    setSettings(true);
    setForced(true);
  }), [consent]);

  const open = mounted && (consent === null || forced);

  // move focus into the banner when it (re)opens; Escape dismisses a reopened one
  useEffect(() => {
    if (!open) return;
    first.current?.focus();
    if (!forced) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setForced(false);
        setSettings(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, forced]);
  const choose = (f: boolean) => {
    set(f);
    setForced(false);
    setSettings(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          role="region"
          aria-label={t.cookies.aria}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-lg rounded-3xl border bg-card/95 p-5 text-sm shadow-2xl backdrop-blur-xl sm:left-auto sm:right-6 sm:mx-0 sm:p-6"
        >
          <p className="font-display text-base font-semibold text-foreground">{t.cookies.title}</p>
          <p className="mt-2 leading-relaxed text-muted-foreground">{t.cookies.text}</p>

          {settings && (
            <div className="mt-4 space-y-3 border-t pt-4">
              <label className="flex items-start gap-3">
                <input type="checkbox" checked disabled className="mt-1 h-4 w-4 accent-[var(--primary)]" />
                <span>
                  <span className="font-semibold text-foreground">{t.cookies.necessaryLabel}</span>
                  <span className="block text-muted-foreground">{t.cookies.necessaryDesc}</span>
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input type="checkbox" checked={functional} onChange={(e) => setFunctional(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--primary)]" />
                <span>
                  <span className="font-semibold text-foreground">{t.cookies.functionalLabel}</span>
                  <span className="block text-muted-foreground">{t.cookies.functionalDesc}</span>
                </span>
              </label>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {settings ? (
              <button ref={first} type="button" onClick={() => choose(functional)} className="bg-gradient-brand rounded-full px-5 py-2.5 font-semibold text-primary-foreground transition hover:scale-[1.03]">
                {t.cookies.save}
              </button>
            ) : (
              <>
                <button ref={first} type="button" onClick={() => choose(true)} className="bg-gradient-brand rounded-full px-5 py-2.5 font-semibold text-primary-foreground transition hover:scale-[1.03]">
                  {t.cookies.acceptAll}
                </button>
                <button type="button" onClick={() => choose(false)} className="rounded-full border bg-card px-5 py-2.5 font-semibold text-foreground transition hover:border-primary hover:text-primary">
                  {t.cookies.necessaryOnly}
                </button>
                <button type="button" onClick={() => setSettings(true)} className="ml-auto px-2 py-2.5 font-semibold text-primary underline-offset-4 hover:underline">
                  {t.cookies.settings}
                </button>
              </>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

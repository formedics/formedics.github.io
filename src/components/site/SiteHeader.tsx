import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLocale, type SitePath } from "@/lib/i18n";
import { W } from "@/lib/site";

/**
 * Fixed site header shared by every page, in both languages.
 * On the homepage it starts transparent over the hero; elsewhere it is always solid.
 * The language switch keeps the visitor on the same page.
 */
export function SiteHeader() {
  const { pathname } = useLocation();
  const { t, locale, other, path, switchTo, current } = useLocale();
  const home = current === "/";
  const [scrolled, setScrolled] = useState(!home);
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const nav: { label: string; to: SitePath; hash?: string }[] = [
    { label: t.nav.home, to: "/" },
    { label: t.nav.about, to: "/", hash: "about" },
    { label: t.nav.policy, to: "/", hash: "policy" },
    { label: t.nav.products, to: "/products" },
    { label: t.nav.eu, to: "/eu-projects" },
    { label: t.nav.social, to: "/social-responsibility" },
    { label: t.nav.contacts, to: "/contacts" },
  ];

  useEffect(() => {
    const f = () => setScrolled(!home || window.scrollY > 40);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, [home]);

  // close the mobile menu after navigating, keep <html lang> in sync
  useEffect(() => {
    setOpen(false);
    document.documentElement.lang = t.htmlLang;
  }, [pathname, t.htmlLang]);

  // Escape closes the mobile menu
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        burger.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (to: SitePath, hash?: string) => !hash && current === to;

  const langSwitch = (dark = false) => (
    <span className={`flex gap-1 rounded-full border px-1 py-1 text-xs font-bold ${dark ? "border-navy-foreground/30" : "border-border bg-card/70"}`}>
      {(["lt", "en"] as const).map((l) =>
        l === locale ? (
          <span key={l} className="bg-gradient-brand rounded-full px-3 py-1 uppercase text-primary-foreground" aria-current="true">
            {l}
          </span>
        ) : (
          <Link
            key={l}
            to={switchTo}
            search={true}
            hash={true}
            lang={other}
            hrefLang={other}
            aria-label={t.menu.switchTo}
            className={`rounded-full px-3 py-1 uppercase transition hover:bg-teal/20 ${dark ? "text-navy-foreground" : ""}`}
          >
            {l}
          </Link>
        ),
      )}
    </span>
  );

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || open ? "bg-background/85 shadow-lg backdrop-blur-xl" : "bg-transparent"}`}>
      <motion.div style={{ scaleX: progress }} className="bg-gradient-brand absolute bottom-0 left-0 h-0.5 w-full origin-left" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link to={path("/")} className="shrink-0 rounded-lg px-2 py-1" aria-label="Formedics">
          <img src={`${W}/2016/04/Formedics-logo-227-px.png`} alt="Formedics" className="h-8 w-auto sm:h-9" />
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main">
          {nav.map((n) => (
            <Link
              key={n.label}
              to={path(n.to)}
              {...(n.hash ? { hash: n.hash } : {})}
              className={`group relative whitespace-nowrap px-3 py-2 text-sm font-semibold transition 2xl:px-4 ${isActive(n.to, n.hash) ? "text-primary" : "text-foreground"}`}
            >
              {n.label}
              <span
                className={`bg-gradient-brand absolute inset-x-3 bottom-1 h-0.5 origin-left transition-transform duration-300 group-hover:scale-x-100 2xl:inset-x-4 ${isActive(n.to, n.hash) ? "scale-x-100" : "scale-x-0"}`}
              />
            </Link>
          ))}
          <span className="ml-3">{langSwitch()}</span>
        </nav>

        <div className="flex items-center gap-3 xl:hidden">
          {langSwitch()}
          <button
            aria-label={open ? t.menu.close : t.menu.open}
            aria-expanded={open}
            aria-controls="mobile-nav"
            ref={burger}
            onClick={() => setOpen(!open)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full text-foreground"
          >
            <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 8 : 0 }} className="h-0.5 w-7 bg-current" />
            <motion.span animate={{ opacity: open ? 0 : 1 }} className="h-0.5 w-7 bg-current" />
            <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -8 : 0 }} className="h-0.5 w-7 bg-current" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto overflow-x-hidden bg-navy xl:hidden"
          >
            {nav.map((n, i) => (
              <motion.div key={n.label} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
                <Link
                  to={path(n.to)}
                  {...(n.hash ? { hash: n.hash } : {})}
                  onClick={() => setOpen(false)}
                  className={`font-display block border-b border-navy-foreground/10 px-6 py-4 text-xl ${isActive(n.to, n.hash) ? "text-teal" : "text-navy-foreground"}`}
                >
                  {n.label}
                </Link>
              </motion.div>
            ))}
            <div className="flex items-center gap-3 px-6 py-5 text-sm font-bold text-navy-foreground/80">
              <span className="uppercase tracking-widest text-navy-foreground/50">{t.menu.language}</span>
              {langSwitch(true)}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

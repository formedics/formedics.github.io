import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { NAV, W } from "@/lib/site";

/**
 * Fixed site header shared by every page.
 * On the homepage it starts transparent over the hero; elsewhere it is always solid.
 */
export function SiteHeader() {
  const { pathname } = useLocation();
  const home = pathname === "/";
  const [scrolled, setScrolled] = useState(!home);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const f = () => setScrolled(!home || window.scrollY > 40);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, [home]);

  // close the mobile menu after navigating
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes the mobile menu
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (to: string, hash?: string) => !hash && pathname === to;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || open ? "bg-background/85 shadow-lg backdrop-blur-xl" : "bg-transparent"}`}>
      <motion.div style={{ scaleX: progress }} className="bg-gradient-brand absolute bottom-0 left-0 h-0.5 w-full origin-left" />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="rounded-lg px-2 py-1" aria-label="Formedics homepage">
          <img src={`${W}/2016/04/Formedics-logo-227-px.png`} alt="Formedics" className="h-8 w-auto sm:h-9" />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              {...(n.hash ? { hash: n.hash } : {})}
              className={`group relative px-3 py-2 text-[13px] font-semibold transition xl:px-4 xl:text-sm ${isActive(n.to, n.hash) ? "text-primary" : "text-foreground"}`}
            >
              {n.label}
              <span
                className={`bg-gradient-brand absolute inset-x-3 bottom-1 h-0.5 origin-left transition-transform duration-300 group-hover:scale-x-100 xl:inset-x-4 ${isActive(n.to, n.hash) ? "scale-x-100" : "scale-x-0"}`}
              />
            </Link>
          ))}
          <span className="ml-3 flex gap-1 rounded-full border border-border bg-card/70 px-1 py-1 text-xs font-bold">
            <a href="https://formedics.lt/lt/pagrindinis/" className="rounded-full px-3 py-1 transition hover:bg-teal/20" lang="lt">
              LT
            </a>
            <span className="bg-gradient-brand rounded-full px-3 py-1 text-primary-foreground" aria-current="true">
              EN
            </span>
          </span>
        </nav>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full text-foreground lg:hidden"
        >
          <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 8 : 0 }} className="h-0.5 w-7 bg-current" />
          <motion.span animate={{ opacity: open ? 0 : 1 }} className="h-0.5 w-7 bg-current" />
          <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -8 : 0 }} className="h-0.5 w-7 bg-current" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto overflow-x-hidden bg-navy lg:hidden"
          >
            {NAV.map((n, i) => (
              <motion.div key={n.label} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
                <Link
                  to={n.to}
                  {...(n.hash ? { hash: n.hash } : {})}
                  onClick={() => setOpen(false)}
                  className={`font-display block border-b border-navy-foreground/10 px-6 py-4 text-xl ${isActive(n.to, n.hash) ? "text-teal" : "text-navy-foreground"}`}
                >
                  {n.label}
                </Link>
              </motion.div>
            ))}
            <div className="flex items-center gap-3 px-6 py-5 text-sm font-bold text-navy-foreground/80">
              <span className="uppercase tracking-widest text-navy-foreground/50">Language</span>
              <a href="https://formedics.lt/lt/pagrindinis/" className="rounded-full border border-navy-foreground/30 px-3 py-1" lang="lt">
                LT
              </a>
              <span className="bg-gradient-brand rounded-full px-3 py-1 text-primary-foreground">EN</span>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

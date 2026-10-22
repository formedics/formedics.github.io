import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { CookieConsent } from "@/components/site/CookieConsent";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { useLocale } from "@/lib/i18n";
import { CATEGORIES, PARTNERS, type Category, W } from "@/lib/site";

export type ProductsSearch = { category?: Category };

const isCategory = (v: unknown): v is Category => typeof v === "string" && (CATEGORIES as readonly string[]).includes(v);

/** Shared by /products and /lt/products: the category filter lives in the URL. */
export const validateProductsSearch = (search: Record<string, unknown>): ProductsSearch => (isCategory(search["category"]) ? { category: search["category"] } : {});

type Filter = "All" | Category;

// The static HTML is prerendered without a category, so while that HTML is being hydrated the
// filter must stay "All"; once hydrated (and on every client-side navigation) the URL filter applies.
const subscribeNoop = () => () => {};
const useHydrated = () => useSyncExternalStore(subscribeNoop, () => true, () => false);

export function ProductsPage() {
  const { t, path } = useLocale();
  const rawSearch = useSearch({ strict: false }) as Record<string, unknown>;
  const category = useHydrated() ? validateProductsSearch(rawSearch).category : undefined;
  const navigate = useNavigate();
  const filter: Filter = category ?? "All";
  const setFilter = (f: Filter) => void navigate({ to: path("/products/"), search: f === "All" ? {} : { category: f }, replace: true, resetScroll: false });
  const label = (f: Filter) => (f === "All" ? t.products.all : t.products.categories[f]);

  // keep the active chip visible in the scrollable row
  const chips = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chips.current?.querySelector<HTMLElement>('[aria-pressed="true"]')?.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
  }, [filter]);

  const counts = useMemo(() => {
    const c = new Map<string, number>();
    for (const p of PARTNERS) for (const cat of p.categories) c.set(cat, (c.get(cat) ?? 0) + 1);
    return c;
  }, []);
  const shown = filter === "All" ? PARTNERS : PARTNERS.filter((p) => p.categories.includes(filter));
  const filters: Filter[] = ["All", ...CATEGORIES];

  return (
    <main className="font-sans">
      <SiteHeader />
      <PageHero eyebrow={t.nav.products} title={t.products.title}>
        <p>{t.products.pageIntro}</p>
      </PageHero>

      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-6">
          {/* category filter: one scrollable row, pinned under the header */}
          <div className="sticky top-[4.75rem] z-30 -mx-6 bg-background/85 px-6 py-4 backdrop-blur-xl">
            <div ref={chips} className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" aria-label={t.products.categoriesAria}>
              {filters.map((f) => {
                const active = f === filter;
                const n = f === "All" ? PARTNERS.length : counts.get(f) ?? 0;
                return (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(f)}
                    className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      active ? "bg-gradient-brand border-transparent text-primary-foreground shadow-glow" : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {label(f)}
                    <span className={`rounded-full px-1.5 text-[11px] ${active ? "bg-white/20" : "bg-muted text-muted-foreground"}`}>{n}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
            {t.products.showing(shown.length, filter === "All" ? null : label(filter))}
          </p>

          <LayoutGroup>
            <motion.ul layout className="relative mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {shown.map((p) => (
                  <motion.li
                    key={p.name}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="group flex h-full flex-col rounded-3xl border bg-card p-6 transition-all hover:-translate-y-1.5 hover:shadow-glow"
                  >
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="block rounded-2xl outline-offset-4">
                      <div className="flex h-28 items-center justify-center rounded-2xl bg-white p-4">
                        <img src={`${W}/${p.logo}`} alt={`${p.name} logo`} loading="lazy" className="max-h-20 max-w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <h2 className="font-display mt-5 text-lg font-semibold">{p.name}</h2>
                    </a>
                    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={t.products.partnerCategories(p.name)}>
                      {p.categories.map((c) => (
                        <li key={c}>
                          <button
                            type="button"
                            onClick={() => setFilter(c)}
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${c === filter ? "bg-teal/20 text-primary" : "bg-muted text-muted-foreground hover:bg-teal/15 hover:text-primary"}`}
                          >
                            {t.products.categories[c]}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-auto pt-5 text-sm font-semibold text-primary opacity-0 transition group-hover:opacity-100 focus:opacity-100">
                      {t.products.visit}
                    </a>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </LayoutGroup>
        </div>

        <div className="mx-auto mt-28 max-w-4xl px-6 text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-bold md:text-5xl">
              {t.products.statementBefore} <span className="text-gradient">{t.products.statementHighlight}</span> {t.products.statementAfter}
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">{t.products.statementText}</p>
            <Link to={path("/contacts/")} className="bg-gradient-brand shadow-glow mt-10 inline-block rounded-full px-8 py-4 font-semibold text-primary-foreground transition hover:scale-105">
              {t.products.contact}
            </Link>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
      <CookieConsent />
    </main>
  );
}

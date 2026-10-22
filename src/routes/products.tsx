import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { CATEGORIES, PARTNERS, type Category, W } from "@/lib/site";

type Filter = "All" | Category;
type ProductsSearch = { category?: Category };

const isCategory = (v: unknown): v is Category => typeof v === "string" && (CATEGORIES as readonly string[]).includes(v);

export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>): ProductsSearch => (isCategory(search["category"]) ? { category: search["category"] } : {}),
  head: () => ({
    meta: [
      { title: "Products — Formedics" },
      { name: "description", content: "Partner manufacturers whose medical devices Formedics supplies across the Baltic countries, by product category." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { category } = Route.useSearch();
  const navigate = useNavigate({ from: "/products" });
  const filter: Filter = category ?? "All";
  const setFilter = (f: Filter) => void navigate({ search: f === "All" ? {} : { category: f }, replace: true, resetScroll: false });

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
      <PageHero eyebrow="Products" title="Products">
        <p>We supply only safe, high-quality, and effective medical products. Browse our partner manufacturers by product category.</p>
      </PageHero>

      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-6">
          {/* category filter: one scrollable row, pinned under the header */}
          <div className="sticky top-[4.75rem] z-30 -mx-6 bg-background/85 px-6 py-4 backdrop-blur-xl lg:top-[4.25rem]">
            <div ref={chips} className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" aria-label="Product categories">
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
                    {f}
                    <span className={`rounded-full px-1.5 text-[11px] ${active ? "bg-white/20" : "bg-muted text-muted-foreground"}`}>{n}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
            Showing {shown.length} {shown.length === 1 ? "partner" : "partners"}
            {filter !== "All" && (
              <>
                {" "}
                in <span className="font-semibold text-foreground">{filter}</span>
              </>
            )}
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
                    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${p.name} categories`}>
                      {p.categories.map((c) => (
                        <li key={c}>
                          <button
                            type="button"
                            onClick={() => setFilter(c)}
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${c === filter ? "bg-teal/20 text-primary" : "bg-muted text-muted-foreground hover:bg-teal/15 hover:text-primary"}`}
                          >
                            {c}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-auto pt-5 text-sm font-semibold text-primary opacity-0 transition group-hover:opacity-100 focus:opacity-100">
                      Visit website ↗
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
              We supply only <span className="text-gradient">safe, high-quality, and effective</span> medical products.
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
              These are fundamental principles that we always comply with when choosing which products of our partner-manufacturers to supply. There is no doubt that even manufacturers make mistakes, especially when looking for innovative solutions, but the values of our company are based on a business philosophy that puts responsibility, patient safety and effectiveness first.
            </p>
            <Link to="/contacts" className="bg-gradient-brand shadow-glow mt-10 inline-block rounded-full px-8 py-4 font-semibold text-primary-foreground transition hover:scale-105">
              Contact us
            </Link>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

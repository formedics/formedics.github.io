import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { GraduationCap, Handshake, Leaf, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { CookieConsent } from "@/components/site/CookieConsent";
import { Reveal } from "@/components/site/Reveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { useLocale } from "@/lib/i18n";
import { NHIF_PDFS, OFFICES, PRODUCT_AREAS, W } from "@/lib/site";

const Hero3D = lazy(() => import("@/components/Hero3D").then((m) => ({ default: m.Hero3D })));

function Counter({ to }: { to: number }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - t0) / 1500, 1);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n}</span>;
}

function Hero() {
  const { t, path } = useLocale();
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const rot = useTransform(scrollYProgress, [0, 1], [0, 3]);

  return (
    <section id="top" ref={ref} className="relative flex overflow-hidden bg-background pt-28 pb-16 sm:pt-32 sm:pb-20 lg:min-h-svh lg:items-center lg:pt-28 lg:pb-16">
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(color-mix(in_oklab,var(--primary)_14%,transparent)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="bg-gradient-brand pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full opacity-15 blur-3xl" />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-6 sm:gap-14 lg:grid-cols-[1.1fr_1fr] 2xl:max-w-[88rem]">
        <div className="min-w-0">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border bg-card px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs sm:tracking-[0.2em]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-teal" /> {t.hero.eyebrow}
          </motion.p>
          <h1 className="font-display text-[2.75rem] font-bold leading-[1.05] text-foreground sm:text-5xl md:text-7xl lg:text-[clamp(3rem,min(5.4vw,8vh),4.5rem)] 2xl:text-[clamp(4.5rem,min(5vw,10vh),6rem)]">
            {t.hero.words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-2 align-bottom">
                <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.3 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className={`mr-3 inline-block sm:mr-4 ${i >= t.hero.highlightFrom ? "text-gradient" : ""}`}>
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground 2xl:text-xl">
            {t.hero.subtitle}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-8 flex flex-wrap gap-4">
            <Link to={path("/products/")} className="bg-gradient-brand shadow-glow rounded-full px-8 py-4 font-semibold text-primary-foreground transition hover:scale-105">
              {t.hero.ctaProducts}
            </Link>
            <a href="#about" className="rounded-full border bg-card px-8 py-4 font-semibold text-foreground transition hover:border-primary hover:text-primary">
              {t.hero.ctaAbout}
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-8 flex flex-wrap gap-2">
            {PRODUCT_AREAS.map((area) => (
              <Link key={area.category} to={path("/products/")} search={{ category: area.category }} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-teal/15 hover:text-primary">
                {t.products.categories[area.category]}
              </Link>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto w-full min-w-0 max-w-[min(100%,72vh)]">
          <motion.div style={{ y, rotate: rot }} className="relative">
            {/* unboxed: a soft halo instead of a card, so the map floats on the page */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl [background:radial-gradient(circle,color-mix(in_oklab,var(--teal)_30%,transparent),color-mix(in_oklab,var(--primary)_12%,transparent)_45%,transparent_72%)]" />
            <div role="img" aria-label={t.hero.mapAria} className="relative aspect-square w-full">
              <Suspense fallback={<div className="aspect-square w-full" />}>{ready ? <Hero3D labels={t.countries} /> : <div className="aspect-square w-full" />}</Suspense>
            </div>
          </motion.div>

          {/* badges flow under the map on phones, float around it from sm up */}
          <div className="mt-2 flex flex-wrap items-center gap-3 sm:contents">
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="relative rounded-2xl border bg-card/90 p-4 shadow-xl backdrop-blur-sm sm:absolute sm:-bottom-2 sm:-right-8 sm:p-5">
              <div className="font-display text-3xl font-bold text-gradient">{t.hero.years}</div>
              <p className="text-sm text-muted-foreground">{t.hero.yearsSub}</p>
            </motion.div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="relative rounded-2xl border bg-card/90 px-4 py-2.5 shadow-xl backdrop-blur-sm sm:absolute sm:-top-6 sm:left-2 sm:px-5 sm:py-3">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{t.hero.iso}</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function About() {
  const { t } = useLocale();
  return (
    <section id="about" className="relative scroll-mt-20 py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-teal">{t.about.eyebrow}</p>
          <h2 className="font-display text-4xl font-bold md:text-6xl">
            {t.about.title} <span className="text-gradient">{t.about.titleHighlight}</span>
          </h2>
          <div className="mt-10 flex flex-wrap gap-10">
            <div>
              <div className="font-display text-6xl font-bold text-gradient">
                <Counter to={20} />+
              </div>
              <p className="text-muted-foreground">{t.about.yearsLabel}</p>
            </div>
            <div>
              <div className="font-display text-6xl font-bold text-gradient">
                <Counter to={3} />
              </div>
              <p className="text-muted-foreground">{t.about.countriesLabel}</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.15} className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          {t.about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Reveal>
      </div>
      <div className="mx-auto mt-16 grid max-w-7xl gap-6 px-6 md:grid-cols-3 lg:mt-20">
        {t.about.cards.map(([title, text], i) => (
          <Reveal key={title} delay={i * 0.12} className="h-full">
            <motion.div whileHover={{ y: -10 }} className="group relative h-full overflow-hidden rounded-3xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-glow">
              <div className="bg-gradient-brand absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-10 transition-transform duration-700 group-hover:scale-[3]" />
              <span className="font-display text-sm font-bold text-teal">0{i + 1}</span>
              <h3 className="font-display mt-4 text-2xl font-semibold">{title}</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{text}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const COMMITMENT_ICONS = [ShieldCheck, Users, GraduationCap, Handshake, Leaf, TrendingUp];

/** Company policy: intro, six commitments as a card grid, then the closing paragraphs as the CEO's signed statement. */
function Policy() {
  const { t } = useLocale();
  const p = t.policy;
  return (
    <section id="policy" className="relative scroll-mt-20 overflow-hidden bg-navy py-20 text-navy-foreground lg:py-24">
      <div className="bg-gradient-brand pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full opacity-20 blur-3xl" />
      <div className="bg-gradient-brand pointer-events-none absolute -right-48 bottom-0 h-[28rem] w-[28rem] rounded-full opacity-10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6">
        {/* intro */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end lg:gap-16">
          <Reveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-teal">{p.eyebrow}</p>
            <h2 className="font-display text-4xl font-bold md:text-5xl xl:text-6xl">{p.title}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-navy-foreground/80 md:text-xl">{p.intro}</p>
            <p className="font-display mt-5 text-lg font-semibold text-teal md:text-xl">{p.commit}</p>
          </Reveal>
        </div>

        {/* six commitments */}
        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {p.items.map((item, i) => {
            const Icon = COMMITMENT_ICONS[i] ?? ShieldCheck;
            return (
              <li key={i} className="h-full">
                <Reveal delay={i * 0.06} className="h-full">
                  <motion.div whileHover={{ y: -6 }} className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-navy-foreground/10 bg-navy-foreground/5 p-6 backdrop-blur transition hover:border-teal/50 hover:bg-navy-foreground/10">
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal/15 text-teal transition group-hover:bg-teal/25">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="font-display text-xl font-bold text-gradient">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <p className="leading-relaxed text-navy-foreground/85">{item}</p>
                  </motion.div>
                </Reveal>
              </li>
            );
          })}
        </ol>

        {/* the CEO's statement: the three closing paragraphs as his own signed words */}
        <Reveal className="mt-8 lg:mt-10">
          <figure className="relative overflow-hidden rounded-3xl border border-navy-foreground/10 bg-navy-foreground/5 backdrop-blur">
            <div className="bg-gradient-brand pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-15 blur-3xl" />
            <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:gap-16 lg:p-12">
              <blockquote className="relative">
                <span aria-hidden className="font-display pointer-events-none absolute -left-3 -top-12 text-8xl leading-none text-teal/25 select-none sm:-left-5 sm:-top-14 sm:text-9xl">
                  “
                </span>
                <div className="relative space-y-5 text-lg leading-relaxed text-navy-foreground/85 md:text-xl">
                  {p.closing.map((text, i) => (
                    <p key={i}>{text}</p>
                  ))}
                </div>
              </blockquote>

              <figcaption className="flex flex-col justify-end gap-8 border-t border-navy-foreground/10 pt-8 lg:w-64 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                <div>
                  <p className="font-display text-3xl font-bold leading-tight text-navy-foreground sm:text-[2rem]">{p.ceo}</p>
                  <span className="bg-gradient-brand mt-3 block h-0.5 w-16 rounded-full" aria-hidden />
                  <p className="mt-3 text-sm font-bold uppercase tracking-[0.3em] text-teal">{p.ceoLabel}</p>
                  <p className="mt-1 text-sm text-navy-foreground/60">UAB „Formedics“</p>
                </div>
                <a href="https://www.sgs.com/certifiedclients" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-navy-foreground/10 bg-navy-foreground/5 p-3 transition hover:border-teal/50">
                  <img src={`${W}/2018/01/SGS_logo_90_1.png`} alt="SGS" className="h-10 w-auto rounded-md bg-white p-1" loading="lazy" />
                  <span className="text-xs font-semibold leading-snug text-navy-foreground/80">{p.certified}</span>
                </a>
              </figcaption>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

function Products() {
  const { t, path } = useLocale();
  return (
    <section id="products" className="scroll-mt-20 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-4xl font-bold md:text-6xl">{t.products.title}</h2>
          <Link to={path("/products/")} className="font-semibold text-primary underline-offset-4 hover:underline">
            {t.products.learnMore}
          </Link>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {PRODUCT_AREAS.map((area, i) => (
            <Reveal key={area.category} delay={i * 0.07} className="h-full">
              <motion.div whileHover={{ y: -8, rotate: -1 }} className="h-full">
                <Link to={path("/products/")} search={{ category: area.category }} className="group flex h-full flex-col items-center justify-center gap-6 rounded-3xl border bg-card p-8 text-center transition-shadow hover:shadow-glow">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted transition-transform duration-500 group-hover:scale-110">
                    <img src={`${W}/${area.icon}`} alt="" loading="lazy" className="max-h-16 max-w-16" />
                  </div>
                  <span className="font-display font-semibold">{t.products.categories[area.category]}</span>
                </Link>
              </motion.div>
            </Reveal>
          ))}
          <Reveal delay={0.5} className="h-full">
            <Link to={path("/products/")} className="bg-gradient-brand flex h-full min-h-48 items-center justify-center rounded-3xl p-8 font-display text-xl font-semibold text-primary-foreground transition hover:scale-[1.02]">
              {t.products.learnMore}
            </Link>
          </Reveal>
        </div>
      </div>
      <div className="mt-20 overflow-hidden border-y py-6 lg:mt-24">
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap font-display text-3xl font-semibold text-muted-foreground/60">
          {[...PRODUCT_AREAS, ...PRODUCT_AREAS].map((area, i) => (
            <span key={i}>{t.products.categories[area.category]} ✦</span>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-20 max-w-4xl px-6 text-center lg:mt-24">
        <Reveal>
          <h3 className="font-display text-3xl font-bold md:text-5xl">
            {t.products.statementBefore} <span className="text-gradient">{t.products.statementHighlight}</span> {t.products.statementAfter}
          </h3>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">{t.products.statementText}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Nhif() {
  const { t, path } = useLocale();
  const n = t.nhif;
  const hq = OFFICES[0]!;
  return (
    <section id="contacts" className="scroll-mt-20 pb-20 lg:pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="grid overflow-hidden rounded-[2.5rem] border bg-card shadow-xl lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-5 p-8 sm:p-10 md:p-14">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-teal">{n.eyebrow}</p>
              <h2 className="font-display text-2xl font-bold md:text-4xl">{n.title}</h2>
              <p className="italic text-muted-foreground">{n.p1}</p>
              <p className="font-semibold">{n.important}</p>
              <p className="italic text-muted-foreground">{n.p2}</p>
              <p className="italic text-muted-foreground">
                {n.p3Before} <b className="text-foreground">{n.amount}</b>
                {n.p3After}
              </p>
              <p className="pt-2 font-semibold">{n.info}</p>
              <div className="flex flex-wrap gap-3">
                <a href={`${W}/${NHIF_PDFS.catalogue}`} target="_blank" rel="noopener noreferrer" className="rounded-full border px-5 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary">
                  {n.catalogue} ↗
                </a>
                <a href={`${W}/${NHIF_PDFS.instruction}`} target="_blank" rel="noopener noreferrer" className="rounded-full border px-5 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary">
                  {n.instruction} ↗
                </a>
              </div>
            </div>
            <div className="bg-gradient-brand space-y-6 p-8 text-primary-foreground sm:p-10 md:p-14">
              <h3 className="font-display text-2xl font-semibold">{n.consult}</h3>
              <p>
                <b>{hq.company}</b>
                <br />
                {hq.address}
              </p>
              <a href={hq.phoneHref} className="block text-xl font-semibold hover:underline">
                {n.phone} {hq.phone}
              </a>
              <a href={`mailto:${hq.email}`} className="block break-all text-xl font-semibold hover:underline">
                {n.email} {hq.email}
              </a>
              <p className="opacity-90">
                <b>{n.hours}</b> {n.hoursValue}
              </p>
              <Link to={path("/contacts/")} className="inline-block rounded-full border border-primary-foreground/40 px-5 py-2 text-sm font-semibold transition hover:bg-white/10">
                {n.allOffices}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <main className="font-sans">
      <SiteHeader />
      <Hero />
      <About />
      <Policy />
      <Products />
      <Nhif />
      <SiteFooter />
      <CookieConsent />
    </main>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { PRODUCT_AREAS, SERVICE_HOURS, W } from "@/lib/site";


const Hero3D = lazy(() => import("@/components/Hero3D").then((m) => ({ default: m.Hero3D })));


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Formedics — Medical devices for the Baltics" },
      { name: "description", content: "Formedics, UAB supplies safe, high-quality medical devices to healthcare institutions in Lithuania, Latvia and Estonia." },
      { property: "og:title", content: "Formedics — Dedication towards your success" },
      { property: "og:description", content: "Over 20 years supplying medical devices to Baltic healthcare professionals." },
    ],
  }),
  component: Index,
});

const policy = [
  "Providing service in accordance with the legal acts regulating the industry and other requirements that the organization undertakes to comply with in order to achieve compliance with the requirements of the standards ISO 9001: 2015 and ISO 14001: 2015;",
  "Analysing market needs and customer preferences, guaranteeing customer satisfaction with the implementation of his/her wishes, the quality and professional work of the company’s employees;",
  "Raising the qualification and competence of employees, encouraging the employee’s creative initiative. Constantly improving and taking an interest in the latest technologies and solutions in the field of medicine and passing on our knowledge to our customers, thus promoting the introduction of advanced technologies in the field of medicine and improving human health and facilitating their treatment;",
  "Collaborating with companies that share our approach to responsibility in fulfilling our responsibilities;",
  "Reducing the impact of the activities on the environment by implementing advanced environmental protection factors and applying preventive measures;",
  "Continuously improving the performance of the management system, taking into account performance, employee suggestions, customer and partner feedback.",
];

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
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const rot = useTransform(scrollYProgress, [0, 1], [0, 3]);
  const words = "Dedication towards your success!".split(" ");
  return (
    <section id="top" ref={ref} className="relative overflow-hidden bg-background pt-32 pb-24 lg:min-h-screen lg:pt-40">
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(color-mix(in_oklab,var(--primary)_14%,transparent)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="bg-gradient-brand pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full opacity-15 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <span className="h-2 w-2 animate-pulse rounded-full bg-teal" /> Medical devices · LT · LV · EE
          </motion.p>
          <h1 className="font-display text-5xl font-bold leading-[1.05] text-foreground md:text-7xl">
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-2 align-bottom">
                <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.3 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className={`mr-4 inline-block ${i >= 2 ? "text-gradient" : ""}`}>
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            More than 20 years supplying safe, high-quality, and effective medical products to the biggest health care institutions of the Baltic countries.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-10 flex flex-wrap gap-4">
            <Link to="/products" className="bg-gradient-brand shadow-glow rounded-full px-8 py-4 font-semibold text-primary-foreground transition hover:scale-105">Our products</Link>
            <a href="#about" className="rounded-full border bg-card px-8 py-4 font-semibold text-foreground transition hover:border-primary hover:text-primary">About us</a>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-12 flex flex-wrap gap-2">
            {PRODUCT_AREAS.map((c) => (
              <Link key={c.name} to="/products" search={{ category: c.name }} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-teal/15 hover:text-primary">
                {c.name}
              </Link>
            ))}
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} className="relative min-w-0">
          <motion.div style={{ y, rotate: rot }} className="relative">
            {/* unboxed: a soft halo instead of a card, so the map floats on the page */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl [background:radial-gradient(circle,color-mix(in_oklab,var(--teal)_30%,transparent),color-mix(in_oklab,var(--primary)_12%,transparent)_45%,transparent_72%)]" />
            <div
              role="img"
              aria-label="Animated 3D map of Lithuania, Latvia and Estonia: glowing links carry light between Vilnius, Riga and Tallinn, and regional hubs connect to each capital"
              className="relative aspect-square w-full"
            >
              <Suspense fallback={<div className="aspect-square w-full" />}>
                {ready ? <Hero3D /> : <div className="aspect-square w-full" />}
              </Suspense>
            </div>
            <p className="pointer-events-none absolute -bottom-3 left-1/2 hidden -translate-x-1/2 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground/70 sm:block">
              Drag to explore
            </p>
          </motion.div>

          {/* badges flow under the map on phones, float around it from sm up */}
          <div className="mt-2 flex flex-wrap items-center gap-3 sm:contents">
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="relative rounded-2xl border bg-card/90 p-4 shadow-xl backdrop-blur-sm sm:absolute sm:-bottom-2 sm:-right-8 sm:p-5">
              <div className="font-display text-3xl font-bold text-gradient">20+ years</div>
              <p className="text-sm text-muted-foreground">trusted Baltic partner</p>
            </motion.div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="relative rounded-2xl border bg-card/90 px-4 py-2.5 shadow-xl backdrop-blur-sm sm:absolute sm:-top-6 sm:left-2 sm:px-5 sm:py-3">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">ISO 9001 · 14001</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function About() {
  const cards = [
    ["For our partners", "We think big and create long-term value through quality, education, responsibility, trust, and advanced process control."],
    ["Our vision", "To become a long-term professional partner for health care institutions and physicians by focusing on high-quality services that make our name synonymous not only with the provision of outstanding medical products but also with a reliable partnership and an interest in advanced treatment techniques."],
    ["Our mission", "To effectively present and deliver reliable and modern treatment methodologies and tools that enable physicians to achieve the best health outcomes for their patients with optimal efforts and costs."],
  ];
  return (
    <section id="about" className="scroll-mt-20 relative py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">
        <Reveal>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-teal">About us</p>
          <h2 className="font-display text-4xl font-bold md:text-6xl">Our attitude to our work <span className="text-gradient">with you</span></h2>
          <div className="mt-10 flex gap-10">
            <div><div className="font-display text-6xl font-bold text-gradient"><Counter to={20} />+</div><p className="text-muted-foreground">years of cooperation</p></div>
            <div><div className="font-display text-6xl font-bold text-gradient"><Counter to={3} /></div><p className="text-muted-foreground">Baltic countries</p></div>
          </div>
        </Reveal>
        <Reveal delay={0.15} className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>It has been more than 20 years since we started working with you, the medical professionals of the Baltic countries. This impressive period of successful cooperation gives us even more confidence and inspiration to continue and to constantly improve our operations.</p>
          <p>Our philosophy – which is oriented towards services to treatment facilities and physicians and towards patient health promotion – has allowed us to earn the trust of the professionals of the biggest Baltic health care institutions and of our foreign partners. This helps us constantly improve the quality of our work and set ever-higher standards for ourselves and for our partners.</p>
        </Reveal>
      </div>
      <div className="mx-auto mt-24 grid max-w-7xl gap-6 px-6 md:grid-cols-3">
        {cards.map(([t, d], i) => (
          <Reveal key={t} delay={i * 0.12}>
            <motion.div whileHover={{ y: -10 }} className="group relative h-full overflow-hidden rounded-3xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-glow">
              <div className="bg-gradient-brand absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-10 transition-transform duration-700 group-hover:scale-[3]" />
              <span className="font-display text-sm font-bold text-teal">0{i + 1}</span>
              <h3 className="font-display mt-4 text-2xl font-semibold">{t}</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{d}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Policy() {
  return (
    <section id="policy" className="scroll-mt-20 relative overflow-hidden bg-navy py-32 text-navy-foreground">
      <div className="bg-gradient-brand absolute -left-40 top-20 h-96 w-96 rounded-full opacity-20 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-teal">ISO 9001 · ISO 14001</p>
            <h2 className="font-display text-4xl font-bold md:text-6xl">Our company policy</h2>
            <p className="mt-6 text-lg opacity-80">Formedics, UAB supplies medical devices to customers in Lithuania, Latvia and Estonia.</p>
            <p className="mt-8 font-semibold">In order to be viable and competitive, we are committed to:</p>
          </Reveal>
        </div>
        <div className="space-y-4">
          {policy.map((p, i) => (
            <Reveal key={i} delay={0.05}>
              <div className="flex gap-6 rounded-2xl border border-navy-foreground/10 bg-navy-foreground/5 p-6 backdrop-blur transition hover:border-teal/50 hover:bg-navy-foreground/10">
                <span className="font-display text-3xl font-bold text-gradient">{String(i + 1).padStart(2, "0")}</span>
                <p className="leading-relaxed opacity-85">{p}</p>
              </div>
            </Reveal>
          ))}
          <Reveal className="space-y-4 pt-8 leading-relaxed opacity-75">
            <p>The company verifies compliance with the requirements of management systems ISO 9001: 2015, ISO 14001: 2015 during internal and independent external audits. The obtained results are used in the process of management evaluation analysis in the future, making important strategic decisions related to the company’s activities and further development.</p>
            <p>The Company’s management regularly reviews, analyses and updates the objectives and policies of the management system to ensure that it remains relevant and appropriate.</p>
            <p>The company’s employees are familiar with the management system policy. It is available to all interested parties.</p>
            <p className="pt-4 text-sm uppercase tracking-widest text-teal">CEO</p>
            <p className="font-display text-2xl opacity-100">Eimantas Baltušis</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Products() {
  return (
    <section id="products" className="scroll-mt-20 py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-4xl font-bold md:text-6xl">Products</h2>
          <Link to="/products" className="font-semibold text-primary underline-offset-4 hover:underline">Learn more →</Link>
        </Reveal>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCT_AREAS.map((area, i) => (
            <Reveal key={area.name} delay={i * 0.07} className="h-full">
              <motion.div whileHover={{ y: -8, rotate: -1 }} className="h-full">
                <Link to="/products" search={{ category: area.name }} className="group flex h-full flex-col items-center justify-center gap-6 rounded-3xl border bg-card p-8 text-center transition-shadow hover:shadow-glow">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted transition-transform duration-500 group-hover:scale-110">
                    <img src={`${W}/${area.icon}`} alt="" loading="lazy" className="max-h-16 max-w-16" />
                  </div>
                  <span className="font-display font-semibold">{area.name}</span>
                </Link>
              </motion.div>
            </Reveal>
          ))}
          <Reveal delay={0.5} className="h-full">
            <Link to="/products" className="bg-gradient-brand flex h-full min-h-48 items-center justify-center rounded-3xl p-8 font-display text-xl font-semibold text-primary-foreground transition hover:scale-[1.02]">Learn more →</Link>
          </Reveal>
        </div>
      </div>
      <div className="mt-24 overflow-hidden border-y py-6">
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap font-display text-3xl font-semibold text-muted-foreground/60">
          {[...PRODUCT_AREAS, ...PRODUCT_AREAS].map((area, i) => <span key={i}>{area.name} ✦</span>)}
        </div>
      </div>
      <div className="mx-auto mt-24 max-w-4xl px-6 text-center">
        <Reveal>
          <h3 className="font-display text-3xl font-bold md:text-5xl">We supply only <span className="text-gradient">safe, high-quality, and effective</span> medical products.</h3>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">These are fundamental principles that we always comply with when choosing which products of our partner-manufacturers to supply. There is no doubt that even manufacturers make mistakes, especially when looking for innovative solutions, but the values of our company are based on a business philosophy that puts responsibility, patient safety and effectiveness first.</p>
        </Reveal>
      </div>
    </section>
  );
}

function Contracts() {
  return (
    <section id="contacts" className="scroll-mt-20 pb-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="grid overflow-hidden rounded-[2.5rem] border bg-card shadow-xl lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-5 p-10 md:p-14">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-teal">NHIF agreement</p>
              <h2 className="font-display text-2xl font-bold md:text-4xl">Contracts with the National Health Insurance Fund under the Ministry of Health</h2>
              <p className="italic text-muted-foreground">At the beginning of 2023, UAB Formedics signed an agreement with the National Health Insurance Fund under the Ministry of Health and started to provide an additional service to people covered by compulsory health insurance — issuing reimbursable electronic speech aids.</p>
              <p className="font-semibold">Important to know:</p>
              <p className="italic text-muted-foreground">Electronic speech aids are available to people covered by compulsory health insurance after vocal cord surgery or when there is no other way to restore the voice in the case of oncological disease. An electronic speech aid can be used to produce a voice, thus restoring the ability to speak. Electronic speech aids can adjust the tone, volume, and timbre of the voice.</p>
              <p className="italic text-muted-foreground">Electronic speech aids are reimbursed once every five years on referral from doctors. The reimbursement amount is <b className="text-foreground">EUR 620.00</b>.</p>
              <p className="pt-2 font-semibold">For your information:</p>
              <div className="flex flex-wrap gap-3">
                <a href={`${W}/2023/03/1.-Kalbos-prietaiso-katalogas.-SERVOX-digital-XL-EN-LT.pdf`} className="rounded-full border px-5 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary" target="_blank" rel="noopener noreferrer">Speech aid catalogue. SERVOX digital XL (EN-LT) ↗</a>
                <a href={`${W}/2023/03/2.-Kalbos-prietaiso-instrukcija.-SERVOX-digital-XL-EN-LT.pdf`} className="rounded-full border px-5 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary" target="_blank" rel="noopener noreferrer">Speech aid instruction. SERVOX digital XL (EN-LT) ↗</a>
              </div>
            </div>
            <div className="bg-gradient-brand space-y-6 p-10 text-primary-foreground md:p-14">
              <h3 className="font-display text-2xl font-semibold">Contact for consultation:</h3>
              <p><b>UAB Formedics</b><br />Senosios Pilaitės kelias 1, LT-06229</p>
              <a href="tel:+37052623070" className="block text-xl font-semibold hover:underline">Phone: +370 5 262 30 70</a>
              <a href="mailto:info@formedics.lt" className="block text-xl font-semibold hover:underline">E-mail: info@formedics.lt</a>
              <p className="opacity-90"><b>Customer service hours on weekdays:</b> {SERVICE_HOURS}</p>
              <Link to="/contacts" className="inline-block rounded-full border border-primary-foreground/40 px-5 py-2 text-sm font-semibold transition hover:bg-white/10">All offices →</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Index() {
  return (
    <main className="font-sans">
      <SiteHeader />
      <Hero />
      <About />
      <Policy />
      <Products />
      <Contracts />
      <SiteFooter />
    </main>
  );
}

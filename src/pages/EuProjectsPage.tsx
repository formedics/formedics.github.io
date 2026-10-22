import { CookieConsent } from "@/components/site/CookieConsent";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { useLocale } from "@/lib/i18n";
import { EU_LOGO, W } from "@/lib/site";

export function EuProjectsPage() {
  const { t } = useLocale();
  const eu = t.eu;
  return (
    <main className="font-sans">
      <SiteHeader />
      <PageHero eyebrow={eu.eyebrow} title={eu.title}>
        <p>{eu.funded}</p>
      </PageHero>

      <section className="pb-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <Reveal>
              <img src={`${W}/${EU_LOGO}`} alt={eu.logoAlt} className="mb-8 h-24 w-auto rounded-xl bg-white p-2 shadow-sm" />
            </Reveal>
            {eu.intro.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p>{p}</p>
              </Reveal>
            ))}

            <Reveal>
              <h2 className="font-display mt-10 text-2xl font-semibold text-foreground md:text-3xl">{eu.goalsTitle}</h2>
            </Reveal>
            <ol className="space-y-4">
              {eu.goals.map((g, i) => (
                <li key={i}>
                  <Reveal delay={i * 0.06} className="flex gap-5 rounded-2xl border bg-card p-6 text-base">
                    <span className="font-display text-2xl font-bold text-gradient">{String(i + 1).padStart(2, "0")}</span>
                    <p className="leading-relaxed">{g}</p>
                  </Reveal>
                </li>
              ))}
            </ol>

            <Reveal>
              <p className="pt-4">{eu.outcome}</p>
            </Reveal>
          </div>

          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <dl className="overflow-hidden rounded-[2rem] border bg-navy text-navy-foreground shadow-xl">
              <div className="bg-gradient-brand px-8 py-6">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-foreground/80">{eu.factsTitle}</p>
              </div>
              {eu.facts.map(([k, v]) => (
                <div key={k} className="border-t border-navy-foreground/10 px-8 py-5">
                  <dt className="text-xs font-semibold uppercase tracking-widest text-navy-foreground/55">{k}</dt>
                  <dd className="font-display mt-1 text-lg font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
      <CookieConsent />
    </main>
  );
}

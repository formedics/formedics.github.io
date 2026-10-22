import { CookieConsent } from "@/components/site/CookieConsent";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { useLocale } from "@/lib/i18n";
import { SOCIAL_PHOTOS, W } from "@/lib/site";

export function SocialPage() {
  const { t } = useLocale();
  return (
    <main className="font-sans">
      <SiteHeader />
      <PageHero eyebrow={t.nav.social} title={t.nav.social}>
        <p>{t.social.intro[0]}</p>
      </PageHero>

      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">{t.social.intro[1]}</p>
          </Reveal>

          <ol className="relative mt-20 space-y-24 before:absolute before:bottom-0 before:left-[7px] before:top-2 before:w-px before:bg-border lg:before:left-1/2">
            {t.social.entries.map((e, i) => {
              const photos = SOCIAL_PHOTOS[e.id] ?? [];
              const flip = i % 2 === 1;
              return (
                <li key={e.id} className="relative grid gap-8 pl-8 lg:grid-cols-2 lg:gap-16 lg:pl-0">
                  <span className="absolute left-0 top-2 h-4 w-4 rounded-full border-4 border-background bg-teal shadow-[0_0_0_3px_var(--teal)] lg:left-1/2 lg:-translate-x-1/2" aria-hidden />
                  <Reveal className={flip ? "lg:order-2 lg:pl-16" : "lg:pr-16 lg:text-right"}>
                    <time className="text-sm font-bold uppercase tracking-[0.3em] text-teal">{e.date}</time>
                    <h2 className="font-display mt-3 text-2xl font-semibold md:text-3xl">{e.title}</h2>
                    <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
                      {e.paragraphs.map((p, j) => (
                        <p key={j}>{p}</p>
                      ))}
                    </div>
                  </Reveal>
                  <Reveal delay={0.1} className={flip ? "lg:order-1 lg:pr-16" : "lg:pl-16"}>
                    <div className={`grid gap-3 ${photos.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                      {photos.map((ph, j) => (
                        <a
                          key={ph}
                          href={`${W}/${ph}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group block overflow-hidden rounded-2xl border bg-muted ${photos.length === 3 && j === 0 ? "col-span-2" : ""}`}
                        >
                          <img src={`${W}/${ph}`} alt={t.social.photoAlt(e.title, j + 1)} loading="lazy" className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </a>
                      ))}
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
      <SiteFooter />
      <CookieConsent />
    </main>
  );
}

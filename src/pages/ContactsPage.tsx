import { CookieConsent } from "@/components/site/CookieConsent";
import { MapEmbed } from "@/components/site/MapEmbed";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { BALTICS } from "@/lib/baltics";
import { useLocale } from "@/lib/i18n";
import { OFFICES } from "@/lib/site";

const mapsHref = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export function ContactsPage() {
  const { t } = useLocale();
  const hq = OFFICES[0]!;
  return (
    <main className="font-sans">
      <SiteHeader />
      <PageHero eyebrow={t.nav.contacts} title={t.nav.contacts}>
        <p>
          {t.contacts.intro} <span className="text-foreground">{t.nhif.hours}</span> {t.nhif.hoursValue}
        </p>
      </PageHero>

      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {OFFICES.map((o, i) => {
              const color = BALTICS.find((b) => b.code === o.code)?.color ?? "#22b8c4";
              return (
                <Reveal key={o.code} delay={i * 0.1} className={i === 2 ? "md:col-span-2 lg:col-span-1" : ""}>
                  <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-glow">
                    <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: color }} />
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg px-2 py-1 text-xs font-bold tracking-widest text-white" style={{ background: color }}>
                        {o.code}
                      </span>
                      <h2 className="font-display text-2xl font-semibold">{t.offices[o.code]}</h2>
                    </div>
                    <address className="mt-6 space-y-1 text-base not-italic leading-relaxed text-muted-foreground">
                      {o.company && <p className="font-semibold text-foreground">{o.company}</p>}
                      <p>{o.address}</p>
                    </address>
                    <div className="mt-6 space-y-2">
                      <a href={o.phoneHref} className="font-display block text-xl font-semibold text-foreground transition hover:text-primary">
                        {o.phone}
                      </a>
                      {o.fax && (
                        <p className="text-sm text-muted-foreground">
                          {t.offices.fax} {o.fax}
                        </p>
                      )}
                      <a href={`mailto:${o.email}`} className="block break-all font-semibold text-primary underline-offset-4 hover:underline">
                        {o.email}
                      </a>
                    </div>
                    {(o.companyCode || o.code === "LV") && (
                      <ul className="mt-6 space-y-1 border-t pt-5 text-sm text-muted-foreground">
                        {o.companyCode && (
                          <li>
                            {t.offices.companyCode}: {o.companyCode}
                          </li>
                        )}
                        {o.vat && (
                          <li>
                            {t.offices.vat}: {o.vat}
                          </li>
                        )}
                        {o.code === "LV" && <li>{t.offices.lvNote}</li>}
                      </ul>
                    )}
                    <a href={mapsHref(o.maps)} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex w-fit items-center gap-2 pt-8 text-sm font-semibold text-primary underline-offset-4 hover:underline">
                      {t.contacts.openMaps}
                    </a>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="mt-16">
            <div className="grid overflow-hidden rounded-[2.5rem] border bg-card shadow-xl lg:grid-cols-[1fr_1.6fr]">
              <div className="bg-gradient-brand space-y-5 p-8 text-primary-foreground sm:p-10 md:p-14">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-foreground/80">{t.contacts.headOffice}</p>
                <h2 className="font-display text-2xl font-bold sm:text-3xl">{hq.company}</h2>
                <p className="text-lg opacity-90">{hq.address}</p>
                <a href={hq.phoneHref} className="block text-xl font-semibold hover:underline">
                  {t.nhif.phone} {hq.phone}
                </a>
                <a href={`mailto:${hq.email}`} className="block break-all text-xl font-semibold hover:underline">
                  {t.nhif.email} {hq.email}
                </a>
                <p className="opacity-90">
                  <b>{t.nhif.hours}</b> {t.nhif.hoursValue}
                </p>
              </div>
              <MapEmbed query={hq.maps} mapsHref={mapsHref(hq.maps)} />
            </div>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
      <CookieConsent />
    </main>
  );
}

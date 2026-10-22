import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { BALTICS } from "@/lib/baltics";
import { OFFICES, SERVICE_HOURS } from "@/lib/site";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Contacts — Formedics" },
      { name: "description", content: "Formedics offices in Vilnius, Rīga and Tallinn: addresses, phone numbers and e-mail." },
    ],
  }),
  component: ContactsPage,
});

function ContactsPage() {
  const hq = OFFICES[0]!;
  return (
    <main className="font-sans">
      <SiteHeader />
      <PageHero eyebrow="Contacts" title="Contacts">
        <p>
          Our offices in Lithuania, Latvia and Estonia. <span className="text-foreground">Customer service hours on weekdays:</span> {SERVICE_HOURS}.
        </p>
      </PageHero>

      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {OFFICES.map((o, i) => {
              const color = BALTICS.find((b) => b.code === o.code)?.color ?? "#22b8c4";
              return (
                <Reveal key={o.code} delay={i * 0.1}>
                  <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-glow">
                    <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: color }} />
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg px-2 py-1 text-xs font-bold tracking-widest text-white" style={{ background: color }}>
                        {o.code}
                      </span>
                      <h2 className="font-display text-2xl font-semibold">{o.title}</h2>
                    </div>
                    <address className="mt-6 space-y-1 text-base not-italic leading-relaxed text-muted-foreground">
                      {o.company && <p className="font-semibold text-foreground">{o.company}</p>}
                      <p>{o.address}</p>
                    </address>
                    <div className="mt-6 space-y-2">
                      <a href={o.phoneHref} className="font-display block text-xl font-semibold text-foreground transition hover:text-primary">
                        {o.phone}
                      </a>
                      {o.fax && <p className="text-sm text-muted-foreground">Fax {o.fax}</p>}
                      <a href={`mailto:${o.email}`} className="block font-semibold text-primary underline-offset-4 hover:underline">
                        {o.email}
                      </a>
                    </div>
                    {o.details.length > 0 && (
                      <ul className="mt-6 space-y-1 border-t pt-5 text-sm text-muted-foreground">
                        {o.details.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    )}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.maps)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex w-fit items-center gap-2 pt-8 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      Open in Google Maps ↗
                    </a>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="mt-16">
            <div className="grid overflow-hidden rounded-[2.5rem] border bg-card shadow-xl lg:grid-cols-[1fr_1.6fr]">
              <div className="bg-gradient-brand space-y-5 p-10 text-primary-foreground md:p-14">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-foreground/80">Head office</p>
                <h2 className="font-display text-3xl font-bold">{hq.company}</h2>
                <p className="text-lg opacity-90">{hq.address}</p>
                <a href={hq.phoneHref} className="block text-xl font-semibold hover:underline">
                  Phone: {hq.phone}
                </a>
                <a href={`mailto:${hq.email}`} className="block text-xl font-semibold hover:underline">
                  E-mail: {hq.email}
                </a>
                <p className="opacity-90">
                  <b>Customer service hours on weekdays:</b> {SERVICE_HOURS}
                </p>
              </div>
              <iframe
                title="Map: Formedics head office, Senosios Pilaitės kelias 1, Vilnius"
                src={`https://www.google.com/maps?q=${encodeURIComponent(hq.maps)}&z=15&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="min-h-[22rem] w-full border-0 lg:min-h-full"
              />
            </div>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

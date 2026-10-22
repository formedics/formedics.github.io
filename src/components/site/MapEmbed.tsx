import { useConsent } from "@/lib/consent";
import { useLocale } from "@/lib/i18n";

/** Google Maps embed that loads only after functional-cookie consent. */
export function MapEmbed({ query, mapsHref }: { query: string; mapsHref: string }) {
  const { t } = useLocale();
  const { consent, set } = useConsent();

  if (consent?.functional) {
    return (
      <iframe
        title={t.contacts.mapTitle}
        src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="min-h-[22rem] w-full border-0 lg:min-h-full"
      />
    );
  }

  return (
    <div className="flex min-h-[22rem] flex-col items-center justify-center gap-4 bg-muted px-8 py-12 text-center lg:min-h-full">
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{t.contacts.mapConsent}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => set(true)} className="bg-gradient-brand rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:scale-[1.03]">
          {t.contacts.loadMap}
        </button>
        <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="rounded-full border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary">
          {t.contacts.openMaps}
        </a>
      </div>
    </div>
  );
}

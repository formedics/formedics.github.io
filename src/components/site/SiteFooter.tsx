import { Link } from "@tanstack/react-router";
import { openConsentSettings } from "@/lib/consent";
import { useLocale, type SitePath } from "@/lib/i18n";
import { OFFICES, W } from "@/lib/site";

/** Footer with the three Baltic offices, as on the original site. */
export function SiteFooter() {
  const { t, path } = useLocale();
  const nav: { label: string; to: SitePath; hash?: string }[] = [
    { label: t.nav.home, to: "/" },
    { label: t.nav.about, to: "/", hash: "about" },
    { label: t.nav.policy, to: "/", hash: "policy" },
    { label: t.nav.products, to: "/products/" },
    { label: t.nav.eu, to: "/eu-projects/" },
    { label: t.nav.social, to: "/social-responsibility/" },
    { label: t.nav.contacts, to: "/contacts/" },
  ];

  return (
    <footer className="relative overflow-hidden bg-navy text-navy-foreground">
      <div className="bg-gradient-brand pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <img src="/formedics-logo-white.svg" alt="Formedics" width={735} height={100} className="h-9 w-auto" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-navy-foreground/70">{t.footer.tagline}</p>
            <a
              href="https://www.sgs.com/certifiedclients"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-navy-foreground/15 bg-navy-foreground/5 px-4 py-3 transition hover:border-teal/50"
            >
              <img src={`${W}/2018/01/SGS_logo_90_1.png`} alt="SGS" className="h-10 w-auto" loading="lazy" />
              <span className="text-xs font-semibold uppercase tracking-widest text-navy-foreground/80">
                ISO 9001 · ISO 14001
                <br />
                <span className="font-normal normal-case tracking-normal text-navy-foreground/60">{t.footer.certified}</span>
              </span>
            </a>
          </div>

          {OFFICES.map((o) => (
            <address key={o.code} className="text-sm not-italic leading-relaxed text-navy-foreground/75">
              <h3 className="font-display mb-4 flex items-center gap-2 text-base font-semibold text-navy-foreground">
                <span className="rounded-md bg-teal/20 px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-teal">{o.code}</span>
                {t.offices[o.code]}
              </h3>
              {o.company && <p className="font-semibold text-navy-foreground/90">{o.company}</p>}
              <p>{o.address}</p>
              <p className="mt-3">
                <a href={o.phoneHref} className="transition hover:text-teal">
                  {t.offices.phone} {o.phone}
                </a>
              </p>
              {o.fax && (
                <p>
                  {t.offices.fax} {o.fax}
                </p>
              )}
              <p>
                <a href={`mailto:${o.email}`} className="transition hover:text-teal">
                  {o.email}
                </a>
              </p>
              {o.companyCode && (
                <p className="mt-3 text-xs text-navy-foreground/55">
                  {t.offices.companyCode} {o.companyCode}
                </p>
              )}
              {o.vat && (
                <p className="text-xs text-navy-foreground/55">
                  {t.offices.vat} {o.vat}
                </p>
              )}
              {o.code === "LV" && <p className="mt-3 text-xs text-navy-foreground/55">{t.offices.lvNote}</p>}
            </address>
          ))}
        </div>

        <nav aria-label={t.footer.navAria} className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-navy-foreground/10 pt-8 text-sm">
          {nav.map((n) => (
            <Link key={n.label} to={path(n.to)} {...(n.hash ? { hash: n.hash } : {})} className="text-navy-foreground/70 transition hover:text-teal">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-xs text-navy-foreground/55">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} UAB Formedics · {t.footer.rights}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <button type="button" onClick={openConsentSettings} className="transition hover:text-teal">
              {t.footer.cookieSettings}
            </button>
            <a href="https://formedics.lt/terms-and-conditions/" className="transition hover:text-teal">
              {t.footer.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

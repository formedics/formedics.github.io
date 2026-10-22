import { Link } from "@tanstack/react-router";
import { NAV, OFFICES, W } from "@/lib/site";

/** Footer with the three Baltic offices, as on the original site. */
export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-navy text-navy-foreground">
      <div className="bg-gradient-brand pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr_1fr_1fr]">
          <div>
            <img src={`${W}/2016/04/formedics-logotipas-baltas-227px.png`} alt="Formedics" className="h-9 w-auto" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-navy-foreground/70">Dedication towards your success! Medical devices for healthcare institutions in Lithuania, Latvia and Estonia.</p>
            <a
              href="https://www.sgs.com/certifiedclients"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-navy-foreground/15 bg-navy-foreground/5 px-4 py-3 transition hover:border-teal/50"
            >
              <img src={`${W}/2018/01/SGS_logo_90_1.png`} alt="SGS certified" className="h-10 w-auto" loading="lazy" />
              <span className="text-xs font-semibold uppercase tracking-widest text-navy-foreground/80">
                ISO 9001 · ISO 14001
                <br />
                <span className="font-normal normal-case tracking-normal text-navy-foreground/60">SGS certified client</span>
              </span>
            </a>
          </div>

          {OFFICES.map((o) => (
            <address key={o.code} className="text-sm not-italic leading-relaxed text-navy-foreground/75">
              <h3 className="font-display mb-4 flex items-center gap-2 text-base font-semibold text-navy-foreground">
                <span className="rounded-md bg-teal/20 px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-teal">{o.code}</span>
                {o.title}
              </h3>
              {o.company && <p className="font-semibold text-navy-foreground/90">{o.company}</p>}
              <p>{o.address}</p>
              <p className="mt-3">
                <a href={o.phoneHref} className="transition hover:text-teal">
                  Phone {o.phone}
                </a>
              </p>
              {o.fax && <p>Fax {o.fax}</p>}
              <p>
                <a href={`mailto:${o.email}`} className="transition hover:text-teal">
                  {o.email}
                </a>
              </p>
              {o.details.map((d) => (
                <p key={d} className="mt-3 text-xs text-navy-foreground/55">
                  {d}
                </p>
              ))}
            </address>
          ))}
        </div>

        <nav aria-label="Footer" className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-navy-foreground/10 pt-8 text-sm">
          {NAV.map((n) => (
            <Link key={n.label} to={n.to} {...(n.hash ? { hash: n.hash } : {})} className="text-navy-foreground/70 transition hover:text-teal">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-navy-foreground/55">
          <p suppressHydrationWarning>© {new Date().getFullYear()} UAB Formedics · All rights reserved</p>
          <a href="https://formedics.lt/terms-and-conditions/" className="transition hover:text-teal">
            Terms of Use
          </a>
        </div>
      </div>
    </footer>
  );
}

import { useLocation } from "@tanstack/react-router";
import { EN } from "./content/en";
import { LT } from "./content/lt";
import type { Dict } from "./content/types";

/** Absolute origin for canonical / hreflang links (the client's domain; override per deployment). */
export const SITE_ORIGIN = (import.meta.env["VITE_SITE_ORIGIN"] as string | undefined)?.replace(/\/+$/, "") ?? "https://formedics.lt";

/**
 * Two languages, mirrored URLs: English at the root, Lithuanian under /lt.
 * The locale is derived from the pathname, so links, metadata and content all
 * agree without any client-side state.
 */
export type Locale = "en" | "lt";

export type SitePath = "/" | "/products" | "/eu-projects" | "/social-responsibility" | "/contacts";
export type RoutePath = SitePath | "/lt" | "/lt/products" | "/lt/eu-projects" | "/lt/social-responsibility" | "/lt/contacts";

export const DICT: Record<Locale, Dict> = { en: EN, lt: LT };

export function localeFromPath(pathname: string): Locale {
  return pathname === "/lt" || pathname.startsWith("/lt/") ? "lt" : "en";
}

/** Path of the same page without the language prefix. */
export function stripLocale(pathname: string): SitePath {
  const p = pathname === "/lt" ? "/" : pathname.startsWith("/lt/") ? pathname.slice(3) : pathname;
  const clean = p.replace(/\/+$/, "") || "/";
  return (["/", "/products", "/eu-projects", "/social-responsibility", "/contacts"].includes(clean) ? clean : "/") as SitePath;
}

export function localized(locale: Locale, path: SitePath): RoutePath {
  if (locale === "en") return path;
  return path === "/" ? "/lt" : (`/lt${path}` as RoutePath);
}

export function useLocale() {
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const other: Locale = locale === "en" ? "lt" : "en";
  const current = stripLocale(pathname);
  return {
    locale,
    other,
    t: DICT[locale],
    /** Same page in this locale */
    path: (p: SitePath): RoutePath => localized(locale, p),
    /** Current page in the other locale (for the language switch) */
    switchTo: localized(other, current),
    current,
  };
}

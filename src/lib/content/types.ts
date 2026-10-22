import type { Category } from "../site";

export type Meta = { title: string; description: string };

export type SocialEntryText = { id: string; title: string; date: string; paragraphs: string[] };

/** Every user-facing string on the site, per language. Data (logos, addresses, numbers) lives in src/lib/site.ts. */
export type Dict = {
  htmlLang: string;
  nav: { home: string; about: string; policy: string; products: string; eu: string; social: string; contacts: string };
  menu: { open: string; close: string; language: string; switchTo: string };
  meta: { home: Meta; products: Meta; eu: Meta; social: Meta; contacts: Meta };
  hero: {
    eyebrow: string;
    /** headline words; words from `highlightFrom` on are rendered in the brand gradient */
    words: string[];
    highlightFrom: number;
    subtitle: string;
    ctaProducts: string;
    ctaAbout: string;
    years: string;
    yearsSub: string;
    iso: string;
    drag: string;
    mapAria: string;
  };
  countries: { LT: string; LV: string; EE: string };
  about: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    yearsLabel: string;
    countriesLabel: string;
    paragraphs: string[];
    cards: [string, string][];
  };
  policy: {
    eyebrow: string;
    title: string;
    intro: string;
    commit: string;
    items: string[];
    closing: string[];
    certified: string;
    ceoLabel: string;
    ceo: string;
  };
  products: {
    title: string;
    learnMore: string;
    statementBefore: string;
    statementHighlight: string;
    statementAfter: string;
    statementText: string;
    pageIntro: string;
    all: string;
    showing: (n: number, category: string | null) => string;
    visit: string;
    contact: string;
    categories: Record<Category, string>;
    categoriesAria: string;
    partnerCategories: (name: string) => string;
  };
  nhif: {
    eyebrow: string;
    title: string;
    p1: string;
    important: string;
    p2: string;
    p3Before: string;
    amount: string;
    p3After: string;
    info: string;
    catalogue: string;
    instruction: string;
    consult: string;
    phone: string;
    email: string;
    hours: string;
    hoursValue: string;
    allOffices: string;
  };
  offices: { LT: string; LV: string; EE: string; companyCode: string; vat: string; phone: string; fax: string; email: string; lvNote: string };
  contacts: { intro: string; headOffice: string; openMaps: string; mapTitle: string; mapConsent: string; loadMap: string };
  eu: {
    eyebrow: string;
    funded: string;
    logoAlt: string;
    title: string;
    intro: string[];
    goalsTitle: string;
    goals: string[];
    outcome: string;
    factsTitle: string;
    facts: [string, string][];
  };
  social: { intro: string[]; photoAlt: (title: string, n: number) => string; entries: SocialEntryText[] };
  footer: { tagline: string; certified: string; rights: string; terms: string; cookieSettings: string; navAria: string };
  cookies: {
    title: string;
    text: string;
    acceptAll: string;
    necessaryOnly: string;
    settings: string;
    save: string;
    necessaryLabel: string;
    necessaryDesc: string;
    functionalLabel: string;
    functionalDesc: string;
    aria: string;
  };
};

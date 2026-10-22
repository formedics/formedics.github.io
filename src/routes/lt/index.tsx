import { createFileRoute } from "@tanstack/react-router";
import { SITE_ORIGIN } from "@/lib/i18n";
import { LT } from "@/lib/content/lt";
import { HomePage } from "@/pages/HomePage";

export const Route = createFileRoute("/lt/")({
  head: () => ({
    meta: [
      { title: LT.meta.home.title },
      { name: "description", content: LT.meta.home.description },
      { property: "og:title", content: LT.meta.home.title },
      { property: "og:description", content: LT.meta.home.description },
      { property: "og:locale", content: "lt_LT" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_ORIGIN}/lt/` },
      { rel: "alternate", hrefLang: "lt", href: `${SITE_ORIGIN}/lt/` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_ORIGIN}/` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_ORIGIN}/` },
    ],
  }),
  component: HomePage,
});

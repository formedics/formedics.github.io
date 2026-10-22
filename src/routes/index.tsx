import { createFileRoute } from "@tanstack/react-router";
import { SITE_ORIGIN } from "@/lib/i18n";
import { EN } from "@/lib/content/en";
import { HomePage } from "@/pages/HomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: EN.meta.home.title },
      { name: "description", content: EN.meta.home.description },
      { property: "og:title", content: EN.meta.home.title },
      { property: "og:description", content: EN.meta.home.description },
      { property: "og:locale", content: "en_GB" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_ORIGIN}/` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_ORIGIN}/` },
      { rel: "alternate", hrefLang: "lt", href: `${SITE_ORIGIN}/lt/` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_ORIGIN}/` },
    ],
  }),
  component: HomePage,
});

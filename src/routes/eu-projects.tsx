import { createFileRoute } from "@tanstack/react-router";
import { SITE_ORIGIN } from "@/lib/i18n";
import { EN } from "@/lib/content/en";
import { EuProjectsPage } from "@/pages/EuProjectsPage";

export const Route = createFileRoute("/eu-projects")({
  head: () => ({
    meta: [
      { title: EN.meta.eu.title },
      { name: "description", content: EN.meta.eu.description },
      { property: "og:title", content: EN.meta.eu.title },
      { property: "og:description", content: EN.meta.eu.description },
      { property: "og:locale", content: "en_GB" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_ORIGIN}/eu-projects/` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_ORIGIN}/eu-projects/` },
      { rel: "alternate", hrefLang: "lt", href: `${SITE_ORIGIN}/lt/eu-projects/` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_ORIGIN}/eu-projects/` },
    ],
  }),
  component: EuProjectsPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { SITE_ORIGIN } from "@/lib/i18n";
import { LT } from "@/lib/content/lt";
import { EuProjectsPage } from "@/pages/EuProjectsPage";

export const Route = createFileRoute("/lt/eu-projects")({
  head: () => ({
    meta: [
      { title: LT.meta.eu.title },
      { name: "description", content: LT.meta.eu.description },
      { property: "og:title", content: LT.meta.eu.title },
      { property: "og:description", content: LT.meta.eu.description },
      { property: "og:locale", content: "lt_LT" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_ORIGIN}/lt/eu-projects/` },
      { rel: "alternate", hrefLang: "lt", href: `${SITE_ORIGIN}/lt/eu-projects/` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_ORIGIN}/eu-projects/` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_ORIGIN}/eu-projects/` },
    ],
  }),
  component: EuProjectsPage,
});

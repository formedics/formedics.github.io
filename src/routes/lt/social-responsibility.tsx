import { createFileRoute } from "@tanstack/react-router";
import { SITE_ORIGIN } from "@/lib/i18n";
import { LT } from "@/lib/content/lt";
import { SocialPage } from "@/pages/SocialPage";

export const Route = createFileRoute("/lt/social-responsibility")({
  head: () => ({
    meta: [
      { title: LT.meta.social.title },
      { name: "description", content: LT.meta.social.description },
      { property: "og:title", content: LT.meta.social.title },
      { property: "og:description", content: LT.meta.social.description },
      { property: "og:locale", content: "lt_LT" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_ORIGIN}/lt/social-responsibility/` },
      { rel: "alternate", hrefLang: "lt", href: `${SITE_ORIGIN}/lt/social-responsibility/` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_ORIGIN}/social-responsibility/` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_ORIGIN}/social-responsibility/` },
    ],
  }),
  component: SocialPage,
});

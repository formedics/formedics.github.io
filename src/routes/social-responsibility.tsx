import { createFileRoute } from "@tanstack/react-router";
import { SITE_ORIGIN } from "@/lib/i18n";
import { EN } from "@/lib/content/en";
import { SocialPage } from "@/pages/SocialPage";

export const Route = createFileRoute("/social-responsibility")({
  head: () => ({
    meta: [
      { title: EN.meta.social.title },
      { name: "description", content: EN.meta.social.description },
      { property: "og:title", content: EN.meta.social.title },
      { property: "og:description", content: EN.meta.social.description },
      { property: "og:locale", content: "en_GB" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_ORIGIN}/social-responsibility/` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_ORIGIN}/social-responsibility/` },
      { rel: "alternate", hrefLang: "lt", href: `${SITE_ORIGIN}/lt/social-responsibility/` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_ORIGIN}/social-responsibility/` },
    ],
  }),
  component: SocialPage,
});

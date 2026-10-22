import { createFileRoute } from "@tanstack/react-router";
import { SITE_ORIGIN } from "@/lib/i18n";
import { EN } from "@/lib/content/en";
import { ContactsPage } from "@/pages/ContactsPage";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: EN.meta.contacts.title },
      { name: "description", content: EN.meta.contacts.description },
      { property: "og:title", content: EN.meta.contacts.title },
      { property: "og:description", content: EN.meta.contacts.description },
      { property: "og:locale", content: "en_GB" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_ORIGIN}/contacts/` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_ORIGIN}/contacts/` },
      { rel: "alternate", hrefLang: "lt", href: `${SITE_ORIGIN}/lt/contacts/` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_ORIGIN}/contacts/` },
    ],
  }),
  component: ContactsPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { SITE_ORIGIN } from "@/lib/i18n";
import { LT } from "@/lib/content/lt";
import { ContactsPage } from "@/pages/ContactsPage";

export const Route = createFileRoute("/lt/contacts")({
  head: () => ({
    meta: [
      { title: LT.meta.contacts.title },
      { name: "description", content: LT.meta.contacts.description },
      { property: "og:title", content: LT.meta.contacts.title },
      { property: "og:description", content: LT.meta.contacts.description },
      { property: "og:locale", content: "lt_LT" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_ORIGIN}/lt/contacts/` },
      { rel: "alternate", hrefLang: "lt", href: `${SITE_ORIGIN}/lt/contacts/` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_ORIGIN}/contacts/` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_ORIGIN}/contacts/` },
    ],
  }),
  component: ContactsPage,
});

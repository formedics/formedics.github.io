import { createFileRoute } from "@tanstack/react-router";
import { SITE_ORIGIN } from "@/lib/i18n";
import { LT } from "@/lib/content/lt";
import { ProductsPage, validateProductsSearch } from "@/pages/ProductsPage";

export const Route = createFileRoute("/lt/products")({
  validateSearch: validateProductsSearch,
  head: () => ({
    meta: [
      { title: LT.meta.products.title },
      { name: "description", content: LT.meta.products.description },
      { property: "og:title", content: LT.meta.products.title },
      { property: "og:description", content: LT.meta.products.description },
      { property: "og:locale", content: "lt_LT" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_ORIGIN}/lt/products` },
      { rel: "alternate", hrefLang: "lt", href: `${SITE_ORIGIN}/lt/products` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_ORIGIN}/products` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_ORIGIN}/products` },
    ],
  }),
  component: ProductsPage,
});

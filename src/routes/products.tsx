import { createFileRoute } from "@tanstack/react-router";
import { SITE_ORIGIN } from "@/lib/i18n";
import { EN } from "@/lib/content/en";
import { ProductsPage, validateProductsSearch } from "@/pages/ProductsPage";

export const Route = createFileRoute("/products")({
  validateSearch: validateProductsSearch,
  head: () => ({
    meta: [
      { title: EN.meta.products.title },
      { name: "description", content: EN.meta.products.description },
      { property: "og:title", content: EN.meta.products.title },
      { property: "og:description", content: EN.meta.products.description },
      { property: "og:locale", content: "en_GB" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_ORIGIN}/products` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_ORIGIN}/products` },
      { rel: "alternate", hrefLang: "lt", href: `${SITE_ORIGIN}/lt/products` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_ORIGIN}/products` },
    ],
  }),
  component: ProductsPage,
});

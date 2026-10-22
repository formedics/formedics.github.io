import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

/**
 * The site is fully static: every route (EN at `/`, LT under `/lt`) is
 * prerendered at build time into `dist/client`, which GitHub Pages serves as-is.
 * `VITE_SITE_ORIGIN` sets the canonical/hreflang origin and the sitemap host.
 */
const PAGES = ["/", "/products/", "/eu-projects/", "/social-responsibility/", "/contacts/"];

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), "VITE_"), ...process.env };
  const siteOrigin = (env["VITE_SITE_ORIGIN"] || "https://formedics.lt").replace(/\/+$/, "");

  return {
    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({
        // every route, both languages; trailing slashes match the <route>/index.html files GitHub Pages serves
        pages: PAGES.flatMap((p) => [{ path: p }, { path: `/lt${p}` }]),
        prerender: { enabled: true, crawlLinks: false, autoStaticPathsDiscovery: false, autoSubfolderIndex: true, failOnError: true },
        sitemap: { enabled: true, host: siteOrigin },
      }),
      viteReact(),
    ],
    resolve: {
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});

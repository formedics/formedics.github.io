# formedics-website

Revamped website for [Formedics](https://formedics.lt), a medical-device distributor
serving Lithuania, Latvia and Estonia. English at `/`, Lithuanian under `/lt`.

**Live site**: https://formedics.github.io

## Hosting

The site is fully static. Every push to `main` runs
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which prerenders
all routes into `dist/client` and publishes that folder to GitHub Pages.
No server runs in production.

To serve it from the company domain later, add a `CNAME` file to `public/`
with the domain and point the domain's DNS at GitHub Pages; the canonical
URLs and sitemap follow the deployment origin automatically.

## Development

Requires Node.js 22.

```sh
npm ci
npm run dev          # prints the local URL
npm run build        # static output in dist/client
npm run preview      # serve the built site locally
npx tsc --noEmit -p tsconfig.json
npm run lint
npm test
```

Stack: TanStack Start / Router (prerendered), React 19, Tailwind v4,
framer-motion, react-three-fiber for the hero map.

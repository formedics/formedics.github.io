> [!IMPORTANT]
> `main` deploys straight to GitHub Pages through `.github/workflows/deploy.yml`,
> so keep it in a working state: type-check, build and look at the result before
> pushing. Do not rewrite pushed history (no force-push, rebase, amend or squash
> of commits that are already on `main`).

- The build is static: `npm run build` prerenders every route into `dist/client`.
  There is no server at runtime, so nothing may depend on server functions,
  request headers or per-request rendering.
- Install with `npm ci` (same as CI; `.npmrc` sets legacy-peer-deps).
- Site text mirrors formedics.lt (EN) and formedics.lt/lt (LT); do not reword
  it beyond fixing real mistakes. Content lives in `src/lib/content/`.
- `package-lock.json` must keep the native packages for every platform (linux, win32,
  darwin entries). `npm install` on a machine with `node_modules` present can drop the
  other platforms; if the lock diff removes them, regenerate it from a clean directory
  with only `package.json` and `.npmrc` (`npm install --package-lock-only`).

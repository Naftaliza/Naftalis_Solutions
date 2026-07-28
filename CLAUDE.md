# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bilingual (Hebrew/English) React + Vite marketing site for "Naftali's Solutions", a business selling appointment scheduling, WhatsApp Business integration, and custom dashboards to small businesses. Deployed on Netlify, auto-deploying `main` on push. Live at naftalissolutions.com.

## Commands

```bash
npm install
npm run dev       # Vite dev server on http://localhost:3000 (IPv6 host)
npm run build     # generates llms.txt metadata, then builds to dist/
npm run preview   # serves the dist/ build locally
```

There is no test suite and no lint script configured (ESLint is a devDependency but not wired to a script). Node version is pinned via `.nvmrc` (20.19.1).

Environment variables (create `.env` in root, and mirror in Netlify site settings for production):
```
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```
`ContactPage.jsx` uses these for EmailJS; missing vars should fail visibly (see recent fix in git history) rather than silently.

## Architecture

### App shell (`src/App.jsx`)
`LanguageProvider` wraps the whole app. Layout is Header → routed page content → Footer, plus global `Toaster`, `CookieBanner`, and `AccessibilityWidget`. All page components are lazy-loaded (`React.lazy`) and rendered inside a `Suspense` boundary. `ScrollToTop` resets scroll on route change. Routes: `/` and `/solutions` (Solutions/home), `/about`, `/services`, `/contact`, `/quote`, `/quote-thank-you`, `*` (404).

### Bilingual i18n (`src/context/LanguageContext.jsx` + `src/lib/translations.js`)
One global context holds `language`, `toggleLanguage()`, and the full `translations` object. It persists language choice to localStorage and sets `document.documentElement.lang`/`dir` for RTL (Hebrew) vs LTR (English). Components consume it via `useContext(LanguageContext)` and read strings as `translations[section].key` (e.g. `translations.header.brand`). When adding a page or section, add matching keys under both language trees in `translations.js` — there's no fallback if a key is missing for one language.

### Styling & UI components
Tailwind CSS (`tailwind.config.js`, `postcss.config.js`) with Radix UI primitives wrapped in `src/components/ui/`. Use the `cn()` helper from `src/lib/utils.js` (clsx + tailwind-merge) to merge conditional classes. Animations use Framer Motion (`motion.*`, initial/animate/transition props). Toasts: `import { toast } from '@/components/ui/use-toast'`, call `toast({ title, description, variant })` — variant `"destructive"` for errors. `<Toaster />` is mounted once at the app root, don't add another.

### Import alias
`@/` → `src/` (configured in `vite.config.js`). Always import via `@/components`, `@/lib`, `@/context`, `@/api`, etc.

### Vite build pipeline (`vite.config.js`, `plugins/`)
This project was originally scaffolded by a "Horizons"-style visual builder, which explains several dev-only pieces baked into `vite.config.js` and not typical of a hand-rolled Vite app:
- `plugins/visual-editor/vite-plugin-react-inline-editor.js` and `vite-plugin-edit-mode.js` — inline visual editing support (dev only).
- `plugins/vite-plugin-iframe-route-restoration.js` — restores the last route when the app is embedded in an iframe (dev only).
- Injected `<head>` scripts (defined inline in `vite.config.js`) forward Vite error-overlay content, runtime `window.onerror`, `console.error`, and fetch failures up to a parent window via `postMessage` — relevant when debugging inside an embedded/iframe preview context, not a normal browser tab.
None of this affects production builds (`isDev` gates the plugin list); don't remove it assuming it's dead code without checking whether the site is still being edited through that embedded workflow.

### `tools/generate-llms.js`
Runs before every build (`npm run build`), regex-parses `src/App.jsx` for `<Route>` entries and each page's `<Helmet>` title/description, and writes `public/llms.txt` for LLM crawlers. It's non-fatal (`|| true` in the build script) — a parsing failure won't break the build, but will leave `llms.txt` stale.

### `src/api/EcommerceApi.js`
Integrates a Hostinger ecommerce API (hardcoded endpoint + store ID). Extraction helpers (`extractVariants`, `extractImages`, `extractCollections`, `extractProductOptions`, `formatCurrency`) normalize the API's responses and defensively fall back on missing fields — follow that pattern (`|| default`) if extending it rather than assuming fields are present.

### `mcp-server/`
Currently an empty scaffold (`server.js` and `README.md` are both empty) — not wired into the build or dev workflow. Treat as unimplemented rather than a source of truth.

## Conventions

- New page: add the `.jsx` file to `src/pages/`, wire a lazy `<Route>` in `App.jsx`, add translation keys for both languages in `translations.js`, and use `<NavLink>` for any nav entry.
- New UI primitive: wrap the Radix primitive in `src/components/ui/`, export it, style with Tailwind + `cn()`.
- Apply `dir={language === 'he' ? 'rtl' : 'ltr'}` explicitly on any container whose direction isn't already inherited from `document.documentElement`.

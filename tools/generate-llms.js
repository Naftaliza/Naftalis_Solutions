#!/usr/bin/env node

// Generates public/llms.txt from the routes in src/App.jsx and the matching
// meta title/description in src/lib/translations.js (English copy).
//
// Note: this used to regex-scrape <title>/<meta> text straight out of each
// page's <Helmet> block, but every page's title/description is a JSX
// expression like {t.meta.title} — the old cleaning step stripped JSX
// expressions as noise before extraction, so it always produced
// "Untitled Page". Reading translations.js directly avoids that entirely.

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { extractRoutes } from './lib/routes.js';
import translations from '../src/lib/translations.js';

// Maps the component name used in <Route element={<X />}> to its section
// key in translations.js. Pages not listed here (e.g. NotFoundPage) are
// intentionally excluded — they're not real, indexable content.
const PAGE_TRANSLATION_KEY = {
  SolutionsPage: 'solutionsPage',
  AboutPage: 'aboutPage',
  ServicesPage: 'servicesPage',
  ContactPage: 'contactPage',
  QuotePage: 'quotePage',
  FAQPage: 'faqPage',
  BlogPage: 'blogPage',
  PrivacyPolicyPage: 'privacyPolicyPage',
};

function buildPages(routes) {
  const pages = [];

  for (const [componentName, translationKey] of Object.entries(PAGE_TRANSLATION_KEY)) {
    const routePath = routes.get(componentName);
    const meta = translations.en[translationKey]?.meta;

    if (!routePath || !meta) continue;

    pages.push({
      url: routePath,
      title: meta.title,
      description: meta.description,
    });
  }

  return pages;
}

function generateLlmsTxt(pages) {
  const sortedPages = [...pages].sort((a, b) => a.title.localeCompare(b.title));
  const pageEntries = sortedPages
    .map(page => `- [${page.title}](${page.url}): ${page.description}`)
    .join('\n');

  return `## Pages\n${pageEntries}\n`;
}

function main() {
  const appJsxPath = path.join(process.cwd(), 'src', 'App.jsx');
  const routes = extractRoutes(appJsxPath);
  const pages = buildPages(routes);

  if (pages.length === 0) {
    console.error('❌ No pages resolved from routes + translations.js!');
    process.exit(1);
  }

  const outputPath = path.join(process.cwd(), 'public', 'llms.txt');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, generateLlmsTxt(pages), 'utf8');
}

// A plain `file://${process.argv[1]}` comparison breaks on Windows, where
// process.argv[1] uses backslashes and import.meta.url is a proper
// file:// URL — they'd never match, so main() would silently never run.
const isMainModule = import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  main();
}

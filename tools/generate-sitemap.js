#!/usr/bin/env node

// Generates public/sitemap.xml from the routes in src/App.jsx, so it can't
// drift out of sync with the app's actual pages the way a hand-maintained
// sitemap does.

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { extractRoutes } from './lib/routes.js';

const SITE_URL = 'https://naftalissolutions.com';

// Routes that exist but shouldn't be indexed: interstitial pages, legal
// boilerplate, and the catch-all 404 (normalized to "/*" since it doesn't
// start with a slash in App.jsx's path="*").
const EXCLUDED_ROUTES = new Set(['/quote-thank-you', '/privacy-policy', '/*']);

const ROUTE_META = {
  '/': { changefreq: 'weekly', priority: '1.0' },
  '/solutions': { changefreq: 'weekly', priority: '1.0' },
  '/services': { changefreq: 'weekly', priority: '0.9' },
  '/faq': { changefreq: 'monthly', priority: '0.7' },
  '/blog': { changefreq: 'weekly', priority: '0.7' },
  '/about': { changefreq: 'monthly', priority: '0.8' },
  '/quote': { changefreq: 'monthly', priority: '0.8' },
  '/contact': { changefreq: 'monthly', priority: '0.7' },
};

const DEFAULT_META = { changefreq: 'monthly', priority: '0.5' };

function buildUrls(routes) {
  const uniquePaths = [...new Set(routes.values())].filter(p => !EXCLUDED_ROUTES.has(p));
  return uniquePaths.sort().map(routePath => ({
    loc: `${SITE_URL}${routePath}`,
    ...(ROUTE_META[routePath] || DEFAULT_META),
  }));
}

function generateSitemapXml(urls) {
  const urlEntries = urls
    .map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
}

function main() {
  const appJsxPath = path.join(process.cwd(), 'src', 'App.jsx');
  const routes = extractRoutes(appJsxPath);
  const urls = buildUrls(routes);

  if (urls.length === 0) {
    console.error('❌ No indexable routes found in App.jsx!');
    process.exit(1);
  }

  const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, generateSitemapXml(urls), 'utf8');
}

// See generate-llms.js for why this can't be a plain string comparison on Windows.
const isMainModule = import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  main();
}

#!/usr/bin/env node

// Generates public/llms.txt from src/lib/site-routes.js plus each page's meta
// in src/lib/translations.js, so LLM crawlers get a clean index of the site.

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { routes, SITE_URL, absoluteUrl } from '../src/lib/site-routes.js';
import translations from '../src/lib/translations.js';

function buildPages() {
	return routes
		.filter((route) => route.index)
		.map((route) => {
			const meta = translations.en[route.translationKey]?.meta;
			if (!meta) return null;
			return {
				url: absoluteUrl(route.path, 'en'),
				heUrl: absoluteUrl(route.path, 'he'),
				title: meta.title,
				description: meta.description,
			};
		})
		.filter(Boolean);
}

function generateLlmsTxt(pages) {
	const sorted = [...pages].sort((a, b) => a.title.localeCompare(b.title));

	return [
		"# Naftali's Solutions",
		'',
		'> Appointment scheduling, WhatsApp Business automation and custom dashboards',
		'> for small businesses in Israel. Published pricing, no lock-in contract,',
		'> built and supported by one person.',
		'',
		`Site: ${SITE_URL}`,
		'Languages: English (default), Hebrew (under /he/)',
		'',
		'## Pages',
		...sorted.map((page) => `- [${page.title}](${page.url}): ${page.description}`),
		'',
		'## Hebrew',
		...sorted.map((page) => `- ${page.heUrl}`),
		'',
	].join('\n');
}

function main() {
	const pages = buildPages();

	if (pages.length === 0) {
		console.error('generate-llms: no pages resolved from site-routes + translations');
		process.exit(1);
	}

	const outputPath = path.join(process.cwd(), 'public', 'llms.txt');
	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(outputPath, generateLlmsTxt(pages), 'utf8');
	console.log(`  llms.txt: ${pages.length} pages`);
}

const isMainModule = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMainModule) {
	main();
}

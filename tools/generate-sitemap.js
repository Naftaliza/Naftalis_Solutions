#!/usr/bin/env node

// Generates public/sitemap.xml from src/lib/site-routes.js — the same manifest
// the app itself routes from, so the two cannot drift.
//
// Previously this regex-scraped <Route> lines out of App.jsx, which broke as
// soon as the routing style changed. It also emitted English URLs only; Hebrew
// now has real URLs under /he/* and each entry carries xhtml:link alternates so
// search engines can pair the two languages.

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { routes, LANGUAGES, absoluteUrl } from '../src/lib/site-routes.js';

function generateSitemapXml() {
	const entries = [];

	for (const route of routes) {
		if (!route.index) continue;

		for (const language of LANGUAGES) {
			const alternates = LANGUAGES.map(
				(alt) =>
					`    <xhtml:link rel="alternate" hreflang="${alt}" href="${absoluteUrl(route.path, alt)}"/>`,
			).join('\n');

			entries.push(
				[
					'  <url>',
					`    <loc>${absoluteUrl(route.path, language)}</loc>`,
					alternates,
					`    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(route.path, 'en')}"/>`,
					`    <changefreq>${route.changefreq || 'monthly'}</changefreq>`,
					`    <priority>${route.priority || '0.5'}</priority>`,
					'  </url>',
				].join('\n'),
			);
		}
	}

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
		entries.join('\n'),
		'</urlset>',
		'',
	].join('\n');
}

function main() {
	const xml = generateSitemapXml();
	const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(outputPath, xml, 'utf8');

	const count = (xml.match(/<loc>/g) || []).length;
	console.log(`  sitemap.xml: ${count} URLs`);
}

const isMainModule = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMainModule) {
	main();
}

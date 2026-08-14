#!/usr/bin/env node

/**
 * Writes a real HTML file for every route, in both languages.
 *
 * Before this the site shipped an empty <div id="root"> and painted every word
 * with JavaScript, so a crawler fetching naftalissolutions.com received a title
 * and nothing else — no headline, no services, no pricing. Google, Bing and
 * LLM crawlers now get fully-rendered markup, and the client bundle hydrates
 * over the top of it.
 *
 * Runs after `vite build` and after `vite build --ssr`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { prerenderPaths } from '../src/lib/site-routes.js';

const DIST = path.join(process.cwd(), 'dist');
const SSR_ENTRY = path.join(process.cwd(), 'dist-ssr', 'entry-server.js');

const SEO_START = '<!--seo-start-->';
const SEO_END = '<!--seo-end-->';

function injectHead(template, helmet) {
	const tags = [
		helmet.title.toString(),
		helmet.meta.toString(),
		helmet.link.toString(),
		helmet.script.toString(),
	]
		.filter(Boolean)
		.join('\n\t\t');

	// react-helmet echoes the React prop name, emitting `hrefLang`. HTML
	// attribute names are case-insensitive so crawlers read it either way, but
	// serve the spec spelling.
	const normalized = tags.replace(/\shrefLang=/g, ' hreflang=');

	const start = template.indexOf(SEO_START);
	const end = template.indexOf(SEO_END);

	if (start === -1 || end === -1) {
		// Markers missing — append rather than silently shipping no head tags.
		return template.replace('</head>', `\t\t${normalized}\n\t</head>`);
	}

	return template.slice(0, start) + normalized + template.slice(end + SEO_END.length);
}

function injectBody(template, appHtml, htmlAttributes) {
	let out = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

	// react-helmet gives us the right lang/dir for the route; without this the
	// prerendered Hebrew pages would ship lang="en" until hydration.
	const attrs = htmlAttributes.toString();
	if (attrs) {
		out = out.replace(/<html[^>]*>/, `<html ${attrs}>`);
	}
	return out;
}

function outputFileFor(routePath) {
	// "/" -> dist/index.html ; "/he/services" -> dist/he/services/index.html
	if (routePath === '/') return path.join(DIST, 'index.html');
	return path.join(DIST, routePath.replace(/^\//, ''), 'index.html');
}

async function main() {
	if (!fs.existsSync(SSR_ENTRY)) {
		console.error(`prerender: missing SSR bundle at ${SSR_ENTRY}`);
		process.exit(1);
	}

	const templatePath = path.join(DIST, 'index.html');
	if (!fs.existsSync(templatePath)) {
		console.error('prerender: dist/index.html not found — run vite build first');
		process.exit(1);
	}

	const template = fs.readFileSync(templatePath, 'utf8');
	const { render } = await import(pathToFileURL(SSR_ENTRY).href);

	const paths = prerenderPaths();
	let failures = 0;

	// Sequential on purpose: react-helmet's renderStatic reads a module-level
	// stack, so concurrent renders would bleed one route's tags into another.
	for (const routePath of paths) {
		try {
			const { html, helmet } = await render(routePath);
			let page = injectHead(template, helmet);
			page = injectBody(page, html, helmet.htmlAttributes);

			const outFile = outputFileFor(routePath);
			fs.mkdirSync(path.dirname(outFile), { recursive: true });
			fs.writeFileSync(outFile, page, 'utf8');

			const kb = (Buffer.byteLength(page, 'utf8') / 1024).toFixed(1);
			console.log(`  prerendered ${routePath.padEnd(22)} -> ${kb} kB`);
		} catch (error) {
			failures += 1;
			console.error(`  FAILED ${routePath}: ${error.message}`);
		}
	}

	console.log(`prerender: ${paths.length - failures}/${paths.length} routes written`);
	if (failures > 0) process.exit(1);
}

const isMainModule = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMainModule) {
	main();
}

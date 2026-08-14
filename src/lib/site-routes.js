/**
 * The single source of truth for this site's routes.
 *
 * Imported by the app (src/App.jsx) AND by the build tools
 * (tools/generate-sitemap.js, generate-llms.js, prerender.js). It is plain
 * ESM with no JSX and no `@/` alias so Node can import it directly.
 *
 * The tools previously regex-scraped `<Route>` lines out of App.jsx, which
 * broke silently whenever the routing style changed. Now everything reads
 * this list.
 */

export const SITE_URL = 'https://naftalissolutions.com';

export const LANGUAGES = ['en', 'he'];
export const DEFAULT_LANGUAGE = 'en';

/** Hebrew lives under /he/*. English stays at the root. */
export const LANG_PREFIX = { en: '', he: '/he' };

export const routes = [
	{
		path: '/',
		page: 'SolutionsPage',
		translationKey: 'solutionsPage',
		index: true,
		changefreq: 'weekly',
		priority: '1.0',
	},
	{
		path: '/services',
		page: 'ServicesPage',
		translationKey: 'servicesPage',
		index: true,
		changefreq: 'weekly',
		priority: '0.9',
	},
	{
		path: '/quote',
		page: 'QuotePage',
		translationKey: 'quotePage',
		index: true,
		changefreq: 'monthly',
		priority: '0.9',
	},
	{
		path: '/about',
		page: 'AboutPage',
		translationKey: 'aboutPage',
		index: true,
		changefreq: 'monthly',
		priority: '0.8',
	},
	{
		path: '/faq',
		page: 'FAQPage',
		translationKey: 'faqPage',
		index: true,
		changefreq: 'monthly',
		priority: '0.7',
	},
	{
		path: '/blog',
		page: 'BlogPage',
		translationKey: 'blogPage',
		index: true,
		changefreq: 'weekly',
		priority: '0.7',
	},
	{
		path: '/contact',
		page: 'ContactPage',
		translationKey: 'contactPage',
		index: true,
		changefreq: 'monthly',
		priority: '0.8',
	},
	{
		path: '/privacy-policy',
		page: 'PrivacyPolicyPage',
		translationKey: 'privacyPolicyPage',
		index: false,
	},
	{
		path: '/quote-thank-you',
		page: 'QuoteThankYouPage',
		translationKey: 'quoteThankYouPage',
		index: false,
		// Only reachable with router state from a successful submit, and it
		// redirects otherwise — prerendering it would just capture the redirect.
		prerender: false,
	},
];

/** `/solutions` is kept so old links don't 404; it canonicalises to `/`. */
export const aliases = [{ path: '/solutions', page: 'SolutionsPage', canonical: '/' }];

/** `/services` in Hebrew is `/he/services`; `/` in Hebrew is `/he`. */
export function localizedPath(routePath, language) {
	const prefix = LANG_PREFIX[language] ?? '';
	if (routePath === '/') return prefix || '/';
	return `${prefix}${routePath}`;
}

/** Splits an incoming pathname into its language and its unprefixed route. */
export function parsePath(pathname) {
	const clean = pathname.replace(/\/+$/, '') || '/';
	if (clean === '/he') return { language: 'he', routePath: '/' };
	if (clean.startsWith('/he/')) return { language: 'he', routePath: clean.slice(3) || '/' };
	return { language: 'en', routePath: clean };
}

/** Absolute URL for a route in a given language. */
export function absoluteUrl(routePath, language = DEFAULT_LANGUAGE) {
	return `${SITE_URL}${localizedPath(routePath, language)}`;
}

/** Every indexable (path, language) pair — used by the sitemap and prerender. */
export function indexableUrls() {
	const out = [];
	for (const route of routes) {
		if (!route.index) continue;
		for (const language of LANGUAGES) {
			out.push({ ...route, language, url: absoluteUrl(route.path, language) });
		}
	}
	return out;
}

/** Every route that should be written to disk at build time, indexable or not. */
export function prerenderPaths() {
	const out = [];
	for (const route of [...routes, ...aliases]) {
		if (route.prerender === false) continue;
		for (const language of LANGUAGES) {
			out.push(localizedPath(route.path, language));
		}
	}
	return [...new Set(out)];
}

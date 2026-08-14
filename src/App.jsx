import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import AccessibilityWidget from '@/components/AccessibilityWidget';
import WhatsAppButton from '@/components/WhatsAppButton';
import MobileCtaBar from '@/components/MobileCtaBar';
import { LanguageProvider } from '@/context/LanguageContext';
import { LANGUAGES, localizedPath, routes, aliases } from '@/lib/site-routes';
import { trackPageView } from '@/lib/analytics';

const PAGES = {
	SolutionsPage: lazy(() => import('@/pages/SolutionsPage')),
	AboutPage: lazy(() => import('@/pages/AboutPage')),
	ServicesPage: lazy(() => import('@/pages/ServicesPage')),
	ContactPage: lazy(() => import('@/pages/ContactPage')),
	QuotePage: lazy(() => import('@/pages/QuotePage')),
	QuoteThankYouPage: lazy(() => import('@/pages/QuoteThankYouPage')),
	FAQPage: lazy(() => import('@/pages/FAQPage')),
	BlogPage: lazy(() => import('@/pages/BlogPage')),
	PrivacyPolicyPage: lazy(() => import('@/pages/PrivacyPolicyPage')),
	NotFoundPage: lazy(() => import('@/pages/NotFoundPage')),
};

/**
 * Resets scroll on navigation and reports the pageview.
 *
 * GA4 previously saw one hit per session because `gtag('config')` fires
 * once on load and client-side navigations send nothing. Every route change
 * now reports, after a tick so react-helmet has swapped document.title.
 */
const RouteChangeEffects = () => {
	const { pathname, hash } = useLocation();

	useEffect(() => {
		if (hash) return; // let the browser handle in-page anchors
		window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
	}, [pathname, hash]);

	useEffect(() => {
		const id = window.setTimeout(() => trackPageView(pathname), 60);
		return () => window.clearTimeout(id);
	}, [pathname]);

	return null;
};

const PageFallback = () => (
	<div className="flex min-h-[60vh] items-center justify-center" role="status">
		<div
			className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary/25 border-t-primary"
			aria-hidden="true"
		/>
		<span className="sr-only">Loading</span>
	</div>
);

/** Builds the full route tree once per language, so /he/* mirrors /*. */
const localizedRoutes = () =>
	LANGUAGES.flatMap((language) => [
		...routes.map((route) => {
			const Page = PAGES[route.page];
			return (
				<Route
					key={`${language}-${route.path}`}
					path={localizedPath(route.path, language)}
					element={<Page />}
				/>
			);
		}),
		...aliases.map((alias) => {
			const Page = PAGES[alias.page];
			return (
				<Route
					key={`${language}-alias-${alias.path}`}
					path={localizedPath(alias.path, language)}
					element={<Page />}
				/>
			);
		}),
	]);

function App() {
	return (
		<LanguageProvider>
			<a
				href="#main-content"
				className="sr-only rounded-full bg-primary px-5 py-2.5 font-display font-bold text-primary-foreground focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:shadow-glow"
			>
				Skip to content
			</a>

			{/* No width cap here any more — each Section carries its own
			    Container, which is what lets a section span the full viewport. */}
			<div className="flex min-h-screen flex-col bg-background text-foreground">
				<Header />
				<main id="main-content" className="flex-grow pb-24 md:pb-0">
					<RouteChangeEffects />
					<Suspense fallback={<PageFallback />}>
						<Routes>
							{localizedRoutes()}
							<Route path="*" element={<PAGES.NotFoundPage />} />
						</Routes>
					</Suspense>
				</main>
				<Footer />
			</div>

			<Toaster />
			<CookieBanner />
			<AccessibilityWidget />
			<WhatsAppButton />
			<MobileCtaBar />
		</LanguageProvider>
	);
}

export default App;

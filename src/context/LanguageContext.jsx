import React, { createContext, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import translationsData from '@/lib/translations';
import { parsePath, localizedPath } from '@/lib/site-routes';
import { track } from '@/lib/analytics';

export const LanguageContext = createContext();

/**
 * Language is derived from the URL, not from localStorage.
 *
 * Previously it was a localStorage toggle, which meant Hebrew had no address
 * of its own: every hreflang alternate pointed at the same URL and half the
 * site's content could never be indexed or linked to. Hebrew now lives under
 * /he/*, so the URL is the single source of truth.
 *
 * Reading from the URL instead of localStorage also makes this component
 * render identically on the server, which is what lets the build prerender
 * every page to static HTML.
 */
export const LanguageProvider = ({ children }) => {
	const location = useLocation();
	const navigate = useNavigate();

	const { language, routePath } = useMemo(
		() => parsePath(location.pathname),
		[location.pathname],
	);

	useEffect(() => {
		if (typeof document === 'undefined') return;
		document.documentElement.lang = language;
		document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
	}, [language]);

	/** Swaps to the other language while staying on the same page. */
	const toggleLanguage = useCallback(() => {
		const next = language === 'en' ? 'he' : 'en';
		track.languageToggled(next);
		navigate(localizedPath(routePath, next) + location.search + location.hash);
	}, [language, routePath, navigate, location.search, location.hash]);

	/** Prefixes an app path with the current language. Use for every link. */
	const localize = useCallback((path) => localizedPath(path, language), [language]);

	const value = useMemo(
		() => ({
			language,
			routePath,
			toggleLanguage,
			localize,
			isRtl: language === 'he',
			dir: language === 'he' ? 'rtl' : 'ltr',
			translations: translationsData[language],
		}),
		[language, routePath, toggleLanguage, localize],
	);

	return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

/** Convenience hook — saves the useContext(LanguageContext) boilerplate. */
export const useLanguage = () => {
	const ctx = React.useContext(LanguageContext);
	if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
	return ctx;
};

import React from 'react';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/context/LanguageContext';
import { SITE_URL, absoluteUrl } from '@/lib/site-routes';

const OG_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * Per-page head tags, in one place.
 *
 * Every page used to hand-write its own Helmet block, and they drifted:
 * some had canonical links, some didn't; the thank-you and 404 pages were
 * missing noindex; hreflang was declared once in index.html with all three
 * alternates pointing at the same URL.
 *
 * `routePath` is the unprefixed path (e.g. '/services'); the language
 * prefix is applied here so canonical and alternates stay correct in both
 * languages.
 */
export const Seo = ({
	title,
	description,
	routePath,
	jsonLd,
	noindex = false,
	image = OG_IMAGE,
	type = 'website',
}) => {
	const { language } = useLanguage();
	const canonical = absoluteUrl(routePath, language);

	return (
		<Helmet>
			<html lang={language} dir={language === 'he' ? 'rtl' : 'ltr'} />
			<title>{title}</title>
			<meta name="description" content={description} />
			<link rel="canonical" href={canonical} />

			{noindex && <meta name="robots" content="noindex, follow" />}

			{/* Each language has a real, distinct URL to point at. */}
			{!noindex && <link rel="alternate" hrefLang="en" href={absoluteUrl(routePath, 'en')} />}
			{!noindex && <link rel="alternate" hrefLang="he" href={absoluteUrl(routePath, 'he')} />}
			{!noindex && (
				<link rel="alternate" hrefLang="x-default" href={absoluteUrl(routePath, 'en')} />
			)}

			<meta property="og:type" content={type} />
			<meta property="og:site_name" content="Naftali's Solutions" />
			<meta property="og:url" content={canonical} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={image} />
			<meta property="og:locale" content={language === 'he' ? 'he_IL' : 'en_US'} />
			<meta
				property="og:locale:alternate"
				content={language === 'he' ? 'en_US' : 'he_IL'}
			/>

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={image} />

			{jsonLd && (
				<script type="application/ld+json">
					{JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])}
				</script>
			)}
		</Helmet>
	);
};

export default Seo;

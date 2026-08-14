/**
 * Conversion measurement.
 *
 * Before this, GA4 fired exactly one pageview per session — `gtag('config')`
 * ran once on load and React Router navigations sent nothing — and there were
 * zero events. Form submits, plan selections, WhatsApp taps and calls were all
 * invisible, so no page could be credited with earning work.
 *
 * Consent Mode still gates storage; index.html sets analytics_storage to
 * denied by default and CookieBanner grants it. Calls made before consent are
 * held by gtag and either replayed or dropped according to that choice.
 */

const MEASUREMENT_ID = 'G-ZYLG43XD1J';

const hasGtag = () => typeof window !== 'undefined' && typeof window.gtag === 'function';

/** Fires on every route change, including the first render. */
export function trackPageView(path, title) {
	if (!hasGtag()) return;
	window.gtag('event', 'page_view', {
		page_path: path,
		page_title: title || (typeof document !== 'undefined' ? document.title : undefined),
		page_location: typeof window !== 'undefined' ? window.location.href : undefined,
		send_to: MEASUREMENT_ID,
	});
}

export function trackEvent(name, params = {}) {
	if (!hasGtag()) return;
	window.gtag('event', name, params);
}

/* ---------------------------------------------------------------------------
   Named events. Keeping them in one place means the names stay consistent
   between the components that fire them and the reports that read them.
   ------------------------------------------------------------------------ */

export const track = {
	ctaClick: (label, location) => trackEvent('cta_click', { cta_label: label, cta_location: location }),

	planSelected: (planName, planPrice) =>
		trackEvent('select_plan', { plan_name: planName, plan_price: planPrice }),

	/** Lead captured — the event that matters. Mark this as a GA4 key event. */
	leadSubmitted: (source, planName) =>
		trackEvent('generate_lead', { lead_source: source, plan_name: planName || 'none' }),

	leadFailed: (source, reason) =>
		trackEvent('lead_failed', { lead_source: source, failure_reason: reason }),

	formStarted: (source) => trackEvent('form_start', { form_source: source }),

	whatsappClick: (location) => trackEvent('whatsapp_click', { click_location: location }),

	phoneClick: (location) => trackEvent('phone_click', { click_location: location }),

	emailClick: (location) => trackEvent('email_click', { click_location: location }),

	languageToggled: (to) => trackEvent('language_toggle', { language: to }),

	faqOpened: (question) => trackEvent('faq_open', { faq_question: question }),
};

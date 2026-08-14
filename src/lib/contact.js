/**
 * Contact details, in one place.
 *
 * The phone number and WhatsApp deep link were previously duplicated across
 * Footer, MobileCtaBar, WhatsAppButton and ContactPage — and on the contact
 * page itself they rendered as plain text rather than tap-to-call links.
 */

export const CONTACT = {
	phoneE164: '+972527073229',
	phoneDisplay: '052-707-3229',
	email: 'naftalissolutions@gmail.com',
	whatsappNumber: '972527073229',

	/** Deep link with a prefilled message, encoded for both languages. */
	whatsappUrl(message = '') {
		const base = `https://wa.me/${this.whatsappNumber}`;
		return message ? `${base}?text=${encodeURIComponent(message)}` : base;
	},
};

export default CONTACT;

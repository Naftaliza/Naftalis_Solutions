import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { CONTACT } from '@/lib/contact';
import { track } from '@/lib/analytics';

/**
 * Anchored to the inline-start edge, so it mirrors to the right in Hebrew
 * instead of sitting in the same physical corner in both directions.
 */
const WhatsAppButton = () => {
	const { translations } = useLanguage();

	return (
		<a
			href={CONTACT.whatsappUrl(translations.whatsappWidget.message)}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={translations.whatsappWidget.ariaLabel}
			onClick={() => track.whatsappClick('floating_button')}
			className="fixed bottom-24 start-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#04310f] shadow-lift transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background md:bottom-6"
		>
			<MessageCircle size={26} aria-hidden="true" />
		</a>
	);
};

export default WhatsAppButton;

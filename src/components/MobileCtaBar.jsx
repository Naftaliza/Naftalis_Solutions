import React from 'react';
import { NavLink } from 'react-router-dom';
import { Phone, MessageCircle, CalendarCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { CONTACT } from '@/lib/contact';
import { track } from '@/lib/analytics';

const MobileCtaBar = () => {
	const { translations, localize, dir } = useLanguage();
	const t = translations.mobileCta;

	const itemClass =
		'flex flex-col items-center justify-center gap-1 py-2.5 text-muted-foreground transition-colors active:bg-accent';

	return (
		<div
			dir={dir}
			className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
		>
			<a
				href={`tel:${CONTACT.phoneE164}`}
				onClick={() => track.phoneClick('mobile_bar')}
				className={itemClass}
			>
				<Phone size={18} aria-hidden="true" />
				<span className="text-xs font-medium">{t.call}</span>
			</a>
			<a
				href={CONTACT.whatsappUrl(translations.whatsappWidget.message)}
				target="_blank"
				rel="noopener noreferrer"
				onClick={() => track.whatsappClick('mobile_bar')}
				className={`${itemClass} border-x border-border`}
			>
				<MessageCircle size={18} aria-hidden="true" />
				<span className="text-xs font-medium">{t.whatsapp}</span>
			</a>
			<NavLink
				to={localize('/quote')}
				onClick={() => track.ctaClick('mobile_bar_quote', 'mobile_bar')}
				className={`${itemClass} font-semibold text-primary`}
			>
				<CalendarCheck size={18} aria-hidden="true" />
				<span className="text-xs">{t.quote}</span>
			</NavLink>
		</div>
	);
};

export default MobileCtaBar;

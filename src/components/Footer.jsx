import React from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, Phone, MessageCircle, MapPin, Clock } from 'lucide-react';
import { Container } from '@/components/ui/section';
import { BrandLockup } from '@/components/BrandMark';
import { StatusDot } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';
import { track } from '@/lib/analytics';
import { CONTACT } from '@/lib/contact';

const Footer = () => {
	const { translations, localize, dir } = useLanguage();
	const t = translations.footer;
	const year = new Date().getFullYear();

	const columns = [
		{
			heading: t.solutionsHeading,
			links: [
				{ to: '/services#scheduling', label: translations.servicesPage.cards.scheduling.title },
				{ to: '/services#whatsapp', label: translations.servicesPage.cards.whatsapp.title },
				{ to: '/services#dashboards', label: translations.servicesPage.cards.dashboards.title },
				{ to: '/quote', label: t.pricing },
			],
		},
		{
			heading: t.companyHeading,
			links: [
				{ to: '/about', label: translations.header.about },
				{ to: '/faq', label: translations.header.faq },
				{ to: '/blog', label: t.blog },
				{ to: '/contact', label: translations.header.contact },
			],
		},
	];

	return (
		<footer dir={dir} className="relative mt-auto border-t border-border bg-card/40">
			<Container className="py-14 sm:py-16">
				<div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
					{/* Brand */}
					<div className="flex flex-col gap-5">
						<NavLink to={localize('/')} aria-label={translations.header.brand}>
							<BrandLockup label={translations.header.brand} />
						</NavLink>
						<p className="max-w-xs leading-relaxed text-muted-foreground">{t.tagline}</p>
						<p className="flex items-center gap-2 text-sm text-muted-foreground">
							<MapPin size={15} className="shrink-0 text-primary" aria-hidden="true" />
							{t.location}
						</p>
						<p className="flex items-center gap-2 text-sm font-medium text-foreground">
							<StatusDot />
							{t.availability}
						</p>
					</div>

					{/* Link columns */}
					{columns.map((column) => (
						<nav key={column.heading} aria-label={column.heading} className="flex flex-col gap-4">
							<h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-foreground">
								{column.heading}
							</h2>
							<ul className="flex flex-col gap-2.5">
								{column.links.map((link) => (
									<li key={link.to}>
										<NavLink
											to={localize(link.to)}
											className="text-sm text-muted-foreground transition-colors hover:text-primary"
										>
											{link.label}
										</NavLink>
									</li>
								))}
							</ul>
						</nav>
					))}

					{/* Direct contact — real links, not plain text. */}
					<div className="flex flex-col gap-4">
						<h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-foreground">
							{t.contactHeading}
						</h2>
						<ul className="flex flex-col gap-3">
							<li>
								<a
									href={CONTACT.whatsappUrl(translations.whatsappWidget.message)}
									target="_blank"
									rel="noopener noreferrer"
									onClick={() => track.whatsappClick('footer')}
									className="group flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
								>
									<MessageCircle size={16} className="shrink-0 text-primary" aria-hidden="true" />
									{t.whatsappLabel}
								</a>
							</li>
							<li>
								<a
									href={`tel:${CONTACT.phoneE164}`}
									onClick={() => track.phoneClick('footer')}
									dir="ltr"
									className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
								>
									<Phone size={16} className="shrink-0 text-primary" aria-hidden="true" />
									{CONTACT.phoneDisplay}
								</a>
							</li>
							<li>
								<a
									href={`mailto:${CONTACT.email}`}
									onClick={() => track.emailClick('footer')}
									className="flex items-center gap-3 break-all text-sm text-muted-foreground transition-colors hover:text-primary"
								>
									<Mail size={16} className="shrink-0 text-primary" aria-hidden="true" />
									{CONTACT.email}
								</a>
							</li>
							<li className="flex items-center gap-3 text-sm text-muted-foreground">
								<Clock size={16} className="shrink-0 text-primary" aria-hidden="true" />
								{t.hours}
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
					<p className="text-sm text-muted-foreground">
						© {year} {translations.header.brand}. {t.rights}
					</p>
					<NavLink
						to={localize('/privacy-policy')}
						className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
					>
						{t.privacy}
					</NavLink>
				</div>
			</Container>
		</footer>
	);
};

export default Footer;

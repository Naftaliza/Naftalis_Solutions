import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MessageCircle, BarChart2, Check, Settings } from 'lucide-react';

import Seo from '@/components/Seo';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardIcon } from '@/components/ui/card';
import { Section, Eyebrow } from '@/components/ui/section';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/reveal';
import { BookingMockup, WhatsAppMockup, DashboardMockup } from '@/components/mockups/ProductMockups';
import { useLanguage } from '@/context/LanguageContext';
import { track } from '@/lib/analytics';
import { SITE_URL } from '@/lib/site-routes';

const ServicesPage = () => {
	const { translations, localize, dir } = useLanguage();
	const t = translations.servicesPage;

	const services = [
		{
			id: 'scheduling',
			icon: <Calendar size={26} aria-hidden="true" />,
			visual: <BookingMockup />,
			...t.cards.scheduling,
		},
		{
			id: 'whatsapp',
			icon: <MessageCircle size={26} aria-hidden="true" />,
			visual: <WhatsAppMockup />,
			...t.cards.whatsapp,
		},
		{
			id: 'dashboards',
			icon: <BarChart2 size={26} aria-hidden="true" />,
			visual: <DashboardMockup />,
			...t.cards.dashboards,
		},
	];

	const jsonLd = services.map((service) => ({
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: service.title,
		description: service.description,
		provider: { '@type': 'ProfessionalService', name: "Naftali's Solutions", url: SITE_URL },
		areaServed: { '@type': 'Country', name: 'Israel' },
	}));

	return (
		<>
			<Seo
				title={t.meta.title}
				description={t.meta.description}
				routePath="/services"
				jsonLd={jsonLd}
			/>

			<div dir={dir}>
				<PageHero
					title1={t.hero.title1}
					title2={t.hero.title2}
					subtitle={t.hero.subtitle}
				/>

				{/* Each service gets its own anchor so the homepage cards can deep
				    link straight to it. `scroll-mt` clears the sticky header. */}
				<Section spacing="default">
					<div className="flex flex-col gap-20 sm:gap-28">
						{services.map((service, i) => (
							<div
								key={service.id}
								id={service.id}
								className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-16"
							>
								<Reveal className={i % 2 === 1 ? 'lg:order-last' : undefined}>
									<CardIcon className="mb-6">{service.icon}</CardIcon>
									<h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
										{service.title}
									</h2>
									<p className="mb-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
										{service.description}
									</p>
									<ul className="mb-8 flex flex-col gap-3">
										{service.features.map((feature) => (
											<li key={feature} className="flex items-start gap-3">
												<span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
													<Check size={12} aria-hidden="true" />
												</span>
												<span className="text-foreground">{feature}</span>
											</li>
										))}
									</ul>
									<Link to={localize('/contact')}>
										<Button
											onClick={() => track.ctaClick(`service_${service.id}_inquire`, 'services')}
										>
											{t.inquireNow}
											<ArrowRight size={16} className="dir-flip" aria-hidden="true" />
										</Button>
									</Link>
								</Reveal>

								<Reveal delay={0.1} aria-hidden="true">
									<div className="relative">
										<div className="absolute -inset-6 -z-10 rounded-full bg-primary/10 blur-3xl" />
										{service.visual}
									</div>
								</Reveal>
							</div>
						))}
					</div>
				</Section>

				{/* Custom work */}
				<Section glow className="border-t border-border">
					<Card variant="glass" className="overflow-hidden">
						<CardBody className="gap-8 p-8 sm:p-12 lg:flex-row lg:items-center lg:gap-16">
							<Reveal className="flex-1">
								<Eyebrow className="mb-5">{t.custom.tag}</Eyebrow>
								<h2 className="mb-4 text-display-sm font-bold text-foreground">
									{t.custom.title}
								</h2>
								<p className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
									{t.custom.description}
								</p>
								<Link to={localize('/contact')}>
									<Button
										size="lg"
										onClick={() => track.ctaClick('custom_project', 'services')}
									>
										{t.custom.button}
										<ArrowRight size={18} className="dir-flip" aria-hidden="true" />
									</Button>
								</Link>
							</Reveal>

							<Reveal delay={0.1} className="flex-1" aria-hidden="true">
								<RevealGroup className="grid grid-cols-2 gap-3">
									{[
										'Booking rules',
										'Payments',
										'Reminders',
										'Integrations',
										'Reporting',
										'Automations',
									].map((label, i) => (
										<RevealItem key={label}>
											<div
												className={`flex h-20 items-center justify-center rounded-xl border border-border text-center font-display text-sm font-semibold ${
													i % 3 === 0
														? 'bg-primary/12 text-primary'
														: 'bg-foreground/[0.04] text-muted-foreground'
												}`}
											>
												{label}
											</div>
										</RevealItem>
									))}
								</RevealGroup>
								<div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
									<Settings size={15} className="text-primary" aria-hidden="true" />
									{t.custom.tag}
								</div>
							</Reveal>
						</CardBody>
					</Card>
				</Section>
			</div>
		</>
	);
};

export default ServicesPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
	ArrowRight,
	Calendar,
	MessageCircle,
	BarChart2,
	PhoneOff,
	CalendarX,
	HelpCircle,
	Check,
	User,
	Clock3,
	Unlock,
	Database,
} from 'lucide-react';

import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Badge, StatusDot } from '@/components/ui/badge';
import { Card, CardBody, CardTitle, CardText, CardIcon } from '@/components/ui/card';
import { Section, Container, SectionHeading, Eyebrow } from '@/components/ui/section';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/reveal';
import { BookingMockup, WhatsAppMockup, DashboardMockup } from '@/components/mockups/ProductMockups';
import { useLanguage } from '@/context/LanguageContext';
import { track } from '@/lib/analytics';
import { CONTACT } from '@/lib/contact';
import { SITE_URL, absoluteUrl } from '@/lib/site-routes';
import { fadeUp, slideInX, EASE_OUT } from '@/lib/motion';
import founderImg from '@/img/1753517099229.jpg';

const SolutionsPage = () => {
	const { language, translations, localize, dir } = useLanguage();
	const t = translations.solutionsPage;
	const reduced = useReducedMotion();

	const solutions = [
		{
			id: 'scheduling',
			icon: <Calendar size={26} aria-hidden="true" />,
			...t.cards.scheduling,
			visual: <BookingMockup />,
		},
		{
			id: 'whatsapp',
			icon: <MessageCircle size={26} aria-hidden="true" />,
			...t.cards.whatsapp,
			visual: <WhatsAppMockup />,
		},
		{
			id: 'dashboards',
			icon: <BarChart2 size={26} aria-hidden="true" />,
			...t.cards.dashboards,
			visual: <DashboardMockup />,
		},
	];

	const problemIcons = [PhoneOff, CalendarX, HelpCircle];
	const promiseIcons = [User, Clock3, Unlock, Database];

	const plans = [
		{ key: 'basic', ...translations.quotePage.plans.basic },
		{ key: 'standard', ...translations.quotePage.plans.standard, popular: true },
		{ key: 'premium', ...translations.quotePage.plans.premium },
	];

	const faqTop = translations.faqPage.categories.flatMap((c) => c.items).slice(0, 4);

	/* Structured data. LocalBusiness and WebSite are new; the Organization
	   block was the site's only schema before this. */
	const jsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'ProfessionalService',
			'@id': `${SITE_URL}/#business`,
			name: "Naftali's Solutions",
			url: SITE_URL,
			email: CONTACT.email,
			telephone: CONTACT.phoneE164,
			description: t.meta.description,
			image: `${SITE_URL}/og-image.png`,
			priceRange: '₪₪',
			founder: { '@type': 'Person', name: 'Naftali' },
			areaServed: { '@type': 'Country', name: 'Israel' },
			address: { '@type': 'PostalAddress', addressLocality: 'Tel Aviv', addressCountry: 'IL' },
			availableLanguage: ['en', 'he'],
			hasOfferCatalog: {
				'@type': 'OfferCatalog',
				name: 'Solutions',
				itemListElement: solutions.map((s) => ({
					'@type': 'Offer',
					itemOffered: { '@type': 'Service', name: s.title, description: s.description },
				})),
			},
		},
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			'@id': `${SITE_URL}/#website`,
			url: SITE_URL,
			name: "Naftali's Solutions",
			inLanguage: language,
		},
	];

	return (
		<>
			<Seo
				title={t.meta.title}
				description={t.meta.description}
				routePath="/"
				jsonLd={jsonLd}
			/>

			<div dir={dir}>
				{/* ============================ 1 · HERO ============================ */}
				<Section glow spacing="none" className="overflow-hidden pb-16 pt-10 sm:pb-24 sm:pt-16">
					<div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
						<motion.div
							initial={reduced ? false : 'hidden'}
							animate="show"
							variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
							className="flex flex-col items-start gap-6"
						>
							<motion.div variants={fadeUp}>
								<Badge variant="glass" size="lg" className="gap-2">
									<StatusDot />
									{t.hero.eyebrow}
								</Badge>
							</motion.div>

							<motion.h1
								variants={fadeUp}
								className="text-display font-extrabold text-foreground"
							>
								{t.hero.title1}{' '}
								<span className="gradient-text">{t.hero.title2}</span>
							</motion.h1>

							<motion.p
								variants={fadeUp}
								className="max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
							>
								{t.hero.subtitle}
							</motion.p>

							<motion.div variants={fadeUp} className="flex flex-wrap gap-3">
								<Link to={localize('/quote')}>
									<Button
										size="lg"
										onClick={() => track.ctaClick('hero_primary', 'home_hero')}
									>
										{t.hero.ctaExplore}
										<ArrowRight size={18} className="dir-flip" aria-hidden="true" />
									</Button>
								</Link>
								<a
									href={CONTACT.whatsappUrl(translations.whatsappWidget.message)}
									target="_blank"
									rel="noopener noreferrer"
									onClick={() => track.whatsappClick('home_hero')}
								>
									<Button size="lg" variant="glass">
										<MessageCircle size={18} aria-hidden="true" />
										{t.hero.ctaQuote}
									</Button>
								</a>
							</motion.div>

							<motion.p
								variants={fadeUp}
								className="text-sm text-muted-foreground"
							>
								{t.hero.trustLine}
							</motion.p>
						</motion.div>

						{/* Hero visual */}
						<motion.div
							initial={reduced ? false : { opacity: 0, scale: 0.96, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.15, ease: EASE_OUT }}
							className="relative mx-auto w-full max-w-md lg:max-w-none"
							aria-hidden="true"
						>
							<div className="absolute -inset-8 -z-10 rounded-full bg-primary/12 blur-3xl" />
							<BookingMockup />
							<motion.div
								initial={reduced ? false : { opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.7, ease: EASE_OUT }}
								className="absolute -bottom-6 -end-4 w-[62%] sm:-end-8"
							>
								<WhatsAppMockup />
							</motion.div>
						</motion.div>
					</div>
				</Section>

				{/* ========================= 2 · AUDIENCE ========================= */}
				<Section spacing="tight" className="border-y border-border bg-card/30">
					<Reveal className="flex flex-col items-center gap-6">
						<p className="text-center font-display text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
							{t.audience.title}
						</p>
						<ul className="flex flex-wrap items-center justify-center gap-2.5">
							{t.audience.items.map((item) => (
								<li key={item}>
									<Badge variant="muted" size="lg" className="font-medium">
										{item}
									</Badge>
								</li>
							))}
						</ul>
					</Reveal>
				</Section>

				{/* ========================= 3 · PROBLEMS ========================= */}
				<Section texture>
					<SectionHeading
						eyebrow={t.problems.eyebrow}
						title={t.problems.title}
						subtitle={t.problems.subtitle}
					/>
					<RevealGroup className="mt-14 grid gap-6 md:grid-cols-3">
						{t.problems.items.map((item, i) => {
							const Icon = problemIcons[i];
							return (
								<RevealItem key={item.title}>
									<Card variant="outline" className="h-full">
										<CardBody>
											<CardIcon className="border-destructive/25 bg-destructive/10 text-destructive">
												<Icon size={24} aria-hidden="true" />
											</CardIcon>
											<CardTitle className="mb-3 text-lg">{item.title}</CardTitle>
											<CardText className="text-[0.95rem]">{item.body}</CardText>
										</CardBody>
									</Card>
								</RevealItem>
							);
						})}
					</RevealGroup>
				</Section>

				{/* ======================== 4 · SOLUTIONS ======================== */}
				<Section glow>
					<SectionHeading
						eyebrow={t.solutions.eyebrow}
						title={t.solutions.title}
						subtitle={t.solutions.subtitle}
					/>

					<div className="mt-16 flex flex-col gap-16 sm:gap-24">
						{solutions.map((solution, i) => (
							<div
								key={solution.id}
								className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
							>
								<Reveal
									variants={slideInX(i % 2 === 0 ? language : language === 'he' ? 'en' : 'he')}
									className={cnOrder(i)}
								>
									<CardIcon className="mb-6">{solution.icon}</CardIcon>
									<h3 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
										{solution.title}
									</h3>
									<p className="mb-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
										{solution.description}
									</p>
									{/* Deep-links to this specific service — the old cards all
									    pointed at the top of /services regardless of which one
									    was clicked. */}
									<Link to={localize(`/services#${solution.id}`)}>
										<Button
											variant="outline"
											onClick={() => track.ctaClick(`solution_${solution.id}`, 'home_solutions')}
										>
											{translations.learnMore}
											<ArrowRight size={16} className="dir-flip" aria-hidden="true" />
										</Button>
									</Link>
								</Reveal>

								<Reveal
									delay={0.1}
									className={i % 2 === 1 ? 'lg:order-first' : undefined}
									aria-hidden="true"
								>
									<div className="relative">
										<div className="absolute -inset-6 -z-10 rounded-full bg-primary/10 blur-3xl" />
										{solution.visual}
									</div>
								</Reveal>
							</div>
						))}
					</div>
				</Section>

				{/* ====================== 5 · HOW IT WORKS ====================== */}
				<Section className="border-y border-border bg-card/30">
					<SectionHeading
						eyebrow={t.howItWorks.eyebrow}
						title={t.howItWorks.title}
						subtitle={t.howItWorks.subtitle}
					/>
					{/* Numbered because this genuinely is a sequence. */}
					<RevealGroup as="ol" className="mt-14 grid gap-6 md:grid-cols-3">
						{t.howItWorks.steps.map((step, i) => (
							<RevealItem as="li" key={step.title}>
								<Card variant="glass" className="h-full" interactive spotlight>
									<CardBody>
										<span className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-primary/12 font-display text-lg font-bold tnum text-primary">
											{i + 1}
										</span>
										<CardTitle className="mb-3 text-lg">{step.title}</CardTitle>
										<CardText className="text-[0.95rem]">{step.body}</CardText>
									</CardBody>
								</Card>
							</RevealItem>
						))}
					</RevealGroup>
				</Section>

				{/* ========================= 6 · PROMISE ========================= */}
				<Section>
					<SectionHeading eyebrow={t.promise.eyebrow} title={t.promise.title} />
					<RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2">
						{t.promise.items.map((item, i) => {
							const Icon = promiseIcons[i];
							return (
								<RevealItem key={item.title}>
									<Card variant="solid" className="h-full" interactive>
										<CardBody className="flex-row gap-5">
											<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/12 text-primary">
												<Icon size={20} aria-hidden="true" />
											</span>
											<div>
												<CardTitle className="mb-2 text-lg">{item.title}</CardTitle>
												<CardText className="text-[0.95rem]">{item.body}</CardText>
											</div>
										</CardBody>
									</Card>
								</RevealItem>
							);
						})}
					</RevealGroup>
				</Section>

				{/* ====================== 7 · PRICING PREVIEW ====================== */}
				<Section glow className="border-y border-border">
					<SectionHeading
						eyebrow={t.pricingPreview.eyebrow}
						title={t.pricingPreview.title}
						subtitle={t.pricingPreview.subtitle}
					/>
					<RevealGroup className="mt-14 grid gap-6 lg:grid-cols-3">
						{plans.map((plan) => (
							<RevealItem key={plan.key}>
								<Card
									variant={plan.popular ? 'primary' : 'glass'}
									interactive
									className={`h-full ${plan.popular ? 'lg:-translate-y-3 shadow-glow' : ''}`}
								>
									<CardBody>
										{plan.popular && (
											<Badge variant="solid" className="mb-4 self-start">
												{t.pricingPreview.popular}
											</Badge>
										)}
										<h3 className="font-display text-lg font-bold text-foreground">
											{plan.name}
										</h3>
										<p className="mb-5 mt-1 text-sm text-muted-foreground">
											{plan.description}
										</p>
										<p className="mb-6 flex items-baseline gap-1.5">
											<span className="font-display text-4xl font-extrabold tnum text-foreground">
												{plan.price}
											</span>
											{plan.period && (
												<span className="text-sm text-muted-foreground">{plan.period}</span>
											)}
										</p>
										<ul className="mb-7 flex flex-col gap-2.5">
											{plan.features.map((feature) => (
												<li key={feature} className="flex items-start gap-2.5 text-sm">
													<Check
														size={16}
														className="mt-0.5 shrink-0 text-primary"
														aria-hidden="true"
													/>
													<span className="text-muted-foreground">{feature}</span>
												</li>
											))}
										</ul>
										<Link to={localize('/quote')} className="mt-auto">
											<Button
												variant={plan.popular ? 'default' : 'outline'}
												className="w-full"
												onClick={() => track.planSelected(plan.name, plan.price)}
											>
												{t.pricingPreview.cta}
											</Button>
										</Link>
									</CardBody>
								</Card>
							</RevealItem>
						))}
					</RevealGroup>
				</Section>

				{/* ========================= 8 · FOUNDER ========================= */}
				<Section>
					<div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
						<Reveal className="mx-auto w-full max-w-xs lg:max-w-none">
							<div className="relative">
								<div className="absolute -inset-5 -z-10 rounded-full bg-primary/15 blur-3xl" />
								<img
									src={founderImg}
									alt={translations.aboutPage.founder.alt}
									width={480}
									height={480}
									loading="lazy"
									decoding="async"
									className="aspect-square w-full rounded-3xl border border-border object-cover shadow-lift"
								/>
							</div>
						</Reveal>

						<Reveal delay={0.1} className="flex flex-col items-start gap-5">
							<Eyebrow>{t.founderSection.eyebrow}</Eyebrow>
							<h2 className="text-display-sm font-bold text-foreground">
								{t.founderSection.title}
							</h2>
							<p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
								{t.founderSection.body}
							</p>
							<Link to={localize('/about')}>
								<Button variant="outline">
									{t.founderSection.cta}
									<ArrowRight size={16} className="dir-flip" aria-hidden="true" />
								</Button>
							</Link>
						</Reveal>
					</div>
				</Section>

				{/* ======================== 9 · FAQ TEASER ======================== */}
				<Section spacing="tight" className="border-y border-border bg-card/30">
					<SectionHeading eyebrow={t.faqTeaser.eyebrow} title={t.faqTeaser.title} />
					<RevealGroup className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
						{faqTop.map((item) => (
							<RevealItem key={item.q}>
								<Card variant="outline" className="h-full">
									<CardBody className="gap-2 p-6">
										<h3 className="font-display text-base font-semibold text-foreground">
											{item.q}
										</h3>
										<p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
											{item.a}
										</p>
									</CardBody>
								</Card>
							</RevealItem>
						))}
					</RevealGroup>
					<Reveal className="mt-10 flex justify-center">
						<Link to={localize('/faq')}>
							<Button variant="outline">
								{t.faqTeaser.cta}
								<ArrowRight size={16} className="dir-flip" aria-hidden="true" />
							</Button>
						</Link>
					</Reveal>
				</Section>

				{/* ======================== 10 · FINAL CTA ======================== */}
				<Section glow spacing="loose">
					<Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
						<h2 className="text-display-sm font-bold text-foreground">{t.finalCta.title}</h2>
						<p className="text-lg leading-relaxed text-muted-foreground">
							{t.finalCta.subtitle}
						</p>
						<div className="mt-2 flex flex-wrap justify-center gap-3">
							<Link to={localize('/contact')}>
								<Button
									size="lg"
									onClick={() => track.ctaClick('final_cta', 'home_footer_cta')}
								>
									{t.finalCta.primary}
									<ArrowRight size={18} className="dir-flip" aria-hidden="true" />
								</Button>
							</Link>
							<a
								href={CONTACT.whatsappUrl(translations.whatsappWidget.message)}
								target="_blank"
								rel="noopener noreferrer"
								onClick={() => track.whatsappClick('home_final_cta')}
							>
								<Button size="lg" variant="glass">
									<MessageCircle size={18} aria-hidden="true" />
									{t.finalCta.secondary}
								</Button>
							</a>
						</div>
					</Reveal>
				</Section>
			</div>
		</>
	);
};

/** Alternating sides put the copy second on odd rows at large sizes. */
const cnOrder = (i) => (i % 2 === 1 ? 'lg:order-last' : undefined);

export default SolutionsPage;

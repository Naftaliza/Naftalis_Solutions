import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Zap, Target, ArrowRight, MessageCircle } from 'lucide-react';

import Seo from '@/components/Seo';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardTitle, CardText, CardIcon } from '@/components/ui/card';
import { Section, SectionHeading } from '@/components/ui/section';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/reveal';
import { useLanguage } from '@/context/LanguageContext';
import { track } from '@/lib/analytics';
import { CONTACT } from '@/lib/contact';
import founderImg from '@/img/1753517099229.jpg';

const AboutPage = () => {
	const { translations, localize, dir } = useLanguage();
	const t = translations.aboutPage;

	const values = [
		{ icon: Users, ...t.values.cards.customer },
		{ icon: Zap, ...t.values.cards.simplicity },
		{ icon: Target, ...t.values.cards.impact },
	];

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		mainEntity: {
			'@type': 'Person',
			name: 'Naftali',
			jobTitle: 'Founder',
			worksFor: { '@type': 'Organization', name: "Naftali's Solutions" },
		},
	};

	return (
		<>
			<Seo
				title={t.meta.title}
				description={t.meta.description}
				routePath="/about"
				jsonLd={jsonLd}
			/>

			<div dir={dir}>
				<PageHero title1={t.hero.title1} title2={t.hero.title2} subtitle={t.hero.subtitle} />

				{/* Founder */}
				<Section spacing="default">
					<div className="grid items-center gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
						<Reveal className="mx-auto w-full max-w-xs lg:max-w-none">
							<div className="relative">
								<div className="absolute -inset-5 -z-10 rounded-full bg-primary/15 blur-3xl" />
								<img
									src={founderImg}
									alt={t.founder.alt}
									width={480}
									height={480}
									loading="lazy"
									decoding="async"
									className="aspect-square w-full rounded-3xl border border-border object-cover shadow-lift"
								/>
							</div>
						</Reveal>

						<Reveal delay={0.1}>
							<Card variant="glass">
								<CardBody className="gap-5">
									<h2 className="text-2xl font-bold text-foreground sm:text-3xl">
										{t.founder.title}
									</h2>
									<blockquote className="border-s-2 border-primary/50 ps-5 text-lg leading-relaxed text-muted-foreground">
										{t.founder.quote}
									</blockquote>
									<p className="font-display font-semibold text-foreground">{t.founder.name}</p>
								</CardBody>
							</Card>
						</Reveal>
					</div>
				</Section>

				{/* Values */}
				<Section glow className="border-y border-border">
					<SectionHeading title={t.values.title} subtitle={t.values.subtitle} />
					<RevealGroup className="mt-14 grid gap-6 md:grid-cols-3">
						{values.map((value) => (
							<RevealItem key={value.title}>
								<Card variant="glass" className="h-full" interactive spotlight>
									<CardBody>
										<CardIcon>
											<value.icon size={24} aria-hidden="true" />
										</CardIcon>
										<CardTitle className="mb-3 text-lg">{value.title}</CardTitle>
										<CardText className="text-[0.95rem]">{value.description}</CardText>
									</CardBody>
								</Card>
							</RevealItem>
						))}
					</RevealGroup>
				</Section>

				{/* CTA */}
				<Section spacing="default">
					<Reveal>
						<Card variant="primary" className="overflow-hidden">
							<CardBody className="items-center gap-6 p-10 text-center sm:p-16">
								<h2 className="text-display-sm font-bold text-foreground">{t.cta.title}</h2>
								<p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
									{t.cta.subtitle}
								</p>
								<div className="mt-2 flex flex-wrap justify-center gap-3">
									<Link to={localize('/contact')}>
										<Button size="lg" onClick={() => track.ctaClick('about_cta', 'about')}>
											{t.cta.button}
											<ArrowRight size={18} className="dir-flip" aria-hidden="true" />
										</Button>
									</Link>
									<a
										href={CONTACT.whatsappUrl(translations.whatsappWidget.message)}
										target="_blank"
										rel="noopener noreferrer"
										onClick={() => track.whatsappClick('about')}
									>
										<Button size="lg" variant="glass">
											<MessageCircle size={18} aria-hidden="true" />
											{translations.solutionsPage.finalCta.secondary}
										</Button>
									</a>
								</div>
							</CardBody>
						</Card>
					</Reveal>
				</Section>
			</div>
		</>
	);
};

export default AboutPage;

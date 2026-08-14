import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, MessageCircle } from 'lucide-react';

import Seo from '@/components/Seo';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/reveal';
import { useLanguage } from '@/context/LanguageContext';
import { track } from '@/lib/analytics';
import { CONTACT } from '@/lib/contact';
import { SITE_URL } from '@/lib/site-routes';

const QuotePage = () => {
	const { language, translations, localize, dir } = useLanguage();
	const t = translations.quotePage;

	/* Plans come from translations only. A second hard-coded `rawPlans` object
	   used to live here purely to build the prefilled contact message, so
	   editing a price in translations.js silently desynced the email body. */
	const plans = [
		{ key: 'basic', ...t.plans.basic },
		{ key: 'standard', ...t.plans.standard, popular: true },
		{ key: 'premium', ...t.plans.premium },
	];

	/* Real prices deserve Offer markup — this is what lets a price appear
	   directly in a search result. */
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: "Naftali's Solutions — Business Automation",
		description: t.meta.description,
		brand: { '@type': 'Brand', name: "Naftali's Solutions" },
		offers: plans
			.filter((plan) => /\d/.test(plan.price))
			.map((plan) => ({
				'@type': 'Offer',
				name: plan.name,
				description: plan.description,
				price: plan.price.replace(/[^\d.]/g, ''),
				priceCurrency: language === 'he' ? 'ILS' : 'USD',
				availability: 'https://schema.org/InStock',
				url: `${SITE_URL}/quote`,
			})),
	};

	return (
		<>
			<Seo
				title={t.meta.title}
				description={t.meta.description}
				routePath="/quote"
				jsonLd={jsonLd}
			/>

			<div dir={dir}>
				<PageHero
					title1={t.hero.title1}
					title2={t.hero.title2}
					subtitle={t.hero.subtitle}
				/>

				<Section spacing="default">
					<RevealGroup className="grid items-stretch gap-6 lg:grid-cols-3">
						{plans.map((plan) => (
							<RevealItem key={plan.key}>
								<Card
									variant={plan.popular ? 'primary' : 'glass'}
									interactive
									spotlight
									className={`h-full ${plan.popular ? 'shadow-glow lg:-translate-y-4' : ''}`}
								>
									<CardBody>
										{plan.popular && (
											<Badge variant="solid" className="mb-4 self-start">
												{t.popular}
											</Badge>
										)}

										<h2 className="font-display text-2xl font-bold text-foreground">
											{plan.name}
										</h2>
										<p className="mt-2 text-muted-foreground">{plan.description}</p>

										<p className="mt-7 flex items-baseline gap-1.5">
											<span className="font-display text-5xl font-extrabold tnum text-foreground">
												{plan.price}
											</span>
											{plan.period && (
												<span className="text-lg font-medium text-muted-foreground">
													{plan.period}
												</span>
											)}
										</p>

										<ul className="mt-8 flex flex-grow flex-col gap-3.5">
											{plan.features.map((feature) => (
												<li key={feature} className="flex items-start gap-3">
													{/* `gap-3` rather than the old `ml-3`, which never
													    flipped and collided with Hebrew text. */}
													<span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
														<Check size={12} aria-hidden="true" />
													</span>
													<span className="text-foreground">{feature}</span>
												</li>
											))}
										</ul>

										{/* Straight to the form. The old flow inserted a
										    celebration page here, before any lead existed. */}
										<Link
											to={localize('/contact')}
											state={{ selectedPlan: plan }}
											className="mt-8"
										>
											<Button
												size="lg"
												variant={plan.popular ? 'default' : 'outline'}
												className="w-full"
												onClick={() => track.planSelected(plan.name, plan.price)}
											>
												{t.ctaButton}
												<ArrowRight size={18} className="dir-flip" aria-hidden="true" />
											</Button>
										</Link>
									</CardBody>
								</Card>
							</RevealItem>
						))}
					</RevealGroup>
				</Section>

				<Section glow spacing="tight" className="border-t border-border">
					<Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
						<h2 className="text-2xl font-bold text-foreground sm:text-3xl">
							{translations.solutionsPage.finalCta.title}
						</h2>
						<p className="text-muted-foreground">
							{translations.solutionsPage.finalCta.subtitle}
						</p>
						<a
							href={CONTACT.whatsappUrl(translations.whatsappWidget.message)}
							target="_blank"
							rel="noopener noreferrer"
							onClick={() => track.whatsappClick('quote')}
							className="mt-2"
						>
							<Button variant="glass" size="lg">
								<MessageCircle size={18} aria-hidden="true" />
								{translations.solutionsPage.finalCta.secondary}
							</Button>
						</a>
					</Reveal>
				</Section>
			</div>
		</>
	);
};

export default QuotePage;

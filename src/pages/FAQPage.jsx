import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';

import Seo from '@/components/Seo';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from '@/components/ui/accordion';
import { useLanguage } from '@/context/LanguageContext';
import { track } from '@/lib/analytics';
import { CONTACT } from '@/lib/contact';

const FAQPage = () => {
	const { translations, localize, dir } = useLanguage();
	const t = translations.faqPage;
	const [activeTab, setActiveTab] = useState(t.categories[0].key);

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: t.categories.flatMap((cat) =>
			cat.items.map((item) => ({
				'@type': 'Question',
				name: item.q,
				acceptedAnswer: { '@type': 'Answer', text: item.a },
			})),
		),
	};

	return (
		<>
			<Seo
				title={t.meta.title}
				description={t.meta.description}
				routePath="/faq"
				jsonLd={jsonLd}
			/>

			<div dir={dir}>
				<PageHero
					title1={t.hero.title1}
					title2={t.hero.title2}
					subtitle={t.hero.subtitle}
				/>

				<Section spacing="default">
					<div className="mx-auto max-w-3xl">
						<Tabs value={activeTab} onValueChange={setActiveTab}>
							<div className="mb-8 flex justify-center">
								<TabsList>
									{t.categories.map((cat) => (
										<TabsTrigger key={cat.key} value={cat.key}>
											{cat.label}
										</TabsTrigger>
									))}
								</TabsList>
							</div>

							{t.categories.map((cat) => (
								<TabsContent key={cat.key} value={cat.key}>
									<Card variant="glass">
										<CardBody className="p-2 sm:p-4">
											<Accordion type="single" collapsible className="px-4">
												{cat.items.map((item, i) => (
													<AccordionItem
														key={i}
														value={`${cat.key}-${i}`}
														className={i === cat.items.length - 1 ? 'border-b-0' : undefined}
													>
														<AccordionTrigger onClick={() => track.faqOpened(item.q)}>
															{item.q}
														</AccordionTrigger>
														<AccordionContent>{item.a}</AccordionContent>
													</AccordionItem>
												))}
											</Accordion>
										</CardBody>
									</Card>
								</TabsContent>
							))}
						</Tabs>
					</div>
				</Section>

				{/* The FAQ was a dead end — a reader finished and had nowhere to go. */}
				<Section glow spacing="tight" className="border-t border-border">
					<Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
						<h2 className="text-2xl font-bold text-foreground sm:text-3xl">
							{translations.solutionsPage.finalCta.title}
						</h2>
						<p className="text-muted-foreground">
							{translations.solutionsPage.finalCta.subtitle}
						</p>
						<div className="mt-2 flex flex-wrap justify-center gap-3">
							<Link to={localize('/contact')}>
								<Button onClick={() => track.ctaClick('faq_cta', 'faq')}>
									{translations.solutionsPage.finalCta.primary}
									<ArrowRight size={16} className="dir-flip" aria-hidden="true" />
								</Button>
							</Link>
							<a
								href={CONTACT.whatsappUrl(translations.whatsappWidget.message)}
								target="_blank"
								rel="noopener noreferrer"
								onClick={() => track.whatsappClick('faq')}
							>
								<Button variant="glass">
									<MessageCircle size={16} aria-hidden="true" />
									{translations.solutionsPage.finalCta.secondary}
								</Button>
							</a>
						</div>
					</Reveal>
				</Section>
			</div>
		</>
	);
};

export default FAQPage;

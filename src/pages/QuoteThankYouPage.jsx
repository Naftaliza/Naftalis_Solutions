import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { Check, ArrowRight, MessageCircle } from 'lucide-react';

import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { useLanguage } from '@/context/LanguageContext';
import { CONTACT } from '@/lib/contact';
import { track } from '@/lib/analytics';

/**
 * Reached only AFTER the contact form succeeds.
 *
 * It used to sit between picking a plan and filling in the form — a
 * celebration that fired before any lead existed, so anyone who dropped
 * here was counted as nothing. Now it confirms a real submission and sets
 * expectations for the reply.
 */
const QuoteThankYouPage = () => {
	const { translations, localize, dir } = useLanguage();
	const location = useLocation();
	const t = translations.quoteThankYouPage;

	if (!location.state?.leadSubmitted) {
		return <Navigate to={localize('/contact')} replace />;
	}

	const { planName } = location.state;

	return (
		<>
			<Seo
				title={t.meta.title}
				description={t.meta.description}
				routePath="/quote-thank-you"
				noindex
			/>

			<div dir={dir}>
				<Section glow spacing="loose">
					<Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
						<span className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-primary/12 text-primary shadow-glow">
							<Check size={38} aria-hidden="true" />
						</span>

						<h1 className="text-display-sm font-extrabold text-foreground">{t.hero.title}</h1>
						<p className="text-lg leading-relaxed text-muted-foreground">{t.hero.subtitle}</p>

						{planName && (
							<p className="text-sm text-muted-foreground">
								{t.planLine.replace('{planName}', planName)}
							</p>
						)}

						<Card variant="glass" className="mt-4 w-full text-start">
							<CardBody className="gap-5">
								<h2 className="font-display text-lg font-bold text-foreground">
									{t.next.title}
								</h2>
								<ol className="flex flex-col gap-4">
									{t.next.steps.map((step, i) => (
										<li key={i} className="flex items-start gap-3.5">
											<span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/12 font-display text-sm font-bold tnum text-primary">
												{i + 1}
											</span>
											<span className="leading-relaxed text-muted-foreground">{step}</span>
										</li>
									))}
								</ol>
							</CardBody>
						</Card>

						<div className="mt-4 flex flex-col items-center gap-3">
							<p className="text-sm text-muted-foreground">{t.whatsappPrompt}</p>
							<a
								href={CONTACT.whatsappUrl(translations.whatsappWidget.message)}
								target="_blank"
								rel="noopener noreferrer"
								onClick={() => track.whatsappClick('thank_you')}
							>
								<Button variant="glass">
									<MessageCircle size={16} aria-hidden="true" />
									{t.whatsappCta}
								</Button>
							</a>
						</div>

						<Link to={localize('/')} className="mt-2">
							<Button variant="ghost">
								{t.ctaButton}
								<ArrowRight size={16} className="dir-flip" aria-hidden="true" />
							</Button>
						</Link>
					</Reveal>
				</Section>
			</div>
		</>
	);
};

export default QuoteThankYouPage;

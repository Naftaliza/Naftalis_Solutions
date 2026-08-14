import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFoundPage() {
	const { translations, localize, dir } = useLanguage();
	const t = translations.notFoundPage;

	const links = [
		{ to: '/services', label: translations.header.services },
		{ to: '/quote', label: translations.header.pricing },
		{ to: '/faq', label: translations.header.faq },
		{ to: '/contact', label: translations.header.contact },
	];

	return (
		<>
			<Seo
				title={t.meta.title}
				description={t.meta.description}
				routePath="/"
				noindex
			/>

			<div dir={dir}>
				<Section glow spacing="loose">
					<Reveal className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
						<p className="gradient-text font-display text-8xl font-extrabold tnum sm:text-9xl">
							{t.heading}
						</p>
						<h1 className="text-2xl font-bold text-foreground sm:text-3xl">{t.title}</h1>
						<p className="text-muted-foreground">{t.subtitle}</p>

						<Link to={localize('/')} className="mt-3">
							<Button size="lg">
								{t.button}
								<ArrowRight size={18} className="dir-flip" aria-hidden="true" />
							</Button>
						</Link>

						{/* A 404 that offers somewhere to go beats one that just apologises. */}
						<ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
							{links.map((link) => (
								<li key={link.to}>
									<Link
										to={localize(link.to)}
										className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</Reveal>
				</Section>
			</div>
		</>
	);
}

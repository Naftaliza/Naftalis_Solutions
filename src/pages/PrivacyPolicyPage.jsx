import React from 'react';
import Seo from '@/components/Seo';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { useLanguage } from '@/context/LanguageContext';

const PrivacyPolicyPage = () => {
	const { translations, dir } = useLanguage();
	const t = translations.privacyPolicyPage;

	return (
		<>
			<Seo
				title={t.meta.title}
				description={t.meta.description}
				routePath="/privacy-policy"
				noindex
			/>

			<div dir={dir}>
				<Section spacing="default" container="narrow">
					<Reveal className="mb-12 flex flex-col gap-4">
						<h1 className="text-display-sm font-extrabold text-foreground">{t.hero.title}</h1>
						<p className="text-lg text-muted-foreground">{t.hero.subtitle}</p>
					</Reveal>

					<div className="flex flex-col gap-10">
						{t.sections.map((section, i) => (
							<Reveal key={i} className="flex flex-col gap-3">
								<h2 className="text-xl font-bold text-foreground sm:text-2xl">
									{section.heading}
								</h2>
								<p className="max-w-prose leading-relaxed text-muted-foreground">
									{section.body}
								</p>
							</Reveal>
						))}
					</div>
				</Section>
			</div>
		</>
	);
};

export default PrivacyPolicyPage;

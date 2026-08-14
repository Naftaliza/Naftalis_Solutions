import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, MessageCircle } from 'lucide-react';

import Seo from '@/components/Seo';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { useLanguage } from '@/context/LanguageContext';
import { track } from '@/lib/analytics';
import { CONTACT } from '@/lib/contact';
import { SITE_URL, absoluteUrl } from '@/lib/site-routes';

const BlogPage = () => {
	const { language, translations, localize, dir } = useLanguage();
	const t = translations.blogPage;

	/* BlogPosting markup — the posts had no article schema at all before. */
	const jsonLd = t.posts.map((post) => ({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.excerpt,
		inLanguage: language,
		mainEntityOfPage: `${absoluteUrl('/blog', language)}#${post.slug}`,
		author: { '@type': 'Person', name: 'Naftali' },
		publisher: {
			'@type': 'Organization',
			name: "Naftali's Solutions",
			logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
		},
	}));

	return (
		<>
			<Seo
				title={t.meta.title}
				description={t.meta.description}
				routePath="/blog"
				type="article"
				jsonLd={jsonLd}
			/>

			<div dir={dir}>
				<PageHero title1={t.hero.title1} title2={t.hero.title2} subtitle={t.hero.subtitle} />

				<Section spacing="default">
					<div className="mx-auto flex max-w-3xl flex-col gap-10">
						{t.posts.map((post) => (
							<Reveal as="article" key={post.slug} id={post.slug} className="scroll-mt-28">
								<Card variant="glass">
									<CardBody className="gap-5 sm:p-10">
										<Badge variant="muted" size="sm" className="self-start">
											<Clock size={12} aria-hidden="true" />
											{post.readTime}
										</Badge>

										<h2 className="text-2xl font-bold text-foreground sm:text-3xl">
											{post.title}
										</h2>
										<p className="text-lg italic text-muted-foreground">{post.excerpt}</p>

										<div className="flex flex-col gap-5">
											{post.content.map((block, i) => (
												<div key={i} className="flex flex-col gap-2">
													{block.heading && (
														<h3 className="font-display text-lg font-semibold text-foreground">
															{block.heading}
														</h3>
													)}
													<p className="leading-relaxed text-muted-foreground">{block.body}</p>
												</div>
											))}
										</div>

										{/* Each post ends somewhere now — both articles used to
										    finish with no next step at all. */}
										<div className="mt-2 flex flex-wrap gap-3 border-t border-border pt-6">
											<Link to={localize('/contact')}>
												<Button
													size="sm"
													onClick={() => track.ctaClick(`blog_${post.slug}`, 'blog')}
												>
													{translations.solutionsPage.finalCta.primary}
													<ArrowRight size={15} className="dir-flip" aria-hidden="true" />
												</Button>
											</Link>
											<Link to={localize('/services')}>
												<Button size="sm" variant="outline">
													{translations.header.services}
												</Button>
											</Link>
										</div>
									</CardBody>
								</Card>
							</Reveal>
						))}
					</div>
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
							onClick={() => track.whatsappClick('blog')}
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

export default BlogPage;

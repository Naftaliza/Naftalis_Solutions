import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, Mail, Phone, MapPin, Loader2, MessageCircle, Clock } from 'lucide-react';
import emailjs from '@emailjs/browser';

import Seo from '@/components/Seo';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { Field, Input, Textarea } from '@/components/ui/field';
import { Badge, StatusDot } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { track } from '@/lib/analytics';
import { CONTACT } from '@/lib/contact';

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '', company: '' };

const ContactPage = () => {
	const { toast } = useToast();
	const { language, translations, localize, dir } = useLanguage();
	const t = translations.contactPage;
	const form = useRef();
	const location = useLocation();
	const navigate = useNavigate();

	const [isSending, setIsSending] = useState(false);
	const [formData, setFormData] = useState(EMPTY);
	const [errors, setErrors] = useState({});
	const [hasStarted, setHasStarted] = useState(false);

	const selectedPlan = location.state?.selectedPlan;

	/* Prefill from a chosen plan. The plan object now comes straight from
	   translations — there is no separate `raw` copy to fall out of sync. */
	useEffect(() => {
		if (!selectedPlan) return;

		const subject =
			language === 'he'
				? `בקשת הצעת מחיר: ${selectedPlan.name}`
				: `Quote Request: ${selectedPlan.name} Plan`;

		const priceInfo = /\d/.test(selectedPlan.price)
			? `${selectedPlan.price}${selectedPlan.period}`
			: language === 'he'
				? 'מחיר מותאם אישית'
				: 'Custom pricing';

		const messageBody =
			language === 'he'
				? `שלום,\n\nאני מעוניין/ת בחבילת "${selectedPlan.name}" (${priceInfo}).\n\nספרו לי קצת על העסק שלכם:\n`
				: `Hello,\n\nI'm interested in the "${selectedPlan.name}" plan (${priceInfo}).\n\nA little about my business:\n`;

		setFormData((prev) => ({ ...prev, subject, message: messageBody }));
	}, [selectedPlan, language]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));

		if (!hasStarted) {
			setHasStarted(true);
			track.formStarted(selectedPlan ? 'quote_plan' : 'contact_direct');
		}
	};

	const validate = () => {
		const newErrors = {};
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!formData.name.trim()) newErrors.name = t.form.errors.nameRequired;
		if (!formData.email.trim()) {
			newErrors.email = t.form.errors.emailRequired;
		} else if (!emailRegex.test(formData.email.trim())) {
			newErrors.email = t.form.errors.emailInvalid;
		}
		if (!formData.subject.trim()) newErrors.subject = t.form.errors.subjectRequired;
		if (!formData.message.trim()) newErrors.message = t.form.errors.messageRequired;

		setErrors(newErrors);

		// Move focus to the first problem so the error is actually announced.
		const firstError = Object.keys(newErrors)[0];
		if (firstError) {
			document.getElementById(firstError)?.focus();
		}

		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// Honeypot: only bots tend to fill this in.
		if (formData.company) return;
		if (!validate()) return;

		setIsSending(true);

		const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
		const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
		const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

		const isPlaceholder = (value, placeholder) => !value || value === placeholder;

		if (
			isPlaceholder(serviceId, 'YOUR_SERVICE_ID') ||
			isPlaceholder(templateId, 'YOUR_TEMPLATE_ID') ||
			isPlaceholder(publicKey, 'YOUR_PUBLIC_KEY')
		) {
			// Translated, and phrased for a customer rather than leaking setup
			// instructions. The old copy was English-only and mentioned EmailJS.
			toast({
				variant: 'destructive',
				title: t.toast.unavailableTitle,
				description: t.toast.unavailableDescription,
			});
			track.leadFailed('contact_form', 'not_configured');
			setIsSending(false);
			return;
		}

		const fullMessage =
			language === 'he'
				? `שם: ${formData.name}\nאימייל: ${formData.email}\nטלפון: ${formData.phone || '—'}\n\n${formData.message}`
				: `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || '—'}\n\n${formData.message}`;

		emailjs
			.send(
				serviceId,
				templateId,
				{
					from_name: formData.name,
					from_email: formData.email,
					phone: formData.phone,
					subject: formData.subject,
					message: fullMessage,
				},
				publicKey,
			)
			.then(
				() => {
					track.leadSubmitted('contact_form', selectedPlan?.name);
					setFormData(EMPTY);
					setErrors({});
					// Confirmation now happens after the lead exists, not before.
					navigate(localize('/quote-thank-you'), {
						state: { leadSubmitted: true, planName: selectedPlan?.name },
					});
				},
				(error) => {
					console.error('Contact form send failed:', error?.text || error);
					track.leadFailed('contact_form', 'send_error');
					toast({
						variant: 'destructive',
						title: t.toast.errorTitle,
						description: t.toast.errorDescription,
					});
				},
			)
			.finally(() => setIsSending(false));
	};

	const contactMethods = [
		{
			icon: MessageCircle,
			label: translations.footer.whatsappLabel,
			value: CONTACT.phoneDisplay,
			href: CONTACT.whatsappUrl(translations.whatsappWidget.message),
			external: true,
			onClick: () => track.whatsappClick('contact_page'),
		},
		{
			icon: Phone,
			label: t.info.call.label,
			value: CONTACT.phoneDisplay,
			href: `tel:${CONTACT.phoneE164}`,
			onClick: () => track.phoneClick('contact_page'),
		},
		{
			icon: Mail,
			label: t.info.email.label,
			value: CONTACT.email,
			href: `mailto:${CONTACT.email}`,
			onClick: () => track.emailClick('contact_page'),
		},
	];

	return (
		<>
			<Seo title={t.meta.title} description={t.meta.description} routePath="/contact" />

			<div dir={dir}>
				<PageHero title1={t.hero.title1} title2={t.hero.title2} subtitle={t.hero.subtitle} />

				<Section spacing="default">
					<div className="grid items-start gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
						{/* Form */}
						<Reveal>
							<Card variant="glass">
								<CardBody className="gap-6">
									<div className="flex flex-wrap items-center justify-between gap-3">
										<h2 className="text-2xl font-bold text-foreground">{t.form.title}</h2>
										{selectedPlan && (
											<Badge variant="default">{selectedPlan.name}</Badge>
										)}
									</div>

									<form ref={form} onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
										{/* Honeypot — sr-only rather than a negative offset, which
										    could land inside the viewport in RTL. */}
										<div className="sr-only" aria-hidden="true">
											<label htmlFor="company">Company</label>
											<input
												type="text"
												name="company"
												id="company"
												tabIndex="-1"
												autoComplete="off"
												value={formData.company}
												onChange={handleInputChange}
											/>
										</div>

										<div className="grid gap-5 sm:grid-cols-2">
											<Field id="name" label={t.form.name} error={errors.name} required>
												<Input
													name="name"
													autoComplete="name"
													value={formData.name}
													onChange={handleInputChange}
												/>
											</Field>
											<Field id="email" label={t.form.email} error={errors.email} required>
												<Input
													type="email"
													name="email"
													autoComplete="email"
													dir="ltr"
													value={formData.email}
													onChange={handleInputChange}
												/>
											</Field>
										</div>

										<Field id="phone" label={t.form.phone}>
											<Input
												type="tel"
												name="phone"
												autoComplete="tel"
												dir="ltr"
												value={formData.phone}
												onChange={handleInputChange}
											/>
										</Field>

										<Field id="subject" label={t.form.subject} error={errors.subject} required>
											<Input
												name="subject"
												value={formData.subject}
												onChange={handleInputChange}
											/>
										</Field>

										<Field id="message" label={t.form.message} error={errors.message} required>
											<Textarea
												name="message"
												rows="7"
												value={formData.message}
												onChange={handleInputChange}
											/>
										</Field>

										<Button type="submit" size="lg" className="w-full" disabled={isSending}>
											{isSending ? (
												<>
													<Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
													<span className="sr-only">…</span>
												</>
											) : (
												<>
													<Send size={18} className="dir-flip" aria-hidden="true" />
													{t.form.button}
												</>
											)}
										</Button>
									</form>
								</CardBody>
							</Card>
						</Reveal>

						{/* Direct contact — every one of these is a real link now. The
						    old page rendered the phone number and email as plain text. */}
						<Reveal delay={0.1} className="flex flex-col gap-6">
							<Card variant="solid">
								<CardBody className="gap-6">
									<h2 className="text-xl font-bold text-foreground">{t.info.title}</h2>

									<ul className="flex flex-col gap-3">
										{contactMethods.map((method) => (
											<li key={method.label}>
												<a
													href={method.href}
													onClick={method.onClick}
													{...(method.external
														? { target: '_blank', rel: 'noopener noreferrer' }
														: {})}
													className="group flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
												>
													<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/12 text-primary">
														<method.icon size={19} aria-hidden="true" />
													</span>
													<span className="min-w-0">
														<span className="block font-display text-sm font-semibold text-foreground">
															{method.label}
														</span>
														<span
															className="block truncate text-sm text-muted-foreground"
															dir="ltr"
														>
															{method.value}
														</span>
													</span>
												</a>
											</li>
										))}
									</ul>

									<div className="flex flex-col gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
										<p className="flex items-center gap-2.5">
											<MapPin size={15} className="shrink-0 text-primary" aria-hidden="true" />
											{t.info.location.value}
										</p>
										<p className="flex items-center gap-2.5">
											<Clock size={15} className="shrink-0 text-primary" aria-hidden="true" />
											{translations.footer.hours}
										</p>
										<p className="flex items-center gap-2.5 font-medium text-foreground">
											<StatusDot />
											{translations.footer.availability}
										</p>
									</div>
								</CardBody>
							</Card>
						</Reveal>
					</div>
				</Section>
			</div>
		</>
	);
};

export default ContactPage;

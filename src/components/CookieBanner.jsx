import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/section';
import { useLanguage } from '@/context/LanguageContext';

export default function CookieBanner() {
	const { translations, localize, dir } = useLanguage();
	const t = translations.cookieBanner;
	const [visible, setVisible] = useState(false);
	const reduced = useReducedMotion();

	useEffect(() => {
		const consent = window.localStorage.getItem('cookie_consent');
		if (!consent) setVisible(true);
		if (consent === 'accepted') enableAnalytics();
	}, []);

	function enableAnalytics() {
		if (typeof window.gtag === 'function') {
			window.gtag('consent', 'update', { analytics_storage: 'granted' });
		}
	}

	function choose(decision) {
		window.localStorage.setItem('cookie_consent', decision);
		if (decision === 'accepted') enableAnalytics();
		setVisible(false);
	}

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					initial={reduced ? { opacity: 0 } : { y: 90, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={reduced ? { opacity: 0 } : { y: 90, opacity: 0 }}
					transition={{ type: 'spring', stiffness: 260, damping: 28 }}
					role="dialog"
					aria-label="Cookie consent"
					dir={dir}
					className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-popover/95 backdrop-blur-xl"
				>
					<Container className="flex flex-col items-center gap-4 py-4 sm:flex-row sm:justify-between">
						<p className="max-w-2xl text-sm text-muted-foreground">
							{t.message}{' '}
							<NavLink
								to={localize('/privacy-policy')}
								className="text-primary underline underline-offset-4 hover:brightness-110"
							>
								{t.policy}
							</NavLink>
						</p>
						<div className="flex shrink-0 gap-2.5">
							<Button variant="ghost" size="sm" onClick={() => choose('declined')}>
								{t.decline}
							</Button>
							<Button size="sm" onClick={() => choose('accepted')}>
								{t.accept}
							</Button>
						</div>
					</Container>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

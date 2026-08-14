import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/section';
import { BrandLockup } from '@/components/BrandMark';
import { useLanguage } from '@/context/LanguageContext';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const { language, toggleLanguage, translations, localize, dir } = useLanguage();
	const location = useLocation();
	const reduced = useReducedMotion();

	const panelRef = useRef(null);
	const triggerRef = useRef(null);

	const navLinks = [
		{ to: '/services', label: translations.header.services },
		{ to: '/quote', label: translations.header.pricing || translations.header.getQuote },
		{ to: '/about', label: translations.header.about },
		{ to: '/faq', label: translations.header.faq },
		{ to: '/contact', label: translations.header.contact },
	];

	/* Header gains a border and a denser background once you leave the top. */
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	/* Close on navigation. Previously the menu only closed via an onClick on
	   each link, so any other navigation left it hanging open. */
	useEffect(() => {
		setIsMenuOpen(false);
	}, [location.pathname]);

	/* Escape to close, and lock the page behind the panel while it's open. */
	useEffect(() => {
		if (!isMenuOpen) return undefined;

		const onKeyDown = (event) => {
			if (event.key === 'Escape') {
				setIsMenuOpen(false);
				triggerRef.current?.focus();
				return;
			}
			if (event.key !== 'Tab' || !panelRef.current) return;

			// Focus trap: keep Tab cycling inside the open panel.
			const focusables = panelRef.current.querySelectorAll(
				'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
			);
			if (!focusables.length) return;
			const first = focusables[0];
			const last = focusables[focusables.length - 1];

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		document.addEventListener('keydown', onKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener('keydown', onKeyDown);
		};
	}, [isMenuOpen]);

	const handleToggleLanguage = useCallback(() => {
		setIsMenuOpen(false);
		toggleLanguage();
	}, [toggleLanguage]);

	const linkClass = ({ isActive }) =>
		cn(
			'relative py-1 font-display text-[0.95rem] font-medium transition-colors duration-300',
			isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
		);

	const NavItem = ({ to, label }) => (
		<NavLink to={localize(to)} className={linkClass} end={to === '/'}>
			{({ isActive }) => (
				<>
					{label}
					{isActive && (
						<motion.span
							layoutId={reduced ? undefined : 'nav-underline'}
							className="absolute -bottom-1 start-0 h-[2px] w-full rounded-full bg-primary"
						/>
					)}
				</>
			)}
		</NavLink>
	);

	return (
		<motion.header
			initial={reduced ? false : { y: -80, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
			dir={dir}
			className={cn(
				'sticky top-0 z-50 w-full transition-[background-color,border-color,backdrop-filter] duration-300',
				scrolled
					? 'border-b border-border bg-background/80 backdrop-blur-xl'
					: 'border-b border-transparent bg-transparent',
			)}
		>
			<Container>
				<div
					className={cn(
						'flex items-center justify-between gap-4 transition-[height] duration-300',
						scrolled ? 'h-16' : 'h-20',
					)}
				>
					<NavLink
						to={localize('/')}
						className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
						aria-label={translations.header.brand}
					>
						<BrandLockup label={translations.header.brand} size={scrolled ? 30 : 34} />
					</NavLink>

					<nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
						{navLinks.map((link) => (
							<NavItem key={link.to} {...link} />
						))}
					</nav>

					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={handleToggleLanguage}
							className="gap-1.5"
							aria-label={
								language === 'en' ? 'החלף לעברית' : 'Switch to English'
							}
						>
							<Languages size={16} aria-hidden="true" />
							<span className="font-bold">{language === 'en' ? 'עב' : 'EN'}</span>
						</Button>

						<NavLink to={localize('/contact')} className="hidden sm:inline-flex">
							<Button
								size="sm"
								onClick={() => track.ctaClick('header_quote', 'header')}
							>
								{translations.header.getQuote}
							</Button>
						</NavLink>

						<Button
							ref={triggerRef}
							variant="glass"
							size="icon-sm"
							className="lg:hidden"
							onClick={() => setIsMenuOpen((open) => !open)}
							aria-expanded={isMenuOpen}
							aria-controls="mobile-menu"
						>
							{isMenuOpen ? <X size={18} /> : <Menu size={18} />}
							<span className="sr-only">
								{isMenuOpen
									? translations.header.closeMenu
									: translations.header.openMenu}
							</span>
						</Button>
					</div>
				</div>
			</Container>

			{/* Wrapped in AnimatePresence so the exit animation actually runs —
			    the old markup declared `exit` with no AnimatePresence parent,
			    so the menu vanished instantly. */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						id="mobile-menu"
						ref={panelRef}
						initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
						animate={reduced ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
						exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
						transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
						className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl lg:hidden"
					>
						<Container>
							<nav
								className="flex flex-col gap-1 py-5"
								aria-label="Mobile"
							>
								{navLinks.map((link) => (
									<NavLink
										key={link.to}
										to={localize(link.to)}
										end={link.to === '/'}
										className={({ isActive }) =>
											cn(
												'rounded-lg px-4 py-3 font-display text-base font-medium transition-colors',
												isActive
													? 'bg-primary/10 text-primary'
													: 'text-muted-foreground hover:bg-accent hover:text-foreground',
											)
										}
									>
										{link.label}
									</NavLink>
								))}
								<NavLink to={localize('/contact')} className="mt-3">
									<Button
										className="w-full"
										onClick={() => track.ctaClick('mobile_menu_quote', 'header')}
									>
										{translations.header.getQuote}
									</Button>
								</NavLink>
							</nav>
						</Container>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.header>
	);
};

export default Header;

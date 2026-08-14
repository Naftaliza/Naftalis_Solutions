import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Eye, Type, Sun, ZoomIn, ZoomOut, RotateCcw, X, Contrast } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'accessibility_prefs';

const defaults = {
	fontSize: 0, // px offset applied to the root size
	contrast: false,
	grayscale: false,
	dyslexia: false,
	highlight: false,
};

function loadPrefs() {
	if (typeof window === 'undefined') return defaults;
	try {
		const saved = window.localStorage.getItem(STORAGE_KEY);
		return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
	} catch {
		return defaults;
	}
}

export default function AccessibilityWidget() {
	const { translations, dir } = useLanguage();
	const t = translations.accessibility;
	const [open, setOpen] = useState(false);
	const [prefs, setPrefs] = useState(defaults);
	const panelRef = useRef(null);
	const triggerRef = useRef(null);
	const reduced = useReducedMotion();

	// Read stored prefs after mount so the component renders identically on
	// the server during prerendering.
	useEffect(() => {
		setPrefs(loadPrefs());
	}, []);

	useEffect(() => {
		const root = document.documentElement;

		/* Root size drives the whole layout because everything is sized in rem.
		   Set as a custom property rather than an inline font-size so a fluid
		   type scale defined in CSS still has something to read. */
		root.style.setProperty('--root-size', `${16 + prefs.fontSize}px`);

		/* These classes redefine design tokens (see index.css). They used to
		   apply `filter: contrast()` / `grayscale()` to <html>, which creates a
		   containing block for every position:fixed descendant and disables
		   backdrop-filter — breaking the sticky header and all four floating
		   overlays whenever a mode was switched on. */
		root.classList.toggle('a11y-contrast', prefs.contrast);
		root.classList.toggle('a11y-grayscale', prefs.grayscale);
		root.classList.toggle('a11y-dyslexia', prefs.dyslexia);
		root.classList.toggle('a11y-highlight', prefs.highlight);

		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
		} catch {
			/* storage unavailable (private mode) — preferences just won't persist */
		}
	}, [prefs]);

	// Escape closes and returns focus to the trigger.
	useEffect(() => {
		if (!open) return undefined;
		const onKeyDown = (event) => {
			if (event.key === 'Escape') {
				setOpen(false);
				triggerRef.current?.focus();
			}
		};
		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [open]);

	const update = (key, value) => setPrefs((prev) => ({ ...prev, [key]: value }));
	const reset = () => setPrefs(defaults);

	const toggles = [
		{ key: 'contrast', label: t.contrast, icon: Contrast },
		{ key: 'grayscale', label: t.grayscale, icon: Sun },
		{ key: 'dyslexia', label: t.dyslexia, icon: Type },
		{ key: 'highlight', label: t.highlight, icon: Eye },
	];

	return (
		<>
			<button
				ref={triggerRef}
				onClick={() => setOpen((o) => !o)}
				aria-label={t.openLabel}
				aria-expanded={open}
				aria-controls="a11y-panel"
				className="fixed bottom-40 end-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-popover text-primary shadow-lift transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:bottom-24"
			>
				<Eye size={20} aria-hidden="true" />
			</button>

			<AnimatePresence>
				{open && (
					<motion.div
						id="a11y-panel"
						ref={panelRef}
						role="dialog"
						aria-label={t.title}
						dir={dir}
						initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
						transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
						className="fixed bottom-56 end-4 z-50 w-[17rem] rounded-2xl border border-border bg-popover p-5 shadow-lift md:bottom-40"
					>
						<div className="mb-4 flex items-center justify-between">
							<h2 className="font-display text-sm font-bold text-foreground">{t.title}</h2>
							<button
								onClick={() => {
									setOpen(false);
									triggerRef.current?.focus();
								}}
								aria-label={t.closeLabel}
								className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
							>
								<X size={15} aria-hidden="true" />
							</button>
						</div>

						<div className="mb-4">
							<p className="mb-2 text-xs font-medium text-muted-foreground">{t.textSize}</p>
							<div className="flex items-center gap-2">
								<button
									onClick={() => update('fontSize', Math.max(prefs.fontSize - 2, -4))}
									aria-label={t.smaller}
									className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
								>
									<ZoomOut size={13} aria-hidden="true" /> {t.smaller}
								</button>
								<button
									onClick={() => update('fontSize', Math.min(prefs.fontSize + 2, 10))}
									aria-label={t.larger}
									className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
								>
									<ZoomIn size={13} aria-hidden="true" /> {t.larger}
								</button>
							</div>
						</div>

						<div className="mb-4 flex flex-col gap-2">
							{toggles.map(({ key, label, icon: Icon }) => (
								<button
									key={key}
									onClick={() => update(key, !prefs[key])}
									aria-pressed={prefs[key]}
									className={cn(
										'flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors',
										prefs[key]
											? 'border-primary/50 bg-primary/12 font-medium text-primary'
											: 'border-border text-muted-foreground hover:bg-accent hover:text-foreground',
									)}
								>
									<span className="flex items-center gap-2">
										<Icon size={14} aria-hidden="true" />
										{label}
									</span>
									<span
										className={cn(
											'h-4 w-4 rounded-full border-2 transition-colors',
											prefs[key] ? 'border-primary bg-primary' : 'border-border',
										)}
										aria-hidden="true"
									/>
								</button>
							))}
						</div>

						<button
							onClick={reset}
							className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
						>
							<RotateCcw size={12} aria-hidden="true" />
							{t.reset}
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

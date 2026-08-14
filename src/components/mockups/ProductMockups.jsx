import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, CheckCheck, TrendingUp, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { VIEWPORT, EASE_OUT } from '@/lib/motion';

/**
 * Product imagery, drawn rather than photographed.
 *
 * The site had exactly one photo and no product screenshots. On a dark
 * ground these read as real UI and cost nothing to keep current — no shoot,
 * no stock, no stale screenshots when the product changes.
 *
 * All three are decorative: `aria-hidden` is set at the call site and the
 * surrounding copy carries the meaning.
 */

const panel = 'relative overflow-hidden rounded-2xl glass-strong shadow-lift';

/* -------------------------------------------------------------------------- */
/* Booking calendar — slots fill in as it scrolls into view                    */
/* -------------------------------------------------------------------------- */

export const BookingMockup = ({ className }) => {
	const { translations } = useLanguage();
	const t = translations.solutionsPage.mockup;
	const reduced = useReducedMotion();

	const slots = [
		{ time: '09:00', state: 'taken' },
		{ time: '10:30', state: 'confirmed' },
		{ time: '12:00', state: 'taken' },
		{ time: '14:00', state: 'open' },
		{ time: '15:30', state: 'open' },
	];

	return (
		<div className={cn(panel, 'p-5 sm:p-6', className)}>
			<div className="mb-5 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="h-2 w-2 rounded-full bg-primary" />
					<span className="font-display text-sm font-semibold text-foreground">{t.today}</span>
				</div>
				<span className="text-xs text-muted-foreground">{t.slotsLeft}</span>
			</div>

			{/* Day strip */}
			<div className="mb-5 grid grid-cols-5 gap-1.5">
				{t.days.map((day, i) => (
					<motion.div
						key={i}
						initial={reduced ? false : { opacity: 0, y: 6 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={VIEWPORT}
						transition={{ delay: 0.05 * i, duration: 0.35, ease: EASE_OUT }}
						className={cn(
							'rounded-lg py-2 text-center font-display text-xs font-semibold',
							i === 2
								? 'bg-primary text-primary-foreground shadow-glow'
								: 'bg-foreground/[0.06] text-muted-foreground',
						)}
					>
						{day}
					</motion.div>
				))}
			</div>

			{/* Slots */}
			<div className="flex flex-col gap-1.5">
				{slots.map((slot, i) => (
					<motion.div
						key={slot.time}
						initial={reduced ? false : { opacity: 0, x: 10 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={VIEWPORT}
						transition={{ delay: 0.25 + 0.08 * i, duration: 0.4, ease: EASE_OUT }}
						className={cn(
							'flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm tnum',
							slot.state === 'confirmed'
								? 'border border-primary/50 bg-primary/15 font-semibold text-primary'
								: slot.state === 'taken'
									? 'bg-foreground/[0.05] text-muted-foreground'
									: 'border border-dashed border-border text-muted-foreground/70',
						)}
					>
						<span dir="ltr">{slot.time}</span>
						{slot.state === 'confirmed' && (
							<span className="flex items-center gap-1 text-xs">
								<Check size={13} aria-hidden="true" />
								{t.confirmed}
							</span>
						)}
					</motion.div>
				))}
			</div>
		</div>
	);
};

/* -------------------------------------------------------------------------- */
/* WhatsApp thread — the auto-reply types itself in                            */
/* -------------------------------------------------------------------------- */

export const WhatsAppMockup = ({ className }) => {
	const { translations } = useLanguage();
	const t = translations.solutionsPage.mockup;
	const reduced = useReducedMotion();

	return (
		<div className={cn(panel, 'flex flex-col gap-3 p-5 sm:p-6', className)}>
			{/* Incoming */}
			<motion.div
				initial={reduced ? false : { opacity: 0, y: 10 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={VIEWPORT}
				transition={{ duration: 0.4, ease: EASE_OUT }}
				className="me-auto max-w-[85%] rounded-2xl rounded-es-md bg-foreground/[0.07] px-4 py-2.5"
			>
				<p className="text-sm leading-snug text-foreground">{t.waMessage}</p>
			</motion.div>

			{/* Outgoing auto-reply */}
			<motion.div
				initial={reduced ? false : { opacity: 0, y: 10 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={VIEWPORT}
				transition={{ delay: 0.55, duration: 0.4, ease: EASE_OUT }}
				className="ms-auto max-w-[85%] rounded-2xl rounded-ee-md bg-[#25D366]/18 px-4 py-2.5 ring-1 ring-[#25D366]/30"
			>
				<p className="text-sm leading-snug text-foreground">{t.waReply}</p>
				<span className="mt-1 flex items-center justify-end gap-1 text-[0.65rem] text-[#25D366]">
					<CheckCheck size={12} aria-hidden="true" />
				</span>
			</motion.div>

			<motion.div
				initial={reduced ? false : { opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={VIEWPORT}
				transition={{ delay: 0.95, duration: 0.4 }}
				className="mx-auto flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1"
			>
				<Sparkles size={11} className="text-primary" aria-hidden="true" />
				<span className="font-display text-[0.68rem] font-semibold text-primary">{t.waAuto}</span>
			</motion.div>
		</div>
	);
};

/* -------------------------------------------------------------------------- */
/* Dashboard — bars grow on reveal                                             */
/* -------------------------------------------------------------------------- */

export const DashboardMockup = ({ className }) => {
	const { translations, isRtl } = useLanguage();
	const t = translations.solutionsPage.mockup;
	const reduced = useReducedMotion();

	// Enough bars that this reads as a chart rather than a row of blocks.
	const bars = [31, 44, 38, 52, 41, 58, 49, 66, 72, 63, 85, 94];

	return (
		<div className={cn(panel, 'p-5 sm:p-6', className)}>
			<div className="mb-5 flex items-start justify-between gap-4">
				<div>
					<p className="text-xs text-muted-foreground">{t.statBookings}</p>
					<p className="font-display text-3xl font-bold tnum text-foreground">128</p>
				</div>
				<span className="flex items-center gap-1 rounded-full border border-success/30 bg-success/12 px-2.5 py-1 text-xs font-semibold text-success">
					<TrendingUp size={12} aria-hidden="true" />
					<span className="tnum" dir="ltr">
						+23%
					</span>
				</span>
			</div>

			<div className="flex h-28 items-end gap-[3px]" dir={isRtl ? 'rtl' : 'ltr'}>
				{bars.map((height, i) => (
					<motion.div
						key={i}
						initial={reduced ? false : { height: '6%' }}
						whileInView={{ height: `${height}%` }}
						viewport={VIEWPORT}
						transition={{ delay: 0.1 + i * 0.045, duration: 0.5, ease: EASE_OUT }}
						className={cn(
							'flex-1 rounded-t-[3px]',
							i >= bars.length - 4
								? 'bg-gradient-to-t from-primary/40 to-primary'
								// /12 was effectively invisible against the card.
								: 'bg-foreground/25',
						)}
					/>
				))}
			</div>
		</div>
	);
};

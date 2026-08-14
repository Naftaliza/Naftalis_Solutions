import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Section, Eyebrow } from '@/components/ui/section';
import { fadeUp } from '@/lib/motion';

/**
 * The inner-page hero. Every page used to hand-roll this block with its own
 * motion props and its own heading sizes, which drifted apart over time.
 *
 * Copy is still split into title1 + title2 because translations.js stores
 * headlines that way — title2 gets the teal-to-cyan wash.
 */
export const PageHero = ({ eyebrow, title1, title2, subtitle, children, align = 'center' }) => {
	const reduced = useReducedMotion();

	return (
		<Section glow spacing="none" className="pb-10 pt-16 sm:pb-14 sm:pt-24">
			<motion.div
				initial={reduced ? false : 'hidden'}
				animate="show"
				variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
				className={
					align === 'center'
						? 'mx-auto flex max-w-3xl flex-col items-center gap-6 text-center'
						: 'flex max-w-3xl flex-col items-start gap-6'
				}
			>
				{eyebrow && (
					<motion.div variants={fadeUp}>
						<Eyebrow>{eyebrow}</Eyebrow>
					</motion.div>
				)}

				<motion.h1
					variants={fadeUp}
					className="text-display-sm font-extrabold text-foreground sm:text-display"
				>
					{title1} {title2 && <span className="gradient-text">{title2}</span>}
				</motion.h1>

				{subtitle && (
					<motion.p
						variants={fadeUp}
						className="text-lg leading-relaxed text-muted-foreground sm:text-xl"
					>
						{subtitle}
					</motion.p>
				)}

				{children && <motion.div variants={fadeUp}>{children}</motion.div>}
			</motion.div>
		</Section>
	);
};

export default PageHero;

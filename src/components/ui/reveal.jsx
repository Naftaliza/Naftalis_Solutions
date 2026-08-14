import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeUp, stagger, VIEWPORT, respectMotion } from '@/lib/motion';

/**
 * Scroll-triggered reveal. Replaces the mount-time `animate` pattern used
 * across the old pages, which completed before the user ever scrolled to it.
 */
export const Reveal = React.forwardRef(
	({ as = 'div', className, children, delay = 0, variants, ...props }, ref) => {
		const reduced = useReducedMotion();
		const v = respectMotion(variants || fadeUp, reduced);
		const Comp = motion[as] || motion.div;

		return (
			<Comp
				ref={ref}
				initial="hidden"
				whileInView="show"
				viewport={VIEWPORT}
				variants={v}
				transition={delay ? { delay } : undefined}
				className={cn(className)}
				{...props}
			>
				{children}
			</Comp>
		);
	},
);
Reveal.displayName = 'Reveal';

/**
 * Parent that staggers its Reveal children. Children should use plain
 * `variants={fadeUp}` on a motion element rather than their own whileInView.
 */
export const RevealGroup = ({
	as = 'div',
	className,
	children,
	staggerChildren = 0.09,
	delayChildren = 0,
	...props
}) => {
	const reduced = useReducedMotion();
	const Comp = motion[as] || motion.div;

	return (
		<Comp
			initial="hidden"
			whileInView="show"
			viewport={VIEWPORT}
			variants={reduced ? { hidden: {}, show: {} } : stagger(staggerChildren, delayChildren)}
			className={cn(className)}
			{...props}
		>
			{children}
		</Comp>
	);
};

/** Child of RevealGroup. Inherits the parent's stagger timing. */
export const RevealItem = React.forwardRef(
	({ as = 'div', className, children, variants, ...props }, ref) => {
		const reduced = useReducedMotion();
		const Comp = motion[as] || motion.div;
		return (
			<Comp
				ref={ref}
				variants={respectMotion(variants || fadeUp, reduced)}
				className={cn(className)}
				{...props}
			>
				{children}
			</Comp>
		);
	},
);
RevealItem.displayName = 'RevealItem';

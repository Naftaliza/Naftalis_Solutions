/**
 * Shared motion vocabulary.
 *
 * The previous build animated with `animate` rather than `whileInView`, so
 * every section below the fold finished its reveal while still off-screen —
 * paying the cost of animation and getting none of the payoff. Everything
 * here is scroll-triggered and fires once.
 */

export const EASE_OUT = [0.16, 1, 0.3, 1];

/** Standard viewport config: fire once, slightly before the element lands. */
export const VIEWPORT = { once: true, margin: '-12% 0px -8% 0px' };

export const fadeUp = {
	hidden: { opacity: 0, y: 24 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: EASE_OUT },
	},
};

export const fadeIn = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { duration: 0.7, ease: EASE_OUT } },
};

export const scaleIn = {
	hidden: { opacity: 0, scale: 0.94 },
	show: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.6, ease: EASE_OUT },
	},
};

/** Parent that staggers its children. Pair with `fadeUp` on each child. */
export const stagger = (staggerChildren = 0.09, delayChildren = 0) => ({
	hidden: {},
	show: {
		transition: { staggerChildren, delayChildren },
	},
});

/**
 * Direction-aware horizontal entrance. Hebrew reads right-to-left, so
 * content should slide in from the mirrored side.
 */
export const slideInX = (language, distance = 40) => ({
	hidden: { opacity: 0, x: language === 'he' ? distance : -distance },
	show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: EASE_OUT } },
});

/**
 * Strips motion out of any variant set when the visitor has asked for
 * reduced motion — opacity still resolves, transforms do not.
 */
export const respectMotion = (variants, reduced) => {
	if (!reduced) return variants;
	return {
		hidden: { opacity: 0 },
		show: { opacity: 1, transition: { duration: 0.2 } },
	};
};

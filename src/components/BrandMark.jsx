import React from 'react';
import { cn } from '@/lib/utils';

/**
 * The brand mark — an ascending signal resolving into a point.
 *
 * Replaces the generic lucide <Rocket /> that stood in for a logo. The
 * gradient id is suffixed per instance so multiple marks on one page don't
 * collide in the SVG id namespace.
 */
let instance = 0;

export const BrandMark = ({ className, size = 34, ...props }) => {
	const id = React.useMemo(() => `brand-${(instance += 1)}`, []);

	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 32 32"
			className={cn('shrink-0', className)}
			aria-hidden="true"
			focusable="false"
			{...props}
		>
			<defs>
				<linearGradient id={id} x1="4" y1="26" x2="27" y2="7" gradientUnits="userSpaceOnUse">
					<stop offset="0" stopColor="hsl(var(--primary))" />
					<stop offset="1" stopColor="hsl(var(--secondary))" />
				</linearGradient>
			</defs>
			<rect width="32" height="32" rx="8" fill="hsl(var(--card))" />
			<rect
				width="31"
				height="31"
				x="0.5"
				y="0.5"
				rx="7.5"
				fill="none"
				stroke="hsl(var(--foreground) / 0.12)"
			/>
			<path
				d="M6.5 22.5C10 22.5 12.5 19 15 14.5S20.5 6.5 25.5 6.5"
				fill="none"
				stroke={`url(#${id})`}
				strokeWidth="3.2"
				strokeLinecap="round"
			/>
			<circle cx="25.5" cy="6.5" r="3.2" fill="hsl(var(--secondary))" />
		</svg>
	);
};

/** Mark + wordmark, used in the header and footer. */
export const BrandLockup = ({ className, label, size = 34, ...props }) => (
	<span className={cn('inline-flex items-center gap-2.5', className)} {...props}>
		<BrandMark size={size} />
		<span className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
			{label}
		</span>
	</span>
);

export default BrandMark;

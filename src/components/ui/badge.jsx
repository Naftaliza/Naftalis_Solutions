import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
	'inline-flex items-center gap-1.5 rounded-full font-display font-semibold tracking-tight whitespace-nowrap',
	{
		variants: {
			variant: {
				default: 'border border-primary/30 bg-primary/12 text-primary',
				glass: 'glass text-foreground',
				solid: 'bg-primary text-primary-foreground',
				muted: 'border border-border bg-muted text-muted-foreground',
				success: 'border border-success/30 bg-success/12 text-success',
			},
			size: {
				sm: 'px-2.5 py-0.5 text-[0.7rem]',
				default: 'px-3.5 py-1.5 text-xs',
				lg: 'px-4 py-2 text-sm',
			},
		},
		defaultVariants: { variant: 'default', size: 'default' },
	},
);

export const Badge = ({ className, variant, size, ...props }) => (
	<span className={cn(badgeVariants({ variant, size }), className)} {...props} />
);

/** Live-status pill — a filled dot with a soft halo. */
export const StatusDot = ({ className, ...props }) => (
	<span className={cn('relative flex h-2 w-2', className)} aria-hidden="true" {...props}>
		<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
		<span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
	</span>
);

import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import React from 'react';

/**
 * Variants finally resolve — the tokens they reference are defined in
 * src/index.css. Before that block existed every variant rendered
 * transparent, which is why call sites used to hard-code `bg-teal-500`.
 * Pass a variant instead of overriding colours by hand.
 */
const buttonVariants = cva(
	[
		'relative inline-flex items-center justify-center gap-2 whitespace-nowrap',
		'font-display font-semibold tracking-tight',
		'transition-[background-color,color,box-shadow,transform,border-color] duration-300 ease-out',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
		'disabled:pointer-events-none disabled:opacity-50',
		'active:translate-y-px',
		// Icons flip with direction instead of needing a per-site margin check.
		'[&_svg]:shrink-0 rtl:[&_svg.dir-flip]:-scale-x-100',
	],
	{
		variants: {
			variant: {
				default:
					'bg-primary text-primary-foreground shadow-glow hover:shadow-glow-lg hover:brightness-110',
				secondary:
					'bg-secondary text-secondary-foreground hover:brightness-110',
				outline:
					'border border-border bg-transparent text-foreground hover:border-primary/60 hover:bg-primary/10 hover:text-primary',
				glass:
					'glass text-foreground hover:border-primary/40 hover:bg-primary/10',
				subtle:
					'bg-muted text-foreground hover:bg-accent',
				destructive:
					'bg-destructive text-destructive-foreground hover:brightness-110',
				whatsapp:
					'bg-[#25D366] text-[#04310f] hover:brightness-110',
				ghost:
					'text-muted-foreground hover:bg-accent hover:text-foreground',
				link:
					'text-primary underline-offset-4 hover:underline p-0 h-auto',
			},
			size: {
				sm: 'h-9 rounded-full px-4 text-sm',
				default: 'h-11 rounded-full px-6 text-[0.95rem]',
				lg: 'h-14 rounded-full px-8 text-base',
				icon: 'h-11 w-11 rounded-full',
				'icon-sm': 'h-9 w-9 rounded-full',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

const Button = React.forwardRef(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = 'Button';

export { Button, buttonVariants };

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * One card, instead of the six near-identical hand-rolled versions that
 * lived in SolutionsPage, ServicesPage, AboutPage, QuotePage, BlogPage and
 * ContactPage with drifting padding and shadow values.
 *
 * `spotlight` tracks the pointer and lights the border where the cursor is —
 * a dark ground has no drop shadow to give depth, so light does that job.
 */
const Card = React.forwardRef(
	(
		{
			className,
			variant = 'glass',
			interactive = false,
			spotlight = false,
			children,
			...props
		},
		ref,
	) => {
		const handlePointerMove = React.useCallback(
			(event) => {
				if (!spotlight) return;
				const rect = event.currentTarget.getBoundingClientRect();
				event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
				event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
			},
			[spotlight],
		);

		return (
			<div
				ref={ref}
				onPointerMove={handlePointerMove}
				className={cn(
					'group relative overflow-hidden rounded-2xl',
					{
						glass: 'glass',
						solid: 'border border-border bg-card',
						elevated: 'border border-border bg-popover shadow-panel',
						outline: 'border border-border bg-transparent',
						primary: 'border border-primary/30 bg-primary/10',
					}[variant],
					interactive &&
						'transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift',
					className,
				)}
				{...props}
			>
				{spotlight && (
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						style={{
							background:
								'radial-gradient(300px circle at var(--mx, 50%) var(--my, 0%), hsl(var(--primary) / 0.14), transparent 65%)',
						}}
					/>
				)}
				{children}
			</div>
		);
	},
);
Card.displayName = 'Card';

const CardBody = ({ className, ...props }) => (
	<div className={cn('relative flex h-full flex-col p-7 sm:p-8', className)} {...props} />
);

const CardTitle = ({ as: Comp = 'h3', className, ...props }) => (
	<Comp className={cn('text-xl font-bold text-foreground sm:text-2xl', className)} {...props} />
);

const CardText = ({ className, ...props }) => (
	<p className={cn('leading-relaxed text-muted-foreground', className)} {...props} />
);

/** Icon chip used at the top of feature cards. */
const CardIcon = ({ className, children, ...props }) => (
	<div
		className={cn(
			'mb-6 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl',
			'border border-primary/25 bg-primary/12 text-primary',
			'transition-[background-color,transform] duration-500 ease-out group-hover:scale-105 group-hover:bg-primary/20',
			className,
		)}
		{...props}
	>
		{children}
	</div>
);

export { Card, CardBody, CardTitle, CardText, CardIcon };

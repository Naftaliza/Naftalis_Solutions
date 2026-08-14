import React from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/ui/reveal';

/**
 * Horizontal rhythm for the whole site.
 *
 * The width cap used to live on <main> in App.jsx, which meant no section
 * could ever go edge-to-edge. It now lives here, so a Section can span the
 * full viewport while its contents stay measured.
 */
export const Container = ({ as: Comp = 'div', className, children, size = 'default', ...props }) => (
	<Comp
		className={cn(
			'mx-auto w-full px-5 sm:px-6 lg:px-8',
			{
				narrow: 'max-w-3xl',
				default: 'max-w-7xl',
				wide: 'max-w-[88rem]',
				prose: 'max-w-prose',
			}[size],
			className,
		)}
		{...props}
	>
		{children}
	</Comp>
);

/**
 * Vertical rhythm + optional ambient treatments.
 *
 * `glow` paints the aurora behind the section; `texture` adds the faint
 * grid. Both are decorative and sit at z-index -1 inside an isolated
 * stacking context, so they never intercept clicks.
 */
export const Section = ({
	as: Comp = 'section',
	className,
	children,
	container = 'default',
	glow = false,
	texture = false,
	spacing = 'default',
	...props
}) => (
	<Comp
		className={cn(
			'relative w-full',
			{
				none: '',
				tight: 'py-14 sm:py-16',
				default: 'py-20 sm:py-28',
				loose: 'py-24 sm:py-36',
			}[spacing],
			glow && 'aurora animate-aurora',
			className,
		)}
		{...props}
	>
		{texture && (
			<div
				aria-hidden="true"
				className="grid-texture pointer-events-none absolute inset-0 -z-10"
			/>
		)}
		{container === false ? children : <Container size={container}>{children}</Container>}
	</Comp>
);

/** Small uppercase label above a heading. */
export const Eyebrow = ({ className, children, ...props }) => (
	<span
		className={cn(
			'inline-flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary',
			className,
		)}
		{...props}
	>
		<span aria-hidden="true" className="h-px w-6 bg-primary/50" />
		{children}
	</span>
);

/**
 * The heading block that was copy-pasted across SolutionsPage and AboutPage
 * with a hand-built underline bar each time.
 */
export const SectionHeading = ({
	eyebrow,
	title,
	subtitle,
	align = 'center',
	className,
	titleClassName,
	as: Heading = 'h2',
	...props
}) => (
	<Reveal
		className={cn(
			'flex flex-col gap-4',
			align === 'center' && 'items-center text-center',
			align === 'start' && 'items-start text-start',
			className,
		)}
		{...props}
	>
		{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
		<Heading
			className={cn(
				'text-display-sm font-bold text-foreground',
				align === 'center' && 'max-w-3xl',
				titleClassName,
			)}
		>
			{title}
		</Heading>
		{subtitle && (
			<p
				className={cn(
					'text-lg leading-relaxed text-muted-foreground',
					align === 'center' && 'max-w-2xl',
				)}
			>
				{subtitle}
			</p>
		)}
	</Reveal>
);

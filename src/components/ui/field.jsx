import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const controlClasses = [
	'w-full rounded-lg border bg-muted/60 px-4 text-foreground',
	'placeholder:text-muted-foreground/60',
	'transition-[border-color,background-color,box-shadow] duration-200',
	'focus:outline-none focus:border-primary focus:bg-muted focus:ring-2 focus:ring-primary/25',
	'disabled:cursor-not-allowed disabled:opacity-60',
];

export const Label = React.forwardRef(({ className, required, children, ...props }, ref) => (
	<label
		ref={ref}
		className={cn('block font-display text-sm font-semibold text-foreground', className)}
		{...props}
	>
		{children}
		{required && (
			<span className="text-primary" aria-hidden="true">
				{' '}
				*
			</span>
		)}
	</label>
));
Label.displayName = 'Label';

export const Input = React.forwardRef(({ className, invalid, ...props }, ref) => (
	<input
		ref={ref}
		aria-invalid={invalid || undefined}
		className={cn(
			controlClasses,
			'h-12',
			invalid ? 'border-destructive focus:border-destructive focus:ring-destructive/25' : 'border-border',
			className,
		)}
		{...props}
	/>
));
Input.displayName = 'Input';

export const Textarea = React.forwardRef(({ className, invalid, ...props }, ref) => (
	<textarea
		ref={ref}
		aria-invalid={invalid || undefined}
		className={cn(
			controlClasses,
			'min-h-[9rem] resize-y py-3 leading-relaxed',
			invalid ? 'border-destructive focus:border-destructive focus:ring-destructive/25' : 'border-border',
			className,
		)}
		{...props}
	/>
));
Textarea.displayName = 'Textarea';

/**
 * Label + control + error, wired together.
 *
 * The old form set `aria-invalid` but never `aria-describedby`, and the error
 * text had no live region — so a screen reader user submitting an invalid
 * form was told nothing at all. `role="alert"` and the describedby link fix
 * that.
 */
export const Field = ({ id, label, error, required, hint, className, children }) => {
	const errorId = `${id}-error`;
	const hintId = `${id}-hint`;
	const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ');

	return (
		<div className={cn('flex flex-col gap-2', className)}>
			{label && (
				<Label htmlFor={id} required={required}>
					{label}
				</Label>
			)}
			{React.cloneElement(children, {
				id,
				invalid: Boolean(error),
				'aria-describedby': describedBy || undefined,
				required: required || undefined,
			})}
			{hint && !error && (
				<p id={hintId} className="text-xs text-muted-foreground">
					{hint}
				</p>
			)}
			{error && (
				<p
					id={errorId}
					role="alert"
					className="flex items-center gap-1.5 text-sm font-medium text-destructive"
				>
					<AlertCircle size={14} aria-hidden="true" />
					{error}
				</p>
			)}
		</div>
	);
};

import React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
	<AccordionPrimitive.Item ref={ref} className={cn('border-b border-border', className)} {...props} />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Header className="flex">
		<AccordionPrimitive.Trigger
			ref={ref}
			className={cn(
				// `text-start`, not `text-left` — the old rule left-aligned Hebrew
				// questions inside a right-to-left panel.
				'group flex flex-1 items-center justify-between gap-4 py-5 text-start font-display font-semibold text-foreground transition-colors hover:text-primary',
				className,
			)}
			{...props}
		>
			{children}
			<span
				aria-hidden="true"
				className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-primary transition-[transform,background-color,border-color] duration-300 group-hover:border-primary/50 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-primary/10"
			>
				<Plus size={15} />
			</span>
		</AccordionPrimitive.Trigger>
	</AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Content
		ref={ref}
		className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
		{...props}
	>
		<div className={cn('pb-5 pe-10 leading-relaxed text-muted-foreground', className)}>{children}</div>
	</AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

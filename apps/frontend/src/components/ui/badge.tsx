/**
 * RIOS — Badge Component
 */

import { cva, type VariantProps } from 'class-variance-authority';
import { type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground shadow',
        success: 'border-transparent bg-success text-success-foreground shadow',
        warning: 'border-transparent bg-warning text-warning-foreground shadow',
        outline: 'text-foreground',
        // Soft/tonal variants — lower-contrast fills for status labels that
        // should read as metadata, not calls to action. Preferred for the
        // many status badges across list/detail views.
        'soft-primary': 'border-transparent bg-primary/10 text-primary',
        'soft-secondary': 'border-transparent bg-muted text-muted-foreground',
        'soft-success': 'border-transparent bg-success/10 text-success',
        'soft-warning': 'border-transparent bg-warning/15 text-warning',
        'soft-destructive': 'border-transparent bg-destructive/10 text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

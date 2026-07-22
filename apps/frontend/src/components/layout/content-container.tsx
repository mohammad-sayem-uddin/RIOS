'use client';

/**
 * RIOS — Content Container
 *
 * Standard responsive content wrapper applied by the app layout so every page
 * inherits consistent max-width and padding. Pages should not re-declare these
 * values; they render their content directly and rely on this container.
 */

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface ContentContainerProps {
  children: ReactNode;
  /** When true, removes the max-width constraint for full-bleed pages. */
  fluid?: boolean;
  className?: string;
}

export function ContentContainer({ children, fluid = false, className }: ContentContainerProps) {
  const pathname = usePathname();

  return (
    <div
      // Keyed by route so each navigation re-triggers a subtle content
      // entrance. The `animate-fade-in-up` utility is fully disabled under
      // `prefers-reduced-motion` via globals.css.
      key={pathname}
      className={cn(
        'mx-auto px-4 py-6 lg:px-8 animate-fade-in-up',
        fluid ? 'w-full' : 'max-w-7xl',
        className,
      )}
    >
      {children}
    </div>
  );
}

'use client';

/**
 * RIOS — Form Page Shell
 *
 * Shared chrome for every create/edit page: a back link, page header, and a
 * centered card that holds the form. Centralizing this keeps the writing
 * experience (spacing, max-width, footer button layout) identical across
 * publications, projects, assets, recognition, and profile.
 */

import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FormShellProps {
  backHref: string;
  backLabel: string;
  title: string;
  description?: string;
  children: ReactNode;
}

/** Back link + header + card wrapper for a form page. */
export function FormShell({ backHref, backLabel, title, description, children }: FormShellProps) {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {backLabel}
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>

      <Card>
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </div>
  );
}

interface FormActionsProps {
  cancelHref: string;
  submitLabel: string;
  submittingLabel: string;
  isSubmitting: boolean;
}

/** Standard Cancel / Submit footer for a form. */
export function FormActions({
  cancelHref,
  submitLabel,
  submittingLabel,
  isSubmitting,
}: FormActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
      <Link href={cancelHref} className="sm:order-1">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </Link>
      <Button type="submit" className="w-full sm:order-2 sm:w-auto" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? submittingLabel : submitLabel}
      </Button>
    </div>
  );
}

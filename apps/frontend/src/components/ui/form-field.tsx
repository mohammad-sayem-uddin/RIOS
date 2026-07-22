/**
 * RIOS — Form Field
 *
 * Consistent label + control + hint/error layout for every form across the app.
 * Framework-agnostic: pass the field's error message (e.g. from react-hook-form)
 * and it wires up `aria-invalid`, `aria-describedby`, and the error region.
 */

'use client';

import { type ReactNode, useId } from 'react';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  /** Render prop receives the id + aria props to spread on the control. */
  children: (field: {
    id: string;
    'aria-invalid': boolean;
    'aria-describedby': string | undefined;
  }) => ReactNode;
  error?: string;
  hint?: string;
  /** Optional trailing element rendered inline with the label (e.g. "Forgot?"). */
  labelAccessory?: ReactNode;
  className?: string;
  optional?: boolean;
}

export function FormField({
  label,
  children,
  error,
  hint,
  labelAccessory,
  className,
  optional,
}: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>
          {label}
          {optional && <span className="ml-1 font-normal text-muted-foreground">(optional)</span>}
        </Label>
        {labelAccessory}
      </div>

      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}

      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

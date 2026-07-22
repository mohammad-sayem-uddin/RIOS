'use client';

/**
 * RIOS — Password Input
 *
 * Password field with a visibility toggle and Caps Lock detection. Optionally
 * renders a strength meter + requirements checklist (used by registration and
 * reset). Forwards a ref so it composes with react-hook-form's `register`.
 */

import { Eye, EyeOff, Check, X, AlertTriangle } from 'lucide-react';
import { forwardRef, useState, type InputHTMLAttributes } from 'react';

import { Input } from '@/components/ui/input';
import { evaluatePasswordStrength } from '@/lib/password-strength';
import { cn } from '@/lib/utils';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Render the strength meter + requirements checklist for the current value. */
  showStrength?: boolean;
  /** Current value — required for the strength meter to reflect typing. */
  value?: string;
}

const LEVEL_BAR_CLASS: Record<string, string> = {
  weak: 'bg-destructive',
  fair: 'bg-warning',
  good: 'bg-primary',
  strong: 'bg-success',
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrength = false, value, onKeyUp, onKeyDown, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const [capsLock, setCapsLock] = useState(false);

    const detectCaps = (event: React.KeyboardEvent<HTMLInputElement>) => {
      // getModifierState is available on real keyboard events.
      if (typeof event.getModifierState === 'function') {
        setCapsLock(event.getModifierState('CapsLock'));
      }
    };

    const strength = showStrength ? evaluatePasswordStrength(value ?? '') : null;

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            ref={ref}
            type={visible ? 'text' : 'password'}
            value={value}
            className={cn('pr-10', className)}
            onKeyUp={(event) => {
              detectCaps(event);
              onKeyUp?.(event);
            }}
            onKeyDown={(event) => {
              detectCaps(event);
              onKeyDown?.(event);
            }}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label={visible ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {capsLock && (
          <p className="flex items-center gap-1.5 text-xs text-warning" role="status">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            Caps Lock is on
          </p>
        )}

        {strength && strength.level !== 'empty' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-1.5 flex-1 gap-1" aria-hidden="true">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={cn(
                      'flex-1 rounded-full transition-colors',
                      bar <= strength.score ? LEVEL_BAR_CLASS[strength.level] : 'bg-muted',
                    )}
                  />
                ))}
              </div>
              <span className="w-12 text-right text-xs font-medium text-muted-foreground">
                {strength.label}
              </span>
            </div>
            <ul
              className="grid grid-cols-1 gap-1 sm:grid-cols-2"
              aria-label="Password requirements"
            >
              {strength.requirements.map((req) => (
                <li
                  key={req.id}
                  className={cn(
                    'flex items-center gap-1.5 text-xs',
                    req.met ? 'text-success' : 'text-muted-foreground',
                  )}
                >
                  {req.met ? (
                    <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  )}
                  {req.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';

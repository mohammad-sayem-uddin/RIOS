/**
 * RIOS — Password Strength Evaluation
 *
 * Pure, dependency-free heuristic scoring used by the password field's strength
 * meter and requirements checklist. This is a UX aid only — the backend remains
 * the authority on password acceptance.
 */

export interface PasswordRequirement {
  id: string;
  label: string;
  met: boolean;
}

export type PasswordStrengthLevel = 'empty' | 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordStrength {
  /** 0–4 score. */
  score: number;
  level: PasswordStrengthLevel;
  /** Human label for the current level. */
  label: string;
  requirements: PasswordRequirement[];
}

const STRENGTH_LABELS: Record<PasswordStrengthLevel, string> = {
  empty: '',
  weak: 'Weak',
  fair: 'Fair',
  good: 'Good',
  strong: 'Strong',
};

/** Evaluate a password against the RIOS requirements checklist and score it. */
export function evaluatePasswordStrength(password: string): PasswordStrength {
  const requirements: PasswordRequirement[] = [
    { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
    { id: 'lowercase', label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { id: 'uppercase', label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { id: 'number', label: 'One number', met: /[0-9]/.test(password) },
    { id: 'symbol', label: 'One symbol (recommended)', met: /[^A-Za-z0-9]/.test(password) },
  ];

  if (password.length === 0) {
    return { score: 0, level: 'empty', label: STRENGTH_LABELS.empty, requirements };
  }

  const metCount = requirements.filter((r) => r.met).length;
  // Bonus point for longer passwords.
  const lengthBonus = password.length >= 12 ? 1 : 0;
  const rawScore = Math.min(4, Math.max(1, metCount - 1 + lengthBonus));

  const level: PasswordStrengthLevel =
    rawScore <= 1 ? 'weak' : rawScore === 2 ? 'fair' : rawScore === 3 ? 'good' : 'strong';

  return { score: rawScore, level, label: STRENGTH_LABELS[level], requirements };
}

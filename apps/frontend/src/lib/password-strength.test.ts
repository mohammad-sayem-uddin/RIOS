/**
 * RIOS — Password Strength Tests
 *
 * Pure-logic tests for the password strength heuristic. Runs in the root Vitest
 * (node environment) with a relative import — no Next.js alias or DOM needed.
 */

import { describe, it, expect } from 'vitest';

import { evaluatePasswordStrength } from './password-strength';

describe('evaluatePasswordStrength', () => {
  it('reports an empty level for an empty password', () => {
    const result = evaluatePasswordStrength('');
    expect(result.level).toBe('empty');
    expect(result.score).toBe(0);
    expect(result.requirements.every((r) => !r.met)).toBe(true);
  });

  it('marks each requirement met as the password satisfies it', () => {
    const result = evaluatePasswordStrength('Abcdef1!');
    const byId = Object.fromEntries(result.requirements.map((r) => [r.id, r.met]));
    expect(byId['length']).toBe(true);
    expect(byId['lowercase']).toBe(true);
    expect(byId['uppercase']).toBe(true);
    expect(byId['number']).toBe(true);
    expect(byId['symbol']).toBe(true);
  });

  it('rates a weak password low and a strong one high', () => {
    expect(evaluatePasswordStrength('abc').level).toBe('weak');
    expect(evaluatePasswordStrength('Abcdefgh1!xyz').level).toBe('strong');
  });

  it('caps the score at 4', () => {
    const result = evaluatePasswordStrength('Abcdefghijkl1234!@#$');
    expect(result.score).toBeLessThanOrEqual(4);
  });
});

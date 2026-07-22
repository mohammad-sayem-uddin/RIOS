'use client';

/**
 * RIOS — Onboarding State Hook
 *
 * Persists onboarding progress to localStorage so a researcher can leave and
 * return later without losing entered data (spec: Save Progress / Return Later).
 * Server submission happens per-step through researchProfileService; this hook
 * only tracks step position and draft field values.
 */

import { useCallback, useEffect, useState } from 'react';

export interface OnboardingDraft {
  title: string;
  headline: string;
  biography: string;
  interests: string[];
  orcidId: string;
}

export const ONBOARDING_STEPS = ['welcome', 'basic', 'interests', 'orcid', 'finish'] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

const STORAGE_KEY = 'rios_onboarding_draft';
const STEP_KEY = 'rios_onboarding_step';

const EMPTY_DRAFT: OnboardingDraft = {
  title: '',
  headline: '',
  biography: '',
  interests: [],
  orcidId: '',
};

export function useOnboarding() {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [draft, setDraft] = useState<OnboardingDraft>(EMPTY_DRAFT);
  const [hydrated, setHydrated] = useState(false);

  // Restore any saved progress on mount.
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      const savedStep = localStorage.getItem(STEP_KEY);
      if (savedDraft)
        setDraft({ ...EMPTY_DRAFT, ...(JSON.parse(savedDraft) as Partial<OnboardingDraft>) });
      if (savedStep && (ONBOARDING_STEPS as readonly string[]).includes(savedStep)) {
        setStep(savedStep as OnboardingStep);
      }
    } catch {
      // Corrupt draft — ignore and start fresh.
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist draft + step whenever they change (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    localStorage.setItem(STEP_KEY, step);
  }, [draft, step, hydrated]);

  const updateDraft = useCallback((patch: Partial<OnboardingDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const goTo = useCallback((next: OnboardingStep) => setStep(next), []);

  const next = useCallback(() => {
    setStep((current) => {
      const index = ONBOARDING_STEPS.indexOf(current);
      return ONBOARDING_STEPS[Math.min(index + 1, ONBOARDING_STEPS.length - 1)];
    });
  }, []);

  const back = useCallback(() => {
    setStep((current) => {
      const index = ONBOARDING_STEPS.indexOf(current);
      return ONBOARDING_STEPS[Math.max(index - 1, 0)];
    });
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_KEY);
    setDraft(EMPTY_DRAFT);
    setStep('welcome');
  }, []);

  const stepIndex = ONBOARDING_STEPS.indexOf(step);

  return { step, stepIndex, draft, hydrated, updateDraft, goTo, next, back, clear };
}

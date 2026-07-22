'use client';

/**
 * RIOS — Researcher Onboarding Wizard
 *
 * Multi-step first-run setup. Each data-writing step maps to a ✅ VERIFIED
 * research-profile endpoint (create profile, add interests, add ORCID external
 * profile). Progress is persisted locally (Save Progress / Return Later) and the
 * whole flow is skippable per the spec.
 *
 * Steps: Welcome → Basic info → Research interests → ORCID (optional) → Finish.
 * (Profile picture is intentionally omitted — no avatar-upload backend contract
 * exists; see the Part 2 report.)
 */

import { ArrowLeft, ArrowRight, Check, GraduationCap, Sparkles, Link2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { FormError } from '@/components/auth/form-error';
import { AuthGuard } from '@/components/auth/route-guard';
import { RouteLoading } from '@/components/auth/route-loading';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { useOnboarding, ONBOARDING_STEPS } from '@/hooks/use-onboarding';
import { mapAuthError } from '@/lib/auth-errors';
import { researchProfileService } from '@/lib/research-profile-service';
import { useAuth } from '@/providers/auth-provider';

const STEP_LABELS: Record<string, string> = {
  welcome: 'Welcome',
  basic: 'Basic info',
  interests: 'Interests',
  orcid: 'ORCID',
  finish: 'Finish',
};

function OnboardingWizard() {
  const router = useRouter();
  const { user } = useAuth();
  const { step, stepIndex, draft, hydrated, updateDraft, next, back, clear } = useOnboarding();
  const [interestInput, setInterestInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!hydrated) return <RouteLoading label="Loading your setup…" />;

  const totalSteps = ONBOARDING_STEPS.length;

  const addInterest = () => {
    const value = interestInput.trim();
    if (!value || draft.interests.includes(value)) {
      setInterestInput('');
      return;
    }
    updateDraft({ interests: [...draft.interests, value] });
    setInterestInput('');
  };

  const removeInterest = (name: string) => {
    updateDraft({ interests: draft.interests.filter((i) => i !== name) });
  };

  const finishToDashboard = () => {
    clear();
    router.replace('/');
  };

  /** Persist the collected draft to the backend, then land on the dashboard. */
  const submitProfile = async () => {
    if (!user) return;
    setError(null);
    setSubmitting(true);
    try {
      // 1) Create the base profile (title required by the backend DTO).
      const profile = await researchProfileService.create({
        userId: user.id,
        title: draft.title.trim() || user.displayName,
        headline: draft.headline.trim() || undefined,
        biography: draft.biography.trim() || undefined,
      });

      // 2) Add research interests (best-effort, sequential to preserve order).
      for (const name of draft.interests) {
        await researchProfileService.addResearchInterest(profile.id, { name });
      }

      // 3) Attach ORCID as an external profile if provided.
      const orcid = draft.orcidId.trim();
      if (orcid) {
        await researchProfileService.addExternalProfile(profile.id, {
          provider: 'ORCID',
          url: orcid.startsWith('http') ? orcid : `https://orcid.org/${orcid}`,
          externalIdentifier: orcid,
        });
      }

      finishToDashboard();
    } catch (err) {
      setError(mapAuthError(err));
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-muted/30">
      {/* Progress header */}
      <header className="border-b bg-background">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              R
            </div>
            <span className="text-sm font-semibold">Set up your profile</span>
          </div>
          <button
            type="button"
            onClick={finishToDashboard}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Skip for now
          </button>
        </div>
        {/* Step indicator */}
        <div className="mx-auto w-full max-w-2xl px-4 pb-4">
          <div className="flex items-center gap-2" role="list" aria-label="Onboarding progress">
            {ONBOARDING_STEPS.map((s, index) => (
              <div key={s} className="flex flex-1 items-center gap-2" role="listitem">
                <div
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    index <= stepIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                  aria-current={index === stepIndex ? 'step' : undefined}
                />
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Step {stepIndex + 1} of {totalSteps} — {STEP_LABELS[step]}
          </p>
        </div>
      </header>

      {/* Step body */}
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8">
        <div className="flex-1 rounded-xl border bg-card p-6 shadow-sm sm:p-8">
          {step === 'welcome' && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome{user ? `, ${user.displayName.split(' ')[0]}` : ''}
              </h1>
              <p className="max-w-md text-sm text-muted-foreground">
                Let&apos;s set up your research identity. This takes about two minutes, and you can
                skip or finish it later — your progress is saved automatically.
              </p>
            </div>
          )}

          {step === 'basic' && (
            <div className="flex flex-col gap-4">
              <div className="mb-2">
                <h1 className="text-xl font-semibold tracking-tight">Basic information</h1>
                <p className="text-sm text-muted-foreground">
                  How you want to be presented across RIOS.
                </p>
              </div>
              <FormField label="Professional title" hint="e.g. PhD Candidate, Associate Professor">
                {(field) => (
                  <Input
                    {...field}
                    value={draft.title}
                    onChange={(e) => updateDraft({ title: e.target.value })}
                    placeholder="Research Scientist"
                    autoFocus
                  />
                )}
              </FormField>
              <FormField label="Headline" optional hint="A one-line summary of your work">
                {(field) => (
                  <Input
                    {...field}
                    value={draft.headline}
                    onChange={(e) => updateDraft({ headline: e.target.value })}
                    placeholder="Machine learning for climate science"
                  />
                )}
              </FormField>
              <FormField label="Short biography" optional>
                {(field) => (
                  <textarea
                    {...field}
                    value={draft.biography}
                    onChange={(e) => updateDraft({ biography: e.target.value })}
                    placeholder="Tell others about your research focus and background…"
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                )}
              </FormField>
            </div>
          )}

          {step === 'interests' && (
            <div className="flex flex-col gap-4">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">Research interests</h1>
                  <p className="text-sm text-muted-foreground">
                    Add the topics that define your work.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addInterest();
                    }
                  }}
                  placeholder="e.g. Natural Language Processing"
                  aria-label="Add a research interest"
                  autoFocus
                />
                <Button type="button" variant="outline" onClick={addInterest}>
                  Add
                </Button>
              </div>
              {draft.interests.length > 0 ? (
                <ul className="flex flex-wrap gap-2" aria-label="Selected interests">
                  {draft.interests.map((interest) => (
                    <li key={interest}>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm">
                        {interest}
                        <button
                          type="button"
                          onClick={() => removeInterest(interest)}
                          className="text-muted-foreground hover:text-foreground"
                          aria-label={`Remove ${interest}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No interests added yet. You can always add more later.
                </p>
              )}
            </div>
          )}

          {step === 'orcid' && (
            <div className="flex flex-col gap-4">
              <div className="mb-2 flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">Connect your ORCID</h1>
                  <p className="text-sm text-muted-foreground">
                    Optional — link your ORCID iD to your research identity.
                  </p>
                </div>
              </div>
              <FormField label="ORCID iD" optional hint="e.g. 0000-0002-1825-0097">
                {(field) => (
                  <Input
                    {...field}
                    value={draft.orcidId}
                    onChange={(e) => updateDraft({ orcidId: e.target.value })}
                    placeholder="0000-0000-0000-0000"
                    autoFocus
                  />
                )}
              </FormField>
            </div>
          )}

          {step === 'finish' && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-success">
                <Check className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">You&apos;re all set</h1>
              <p className="max-w-md text-sm text-muted-foreground">
                We&apos;ll create your research profile with the details you provided. You can
                refine everything anytime from your profile.
              </p>
              {error && <FormError message={error} className="w-full text-left" />}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={back}
            disabled={stepIndex === 0 || submitting}
            className={stepIndex === 0 ? 'invisible' : ''}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {step === 'finish' ? (
            <Button
              type="button"
              onClick={() => {
                void submitProfile();
              }}
              disabled={submitting}
            >
              {submitting ? 'Creating your profile…' : 'Create profile & continue'}
              {!submitting && <Check className="h-4 w-4" />}
            </Button>
          ) : (
            <Button type="button" onClick={next}>
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <AuthGuard>
      <OnboardingWizard />
    </AuthGuard>
  );
}

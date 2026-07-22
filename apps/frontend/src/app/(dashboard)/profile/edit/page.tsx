'use client';

/**
 * RIOS — Edit Profile
 *
 * Editing maps to several ✅ VERIFIED research-profile endpoints rather than a
 * single PATCH:
 *   - Biography  → PUT  /research-profiles/:id/biography
 *   - Interests  → POST/DELETE .../research-interests[/:id]
 *   - External   → POST/DELETE .../external-profiles[/:id]
 *
 * Each section commits independently and re-reads the profile so the UI always
 * reflects server state. (The backend exposes no endpoint to change `headline`
 * after creation, so it is shown read-only here.)
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { Link2, Loader2, Sparkles, UserPlus, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ListLoading, EmptyState } from '@/components/feedback/data-states';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormShell } from '@/components/workspace/form-shell';
import { useMyProfile, useInvalidateOnSuccess } from '@/hooks/use-domain-queries';
import { mapAuthError } from '@/lib/auth-errors';
import { biographySchema, type BiographyFormValues } from '@/lib/domain-schemas';
import { researchProfileService, type ExternalProvider } from '@/lib/research-profile-service';
import type { ExternalProfile, ResearchInterest } from '@/types/api';

const PROVIDERS: ExternalProvider[] = [
  'ORCID',
  'GOOGLE_SCHOLAR',
  'SEMANTIC_SCHOLAR',
  'RESEARCHGATE',
  'GITHUB',
  'LINKEDIN',
  'PERSONAL_WEBSITE',
  'OTHER',
];

const labelForProvider = (p: string) =>
  p
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function EditProfilePage() {
  const query = useMyProfile();
  const invalidate = useInvalidateOnSuccess([['profile']]);
  const profile = query.data;

  if (query.isLoading) return <ListLoading rows={4} />;

  if (!profile) {
    return (
      <EmptyState
        icon={<UserPlus className="h-6 w-6" />}
        title="You haven't set up your profile yet"
        description="Complete a short setup to create your research identity first."
        action={
          <Link href="/onboarding">
            <Button>
              <Sparkles className="h-4 w-4" />
              Set up profile
            </Button>
          </Link>
        }
      />
    );
  }

  const profileId = profile.id;
  const refresh = () => {
    invalidate();
    void query.refetch();
  };

  return (
    <FormShell
      backHref="/profile"
      backLabel="Back to profile"
      title="Edit profile"
      description="Update your biography, research interests, and external links."
    >
      <div className="flex flex-col gap-8">
        <BiographySection
          profileId={profileId}
          headline={profile.headline}
          biography={profile.biography}
          onSaved={refresh}
        />
        <InterestsSection
          profileId={profileId}
          interests={profile.researchInterests}
          onChanged={refresh}
        />
        <ExternalProfilesSection
          profileId={profileId}
          externalProfiles={profile.externalProfiles}
          onChanged={refresh}
        />
      </div>
    </FormShell>
  );
}

/* ── Biography ── */
function BiographySection({
  profileId,
  headline,
  biography,
  onSaved,
}: {
  profileId: string;
  headline?: string;
  biography?: string;
  onSaved: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BiographyFormValues>({
    resolver: zodResolver(biographySchema),
    defaultValues: { headline: headline ?? '', biography: biography ?? '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await researchProfileService.updateBiography(profileId, (values.biography ?? '').trim());
      toast.success('Biography updated');
      onSaved();
    } catch (error) {
      toast.error(mapAuthError(error));
    }
  });

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold">About</h2>
      <form
        onSubmit={(e) => {
          void onSubmit(e);
        }}
        className="flex flex-col gap-4"
        noValidate
      >
        <FormField label="Headline" hint="Set during onboarding — not editable here yet." optional>
          {(field) => (
            <Input
              {...field}
              {...register('headline')}
              disabled
              placeholder="Your professional headline"
            />
          )}
        </FormField>
        <FormField label="Biography" error={errors.biography?.message} optional>
          {(field) => (
            <Textarea
              {...field}
              {...register('biography')}
              rows={6}
              placeholder="Tell us about your research…"
            />
          )}
        </FormField>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Saving…' : 'Save biography'}
          </Button>
        </div>
      </form>
    </section>
  );
}

/* ── Research interests ── */
function InterestsSection({
  profileId,
  interests,
  onChanged,
}: {
  profileId: string;
  interests: ResearchInterest[];
  onChanged: () => void;
}) {
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);

  const add = async () => {
    const name = value.trim();
    if (!name) return;
    if (interests.some((i) => i.name.toLowerCase() === name.toLowerCase())) {
      setValue('');
      return;
    }
    setBusy(true);
    try {
      await researchProfileService.addResearchInterest(profileId, { name });
      setValue('');
      toast.success('Interest added');
      onChanged();
    } catch (error) {
      toast.error(mapAuthError(error));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    setBusy(true);
    try {
      await researchProfileService.removeResearchInterest(profileId, id);
      toast.success('Interest removed');
      onChanged();
    } catch (error) {
      toast.error(mapAuthError(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold">Research interests</h2>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void add();
            }
          }}
          placeholder="Add an interest and press Enter"
          aria-label="Add research interest"
          disabled={busy}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => void add()}
          disabled={busy || !value.trim()}
        >
          Add
        </Button>
      </div>
      {interests.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {interests.map((interest) => (
            <Badge key={interest.id} variant="secondary" className="gap-1 pr-1">
              {interest.name}
              <button
                type="button"
                onClick={() => void remove(interest.id)}
                disabled={busy}
                className="rounded-full p-0.5 hover:bg-background/60 disabled:opacity-50"
                aria-label={`Remove ${interest.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </section>
  );
}

/* ── External profiles ── */
function ExternalProfilesSection({
  profileId,
  externalProfiles,
  onChanged,
}: {
  profileId: string;
  externalProfiles: ExternalProfile[];
  onChanged: () => void;
}) {
  const [provider, setProvider] = useState<ExternalProvider>('ORCID');
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const add = async () => {
    const trimmed = url.trim();
    try {
      // Lightweight client check; backend remains the source of truth.
      new URL(trimmed);
    } catch {
      setError('Enter a valid URL');
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await researchProfileService.addExternalProfile(profileId, { provider, url: trimmed });
      setUrl('');
      toast.success('Link added');
      onChanged();
    } catch (err) {
      toast.error(mapAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    setBusy(true);
    try {
      await researchProfileService.removeExternalProfile(profileId, id);
      toast.success('Link removed');
      onChanged();
    } catch (err) {
      toast.error(mapAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold">External profiles</h2>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Select
          value={provider}
          onChange={(e) => setProvider(e.target.value as ExternalProvider)}
          aria-label="Provider"
          className="sm:w-48"
          disabled={busy}
        >
          {PROVIDERS.map((p) => (
            <option key={p} value={p}>
              {labelForProvider(p)}
            </option>
          ))}
        </Select>
        <div className="flex flex-1 gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            type="url"
            placeholder="https://orcid.org/0000-…"
            aria-label="Profile URL"
            aria-invalid={Boolean(error)}
            disabled={busy}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => void add()}
            disabled={busy || !url.trim()}
          >
            Add
          </Button>
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
      {externalProfiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {externalProfiles.map((ext) => (
            <div
              key={ext.id}
              className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2">
                <Link2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="shrink-0 font-medium">{labelForProvider(ext.provider)}</span>
                <span className="truncate text-muted-foreground">{ext.url}</span>
              </span>
              <button
                type="button"
                onClick={() => void remove(ext.id)}
                disabled={busy}
                className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50"
                aria-label={`Remove ${labelForProvider(ext.provider)} link`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

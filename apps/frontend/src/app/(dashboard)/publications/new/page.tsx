'use client';

/**
 * RIOS — New Publication
 *
 * Create form backed by POST /api/v1/publications (✅ verified). The request
 * body mirrors CreatePublicationApiRequestDto: `profileId` is injected from the
 * resolved research profile, `authors` are split from a comma list and ordered,
 * and empty optional fields are omitted so the backend applies its defaults.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { EmptyState, ListLoading } from '@/components/feedback/data-states';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormActions, FormShell } from '@/components/workspace/form-shell';
import { useMyProfile, useMutation, useInvalidateOnSuccess } from '@/hooks/use-domain-queries';
import { mapAuthError } from '@/lib/auth-errors';
import {
  PUBLICATION_TYPES,
  publicationSchema,
  type PublicationFormValues,
} from '@/lib/domain-schemas';
import { publicationsService } from '@/lib/services';
import { humanizeStatus } from '@/lib/status';
import { useAuth } from '@/providers/auth-provider';

export default function NewPublicationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const profile = useMyProfile();
  const profileId = profile.data?.id ?? user?.id;
  // Invalidate by key prefix so every param variant of the list refetches.
  const invalidate = useInvalidateOnSuccess([['publications'], ['publication-stats']]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      title: '',
      type: 'JOURNAL_ARTICLE',
      doi: '',
      url: '',
      abstract: '',
      keywords: '',
      authors: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (body: unknown) => publicationsService.create(body),
    onSuccess: (created: { id?: string }) => {
      invalidate();
      toast.success('Publication created');
      router.replace(created?.id ? `/publications/${created.id}` : '/publications');
    },
    onError: (error) => toast.error(mapAuthError(error)),
  });

  if (profile.isLoading) return <ListLoading rows={4} />;

  // Publications attach to a profile — guide first-run users to onboarding.
  if (!profileId) {
    return (
      <EmptyState
        icon={<BookOpen className="h-6 w-6" />}
        title="Create your research profile first"
        description="Publications are attached to your research profile. Set one up to get started."
        action={
          <Link href="/onboarding">
            <Button variant="outline" size="sm">
              Set up profile
            </Button>
          </Link>
        }
      />
    );
  }

  const onSubmit = handleSubmit((values) => {
    const parsed = publicationSchema.parse(values); // apply transforms (keywords → string[])
    const authors = (values.authors ?? '')
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name, index) => ({ name, authorOrder: index + 1 }));

    const body: Record<string, unknown> = {
      profileId,
      title: parsed.title,
      type: parsed.type,
      keywords: parsed.keywords,
    };
    if (parsed.year) body.year = Number(parsed.year);
    if (parsed.doi) body.doi = parsed.doi;
    if (parsed.url) body.url = parsed.url;
    if (parsed.abstract) body.abstract = parsed.abstract;
    if (authors.length) body.authors = authors;

    mutation.mutate(body);
  });

  return (
    <FormShell
      backHref="/publications"
      backLabel="Back to publications"
      title="New publication"
      description="Add a paper, article, or other research output to your record."
    >
      <form
        onSubmit={(e) => {
          void onSubmit(e);
        }}
        className="flex flex-col gap-4"
        noValidate
      >
        <FormField label="Title" error={errors.title?.message}>
          {(field) => (
            <Input {...field} {...register('title')} placeholder="A Study of…" autoFocus />
          )}
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Type" error={errors.type?.message}>
            {(field) => (
              <Select {...field} {...register('type')}>
                {PUBLICATION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {humanizeStatus(t)}
                  </option>
                ))}
              </Select>
            )}
          </FormField>

          <FormField label="Year" error={errors.year?.message} optional>
            {(field) => (
              <Input
                {...field}
                {...register('year')}
                type="number"
                inputMode="numeric"
                placeholder="2026"
              />
            )}
          </FormField>
        </div>

        <FormField
          label="Authors"
          error={errors.authors?.message}
          hint="Comma-separated, in author order."
          optional
        >
          {(field) => (
            <Input {...field} {...register('authors')} placeholder="Ada Lovelace, Alan Turing" />
          )}
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="DOI" error={errors.doi?.message} optional>
            {(field) => <Input {...field} {...register('doi')} placeholder="10.1000/xyz123" />}
          </FormField>
          <FormField label="URL" error={errors.url?.message} optional>
            {(field) => (
              <Input {...field} {...register('url')} type="url" placeholder="https://…" />
            )}
          </FormField>
        </div>

        <FormField
          label="Keywords"
          error={errors.keywords?.message}
          hint="Comma-separated."
          optional
        >
          {(field) => (
            <Input {...field} {...register('keywords')} placeholder="machine learning, nlp" />
          )}
        </FormField>

        <FormField label="Abstract" error={errors.abstract?.message} optional>
          {(field) => (
            <Textarea
              {...field}
              {...register('abstract')}
              rows={5}
              placeholder="Summarize the work…"
            />
          )}
        </FormField>

        <FormActions
          cancelHref="/publications"
          submitLabel="Create publication"
          submittingLabel="Creating…"
          isSubmitting={isSubmitting || mutation.isPending}
        />
      </form>
    </FormShell>
  );
}

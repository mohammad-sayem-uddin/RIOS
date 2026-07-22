'use client';

/**
 * RIOS — New Patent
 *
 * Create form backed by POST /api/v1/patents (✅ verified), mirroring
 * CreatePatentDto (patentNumber + patentType + status + filingDate required).
 * `profileId` is injected.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { Lightbulb } from 'lucide-react';
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
import { PATENT_TYPES, patentSchema, type PatentFormValues } from '@/lib/domain-schemas';
import { recognitionService } from '@/lib/services';
import { humanizeStatus } from '@/lib/status';

const PATENT_STATUSES = ['FILED', 'PENDING', 'GRANTED', 'EXPIRED', 'REJECTED'] as const;

export default function NewPatentPage() {
  const router = useRouter();
  const profile = useMyProfile();
  const profileId = profile.data?.id;
  const invalidate = useInvalidateOnSuccess([['patents']]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatentFormValues>({
    resolver: zodResolver(patentSchema),
    defaultValues: {
      title: '',
      patentNumber: '',
      patentType: 'UTILITY',
      status: 'FILED',
      filingDate: '',
      assigneeOrganization: '',
      abstract: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (body: unknown) => recognitionService.createPatent(body),
    onSuccess: () => {
      invalidate();
      toast.success('Patent added');
      router.replace('/recognition/patents');
    },
    onError: (error) => toast.error(mapAuthError(error)),
  });

  if (profile.isLoading) return <ListLoading rows={4} />;

  if (!profileId) {
    return (
      <EmptyState
        icon={<Lightbulb className="h-6 w-6" />}
        title="Create your research profile first"
        description="Recognition is attached to your research profile. Set one up to get started."
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
    const body: Record<string, unknown> = {
      profileId,
      title: values.title.trim(),
      patentNumber: values.patentNumber.trim(),
      patentType: values.patentType,
      status: values.status.trim(),
      filingDate: values.filingDate,
    };
    if (values.assigneeOrganization) body.assigneeOrganization = values.assigneeOrganization.trim();
    if (values.abstract) body.abstract = values.abstract.trim();

    mutation.mutate(body);
  });

  return (
    <FormShell
      backHref="/recognition/patents"
      backLabel="Back to patents"
      title="Add patent"
      description="Record a patent application or grant."
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
            <Input {...field} {...register('title')} placeholder="Patent title" autoFocus />
          )}
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Patent number" error={errors.patentNumber?.message}>
            {(field) => (
              <Input {...field} {...register('patentNumber')} placeholder="e.g. US1234567B2" />
            )}
          </FormField>
          <FormField label="Filing date" error={errors.filingDate?.message}>
            {(field) => <Input {...field} {...register('filingDate')} type="date" />}
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Type" error={errors.patentType?.message}>
            {(field) => (
              <Select {...field} {...register('patentType')}>
                {PATENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {humanizeStatus(t)}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField label="Status" error={errors.status?.message}>
            {(field) => (
              <Select {...field} {...register('status')}>
                {PATENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {humanizeStatus(s)}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
        </div>

        <FormField
          label="Assignee organization"
          error={errors.assigneeOrganization?.message}
          optional
        >
          {(field) => (
            <Input {...field} {...register('assigneeOrganization')} placeholder="e.g. Acme Labs" />
          )}
        </FormField>

        <FormField label="Abstract" error={errors.abstract?.message} optional>
          {(field) => (
            <Textarea
              {...field}
              {...register('abstract')}
              rows={4}
              placeholder="Optional summary…"
            />
          )}
        </FormField>

        <FormActions
          cancelHref="/recognition/patents"
          submitLabel="Add patent"
          submittingLabel="Adding…"
          isSubmitting={isSubmitting || mutation.isPending}
        />
      </form>
    </FormShell>
  );
}

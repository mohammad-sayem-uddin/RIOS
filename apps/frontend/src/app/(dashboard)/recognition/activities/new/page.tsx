'use client';

/**
 * RIOS — New Professional Activity
 *
 * Create form backed by POST /api/v1/professional-activities (✅ verified),
 * mirroring CreateProfessionalActivityDto (category + title required).
 * `profileId` is injected.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { Users } from 'lucide-react';
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
import { ACTIVITY_CATEGORIES, activitySchema, type ActivityFormValues } from '@/lib/domain-schemas';
import { recognitionService } from '@/lib/services';
import { humanizeStatus } from '@/lib/status';

export default function NewActivityPage() {
  const router = useRouter();
  const profile = useMyProfile();
  const profileId = profile.data?.id;
  const invalidate = useInvalidateOnSuccess([['activities']]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: '',
      category: 'SERVICE',
      organization: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (body: unknown) => recognitionService.createActivity(body),
    onSuccess: () => {
      invalidate();
      toast.success('Activity added');
      router.replace('/recognition/activities');
    },
    onError: (error) => toast.error(mapAuthError(error)),
  });

  if (profile.isLoading) return <ListLoading rows={4} />;

  if (!profileId) {
    return (
      <EmptyState
        icon={<Users className="h-6 w-6" />}
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
      category: values.category,
    };
    if (values.organization) body.organization = values.organization.trim();
    if (values.role) body.role = values.role.trim();
    if (values.startDate) body.startDate = values.startDate;
    if (values.endDate) body.endDate = values.endDate;
    if (values.description) body.description = values.description.trim();

    mutation.mutate(body);
  });

  return (
    <FormShell
      backHref="/recognition/activities"
      backLabel="Back to activities"
      title="Add professional activity"
      description="Record editorial work, committee service, talks, and other contributions."
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
            <Input
              {...field}
              {...register('title')}
              placeholder="Program Committee Member"
              autoFocus
            />
          )}
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Category" error={errors.category?.message}>
            {(field) => (
              <Select {...field} {...register('category')}>
                {ACTIVITY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {humanizeStatus(c)}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField label="Role" error={errors.role?.message} optional>
            {(field) => <Input {...field} {...register('role')} placeholder="e.g. Reviewer" />}
          </FormField>
        </div>

        <FormField label="Organization" error={errors.organization?.message} optional>
          {(field) => <Input {...field} {...register('organization')} placeholder="e.g. NeurIPS" />}
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Start date" error={errors.startDate?.message} optional>
            {(field) => <Input {...field} {...register('startDate')} type="date" />}
          </FormField>
          <FormField label="End date" error={errors.endDate?.message} optional>
            {(field) => <Input {...field} {...register('endDate')} type="date" />}
          </FormField>
        </div>

        <FormField label="Description" error={errors.description?.message} optional>
          {(field) => (
            <Textarea
              {...field}
              {...register('description')}
              rows={3}
              placeholder="Optional details…"
            />
          )}
        </FormField>

        <FormActions
          cancelHref="/recognition/activities"
          submitLabel="Add activity"
          submittingLabel="Adding…"
          isSubmitting={isSubmitting || mutation.isPending}
        />
      </form>
    </FormShell>
  );
}

'use client';

/**
 * RIOS — New Award
 *
 * Create form backed by POST /api/v1/awards (✅ verified), mirroring
 * CreateAwardDto (category + sponsorOrAgency + awardDate — note these differ
 * from the display type in @/types/api). `profileId` is injected.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { Award } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { EmptyState, ListLoading } from '@/components/feedback/data-states';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormActions, FormShell } from '@/components/workspace/form-shell';
import { useMyProfile, useMutation, useInvalidateOnSuccess } from '@/hooks/use-domain-queries';
import { mapAuthError } from '@/lib/auth-errors';
import { awardSchema, type AwardFormValues } from '@/lib/domain-schemas';
import { recognitionService } from '@/lib/services';

export default function NewAwardPage() {
  const router = useRouter();
  const profile = useMyProfile();
  const profileId = profile.data?.id;
  const invalidate = useInvalidateOnSuccess([['awards']]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AwardFormValues>({
    resolver: zodResolver(awardSchema),
    defaultValues: { title: '', category: '', sponsorOrAgency: '', awardDate: '', description: '' },
  });

  const mutation = useMutation({
    mutationFn: (body: unknown) => recognitionService.createAward(body),
    onSuccess: () => {
      invalidate();
      toast.success('Award added');
      router.replace('/recognition/awards');
    },
    onError: (error) => toast.error(mapAuthError(error)),
  });

  if (profile.isLoading) return <ListLoading rows={4} />;

  if (!profileId) {
    return (
      <EmptyState
        icon={<Award className="h-6 w-6" />}
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
      category: values.category.trim(),
    };
    if (values.sponsorOrAgency) body.sponsorOrAgency = values.sponsorOrAgency.trim();
    if (values.awardDate) body.awardDate = values.awardDate;
    if (values.description) body.description = values.description.trim();

    mutation.mutate(body);
  });

  return (
    <FormShell
      backHref="/recognition/awards"
      backLabel="Back to awards"
      title="Add award"
      description="Record an award or honor you've received."
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
            <Input {...field} {...register('title')} placeholder="Best Paper Award" autoFocus />
          )}
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Category"
            error={errors.category?.message}
            hint="e.g. Research, Teaching, Service"
          >
            {(field) => <Input {...field} {...register('category')} placeholder="Research" />}
          </FormField>
          <FormField label="Award date" error={errors.awardDate?.message} optional>
            {(field) => <Input {...field} {...register('awardDate')} type="date" />}
          </FormField>
        </div>

        <FormField label="Sponsor or agency" error={errors.sponsorOrAgency?.message} optional>
          {(field) => <Input {...field} {...register('sponsorOrAgency')} placeholder="e.g. ACM" />}
        </FormField>

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
          cancelHref="/recognition/awards"
          submitLabel="Add award"
          submittingLabel="Adding…"
          isSubmitting={isSubmitting || mutation.isPending}
        />
      </form>
    </FormShell>
  );
}

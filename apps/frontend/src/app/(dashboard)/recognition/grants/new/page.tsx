'use client';

/**
 * RIOS — New Grant
 *
 * Create form backed by POST /api/v1/grants (✅ verified), mirroring
 * CreateGrantDto (grantNumber + fundingAgency + amount are required).
 * `profileId` is injected.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { HandCoins } from 'lucide-react';
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
import { grantSchema, type GrantFormValues } from '@/lib/domain-schemas';
import { recognitionService } from '@/lib/services';

export default function NewGrantPage() {
  const router = useRouter();
  const profile = useMyProfile();
  const profileId = profile.data?.id;
  const invalidate = useInvalidateOnSuccess([['grants']]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GrantFormValues>({
    resolver: zodResolver(grantSchema),
    defaultValues: {
      title: '',
      grantNumber: '',
      fundingAgency: '',
      amount: undefined,
      currency: 'USD',
      startDate: '',
      endDate: '',
      description: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (body: unknown) => recognitionService.createGrant(body),
    onSuccess: () => {
      invalidate();
      toast.success('Grant added');
      router.replace('/recognition/grants');
    },
    onError: (error) => toast.error(mapAuthError(error)),
  });

  if (profile.isLoading) return <ListLoading rows={4} />;

  if (!profileId) {
    return (
      <EmptyState
        icon={<HandCoins className="h-6 w-6" />}
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
      grantNumber: values.grantNumber.trim(),
      fundingAgency: values.fundingAgency.trim(),
      amount: Number(values.amount),
      currency: values.currency.trim().toUpperCase(),
      startDate: values.startDate,
      endDate: values.endDate,
    };
    if (values.description) body.description = values.description.trim();

    mutation.mutate(body);
  });

  return (
    <FormShell
      backHref="/recognition/grants"
      backLabel="Back to grants"
      title="Add grant"
      description="Record a research grant or funding award."
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
            <Input {...field} {...register('title')} placeholder="Grant title" autoFocus />
          )}
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Grant number" error={errors.grantNumber?.message}>
            {(field) => (
              <Input {...field} {...register('grantNumber')} placeholder="e.g. NSF-1234567" />
            )}
          </FormField>
          <FormField label="Funding agency" error={errors.fundingAgency?.message}>
            {(field) => <Input {...field} {...register('fundingAgency')} placeholder="e.g. NSF" />}
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Amount" error={errors.amount?.message}>
            {(field) => (
              <Input
                {...field}
                {...register('amount')}
                type="number"
                inputMode="decimal"
                min={0}
                placeholder="50000"
              />
            )}
          </FormField>
          <FormField label="Currency" error={errors.currency?.message}>
            {(field) => (
              <Input {...field} {...register('currency')} placeholder="USD" maxLength={3} />
            )}
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Start date" error={errors.startDate?.message}>
            {(field) => <Input {...field} {...register('startDate')} type="date" />}
          </FormField>
          <FormField label="End date" error={errors.endDate?.message}>
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
          cancelHref="/recognition/grants"
          submitLabel="Add grant"
          submittingLabel="Adding…"
          isSubmitting={isSubmitting || mutation.isPending}
        />
      </form>
    </FormShell>
  );
}

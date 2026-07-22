'use client';

/**
 * RIOS — New Research Asset
 *
 * Create form backed by POST /api/v1/datasets (✅ verified), mirroring
 * CreateDatasetDto. `profileId` is injected from the resolved research profile;
 * empty optional fields are omitted so the backend applies its defaults.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { Database } from 'lucide-react';
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
import { datasetSchema, type DatasetFormValues } from '@/lib/domain-schemas';
import { assetsService } from '@/lib/services';

const VISIBILITY_OPTIONS = [
  { value: 'PUBLIC', label: 'Public' },
  { value: 'INTERNAL', label: 'Internal' },
  { value: 'RESTRICTED', label: 'Restricted' },
  { value: 'PRIVATE', label: 'Private' },
] as const;

export default function NewAssetPage() {
  const router = useRouter();
  const profile = useMyProfile();
  const profileId = profile.data?.id;
  const invalidate = useInvalidateOnSuccess([['datasets']]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DatasetFormValues>({
    resolver: zodResolver(datasetSchema),
    defaultValues: {
      title: '',
      description: '',
      license: '',
      visibility: 'PUBLIC',
      datasetUrl: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (body: unknown) => assetsService.createDataset(body),
    onSuccess: () => {
      invalidate();
      toast.success('Dataset created');
      router.replace('/assets');
    },
    onError: (error) => toast.error(mapAuthError(error)),
  });

  if (profile.isLoading) return <ListLoading rows={4} />;

  if (!profileId) {
    return (
      <EmptyState
        icon={<Database className="h-6 w-6" />}
        title="Create your research profile first"
        description="Research assets are attached to your research profile. Set one up to get started."
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
      description: values.description.trim(),
    };
    if (values.visibility) body.visibility = values.visibility;
    if (values.license) body.license = values.license.trim();
    if (values.datasetUrl) body.datasetUrl = values.datasetUrl.trim();

    mutation.mutate(body);
  });

  return (
    <FormShell
      backHref="/assets"
      backLabel="Back to assets"
      title="New dataset"
      description="Register a dataset so it can be cited, versioned, and shared."
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
            <Input {...field} {...register('title')} placeholder="Dataset title" autoFocus />
          )}
        </FormField>

        <FormField label="Description" error={errors.description?.message}>
          {(field) => (
            <Textarea
              {...field}
              {...register('description')}
              rows={4}
              placeholder="What does this dataset contain?"
            />
          )}
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Visibility" error={errors.visibility?.message}>
            {(field) => (
              <Select {...field} {...register('visibility')}>
                {VISIBILITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField label="License" error={errors.license?.message} optional>
            {(field) => <Input {...field} {...register('license')} placeholder="e.g. CC-BY-4.0" />}
          </FormField>
        </div>

        <FormField label="Dataset URL" error={errors.datasetUrl?.message} optional>
          {(field) => (
            <Input {...field} {...register('datasetUrl')} type="url" placeholder="https://…" />
          )}
        </FormField>

        <FormActions
          cancelHref="/assets"
          submitLabel="Create dataset"
          submittingLabel="Creating…"
          isSubmitting={isSubmitting || mutation.isPending}
        />
      </form>
    </FormShell>
  );
}

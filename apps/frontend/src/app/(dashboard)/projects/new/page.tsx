'use client';

/**
 * RIOS — New Research Project
 *
 * Create form backed by POST /api/v1/research-projects (✅ verified). Mirrors
 * CreateResearchProjectApiRequestDto: `profileId` is injected, `members` starts
 * empty (added later on the detail page), and empty optional fields are omitted.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { FolderKanban } from 'lucide-react';
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
import { projectSchema, type ProjectFormValues } from '@/lib/domain-schemas';
import { projectsService } from '@/lib/services';
import { useAuth } from '@/providers/auth-provider';

export default function NewProjectPage() {
  const router = useRouter();
  const { user } = useAuth();
  const profile = useMyProfile();
  const profileId = profile.data?.id ?? user?.id;
  const invalidate = useInvalidateOnSuccess([['projects']]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      fundingAgency: '',
      grantIdentifier: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (body: unknown) => projectsService.create(body),
    onSuccess: (created: { id?: string }) => {
      invalidate();
      toast.success('Project created');
      router.replace(created?.id ? `/projects/${created.id}` : '/projects');
    },
    onError: (error) => toast.error(mapAuthError(error)),
  });

  if (profile.isLoading) return <ListLoading rows={4} />;

  if (!profileId) {
    return (
      <EmptyState
        icon={<FolderKanban className="h-6 w-6" />}
        title="Create your research profile first"
        description="Projects are attached to your research profile. Set one up to get started."
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
      startDate: values.startDate,
      members: [],
    };
    if (values.endDate) body.endDate = values.endDate;
    if (values.fundingAgency) body.fundingAgency = values.fundingAgency;
    if (values.grantIdentifier) body.grantIdentifier = values.grantIdentifier;

    mutation.mutate(body);
  });

  return (
    <FormShell
      backHref="/projects"
      backLabel="Back to projects"
      title="New research project"
      description="Track a new project through its lifecycle."
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
            <Input {...field} {...register('title')} placeholder="Project title" autoFocus />
          )}
        </FormField>

        <FormField label="Description" error={errors.description?.message}>
          {(field) => (
            <Textarea
              {...field}
              {...register('description')}
              rows={4}
              placeholder="What is this project about?"
            />
          )}
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Start date" error={errors.startDate?.message}>
            {(field) => <Input {...field} {...register('startDate')} type="date" />}
          </FormField>
          <FormField label="End date" error={errors.endDate?.message} optional>
            {(field) => <Input {...field} {...register('endDate')} type="date" />}
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Funding agency" error={errors.fundingAgency?.message} optional>
            {(field) => <Input {...field} {...register('fundingAgency')} placeholder="e.g. NSF" />}
          </FormField>
          <FormField label="Grant identifier" error={errors.grantIdentifier?.message} optional>
            {(field) => (
              <Input {...field} {...register('grantIdentifier')} placeholder="e.g. 1234567" />
            )}
          </FormField>
        </div>

        <FormActions
          cancelHref="/projects"
          submitLabel="Create project"
          submittingLabel="Creating…"
          isSubmitting={isSubmitting || mutation.isPending}
        />
      </form>
    </FormShell>
  );
}

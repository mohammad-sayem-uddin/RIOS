'use client';

/**
 * RIOS — Research Profile / Academic Identity
 *
 * The researcher's academic identity: headline, biography, education,
 * experience, interests, skills, and external profiles. Backed by
 * GET /api/v1/users/:userId/research-profile (✅ verified).
 *
 * When no profile exists yet (404), guides the user to onboarding rather than
 * showing an error — a missing profile is an expected first-run state.
 */

import {
  GraduationCap,
  Briefcase,
  Sparkles,
  Wrench,
  Link2,
  Pencil,
  ExternalLink,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';

import { ListLoading, EmptyState } from '@/components/feedback/data-states';
import { PageHeader } from '@/components/layout/page-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMyProfile } from '@/hooks/use-domain-queries';
import { getInitials, formatDate } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import type { Education, Experience, ExternalProfile, ResearchInterest, Skill } from '@/types/api';

export default function ProfilePage() {
  const { user } = useAuth();
  const query = useMyProfile();

  if (query.isLoading) return <ListLoading rows={4} />;

  // A missing profile (404 / no data) is an expected pre-onboarding state.
  if (!query.data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Research Profile" description="Your academic identity." />
        <EmptyState
          icon={<UserPlus className="h-6 w-6" />}
          title="You haven't set up your profile yet"
          description="Complete a short setup to create your research identity — it takes about two minutes."
          action={
            <Link href="/onboarding">
              <Button>
                <Sparkles className="h-4 w-4" />
                Set up profile
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const profile = query.data;

  return (
    <div className="space-y-6">
      <PageHeader title="Research Profile" description="Your academic identity across RIOS.">
        <Link href="/profile/edit">
          <Button variant="outline">
            <Pencil className="h-4 w-4" />
            Edit profile
          </Button>
        </Link>
      </PageHeader>

      {/* Identity header */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary/10 text-xl text-primary">
              {getInitials(user?.displayName ?? profile.title)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold tracking-tight">
              {user?.displayName ?? profile.title}
            </h2>
            <p className="text-sm text-muted-foreground">{profile.title}</p>
            {profile.headline && <p className="mt-1 text-sm">{profile.headline}</p>}
          </div>
          {profile.externalProfiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.externalProfiles.map((ext: ExternalProfile) => (
                <a
                  key={ext.id}
                  href={ext.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium hover:bg-accent"
                >
                  <Link2 className="h-3 w-3" />
                  {ext.provider.replace(/_/g, ' ')}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Biography */}
      {profile.biography && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {profile.biography}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Education */}
        <Section
          icon={<GraduationCap className="h-4 w-4" />}
          title="Education"
          empty={profile.education.length === 0}
          emptyText="No education added."
        >
          {profile.education.map((edu: Education) => (
            <div key={edu.id} className="border-l-2 border-border pl-4">
              <p className="font-medium">{edu.degree}</p>
              <p className="text-sm text-muted-foreground">
                {edu.fieldOfStudy} · {edu.institution}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(edu.startDate)} – {edu.isCurrent ? 'Present' : formatDate(edu.endDate)}
              </p>
            </div>
          ))}
        </Section>

        {/* Experience */}
        <Section
          icon={<Briefcase className="h-4 w-4" />}
          title="Experience"
          empty={profile.experience.length === 0}
          emptyText="No experience added."
        >
          {profile.experience.map((exp: Experience) => (
            <div key={exp.id} className="border-l-2 border-border pl-4">
              <p className="font-medium">{exp.positionTitle}</p>
              <p className="text-sm text-muted-foreground">{exp.organization}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(exp.startDate)} – {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
              </p>
            </div>
          ))}
        </Section>

        {/* Research interests */}
        <Section
          icon={<Sparkles className="h-4 w-4" />}
          title="Research Interests"
          empty={profile.researchInterests.length === 0}
          emptyText="No interests added."
        >
          <div className="flex flex-wrap gap-2">
            {profile.researchInterests.map((interest: ResearchInterest) => (
              <Badge key={interest.id} variant="secondary">
                {interest.name}
              </Badge>
            ))}
          </div>
        </Section>

        {/* Skills */}
        <Section
          icon={<Wrench className="h-4 w-4" />}
          title="Skills"
          empty={profile.skills.length === 0}
          emptyText="No skills added."
        >
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill: Skill) => (
              <Badge key={skill.id} variant="outline">
                {skill.name}
              </Badge>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  empty,
  emptyText,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  empty: boolean;
  emptyText: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {empty ? <p className="text-sm text-muted-foreground">{emptyText}</p> : children}
      </CardContent>
    </Card>
  );
}

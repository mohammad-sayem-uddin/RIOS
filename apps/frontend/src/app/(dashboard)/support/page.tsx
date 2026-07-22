'use client';

/**
 * RIOS — Support & Help Center
 *
 * Static help entry point (no backend contract). Provides guidance links and a
 * mailto contact path. Lives inside the authenticated shell.
 */

import { LifeBuoy, BookOpen, MessageSquare, Mail } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const RESOURCES: Array<{ icon: React.ReactNode; title: string; description: string }> = [
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: 'Documentation',
    description: 'Guides for building your research identity, publications, and portfolio.',
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: 'Community',
    description: 'Ask questions and share workflows with other researchers.',
  },
  {
    icon: <LifeBuoy className="h-5 w-5" />,
    title: 'Troubleshooting',
    description: 'Resolve common issues with accounts, uploads, and integrations.',
  },
];

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Support"
        description="Get help with RIOS and find answers to common questions."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {RESOURCES.map((resource) => (
          <Card key={resource.title}>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {resource.icon}
              </div>
              <CardTitle className="mt-2 text-base">{resource.title}</CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Still need help?</CardTitle>
          <CardDescription>
            Reach out to our support team and we&apos;ll get back to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a href="mailto:support@rios.example">
            <Button variant="outline">
              <Mail className="h-4 w-4" />
              Contact support
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

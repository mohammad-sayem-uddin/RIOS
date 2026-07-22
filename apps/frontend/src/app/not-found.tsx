/**
 * RIOS — 404 Not Found
 *
 * App Router special file. Rendered for unmatched routes.
 */

import { FileQuestion } from 'lucide-react';

import { StatusScreen } from '@/components/feedback/status-screen';

export default function NotFound() {
  return (
    <StatusScreen
      icon={<FileQuestion />}
      code="404"
      title="Page not found"
      description="The page you're looking for doesn't exist or may have been moved."
      actions={[
        { label: 'Go to dashboard', href: '/' },
        { label: 'Search', href: '/search', variant: 'outline' },
      ]}
    />
  );
}

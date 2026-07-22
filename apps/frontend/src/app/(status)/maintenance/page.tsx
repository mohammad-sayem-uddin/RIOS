/**
 * RIOS — Maintenance Mode
 *
 * Static status page shown when the platform is undergoing maintenance.
 * Not wired to a live signal yet — reachable directly and usable as a
 * fallback destination.
 */

import { Wrench } from 'lucide-react';

import { StatusScreen } from '@/components/feedback/status-screen';

export default function MaintenancePage() {
  return (
    <StatusScreen
      icon={<Wrench />}
      title="We'll be right back"
      description="RIOS is undergoing scheduled maintenance to improve your experience. Please check back shortly."
      actions={[{ label: 'Retry', href: '/' }]}
    />
  );
}

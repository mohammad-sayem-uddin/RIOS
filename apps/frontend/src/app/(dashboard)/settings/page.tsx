'use client';

/**
 * RIOS — Researcher Control Center (Settings)
 *
 * Account, security, appearance, and preferences. Reads the authenticated user
 * from AuthProvider (GET /api/v1/auth/me ✅). Account fields are read-only —
 * the backend exposes no user-profile update endpoint (see report). Appearance
 * (theme) and local preferences persist client-side.
 */

import { User as UserIcon, Shield, Palette, SlidersHorizontal, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn, formatDate } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';

type SettingsTab = 'account' | 'security' | 'appearance' | 'preferences';

const TABS: Array<{ key: SettingsTab; label: string; icon: React.ReactNode }> = [
  { key: 'account', label: 'Account', icon: <UserIcon className="h-4 w-4" /> },
  { key: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
  { key: 'appearance', label: 'Appearance', icon: <Palette className="h-4 w-4" /> },
  { key: 'preferences', label: 'Preferences', icon: <SlidersHorizontal className="h-4 w-4" /> },
];

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>('account');
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account, security, and preferences." />

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Tab nav */}
        <nav
          className="flex gap-1 overflow-x-auto lg:w-48 lg:flex-col"
          aria-label="Settings sections"
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              aria-current={tab === t.key ? 'page' : undefined}
              className={cn(
                'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                tab === t.key
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50',
              )}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>

        <div className="flex-1">
          {tab === 'account' && <AccountSection user={user} />}
          {tab === 'security' && <SecuritySection onLogout={() => void logout()} />}
          {tab === 'appearance' && <AppearanceSection />}
          {tab === 'preferences' && <PreferencesSection />}
        </div>
      </div>
    </div>
  );
}

function AccountSection({
  user,
}: {
  user: {
    displayName: string;
    email: string;
    roles: string[];
    status: string;
    createdAt: string;
    lastLoginAt: string | null;
  } | null;
}) {
  if (!user) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Account information</CardTitle>
        <CardDescription>Your identity details as stored in RIOS.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <Field label="Display name" value={user.displayName} />
        <Separator />
        <Field label="Email" value={user.email} />
        <Separator />
        <Field
          label="Roles"
          value={
            <div className="flex flex-wrap justify-end gap-1">
              {user.roles.length > 0 ? (
                user.roles.map((r) => (
                  <Badge key={r} variant="secondary">
                    {r}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>
          }
        />
        <Separator />
        <Field label="Status" value={<Badge variant="outline">{user.status}</Badge>} />
        <Separator />
        <Field label="Member since" value={formatDate(user.createdAt)} />
        <Separator />
        <Field label="Last login" value={formatDate(user.lastLoginAt)} />

        <p className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
          Account details are managed by your identity provider. Editing is not yet available
          through this interface.
        </p>
      </CardContent>
    </Card>
  );
}

function SecuritySection({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sessions</CardTitle>
          <CardDescription>Sign out of your current session on this device.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Password</CardTitle>
          <CardDescription>Update the password used to sign in.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Password management is handled through the account recovery flow. Use{' '}
            <a href="/forgot-password" className="font-medium text-primary hover:underline">
              Forgot password
            </a>{' '}
            to reset your password.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const options = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Appearance</CardTitle>
        <CardDescription>Choose how RIOS looks to you.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              aria-pressed={theme === opt.value}
              className={cn(
                'rounded-lg border p-4 text-sm font-medium transition-colors',
                theme === opt.value ? 'border-primary bg-primary/5' : 'hover:bg-accent',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PreferencesSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Preferences</CardTitle>
        <CardDescription>Personalize your RIOS experience.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Additional preferences (notifications, language, default views) will appear here as the
          corresponding backend capabilities become available.
        </p>
      </CardContent>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

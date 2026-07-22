'use client';

/**
 * RIOS — Top Navigation Bar
 *
 * Contains breadcrumbs, global search trigger (opens the command palette),
 * notifications, theme toggle, and the user menu.
 */

import { Search, Menu } from 'lucide-react';

import { Breadcrumb } from '@/components/layout/breadcrumb';
import { NotificationCenter } from '@/components/layout/notification-center';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { UserMenu } from '@/components/layout/user-menu';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUI } from '@/providers/ui-provider';

interface TopNavigationProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function TopNavigation({ onMenuClick, showMenuButton }: TopNavigationProps) {
  const { openCommandPalette } = useUI();

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6">
      {/* Left: Menu button (mobile) + breadcrumbs */}
      <div className="flex items-center gap-2">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onMenuClick}
            className="lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <div className="hidden sm:block">
          <Breadcrumb />
        </div>
      </div>

      {/* Right: search, notifications, theme, profile */}
      <div className="flex items-center gap-1">
        {/* Command palette trigger */}
        <Button
          variant="ghost"
          size="sm"
          onClick={openCommandPalette}
          className="hidden items-center gap-2 text-muted-foreground md:flex"
          aria-label="Search (open command palette)"
        >
          <Search className="h-4 w-4" />
          <span className="text-xs">Search...</span>
          <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            ⌘K
          </kbd>
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={openCommandPalette}
          className="md:hidden"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>

        <NotificationCenter />

        <ThemeToggle />

        <Separator orientation="vertical" className="mx-1 h-6" />

        <UserMenu />
      </div>
    </header>
  );
}

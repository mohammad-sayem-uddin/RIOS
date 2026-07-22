'use client';

/**
 * RIOS — Sidebar Navigation
 *
 * Collapsible primary navigation with section grouping, active state, keyboard
 * accessibility, and an icon-only collapsed mode. All destinations are derived
 * from the shared navigation config ([lib/navigation.ts]) so new areas are
 * added in exactly one place.
 */

import { ChevronLeft, ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { NAV_SECTIONS, BOTTOM_NAV_ITEMS, type NavItem, type NavSection } from '@/lib/navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  /** Called when a navigation item is activated (used to close the mobile drawer). */
  onNavigate?: () => void;
}

/** Determine whether a nav href matches the current pathname. */
function useIsActive() {
  const pathname = usePathname();
  return (href: string): boolean => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };
}

export function Sidebar({ collapsed, onToggle, onNavigate }: SidebarProps) {
  const isActive = useIsActive();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out',
          collapsed ? 'w-16' : 'w-64',
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo & collapse toggle */}
        <div
          className={cn(
            'flex h-14 items-center border-b border-sidebar-border px-3',
            collapsed ? 'justify-center' : 'justify-between',
          )}
        >
          {!collapsed && (
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="RIOS Home"
              onClick={onNavigate}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                R
              </div>
              <span className="text-sm font-semibold tracking-tight">RIOS</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft
              className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
            />
          </Button>
        </div>

        {/* Navigation sections */}
        <ScrollArea className="flex-1 px-2 py-2">
          <nav className="flex flex-col gap-1">
            {NAV_SECTIONS.map((section) => (
              <SidebarSection
                key={section.title}
                section={section}
                collapsed={collapsed}
                isActive={isActive}
                onNavigate={onNavigate}
              />
            ))}
          </nav>
        </ScrollArea>

        {/* Bottom items */}
        <Separator />
        <div className="flex flex-col gap-1 px-2 py-2">
          {BOTTOM_NAV_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.href}
              item={item}
              collapsed={collapsed}
              active={isActive(item.href)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </aside>
    </TooltipProvider>
  );
}

function SidebarSection({
  section,
  collapsed,
  isActive,
  onNavigate,
}: {
  section: NavSection;
  collapsed: boolean;
  isActive: (href: string) => boolean;
  onNavigate?: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  if (collapsed) {
    return (
      <div className="flex flex-col gap-1 py-1">
        {section.items.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            collapsed
            active={isActive(item.href)}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="py-1">
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-md px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
        aria-expanded={expanded}
      >
        {section.title}
        {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </button>
      {expanded && (
        <div className="mt-1 flex flex-col gap-0.5">
          {section.items.map((item) => (
            <SidebarNavItem
              key={item.href}
              item={item}
              collapsed={false}
              active={isActive(item.href)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarNavItem({
  item,
  collapsed,
  active,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const content = (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
        collapsed && 'justify-center px-0',
      )}
      aria-current={active ? 'page' : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

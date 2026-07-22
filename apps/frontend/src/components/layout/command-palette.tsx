'use client';

/**
 * RIOS — Command Palette
 *
 * ⌘K / Ctrl+K quick navigation and command launcher. Built on the Dialog
 * primitive with a filterable command list. The command registry is
 * extensible: navigation commands are derived from the shared navigation
 * config today, and future sources (AI actions, entity search) can be added
 * by pushing additional `CommandGroup`s without changing this component.
 *
 * Loaded lazily from the app shell so its cost is only paid on first open.
 */

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Search, Sun, Moon, Monitor, LogOut, CornerDownLeft, type LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useMemo, useState } from 'react';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { flattenNav } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useUI } from '@/providers/ui-provider';

interface Command {
  id: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
  keywords?: string;
  run: () => void;
}

interface CommandGroup {
  heading: string;
  commands: Command[];
}

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUI();
  const router = useRouter();
  const { setTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const [query, setQuery] = useState('');

  const close = () => {
    setCommandPaletteOpen(false);
    setQuery('');
  };

  const run = (fn: () => void) => {
    close();
    fn();
  };

  const groups = useMemo<CommandGroup[]>(() => {
    const navCommands: Command[] = flattenNav().map((item) => ({
      id: `nav:${item.href}`,
      label: item.label,
      hint: item.section,
      icon: item.icon,
      keywords: `${item.section} ${item.label}`,
      run: () => router.push(item.href),
    }));

    const themeCommands: Command[] = [
      {
        id: 'theme:light',
        label: 'Switch to Light theme',
        icon: Sun,
        keywords: 'theme light appearance',
        run: () => setTheme('light'),
      },
      {
        id: 'theme:dark',
        label: 'Switch to Dark theme',
        icon: Moon,
        keywords: 'theme dark appearance',
        run: () => setTheme('dark'),
      },
      {
        id: 'theme:system',
        label: 'Use System theme',
        icon: Monitor,
        keywords: 'theme system appearance',
        run: () => setTheme('system'),
      },
    ];

    const accountCommands: Command[] = isAuthenticated
      ? [
          {
            id: 'account:logout',
            label: 'Log out',
            icon: LogOut,
            keywords: 'logout sign out session',
            run: () => void logout(),
          },
        ]
      : [];

    return [
      { heading: 'Navigation', commands: navCommands },
      { heading: 'Appearance', commands: themeCommands },
      ...(accountCommands.length ? [{ heading: 'Account', commands: accountCommands }] : []),
    ];
  }, [router, setTheme, isAuthenticated, logout]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((group) => ({
        ...group,
        commands: group.commands.filter((c) =>
          `${c.label} ${c.keywords ?? ''}`.toLowerCase().includes(q),
        ),
      }))
      .filter((group) => group.commands.length > 0);
  }, [groups, query]);

  const flatCommands = filtered.flatMap((g) => g.commands);
  const hasResults = flatCommands.length > 0;

  return (
    <Dialog
      open={commandPaletteOpen}
      onOpenChange={(open) => (open ? setCommandPaletteOpen(true) : close())}
    >
      <DialogContent
        showCloseButton={false}
        className="top-[20%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0"
        onKeyDown={(event) => {
          // Enter triggers the first result
          if (event.key === 'Enter' && flatCommands[0]) {
            event.preventDefault();
            run(flatCommands[0].run);
          }
        }}
      >
        <VisuallyHidden>
          <DialogTitle>Command Palette</DialogTitle>
        </VisuallyHidden>

        {/* Search input */}
        <div className="flex items-center gap-3 border-b px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages and commands..."
            aria-label="Search pages and commands"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="pointer-events-none hidden select-none items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          className="max-h-80 overflow-y-auto scrollbar-thin p-2"
          role="listbox"
          aria-label="Commands"
        >
          {hasResults ? (
            filtered.map((group) => (
              <div key={group.heading} className="mb-1">
                <p className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {group.heading}
                </p>
                {group.commands.map((command, index) => {
                  const Icon = command.icon;
                  const isFirst = flatCommands[0]?.id === command.id;
                  return (
                    <button
                      key={command.id}
                      type="button"
                      role="option"
                      aria-selected={isFirst}
                      onClick={() => run(command.run)}
                      className={cn(
                        'group flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:outline-none',
                        isFirst && index === 0 && 'bg-accent/50',
                      )}
                    >
                      <Icon
                        className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground"
                        aria-hidden="true"
                      />
                      <span className="flex-1 truncate">{command.label}</span>
                      {command.hint && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {command.hint}
                        </span>
                      )}
                      {isFirst && (
                        <CornerDownLeft
                          className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 py-10 text-center">
              <Search className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm font-medium">No results found</p>
              <p className="text-xs text-muted-foreground">Try a different search term</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

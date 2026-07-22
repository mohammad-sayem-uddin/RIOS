'use client';

/**
 * RIOS — User Menu
 *
 * Profile dropdown in the top navigation. Shows the authenticated user's
 * identity, quick links, and logout. Falls back to a Sign In action when
 * unauthenticated.
 */

import { LogOut, User as UserIcon, Settings, UserCircle } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getInitials } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-1">
        <Link href="/login">
          <Button variant="ghost" size="sm">
            <UserIcon className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </Link>
        <Link href="/settings">
          <Button variant="ghost" size="icon-sm" aria-label="Settings">
            <Settings className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open user menu"
        >
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary/10 text-xs text-primary">
              {getInitials(user.displayName)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium lg:block">{user.displayName}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate text-sm font-medium">{user.displayName}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserCircle className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => void logout()}>
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

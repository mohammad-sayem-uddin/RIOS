'use client';

/**
 * RIOS — Notification Center
 *
 * Dropdown panel triggered from the top navigation. Displays notifications
 * with unread badge, empty state, and mark-all-read affordance.
 *
 * NOTE: The backend does not yet expose a notifications API. This component
 * renders notifications supplied via the global UI store, which currently
 * starts empty. When a backend endpoint becomes available, wire it through
 * the UI provider (or a dedicated query hook) without changing this component.
 */

import { Bell, Check, Inbox } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn, formatRelativeTime } from '@/lib/utils';
import { useUI, type AppNotification } from '@/providers/ui-provider';

function NotificationRow({
  notification,
  onSelect,
}: {
  notification: AppNotification;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(notification.id)}
      className={cn(
        'flex w-full flex-col items-start gap-1 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        !notification.read && 'bg-accent/40',
      )}
    >
      <div className="flex w-full items-start justify-between gap-2">
        <span className="text-sm font-medium leading-snug text-foreground">
          {notification.title}
        </span>
        {!notification.read && (
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
        )}
      </div>
      {notification.description && (
        <span className="text-xs text-muted-foreground">{notification.description}</span>
      )}
      <span className="text-2xs text-muted-foreground">
        {formatRelativeTime(notification.createdAt)}
      </span>
    </button>
  );
}

export function NotificationCenter() {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    notificationsOpen,
    setNotificationsOpen,
  } = useUI();

  const hasNotifications = notifications.length > 0;

  return (
    <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative"
          aria-label={
            unreadNotificationCount > 0
              ? `Notifications, ${unreadNotificationCount} unread`
              : 'Notifications'
          }
        >
          <Bell className="h-4 w-4" />
          {unreadNotificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-2xs font-semibold text-destructive-foreground">
              {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2.5">
          <span className="text-sm font-semibold">Notifications</span>
          {unreadNotificationCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs text-muted-foreground"
              onClick={markAllNotificationsRead}
            >
              <Check className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>
        <Separator />

        {hasNotifications ? (
          <ScrollArea className="max-h-80">
            <div className="flex flex-col gap-0.5 p-1.5">
              {notifications.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  onSelect={markNotificationRead}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Inbox className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium">You're all caught up</p>
            <p className="text-xs text-muted-foreground">New notifications will appear here.</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

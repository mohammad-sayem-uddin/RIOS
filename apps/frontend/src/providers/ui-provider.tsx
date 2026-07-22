'use client';

/**
 * RIOS — Global UI State Provider
 *
 * Centralizes application-shell UI state that is independent of server data:
 * command palette visibility, mobile navigation drawer, and the notification
 * panel (including a client-side notification list).
 *
 * Server state lives in TanStack Query; auth lives in AuthProvider; theme lives
 * in next-themes. This provider owns ONLY ephemeral shell/chrome state so
 * components do not have to thread props through the layout tree.
 *
 * NOTE: The backend does not yet expose a notifications API (verified against
 * the presentation-layer routes). The notification list therefore starts empty
 * and is fed entirely from the client today. When an endpoint becomes
 * available, populate `notifications` from a query hook — no consumer of this
 * provider needs to change.
 */

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

/** A shell notification. Shape is intentionally minimal until a backend contract exists. */
export interface AppNotification {
  id: string;
  title: string;
  description?: string;
  /** ISO-8601 timestamp. */
  createdAt: string;
  read: boolean;
}

interface UIContextValue {
  /* Command palette */
  commandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;

  /* Mobile navigation drawer */
  mobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  setMobileNavOpen: (open: boolean) => void;

  /* Notification center */
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const UIContext = createContext<UIContextValue | undefined>(undefined);

interface UIProviderProps {
  children: ReactNode;
  /** Optional seed notifications (primarily for tests/stories). */
  initialNotifications?: AppNotification[];
}

export function UIProvider({ children, initialNotifications = [] }: UIProviderProps): ReactNode {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  const openCommandPalette = useCallback(() => setCommandPaletteOpen(true), []);
  const closeCommandPalette = useCallback(() => setCommandPaletteOpen(false), []);
  const toggleCommandPalette = useCallback(() => setCommandPaletteOpen((prev) => !prev), []);

  const openMobileNav = useCallback(() => setMobileNavOpen(true), []);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadNotificationCount = useMemo(
    () => notifications.reduce((count, n) => (n.read ? count : count + 1), 0),
    [notifications],
  );

  const value = useMemo<UIContextValue>(
    () => ({
      commandPaletteOpen,
      openCommandPalette,
      closeCommandPalette,
      toggleCommandPalette,
      setCommandPaletteOpen,
      mobileNavOpen,
      openMobileNav,
      closeMobileNav,
      setMobileNavOpen,
      notificationsOpen,
      setNotificationsOpen,
      notifications,
      unreadNotificationCount,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    [
      commandPaletteOpen,
      openCommandPalette,
      closeCommandPalette,
      toggleCommandPalette,
      mobileNavOpen,
      openMobileNav,
      closeMobileNav,
      notificationsOpen,
      notifications,
      unreadNotificationCount,
      markNotificationRead,
      markAllNotificationsRead,
    ],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

/** Hook to access global UI shell state. */
export function useUI(): UIContextValue {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

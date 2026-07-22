'use client';

/**
 * RIOS — App Layout
 *
 * The permanent application shell for every authenticated page. Combines the
 * sidebar, top navigation, scrollable content container, footer, and the
 * globally-available command palette.
 *
 * Responsive behavior:
 *   Desktop  — persistent sidebar (collapsible to icon mode)
 *   Tablet   — persistent sidebar (collapsible to icon mode)
 *   Mobile   — sidebar hidden; opens as a focus-trapped drawer
 */

import { type ReactNode } from 'react';

import { CommandPalette } from '@/components/layout/command-palette';
import { ContentContainer } from '@/components/layout/content-container';
import { Footer } from '@/components/layout/footer';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';
import { Sidebar } from '@/components/layout/sidebar';
import { TopNavigation } from '@/components/layout/top-navigation';
import { useGlobalShortcuts } from '@/hooks/use-global-shortcuts';
import { useMobile } from '@/hooks/use-mobile';
import { useSidebar } from '@/hooks/use-sidebar';
import { useUI } from '@/providers/ui-provider';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { collapsed, toggle } = useSidebar();
  const isMobile = useMobile();
  const { mobileNavOpen, openMobileNav, closeMobileNav } = useUI();

  useGlobalShortcuts();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/*
        Skip link — the first tab stop on every authenticated page. Lets keyboard
        and screen-reader users jump straight to page content instead of tabbing
        through the entire sidebar on each navigation (WCAG 2.4.1 Bypass Blocks).
        Visually hidden until focused.
      */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-elevation-high"
      >
        Skip to content
      </a>

      {/* Desktop / tablet persistent sidebar */}
      {!isMobile && <Sidebar collapsed={collapsed} onToggle={toggle} />}

      {/* Mobile drawer sidebar (focus-trapped dialog) */}
      {isMobile && <MobileSidebar open={mobileNavOpen} onClose={closeMobileNav} />}

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopNavigation onMenuClick={openMobileNav} showMenuButton={isMobile} />

        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto focus:outline-none">
          <ContentContainer>{children}</ContentContainer>
          <Footer />
        </main>
      </div>

      {/* Global command palette (⌘K) — lazy loaded internally */}
      <CommandPalette />
    </div>
  );
}

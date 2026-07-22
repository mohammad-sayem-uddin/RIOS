'use client';

/**
 * RIOS — Application Footer
 *
 * Slim footer rendered at the bottom of the workspace content area.
 * Purely presentational; contains product metadata and support links.
 */

import Link from 'next/link';

const FOOTER_LINKS: Array<{ label: string; href: string }> = [
  { label: 'Support', href: '/support' },
  { label: 'Settings', href: '/settings' },
  { label: 'Profile', href: '/profile' },
];

export function Footer() {
  return (
    <footer className="border-t bg-background px-4 py-3 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} RIOS — Research Identity Operating System</p>
        <nav aria-label="Footer">
          <ul className="flex items-center gap-4">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}

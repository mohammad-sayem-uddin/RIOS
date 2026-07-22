import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/providers/auth-provider';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { UIProvider } from '@/providers/ui-provider';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'RIOS — Research Identity Operating System',
    template: '%s | RIOS',
  },
  description:
    'Enterprise platform for managing research identity, publications, projects, and academic portfolios.',
  keywords: ['research', 'identity', 'publications', 'academic', 'portfolio', 'ORCID', 'scholar'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans`}>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <UIProvider>
                {children}
                <Toaster />
              </UIProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

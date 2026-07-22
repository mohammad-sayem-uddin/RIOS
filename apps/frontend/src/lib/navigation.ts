/**
 * RIOS — Navigation Configuration
 *
 * Single source of truth for the application's navigation structure.
 * Consumed by the sidebar, command palette, and breadcrumb system so that
 * new destinations are added in exactly one place.
 *
 * Icons are referenced by their lucide-react component so consumers can render
 * them at any size. Keep this file free of JSX to remain a plain module that
 * can be imported by both client and server components.
 */

import {
  LayoutDashboard,
  BookOpen,
  FolderKanban,
  Database,
  Award,
  HandCoins,
  ScrollText,
  Briefcase,
  BarChart3,
  Clock,
  Users,
  Search,
  UserCircle,
  Sparkles,
  GitFork,
  Settings,
  HelpCircle,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';

/** A single navigable destination. */
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Keywords to improve command-palette fuzzy matching. */
  keywords?: string[];
}

/** A titled grouping of navigation items. */
export interface NavSection {
  title: string;
  items: NavItem[];
}

/**
 * Primary navigation sections.
 *
 * Adding a new area is a single append here — the sidebar and command palette
 * both derive their contents from this array without further changes.
 */
export const NAV_SECTIONS: readonly NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        label: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
        keywords: ['home', 'overview', 'start'],
      },
    ],
  },
  {
    title: 'Research',
    items: [
      {
        label: 'Publications',
        href: '/publications',
        icon: BookOpen,
        keywords: ['papers', 'articles', 'journals'],
      },
      {
        label: 'Projects',
        href: '/projects',
        icon: FolderKanban,
        keywords: ['research projects', 'lifecycle'],
      },
      {
        label: 'Research Assets',
        href: '/assets',
        icon: Database,
        keywords: ['datasets', 'repository', 'files'],
      },
    ],
  },
  {
    title: 'Academic',
    items: [
      {
        label: 'Awards',
        href: '/recognition/awards',
        icon: Award,
        keywords: ['honors', 'prizes', 'recognition'],
      },
      {
        label: 'Grants',
        href: '/recognition/grants',
        icon: HandCoins,
        keywords: ['funding', 'money'],
      },
      {
        label: 'Patents',
        href: '/recognition/patents',
        icon: ScrollText,
        keywords: ['ip', 'intellectual property'],
      },
      {
        label: 'Professional',
        href: '/recognition/activities',
        icon: Briefcase,
        keywords: ['service', 'activities', 'reviewing'],
      },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      {
        label: 'Analytics',
        href: '/intelligence/analytics',
        icon: BarChart3,
        keywords: ['metrics', 'stats', 'impact'],
      },
      {
        label: 'Timeline',
        href: '/intelligence/timeline',
        icon: Clock,
        keywords: ['history', 'chronology'],
      },
      {
        label: 'Collaboration',
        href: '/intelligence/collaboration',
        icon: Users,
        keywords: ['coauthors', 'network', 'partners'],
      },
    ],
  },
  {
    title: 'Discovery',
    items: [
      { label: 'Search', href: '/search', icon: Search, keywords: ['find', 'explore', 'discover'] },
      {
        label: 'Researchers',
        href: '/search/researchers',
        icon: GraduationCap,
        keywords: ['people', 'scholars', 'profiles'],
      },
    ],
  },
  {
    title: 'AI',
    items: [
      {
        label: 'Recommendations',
        href: '/ai/recommendations',
        icon: Sparkles,
        keywords: ['suggestions', 'assistant'],
      },
      {
        label: 'Knowledge Graph',
        href: '/ai/knowledge-graph',
        icon: GitFork,
        keywords: ['graph', 'connections', 'entities'],
      },
    ],
  },
] as const;

/** Secondary items pinned to the bottom of the sidebar. */
export const BOTTOM_NAV_ITEMS: readonly NavItem[] = [
  {
    label: 'Profile',
    href: '/profile',
    icon: UserCircle,
    keywords: ['account', 'public profile', 'cv'],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    keywords: ['preferences', 'configuration', 'security'],
  },
  { label: 'Support', href: '/support', icon: HelpCircle, keywords: ['help', 'docs', 'contact'] },
] as const;

/** Flattened list of every navigable item — convenient for search indexes. */
export const ALL_NAV_ITEMS: readonly NavItem[] = [
  ...NAV_SECTIONS.flatMap((section) => section.items),
  ...BOTTOM_NAV_ITEMS,
];

/** A nav item annotated with its owning section title. */
export interface FlatNavItem extends NavItem {
  section: string;
}

/**
 * Flattens the navigation tree into a single list where each item carries its
 * section label. Used by the command palette to render grouped, searchable
 * destinations from one source of truth.
 */
export function flattenNav(): FlatNavItem[] {
  const sectioned = NAV_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({ ...item, section: section.title })),
  );
  const bottom = BOTTOM_NAV_ITEMS.map((item) => ({ ...item, section: 'Account' }));
  return [...sectioned, ...bottom];
}

/**
 * Human-readable label overrides for breadcrumb path segments.
 * Segments not listed here fall back to title-casing the raw segment.
 */
export const BREADCRUMB_LABELS: Record<string, string> = {
  '': 'Home',
  ai: 'AI',
  cv: 'CV',
  recognition: 'Academic',
  intelligence: 'Intelligence',
  assets: 'Research Assets',
};

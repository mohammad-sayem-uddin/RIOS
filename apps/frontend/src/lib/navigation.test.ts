/**
 * RIOS — Navigation Config Tests
 *
 * Pure-logic tests for the shared navigation source of truth. These run in the
 * existing root Vitest (node environment) and use a relative import so they do
 * not depend on the Next.js `@/*` path alias.
 *
 * Component/interaction tests (sidebar, command palette, drawer) require jsdom +
 * @testing-library/react, which are not yet installed — see the Runtime
 * Verification Checklist in the Part 1 report.
 */

import { describe, it, expect } from 'vitest';

import {
  NAV_SECTIONS,
  BOTTOM_NAV_ITEMS,
  ALL_NAV_ITEMS,
  flattenNav,
  BREADCRUMB_LABELS,
} from './navigation';

describe('navigation config', () => {
  it('defines the six primary sections in order', () => {
    expect(NAV_SECTIONS.map((s) => s.title)).toEqual([
      'Overview',
      'Research',
      'Academic',
      'Intelligence',
      'Discovery',
      'AI',
    ]);
  });

  it('gives every item a leading-slash href and an icon', () => {
    for (const item of ALL_NAV_ITEMS) {
      expect(item.href.startsWith('/')).toBe(true);
      expect(item.icon).toBeTruthy();
    }
  });

  it('has no duplicate hrefs across the whole navigation', () => {
    const hrefs = ALL_NAV_ITEMS.map((i) => i.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it('flattenNav annotates each item with its owning section', () => {
    const flat = flattenNav();
    const dashboard = flat.find((i) => i.href === '/');
    expect(dashboard?.section).toBe('Overview');

    const settings = flat.find((i) => i.href === '/settings');
    expect(settings?.section).toBe('Account');
  });

  it('flattenNav covers every configured item exactly once', () => {
    const expected = NAV_SECTIONS.flatMap((s) => s.items).length + BOTTOM_NAV_ITEMS.length;
    expect(flattenNav()).toHaveLength(expected);
  });

  it('maps breadcrumb label overrides for ambiguous segments', () => {
    expect(BREADCRUMB_LABELS['ai']).toBe('AI');
    expect(BREADCRUMB_LABELS['recognition']).toBe('Academic');
  });
});

'use client';

/**
 * RIOS — Sidebar State Hook
 *
 * Manages sidebar collapsed/expanded state with localStorage persistence.
 */

import { useCallback, useEffect, useState } from 'react';

const SIDEBAR_COLLAPSED_KEY = 'rios_sidebar_collapsed';

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored === 'true') {
      setCollapsed(true);
    }
  }, []);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  }, []);

  const expand = useCallback(() => {
    setCollapsed(false);
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, 'false');
  }, []);

  const collapse = useCallback(() => {
    setCollapsed(true);
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, 'true');
  }, []);

  return { collapsed, toggle, expand, collapse };
}

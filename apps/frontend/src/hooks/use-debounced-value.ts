'use client';

/**
 * RIOS — Debounced Value Hook
 *
 * Returns a value that only updates after `delay` ms of no changes. Used to
 * throttle search-as-you-type requests.
 */

import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

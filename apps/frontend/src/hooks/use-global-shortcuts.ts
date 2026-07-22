'use client';

/**
 * RIOS — Global Keyboard Shortcuts Hook
 *
 * Registers application-wide keyboard shortcuts. Currently wires the command
 * palette (⌘K / Ctrl+K). Designed to be extended with additional global
 * shortcuts without touching individual components.
 *
 * Shortcuts are ignored while the user is typing in an input, textarea, or
 * contentEditable element (except the palette toggle, which should always work).
 */

import { useEffect } from 'react';

import { useUI } from '@/providers/ui-provider';

/** Returns true when focus is inside an editable field */
function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

export function useGlobalShortcuts(): void {
  const { toggleCommandPalette } = useUI();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // ⌘K / Ctrl+K — toggle command palette (works even inside inputs)
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        toggleCommandPalette();
        return;
      }

      // Shortcuts below are suppressed while typing
      if (isEditableTarget(event.target)) return;
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleCommandPalette]);
}

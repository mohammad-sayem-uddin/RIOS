'use client';

/**
 * RIOS — Mobile Sidebar Drawer
 *
 * Renders the primary navigation as a focus-trapped, left-anchored drawer on
 * mobile viewports. Built on the Dialog primitive so it inherits proper focus
 * management, escape-to-close, scroll locking, and screen-reader semantics.
 */

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { Sidebar } from '@/components/layout/sidebar';

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed inset-y-0 left-0 z-50 h-full w-64 outline-none data-[state=open]:animate-slide-in-right data-[state=closed]:animate-slide-out-right"
          aria-label="Navigation menu"
        >
          <VisuallyHidden>
            <DialogPrimitive.Title>Navigation menu</DialogPrimitive.Title>
          </VisuallyHidden>
          {/* Collapse toggle acts as a close button inside the drawer. */}
          <Sidebar collapsed={false} onToggle={onClose} onNavigate={onClose} />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

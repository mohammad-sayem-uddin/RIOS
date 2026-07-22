'use client';

/**
 * RIOS — Motion Primitives
 *
 * A tiny, opinionated motion layer built on framer-motion. Every primitive
 * honors the user's `prefers-reduced-motion` setting: when reduced motion is
 * requested, elements render immediately at their final state with no transform
 * or opacity animation. This keeps entrance motion tasteful for most users
 * while never "punishing" reduced-motion users (WCAG 2.3.3 / brief requirement).
 *
 * Usage:
 *   <FadeIn>…</FadeIn>                     // single element entrance
 *   <Stagger><StaggerItem/>…</Stagger>     // list with sequenced children
 *
 * These are intentionally minimal — no layout animations, no shared-element
 * transitions — to preserve the app's excellent performance.
 */

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { type ReactNode } from 'react';

const DURATION = 0.32;
const EASE = [0.2, 0, 0, 1] as const; // matches --ease-emphasized token

/** Fade + rise a single block into view on mount. */
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: DURATION, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Container that sequences the entrance of its <StaggerItem> children.
 * Falls back to an instant, non-animated render under reduced motion.
 */
export function Stagger({
  children,
  className,
  /** Seconds between each child's entrance. */
  gap = 0.05,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
}) {
  const reduce = useReducedMotion();

  const variants: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : gap },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial={reduce ? false : 'hidden'}
      animate="show"
    >
      {children}
    </motion.div>
  );
}

/** A single item within a <Stagger> container. */
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION, ease: EASE },
    },
  };

  // Under reduced motion, render the child statically with no variant wiring.
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}

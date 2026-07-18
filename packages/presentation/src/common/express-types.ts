/**
 * Express Request Augmentation.
 *
 * Extends Express Request interface with typed Presentation RequestContext & SecurityContext.
 */

import type { RequestContext } from './request-context.js';
import type { SecurityContext } from './security-context.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      context?: RequestContext;
      user?: SecurityContext;
    }
  }
}

export type {};

/**
 * Express Request Augmentation.
 *
 * Extends Express Request interface with typed Presentation RequestContext.
 */

import type { RequestContext } from './request-context.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      context?: RequestContext;
    }
  }
}

export type {};

/**
 * Compression Middleware.
 *
 * Enables response payload compression (gzip / deflate).
 */

import compression from 'compression';
import type { RequestHandler } from 'express';

export function createCompressionMiddleware(enabled = true): RequestHandler {
  if (!enabled) {
    return (_req, _res, next) => next();
  }
  return compression();
}

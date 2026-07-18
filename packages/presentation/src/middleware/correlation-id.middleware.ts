/**
 * Correlation ID Middleware.
 *
 * Propagates or generates globally unique X-Correlation-ID for end-to-end distributed request tracing.
 */

import { randomUUID } from 'node:crypto';

import type { Request, Response, NextFunction, RequestHandler } from 'express';

export const CORRELATION_ID_HEADER = 'x-correlation-id';

export function createCorrelationIdMiddleware(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const existingHeader = req.headers[CORRELATION_ID_HEADER];
    const correlationId =
      typeof existingHeader === 'string' && existingHeader.trim().length > 0
        ? existingHeader.trim()
        : randomUUID();

    req.headers[CORRELATION_ID_HEADER] = correlationId;
    res.setHeader(CORRELATION_ID_HEADER, correlationId);
    next();
  };
}

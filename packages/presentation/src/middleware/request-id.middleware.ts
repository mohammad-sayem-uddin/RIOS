/**
 * Request ID Middleware.
 *
 * Ensures every incoming HTTP request has a unique X-Request-ID header.
 * Generates a random UUID if not provided by client.
 */

import { randomUUID } from 'node:crypto';

import type { Request, Response, NextFunction, RequestHandler } from 'express';

export const REQUEST_ID_HEADER = 'x-request-id';

export function createRequestIdMiddleware(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const existingHeader = req.headers[REQUEST_ID_HEADER];
    const requestId =
      typeof existingHeader === 'string' && existingHeader.trim().length > 0
        ? existingHeader.trim()
        : randomUUID();

    req.headers[REQUEST_ID_HEADER] = requestId;
    res.setHeader(REQUEST_ID_HEADER, requestId);
    next();
  };
}

/**
 * Request Context Middleware.
 *
 * Constructs and attaches an immutable RequestContext object onto the Express Request object.
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';

import { createRequestContext } from '../common/request-context.js';

import { CORRELATION_ID_HEADER } from './correlation-id.middleware.js';
import { REQUEST_ID_HEADER } from './request-id.middleware.js';

export function createRequestContextMiddleware(): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const requestId = String(req.headers[REQUEST_ID_HEADER] ?? '');
    const correlationId = String(req.headers[CORRELATION_ID_HEADER] ?? '');
    const clientIp = typeof req.ip === 'string' && req.ip.length > 0 ? req.ip : '127.0.0.1';
    const userAgent = req.headers['user-agent'] ?? 'unknown';

    req.context = createRequestContext({
      requestId,
      correlationId,
      clientIp,
      userAgent,
      method: req.method,
      path: req.originalUrl || req.url,
      apiVersion: 'v1',
    });

    next();
  };
}

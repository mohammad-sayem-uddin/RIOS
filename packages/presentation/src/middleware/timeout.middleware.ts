/**
 * Timeout Middleware.
 *
 * Enforces maximum request execution timeout.
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';

export function createTimeoutMiddleware(timeoutMs = 30000): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({
          success: false,
          error: {
            code: 'GATEWAY_TIMEOUT',
            message: `Request exceeded maximum timeout of ${timeoutMs}ms`,
            correlationId: req.context?.correlationId ?? '',
            timestamp: new Date().toISOString(),
          },
        });
      }
    }, timeoutMs);

    res.on('finish', () => clearTimeout(timer));
    res.on('close', () => clearTimeout(timer));

    next();
  };
}

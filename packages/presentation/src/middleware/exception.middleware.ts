/**
 * Global Exception Middleware.
 *
 * Catches unhandled errors thrown anywhere in the HTTP request pipeline,
 * logs them via Infrastructure StructuredLogger, and translates them into a standardized JSON response.
 * Guarantees zero leak of raw stack traces or internal implementation details to clients.
 */

import type { Logger } from '@rios/infrastructure';
import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export function createExceptionMiddleware(logger?: Logger): ErrorRequestHandler {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err: Error, req: Request, res: Response, _next: NextFunction): void => {
    const correlationId =
      req.context?.correlationId ?? String(req.headers['x-correlation-id'] ?? '');

    if (logger) {
      logger.error(
        `Unhandled Exception during ${req.method} ${req.originalUrl || req.url}: ${err.message}`,
        {
          error: err.stack ?? err.message,
          correlationId,
          requestId: req.context?.requestId,
        },
      );
    }

    if (res.headersSent) {
      return;
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected internal server error occurred.',
        correlationId,
        timestamp: new Date().toISOString(),
      },
    });
  };
}

/**
 * Structured Logging Middleware.
 *
 * Logs incoming HTTP request start and outgoing response metrics using Infrastructure StructuredLogger.
 */

import type { Logger } from '@rios/infrastructure';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

export function createLoggingMiddleware(logger: Logger): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();
    const context = req.context;

    logger.info(`HTTP ${req.method} ${req.originalUrl || req.url} - Started`, {
      requestId: context?.requestId,
      correlationId: context?.correlationId,
      method: req.method,
      path: req.originalUrl || req.url,
      clientIp: context?.clientIp,
      userAgent: context?.userAgent,
    });

    res.on('finish', () => {
      const durationMs = Date.now() - startTime;
      const statusCode = res.statusCode;
      const logMessage = `HTTP ${req.method} ${req.originalUrl || req.url} - ${statusCode} (${durationMs}ms)`;

      if (statusCode >= 500) {
        logger.error(logMessage, {
          requestId: context?.requestId,
          correlationId: context?.correlationId,
          statusCode,
          durationMs,
        });
      } else if (statusCode >= 400) {
        logger.warn(logMessage, {
          requestId: context?.requestId,
          correlationId: context?.correlationId,
          statusCode,
          durationMs,
        });
      } else {
        logger.info(logMessage, {
          requestId: context?.requestId,
          correlationId: context?.correlationId,
          statusCode,
          durationMs,
        });
      }
    });

    next();
  };
}

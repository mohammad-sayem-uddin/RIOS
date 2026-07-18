/**
 * Validation Middleware Factory.
 *
 * Intercepts HTTP requests, validates body / query / params using SchemaValidator,
 * and halts execution with HTTP 400 Bad Request if validation fails.
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';

import type { SchemaValidator } from './schema-validator.js';

export type RequestTarget = 'body' | 'query' | 'params';

export function createValidationMiddleware<T extends Record<string, unknown>>(
  validator: SchemaValidator<T>,
  target: RequestTarget = 'body',
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const rawPayload: unknown = req[target];
    const payload = (
      rawPayload !== null && typeof rawPayload === 'object' ? rawPayload : {}
    ) as Record<string, unknown>;
    const result = validator.validate(payload);

    if (!result.isValid) {
      const details = result.errors.map((e) => `${e.field}: ${e.message}`);
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed.',
          details,
          correlationId: req.context?.correlationId ?? '',
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    next();
  };
}

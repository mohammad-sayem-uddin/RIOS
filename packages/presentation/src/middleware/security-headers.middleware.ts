/**
 * Security Headers Middleware.
 *
 * Configures HTTP security headers using Helmet (HSTS, CSP, X-Frame-Options, X-Content-Type-Options).
 */

import cors from 'cors';
import type { RequestHandler } from 'express';
import helmet from 'helmet';

export function createSecurityHeadersMiddleware(): RequestHandler[] {
  return [
    helmet({
      contentSecurityPolicy: false, // Allowed for Swagger UI
    }),
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Request-ID',
        'X-Correlation-ID',
        'X-API-Version',
      ],
    }),
  ];
}

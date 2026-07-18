/**
 * Body Parser Middleware.
 *
 * Configures JSON body parsing with strict size limits and URL-encoded payload parsing.
 */

import { json, urlencoded, type RequestHandler } from 'express';

export function createBodyParserMiddleware(limit = '1mb'): RequestHandler[] {
  return [json({ limit }), urlencoded({ extended: true, limit })];
}

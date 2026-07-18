/**
 * Authentication Routes Router
 *
 * Configures Express router for /api/v1/auth endpoints.
 * Architecture Reference: Volume I – Identity / Chapter 7 §77
 */

import { Router } from 'express';
import type { RequestHandler } from 'express';

import { AuthenticationController } from './authentication.controller.js';

export interface AuthenticationRoutesOptions {
  controller: AuthenticationController;
  authMiddleware?: RequestHandler;
}

export function createAuthenticationRouter(options: AuthenticationRoutesOptions): Router {
  const router = Router();
  const { controller, authMiddleware } = options;

  // Public authentication endpoints
  router.post('/login', controller.login);
  router.post('/refresh', controller.refresh);

  // Protected authentication endpoints
  if (authMiddleware) {
    router.post('/logout', authMiddleware, controller.logout);
    router.get('/me', authMiddleware, controller.getCurrentUser);
  } else {
    router.post('/logout', controller.logout);
    router.get('/me', controller.getCurrentUser);
  }

  return router;
}

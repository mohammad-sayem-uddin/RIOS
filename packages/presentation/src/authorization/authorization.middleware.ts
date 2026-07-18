/**
 * Authorization Middleware
 *
 * RBAC and permission evaluation middleware enforcing Default Deny security policies.
 * Architecture Reference: Volume I – Identity / Chapter 7 §81, Chapter 11 §152
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';

import { ApiResponseFactory } from '../dto/api-response.dto.js';

export function requireRole(...requiredRoles: string[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.isAuthenticated) {
      res.status(401).json(
        ApiResponseFactory.failure({
          code: 'AUTH_UNAUTHORIZED',
          message: 'Authentication required before role evaluation',
          correlationId: req.context?.correlationId,
        }),
      );
      return;
    }

    const normalizedRequired = requiredRoles.map((r) => r.trim().toLowerCase());
    const userRoles = req.user.roles.map((r) => r.trim().toLowerCase());

    const hasRequiredRole = normalizedRequired.some((role) => userRoles.includes(role));
    if (!hasRequiredRole) {
      res.status(403).json(
        ApiResponseFactory.failure({
          code: 'AUTH_FORBIDDEN',
          message: `Access denied. Requires one of roles: [${requiredRoles.join(', ')}]`,
          correlationId: req.context?.correlationId,
        }),
      );
      return;
    }

    next();
  };
}

export function requirePermission(...requiredPermissions: string[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.isAuthenticated) {
      res.status(401).json(
        ApiResponseFactory.failure({
          code: 'AUTH_UNAUTHORIZED',
          message: 'Authentication required before permission evaluation',
          correlationId: req.context?.correlationId,
        }),
      );
      return;
    }

    const normalizedRequired = requiredPermissions.map((p) => p.trim().toLowerCase());
    const userPermissions = req.user.permissions.map((p) => p.trim().toLowerCase());

    const hasAllPermissions = normalizedRequired.every((permission) =>
      userPermissions.includes(permission),
    );
    if (!hasAllPermissions) {
      res.status(403).json(
        ApiResponseFactory.failure({
          code: 'AUTH_FORBIDDEN',
          message: `Access denied. Insufficient permissions. Required: [${requiredPermissions.join(', ')}]`,
          correlationId: req.context?.correlationId,
        }),
      );
      return;
    }

    next();
  };
}

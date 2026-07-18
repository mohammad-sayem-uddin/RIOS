/**
 * Authentication Middleware
 *
 * Extracts Bearer tokens, validates token & session state, and attaches SecurityContext.
 * Architecture Reference: Volume I – Identity / Chapter 7 §80, Chapter 11 §151
 */

import type { ISessionRepository, ITokenProvider } from '@rios/domain';
import { AccessToken, SessionId } from '@rios/domain';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

import { createSecurityContext } from '../common/security-context.js';
import { ApiResponseFactory } from '../dto/api-response.dto.js';

export interface AuthenticationMiddlewareOptions {
  tokenProvider: ITokenProvider;
  sessionRepository: ISessionRepository;
  optional?: boolean;
}

export function createAuthenticationMiddleware(
  options: AuthenticationMiddlewareOptions,
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader === undefined || !authHeader.startsWith('Bearer ')) {
        if (options.optional === true) {
          return next();
        }
        res.status(401).json(
          ApiResponseFactory.failure({
            code: 'AUTH_UNAUTHORIZED',
            message: 'Missing or malformed Authorization header with Bearer token',
            correlationId: req.context?.correlationId,
          }),
        );
        return;
      }

      const tokenString = authHeader.substring(7).trim();
      if (tokenString === '') {
        if (options.optional === true) {
          return next();
        }
        res.status(401).json(
          ApiResponseFactory.failure({
            code: 'AUTH_UNAUTHORIZED',
            message: 'Empty Bearer token string provided',
            correlationId: req.context?.correlationId,
          }),
        );
        return;
      }

      const tokenRes = AccessToken.create(tokenString);
      if (tokenRes.isFailure) {
        if (options.optional === true) {
          return next();
        }
        res.status(401).json(
          ApiResponseFactory.failure({
            code: 'AUTH_INVALID_TOKEN',
            message: `Malformed token format: ${tokenRes.error}`,
            correlationId: req.context?.correlationId,
          }),
        );
        return;
      }

      const validateRes = await options.tokenProvider.validateAccessToken(tokenRes.value);
      if (validateRes.isFailure) {
        if (options.optional === true) {
          return next();
        }
        res.status(401).json(
          ApiResponseFactory.failure({
            code: 'AUTH_INVALID_TOKEN',
            message: `Token validation failed: ${validateRes.error}`,
            correlationId: req.context?.correlationId,
          }),
        );
        return;
      }

      const claims = validateRes.value;
      const sessionRes = await options.sessionRepository.findById(SessionId.from(claims.sessionId));
      if (sessionRes.isFailure || sessionRes.value === null) {
        if (options.optional === true) {
          return next();
        }
        res.status(401).json(
          ApiResponseFactory.failure({
            code: 'AUTH_SESSION_REVOKED',
            message: 'Session has been revoked or deleted',
            correlationId: req.context?.correlationId,
          }),
        );
        return;
      }

      const session = sessionRes.value;
      if (!session.isActive()) {
        if (options.optional === true) {
          return next();
        }
        res.status(401).json(
          ApiResponseFactory.failure({
            code: 'AUTH_SESSION_EXPIRED',
            message: 'Session has expired or been terminated',
            correlationId: req.context?.correlationId,
          }),
        );
        return;
      }

      req.user = createSecurityContext({
        userId: claims.userId,
        email: claims.email,
        sessionId: claims.sessionId,
        roles: claims.roles,
        permissions: claims.permissions,
        correlationId: req.context?.correlationId,
        requestId: req.context?.requestId,
      });

      next();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json(
        ApiResponseFactory.failure({
          code: 'INTERNAL_ERROR',
          message: `Unexpected error during authentication: ${message}`,
          correlationId: req.context?.correlationId,
        }),
      );
    }
  };
}

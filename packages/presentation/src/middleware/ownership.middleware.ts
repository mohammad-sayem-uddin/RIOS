/**
 * Profile Ownership Authorization Middleware
 *
 * Verifies that the authenticated subject owns the ResearchProfile being modified.
 * Never trusts route parameters alone.
 */

import type { ResearchProfileApplicationService } from '@rios/application';
import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { ApiResponseFactory } from '../dto/api-response.dto.js';

export function createProfileOwnershipMiddleware(
  service: ResearchProfileApplicationService,
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const paramId = req.params['id'];
      const paramProfileId = req.params['profileId'];
      const rawId = typeof paramId === 'string' && paramId.length > 0 ? paramId : paramProfileId;
      const profileId = typeof rawId === 'string' ? rawId : '';

      const headerUserId = Array.isArray(req.headers['x-user-id'])
        ? req.headers['x-user-id'][0]
        : req.headers['x-user-id'];

      const authenticatedUserId = req.user?.userId ?? headerUserId;

      if (typeof authenticatedUserId !== 'string' || authenticatedUserId.length === 0) {
        res.status(401).json(
          ApiResponseFactory.failure({
            code: 'AUTH_UNAUTHORIZED',
            message: 'Authentication required for resource access',
            correlationId: req.context?.correlationId,
          }),
        );
        return;
      }

      if (profileId.length === 0) {
        return next();
      }

      const profileRes = await service.getProfileById(profileId);
      if (profileRes.isFailure) {
        res.status(404).json(
          ApiResponseFactory.failure({
            code: 'RESOURCE_NOT_FOUND',
            message: profileRes.error,
            correlationId: req.context?.correlationId,
          }),
        );
        return;
      }

      const profile = profileRes.value;
      if (profile.userId !== authenticatedUserId) {
        res.status(403).json(
          ApiResponseFactory.failure({
            code: 'AUTH_FORBIDDEN_RESOURCE_OWNERSHIP',
            message: 'You are not authorized to modify or access this research profile resource',
            correlationId: req.context?.correlationId,
          }),
        );
        return;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

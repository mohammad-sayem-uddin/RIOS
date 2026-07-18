import type { AuthenticationApplicationService } from '@rios/application';
import type { Request, Response, NextFunction } from 'express';
import { describe, expect, it, vi } from 'vitest';

import {
  AuthenticationController,
  createSecurityContext,
  requirePermission,
  requireRole,
} from '../index.js';

interface MockResponse {
  status: (code: number) => MockResponse;
  json: (data: unknown) => MockResponse;
}

function createMockResponse(): {
  res: Response;
  statusFn: ReturnType<typeof vi.fn>;
  jsonFn: ReturnType<typeof vi.fn>;
} {
  const statusFn = vi.fn();
  const jsonFn = vi.fn();

  const mockRes: MockResponse = {
    status: (code: number) => {
      statusFn(code);
      return mockRes;
    },
    json: (data: unknown) => {
      jsonFn(data);
      return mockRes;
    },
  };

  return { res: mockRes as unknown as Response, statusFn, jsonFn };
}

describe('Presentation Layer IAM Security Tests', () => {
  describe('SecurityContext', () => {
    it('should create immutable security context', () => {
      const context = createSecurityContext({
        userId: 'user_1',
        email: 'admin@rios.org',
        sessionId: 'session_1',
        roles: ['admin'],
        permissions: ['users.read', 'users.write'],
      });

      expect(context.isAuthenticated).toBe(true);
      expect(context.userId).toBe('user_1');
      expect(context.roles).toContain('admin');
      expect(context.permissions).toContain('users.write');
      expect(Object.isFrozen(context.roles)).toBe(true);
    });
  });

  describe('AuthorizationMiddleware (Default Deny)', () => {
    it('should reject unauthenticated requests with 401', () => {
      const req = {} as Request;
      const { res, statusFn } = createMockResponse();
      const next = vi.fn() as NextFunction;

      const middleware = requireRole('admin');
      middleware(req, res, next);

      expect(statusFn).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject users lacking required role with 403', () => {
      const req = {
        user: createSecurityContext({
          userId: 'user_1',
          email: 'guest@rios.org',
          sessionId: 's1',
          roles: ['guest'],
          permissions: [],
        }),
      } as unknown as Request;
      const { res, statusFn } = createMockResponse();
      const next = vi.fn() as NextFunction;

      const middleware = requireRole('admin');
      middleware(req, res, next);

      expect(statusFn).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow users possessing required role', () => {
      const req = {
        user: createSecurityContext({
          userId: 'user_1',
          email: 'admin@rios.org',
          sessionId: 's1',
          roles: ['admin'],
          permissions: [],
        }),
      } as unknown as Request;
      const { res } = createMockResponse();
      const next = vi.fn() as NextFunction;

      const middleware = requireRole('admin');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should enforce required permissions strictly', () => {
      const req = {
        user: createSecurityContext({
          userId: 'user_1',
          email: 'user@rios.org',
          sessionId: 's1',
          roles: ['researcher'],
          permissions: ['users.read'],
        }),
      } as unknown as Request;
      const { res, statusFn } = createMockResponse();
      const next = vi.fn() as NextFunction;

      const middleware = requirePermission('users.read', 'users.write');
      middleware(req, res, next);

      expect(statusFn).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('AuthenticationController', () => {
    it('should handle login requests and return 200 on success', async () => {
      const mockAuthService = {
        authenticate: vi.fn().mockResolvedValue({
          isSuccess: true,
          isFailure: false,
          value: {
            user: { id: 'u1', email: 'alice@rios.org' },
            session: { id: 's1' },
            tokens: { accessToken: 'jwt_token', refreshToken: 'refresh_token' },
          },
        }),
      } as unknown as AuthenticationApplicationService;

      const controller = new AuthenticationController(mockAuthService);
      const req = {
        body: { email: 'alice@rios.org', password: 'password123' },
        context: { correlationId: 'c123' },
        headers: {},
      } as unknown as Request;
      const { res, statusFn, jsonFn } = createMockResponse();
      const next = vi.fn() as NextFunction;

      await controller.login(req, res, next);

      expect(statusFn).toHaveBeenCalledWith(200);
      const successPayload = jsonFn.mock.calls[0]?.[0] as {
        success: boolean;
        data: { tokens: { accessToken: string } };
      };
      expect(successPayload.success).toBe(true);
      expect(successPayload.data.tokens.accessToken).toBe('jwt_token');
    });

    it('should return 401 when login authentication fails', async () => {
      const mockAuthService = {
        authenticate: vi.fn().mockResolvedValue({
          isSuccess: false,
          isFailure: true,
          error: 'Invalid email or password',
        }),
      } as unknown as AuthenticationApplicationService;

      const controller = new AuthenticationController(mockAuthService);
      const req = {
        body: { email: 'alice@rios.org', password: 'wrong' },
        context: { correlationId: 'c123' },
        headers: {},
      } as unknown as Request;
      const { res, statusFn, jsonFn } = createMockResponse();
      const next = vi.fn() as NextFunction;

      await controller.login(req, res, next);

      expect(statusFn).toHaveBeenCalledWith(401);
      const failurePayload = jsonFn.mock.calls[0]?.[0] as {
        success: boolean;
        error: { code: string };
      };
      expect(failurePayload.success).toBe(false);
      expect(failurePayload.error.code).toBe('AUTH_INVALID_CREDENTIALS');
    });
  });
});

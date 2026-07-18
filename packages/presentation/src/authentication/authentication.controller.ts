/**
 * Authentication Controller
 *
 * Thin adapter layer exposing IAM HTTP endpoints: login, logout, refresh, me.
 * Architecture Reference: Volume I – Identity / Chapter 7 §78, Chapter 10 §134
 */

import type { AuthenticationApplicationService, GetCurrentUserHandler } from '@rios/application';
import { GetCurrentUserQuery } from '@rios/application';
import type { Request, Response, RequestHandler } from 'express';

import { ApiResponseFactory } from '../dto/api-response.dto.js';
import { LoginRequestDto, RefreshTokenRequestDto, LogoutRequestDto } from '../dto/auth-dtos.js';

export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationApplicationService,
    private readonly getCurrentUserHandler?: GetCurrentUserHandler,
  ) {}

  public login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as LoginRequestDto;
    if (
      body.email === undefined ||
      body.email.trim() === '' ||
      body.password === undefined ||
      body.password.trim() === ''
    ) {
      res.status(400).json(
        ApiResponseFactory.failure({
          code: 'VALIDATION_FAILED',
          message: 'Both email and password fields are required for login',
          correlationId: req.context?.correlationId,
        }),
      );
      return;
    }

    const clientIp =
      req.context?.clientIp !== undefined && req.context.clientIp.trim() !== ''
        ? req.context.clientIp
        : req.ip;
    const userAgentHeader = req.headers['user-agent'];
    const userAgent =
      req.context?.userAgent !== undefined && req.context.userAgent.trim() !== ''
        ? req.context.userAgent
        : userAgentHeader;

    const result = await this.authService.authenticate(
      body.email,
      body.password,
      clientIp,
      userAgent,
    );
    if (result.isFailure) {
      res.status(401).json(
        ApiResponseFactory.failure({
          code: 'AUTH_INVALID_CREDENTIALS',
          message: result.error,
          correlationId: req.context?.correlationId,
        }),
      );
      return;
    }

    res.status(200).json(
      ApiResponseFactory.success(result.value, {
        correlationId: req.context?.correlationId,
      }),
    );
  };

  public refresh: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as RefreshTokenRequestDto;
    if (body.refreshToken === undefined || body.refreshToken.trim() === '') {
      res.status(400).json(
        ApiResponseFactory.failure({
          code: 'VALIDATION_FAILED',
          message: 'refreshToken is required',
          correlationId: req.context?.correlationId,
        }),
      );
      return;
    }

    const result = await this.authService.refreshTokens(body.refreshToken);
    if (result.isFailure) {
      res.status(401).json(
        ApiResponseFactory.failure({
          code: 'AUTH_INVALID_REFRESH_TOKEN',
          message: result.error,
          correlationId: req.context?.correlationId,
        }),
      );
      return;
    }

    res.status(200).json(
      ApiResponseFactory.success(result.value, {
        correlationId: req.context?.correlationId,
      }),
    );
  };

  public logout: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const body = (req.body ?? {}) as LogoutRequestDto;
    const sessionId =
      body.sessionId !== undefined && body.sessionId.trim() !== ''
        ? body.sessionId
        : req.user?.sessionId;

    if (sessionId === undefined || sessionId.trim() === '') {
      res.status(400).json(
        ApiResponseFactory.failure({
          code: 'VALIDATION_FAILED',
          message: 'sessionId is required for logout',
          correlationId: req.context?.correlationId,
        }),
      );
      return;
    }

    const result = await this.authService.logout(sessionId);
    if (result.isFailure) {
      res.status(400).json(
        ApiResponseFactory.failure({
          code: 'LOGOUT_FAILED',
          message: result.error,
          correlationId: req.context?.correlationId,
        }),
      );
      return;
    }

    res
      .status(200)
      .json(
        ApiResponseFactory.success(
          { message: 'Successfully logged out' },
          { correlationId: req.context?.correlationId },
        ),
      );
  };

  public getCurrentUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    if (req.user === undefined || req.user.isAuthenticated !== true) {
      res.status(401).json(
        ApiResponseFactory.failure({
          code: 'AUTH_UNAUTHORIZED',
          message: 'User is not authenticated',
          correlationId: req.context?.correlationId,
        }),
      );
      return;
    }

    if (this.getCurrentUserHandler !== undefined) {
      const query = new GetCurrentUserQuery({ userId: req.user.userId });
      const queryRes = await this.getCurrentUserHandler.handle(query);
      if (queryRes.isSuccess) {
        res
          .status(200)
          .json(
            ApiResponseFactory.success(
              { user: queryRes.value, authenticated: true },
              { correlationId: req.context?.correlationId },
            ),
          );
        return;
      }
    }

    res.status(200).json(
      ApiResponseFactory.success(
        {
          user: {
            id: req.user.userId,
            email: req.user.email,
            roles: req.user.roles,
            permissions: req.user.permissions,
            sessionId: req.user.sessionId,
          },
          authenticated: true,
        },
        { correlationId: req.context?.correlationId },
      ),
    );
  };
}

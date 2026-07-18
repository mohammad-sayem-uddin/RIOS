/**
 * Validate Access Token Query & Handler
 *
 * CQRS Query for validating token signatures, claims, and session active status.
 * Architecture Reference: Volume I – Identity / Chapter 5 §44
 */

import {
  AccessToken,
  ISessionRepository,
  ITokenProvider,
  SessionId,
  TokenClaims,
} from '@rios/domain';
import { Query, QueryHandler, Result } from '@rios/shared';

export class ValidateAccessTokenQuery implements Query {
  public readonly queryId: string;
  public readonly timestamp: Date;
  public readonly accessToken: string;

  constructor(params: { accessToken: string; queryId?: string; timestamp?: Date }) {
    this.queryId =
      params.queryId !== undefined && params.queryId !== '' ? params.queryId : crypto.randomUUID();
    this.timestamp = params.timestamp ?? new Date();
    this.accessToken = params.accessToken;
  }
}

export class ValidateAccessTokenHandler implements QueryHandler<
  ValidateAccessTokenQuery,
  TokenClaims
> {
  constructor(
    private readonly tokenProvider: ITokenProvider,
    private readonly sessionRepository: ISessionRepository,
  ) {}

  public async handle(query: ValidateAccessTokenQuery): Promise<Result<TokenClaims>> {
    if (query.accessToken.trim() === '') {
      return Result.fail('Access token is required');
    }

    const tokenRes = AccessToken.create(query.accessToken);
    if (tokenRes.isFailure) {
      return Result.fail(`Invalid token format: ${tokenRes.error}`);
    }

    const validateRes = await this.tokenProvider.validateAccessToken(tokenRes.value);
    if (validateRes.isFailure) {
      return Result.fail(`Invalid access token: ${validateRes.error}`);
    }

    const claims = validateRes.value;
    const sessionRes = await this.sessionRepository.findById(SessionId.from(claims.sessionId));
    if (sessionRes.isFailure || sessionRes.value === null) {
      return Result.fail('Associated session not found');
    }

    const session = sessionRes.value;
    if (!session.isActive()) {
      return Result.fail('Session is expired or has been revoked');
    }

    return Result.ok(claims);
  }
}

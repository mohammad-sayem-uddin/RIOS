/**
 * Identity DTO Mapper
 *
 * Converts Domain entities (User, Session, Tokens) into Application DTOs.
 * Architecture Reference: Volume I – Identity / Chapter 5 §44
 */

import { IssuedTokens, Session, User } from '@rios/domain';

import {
  AuthenticationResponseDto,
  SessionDto,
  TokenResultDto,
  UserDto,
} from '../dto/identity-application-dtos.js';

export class IdentityDtoMapper {
  public static toUserDto(user: User): UserDto {
    return {
      id: user.userId.value,
      email: user.email.value,
      displayName: user.displayName,
      status: user.status,
      roles: user.roles.map((r) => r.name),
      permissions: user.getEffectivePermissions(),
      createdAt: user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
    };
  }

  public static toSessionDto(session: Session): SessionDto {
    return {
      id: session.sessionId.value,
      userId: session.userId.value,
      createdAt: session.createdAt.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
      lastActivityAt: session.lastActivityAt.toISOString(),
      revoked: session.isRevoked,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
    };
  }

  public static toTokenResultDto(tokens: IssuedTokens): TokenResultDto {
    return {
      accessToken: tokens.accessToken.value,
      refreshToken: tokens.refreshToken.value,
      accessTokenExpiresAt: tokens.accessTokenExpiresAt.toISOString(),
      refreshTokenExpiresAt: tokens.refreshTokenExpiresAt.toISOString(),
    };
  }

  public static toAuthenticationResponseDto(
    user: User,
    session: Session,
    tokens: IssuedTokens,
  ): AuthenticationResponseDto {
    return {
      user: IdentityDtoMapper.toUserDto(user),
      session: IdentityDtoMapper.toSessionDto(session),
      tokens: IdentityDtoMapper.toTokenResultDto(tokens),
    };
  }
}

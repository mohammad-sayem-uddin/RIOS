/**
 * Identity Application DTOs
 *
 * Data Transport Objects for Application Layer Identity use cases.
 * Architecture Reference: Volume I – Identity / Chapter 5 §44
 */

export interface UserDto {
  id: string;
  email: string;
  displayName: string;
  status: string;
  roles: string[];
  permissions: string[];
  createdAt: string;
  lastLoginAt: string | null;
}

export interface SessionDto {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  lastActivityAt: string;
  revoked: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export interface TokenResultDto {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

export interface AuthenticationResponseDto {
  user: UserDto;
  session: SessionDto;
  tokens: TokenResultDto;
}

export interface RefreshTokenResponseDto {
  tokens: TokenResultDto;
}

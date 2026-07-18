/**
 * Authentication Presentation DTOs
 *
 * HTTP Request and Response transport DTOs for IAM endpoints.
 * Architecture Reference: Volume I – Identity / Chapter 7 §77, Chapter 10 §134
 */

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface LogoutRequestDto {
  sessionId?: string;
}

export interface UserResponseDto {
  id: string;
  email: string;
  displayName: string;
  status: string;
  roles: string[];
  permissions: string[];
  createdAt: string;
  lastLoginAt: string | null;
}

export interface SessionResponseDto {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  lastActivityAt: string;
  revoked: boolean;
}

export interface TokenResponseDto {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

export interface LoginResponseDto {
  user: UserResponseDto;
  session: SessionResponseDto;
  tokens: TokenResponseDto;
}

export interface RefreshTokenResponseDto {
  tokens: TokenResponseDto;
}

export interface CurrentUserResponseDto {
  user: UserResponseDto;
  authenticated: boolean;
}

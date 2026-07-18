/**
 * Refresh Token Persistence Mapper
 *
 * Converts between Domain RefreshTokenRecord Entity and Prisma RefreshToken Record.
 * Architecture Reference: Infrastructure Layer — Persistence Mapping.
 */

import { RefreshTokenRecord, SessionId, UserId } from '@rios/domain';
import { Result } from '@rios/shared';

export interface PrismaRefreshTokenRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  replacedByTokenId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class RefreshTokenPersistenceMapper {
  static toDomain(record: PrismaRefreshTokenRecord): Result<RefreshTokenRecord> {
    const userId = UserId.create(record.userId);
    const sessionId = SessionId.create(record.id);

    return RefreshTokenRecord.create(
      {
        userId,
        sessionId,
        tokenHash: record.tokenHash,
        expiresAt: record.expiresAt,
        createdAt: record.createdAt,
        revoked: record.revokedAt !== null,
        revokedAt: record.revokedAt,
        replacedByTokenId: record.replacedByTokenId,
      },
      record.id,
    );
  }

  static toPersistence(token: RefreshTokenRecord): PrismaRefreshTokenRecord {
    return {
      id: token.refreshTokenId,
      userId: token.userId.value,
      tokenHash: token.tokenHash,
      expiresAt: token.expiresAt,
      revokedAt: token.revokedAt,
      replacedByTokenId: token.replacedByTokenId,
      createdAt: token.createdAt,
      updatedAt: new Date(),
    };
  }
}

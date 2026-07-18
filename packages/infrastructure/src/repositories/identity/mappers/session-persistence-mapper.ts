/**
 * Session Persistence Mapper
 *
 * Converts between Domain Session Entity and Prisma Session Record.
 * Architecture Reference: Infrastructure Layer — Persistence Mapping.
 */

import { Session, UserId } from '@rios/domain';
import { Result } from '@rios/shared';

export interface PrismaSessionRecord {
  id: string;
  userId: string;
  deviceIp: string | null;
  userAgent: string | null;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class SessionPersistenceMapper {
  static toDomain(record: PrismaSessionRecord): Result<Session> {
    const userId = UserId.create(record.userId);

    return Session.create(
      {
        userId,
        createdAt: record.createdAt,
        expiresAt: record.expiresAt,
        lastActivityAt: record.updatedAt,
        revoked: record.revokedAt !== null,
        revokedAt: record.revokedAt,
        ipAddress: record.deviceIp ?? undefined,
        userAgent: record.userAgent ?? undefined,
      },
      record.id,
    );
  }

  static toPersistence(session: Session): PrismaSessionRecord {
    return {
      id: session.sessionId.value,
      userId: session.userId.value,
      deviceIp: session.ipAddress ?? null,
      userAgent: session.userAgent ?? null,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt,
      createdAt: session.createdAt,
      updatedAt: session.lastActivityAt,
    };
  }
}

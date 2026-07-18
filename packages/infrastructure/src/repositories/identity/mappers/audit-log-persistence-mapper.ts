/**
 * Audit Log Persistence Mapper
 *
 * Converts between Domain AuditLogEntry Entity and Prisma AuditLog Record.
 * Architecture Reference: Infrastructure Layer — Persistence Mapping.
 */

import { AuditLogEntry, AuditOutcome, UserId } from '@rios/domain';
import { Result } from '@rios/shared';

export interface PrismaAuditLogRecord {
  id: string;
  userId: string | null;
  action: string;
  details: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

export class AuditLogPersistenceMapper {
  static toDomain(record: PrismaAuditLogRecord): Result<AuditLogEntry> {
    const userId =
      record.userId !== undefined && record.userId !== null && record.userId.trim() !== ''
        ? UserId.create(record.userId)
        : null;

    let parsedDetails: Record<string, string | number | boolean | null> = {};
    if (record.details !== undefined && record.details !== null && record.details.trim() !== '') {
      try {
        parsedDetails = JSON.parse(record.details) as Record<
          string,
          string | number | boolean | null
        >;
      } catch {
        parsedDetails = { raw: record.details };
      }
    }

    return AuditLogEntry.create(
      {
        userId,
        action: record.action,
        outcome: AuditOutcome.SUCCESS,
        occurredAt: record.createdAt,
        ipAddress: record.ipAddress,
        userAgent: record.userAgent,
        details: parsedDetails,
      },
      record.id,
    );
  }

  static toPersistence(entry: AuditLogEntry): PrismaAuditLogRecord {
    return {
      id: entry.auditLogId,
      userId: entry.userId !== null ? entry.userId.value : null,
      action: entry.action,
      details:
        entry.details !== undefined && entry.details !== null
          ? JSON.stringify(entry.details)
          : null,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      createdAt: entry.occurredAt,
    };
  }
}

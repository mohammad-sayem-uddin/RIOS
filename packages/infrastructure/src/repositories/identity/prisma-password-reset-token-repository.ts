/**
 * Prisma Password Reset Token Repository
 *
 * Production implementation of IPasswordResetTokenRepository.
 * Stores only the SHA-256 hash of the raw token — never the raw value.
 */

import type { IPasswordResetTokenRepository } from '@rios/domain';
import { UserId, VerificationToken } from '@rios/domain';
import { Result } from '@rios/shared';

import type { DatabaseProvider } from '../../database/database-provider.js';
import { PrismaErrorTranslator } from '../../errors/prisma-error-translator.js';

interface PrismaPasswordResetTokenDelegate {
  upsert(args: Record<string, unknown>): Promise<unknown>;
  findFirst(args: Record<string, unknown>): Promise<unknown>;
  updateMany(args: Record<string, unknown>): Promise<{ count: number }>;
}

interface PrismaPasswordResetTokenRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  consumedAt: Date | null;
  createdAt: Date;
}

export class PrismaPasswordResetTokenRepository implements IPasswordResetTokenRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(): { passwordResetToken: PrismaPasswordResetTokenDelegate } {
    return this.databaseProvider.getClient() as {
      passwordResetToken: PrismaPasswordResetTokenDelegate;
    };
  }

  public async save(token: VerificationToken): Promise<Result<void>> {
    try {
      const client = this.getClient();
      await client.passwordResetToken.upsert({
        where: { id: token.tokenId },
        create: {
          id: token.tokenId,
          userId: token.userId.value,
          tokenHash: token.tokenHash,
          expiresAt: token.expiresAt,
          consumedAt: token.consumedAt,
          createdAt: token.createdAt,
        },
        update: {
          consumedAt: token.consumedAt,
        },
      });
      return Result.ok(undefined);
    } catch (error) {
      return PrismaErrorTranslator.toResult<void>(error, 'PrismaPasswordResetTokenRepository.save');
    }
  }

  public async findByTokenHash(tokenHash: string): Promise<Result<VerificationToken | null>> {
    try {
      const client = this.getClient();
      const record = (await client.passwordResetToken.findFirst({
        where: { tokenHash: tokenHash.trim() },
      })) as PrismaPasswordResetTokenRecord | null;

      if (!record) return Result.ok(null);

      return VerificationToken.create(
        {
          userId: UserId.from(record.userId),
          tokenHash: record.tokenHash,
          expiresAt: record.expiresAt,
          consumedAt: record.consumedAt,
          createdAt: record.createdAt,
        },
        record.id,
      );
    } catch (error) {
      return PrismaErrorTranslator.toResult<VerificationToken | null>(
        error,
        'PrismaPasswordResetTokenRepository.findByTokenHash',
      );
    }
  }

  public async invalidateAllForUser(userId: UserId): Promise<Result<void>> {
    try {
      const client = this.getClient();
      await client.passwordResetToken.updateMany({
        where: { userId: userId.value, consumedAt: null },
        data: { consumedAt: new Date() },
      });
      return Result.ok(undefined);
    } catch (error) {
      return PrismaErrorTranslator.toResult<void>(
        error,
        'PrismaPasswordResetTokenRepository.invalidateAllForUser',
      );
    }
  }
}

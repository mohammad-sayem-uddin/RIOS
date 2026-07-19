/**
 * Prisma Award Repository
 */

import { PrismaClient } from '@prisma/client';
import { Award, IAwardRepository } from '@rios/domain';

import type { DatabaseProvider } from '../../database/database-provider.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';
import { AcademicRecognitionMapper } from '../mappers/academic-recognition.mapper.js';

export class PrismaAwardRepository implements IAwardRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): PrismaClient {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as PrismaClient;
    }
    return this.databaseProvider.getClient() as PrismaClient;
  }

  public async save(award: Award, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    const id = award.awardId.value;

    await client.academicAward.upsert({
      where: { id },
      create: {
        id,
        profileId: award.profileId.value,
        title: award.title,
        category: award.category,
        sponsorOrAgency: award.sponsorOrAgency?.value,
        amount: award.amount ? award.amount.amount : null,
        currency: award.amount ? award.amount.currency.code : 'USD',
        awardDate: award.awardDate,
        description: award.description,
        field: award.field,
        area: award.area,
      },
      update: {
        title: award.title,
        category: award.category,
        sponsorOrAgency: award.sponsorOrAgency?.value,
        amount: award.amount ? award.amount.amount : null,
        currency: award.amount ? award.amount.currency.code : 'USD',
        awardDate: award.awardDate,
        description: award.description,
        field: award.field,
        area: award.area,
      },
    });
  }

  public async findById(id: string, context?: TransactionContext): Promise<Award | null> {
    const client = this.getClient(context);
    const raw = await client.academicAward.findUnique({ where: { id } });
    if (!raw) return null;
    return AcademicRecognitionMapper.toAwardDomain(raw);
  }

  public async findByResearchProfile(
    profileId: string,
    context?: TransactionContext,
  ): Promise<Award[]> {
    const client = this.getClient(context);
    const list = await client.academicAward.findMany({ where: { profileId } });
    return list.map((raw) => AcademicRecognitionMapper.toAwardDomain(raw));
  }

  public async search(query: string, context?: TransactionContext): Promise<Award[]> {
    const client = this.getClient(context);
    const list = await client.academicAward.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    return list.map((raw) => AcademicRecognitionMapper.toAwardDomain(raw));
  }

  public async delete(id: string, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    await client.academicAward.delete({ where: { id } });
  }
}

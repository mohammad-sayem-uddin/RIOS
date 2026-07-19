/**
 * Prisma Grant Repository
 */

import { PrismaClient } from '@prisma/client';
import { Grant, IGrantRepository } from '@rios/domain';

import type { DatabaseProvider } from '../../database/database-provider.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';
import { AcademicRecognitionMapper } from '../mappers/academic-recognition.mapper.js';

export class PrismaGrantRepository implements IGrantRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): PrismaClient {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as PrismaClient;
    }
    return this.databaseProvider.getClient() as PrismaClient;
  }

  public async save(grant: Grant, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    const id = grant.grantId.value;

    await client.academicGrant.upsert({
      where: { id },
      create: {
        id,
        profileId: grant.profileId.value,
        grantNumber: grant.grantNumber.value,
        title: grant.title,
        fundingAgency: grant.fundingAgency.value,
        amount: grant.amount.amount,
        currency: grant.amount.currency.code,
        startDate: grant.startDate,
        endDate: grant.endDate,
        status: grant.status,
        principalInvestigatorId: grant.principalInvestigatorId,
        coInvestigators: grant.coInvestigators.join(','),
        description: grant.description,
        deliverables: grant.deliverables.join(','),
      },
      update: {
        grantNumber: grant.grantNumber.value,
        title: grant.title,
        fundingAgency: grant.fundingAgency.value,
        amount: grant.amount.amount,
        currency: grant.amount.currency.code,
        startDate: grant.startDate,
        endDate: grant.endDate,
        status: grant.status,
        principalInvestigatorId: grant.principalInvestigatorId,
        coInvestigators: grant.coInvestigators.join(','),
        description: grant.description,
        deliverables: grant.deliverables.join(','),
      },
    });
  }

  public async findById(id: string, context?: TransactionContext): Promise<Grant | null> {
    const client = this.getClient(context);
    const raw = await client.academicGrant.findUnique({ where: { id } });
    if (!raw) return null;
    return AcademicRecognitionMapper.toGrantDomain(raw);
  }

  public async findByGrantNumber(
    grantNumber: string,
    context?: TransactionContext,
  ): Promise<Grant | null> {
    const client = this.getClient(context);
    const raw = await client.academicGrant.findUnique({ where: { grantNumber } });
    if (!raw) return null;
    return AcademicRecognitionMapper.toGrantDomain(raw);
  }

  public async findByResearchProfile(
    profileId: string,
    context?: TransactionContext,
  ): Promise<Grant[]> {
    const client = this.getClient(context);
    const list = await client.academicGrant.findMany({ where: { profileId } });
    return list.map((raw) => AcademicRecognitionMapper.toGrantDomain(raw));
  }

  public async search(query: string, context?: TransactionContext): Promise<Grant[]> {
    const client = this.getClient(context);
    const list = await client.academicGrant.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { grantNumber: { contains: query, mode: 'insensitive' } },
          { fundingAgency: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    return list.map((raw) => AcademicRecognitionMapper.toGrantDomain(raw));
  }

  public async delete(id: string, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    await client.academicGrant.delete({ where: { id } });
  }
}

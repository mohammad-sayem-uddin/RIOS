/**
 * Prisma Patent Repository
 */

import { PrismaClient } from '@prisma/client';
import { IPatentRepository, Patent } from '@rios/domain';

import type { DatabaseProvider } from '../../database/database-provider.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';
import { AcademicRecognitionMapper } from '../mappers/academic-recognition.mapper.js';

export class PrismaPatentRepository implements IPatentRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): PrismaClient {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as PrismaClient;
    }
    return this.databaseProvider.getClient() as PrismaClient;
  }

  public async save(patent: Patent, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    const id = patent.patentId.value;

    await client.academicPatent.upsert({
      where: { id },
      create: {
        id,
        profileId: patent.profileId.value,
        patentNumber: patent.patentNumber.value,
        title: patent.title,
        status: patent.status.value,
        patentType: patent.patentType.value,
        filingDate: patent.filingDate,
        grantDate: patent.grantDate,
        assigneeOrganization: patent.assigneeOrganization?.value,
        inventors: patent.inventors.join(','),
        abstract: patent.abstract,
      },
      update: {
        patentNumber: patent.patentNumber.value,
        title: patent.title,
        status: patent.status.value,
        patentType: patent.patentType.value,
        filingDate: patent.filingDate,
        grantDate: patent.grantDate,
        assigneeOrganization: patent.assigneeOrganization?.value,
        inventors: patent.inventors.join(','),
        abstract: patent.abstract,
      },
    });
  }

  public async findById(id: string, context?: TransactionContext): Promise<Patent | null> {
    const client = this.getClient(context);
    const raw = await client.academicPatent.findUnique({ where: { id } });
    if (!raw) return null;
    return AcademicRecognitionMapper.toPatentDomain(raw);
  }

  public async findByPatentNumber(
    patentNumber: string,
    context?: TransactionContext,
  ): Promise<Patent | null> {
    const client = this.getClient(context);
    const raw = await client.academicPatent.findUnique({ where: { patentNumber } });
    if (!raw) return null;
    return AcademicRecognitionMapper.toPatentDomain(raw);
  }

  public async findByResearchProfile(
    profileId: string,
    context?: TransactionContext,
  ): Promise<Patent[]> {
    const client = this.getClient(context);
    const list = await client.academicPatent.findMany({ where: { profileId } });
    return list.map((raw) => AcademicRecognitionMapper.toPatentDomain(raw));
  }

  public async search(query: string, context?: TransactionContext): Promise<Patent[]> {
    const client = this.getClient(context);
    const list = await client.academicPatent.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { patentNumber: { contains: query, mode: 'insensitive' } },
          { abstract: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    return list.map((raw) => AcademicRecognitionMapper.toPatentDomain(raw));
  }

  public async delete(id: string, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    await client.academicPatent.delete({ where: { id } });
  }
}

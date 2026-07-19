/**
 * Prisma Professional Activity Repository
 */

import { PrismaClient } from '@prisma/client';
import { IProfessionalActivityRepository, ProfessionalActivity } from '@rios/domain';

import type { DatabaseProvider } from '../../database/database-provider.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';
import { AcademicRecognitionMapper } from '../mappers/academic-recognition.mapper.js';

export class PrismaProfessionalActivityRepository implements IProfessionalActivityRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): PrismaClient {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as PrismaClient;
    }
    return this.databaseProvider.getClient() as PrismaClient;
  }

  public async save(activity: ProfessionalActivity, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    const id = activity.activityId.value;

    await client.professionalActivity.upsert({
      where: { id },
      create: {
        id,
        profileId: activity.profileId.value,
        category: activity.category,
        title: activity.title,
        organization: activity.organization?.value,
        role: activity.role?.value,
        startDate: activity.startDate,
        endDate: activity.endDate,
        conferenceName: activity.conferenceName?.value,
        journalName: activity.journalName,
        country: activity.country?.code,
        description: activity.description,
      },
      update: {
        category: activity.category,
        title: activity.title,
        organization: activity.organization?.value,
        role: activity.role?.value,
        startDate: activity.startDate,
        endDate: activity.endDate,
        conferenceName: activity.conferenceName?.value,
        journalName: activity.journalName,
        country: activity.country?.code,
        description: activity.description,
      },
    });
  }

  public async findById(
    id: string,
    context?: TransactionContext,
  ): Promise<ProfessionalActivity | null> {
    const client = this.getClient(context);
    const raw = await client.professionalActivity.findUnique({ where: { id } });
    if (!raw) return null;
    return AcademicRecognitionMapper.toActivityDomain(raw);
  }

  public async findByResearchProfile(
    profileId: string,
    context?: TransactionContext,
  ): Promise<ProfessionalActivity[]> {
    const client = this.getClient(context);
    const list = await client.professionalActivity.findMany({ where: { profileId } });
    return list.map((raw) => AcademicRecognitionMapper.toActivityDomain(raw));
  }

  public async search(
    query: string,
    context?: TransactionContext,
  ): Promise<ProfessionalActivity[]> {
    const client = this.getClient(context);
    const list = await client.professionalActivity.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { organization: { contains: query, mode: 'insensitive' } },
          { conferenceName: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    return list.map((raw) => AcademicRecognitionMapper.toActivityDomain(raw));
  }

  public async delete(id: string, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    await client.professionalActivity.delete({ where: { id } });
  }
}

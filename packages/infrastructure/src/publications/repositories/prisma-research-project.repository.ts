/**
 * Prisma Research Project Repository
 */

import { PrismaClient } from '@prisma/client';
import { IResearchProjectRepository, ProjectId, ResearchProject } from '@rios/domain';
import { UniqueId } from '@rios/shared';

import type { DatabaseProvider } from '../../database/database-provider.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';
import { PrismaProjectFull, ResearchProjectMapper } from '../mappers/research-project-mapper.js';

export class PrismaResearchProjectRepository implements IResearchProjectRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): PrismaClient {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as PrismaClient;
    }
    return this.databaseProvider.getClient() as PrismaClient;
  }

  private get defaultInclude(): { members: boolean } {
    return {
      members: true,
    };
  }

  public async findById(
    id: ProjectId,
    context?: TransactionContext,
  ): Promise<ResearchProject | null> {
    const client = this.getClient(context);
    const raw = (await client.researchProject.findUnique({
      where: { id: id.value },
      include: this.defaultInclude,
    })) as PrismaProjectFull | null;

    if (raw === null) return null;
    return ResearchProjectMapper.toDomain(raw);
  }

  public async findByResearchProfile(
    profileId: UniqueId,
    context?: TransactionContext,
  ): Promise<ResearchProject[]> {
    const client = this.getClient(context);
    const records = (await client.researchProject.findMany({
      where: { profileId: profileId.value },
      include: this.defaultInclude,
      orderBy: { startDate: 'desc' },
    })) as PrismaProjectFull[];

    return records.map((r) => ResearchProjectMapper.toDomain(r));
  }

  public async save(project: ResearchProject, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    const data = ResearchProjectMapper.toPersistence(project);

    await client.$transaction(async (tx) => {
      await tx.researchProject.upsert({
        where: { id: project.id.value },
        create: data,
        update: data,
      });

      await tx.projectMember.deleteMany({ where: { projectId: project.id.value } });
      for (const m of project.members) {
        await tx.projectMember.create({
          data: {
            id: m.id.value,
            projectId: project.id.value,
            profileId: m.profileId ?? null,
            name: m.name,
            role: m.role.value,
            startDate: m.startDate,
            endDate: m.endDate ?? null,
          },
        });
      }
    });
  }

  public async delete(id: ProjectId, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    await client.researchProject.delete({
      where: { id: id.value },
    });
  }
}

/**
 * Prisma Experiment Repository
 */

import { PrismaClient } from '@prisma/client';
import { Experiment, IExperimentRepository } from '@rios/domain';

import type { DatabaseProvider } from '../../database/database-provider.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';
import { ResearchAssetsMapper } from '../mappers/research-assets.mapper.js';

export class PrismaExperimentRepository implements IExperimentRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): PrismaClient {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as PrismaClient;
    }
    return this.databaseProvider.getClient() as PrismaClient;
  }

  public async save(experiment: Experiment, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    const id = experiment.id.value;

    await client.experiment.upsert({
      where: { id },
      create: {
        id,
        title: experiment.title,
        description: experiment.description,
        projectId: experiment.projectId,
        profileId: experiment.profileId,
        parametersJson: experiment.parametersJson,
        metricsJson: experiment.metricsJson,
        status: experiment.status,
        executedAt: experiment.executedAt,
      },
      update: {
        title: experiment.title,
        description: experiment.description,
        projectId: experiment.projectId,
        profileId: experiment.profileId,
        parametersJson: experiment.parametersJson,
        metricsJson: experiment.metricsJson,
        status: experiment.status,
        executedAt: experiment.executedAt,
      },
    });
  }

  public async findById(id: string, context?: TransactionContext): Promise<Experiment | null> {
    const client = this.getClient(context);
    const raw = await client.experiment.findUnique({ where: { id } });
    if (!raw) return null;
    return ResearchAssetsMapper.toExperimentDomain(raw);
  }

  public async findByResearchProfile(
    profileId: string,
    context?: TransactionContext,
  ): Promise<Experiment[]> {
    const client = this.getClient(context);
    const list = await client.experiment.findMany({ where: { profileId } });
    return list.map((raw) => ResearchAssetsMapper.toExperimentDomain(raw));
  }

  public async findByProject(
    projectId: string,
    context?: TransactionContext,
  ): Promise<Experiment[]> {
    const client = this.getClient(context);
    const list = await client.experiment.findMany({ where: { projectId } });
    return list.map((raw) => ResearchAssetsMapper.toExperimentDomain(raw));
  }

  public async search(query: string, context?: TransactionContext): Promise<Experiment[]> {
    const client = this.getClient(context);
    const list = await client.experiment.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    return list.map((raw) => ResearchAssetsMapper.toExperimentDomain(raw));
  }

  public async delete(id: string, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    await client.experiment.delete({ where: { id } });
  }
}

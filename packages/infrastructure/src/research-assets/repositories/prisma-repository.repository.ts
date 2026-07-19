/**
 * Prisma Repository Repository
 */

import { PrismaClient } from '@prisma/client';
import { IRepositoryRepository, Repository } from '@rios/domain';

import type { DatabaseProvider } from '../../database/database-provider.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';
import { ResearchAssetsMapper } from '../mappers/research-assets.mapper.js';

export class PrismaRepositoryRepository implements IRepositoryRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): PrismaClient {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as PrismaClient;
    }
    return this.databaseProvider.getClient() as PrismaClient;
  }

  public async save(repository: Repository, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    const id = repository.id.value;

    await client.repository.upsert({
      where: { id },
      create: {
        id,
        name: repository.name,
        url: repository.url.value,
        provider: repository.provider,
        isPrivate: repository.isPrivate,
        defaultBranch: repository.defaultBranch,
        primaryLanguage: repository.primaryLanguage?.value,
        starsCount: repository.starsCount,
        forksCount: repository.forksCount,
        openIssuesCount: repository.openIssuesCount,
        description: repository.description,
      },
      update: {
        name: repository.name,
        url: repository.url.value,
        provider: repository.provider,
        isPrivate: repository.isPrivate,
        defaultBranch: repository.defaultBranch,
        primaryLanguage: repository.primaryLanguage?.value,
        starsCount: repository.starsCount,
        forksCount: repository.forksCount,
        openIssuesCount: repository.openIssuesCount,
        description: repository.description,
      },
    });
  }

  public async findById(id: string, context?: TransactionContext): Promise<Repository | null> {
    const client = this.getClient(context);
    const raw = await client.repository.findUnique({ where: { id } });
    if (!raw) return null;
    return ResearchAssetsMapper.toRepositoryDomain(raw);
  }

  public async findByUrl(url: string, context?: TransactionContext): Promise<Repository | null> {
    const client = this.getClient(context);
    const raw = await client.repository.findUnique({ where: { url } });
    if (!raw) return null;
    return ResearchAssetsMapper.toRepositoryDomain(raw);
  }

  public async search(query: string, context?: TransactionContext): Promise<Repository[]> {
    const client = this.getClient(context);
    const list = await client.repository.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { url: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    return list.map((raw) => ResearchAssetsMapper.toRepositoryDomain(raw));
  }

  public async delete(id: string, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    await client.repository.delete({ where: { id } });
  }
}

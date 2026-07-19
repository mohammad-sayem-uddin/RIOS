/**
 * Prisma Research Dataset Repository
 */

import { PrismaClient } from '@prisma/client';
import { IResearchDatasetRepository, ResearchDataset } from '@rios/domain';

import type { DatabaseProvider } from '../../database/database-provider.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';
import { ResearchAssetsMapper } from '../mappers/research-assets.mapper.js';

export class PrismaResearchDatasetRepository implements IResearchDatasetRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): PrismaClient {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as PrismaClient;
    }
    return this.databaseProvider.getClient() as PrismaClient;
  }

  public async save(dataset: ResearchDataset, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    const id = dataset.datasetId.value;

    await client.researchDataset.upsert({
      where: { id },
      create: {
        id,
        profileId: dataset.profileId.value,
        title: dataset.title,
        description: dataset.description,
        doi: dataset.doi?.value,
        license: dataset.license?.value,
        visibility: dataset.visibility as unknown as never,
        accessLevel: dataset.accessLevel as unknown as never,
        storageProvider: dataset.storageProvider?.toString(),
        datasetUrl: dataset.datasetUrl?.value,
        field: dataset.field?.value,
        area: dataset.area?.value,
        isPublished: dataset.isPublished,
      },
      update: {
        title: dataset.title,
        description: dataset.description,
        doi: dataset.doi?.value,
        license: dataset.license?.value,
        visibility: dataset.visibility as unknown as never,
        accessLevel: dataset.accessLevel as unknown as never,
        storageProvider: dataset.storageProvider?.toString(),
        datasetUrl: dataset.datasetUrl?.value,
        field: dataset.field?.value,
        area: dataset.area?.value,
        isPublished: dataset.isPublished,
      },
    });

    // Save versions
    for (const version of dataset.versions) {
      await client.datasetVersion.upsert({
        where: { id: version.id.value },
        create: {
          id: version.id.value,
          datasetId: id,
          versionNumber: version.versionNumber.value,
          title: version.title,
          description: version.description,
          fileUrl: version.fileUrl,
          fileSizeBytes: BigInt(version.fileSizeBytes.bytes),
          checksum: version.checksum?.hash,
          changelog: version.changelog,
          releaseDate: version.releaseDate,
        },
        update: {
          versionNumber: version.versionNumber.value,
          title: version.title,
          description: version.description,
          fileUrl: version.fileUrl,
          fileSizeBytes: BigInt(version.fileSizeBytes.bytes),
          checksum: version.checksum?.hash,
          changelog: version.changelog,
        },
      });
    }
  }

  public async findById(id: string, context?: TransactionContext): Promise<ResearchDataset | null> {
    const client = this.getClient(context);
    const raw = await client.researchDataset.findUnique({
      where: { id },
      include: { versions: { orderBy: { releaseDate: 'asc' } } },
    });
    if (!raw) return null;
    return ResearchAssetsMapper.toDatasetDomain(raw);
  }

  public async findByDOI(
    doi: string,
    context?: TransactionContext,
  ): Promise<ResearchDataset | null> {
    const client = this.getClient(context);
    const raw = await client.researchDataset.findUnique({
      where: { doi: doi.toLowerCase() },
      include: { versions: { orderBy: { releaseDate: 'asc' } } },
    });
    if (!raw) return null;
    return ResearchAssetsMapper.toDatasetDomain(raw);
  }

  public async findByResearchProfile(
    profileId: string,
    context?: TransactionContext,
  ): Promise<ResearchDataset[]> {
    const client = this.getClient(context);
    const list = await client.researchDataset.findMany({
      where: { profileId },
      include: { versions: { orderBy: { releaseDate: 'asc' } } },
    });
    return list.map((raw) => ResearchAssetsMapper.toDatasetDomain(raw));
  }

  public async search(query: string, context?: TransactionContext): Promise<ResearchDataset[]> {
    const client = this.getClient(context);
    const list = await client.researchDataset.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { versions: { orderBy: { releaseDate: 'asc' } } },
    });
    return list.map((raw) => ResearchAssetsMapper.toDatasetDomain(raw));
  }

  public async delete(id: string, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    await client.researchDataset.delete({ where: { id } });
  }
}

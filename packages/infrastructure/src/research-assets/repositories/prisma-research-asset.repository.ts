/**
 * Prisma Research Asset Repository
 */

import { PrismaClient } from '@prisma/client';
import { IResearchAssetRepository, ResearchAsset } from '@rios/domain';

import type { DatabaseProvider } from '../../database/database-provider.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';
import { ResearchAssetsMapper } from '../mappers/research-assets.mapper.js';

export class PrismaResearchAssetRepository implements IResearchAssetRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): PrismaClient {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as PrismaClient;
    }
    return this.databaseProvider.getClient() as PrismaClient;
  }

  public async save(asset: ResearchAsset, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    const id = asset.assetId.value;

    await client.researchAsset.upsert({
      where: { id },
      create: {
        id,
        profileId: asset.profileId.value,
        publicationId: asset.publicationId?.value,
        projectId: asset.projectId?.value,
        title: asset.title,
        description: asset.description,
        category: asset.category as unknown as never,
        fileUrl: asset.fileUrl,
        mimeType: asset.mimeType?.value,
        fileSizeBytes: asset.fileSizeBytes ? BigInt(asset.fileSizeBytes.bytes) : null,
        license: asset.license?.value,
        visibility: asset.visibility as unknown as never,
        accessLevel: asset.accessLevel as unknown as never,
      },
      update: {
        title: asset.title,
        description: asset.description,
        category: asset.category as unknown as never,
        fileUrl: asset.fileUrl,
        mimeType: asset.mimeType?.value,
        fileSizeBytes: asset.fileSizeBytes ? BigInt(asset.fileSizeBytes.bytes) : null,
        license: asset.license?.value,
        visibility: asset.visibility as unknown as never,
        accessLevel: asset.accessLevel as unknown as never,
      },
    });
  }

  public async findById(id: string, context?: TransactionContext): Promise<ResearchAsset | null> {
    const client = this.getClient(context);
    const raw = await client.researchAsset.findUnique({ where: { id } });
    if (!raw) return null;
    return ResearchAssetsMapper.toAssetDomain(raw);
  }

  public async findByResearchProfile(
    profileId: string,
    context?: TransactionContext,
  ): Promise<ResearchAsset[]> {
    const client = this.getClient(context);
    const list = await client.researchAsset.findMany({ where: { profileId } });
    return list.map((raw) => ResearchAssetsMapper.toAssetDomain(raw));
  }

  public async findByPublication(
    publicationId: string,
    context?: TransactionContext,
  ): Promise<ResearchAsset[]> {
    const client = this.getClient(context);
    const list = await client.researchAsset.findMany({ where: { publicationId } });
    return list.map((raw) => ResearchAssetsMapper.toAssetDomain(raw));
  }

  public async search(query: string, context?: TransactionContext): Promise<ResearchAsset[]> {
    const client = this.getClient(context);
    const list = await client.researchAsset.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    return list.map((raw) => ResearchAssetsMapper.toAssetDomain(raw));
  }

  public async delete(id: string, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    await client.researchAsset.delete({ where: { id } });
  }
}

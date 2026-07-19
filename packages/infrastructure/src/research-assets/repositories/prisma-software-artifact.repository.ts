/**
 * Prisma Software Artifact Repository
 */

import { PrismaClient } from '@prisma/client';
import { ISoftwareArtifactRepository, SoftwareArtifact } from '@rios/domain';

import type { DatabaseProvider } from '../../database/database-provider.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';
import { ResearchAssetsMapper } from '../mappers/research-assets.mapper.js';

export class PrismaSoftwareArtifactRepository implements ISoftwareArtifactRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): PrismaClient {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as PrismaClient;
    }
    return this.databaseProvider.getClient() as PrismaClient;
  }

  public async save(artifact: SoftwareArtifact, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    const id = artifact.artifactId.value;

    await client.softwareArtifact.upsert({
      where: { id },
      create: {
        id,
        profileId: artifact.profileId.value,
        name: artifact.name,
        description: artifact.description,
        programmingLanguages: artifact.programmingLanguages.map((l) => l.value).join(','),
        frameworks: artifact.frameworks.map((f) => f.value).join(','),
        license: artifact.license?.value,
        visibility: artifact.visibility as unknown as never,
      },
      update: {
        name: artifact.name,
        description: artifact.description,
        programmingLanguages: artifact.programmingLanguages.map((l) => l.value).join(','),
        frameworks: artifact.frameworks.map((f) => f.value).join(','),
        license: artifact.license?.value,
        visibility: artifact.visibility as unknown as never,
      },
    });

    // Update repositories association
    for (const repo of artifact.repositories) {
      await client.repository.upsert({
        where: { id: repo.id.value },
        create: {
          id: repo.id.value,
          softwareArtifactId: id,
          name: repo.name,
          url: repo.url.value,
          provider: repo.provider,
          isPrivate: repo.isPrivate,
          defaultBranch: repo.defaultBranch,
          primaryLanguage: repo.primaryLanguage?.value,
          starsCount: repo.starsCount,
          forksCount: repo.forksCount,
          openIssuesCount: repo.openIssuesCount,
          description: repo.description,
        },
        update: {
          softwareArtifactId: id,
          name: repo.name,
          url: repo.url.value,
          provider: repo.provider,
          isPrivate: repo.isPrivate,
          defaultBranch: repo.defaultBranch,
          primaryLanguage: repo.primaryLanguage?.value,
          starsCount: repo.starsCount,
          forksCount: repo.forksCount,
          openIssuesCount: repo.openIssuesCount,
          description: repo.description,
        },
      });
    }

    // Save releases
    for (const release of artifact.releases) {
      await client.softwareRelease.upsert({
        where: { id: release.id.value },
        create: {
          id: release.id.value,
          softwareArtifactId: id,
          version: release.version.value,
          title: release.title,
          tagName: release.tagName,
          targetCommitish: release.targetCommitish?.value,
          description: release.description,
          isPrerelease: release.isPrerelease,
          releasedAt: release.releasedAt,
          downloadUrl: release.downloadUrl,
        },
        update: {
          version: release.version.value,
          title: release.title,
          tagName: release.tagName,
          targetCommitish: release.targetCommitish?.value,
          description: release.description,
          isPrerelease: release.isPrerelease,
          releasedAt: release.releasedAt,
          downloadUrl: release.downloadUrl,
        },
      });
    }
  }

  public async findById(
    id: string,
    context?: TransactionContext,
  ): Promise<SoftwareArtifact | null> {
    const client = this.getClient(context);
    const raw = await client.softwareArtifact.findUnique({
      where: { id },
      include: { repositories: true, releases: { orderBy: { releasedAt: 'desc' } } },
    });
    if (!raw) return null;
    return ResearchAssetsMapper.toSoftwareDomain(raw);
  }

  public async findByRepository(
    repositoryUrlOrId: string,
    context?: TransactionContext,
  ): Promise<SoftwareArtifact | null> {
    const client = this.getClient(context);
    const repo = await client.repository.findFirst({
      where: { OR: [{ id: repositoryUrlOrId }, { url: repositoryUrlOrId }] },
      include: { softwareArtifact: { include: { repositories: true, releases: true } } },
    });
    if (!repo || !repo.softwareArtifact) return null;
    return ResearchAssetsMapper.toSoftwareDomain(repo.softwareArtifact);
  }

  public async findByResearchProfile(
    profileId: string,
    context?: TransactionContext,
  ): Promise<SoftwareArtifact[]> {
    const client = this.getClient(context);
    const list = await client.softwareArtifact.findMany({
      where: { profileId },
      include: { repositories: true, releases: { orderBy: { releasedAt: 'desc' } } },
    });
    return list.map((raw) => ResearchAssetsMapper.toSoftwareDomain(raw));
  }

  public async search(query: string, context?: TransactionContext): Promise<SoftwareArtifact[]> {
    const client = this.getClient(context);
    const list = await client.softwareArtifact.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { repositories: true, releases: { orderBy: { releasedAt: 'desc' } } },
    });
    return list.map((raw) => ResearchAssetsMapper.toSoftwareDomain(raw));
  }

  public async delete(id: string, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    await client.softwareArtifact.delete({ where: { id } });
  }
}

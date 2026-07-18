/**
 * Prisma Research Profile Repository
 * Production implementation of IResearchProfileRepository with selective graph loading support.
 */

import { IResearchProfileRepository, ResearchProfile, ResearchProfileId } from '@rios/domain';
import { UniqueId } from '@rios/shared';

import type { DatabaseProvider } from '../../database/database-provider.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';
import {
  PrismaResearchProfileFull,
  ResearchProfilePersistenceMapper,
} from '../mappers/research-profile-persistence-mapper.js';

export interface ProfileFetchOptions {
  includeEducation?: boolean;
  includeExperience?: boolean;
  includeInterests?: boolean;
  includeSkills?: boolean;
  includeExternalProfiles?: boolean;
  includePortfolioAssets?: boolean;
}

interface PrismaProfileDelegate {
  findUnique(args: Record<string, unknown>): Promise<unknown>;
  findFirst(args: Record<string, unknown>): Promise<unknown>;
  upsert(args: Record<string, unknown>): Promise<unknown>;
  delete(args: Record<string, unknown>): Promise<unknown>;
}

interface IncludeRelationsResult {
  education: boolean;
  experience: boolean;
  interests: boolean;
  skills: boolean;
  externalProfiles: boolean;
  portfolioAssets: boolean;
}

export class PrismaResearchProfileRepository implements IResearchProfileRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): { researchProfile: PrismaProfileDelegate } {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as unknown as { researchProfile: PrismaProfileDelegate };
    }
    const dbClient = this.databaseProvider.getClient();
    return dbClient as { researchProfile: PrismaProfileDelegate };
  }

  private buildIncludeRelations(options?: ProfileFetchOptions): IncludeRelationsResult {
    if (options === undefined || options === null) {
      return {
        education: true,
        experience: true,
        interests: true,
        skills: true,
        externalProfiles: true,
        portfolioAssets: true,
      };
    }

    return {
      education: options.includeEducation ?? true,
      experience: options.includeExperience ?? true,
      interests: options.includeInterests ?? true,
      skills: options.includeSkills ?? true,
      externalProfiles: options.includeExternalProfiles ?? true,
      portfolioAssets: options.includePortfolioAssets ?? true,
    };
  }

  public async findById(
    id: ResearchProfileId,
    options?: ProfileFetchOptions,
    context?: TransactionContext,
  ): Promise<ResearchProfile | null> {
    const client = this.getClient(context);
    const record = (await client.researchProfile.findUnique({
      where: { id: id.value },
      include: this.buildIncludeRelations(options),
    })) as PrismaResearchProfileFull | null;

    if (record === null || record === undefined) return null;
    return ResearchProfilePersistenceMapper.toDomain(record);
  }

  public async findByUserId(
    userId: UniqueId,
    options?: ProfileFetchOptions,
    context?: TransactionContext,
  ): Promise<ResearchProfile | null> {
    const client = this.getClient(context);
    const record = (await client.researchProfile.findFirst({
      where: { userId: userId.value },
      include: this.buildIncludeRelations(options),
    })) as PrismaResearchProfileFull | null;

    if (record === null || record === undefined) return null;
    return ResearchProfilePersistenceMapper.toDomain(record);
  }

  public async save(profile: ResearchProfile, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);

    await client.researchProfile.upsert({
      where: { id: profile.id.value },
      create: {
        id: profile.id.value,
        userId: profile.userId.value,
        title: profile.title,
        headline: profile.headline?.value ?? null,
        biography: profile.biography?.value ?? null,
        summary: profile.summary?.value ?? null,
        statement: profile.statement?.value ?? null,
        mission: profile.mission?.value ?? null,
        vision: profile.vision?.value ?? null,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
      update: {
        title: profile.title,
        headline: profile.headline?.value ?? null,
        biography: profile.biography?.value ?? null,
        summary: profile.summary?.value ?? null,
        statement: profile.statement?.value ?? null,
        mission: profile.mission?.value ?? null,
        vision: profile.vision?.value ?? null,
        updatedAt: profile.updatedAt,
      },
    });
  }

  public async delete(id: ResearchProfileId, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    await client.researchProfile.delete({
      where: { id: id.value },
    });
  }
}

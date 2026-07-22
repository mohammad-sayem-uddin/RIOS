/**
 * Prisma Research Analytics Repository (Sprint 11)
 */

import { PrismaClient } from '@prisma/client';
import { IResearchAnalyticsRepository, ResearchAnalytics } from '@rios/domain';

import type { DatabaseProvider } from '../../database/database-provider.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';
import { ResearchIntelligenceMapper } from '../mappers/research-intelligence.mapper.js';

export class PrismaResearchAnalyticsRepository implements IResearchAnalyticsRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): PrismaClient {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as PrismaClient;
    }
    return this.databaseProvider.getClient() as PrismaClient;
  }

  public async save(analytics: ResearchAnalytics, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    const id = analytics.id.value;

    await client.researchAnalyticsModel.upsert({
      where: { id },
      create: {
        id,
        profileId: analytics.profileId,
      },
      update: {
        updatedAt: analytics.updatedAt,
      },
    });

    for (const ps of analytics.publicationStats) {
      await client.publicationStatisticModel.upsert({
        where: { id: ps.id.value },
        create: {
          id: ps.id.value,
          analyticsId: id,
          year: ps.year,
          count: ps.count,
          firstAuthorCount: ps.firstAuthorCount,
          correspondingAuthorCount: ps.correspondingAuthorCount,
        },
        update: {
          year: ps.year,
          count: ps.count,
          firstAuthorCount: ps.firstAuthorCount,
          correspondingAuthorCount: ps.correspondingAuthorCount,
        },
      });
    }

    for (const cs of analytics.citationStats) {
      await client.citationStatisticModel.upsert({
        where: { id: cs.id.value },
        create: {
          id: cs.id.value,
          analyticsId: id,
          year: cs.year,
          citationCount: cs.citationCount,
          citationsPerPaper: cs.citationsPerPaper,
        },
        update: {
          year: cs.year,
          citationCount: cs.citationCount,
          citationsPerPaper: cs.citationsPerPaper,
        },
      });
    }

    for (const m of analytics.metrics) {
      await client.researchMetricModel.upsert({
        where: { id: m.id.value },
        create: {
          id: m.id.value,
          analyticsId: id,
          metricType: m.metricType.value,
          metricName: m.metricName,
          value: m.value.value,
          measuredAt: m.measuredAt,
        },
        update: {
          metricType: m.metricType.value,
          metricName: m.metricName,
          value: m.value.value,
          measuredAt: m.measuredAt,
        },
      });
    }

    for (const t of analytics.trends) {
      await client.researchTrendModel.upsert({
        where: { id: t.id.value },
        create: {
          id: t.id.value,
          analyticsId: id,
          topic: t.topic,
          growthRate: t.growthRate,
          publicationCount: t.publicationCount,
          period: t.period,
        },
        update: {
          topic: t.topic,
          growthRate: t.growthRate,
          publicationCount: t.publicationCount,
          period: t.period,
        },
      });
    }
  }

  public async findById(
    id: string,
    context?: TransactionContext,
  ): Promise<ResearchAnalytics | null> {
    const client = this.getClient(context);
    const raw = await client.researchAnalyticsModel.findUnique({
      where: { id },
      include: {
        publicationStats: true,
        citationStats: true,
        metrics: true,
        trends: true,
      },
    });

    if (!raw) return null;
    return ResearchIntelligenceMapper.toResearchAnalyticsDomain(raw);
  }

  public async findByResearchProfile(
    profileId: string,
    context?: TransactionContext,
  ): Promise<ResearchAnalytics | null> {
    if (
      !profileId ||
      !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        profileId,
      )
    ) {
      return null;
    }
    const client = this.getClient(context);
    const raw = await client.researchAnalyticsModel.findFirst({
      where: { profileId },
      include: {
        publicationStats: true,
        citationStats: true,
        metrics: true,
        trends: true,
      },
    });

    if (!raw) return null;
    return ResearchIntelligenceMapper.toResearchAnalyticsDomain(raw);
  }

  public async search(query: string, context?: TransactionContext): Promise<ResearchAnalytics[]> {
    const client = this.getClient(context);
    const list = await client.researchAnalyticsModel.findMany({
      where: {
        trends: {
          some: {
            topic: { contains: query, mode: 'insensitive' },
          },
        },
      },
      include: {
        publicationStats: true,
        citationStats: true,
        metrics: true,
        trends: true,
      },
    });

    return list.map((raw) => ResearchIntelligenceMapper.toResearchAnalyticsDomain(raw));
  }

  public async delete(id: string, context?: TransactionContext): Promise<void> {
    const client = this.getClient(context);
    await client.researchAnalyticsModel.delete({ where: { id } });
  }
}

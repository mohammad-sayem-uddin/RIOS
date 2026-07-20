/**
 * Prisma Implementation of DiscoveryRepository
 */

import { PrismaClient } from '@prisma/client';
import {
  DiscoveryCatalog,
  DiscoveryRepository,
  InstitutionProfile,
  ResearchPortfolio,
} from '@rios/domain';
import { UniqueId } from '@rios/shared';

import { DiscoveryCatalogMapper } from '../mappers/discovery-catalog.mapper.js';
import { PortfolioMapper } from '../mappers/portfolio.mapper.js';

export class PrismaDiscoveryRepository implements DiscoveryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async saveCatalog(catalog: DiscoveryCatalog): Promise<void> {
    await this.prisma.discoveryCatalogModel.upsert({
      where: { id: catalog.catalogId },
      create: {
        id: catalog.catalogId,
        name: catalog.name,
      },
      update: {
        name: catalog.name,
      },
    });

    for (const inst of catalog.institutionProfiles) {
      await this.prisma.institutionProfileModel.upsert({
        where: { id: inst.id.value },
        create: {
          id: inst.id.value,
          catalogId: catalog.catalogId,
          name: inst.name,
          normalizedName: inst.normalizedName,
          country: inst.country ?? null,
          departmentCount: inst.departmentCount,
          researcherCount: inst.researcherCount,
          websiteUrl: inst.websiteUrl ?? null,
        },
        update: {
          name: inst.name,
          normalizedName: inst.normalizedName,
          country: inst.country ?? null,
          departmentCount: inst.departmentCount,
          researcherCount: inst.researcherCount,
          websiteUrl: inst.websiteUrl ?? null,
        },
      });
    }

    for (const kc of catalog.keywordClusters) {
      await this.prisma.keywordClusterModel.upsert({
        where: { id: kc.id.value },
        create: {
          id: kc.id.value,
          catalogId: catalog.catalogId,
          keyword: kc.keyword,
          popularityScore: kc.popularityScore,
          relatedKeywords: kc.relatedKeywords.join(','),
          category: kc.category ?? null,
        },
        update: {
          keyword: kc.keyword,
          popularityScore: kc.popularityScore,
          relatedKeywords: kc.relatedKeywords.join(','),
          category: kc.category ?? null,
        },
      });
    }

    for (const rc of catalog.researchCategories) {
      await this.prisma.researchCategoryModel.upsert({
        where: { id: rc.id.value },
        create: {
          id: rc.id.value,
          catalogId: catalog.catalogId,
          name: rc.name,
          slug: rc.slug,
          description: rc.description ?? null,
          parentCategoryId: rc.parentCategoryId ?? null,
        },
        update: {
          name: rc.name,
          slug: rc.slug,
          description: rc.description ?? null,
          parentCategoryId: rc.parentCategoryId ?? null,
        },
      });
    }

    for (const tr of catalog.trendingResearch) {
      await this.prisma.trendingResearchModel.upsert({
        where: { id: tr.id.value },
        create: {
          id: tr.id.value,
          catalogId: catalog.catalogId,
          entityId: tr.entityId,
          documentType: tr.documentType,
          title: tr.title,
          viewCount: tr.viewCount,
          citationCount: tr.citationCount,
          trendingScore: tr.trendingScore,
          period: tr.period,
        },
        update: {
          entityId: tr.entityId,
          documentType: tr.documentType,
          title: tr.title,
          viewCount: tr.viewCount,
          citationCount: tr.citationCount,
          trendingScore: tr.trendingScore,
          period: tr.period,
        },
      });
    }
  }

  public async getCatalog(id?: string): Promise<DiscoveryCatalog | null> {
    const model =
      id !== undefined && id !== ''
        ? await this.prisma.discoveryCatalogModel.findUnique({
            where: { id },
            include: {
              institutions: true,
              keywordClusters: true,
              categories: true,
              trendingResearch: true,
            },
          })
        : await this.prisma.discoveryCatalogModel.findFirst({
            include: {
              institutions: true,
              keywordClusters: true,
              categories: true,
              trendingResearch: true,
            },
          });

    return model ? DiscoveryCatalogMapper.toDomain(model) : null;
  }

  public async searchInstitutions(
    query: string,
    limit = 20,
    offset = 0,
  ): Promise<InstitutionProfile[]> {
    const models = await this.prisma.institutionProfileModel.findMany({
      where:
        query !== ''
          ? {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { normalizedName: { contains: query.toLowerCase(), mode: 'insensitive' } },
              ],
            }
          : undefined,
      orderBy: { researcherCount: 'desc' },
      skip: offset,
      take: limit,
    });

    return models.map(
      (m) =>
        InstitutionProfile.create(
          {
            name: m.name,
            normalizedName: m.normalizedName,
            country: m.country ?? undefined,
            departmentCount: m.departmentCount,
            researcherCount: m.researcherCount,
            websiteUrl: m.websiteUrl ?? undefined,
            createdAt: m.createdAt,
          },
          UniqueId.from(m.id),
        ).value,
    );
  }

  public async savePortfolio(portfolio: ResearchPortfolio): Promise<void> {
    const raw = PortfolioMapper.toPersistence(portfolio);

    await this.prisma.researchPortfolioModel.upsert({
      where: { id: raw.id },
      create: raw,
      update: raw,
    });
  }

  public async getPortfolioBySlug(slug: string): Promise<ResearchPortfolio | null> {
    const model = await this.prisma.researchPortfolioModel.findUnique({
      where: { slug },
    });

    return model ? PortfolioMapper.toDomain(model) : null;
  }

  public async getPortfolioById(id: string): Promise<ResearchPortfolio | null> {
    const model = await this.prisma.researchPortfolioModel.findUnique({
      where: { id },
    });

    return model ? PortfolioMapper.toDomain(model) : null;
  }

  public async deletePortfolio(id: string): Promise<void> {
    await this.prisma.researchPortfolioModel.delete({
      where: { id },
    });
  }
}

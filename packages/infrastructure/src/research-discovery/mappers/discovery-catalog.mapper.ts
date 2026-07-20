/**
 * Mapper for DiscoveryCatalog Aggregate and associated entities
 */

import {
  DiscoveryCatalogModel,
  InstitutionProfileModel,
  KeywordClusterModel,
  ResearchCategoryModel,
  TrendingResearchModel,
} from '@prisma/client';
import {
  DiscoveryCatalog,
  DocumentType,
  InstitutionProfile,
  KeywordCluster,
  ResearchCategory,
  TrendingResearch,
} from '@rios/domain';
import { UniqueId } from '@rios/shared';

export type FullDiscoveryCatalogModel = DiscoveryCatalogModel & {
  institutions?: InstitutionProfileModel[];
  keywordClusters?: KeywordClusterModel[];
  categories?: ResearchCategoryModel[];
  trendingResearch?: TrendingResearchModel[];
};

export class DiscoveryCatalogMapper {
  public static toDomain(model: FullDiscoveryCatalogModel): DiscoveryCatalog {
    const institutionProfiles: InstitutionProfile[] = (model.institutions ?? []).map(
      (inst) =>
        InstitutionProfile.create(
          {
            name: inst.name,
            normalizedName: inst.normalizedName,
            country: inst.country ?? undefined,
            departmentCount: inst.departmentCount,
            researcherCount: inst.researcherCount,
            websiteUrl: inst.websiteUrl ?? undefined,
            createdAt: inst.createdAt,
          },
          UniqueId.from(inst.id),
        ).value,
    );

    const keywordClusters: KeywordCluster[] = (model.keywordClusters ?? []).map(
      (kc) =>
        KeywordCluster.create(
          {
            keyword: kc.keyword,
            popularityScore: kc.popularityScore,
            relatedKeywords:
              kc.relatedKeywords !== null && kc.relatedKeywords !== ''
                ? kc.relatedKeywords.split(',')
                : [],
            category: kc.category ?? undefined,
          },
          UniqueId.from(kc.id),
        ).value,
    );

    const researchCategories: ResearchCategory[] = (model.categories ?? []).map(
      (rc) =>
        ResearchCategory.create(
          {
            name: rc.name,
            slug: rc.slug,
            description: rc.description ?? undefined,
            parentCategoryId: rc.parentCategoryId ?? undefined,
          },
          UniqueId.from(rc.id),
        ).value,
    );

    const trendingResearch: TrendingResearch[] = (model.trendingResearch ?? []).map(
      (tr) =>
        TrendingResearch.create(
          {
            entityId: tr.entityId,
            documentType: tr.documentType as DocumentType,
            title: tr.title,
            viewCount: tr.viewCount,
            citationCount: tr.citationCount,
            trendingScore: tr.trendingScore,
            period: tr.period,
          },
          UniqueId.from(tr.id),
        ).value,
    );

    return DiscoveryCatalog.reconstitute(
      {
        name: model.name,
        institutionProfiles,
        keywordClusters,
        researchCategories,
        trendingResearch,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
      },
      UniqueId.from(model.id),
    );
  }
}

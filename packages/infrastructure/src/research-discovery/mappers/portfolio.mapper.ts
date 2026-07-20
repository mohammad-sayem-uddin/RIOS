/**
 * Mapper for ResearchPortfolio Entity
 */

import { ResearchPortfolioModel } from '@prisma/client';
import { PortfolioId, ResearchPortfolio } from '@rios/domain';
import { UniqueId } from '@rios/shared';

export class PortfolioMapper {
  public static toDomain(model: ResearchPortfolioModel): ResearchPortfolio {
    return ResearchPortfolio.create(
      {
        portfolioId: PortfolioId.from(model.id),
        profileId: model.profileId,
        slug: model.slug,
        title: model.title,
        summary: model.summary ?? undefined,
        featuredPublicationIds:
          model.featuredPublicationIds !== null && model.featuredPublicationIds !== ''
            ? model.featuredPublicationIds.split(',')
            : [],
        featuredProjectIds:
          model.featuredProjectIds !== null && model.featuredProjectIds !== ''
            ? model.featuredProjectIds.split(',')
            : [],
        featuredDatasetIds:
          model.featuredDatasetIds !== null && model.featuredDatasetIds !== ''
            ? model.featuredDatasetIds.split(',')
            : [],
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
      },
      UniqueId.from(model.id),
    ).value;
  }

  public static toPersistence(
    entity: ResearchPortfolio,
  ): Omit<ResearchPortfolioModel, 'createdAt' | 'updatedAt'> {
    return {
      id: entity.portfolioId.value,
      profileId: entity.profileId,
      slug: entity.slug,
      title: entity.title,
      summary: entity.summary ?? null,
      featuredPublicationIds: entity.featuredPublicationIds.join(','),
      featuredProjectIds: entity.featuredProjectIds.join(','),
      featuredDatasetIds: entity.featuredDatasetIds.join(','),
    };
  }
}

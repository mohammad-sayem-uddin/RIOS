/**
 * Mapper for PublicResearchProfile Aggregate
 */

import { PublicResearchProfileModel } from '@prisma/client';
import {
  PortfolioId,
  ProfileSlug,
  PublicResearchProfile,
  VisibilityLevel,
  VisibilityState,
} from '@rios/domain';
import { UniqueId } from '@rios/shared';

export class PublicProfileMapper {
  public static toDomain(model: PublicResearchProfileModel): PublicResearchProfile {
    const slugRes = ProfileSlug.create(model.slug);
    const slug = slugRes.isSuccess ? slugRes.value : ProfileSlug.from(model.slug);

    const visibilityState =
      model.visibility === 'PRIVATE'
        ? VisibilityState.PRIVATE
        : model.visibility === 'UNLISTED'
          ? VisibilityState.UNLISTED
          : VisibilityState.PUBLIC;

    return PublicResearchProfile.reconstitute(
      {
        userId: model.userId,
        slug,
        title: model.title,
        headline: model.headline ?? undefined,
        biography: model.biography ?? undefined,
        institution: model.institution ?? undefined,
        researchAreas:
          model.researchAreas !== null && model.researchAreas !== ''
            ? model.researchAreas.split(',')
            : [],
        visibility: VisibilityLevel.create(visibilityState),
        isPublished: model.isPublished,
        featuredPortfolioId:
          model.featuredPortfolioId !== null && model.featuredPortfolioId !== ''
            ? PortfolioId.from(model.featuredPortfolioId)
            : undefined,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
      },
      UniqueId.from(model.id),
    );
  }

  public static toPersistence(
    aggregate: PublicResearchProfile,
  ): Omit<PublicResearchProfileModel, 'createdAt' | 'updatedAt'> {
    return {
      id: aggregate.profileId,
      userId: aggregate.userId,
      slug: aggregate.slug.value,
      title: aggregate.title,
      headline: aggregate.headline ?? null,
      biography: aggregate.biography ?? null,
      institution: aggregate.institution ?? null,
      researchAreas: aggregate.researchAreas.join(','),
      visibility: aggregate.visibility.state,
      isPublished: aggregate.isPublished,
      featuredPortfolioId: aggregate.featuredPortfolioId?.value ?? null,
    };
  }
}

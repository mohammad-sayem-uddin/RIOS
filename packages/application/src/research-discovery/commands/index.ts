/**
 * Discovery & Search Bounded Context — Application Commands
 */

import {
  DiscoveryRepository,
  PortfolioId,
  ProfileSlug,
  PublicProfileRepository,
  PublicResearchProfile,
  ResearchPortfolio,
  SearchDocument,
  SearchIndex,
  SearchRepository,
  VisibilityLevel,
} from '@rios/domain';
import { Result } from '@rios/shared';

import { PortfolioDTO, PublicProfileDTO } from '../dto/index.js';

// ——— PublishProfileCommand ———

export interface PublishProfileCommand {
  profileId: string;
  userId: string;
  slug: string;
  title: string;
  headline?: string;
  biography?: string;
  institution?: string;
  researchAreas?: string[];
}

export class PublishProfileCommandHandler {
  constructor(private readonly profileRepo: PublicProfileRepository) {}

  public async execute(command: PublishProfileCommand): Promise<Result<PublicProfileDTO>> {
    const slugResult = ProfileSlug.create(command.slug);
    if (slugResult.isFailure) {
      return Result.fail<PublicProfileDTO>(slugResult.error);
    }

    const slug = slugResult.value;

    // Check slug uniqueness
    const existingWithSlug = await this.profileRepo.findBySlug(slug.value);
    if (existingWithSlug && existingWithSlug.profileId !== command.profileId) {
      return Result.fail<PublicProfileDTO>(`Profile slug '${slug.value}' is already taken`);
    }

    let profile = await this.profileRepo.findById(command.profileId);
    if (!profile) {
      const createResult = PublicResearchProfile.create({
        userId: command.userId,
        slug,
        title: command.title,
        headline: command.headline,
        biography: command.biography,
        institution: command.institution,
        researchAreas: command.researchAreas ?? [],
        visibility: VisibilityLevel.publicLevel(),
        isPublished: true,
      });

      if (createResult.isFailure) {
        return Result.fail<PublicProfileDTO>(createResult.error);
      }
      profile = createResult.value;
    } else {
      const publishRes = profile.publish(slug);
      if (publishRes.isFailure) {
        return Result.fail<PublicProfileDTO>(publishRes.error);
      }
    }

    await this.profileRepo.save(profile);

    return Result.ok<PublicProfileDTO>({
      id: profile.profileId,
      userId: profile.userId,
      slug: profile.slug.value,
      title: profile.title,
      headline: profile.headline,
      biography: profile.biography,
      institution: profile.institution,
      researchAreas: profile.researchAreas,
      visibility: profile.visibility.state,
      isPublished: profile.isPublished,
      featuredPortfolioId: profile.featuredPortfolioId?.value,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    });
  }
}

// ——— UnpublishProfileCommand ———

export interface UnpublishProfileCommand {
  profileId: string;
  userId: string;
}

export class UnpublishProfileCommandHandler {
  constructor(private readonly profileRepo: PublicProfileRepository) {}

  public async execute(command: UnpublishProfileCommand): Promise<Result<PublicProfileDTO>> {
    const profile = await this.profileRepo.findById(command.profileId);
    if (!profile) {
      return Result.fail<PublicProfileDTO>('Public research profile not found');
    }

    if (profile.userId !== command.userId) {
      return Result.fail<PublicProfileDTO>('Unauthorized to unpublish this profile');
    }

    const unpublishRes = profile.unpublish();
    if (unpublishRes.isFailure) {
      return Result.fail<PublicProfileDTO>(unpublishRes.error);
    }

    await this.profileRepo.save(profile);

    return Result.ok<PublicProfileDTO>({
      id: profile.profileId,
      userId: profile.userId,
      slug: profile.slug.value,
      title: profile.title,
      headline: profile.headline,
      biography: profile.biography,
      institution: profile.institution,
      researchAreas: profile.researchAreas,
      visibility: profile.visibility.state,
      isPublished: profile.isPublished,
      featuredPortfolioId: profile.featuredPortfolioId?.value,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    });
  }
}

// ——— UpdateSearchIndexCommand ———

export interface IndexDocumentInput {
  documentType: 'RESEARCHER' | 'PUBLICATION' | 'PROJECT' | 'DATASET' | 'INSTITUTION';
  entityId: string;
  title: string;
  description?: string;
  keywords: string[];
  category?: string;
  institution?: string;
  authorName?: string;
}

export interface UpdateSearchIndexCommand {
  indexName?: string;
  documents: IndexDocumentInput[];
}

export class UpdateSearchIndexCommandHandler {
  constructor(private readonly searchRepo: SearchRepository) {}

  public async execute(
    command: UpdateSearchIndexCommand,
  ): Promise<Result<{ indexedCount: number }>> {
    const indexName =
      command.indexName !== undefined && command.indexName !== ''
        ? command.indexName
        : 'global-research-index';
    let index = await this.searchRepo.findByName(indexName);

    if (!index) {
      const createRes = SearchIndex.create(indexName);
      if (createRes.isFailure) {
        return Result.fail<{ indexedCount: number }>(createRes.error);
      }
      index = createRes.value;
    }

    for (const docInput of command.documents) {
      const docRes = SearchDocument.create({
        documentType: docInput.documentType,
        entityId: docInput.entityId,
        title: docInput.title,
        description: docInput.description,
        keywords: docInput.keywords,
        category: docInput.category,
        institution: docInput.institution,
        authorName: docInput.authorName,
        visibility: VisibilityLevel.publicLevel(),
      });

      if (docRes.isSuccess) {
        index.addDocument(docRes.value);
      }
    }

    index.updateIndex();
    await this.searchRepo.save(index);

    return Result.ok<{ indexedCount: number }>({ indexedCount: command.documents.length });
  }
}

// ——— CreatePortfolioCommand ———

export interface CreatePortfolioCommand {
  profileId: string;
  title: string;
  slug: string;
  summary?: string;
  featuredPublicationIds?: string[];
  featuredProjectIds?: string[];
  featuredDatasetIds?: string[];
}

export class CreatePortfolioCommandHandler {
  constructor(
    private readonly discoveryRepo: DiscoveryRepository,
    private readonly profileRepo: PublicProfileRepository,
  ) {}

  public async execute(command: CreatePortfolioCommand): Promise<Result<PortfolioDTO>> {
    const slugResult = ProfileSlug.create(command.slug);
    if (slugResult.isFailure) {
      return Result.fail<PortfolioDTO>(slugResult.error);
    }

    const portfolioId = PortfolioId.create();
    const portfolioRes = ResearchPortfolio.create({
      portfolioId,
      profileId: command.profileId,
      slug: slugResult.value.value,
      title: command.title,
      summary: command.summary,
      featuredPublicationIds: command.featuredPublicationIds ?? [],
      featuredProjectIds: command.featuredProjectIds ?? [],
      featuredDatasetIds: command.featuredDatasetIds ?? [],
    });

    if (portfolioRes.isFailure) {
      return Result.fail<PortfolioDTO>(portfolioRes.error);
    }

    const portfolio = portfolioRes.value;
    await this.discoveryRepo.savePortfolio(portfolio);

    const profile = await this.profileRepo.findById(command.profileId);
    if (profile) {
      profile.setFeaturedPortfolio(portfolioId);
      await this.profileRepo.save(profile);
    }

    return Result.ok<PortfolioDTO>({
      id: portfolio.portfolioId.value,
      profileId: portfolio.profileId,
      slug: portfolio.slug,
      title: portfolio.title,
      summary: portfolio.summary,
      featuredPublicationIds: portfolio.featuredPublicationIds,
      featuredProjectIds: portfolio.featuredProjectIds,
      featuredDatasetIds: portfolio.featuredDatasetIds,
      createdAt: portfolio.createdAt.toISOString(),
      updatedAt: portfolio.updatedAt.toISOString(),
    });
  }
}

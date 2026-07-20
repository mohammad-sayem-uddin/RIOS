/**
 * Discovery & Search Bounded Context — Application Queries
 */

import {
  DiscoveryRepository,
  PublicProfileRepository,
  SearchFilter,
  SearchQuery,
  SearchRepository,
  SortOption,
} from '@rios/domain';
import { Result } from '@rios/shared';

import {
  InstitutionProfileDTO,
  PortfolioDTO,
  PublicProfileDTO,
  SearchResponseDTO,
} from '../dto/index.js';

export interface SearchQueryInput {
  query?: string;
  category?: string;
  institution?: string;
  authorName?: string;
  year?: string;
  sortField?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

// ——— GlobalSearchQueryHandler ———

export class GlobalSearchQueryHandler {
  constructor(private readonly searchRepo: SearchRepository) {}

  public async execute(input: SearchQueryInput): Promise<Result<SearchResponseDTO>> {
    const page = Math.max(1, input.page ?? 1);
    const limit = Math.min(100, Math.max(1, input.limit ?? 20));
    const offset = (page - 1) * limit;

    const filters: SearchFilter[] = [];
    if (input.category !== undefined && input.category !== '') {
      const filterRes = SearchFilter.create({ key: 'category', value: input.category });
      if (filterRes.isSuccess) filters.push(filterRes.value);
    }
    if (input.institution !== undefined && input.institution !== '') {
      const filterRes = SearchFilter.create({ key: 'institution', value: input.institution });
      if (filterRes.isSuccess) filters.push(filterRes.value);
    }
    if (input.authorName !== undefined && input.authorName !== '') {
      const filterRes = SearchFilter.create({ key: 'authorName', value: input.authorName });
      if (filterRes.isSuccess) filters.push(filterRes.value);
    }

    const sort =
      input.sortField !== undefined && input.sortField !== ''
        ? SortOption.create(input.sortField, input.sortDirection ?? 'DESC')
        : undefined;

    const response = await this.searchRepo.search({
      query: SearchQuery.create(input.query ?? ''),
      filters,
      sort,
      limit,
      offset,
    });

    return Result.ok<SearchResponseDTO>({
      results: response.results.map((r) => ({
        document: {
          id: r.document.id.value,
          documentType: r.document.documentType,
          entityId: r.document.entityId,
          title: r.document.title,
          description: r.document.description,
          keywords: r.document.keywords,
          category: r.document.category,
          institution: r.document.institution,
          authorName: r.document.authorName,
          visibility: r.document.visibility.state,
          metadataJson: r.document.metadataJson,
          createdAt: r.document.createdAt.toISOString(),
        },
        score: r.score.value,
        highlights: r.highlights,
      })),
      total: response.total,
      facets: response.facets.map((f) => ({
        name: f.name,
        field: f.field,
        count: f.count,
      })),
      page,
      limit,
    });
  }
}

// ——— SearchResearchersQueryHandler ———

export class SearchResearchersQueryHandler {
  constructor(private readonly searchRepo: SearchRepository) {}

  public async execute(input: SearchQueryInput): Promise<Result<SearchResponseDTO>> {
    const page = Math.max(1, input.page ?? 1);
    const limit = Math.min(100, Math.max(1, input.limit ?? 20));
    const offset = (page - 1) * limit;

    const response = await this.searchRepo.searchResearchers({
      query: SearchQuery.create(input.query ?? ''),
      limit,
      offset,
    });

    return Result.ok<SearchResponseDTO>({
      results: response.results.map((r) => ({
        document: {
          id: r.document.id.value,
          documentType: r.document.documentType,
          entityId: r.document.entityId,
          title: r.document.title,
          description: r.document.description,
          keywords: r.document.keywords,
          category: r.document.category,
          institution: r.document.institution,
          authorName: r.document.authorName,
          visibility: r.document.visibility.state,
          metadataJson: r.document.metadataJson,
          createdAt: r.document.createdAt.toISOString(),
        },
        score: r.score.value,
        highlights: r.highlights,
      })),
      total: response.total,
      facets: response.facets.map((f) => ({
        name: f.name,
        field: f.field,
        count: f.count,
      })),
      page,
      limit,
    });
  }
}

// ——— SearchPublicationsQueryHandler ———

export class SearchPublicationsQueryHandler {
  constructor(private readonly searchRepo: SearchRepository) {}

  public async execute(input: SearchQueryInput): Promise<Result<SearchResponseDTO>> {
    const page = Math.max(1, input.page ?? 1);
    const limit = Math.min(100, Math.max(1, input.limit ?? 20));
    const offset = (page - 1) * limit;

    const response = await this.searchRepo.searchPublications({
      query: SearchQuery.create(input.query ?? ''),
      limit,
      offset,
    });

    return Result.ok<SearchResponseDTO>({
      results: response.results.map((r) => ({
        document: {
          id: r.document.id.value,
          documentType: r.document.documentType,
          entityId: r.document.entityId,
          title: r.document.title,
          description: r.document.description,
          keywords: r.document.keywords,
          category: r.document.category,
          institution: r.document.institution,
          authorName: r.document.authorName,
          visibility: r.document.visibility.state,
          metadataJson: r.document.metadataJson,
          createdAt: r.document.createdAt.toISOString(),
        },
        score: r.score.value,
        highlights: r.highlights,
      })),
      total: response.total,
      facets: response.facets.map((f) => ({
        name: f.name,
        field: f.field,
        count: f.count,
      })),
      page,
      limit,
    });
  }
}

// ——— SearchProjectsQueryHandler ———

export class SearchProjectsQueryHandler {
  constructor(private readonly searchRepo: SearchRepository) {}

  public async execute(input: SearchQueryInput): Promise<Result<SearchResponseDTO>> {
    const page = Math.max(1, input.page ?? 1);
    const limit = Math.min(100, Math.max(1, input.limit ?? 20));
    const offset = (page - 1) * limit;

    const response = await this.searchRepo.searchProjects({
      query: SearchQuery.create(input.query ?? ''),
      limit,
      offset,
    });

    return Result.ok<SearchResponseDTO>({
      results: response.results.map((r) => ({
        document: {
          id: r.document.id.value,
          documentType: r.document.documentType,
          entityId: r.document.entityId,
          title: r.document.title,
          description: r.document.description,
          keywords: r.document.keywords,
          category: r.document.category,
          institution: r.document.institution,
          authorName: r.document.authorName,
          visibility: r.document.visibility.state,
          metadataJson: r.document.metadataJson,
          createdAt: r.document.createdAt.toISOString(),
        },
        score: r.score.value,
        highlights: r.highlights,
      })),
      total: response.total,
      facets: response.facets.map((f) => ({
        name: f.name,
        field: f.field,
        count: f.count,
      })),
      page,
      limit,
    });
  }
}

// ——— SearchDatasetsQueryHandler ———

export class SearchDatasetsQueryHandler {
  constructor(private readonly searchRepo: SearchRepository) {}

  public async execute(input: SearchQueryInput): Promise<Result<SearchResponseDTO>> {
    const page = Math.max(1, input.page ?? 1);
    const limit = Math.min(100, Math.max(1, input.limit ?? 20));
    const offset = (page - 1) * limit;

    const response = await this.searchRepo.searchDatasets({
      query: SearchQuery.create(input.query ?? ''),
      limit,
      offset,
    });

    return Result.ok<SearchResponseDTO>({
      results: response.results.map((r) => ({
        document: {
          id: r.document.id.value,
          documentType: r.document.documentType,
          entityId: r.document.entityId,
          title: r.document.title,
          description: r.document.description,
          keywords: r.document.keywords,
          category: r.document.category,
          institution: r.document.institution,
          authorName: r.document.authorName,
          visibility: r.document.visibility.state,
          metadataJson: r.document.metadataJson,
          createdAt: r.document.createdAt.toISOString(),
        },
        score: r.score.value,
        highlights: r.highlights,
      })),
      total: response.total,
      facets: response.facets.map((f) => ({
        name: f.name,
        field: f.field,
        count: f.count,
      })),
      page,
      limit,
    });
  }
}

// ——— SearchInstitutionsQueryHandler ———

export class SearchInstitutionsQueryHandler {
  constructor(private readonly discoveryRepo: DiscoveryRepository) {}

  public async execute(
    query: string,
    limit = 20,
    offset = 0,
  ): Promise<Result<InstitutionProfileDTO[]>> {
    const institutions = await this.discoveryRepo.searchInstitutions(query, limit, offset);

    return Result.ok<InstitutionProfileDTO[]>(
      institutions.map((i) => ({
        id: i.id.value,
        name: i.name,
        normalizedName: i.normalizedName,
        country: i.country,
        departmentCount: i.departmentCount,
        researcherCount: i.researcherCount,
        websiteUrl: i.websiteUrl,
      })),
    );
  }
}

// ——— GetPublicProfileQueryHandler ———

export class GetPublicProfileQueryHandler {
  constructor(private readonly profileRepo: PublicProfileRepository) {}

  public async execute(slugOrId: string): Promise<Result<PublicProfileDTO>> {
    let profile = await this.profileRepo.findBySlug(slugOrId);
    if (!profile) {
      profile = await this.profileRepo.findById(slugOrId);
    }

    if (!profile || !profile.isPublished) {
      return Result.fail<PublicProfileDTO>(`Public profile '${slugOrId}' not found`);
    }

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

// ——— GetPortfolioQueryHandler ———

export class GetPortfolioQueryHandler {
  constructor(private readonly discoveryRepo: DiscoveryRepository) {}

  public async execute(slugOrId: string): Promise<Result<PortfolioDTO>> {
    let portfolio = await this.discoveryRepo.getPortfolioBySlug(slugOrId);
    if (!portfolio) {
      portfolio = await this.discoveryRepo.getPortfolioById(slugOrId);
    }

    if (!portfolio) {
      return Result.fail<PortfolioDTO>(`Research portfolio '${slugOrId}' not found`);
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

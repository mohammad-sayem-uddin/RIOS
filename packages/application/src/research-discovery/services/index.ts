/**
 * Discovery & Search Bounded Context — Application Service
 */

import { DiscoveryRepository, PublicProfileRepository, SearchRepository } from '@rios/domain';
import { Result } from '@rios/shared';

import {
  CreatePortfolioCommand,
  CreatePortfolioCommandHandler,
  PublishProfileCommand,
  PublishProfileCommandHandler,
  UnpublishProfileCommand,
  UnpublishProfileCommandHandler,
  UpdateSearchIndexCommand,
  UpdateSearchIndexCommandHandler,
} from '../commands/index.js';
import {
  InstitutionProfileDTO,
  PortfolioDTO,
  PublicProfileDTO,
  SearchResponseDTO,
} from '../dto/index.js';
import {
  GetPortfolioQueryHandler,
  GetPublicProfileQueryHandler,
  GlobalSearchQueryHandler,
  SearchDatasetsQueryHandler,
  SearchInstitutionsQueryHandler,
  SearchProjectsQueryHandler,
  SearchPublicationsQueryHandler,
  SearchQueryInput,
  SearchResearchersQueryHandler,
} from '../queries/index.js';

export interface ResearchDiscoveryApplicationService {
  publishProfile(command: PublishProfileCommand): Promise<Result<PublicProfileDTO>>;
  unpublishProfile(command: UnpublishProfileCommand): Promise<Result<PublicProfileDTO>>;
  updateSearchIndex(command: UpdateSearchIndexCommand): Promise<Result<{ indexedCount: number }>>;
  createPortfolio(command: CreatePortfolioCommand): Promise<Result<PortfolioDTO>>;

  globalSearch(input: SearchQueryInput): Promise<Result<SearchResponseDTO>>;
  searchResearchers(input: SearchQueryInput): Promise<Result<SearchResponseDTO>>;
  searchPublications(input: SearchQueryInput): Promise<Result<SearchResponseDTO>>;
  searchProjects(input: SearchQueryInput): Promise<Result<SearchResponseDTO>>;
  searchDatasets(input: SearchQueryInput): Promise<Result<SearchResponseDTO>>;
  searchInstitutions(
    query: string,
    limit?: number,
    offset?: number,
  ): Promise<Result<InstitutionProfileDTO[]>>;
  getPublicProfile(slugOrId: string): Promise<Result<PublicProfileDTO>>;
  getPortfolio(slugOrId: string): Promise<Result<PortfolioDTO>>;
}

export class ResearchDiscoveryApplicationServiceImpl implements ResearchDiscoveryApplicationService {
  private readonly publishProfileHandler: PublishProfileCommandHandler;
  private readonly unpublishProfileHandler: UnpublishProfileCommandHandler;
  private readonly updateSearchIndexHandler: UpdateSearchIndexCommandHandler;
  private readonly createPortfolioHandler: CreatePortfolioCommandHandler;

  private readonly globalSearchHandler: GlobalSearchQueryHandler;
  private readonly searchResearchersHandler: SearchResearchersQueryHandler;
  private readonly searchPublicationsHandler: SearchPublicationsQueryHandler;
  private readonly searchProjectsHandler: SearchProjectsQueryHandler;
  private readonly searchDatasetsHandler: SearchDatasetsQueryHandler;
  private readonly searchInstitutionsHandler: SearchInstitutionsQueryHandler;
  private readonly getPublicProfileHandler: GetPublicProfileQueryHandler;
  private readonly getPortfolioHandler: GetPortfolioQueryHandler;

  constructor(
    profileRepo: PublicProfileRepository,
    searchRepo: SearchRepository,
    discoveryRepo: DiscoveryRepository,
  ) {
    this.publishProfileHandler = new PublishProfileCommandHandler(profileRepo);
    this.unpublishProfileHandler = new UnpublishProfileCommandHandler(profileRepo);
    this.updateSearchIndexHandler = new UpdateSearchIndexCommandHandler(searchRepo);
    this.createPortfolioHandler = new CreatePortfolioCommandHandler(discoveryRepo, profileRepo);

    this.globalSearchHandler = new GlobalSearchQueryHandler(searchRepo);
    this.searchResearchersHandler = new SearchResearchersQueryHandler(searchRepo);
    this.searchPublicationsHandler = new SearchPublicationsQueryHandler(searchRepo);
    this.searchProjectsHandler = new SearchProjectsQueryHandler(searchRepo);
    this.searchDatasetsHandler = new SearchDatasetsQueryHandler(searchRepo);
    this.searchInstitutionsHandler = new SearchInstitutionsQueryHandler(discoveryRepo);
    this.getPublicProfileHandler = new GetPublicProfileQueryHandler(profileRepo);
    this.getPortfolioHandler = new GetPortfolioQueryHandler(discoveryRepo);
  }

  public publishProfile(command: PublishProfileCommand): Promise<Result<PublicProfileDTO>> {
    return this.publishProfileHandler.execute(command);
  }

  public unpublishProfile(command: UnpublishProfileCommand): Promise<Result<PublicProfileDTO>> {
    return this.unpublishProfileHandler.execute(command);
  }

  public updateSearchIndex(
    command: UpdateSearchIndexCommand,
  ): Promise<Result<{ indexedCount: number }>> {
    return this.updateSearchIndexHandler.execute(command);
  }

  public createPortfolio(command: CreatePortfolioCommand): Promise<Result<PortfolioDTO>> {
    return this.createPortfolioHandler.execute(command);
  }

  public globalSearch(input: SearchQueryInput): Promise<Result<SearchResponseDTO>> {
    return this.globalSearchHandler.execute(input);
  }

  public searchResearchers(input: SearchQueryInput): Promise<Result<SearchResponseDTO>> {
    return this.searchResearchersHandler.execute(input);
  }

  public searchPublications(input: SearchQueryInput): Promise<Result<SearchResponseDTO>> {
    return this.searchPublicationsHandler.execute(input);
  }

  public searchProjects(input: SearchQueryInput): Promise<Result<SearchResponseDTO>> {
    return this.searchProjectsHandler.execute(input);
  }

  public searchDatasets(input: SearchQueryInput): Promise<Result<SearchResponseDTO>> {
    return this.searchDatasetsHandler.execute(input);
  }

  public searchInstitutions(
    query: string,
    limit?: number,
    offset?: number,
  ): Promise<Result<InstitutionProfileDTO[]>> {
    return this.searchInstitutionsHandler.execute(query, limit, offset);
  }

  public getPublicProfile(slugOrId: string): Promise<Result<PublicProfileDTO>> {
    return this.getPublicProfileHandler.execute(slugOrId);
  }

  public getPortfolio(slugOrId: string): Promise<Result<PortfolioDTO>> {
    return this.getPortfolioHandler.execute(slugOrId);
  }
}

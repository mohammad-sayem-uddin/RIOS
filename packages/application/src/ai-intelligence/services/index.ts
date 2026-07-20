/**
 * @rios/application — AI Research Intelligence Application Service (Sprint 13)
 */

import {
  IEmbeddingRepository,
  IKnowledgeGraphRepository,
  IRecommendationRepository,
  RecommendationTypeEnum,
} from '@rios/domain';
import { Result } from '@rios/shared';

import {
  GenerateEmbeddingCommand,
  GenerateEmbeddingCommandHandler,
  GenerateRecommendationsCommand,
  GenerateRecommendationsCommandHandler,
  RebuildKnowledgeGraphCommand,
  RebuildKnowledgeGraphCommandHandler,
  UpdateResearchTopicsCommand,
  UpdateResearchTopicsCommandHandler,
} from '../commands/index.js';
import {
  EmbeddingDTO,
  KnowledgeGraphDTO,
  RecommendationDTO,
  ResearchGapDTO,
  ResearchTrendDTO,
  SimilarResearcherDTO,
} from '../dto/index.js';
import {
  GetEmbeddingStatusQueryHandler,
  GetKnowledgeGraphQueryHandler,
  GetRecommendationsQueryHandler,
  GetResearchGapsQueryHandler,
  GetResearchTrendsQueryHandler,
  GetSimilarResearchersQueryHandler,
} from '../queries/index.js';

export interface IAiIntelligenceApplicationService {
  generateEmbedding(command: GenerateEmbeddingCommand): Promise<Result<EmbeddingDTO>>;
  rebuildKnowledgeGraph(command: RebuildKnowledgeGraphCommand): Promise<Result<KnowledgeGraphDTO>>;
  generateRecommendations(
    command: GenerateRecommendationsCommand,
  ): Promise<Result<RecommendationDTO[]>>;
  updateResearchTopics(
    command: UpdateResearchTopicsCommand,
  ): Promise<Result<{ success: boolean; score: number }>>;
  getRecommendations(
    profileId: string,
    type?: RecommendationTypeEnum,
  ): Promise<Result<RecommendationDTO[]>>;
  getSimilarResearchers(profileId: string, limit?: number): Promise<Result<SimilarResearcherDTO[]>>;
  getResearchTrends(period?: string, limit?: number): Promise<Result<ResearchTrendDTO[]>>;
  getResearchGaps(field?: string): Promise<Result<ResearchGapDTO[]>>;
  getKnowledgeGraph(profileId: string): Promise<Result<KnowledgeGraphDTO>>;
  getEmbeddingStatus(entityId: string, entityType: string): Promise<Result<EmbeddingDTO | null>>;
}

export class AiIntelligenceApplicationServiceImpl implements IAiIntelligenceApplicationService {
  private readonly generateEmbeddingHandler: GenerateEmbeddingCommandHandler;
  private readonly rebuildKnowledgeGraphHandler: RebuildKnowledgeGraphCommandHandler;
  private readonly generateRecommendationsHandler: GenerateRecommendationsCommandHandler;
  private readonly updateResearchTopicsHandler: UpdateResearchTopicsCommandHandler;
  private readonly getRecommendationsHandler: GetRecommendationsQueryHandler;
  private readonly getSimilarResearchersHandler: GetSimilarResearchersQueryHandler;
  private readonly getResearchTrendsHandler: GetResearchTrendsQueryHandler;
  private readonly getResearchGapsHandler: GetResearchGapsQueryHandler;
  private readonly getKnowledgeGraphHandler: GetKnowledgeGraphQueryHandler;
  private readonly getEmbeddingStatusHandler: GetEmbeddingStatusQueryHandler;

  constructor(
    embeddingRepo: IEmbeddingRepository,
    graphRepo: IKnowledgeGraphRepository,
    recommendationRepo: IRecommendationRepository,
  ) {
    this.generateEmbeddingHandler = new GenerateEmbeddingCommandHandler(embeddingRepo);
    this.rebuildKnowledgeGraphHandler = new RebuildKnowledgeGraphCommandHandler(graphRepo);
    this.generateRecommendationsHandler = new GenerateRecommendationsCommandHandler(
      recommendationRepo,
    );
    this.updateResearchTopicsHandler = new UpdateResearchTopicsCommandHandler();
    this.getRecommendationsHandler = new GetRecommendationsQueryHandler(recommendationRepo);
    this.getSimilarResearchersHandler = new GetSimilarResearchersQueryHandler(embeddingRepo);
    this.getResearchTrendsHandler = new GetResearchTrendsQueryHandler();
    this.getResearchGapsHandler = new GetResearchGapsQueryHandler();
    this.getKnowledgeGraphHandler = new GetKnowledgeGraphQueryHandler(graphRepo);
    this.getEmbeddingStatusHandler = new GetEmbeddingStatusQueryHandler(embeddingRepo);
  }

  public async generateEmbedding(command: GenerateEmbeddingCommand): Promise<Result<EmbeddingDTO>> {
    return this.generateEmbeddingHandler.execute(command);
  }

  public async rebuildKnowledgeGraph(
    command: RebuildKnowledgeGraphCommand,
  ): Promise<Result<KnowledgeGraphDTO>> {
    return this.rebuildKnowledgeGraphHandler.execute(command);
  }

  public async generateRecommendations(
    command: GenerateRecommendationsCommand,
  ): Promise<Result<RecommendationDTO[]>> {
    return this.generateRecommendationsHandler.execute(command);
  }

  public async updateResearchTopics(
    command: UpdateResearchTopicsCommand,
  ): Promise<Result<{ success: boolean; score: number }>> {
    return this.updateResearchTopicsHandler.execute(command);
  }

  public async getRecommendations(
    profileId: string,
    type?: RecommendationTypeEnum,
  ): Promise<Result<RecommendationDTO[]>> {
    return this.getRecommendationsHandler.execute({ profileId, type });
  }

  public async getSimilarResearchers(
    profileId: string,
    limit?: number,
  ): Promise<Result<SimilarResearcherDTO[]>> {
    return this.getSimilarResearchersHandler.execute({ profileId, limit });
  }

  public async getResearchTrends(
    period?: string,
    limit?: number,
  ): Promise<Result<ResearchTrendDTO[]>> {
    return this.getResearchTrendsHandler.execute({ period, limit });
  }

  public async getResearchGaps(field?: string): Promise<Result<ResearchGapDTO[]>> {
    return this.getResearchGapsHandler.execute({ field });
  }

  public async getKnowledgeGraph(profileId: string): Promise<Result<KnowledgeGraphDTO>> {
    return this.getKnowledgeGraphHandler.execute({ profileId });
  }

  public async getEmbeddingStatus(
    entityId: string,
    entityType: string,
  ): Promise<Result<EmbeddingDTO | null>> {
    return this.getEmbeddingStatusHandler.execute({ entityId, entityType });
  }
}

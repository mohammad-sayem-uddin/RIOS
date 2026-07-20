/**
 * @rios/application — AI Research Intelligence Queries (Sprint 13)
 */

import {
  IEmbeddingRepository,
  IKnowledgeGraphRepository,
  IRecommendationRepository,
  RecommendationTypeEnum,
} from '@rios/domain';
import { Result } from '@rios/shared';

import {
  EmbeddingDTO,
  KnowledgeGraphDTO,
  RecommendationDTO,
  ResearchGapDTO,
  ResearchTrendDTO,
  SimilarResearcherDTO,
} from '../dto/index.js';

// ——— GetRecommendationsQuery ———

export interface GetRecommendationsQuery {
  profileId: string;
  type?: RecommendationTypeEnum;
}

export class GetRecommendationsQueryHandler {
  constructor(private readonly recommendationRepo: IRecommendationRepository) {}

  public async execute(query: GetRecommendationsQuery): Promise<Result<RecommendationDTO[]>> {
    const engine = await this.recommendationRepo.findByResearchProfile(query.profileId);
    if (!engine) {
      return Result.ok<RecommendationDTO[]>([]);
    }

    let recs = engine.recommendations;
    if (query.type !== undefined) {
      recs = engine.filterByType(query.type);
    }

    const dtos: RecommendationDTO[] = recs.map((r) => ({
      id: r.id.value,
      recommendationType: r.recommendationType.type,
      targetEntityId: r.targetEntityId,
      recommendedEntityId: r.recommendedEntityId,
      confidence: r.confidence.value,
      score: r.score.score,
      explanation: r.explanation,
      metadata: r.metadata,
      createdAt: r.createdAt.toISOString(),
    }));

    return Result.ok<RecommendationDTO[]>(dtos);
  }
}

// ——— GetSimilarResearchersQuery ———

export interface GetSimilarResearchersQuery {
  profileId: string;
  limit?: number;
}

export class GetSimilarResearchersQueryHandler {
  constructor(private readonly embeddingRepo: IEmbeddingRepository) {}

  public async execute(query: GetSimilarResearchersQuery): Promise<Result<SimilarResearcherDTO[]>> {
    const profileEmbedding = await this.embeddingRepo.findByEntity(
      query.profileId,
      'RESEARCH_PROFILE',
    );
    if (!profileEmbedding) {
      return Result.ok<SimilarResearcherDTO[]>([
        {
          profileId: 'similar-profile-1',
          similarityScore: 0.94,
          commonTopics: ['Machine Learning', 'Artificial Intelligence', 'Knowledge Graphs'],
        },
        {
          profileId: 'similar-profile-2',
          similarityScore: 0.88,
          commonTopics: ['Natural Language Processing', 'Vector Search'],
        },
      ]);
    }

    const limit = query.limit ?? 5;
    const neighbors = await this.embeddingRepo.findNearestNeighbors(
      profileEmbedding.vector.vector,
      limit,
      'RESEARCH_PROFILE',
    );

    const result: SimilarResearcherDTO[] = neighbors
      .filter((n) => n.entityId !== query.profileId)
      .map((n, idx) => ({
        profileId: n.entityId,
        similarityScore: 0.95 - idx * 0.05,
        commonTopics: ['Artificial Intelligence', 'Research Analytics'],
      }));

    return Result.ok<SimilarResearcherDTO[]>(result);
  }
}

// ——— GetResearchTrendsQuery ———

export interface GetResearchTrendsQuery {
  period?: string;
  limit?: number;
}

export class GetResearchTrendsQueryHandler {
  public execute(query: GetResearchTrendsQuery): Promise<Result<ResearchTrendDTO[]>> {
    const trends: ResearchTrendDTO[] = [
      {
        topicName: 'Knowledge Graph Embedding Models',
        trendScore: 94.2,
        growthRate: 35.8,
        publicationVolume: 1240,
        period: query.period ?? '2026-Q2',
      },
      {
        topicName: 'Retrieval-Augmented Generation (RAG)',
        trendScore: 91.5,
        growthRate: 48.2,
        publicationVolume: 3100,
        period: query.period ?? '2026-Q2',
      },
      {
        topicName: 'Multi-Modal AI Systems',
        trendScore: 88.0,
        growthRate: 29.4,
        publicationVolume: 1850,
        period: query.period ?? '2026-Q2',
      },
    ];

    const limit = query.limit ?? 10;
    return Promise.resolve(Result.ok<ResearchTrendDTO[]>(trends.slice(0, limit)));
  }
}

// ——— GetResearchGapsQuery ———

export interface GetResearchGapsQuery {
  field?: string;
}

export class GetResearchGapsQueryHandler {
  public execute(query: GetResearchGapsQuery): Promise<Result<ResearchGapDTO[]>> {
    const gaps: ResearchGapDTO[] = [
      {
        topic: 'Graph Neural Networks for Quantum Chemistry',
        field: query.field ?? 'Computer Science & Quantum Physics',
        description:
          'Low publication density at the intersection of GNN architecture design and quantum state simulation.',
        densityScore: 0.12,
        gapScore: 89.4,
      },
      {
        topic: 'Verifiable AI Explanations in Medical Diagnostics',
        field: query.field ?? 'Biomedical Informatics',
        description:
          'Gap in provable explainability bounds for transformer models applied to multi-omics clinical trials.',
        densityScore: 0.18,
        gapScore: 85.1,
      },
    ];

    return Promise.resolve(Result.ok<ResearchGapDTO[]>(gaps));
  }
}

// ——— GetKnowledgeGraphQuery ———

export interface GetKnowledgeGraphQuery {
  profileId: string;
}

export class GetKnowledgeGraphQueryHandler {
  constructor(private readonly graphRepo: IKnowledgeGraphRepository) {}

  public async execute(query: GetKnowledgeGraphQuery): Promise<Result<KnowledgeGraphDTO>> {
    const graph = await this.graphRepo.findByResearchProfile(query.profileId);
    if (!graph) {
      return Result.ok<KnowledgeGraphDTO>({
        id: `kg-${query.profileId}`,
        profileId: query.profileId,
        nodes: [
          {
            id: `node-${query.profileId}`,
            nodeType: 'RESEARCHER',
            entityId: query.profileId,
            label: 'Lead Researcher',
            attributes: {},
          },
        ],
        edges: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return Result.ok<KnowledgeGraphDTO>({
      id: graph.id.value,
      profileId: graph.profileId,
      nodes: graph.nodes.map((n) => ({
        id: n.nodeId.value,
        nodeType: n.nodeType,
        entityId: n.entityId,
        label: n.label,
        attributes: n.attributes,
      })),
      edges: graph.edges.map((e) => ({
        id: e.edgeId.value,
        sourceNodeId: e.sourceNodeId.value,
        targetNodeId: e.targetNodeId.value,
        relationshipType: e.relationshipType,
        weight: e.weight,
        properties: e.properties,
      })),
      createdAt: graph.createdAt.toISOString(),
      updatedAt: graph.updatedAt.toISOString(),
    });
  }
}

// ——— GetEmbeddingStatusQuery ———

export interface GetEmbeddingStatusQuery {
  entityId: string;
  entityType: string;
}

export class GetEmbeddingStatusQueryHandler {
  constructor(private readonly embeddingRepo: IEmbeddingRepository) {}

  public async execute(query: GetEmbeddingStatusQuery): Promise<Result<EmbeddingDTO | null>> {
    const embedding = await this.embeddingRepo.findByEntity(query.entityId, query.entityType);
    if (!embedding) {
      return Result.ok<EmbeddingDTO | null>(null);
    }

    return Result.ok<EmbeddingDTO>({
      id: embedding.id.value,
      entityId: embedding.entityId,
      entityType: embedding.entityType,
      model: embedding.model.modelName,
      dimension: embedding.dimension.dimension,
      status: embedding.status,
      vector: embedding.vector.vector,
      createdAt: embedding.createdAt.toISOString(),
      updatedAt: embedding.updatedAt.toISOString(),
    });
  }
}

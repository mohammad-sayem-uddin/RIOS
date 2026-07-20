/**
 * @rios/domain — AI Research Intelligence Repository Contracts (Sprint 13)
 */

import { KnowledgeGraph, RecommendationEngine, ResearchEmbedding } from '../aggregates/index.js';
import { ResearchNode } from '../entities/index.js';

export interface IKnowledgeGraphRepository {
  save(graph: KnowledgeGraph): Promise<void>;
  findById(id: string): Promise<KnowledgeGraph | null>;
  findByResearchProfile(profileId: string): Promise<KnowledgeGraph | null>;
  searchNodes(query: string): Promise<ResearchNode[]>;
  delete(id: string): Promise<void>;
}

export interface IEmbeddingRepository {
  save(embedding: ResearchEmbedding): Promise<void>;
  findById(id: string): Promise<ResearchEmbedding | null>;
  findByEntity(entityId: string, entityType: string): Promise<ResearchEmbedding | null>;
  findNearestNeighbors(
    vector: number[],
    limit: number,
    entityType?: string,
  ): Promise<ResearchEmbedding[]>;
  delete(id: string): Promise<void>;
}

export interface IRecommendationRepository {
  save(engine: RecommendationEngine): Promise<void>;
  findById(id: string): Promise<RecommendationEngine | null>;
  findByResearchProfile(profileId: string): Promise<RecommendationEngine | null>;
  delete(id: string): Promise<void>;
}

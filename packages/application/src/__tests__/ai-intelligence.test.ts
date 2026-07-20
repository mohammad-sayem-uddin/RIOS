import {
  IEmbeddingRepository,
  IKnowledgeGraphRepository,
  IRecommendationRepository,
  KnowledgeGraph,
  RecommendationEngine,
  RecommendationTypeEnum,
  ResearchEmbedding,
  ResearchNode,
} from '@rios/domain';
import { describe, expect, it } from 'vitest';

import { AiIntelligenceApplicationServiceImpl } from '../ai-intelligence/index.js';

class MockEmbeddingRepository implements IEmbeddingRepository {
  private readonly store = new Map<string, ResearchEmbedding>();

  public save(embedding: ResearchEmbedding): Promise<void> {
    this.store.set(embedding.id.value, embedding);
    return Promise.resolve();
  }

  public findById(id: string): Promise<ResearchEmbedding | null> {
    return Promise.resolve(this.store.get(id) ?? null);
  }

  public findByEntity(entityId: string, _entityType: string): Promise<ResearchEmbedding | null> {
    for (const e of this.store.values()) {
      if (e.entityId === entityId) return Promise.resolve(e);
    }
    return Promise.resolve(null);
  }

  public findNearestNeighbors(_vector: number[], _limit: number): Promise<ResearchEmbedding[]> {
    return Promise.resolve(Array.from(this.store.values()));
  }

  public delete(id: string): Promise<void> {
    this.store.delete(id);
    return Promise.resolve();
  }
}

class MockKnowledgeGraphRepository implements IKnowledgeGraphRepository {
  private readonly store = new Map<string, KnowledgeGraph>();

  public save(graph: KnowledgeGraph): Promise<void> {
    this.store.set(graph.profileId, graph);
    return Promise.resolve();
  }

  public findById(id: string): Promise<KnowledgeGraph | null> {
    return Promise.resolve(this.store.get(id) ?? null);
  }

  public findByResearchProfile(profileId: string): Promise<KnowledgeGraph | null> {
    return Promise.resolve(this.store.get(profileId) ?? null);
  }

  public searchNodes(_query: string): Promise<ResearchNode[]> {
    return Promise.resolve([]);
  }

  public delete(id: string): Promise<void> {
    this.store.delete(id);
    return Promise.resolve();
  }
}

class MockRecommendationRepository implements IRecommendationRepository {
  private readonly store = new Map<string, RecommendationEngine>();

  public save(engine: RecommendationEngine): Promise<void> {
    this.store.set(engine.researcherProfileId, engine);
    return Promise.resolve();
  }

  public findById(id: string): Promise<RecommendationEngine | null> {
    return Promise.resolve(this.store.get(id) ?? null);
  }

  public findByResearchProfile(profileId: string): Promise<RecommendationEngine | null> {
    return Promise.resolve(this.store.get(profileId) ?? null);
  }

  public delete(id: string): Promise<void> {
    this.store.delete(id);
    return Promise.resolve();
  }
}

describe('AI Research Intelligence Application Layer (Sprint 13)', () => {
  const embeddingRepo = new MockEmbeddingRepository();
  const graphRepo = new MockKnowledgeGraphRepository();
  const recRepo = new MockRecommendationRepository();
  const service = new AiIntelligenceApplicationServiceImpl(embeddingRepo, graphRepo, recRepo);

  it('should generate embeddings for an entity', async () => {
    const res = await service.generateEmbedding({
      entityId: 'pub-001',
      entityType: 'PUBLICATION',
      textToEmbed: 'Deep Learning and Knowledge Graph Fusion for Research Discovery',
    });

    expect(res.isSuccess).toBe(true);
    expect(res.value.entityId).toBe('pub-001');
    expect(res.value.vector.length).toBe(1536);
  });

  it('should rebuild knowledge graph', async () => {
    const res = await service.rebuildKnowledgeGraph({
      profileId: 'prof-789',
      nodes: [
        { entityId: 'prof-789', nodeType: 'RESEARCHER', label: 'Dr. Alice' },
        { entityId: 'pub-101', nodeType: 'PUBLICATION', label: 'Paper X' },
      ],
      edges: [
        { sourceEntityId: 'prof-789', targetEntityId: 'pub-101', relationshipType: 'AUTHORED' },
      ],
    });

    expect(res.isSuccess).toBe(true);
    expect(res.value.nodes.length).toBe(2);
    expect(res.value.edges.length).toBe(1);
  });

  it('should generate recommendations', async () => {
    const res = await service.generateRecommendations({
      profileId: 'prof-789',
      recommendationTypes: [
        RecommendationTypeEnum.PUBLICATION,
        RecommendationTypeEnum.COLLABORATOR,
      ],
    });

    expect(res.isSuccess).toBe(true);
    expect(res.value.length).toBe(2);
  });

  it('should query research trends and gaps', async () => {
    const trendsRes = await service.getResearchTrends('2026-Q2', 5);
    expect(trendsRes.isSuccess).toBe(true);
    expect(trendsRes.value.length).toBeGreaterThan(0);

    const gapsRes = await service.getResearchGaps('Computer Science');
    expect(gapsRes.isSuccess).toBe(true);
    expect(gapsRes.value.length).toBeGreaterThan(0);
  });
});

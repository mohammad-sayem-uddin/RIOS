import { describe, expect, it } from 'vitest';

import {
  CitationSuggestion,
  ConfidenceScore,
  EdgeId,
  EmbeddingId,
  EmbeddingModel,
  EmbeddingVector,
  ExpertiseLevel,
  ExpertiseLevelEnum,
  KnowledgeGraph,
  NodeId,
  PotentialCollaborator,
  Recommendation,
  RecommendationEngine,
  RecommendationType,
  RecommendationTypeEnum,
  ResearchEdge,
  ResearchEmbedding,
  ResearchNode,
  ResearchScore,
  SimilarityValue,
  VectorDimension,
} from '../ai-intelligence/index.js';

describe('AI Research Intelligence Domain Layer (Sprint 13)', () => {
  describe('Value Objects', () => {
    it('should create and validate SimilarityValue between 0 and 1', () => {
      const valid = SimilarityValue.create(0.85);
      expect(valid.isSuccess).toBe(true);
      expect(valid.value.value).toBe(0.85);

      const invalidHigh = SimilarityValue.create(1.5);
      expect(invalidHigh.isFailure).toBe(true);

      const invalidLow = SimilarityValue.create(-0.1);
      expect(invalidLow.isFailure).toBe(true);
    });

    it('should create and validate ConfidenceScore between 0 and 100', () => {
      const valid = ConfidenceScore.create(92.4);
      expect(valid.isSuccess).toBe(true);
      expect(valid.value.value).toBe(92.4);

      const invalid = ConfidenceScore.create(150);
      expect(invalid.isFailure).toBe(true);
    });

    it('should enforce positive VectorDimension', () => {
      const dim = VectorDimension.create(768);
      expect(dim.isSuccess).toBe(true);
      expect(dim.value.dimension).toBe(768);

      const invalidDim = VectorDimension.create(-10);
      expect(invalidDim.isFailure).toBe(true);
    });

    it('should handle ExpertiseLevel enums', () => {
      const exp = ExpertiseLevel.create(ExpertiseLevelEnum.EXPERT);
      expect(exp.level).toBe(ExpertiseLevelEnum.EXPERT);

      const parsed = ExpertiseLevel.fromString('AUTHORITY');
      expect(parsed.isSuccess).toBe(true);
      expect(parsed.value.level).toBe(ExpertiseLevelEnum.AUTHORITY);
    });
  });

  describe('Entities & Business Rules', () => {
    it('should forbid self-referencing graph edges', () => {
      const nodeId = NodeId.create();
      const edgeRes = ResearchEdge.create({
        edgeId: EdgeId.create(),
        sourceNodeId: nodeId,
        targetNodeId: nodeId,
        relationshipType: 'CITES',
        weight: 1.0,
        properties: {},
      });

      expect(edgeRes.isFailure).toBe(true);
      expect(edgeRes.error).toContain('Self-referencing graph edges are forbidden');
    });

    it('should forbid self-citations in citation suggestions by default', () => {
      const citationRes = CitationSuggestion.create({
        publicationId: 'pub-1',
        suggestedCitationPublicationId: 'pub-2',
        relevanceScore: SimilarityValue.from(0.9),
        reason: 'Related methodology',
        isSelfCitation: true,
      });

      expect(citationRes.isFailure).toBe(true);
      expect(citationRes.error).toContain('Self-citations are forbidden');
    });

    it('should forbid suggesting collaborator as self', () => {
      const colRes = PotentialCollaborator.create({
        profileId: 'prof-1',
        candidateProfileId: 'prof-1',
        commonTopics: ['AI'],
        similarity: SimilarityValue.from(0.95),
        collaborationDistance: 0,
      });

      expect(colRes.isFailure).toBe(true);
    });
  });

  describe('KnowledgeGraph Aggregate Root', () => {
    it('should build graph and prevent duplicate edges', () => {
      const graph = KnowledgeGraph.create({ profileId: 'prof-123' }).value;

      const node1Id = NodeId.create();
      const node2Id = NodeId.create();

      const n1 = ResearchNode.create({
        nodeId: node1Id,
        nodeType: 'RESEARCHER',
        entityId: 'prof-123',
        label: 'Researcher Profile',
        attributes: {},
      }).value;

      const n2 = ResearchNode.create({
        nodeId: node2Id,
        nodeType: 'PUBLICATION',
        entityId: 'pub-999',
        label: 'Paper on AI',
        attributes: {},
      }).value;

      graph.addNode(n1);
      graph.addNode(n2);

      expect(graph.nodes.length).toBe(2);

      const edge1 = ResearchEdge.create({
        edgeId: EdgeId.create(),
        sourceNodeId: node1Id,
        targetNodeId: node2Id,
        relationshipType: 'AUTHORED',
        weight: 1.0,
        properties: {},
      }).value;

      const addEdge1Res = graph.addEdge(edge1);
      expect(addEdge1Res.isSuccess).toBe(true);

      const duplicateEdge = ResearchEdge.create({
        edgeId: EdgeId.create(),
        sourceNodeId: node1Id,
        targetNodeId: node2Id,
        relationshipType: 'AUTHORED',
        weight: 1.0,
        properties: {},
      }).value;

      const addDuplicateRes = graph.addEdge(duplicateEdge);
      expect(addDuplicateRes.isFailure).toBe(true);
      expect(addDuplicateRes.error).toContain('Duplicate graph edge is forbidden');
    });
  });

  describe('ResearchEmbedding Aggregate Root', () => {
    it('should create embedding aggregate and emit domain event', () => {
      const model = EmbeddingModel.defaultModel();
      const dimension = VectorDimension.defaultDimension();
      const vectorValues: number[] = new Array<number>(1536).fill(0.1);

      const vectorObj = EmbeddingVector.create({
        embeddingId: EmbeddingId.create(),
        vector: vectorValues,
        dimension,
        model,
      }).value;

      const embeddingRes = ResearchEmbedding.create({
        entityId: 'pub-100',
        entityType: 'PUBLICATION',
        model,
        dimension,
        vector: vectorObj,
      });

      expect(embeddingRes.isSuccess).toBe(true);
      const embedding = embeddingRes.value;
      expect(embedding.status).toBe('ACTIVE');
      expect(embedding.domainEvents.length).toBe(1);
    });
  });

  describe('RecommendationEngine Aggregate Root', () => {
    it('should collect recommendations and emit domain event', () => {
      const engine = RecommendationEngine.create({ researcherProfileId: 'prof-456' }).value;

      const scoreRes = ResearchScore.create(0.91);
      const scoreObj = scoreRes.value;

      const rec = Recommendation.create({
        recommendationType: RecommendationType.create(RecommendationTypeEnum.PUBLICATION),
        targetEntityId: 'prof-456',
        recommendedEntityId: 'pub-777',
        confidence: ConfidenceScore.from(95),
        score: scoreObj,
        explanation: 'Highly relevant paper',
      }).value;

      engine.addRecommendation(rec);
      expect(engine.recommendations.length).toBe(1);
      expect(engine.domainEvents.length).toBe(1);
    });
  });
});

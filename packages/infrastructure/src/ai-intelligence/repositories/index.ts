/**
 * @rios/infrastructure — AI Research Intelligence Prisma Repositories (Sprint 13)
 */

import { PrismaClient } from '@prisma/client';
import {
  IEmbeddingRepository,
  IKnowledgeGraphRepository,
  IRecommendationRepository,
  KnowledgeGraph,
  RecommendationEngine,
  ResearchEmbedding,
  ResearchNode,
} from '@rios/domain';

import {
  EmbeddingPersistenceMapper,
  KnowledgeGraphPersistenceMapper,
  RecommendationPersistenceMapper,
} from '../mappers/index.js';

export class PrismaKnowledgeGraphRepository implements IKnowledgeGraphRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async save(graph: KnowledgeGraph): Promise<void> {
    await this.prisma.knowledgeGraphModel.upsert({
      where: { id: graph.id.value },
      create: {
        id: graph.id.value,
        profileId: graph.profileId,
        createdAt: graph.createdAt,
        updatedAt: graph.updatedAt,
      },
      update: {
        profileId: graph.profileId,
        updatedAt: graph.updatedAt,
      },
    });

    for (const node of graph.nodes) {
      await this.prisma.researchNodeModel.upsert({
        where: { id: node.nodeId.value },
        create: {
          id: node.nodeId.value,
          graphId: graph.id.value,
          nodeType: node.nodeType,
          entityId: node.entityId,
          label: node.label,
          attributesJson: JSON.stringify(node.attributes),
          createdAt: node.createdAt,
          updatedAt: node.updatedAt,
        },
        update: {
          label: node.label,
          attributesJson: JSON.stringify(node.attributes),
          updatedAt: node.updatedAt,
        },
      });
    }

    for (const edge of graph.edges) {
      await this.prisma.researchEdgeModel.upsert({
        where: { id: edge.edgeId.value },
        create: {
          id: edge.edgeId.value,
          graphId: graph.id.value,
          sourceNodeId: edge.sourceNodeId.value,
          targetNodeId: edge.targetNodeId.value,
          relationshipType: edge.relationshipType,
          weight: edge.weight,
          propertiesJson: JSON.stringify(edge.properties),
          createdAt: edge.createdAt,
        },
        update: {
          weight: edge.weight,
          propertiesJson: JSON.stringify(edge.properties),
        },
      });
    }
  }

  public async findById(id: string): Promise<KnowledgeGraph | null> {
    const raw = await this.prisma.knowledgeGraphModel.findUnique({
      where: { id },
      include: { nodes: true, edges: true },
    });
    if (!raw) return null;
    return KnowledgeGraphPersistenceMapper.toDomain(raw);
  }

  public async findByResearchProfile(profileId: string): Promise<KnowledgeGraph | null> {
    const raw = await this.prisma.knowledgeGraphModel.findFirst({
      where: { profileId },
      include: { nodes: true, edges: true },
    });
    if (!raw) return null;
    return KnowledgeGraphPersistenceMapper.toDomain(raw);
  }

  public async searchNodes(query: string): Promise<ResearchNode[]> {
    const rawNodes = await this.prisma.researchNodeModel.findMany({
      where: {
        OR: [
          { label: { contains: query, mode: 'insensitive' } },
          { entityId: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    return rawNodes.map((n) => {
      const res = KnowledgeGraphPersistenceMapper.toDomain({
        id: 'temp-graph',
        profileId: 'temp',
        createdAt: new Date(),
        updatedAt: new Date(),
        nodes: [n],
      });
      const mappedNode = res.nodes[0];
      if (!mappedNode) throw new Error('Failed to map node');
      return mappedNode;
    });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.knowledgeGraphModel.delete({ where: { id } });
  }
}

export class PrismaEmbeddingRepository implements IEmbeddingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async save(embedding: ResearchEmbedding): Promise<void> {
    await this.prisma.researchEmbeddingModel.upsert({
      where: { id: embedding.id.value },
      create: {
        id: embedding.id.value,
        entityId: embedding.entityId,
        entityType: embedding.entityType,
        model: embedding.model.modelName,
        dimension: embedding.dimension.dimension,
        status: embedding.status,
        sourceHash: embedding.sourceHash,
        createdAt: embedding.createdAt,
        updatedAt: embedding.updatedAt,
      },
      update: {
        model: embedding.model.modelName,
        dimension: embedding.dimension.dimension,
        status: embedding.status,
        sourceHash: embedding.sourceHash,
        updatedAt: embedding.updatedAt,
      },
    });

    await this.prisma.embeddingVectorModel.deleteMany({
      where: { embeddingId: embedding.id.value },
    });

    await this.prisma.embeddingVectorModel.create({
      data: {
        embeddingId: embedding.id.value,
        vectorJson: JSON.stringify(embedding.vector.vector),
        dimension: embedding.dimension.dimension,
        model: embedding.model.modelName,
        norm: embedding.vector.norm,
        createdAt: embedding.createdAt,
      },
    });
  }

  public async findById(id: string): Promise<ResearchEmbedding | null> {
    const raw = await this.prisma.researchEmbeddingModel.findUnique({
      where: { id },
      include: { vectors: true },
    });
    if (!raw) return null;
    return EmbeddingPersistenceMapper.toDomain(raw);
  }

  public async findByEntity(
    entityId: string,
    entityType: string,
  ): Promise<ResearchEmbedding | null> {
    const raw = await this.prisma.researchEmbeddingModel.findFirst({
      where: { entityId, entityType },
      include: { vectors: true },
    });
    if (!raw) return null;
    return EmbeddingPersistenceMapper.toDomain(raw);
  }

  public async findNearestNeighbors(
    vector: number[],
    limit: number,
    entityType?: string,
  ): Promise<ResearchEmbedding[]> {
    const whereClause = entityType !== undefined && entityType.length > 0 ? { entityType } : {};
    const rawList = await this.prisma.researchEmbeddingModel.findMany({
      where: whereClause,
      include: { vectors: true },
      take: limit * 2,
    });

    const mapped = rawList.map((r) => EmbeddingPersistenceMapper.toDomain(r));
    // Simple cosine similarity sorting
    mapped.sort((a, b) => {
      const simA = this.cosineSimilarity(vector, a.vector.vector);
      const simB = this.cosineSimilarity(vector, b.vector.vector);
      return simB - simA;
    });

    return mapped.slice(0, limit);
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.researchEmbeddingModel.delete({ where: { id } });
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length || a.length === 0) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      const va = a[i] ?? 0;
      const vb = b[i] ?? 0;
      dot += va * vb;
      normA += va * va;
      normB += vb * vb;
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }
}

export class PrismaRecommendationRepository implements IRecommendationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async save(engine: RecommendationEngine): Promise<void> {
    await this.prisma.recommendationEngineModel.upsert({
      where: { id: engine.id.value },
      create: {
        id: engine.id.value,
        researcherProfileId: engine.researcherProfileId,
        createdAt: engine.createdAt,
        updatedAt: engine.updatedAt,
      },
      update: {
        researcherProfileId: engine.researcherProfileId,
        updatedAt: engine.updatedAt,
      },
    });

    for (const rec of engine.recommendations) {
      await this.prisma.recommendationModel.upsert({
        where: { id: rec.id.value },
        create: {
          id: rec.id.value,
          engineId: engine.id.value,
          recommendationType: rec.recommendationType.type,
          targetEntityId: rec.targetEntityId,
          recommendedEntityId: rec.recommendedEntityId,
          confidence: rec.confidence.value,
          score: rec.score.score,
          explanation: rec.explanation,
          metadataJson: JSON.stringify(rec.metadata),
          createdAt: rec.createdAt,
        },
        update: {
          confidence: rec.confidence.value,
          score: rec.score.score,
          explanation: rec.explanation,
          metadataJson: JSON.stringify(rec.metadata),
        },
      });
    }
  }

  public async findById(id: string): Promise<RecommendationEngine | null> {
    const raw = await this.prisma.recommendationEngineModel.findUnique({
      where: { id },
      include: { recommendations: true },
    });
    if (!raw) return null;
    return RecommendationPersistenceMapper.toDomain(raw);
  }

  public async findByResearchProfile(profileId: string): Promise<RecommendationEngine | null> {
    const raw = await this.prisma.recommendationEngineModel.findFirst({
      where: { researcherProfileId: profileId },
      include: { recommendations: true },
    });
    if (!raw) return null;
    return RecommendationPersistenceMapper.toDomain(raw);
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.recommendationEngineModel.delete({ where: { id } });
  }
}

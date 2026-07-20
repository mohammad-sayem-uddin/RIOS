/**
 * @rios/infrastructure — AI Research Intelligence Persistence Mappers (Sprint 13)
 */

import {
  ConfidenceScore,
  EdgeId,
  EmbeddingId,
  EmbeddingModel,
  EmbeddingVector,
  KnowledgeGraph,
  NodeId,
  Recommendation,
  RecommendationEngine,
  RecommendationType,
  RecommendationTypeEnum,
  ResearchEdge,
  ResearchEmbedding,
  ResearchNode,
  ResearchScore,
  VectorDimension,
} from '@rios/domain';
import { UniqueId } from '@rios/shared';

export class KnowledgeGraphPersistenceMapper {
  public static toDomain(raw: {
    id: string;
    profileId: string;
    createdAt: Date;
    updatedAt: Date;
    nodes?: Array<{
      id: string;
      nodeType: string;
      entityId: string;
      label: string;
      attributesJson: string | null;
      createdAt: Date;
      updatedAt: Date;
    }>;
    edges?: Array<{
      id: string;
      sourceNodeId: string;
      targetNodeId: string;
      relationshipType: string;
      weight: number;
      propertiesJson: string | null;
      createdAt: Date;
    }>;
  }): KnowledgeGraph {
    const nodes: ResearchNode[] = (raw.nodes ?? []).map((n) => {
      const attributes =
        typeof n.attributesJson === 'string' && n.attributesJson.length > 0
          ? (JSON.parse(n.attributesJson) as Record<string, unknown>)
          : {};
      const nodeRes = ResearchNode.create({
        nodeId: NodeId.from(n.id),
        nodeType: n.nodeType as
          'RESEARCHER' | 'PUBLICATION' | 'PROJECT' | 'TOPIC' | 'ASSET' | 'INSTITUTION',
        entityId: n.entityId,
        label: n.label,
        attributes,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
      });
      return nodeRes.value;
    });

    const edges: ResearchEdge[] = (raw.edges ?? []).map((e) => {
      const properties =
        typeof e.propertiesJson === 'string' && e.propertiesJson.length > 0
          ? (JSON.parse(e.propertiesJson) as Record<string, unknown>)
          : {};
      const edgeRes = ResearchEdge.create({
        edgeId: EdgeId.from(e.id),
        sourceNodeId: NodeId.from(e.sourceNodeId),
        targetNodeId: NodeId.from(e.targetNodeId),
        relationshipType: e.relationshipType,
        weight: e.weight,
        properties,
        createdAt: e.createdAt,
      });
      return edgeRes.value;
    });

    const graphRes = KnowledgeGraph.reconstitute(
      {
        profileId: raw.profileId,
        nodes,
        edges,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      UniqueId.create(raw.id),
    );

    return graphRes.value;
  }
}

export class EmbeddingPersistenceMapper {
  public static toDomain(raw: {
    id: string;
    entityId: string;
    entityType: string;
    model: string;
    dimension: number;
    status: string;
    sourceHash: string | null;
    createdAt: Date;
    updatedAt: Date;
    vectors?: Array<{
      vectorJson: string;
      dimension: number;
      model: string;
      norm: number | null;
    }>;
  }): ResearchEmbedding {
    const modelRes = EmbeddingModel.create(raw.model);
    const dimRes = VectorDimension.create(raw.dimension);

    const firstVec = raw.vectors && raw.vectors.length > 0 ? raw.vectors[0] : undefined;
    const vectorData: number[] =
      firstVec !== undefined && typeof firstVec.vectorJson === 'string'
        ? (JSON.parse(firstVec.vectorJson) as number[])
        : [];

    const vecObjRes = EmbeddingVector.create({
      embeddingId: EmbeddingId.create(),
      vector: vectorData,
      dimension: dimRes.value,
      model: modelRes.value,
      norm: firstVec !== undefined && firstVec.norm !== null ? firstVec.norm : undefined,
    });

    const embeddingRes = ResearchEmbedding.reconstitute(
      {
        entityId: raw.entityId,
        entityType: raw.entityType as
          'RESEARCH_PROFILE' | 'PUBLICATION' | 'RESEARCH_PROJECT' | 'RESEARCH_ASSET' | 'CONCEPT',
        model: modelRes.value,
        dimension: dimRes.value,
        vector: vecObjRes.value,
        status: raw.status as 'PENDING' | 'ACTIVE' | 'OUTDATED' | 'FAILED',
        sourceHash: raw.sourceHash !== null ? raw.sourceHash : undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      UniqueId.create(raw.id),
    );

    return embeddingRes.value;
  }
}

export class RecommendationPersistenceMapper {
  public static toDomain(raw: {
    id: string;
    researcherProfileId: string;
    createdAt: Date;
    updatedAt: Date;
    recommendations?: Array<{
      id: string;
      recommendationType: string;
      targetEntityId: string;
      recommendedEntityId: string;
      confidence: number;
      score: number;
      explanation: string;
      metadataJson: string | null;
      createdAt: Date;
    }>;
  }): RecommendationEngine {
    const recs: Recommendation[] = (raw.recommendations ?? []).map((r) => {
      const typeRes = RecommendationType.fromString(r.recommendationType);
      const confRes = ConfidenceScore.create(r.confidence);
      const scoreRes = ResearchScore.create(r.score);

      const metadata =
        typeof r.metadataJson === 'string' && r.metadataJson.length > 0
          ? (JSON.parse(r.metadataJson) as Record<string, unknown>)
          : {};

      const recRes = Recommendation.create(
        {
          recommendationType: typeRes.isSuccess
            ? typeRes.value
            : RecommendationType.create(RecommendationTypeEnum.PUBLICATION),
          targetEntityId: r.targetEntityId,
          recommendedEntityId: r.recommendedEntityId,
          confidence: confRes.isSuccess ? confRes.value : ConfidenceScore.from(80),
          score: scoreRes.isSuccess ? scoreRes.value : ResearchScore.create(0.8).value,
          explanation: r.explanation,
          metadata,
          createdAt: r.createdAt,
        },
        UniqueId.create(r.id),
      );

      return recRes.value;
    });

    const engineRes = RecommendationEngine.reconstitute(
      {
        researcherProfileId: raw.researcherProfileId,
        recommendations: recs,
        citationSuggestions: [],
        collaboratorProposals: [],
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      UniqueId.create(raw.id),
    );

    return engineRes.value;
  }
}

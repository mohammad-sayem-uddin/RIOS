/**
 * @rios/presentation — AI Research Intelligence Presentation DTOs (Sprint 13)
 */

export interface GenerateEmbeddingRequestDto {
  entityId: string;
  entityType:
    'RESEARCH_PROFILE' | 'PUBLICATION' | 'RESEARCH_PROJECT' | 'RESEARCH_ASSET' | 'CONCEPT';
  textToEmbed: string;
  modelName?: string;
  dimension?: number;
}

export interface GenerateRecommendationsRequestDto {
  profileId: string;
  recommendationTypes?: Array<'PUBLICATION' | 'COLLABORATOR' | 'CITATION' | 'TOPIC' | 'GAP'>;
}

export interface RebuildKnowledgeGraphRequestDto {
  profileId: string;
  nodes: Array<{
    entityId: string;
    nodeType: 'RESEARCHER' | 'PUBLICATION' | 'PROJECT' | 'TOPIC' | 'ASSET' | 'INSTITUTION';
    label: string;
    attributes?: Record<string, unknown>;
  }>;
  edges: Array<{
    sourceEntityId: string;
    targetEntityId: string;
    relationshipType: string;
    weight?: number;
    properties?: Record<string, unknown>;
  }>;
}

/**
 * @rios/application — AI Research Intelligence Application DTOs (Sprint 13)
 */

export interface EmbeddingDTO {
  id: string;
  entityId: string;
  entityType: string;
  model: string;
  dimension: number;
  status: string;
  vector: number[];
  createdAt: string;
  updatedAt: string;
}

export interface ResearchNodeDTO {
  id: string;
  nodeType: string;
  entityId: string;
  label: string;
  attributes: Record<string, unknown>;
}

export interface ResearchEdgeDTO {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: string;
  weight: number;
  properties: Record<string, unknown>;
}

export interface KnowledgeGraphDTO {
  id: string;
  profileId: string;
  nodes: ResearchNodeDTO[];
  edges: ResearchEdgeDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface RecommendationDTO {
  id: string;
  recommendationType: string;
  targetEntityId: string;
  recommendedEntityId: string;
  confidence: number;
  score: number;
  explanation: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface CitationSuggestionDTO {
  publicationId: string;
  suggestedPublicationId: string;
  relevanceScore: number;
  reason: string;
  isSelfCitation: boolean;
}

export interface CollaboratorProposalDTO {
  profileId: string;
  candidateProfileId: string;
  commonTopics: string[];
  similarityScore: number;
  collaborationDistance: number;
}

export interface SimilarResearcherDTO {
  profileId: string;
  similarityScore: number;
  commonTopics: string[];
}

export interface ResearchTrendDTO {
  topicName: string;
  trendScore: number;
  growthRate: number;
  publicationVolume: number;
  period: string;
}

export interface ResearchGapDTO {
  topic: string;
  field: string;
  description: string;
  densityScore: number;
  gapScore: number;
}

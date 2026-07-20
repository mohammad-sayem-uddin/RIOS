/**
 * @rios/domain
 *
 * Domain Layer — aggregates, entities, value objects, domain events, domain services.
 */

export * from './identity/index.js';
export * from './research-identity/index.js';
export * from './publications/index.js';
export * from './research-assets/index.js';
export * from './academic-recognition/index.js';
export * from './research-intelligence/index.js';
export * from './research-discovery/index.js';
export {
  NodeId,
  EdgeId,
  EmbeddingId,
  SimilarityValue,
  ConfidenceScore,
  RecommendationTypeEnum,
  RecommendationType,
  EmbeddingModel,
  VectorDimension,
  ResearchConcept,
  TopicCluster,
  ExpertiseLevelEnum,
  ExpertiseLevel,
  ResearchScore,
  TrendScore,
  ResearchNode,
  type ResearchNodeProps,
  ResearchEdge,
  type ResearchEdgeProps,
  EmbeddingVector,
  type EmbeddingVectorProps,
  SimilarityScore,
  type SimilarityScoreProps,
  Recommendation,
  type RecommendationProps,
  ExpertiseProfile,
  type ExpertiseProfileProps,
  ResearchTopic,
  type ResearchTopicProps,
  AiResearchTrend,
  type AiResearchTrendProps,
  AiResearchGap,
  type AiResearchGapProps,
  CitationSuggestion,
  type CitationSuggestionProps,
  PotentialCollaborator,
  type PotentialCollaboratorProps,
  EmbeddingGeneratedEvent,
  KnowledgeGraphUpdatedEvent,
  RecommendationGeneratedEvent,
  ResearchGapDetectedEvent,
  TrendUpdatedEvent,
  ExpertiseCalculatedEvent,
  KnowledgeGraph,
  type KnowledgeGraphProps,
  RecommendationEngine,
  type RecommendationEngineProps,
  ResearchEmbedding,
  type ResearchEmbeddingProps,
  type IKnowledgeGraphRepository,
  type IEmbeddingRepository,
  type IRecommendationRepository,
} from './ai-intelligence/index.js';

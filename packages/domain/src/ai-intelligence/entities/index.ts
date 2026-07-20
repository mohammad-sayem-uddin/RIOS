/**
 * @rios/domain — AI Research Intelligence Bounded Context Entities (Sprint 13)
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import {
  ConfidenceScore,
  EdgeId,
  EmbeddingId,
  EmbeddingModel,
  ExpertiseLevel,
  NodeId,
  RecommendationType,
  ResearchConcept,
  ResearchScore,
  SimilarityValue,
  TopicCluster,
  TrendScore,
  VectorDimension,
} from '../value-objects/index.js';

// ─── ResearchNode Entity ──────────────────────────────────────────────────
export interface ResearchNodeProps {
  nodeId: NodeId;
  nodeType: 'RESEARCHER' | 'PUBLICATION' | 'PROJECT' | 'TOPIC' | 'ASSET' | 'INSTITUTION';
  entityId: string;
  label: string;
  attributes: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ResearchNode extends Entity<ResearchNodeProps> {
  private constructor(props: ResearchNodeProps, id?: UniqueId) {
    super(props, id);
  }

  public get nodeId(): NodeId {
    return this.props.nodeId;
  }

  public get nodeType(): string {
    return this.props.nodeType;
  }

  public get entityId(): string {
    return this.props.entityId;
  }

  public get label(): string {
    return this.props.label;
  }

  public get attributes(): Record<string, unknown> {
    return { ...this.props.attributes };
  }

  public get createdAt(): Date {
    return this.props.createdAt ?? new Date();
  }

  public get updatedAt(): Date {
    return this.props.updatedAt ?? new Date();
  }

  public static create(props: ResearchNodeProps, id?: UniqueId): Result<ResearchNode> {
    if (!props.entityId || !props.entityId.trim()) {
      return Result.fail<ResearchNode>('Entity ID is required for a ResearchNode.');
    }
    if (!props.label || !props.label.trim()) {
      return Result.fail<ResearchNode>('Label is required for a ResearchNode.');
    }
    return Result.ok<ResearchNode>(new ResearchNode(props, id));
  }
}

// ─── ResearchEdge Entity ──────────────────────────────────────────────────
export interface ResearchEdgeProps {
  edgeId: EdgeId;
  sourceNodeId: NodeId;
  targetNodeId: NodeId;
  relationshipType: string;
  weight: number;
  properties: Record<string, unknown>;
  createdAt?: Date;
}

export class ResearchEdge extends Entity<ResearchEdgeProps> {
  private constructor(props: ResearchEdgeProps, id?: UniqueId) {
    super(props, id);
  }

  public get edgeId(): EdgeId {
    return this.props.edgeId;
  }

  public get sourceNodeId(): NodeId {
    return this.props.sourceNodeId;
  }

  public get targetNodeId(): NodeId {
    return this.props.targetNodeId;
  }

  public get relationshipType(): string {
    return this.props.relationshipType;
  }

  public get weight(): number {
    return this.props.weight;
  }

  public get properties(): Record<string, unknown> {
    return { ...this.props.properties };
  }

  public get createdAt(): Date {
    return this.props.createdAt ?? new Date();
  }

  public static create(props: ResearchEdgeProps, id?: UniqueId): Result<ResearchEdge> {
    if (props.sourceNodeId.value === props.targetNodeId.value) {
      return Result.fail<ResearchEdge>('Self-referencing graph edges are forbidden.');
    }
    if (isNaN(props.weight) || props.weight < 0) {
      return Result.fail<ResearchEdge>('Edge weight must be non-negative.');
    }
    return Result.ok<ResearchEdge>(new ResearchEdge(props, id));
  }
}

// ─── EmbeddingVector Entity ──────────────────────────────────────────────
export interface EmbeddingVectorProps {
  embeddingId: EmbeddingId;
  vector: number[];
  dimension: VectorDimension;
  model: EmbeddingModel;
  norm?: number;
  createdAt?: Date;
}

export class EmbeddingVector extends Entity<EmbeddingVectorProps> {
  private constructor(props: EmbeddingVectorProps, id?: UniqueId) {
    super(props, id);
  }

  public get embeddingId(): EmbeddingId {
    return this.props.embeddingId;
  }

  public get vector(): number[] {
    return [...this.props.vector];
  }

  public get dimension(): VectorDimension {
    return this.props.dimension;
  }

  public get model(): EmbeddingModel {
    return this.props.model;
  }

  public get norm(): number {
    if (this.props.norm !== undefined) return this.props.norm;
    return Math.sqrt(this.props.vector.reduce((sum, val) => sum + val * val, 0));
  }

  public static create(props: EmbeddingVectorProps, id?: UniqueId): Result<EmbeddingVector> {
    if (!props.vector || props.vector.length === 0) {
      return Result.fail<EmbeddingVector>('Vector cannot be empty.');
    }
    if (props.vector.length !== props.dimension.dimension) {
      return Result.fail<EmbeddingVector>(
        `Vector length (${props.vector.length}) does not match dimension (${props.dimension.dimension}).`,
      );
    }
    return Result.ok<EmbeddingVector>(new EmbeddingVector(props, id));
  }
}

// ─── SimilarityScore Entity ──────────────────────────────────────────────
export interface SimilarityScoreProps {
  entityIdA: string;
  entityIdB: string;
  similarity: SimilarityValue;
  metric: 'COSINE' | 'EUCLIDEAN' | 'DOT_PRODUCT';
  evaluatedAt?: Date;
}

export class SimilarityScore extends Entity<SimilarityScoreProps> {
  private constructor(props: SimilarityScoreProps, id?: UniqueId) {
    super(props, id);
  }

  public get entityIdA(): string {
    return this.props.entityIdA;
  }

  public get entityIdB(): string {
    return this.props.entityIdB;
  }

  public get similarity(): SimilarityValue {
    return this.props.similarity;
  }

  public get metric(): string {
    return this.props.metric;
  }

  public static create(props: SimilarityScoreProps, id?: UniqueId): Result<SimilarityScore> {
    return Result.ok<SimilarityScore>(new SimilarityScore(props, id));
  }
}

// ─── Recommendation Entity ───────────────────────────────────────────────
export interface RecommendationProps {
  recommendationType: RecommendationType;
  targetEntityId: string;
  recommendedEntityId: string;
  confidence: ConfidenceScore;
  score: ResearchScore;
  explanation: string;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
}

export class Recommendation extends Entity<RecommendationProps> {
  private constructor(props: RecommendationProps, id?: UniqueId) {
    super(props, id);
  }

  public get recommendationType(): RecommendationType {
    return this.props.recommendationType;
  }

  public get targetEntityId(): string {
    return this.props.targetEntityId;
  }

  public get recommendedEntityId(): string {
    return this.props.recommendedEntityId;
  }

  public get confidence(): ConfidenceScore {
    return this.props.confidence;
  }

  public get score(): ResearchScore {
    return this.props.score;
  }

  public get explanation(): string {
    return this.props.explanation;
  }

  public get metadata(): Record<string, unknown> {
    return { ...(this.props.metadata ?? {}) };
  }

  public get createdAt(): Date {
    return this.props.createdAt ?? new Date();
  }

  public static create(props: RecommendationProps, id?: UniqueId): Result<Recommendation> {
    if (props.targetEntityId.trim() === '' || props.recommendedEntityId.trim() === '') {
      return Result.fail<Recommendation>('Target and recommended entity IDs are required.');
    }
    return Result.ok<Recommendation>(new Recommendation(props, id));
  }
}

// ─── ExpertiseProfile Entity ─────────────────────────────────────────────
export interface ExpertiseProfileProps {
  researcherProfileId: string;
  concepts: ResearchConcept[];
  levels: Map<string, ExpertiseLevel>;
  overallScore: ResearchScore;
  lastUpdated?: Date;
}

export class ExpertiseProfile extends Entity<ExpertiseProfileProps> {
  private constructor(props: ExpertiseProfileProps, id?: UniqueId) {
    super(props, id);
  }

  public get researcherProfileId(): string {
    return this.props.researcherProfileId;
  }

  public get concepts(): ResearchConcept[] {
    return [...this.props.concepts];
  }

  public get levels(): Map<string, ExpertiseLevel> {
    return new Map(this.props.levels);
  }

  public get overallScore(): ResearchScore {
    return this.props.overallScore;
  }

  public static create(props: ExpertiseProfileProps, id?: UniqueId): Result<ExpertiseProfile> {
    if (!props.researcherProfileId) {
      return Result.fail<ExpertiseProfile>('Researcher profile ID is required.');
    }
    return Result.ok<ExpertiseProfile>(new ExpertiseProfile(props, id));
  }
}

// ─── ResearchTopic Entity ────────────────────────────────────────────────
export interface ResearchTopicProps {
  name: string;
  cluster: TopicCluster;
  keywords: string[];
  relevanceWeight: number;
}

export class ResearchTopic extends Entity<ResearchTopicProps> {
  private constructor(props: ResearchTopicProps, id?: UniqueId) {
    super(props, id);
  }

  public get name(): string {
    return this.props.name;
  }

  public get cluster(): TopicCluster {
    return this.props.cluster;
  }

  public get keywords(): string[] {
    return [...this.props.keywords];
  }

  public get relevanceWeight(): number {
    return this.props.relevanceWeight;
  }

  public static create(props: ResearchTopicProps, id?: UniqueId): Result<ResearchTopic> {
    if (!props.name || !props.name.trim()) {
      return Result.fail<ResearchTopic>('Topic name cannot be empty.');
    }
    return Result.ok<ResearchTopic>(new ResearchTopic(props, id));
  }
}

// ─── AiResearchTrend Entity ────────────────────────────────────────────────
export interface AiResearchTrendProps {
  topicName: string;
  trendScore: TrendScore;
  growthRate: number;
  publicationVolume: number;
  period: string;
  updatedAt?: Date;
}

export class AiResearchTrend extends Entity<AiResearchTrendProps> {
  private constructor(props: AiResearchTrendProps, id?: UniqueId) {
    super(props, id);
  }

  public get topicName(): string {
    return this.props.topicName;
  }

  public get trendScore(): TrendScore {
    return this.props.trendScore;
  }

  public get growthRate(): number {
    return this.props.growthRate;
  }

  public get publicationVolume(): number {
    return this.props.publicationVolume;
  }

  public get period(): string {
    return this.props.period;
  }

  public static create(props: AiResearchTrendProps, id?: UniqueId): Result<AiResearchTrend> {
    return Result.ok<AiResearchTrend>(new AiResearchTrend(props, id));
  }
}

// ─── AiResearchGap Entity ──────────────────────────────────────────────────
export interface AiResearchGapProps {
  topic: string;
  field: string;
  description: string;
  densityScore: number;
  gapScore: TrendScore;
  detectedAt?: Date;
}

export class AiResearchGap extends Entity<AiResearchGapProps> {
  private constructor(props: AiResearchGapProps, id?: UniqueId) {
    super(props, id);
  }

  public get topic(): string {
    return this.props.topic;
  }

  public get field(): string {
    return this.props.field;
  }

  public get description(): string {
    return this.props.description;
  }

  public get densityScore(): number {
    return this.props.densityScore;
  }

  public get gapScore(): TrendScore {
    return this.props.gapScore;
  }

  public static create(props: AiResearchGapProps, id?: UniqueId): Result<AiResearchGap> {
    return Result.ok<AiResearchGap>(new AiResearchGap(props, id));
  }
}

export { AiResearchTrend as ResearchTrend, type AiResearchTrendProps as ResearchTrendProps };
export { AiResearchGap as ResearchGap, type AiResearchGapProps as ResearchGapProps };

// ─── CitationSuggestion Entity ───────────────────────────────────────────
export interface CitationSuggestionProps {
  publicationId: string;
  suggestedCitationPublicationId: string;
  relevanceScore: SimilarityValue;
  reason: string;
  isSelfCitation: boolean;
}

export class CitationSuggestion extends Entity<CitationSuggestionProps> {
  private constructor(props: CitationSuggestionProps, id?: UniqueId) {
    super(props, id);
  }

  public get publicationId(): string {
    return this.props.publicationId;
  }

  public get suggestedCitationPublicationId(): string {
    return this.props.suggestedCitationPublicationId;
  }

  public get relevanceScore(): SimilarityValue {
    return this.props.relevanceScore;
  }

  public get reason(): string {
    return this.props.reason;
  }

  public get isSelfCitation(): boolean {
    return this.props.isSelfCitation;
  }

  public static create(props: CitationSuggestionProps, id?: UniqueId): Result<CitationSuggestion> {
    if (props.publicationId === props.suggestedCitationPublicationId) {
      return Result.fail<CitationSuggestion>('Publication cannot cite itself.');
    }
    // Business rule: Citation recommendations cannot include self-citations by default unless explicitly allowed
    if (props.isSelfCitation) {
      return Result.fail<CitationSuggestion>(
        'Self-citations are forbidden in suggestions by default.',
      );
    }
    return Result.ok<CitationSuggestion>(new CitationSuggestion(props, id));
  }
}

// ─── PotentialCollaborator Entity ────────────────────────────────────────
export interface PotentialCollaboratorProps {
  profileId: string;
  candidateProfileId: string;
  commonTopics: string[];
  similarity: SimilarityValue;
  collaborationDistance: number;
}

export class PotentialCollaborator extends Entity<PotentialCollaboratorProps> {
  private constructor(props: PotentialCollaboratorProps, id?: UniqueId) {
    super(props, id);
  }

  public get profileId(): string {
    return this.props.profileId;
  }

  public get candidateProfileId(): string {
    return this.props.candidateProfileId;
  }

  public get commonTopics(): string[] {
    return [...this.props.commonTopics];
  }

  public get similarity(): SimilarityValue {
    return this.props.similarity;
  }

  public get collaborationDistance(): number {
    return this.props.collaborationDistance;
  }

  public static create(
    props: PotentialCollaboratorProps,
    id?: UniqueId,
  ): Result<PotentialCollaborator> {
    if (props.profileId === props.candidateProfileId) {
      return Result.fail<PotentialCollaborator>('Profile cannot be a collaborator with itself.');
    }
    return Result.ok<PotentialCollaborator>(new PotentialCollaborator(props, id));
  }
}

/**
 * @rios/domain — AI Research Intelligence Bounded Context Value Objects (Sprint 13)
 */

import { Result, UniqueId, ValueObject } from '@rios/shared';

export class NodeId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): NodeId {
    return new NodeId(id ?? UniqueId.create().value);
  }

  public static from(id: string): NodeId {
    return new NodeId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): NodeId {
    return new NodeId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class EdgeId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): EdgeId {
    return new EdgeId(id ?? UniqueId.create().value);
  }

  public static from(id: string): EdgeId {
    return new EdgeId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): EdgeId {
    return new EdgeId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class EmbeddingId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): EmbeddingId {
    return new EmbeddingId(id ?? UniqueId.create().value);
  }

  public static from(id: string): EmbeddingId {
    return new EmbeddingId(id);
  }

  public static fromUniqueId(uniqueId: UniqueId): EmbeddingId {
    return new EmbeddingId(uniqueId.value);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class SimilarityValue extends ValueObject<{ value: number }> {
  private constructor(value: number) {
    super({ value });
  }

  public get value(): number {
    return this.props.value;
  }

  public static create(score: number): Result<SimilarityValue> {
    if (isNaN(score) || score < 0 || score > 1) {
      return Result.fail<SimilarityValue>('Similarity score must be between 0 and 1 inclusive.');
    }
    return Result.ok<SimilarityValue>(new SimilarityValue(score));
  }

  public static from(score: number): SimilarityValue {
    const clamped = Math.max(0, Math.min(1, score));
    return new SimilarityValue(clamped);
  }

  public override toString(): string {
    return this.props.value.toFixed(4);
  }
}

export class ConfidenceScore extends ValueObject<{ value: number }> {
  private constructor(value: number) {
    super({ value });
  }

  public get value(): number {
    return this.props.value;
  }

  public static create(confidence: number): Result<ConfidenceScore> {
    if (isNaN(confidence) || confidence < 0 || confidence > 100) {
      return Result.fail<ConfidenceScore>('Confidence score must be between 0 and 100 inclusive.');
    }
    return Result.ok<ConfidenceScore>(new ConfidenceScore(confidence));
  }

  public static from(confidence: number): ConfidenceScore {
    const clamped = Math.max(0, Math.min(100, confidence));
    return new ConfidenceScore(clamped);
  }

  public override toString(): string {
    return `${this.props.value.toFixed(1)}%`;
  }
}

export enum RecommendationTypeEnum {
  PUBLICATION = 'PUBLICATION',
  COLLABORATOR = 'COLLABORATOR',
  CITATION = 'CITATION',
  TOPIC = 'TOPIC',
  GAP = 'GAP',
}

export class RecommendationType extends ValueObject<{ type: RecommendationTypeEnum }> {
  private constructor(type: RecommendationTypeEnum) {
    super({ type });
  }

  public get type(): RecommendationTypeEnum {
    return this.props.type;
  }

  public static create(type: RecommendationTypeEnum): RecommendationType {
    return new RecommendationType(type);
  }

  public static fromString(typeString: string): Result<RecommendationType> {
    const uppercase = typeString.toUpperCase() as RecommendationTypeEnum;
    if (Object.values(RecommendationTypeEnum).includes(uppercase)) {
      return Result.ok<RecommendationType>(new RecommendationType(uppercase));
    }
    return Result.fail<RecommendationType>(`Invalid recommendation type: ${typeString}`);
  }

  public override toString(): string {
    return this.props.type;
  }
}

export class EmbeddingModel extends ValueObject<{ modelName: string }> {
  private constructor(modelName: string) {
    super({ modelName });
  }

  public get modelName(): string {
    return this.props.modelName;
  }

  public static create(name: string): Result<EmbeddingModel> {
    const trimmed = name.trim();
    if (!trimmed) {
      return Result.fail<EmbeddingModel>('Embedding model name cannot be empty.');
    }
    return Result.ok<EmbeddingModel>(new EmbeddingModel(trimmed));
  }

  public static defaultModel(): EmbeddingModel {
    return new EmbeddingModel('text-embedding-3-large');
  }

  public override toString(): string {
    return this.props.modelName;
  }
}

export class VectorDimension extends ValueObject<{ dimension: number }> {
  private constructor(dimension: number) {
    super({ dimension });
  }

  public get dimension(): number {
    return this.props.dimension;
  }

  public static create(dim: number): Result<VectorDimension> {
    if (!Number.isInteger(dim) || dim <= 0) {
      return Result.fail<VectorDimension>('Vector dimension must be a positive integer.');
    }
    return Result.ok<VectorDimension>(new VectorDimension(dim));
  }

  public static defaultDimension(): VectorDimension {
    return new VectorDimension(1536);
  }

  public override toString(): string {
    return this.props.dimension.toString();
  }
}

export class ResearchConcept extends ValueObject<{ name: string }> {
  private constructor(name: string) {
    super({ name });
  }

  public get name(): string {
    return this.props.name;
  }

  public static create(name: string): Result<ResearchConcept> {
    const trimmed = name.trim();
    if (!trimmed) {
      return Result.fail<ResearchConcept>('Research concept name cannot be empty.');
    }
    return Result.ok<ResearchConcept>(new ResearchConcept(trimmed));
  }

  public override toString(): string {
    return this.props.name;
  }
}

export class TopicCluster extends ValueObject<{ clusterName: string }> {
  private constructor(clusterName: string) {
    super({ clusterName });
  }

  public get clusterName(): string {
    return this.props.clusterName;
  }

  public static create(name: string): Result<TopicCluster> {
    const trimmed = name.trim();
    if (!trimmed) {
      return Result.fail<TopicCluster>('Topic cluster name cannot be empty.');
    }
    return Result.ok<TopicCluster>(new TopicCluster(trimmed));
  }

  public override toString(): string {
    return this.props.clusterName;
  }
}

export enum ExpertiseLevelEnum {
  NOVICE = 'NOVICE',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
  AUTHORITY = 'AUTHORITY',
}

export class ExpertiseLevel extends ValueObject<{ level: ExpertiseLevelEnum }> {
  private constructor(level: ExpertiseLevelEnum) {
    super({ level });
  }

  public get level(): ExpertiseLevelEnum {
    return this.props.level;
  }

  public static create(level: ExpertiseLevelEnum): ExpertiseLevel {
    return new ExpertiseLevel(level);
  }

  public static fromString(levelStr: string): Result<ExpertiseLevel> {
    const uppercase = levelStr.toUpperCase() as ExpertiseLevelEnum;
    if (Object.values(ExpertiseLevelEnum).includes(uppercase)) {
      return Result.ok<ExpertiseLevel>(new ExpertiseLevel(uppercase));
    }
    return Result.fail<ExpertiseLevel>(`Invalid expertise level: ${levelStr}`);
  }

  public override toString(): string {
    return this.props.level;
  }
}

export class ResearchScore extends ValueObject<{ score: number }> {
  private constructor(score: number) {
    super({ score });
  }

  public get score(): number {
    return this.props.score;
  }

  public static create(score: number): Result<ResearchScore> {
    if (isNaN(score) || score < 0) {
      return Result.fail<ResearchScore>('Research score must be non-negative.');
    }
    return Result.ok<ResearchScore>(new ResearchScore(score));
  }

  public override toString(): string {
    return this.props.score.toFixed(2);
  }
}

export class TrendScore extends ValueObject<{ score: number }> {
  private constructor(score: number) {
    super({ score });
  }

  public get score(): number {
    return this.props.score;
  }

  public static create(score: number): Result<TrendScore> {
    if (isNaN(score)) {
      return Result.fail<TrendScore>('Trend score must be a valid number.');
    }
    return Result.ok<TrendScore>(new TrendScore(score));
  }

  public override toString(): string {
    return this.props.score.toFixed(2);
  }
}

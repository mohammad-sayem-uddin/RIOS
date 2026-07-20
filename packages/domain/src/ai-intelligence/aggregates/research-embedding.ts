/**
 * @rios/domain — ResearchEmbedding Aggregate Root (Sprint 13)
 */

import { AggregateRoot, Result, UniqueId } from '@rios/shared';

import { EmbeddingVector } from '../entities/index.js';
import { EmbeddingGeneratedEvent } from '../events/index.js';
import { EmbeddingModel, VectorDimension } from '../value-objects/index.js';

export interface ResearchEmbeddingProps {
  entityId: string;
  entityType:
    'RESEARCH_PROFILE' | 'PUBLICATION' | 'RESEARCH_PROJECT' | 'RESEARCH_ASSET' | 'CONCEPT';
  model: EmbeddingModel;
  dimension: VectorDimension;
  vector: EmbeddingVector;
  status: 'PENDING' | 'ACTIVE' | 'OUTDATED' | 'FAILED';
  sourceHash?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ResearchEmbedding extends AggregateRoot<ResearchEmbeddingProps> {
  private constructor(props: ResearchEmbeddingProps, id?: UniqueId) {
    super(props, id);
  }

  public get entityId(): string {
    return this.props.entityId;
  }

  public get entityType(): string {
    return this.props.entityType;
  }

  public get model(): EmbeddingModel {
    return this.props.model;
  }

  public get dimension(): VectorDimension {
    return this.props.dimension;
  }

  public get vector(): EmbeddingVector {
    return this.props.vector;
  }

  public get status(): string {
    return this.props.status;
  }

  public get sourceHash(): string | undefined {
    return this.props.sourceHash;
  }

  public get createdAt(): Date {
    return this.props.createdAt ?? new Date();
  }

  public get updatedAt(): Date {
    return this.props.updatedAt ?? new Date();
  }

  public static create(
    props: {
      entityId: string;
      entityType:
        'RESEARCH_PROFILE' | 'PUBLICATION' | 'RESEARCH_PROJECT' | 'RESEARCH_ASSET' | 'CONCEPT';
      model: EmbeddingModel;
      dimension: VectorDimension;
      vector: EmbeddingVector;
      sourceHash?: string;
    },
    id?: UniqueId,
  ): Result<ResearchEmbedding> {
    if (!props.entityId || !props.entityId.trim()) {
      return Result.fail<ResearchEmbedding>('Every embedding belongs to exactly one entity.');
    }
    const embedding = new ResearchEmbedding(
      {
        ...props,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    );

    embedding.addDomainEvent(
      new EmbeddingGeneratedEvent(
        embedding.id.value,
        props.entityId,
        props.entityType,
        props.model.modelName,
        props.dimension.dimension,
      ),
    );

    return Result.ok<ResearchEmbedding>(embedding);
  }

  public static reconstitute(
    props: ResearchEmbeddingProps,
    id: UniqueId,
  ): Result<ResearchEmbedding> {
    return Result.ok<ResearchEmbedding>(new ResearchEmbedding(props, id));
  }

  public markOutdated(): void {
    this.props.status = 'OUTDATED';
    this.props.updatedAt = new Date();
  }

  public updateVector(newVector: EmbeddingVector, newSourceHash?: string): Result<void> {
    if (newVector.dimension.dimension !== this.props.dimension.dimension) {
      return Result.fail<void>('Cannot update embedding with different vector dimensions.');
    }
    this.props.vector = newVector;
    this.props.status = 'ACTIVE';
    this.props.sourceHash = newSourceHash;
    this.props.updatedAt = new Date();
    this.addDomainEvent(
      new EmbeddingGeneratedEvent(
        this.id.value,
        this.props.entityId,
        this.props.entityType,
        this.props.model.modelName,
        this.props.dimension.dimension,
      ),
    );
    return Result.ok<void>(undefined);
  }
}

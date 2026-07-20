/**
 * @rios/domain — AI Research Intelligence Bounded Context Domain Events (Sprint 13)
 */

import { DomainEvent } from '@rios/shared';

export class EmbeddingGeneratedEvent extends DomainEvent {
  public readonly eventType = 'EmbeddingGeneratedEvent';

  constructor(
    public readonly embeddingId: string,
    public readonly entityId: string,
    public readonly entityType: string,
    public readonly modelName: string,
    public readonly dimension: number,
  ) {
    super(embeddingId);
  }
}

export class KnowledgeGraphUpdatedEvent extends DomainEvent {
  public readonly eventType = 'KnowledgeGraphUpdatedEvent';

  constructor(
    public readonly graphId: string,
    public readonly profileId: string,
    public readonly nodeCount: number,
    public readonly edgeCount: number,
  ) {
    super(graphId);
  }
}

export class RecommendationGeneratedEvent extends DomainEvent {
  public readonly eventType = 'RecommendationGeneratedEvent';

  constructor(
    public readonly engineId: string,
    public readonly profileId: string,
    public readonly recommendationType: string,
    public readonly recommendedCount: number,
  ) {
    super(engineId);
  }
}

export class ResearchGapDetectedEvent extends DomainEvent {
  public readonly eventType = 'ResearchGapDetectedEvent';

  constructor(
    public readonly topic: string,
    public readonly field: string,
    public readonly gapScore: number,
  ) {
    super(topic);
  }
}

export class TrendUpdatedEvent extends DomainEvent {
  public readonly eventType = 'TrendUpdatedEvent';

  constructor(
    public readonly topicName: string,
    public readonly trendScore: number,
    public readonly growthRate: number,
  ) {
    super(topicName);
  }
}

export class ExpertiseCalculatedEvent extends DomainEvent {
  public readonly eventType = 'ExpertiseCalculatedEvent';

  constructor(
    public readonly researcherProfileId: string,
    public readonly overallScore: number,
    public readonly conceptCount: number,
  ) {
    super(researcherProfileId);
  }
}

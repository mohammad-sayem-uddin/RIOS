/**
 * @rios/domain — RecommendationEngine Aggregate Root (Sprint 13)
 */

import { AggregateRoot, Result, UniqueId } from '@rios/shared';

import { CitationSuggestion, PotentialCollaborator, Recommendation } from '../entities/index.js';
import { RecommendationGeneratedEvent } from '../events/index.js';
import { RecommendationTypeEnum } from '../value-objects/index.js';

export interface RecommendationEngineProps {
  researcherProfileId: string;
  recommendations: Recommendation[];
  citationSuggestions: CitationSuggestion[];
  collaboratorProposals: PotentialCollaborator[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class RecommendationEngine extends AggregateRoot<RecommendationEngineProps> {
  private constructor(props: RecommendationEngineProps, id?: UniqueId) {
    super(props, id);
  }

  public get researcherProfileId(): string {
    return this.props.researcherProfileId;
  }

  public get recommendations(): Recommendation[] {
    return [...this.props.recommendations];
  }

  public get citationSuggestions(): CitationSuggestion[] {
    return [...this.props.citationSuggestions];
  }

  public get collaboratorProposals(): PotentialCollaborator[] {
    return [...this.props.collaboratorProposals];
  }

  public get createdAt(): Date {
    return this.props.createdAt ?? new Date();
  }

  public get updatedAt(): Date {
    return this.props.updatedAt ?? new Date();
  }

  public static create(
    props: { researcherProfileId: string },
    id?: UniqueId,
  ): Result<RecommendationEngine> {
    if (!props.researcherProfileId || !props.researcherProfileId.trim()) {
      return Result.fail<RecommendationEngine>('Researcher profile ID is required.');
    }
    const engine = new RecommendationEngine(
      {
        researcherProfileId: props.researcherProfileId,
        recommendations: [],
        citationSuggestions: [],
        collaboratorProposals: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    );
    return Result.ok<RecommendationEngine>(engine);
  }

  public static reconstitute(
    props: {
      researcherProfileId: string;
      recommendations: Recommendation[];
      citationSuggestions: CitationSuggestion[];
      collaboratorProposals: PotentialCollaborator[];
      createdAt: Date;
      updatedAt: Date;
    },
    id: UniqueId,
  ): Result<RecommendationEngine> {
    return Result.ok<RecommendationEngine>(new RecommendationEngine(props, id));
  }

  public addRecommendation(recommendation: Recommendation): Result<void> {
    this.props.recommendations.push(recommendation);
    this.props.updatedAt = new Date();
    this.addDomainEvent(
      new RecommendationGeneratedEvent(
        this.id.value,
        this.props.researcherProfileId,
        recommendation.recommendationType.type,
        this.props.recommendations.length,
      ),
    );
    return Result.ok<void>(undefined);
  }

  public addCitationSuggestion(suggestion: CitationSuggestion): Result<void> {
    if (suggestion.isSelfCitation) {
      return Result.fail<void>(
        'Citation recommendations cannot include self-citations by default.',
      );
    }
    this.props.citationSuggestions.push(suggestion);
    this.props.updatedAt = new Date();
    return Result.ok<void>(undefined);
  }

  public addCollaboratorProposal(proposal: PotentialCollaborator): Result<void> {
    if (proposal.candidateProfileId === this.props.researcherProfileId) {
      return Result.fail<void>('Cannot suggest researcher as a collaborator with themselves.');
    }
    this.props.collaboratorProposals.push(proposal);
    this.props.updatedAt = new Date();
    return Result.ok<void>(undefined);
  }

  public filterByType(type: RecommendationTypeEnum): Recommendation[] {
    return this.props.recommendations.filter((r) => r.recommendationType.type === type);
  }
}

/**
 * Research Identity Transport DTOs.
 *
 * Explicit DTO models for HTTP API request bodies, query parameters, and response payloads.
 * No domain aggregates or entities are ever exposed through these DTOs.
 */

export interface CreateResearchIdentityRequestDto {
  readonly primaryFocus: string;
  readonly stage: string;
  readonly visionStatement: string;
  readonly timeHorizon: string;
  readonly targetAudience?: string[];
  readonly coreThemes?: string[];
  readonly values?: {
    readonly corePrinciples: string[];
    readonly methodologicalPreferences: string[];
    readonly ethicalCommitments: string[];
  };
}

export interface UpdateResearchVisionRequestDto {
  readonly visionStatement: string;
  readonly timeHorizon: string;
  readonly targetAudience?: string[];
  readonly coreThemes?: string[];
}

export interface AddResearchAreaRequestDto {
  readonly name: string;
  readonly description: string;
  readonly isPrimary?: boolean;
}

export interface RemoveResearchAreaRequestDto {
  readonly areaId: string;
}

export interface AddResearchQuestionRequestDto {
  readonly questionText: string;
  readonly significance: string;
  readonly targetMilestoneId?: string;
}

export interface AddResearchGoalRequestDto {
  readonly areaId: string;
  readonly description: string;
  readonly targetHorizon: string;
}

export interface RemoveResearchGoalRequestDto {
  readonly goalId: string;
}

export interface RecordContributionRequestDto {
  readonly title: string;
  readonly contributionType: string;
  readonly summary: string;
  readonly areaIds?: string[];
}

export interface UpdateResearchAgendaRequestDto {
  readonly focusAreas: string[];
  readonly strategicPillars: string[];
}

export interface SetResearchPhilosophyRequestDto {
  readonly corePrinciples: string[];
  readonly methodologicalPreferences: string[];
  readonly ethicalCommitments: string[];
}

export interface ReviseResearchPhilosophyRequestDto {
  readonly corePrinciples: string[];
  readonly methodologicalPreferences: string[];
  readonly ethicalCommitments: string[];
  readonly revisionReason: string;
}

export interface RecordEvolutionRequestDto {
  readonly phaseName: string;
  readonly description: string;
  readonly keyLearnings?: string[];
}

export interface FindResearchIdentitiesQueryDto {
  readonly stage?: string;
  readonly focus?: string;
  readonly limit?: number;
  readonly offset?: number;
}

export interface SearchResearchIdentityQueryDto {
  readonly query: string;
  readonly limit?: number;
}

export interface ResearchIdentityIdResponseDto {
  readonly id: string;
}

export interface ResearchIdentityResponseDto {
  readonly id: string;
  readonly stage: string;
  readonly focus: string;
  readonly vision?: {
    readonly statement: string;
    readonly timeHorizon: string;
    readonly targetAudience: string[];
    readonly coreThemes: string[];
  };
  readonly agenda?: {
    readonly focusAreas: string[];
    readonly strategicPillars: string[];
  };
  readonly areasCount: number;
  readonly questionsCount: number;
  readonly goalsCount: number;
  readonly contributionsCount: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

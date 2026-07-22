/**
 * Request Mappers.
 *
 * Maps HTTP Request DTOs into Application Commands and Queries.
 */

import { randomUUID } from 'node:crypto';

import {
  CreateResearchIdentityCommand,
  UpdateResearchVisionCommand,
  AddResearchAreaCommand,
  RemoveResearchAreaCommand,
  AddResearchQuestionCommand,
  AddResearchGoalCommand,
  RemoveResearchGoalCommand,
  RecordContributionCommand,
  UpdateResearchAgendaCommand,
  SetResearchPhilosophyCommand,
  ReviseResearchPhilosophyCommand,
  RecordEvolutionCommand,
  GetResearchIdentityQuery,
  FindResearchIdentitiesQuery,
  SearchResearchIdentityQuery,
} from '@rios/application';

import type {
  CreateResearchIdentityRequestDto,
  UpdateResearchVisionRequestDto,
  AddResearchAreaRequestDto,
  AddResearchQuestionRequestDto,
  AddResearchGoalRequestDto,
  RecordContributionRequestDto,
  UpdateResearchAgendaRequestDto,
  SetResearchPhilosophyRequestDto,
  ReviseResearchPhilosophyRequestDto,
  RecordEvolutionRequestDto,
  FindResearchIdentitiesQueryDto,
  SearchResearchIdentityQueryDto,
} from '../dto/research-identity-dtos.js';

export class RequestMapper {
  public static toCreateCommand(
    dto: CreateResearchIdentityRequestDto,
  ): CreateResearchIdentityCommand {
    return new CreateResearchIdentityCommand({
      commandId: randomUUID(),
      timestamp: new Date(),
      visionStatement: dto.visionStatement,
      timeHorizon: dto.timeHorizon,
      agendaFocus: dto.primaryFocus,
      agendaStatus: 'Active',
      philosophyStatement: dto.stage,
      philosophyApproach: dto.primaryFocus,
      valuesStatement:
        dto.values?.corePrinciples && dto.values.corePrinciples.length > 0
          ? dto.values.corePrinciples.join(', ')
          : dto.visionStatement,
      evolutionDescription: 'Initial establishment',
      evolutionStatus: 'Active',
    });
  }

  public static toUpdateVisionCommand(
    id: string,
    dto: UpdateResearchVisionRequestDto,
  ): UpdateResearchVisionCommand {
    return new UpdateResearchVisionCommand({
      commandId: randomUUID(),
      timestamp: new Date(),
      identityId: id,
      visionStatement: dto.visionStatement,
      timeHorizon: dto.timeHorizon,
    });
  }

  public static toAddAreaCommand(
    id: string,
    dto: AddResearchAreaRequestDto,
  ): AddResearchAreaCommand {
    return new AddResearchAreaCommand({
      commandId: randomUUID(),
      timestamp: new Date(),
      identityId: id,
      areaName: dto.name,
      areaDescription: dto.description,
      areaStatus: 'Active',
      areaStage: 'Emerging',
    });
  }

  public static toRemoveAreaCommand(id: string, areaId: string): RemoveResearchAreaCommand {
    return new RemoveResearchAreaCommand({
      commandId: randomUUID(),
      timestamp: new Date(),
      identityId: id,
      areaId,
    });
  }

  public static toAddQuestionCommand(
    id: string,
    dto: AddResearchQuestionRequestDto,
  ): AddResearchQuestionCommand {
    return new AddResearchQuestionCommand({
      commandId: randomUUID(),
      timestamp: new Date(),
      identityId: id,
      questionText: dto.questionText,
      questionAreaId: dto.targetMilestoneId ?? 'default-area',
      questionPriority: 'High',
    });
  }

  public static toAddGoalCommand(
    id: string,
    dto: AddResearchGoalRequestDto,
  ): AddResearchGoalCommand {
    return new AddResearchGoalCommand({
      commandId: randomUUID(),
      timestamp: new Date(),
      identityId: id,
      goalTitle: dto.description,
      goalDescription: dto.description,
      goalTargetDate: dto.targetHorizon,
      goalStatus: 'Active',
      goalPriority: 'High',
    });
  }

  public static toRemoveGoalCommand(id: string, goalId: string): RemoveResearchGoalCommand {
    return new RemoveResearchGoalCommand({
      commandId: randomUUID(),
      timestamp: new Date(),
      identityId: id,
      goalId,
    });
  }

  public static toRecordContributionCommand(
    id: string,
    dto: RecordContributionRequestDto,
  ): RecordContributionCommand {
    return new RecordContributionCommand({
      commandId: randomUUID(),
      timestamp: new Date(),
      identityId: id,
      contributionTitle: dto.title,
      contributionDescription: dto.summary,
      contributionType: dto.contributionType,
      contributionDate: new Date().toISOString(),
      contributionStatus: 'Recorded',
    });
  }

  public static toUpdateAgendaCommand(
    id: string,
    dto: UpdateResearchAgendaRequestDto,
  ): UpdateResearchAgendaCommand {
    return new UpdateResearchAgendaCommand({
      commandId: randomUUID(),
      timestamp: new Date(),
      identityId: id,
      agendaFocus: dto.focusAreas.join(', '),
      agendaStatus: 'Active',
    });
  }

  public static toSetPhilosophyCommand(
    id: string,
    dto: SetResearchPhilosophyRequestDto,
  ): SetResearchPhilosophyCommand {
    return new SetResearchPhilosophyCommand({
      commandId: randomUUID(),
      timestamp: new Date(),
      identityId: id,
      philosophicalStance: dto.corePrinciples.join(', '),
      epistemologicalView: dto.methodologicalPreferences.join(', '),
      methodologicalPreference: dto.ethicalCommitments.join(', '),
    });
  }

  public static toRevisePhilosophyCommand(
    id: string,
    dto: ReviseResearchPhilosophyRequestDto,
  ): ReviseResearchPhilosophyCommand {
    return new ReviseResearchPhilosophyCommand({
      commandId: randomUUID(),
      timestamp: new Date(),
      identityId: id,
      philosophicalStance: dto.corePrinciples.join(', '),
      epistemologicalView: dto.methodologicalPreferences.join(', '),
      methodologicalPreference: dto.ethicalCommitments.join(', '),
      revisionReason: dto.revisionReason,
    });
  }

  public static toRecordEvolutionCommand(
    id: string,
    dto: RecordEvolutionRequestDto,
  ): RecordEvolutionCommand {
    return new RecordEvolutionCommand({
      commandId: randomUUID(),
      timestamp: new Date(),
      identityId: id,
      evolutionDescription: dto.description,
      evolutionType: dto.phaseName,
      evolutionTrigger: 'ManualEntry',
      evolutionImpact: 'High',
    });
  }

  public static toGetQuery(id: string): GetResearchIdentityQuery {
    return new GetResearchIdentityQuery({
      queryId: randomUUID(),
      timestamp: new Date(),
      identityId: id,
    });
  }

  public static toFindQuery(dto: FindResearchIdentitiesQueryDto): FindResearchIdentitiesQuery {
    return new FindResearchIdentitiesQuery({
      queryId: randomUUID(),
      timestamp: new Date(),
      limit: dto.limit ?? 20,
      offset: dto.offset ?? 0,
    });
  }

  public static toSearchQuery(dto: SearchResearchIdentityQueryDto): SearchResearchIdentityQuery {
    return new SearchResearchIdentityQuery({
      queryId: randomUUID(),
      timestamp: new Date(),
      searchTerm: dto.query,
      limit: dto.limit ?? 20,
      offset: 0,
    });
  }
}

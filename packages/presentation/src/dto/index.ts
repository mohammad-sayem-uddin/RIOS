/**
 * DTO Module — Presentation Layer
 */

export type { ApiErrorDto, ApiMetaDto, ApiResponseDto } from './api-response.dto.js';
export { ApiResponseFactory } from './api-response.dto.js';

export type { ComponentHealthDto, HealthResponseDto } from './health-response.dto.js';

export type {
  CreateResearchIdentityRequestDto,
  UpdateResearchVisionRequestDto,
  AddResearchAreaRequestDto,
  RemoveResearchAreaRequestDto,
  AddResearchQuestionRequestDto,
  AddResearchGoalRequestDto,
  RemoveResearchGoalRequestDto,
  RecordContributionRequestDto,
  UpdateResearchAgendaRequestDto,
  SetResearchPhilosophyRequestDto,
  ReviseResearchPhilosophyRequestDto,
  RecordEvolutionRequestDto,
  FindResearchIdentitiesQueryDto,
  SearchResearchIdentityQueryDto,
  ResearchIdentityIdResponseDto,
  ResearchIdentityResponseDto,
} from './research-identity-dtos.js';

export * from './research-profile-dtos.js';

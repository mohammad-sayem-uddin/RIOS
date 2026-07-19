/**
 * Publication Application Service Contract
 *
 * Defines application layer interface for Publication and Research Project orchestration.
 */

import type { Result } from '@rios/shared';

import type {
  CreatePublicationDto,
  CreateResearchProjectDto,
  ProjectMemberInputDto,
  PublicationOutputDto,
  PublicationStatisticsDto,
  ResearchProjectOutputDto,
  UpdatePublicationDto,
  UpdateResearchProjectDto,
} from '../dto/publication-dtos.js';

export interface PublicationApplicationService {
  createPublication(dto: CreatePublicationDto): Promise<Result<PublicationOutputDto>>;
  updatePublication(dto: UpdatePublicationDto): Promise<Result<PublicationOutputDto>>;
  publishPublication(id: string, publishedDate: string): Promise<Result<PublicationOutputDto>>;
  submitPublication(id: string, submittedDate: string): Promise<Result<PublicationOutputDto>>;
  deletePublication(id: string): Promise<Result<void>>;
  getPublicationById(id: string): Promise<Result<PublicationOutputDto>>;
  searchPublications(
    query: string,
    filters?: { type?: string; status?: string; year?: number; profileId?: string },
  ): Promise<Result<PublicationOutputDto[]>>;
  getPublicationsByProfileId(profileId: string): Promise<Result<PublicationOutputDto[]>>;
  getPublicationStatistics(profileId: string): Promise<Result<PublicationStatisticsDto>>;

  createResearchProject(dto: CreateResearchProjectDto): Promise<Result<ResearchProjectOutputDto>>;
  updateResearchProject(dto: UpdateResearchProjectDto): Promise<Result<ResearchProjectOutputDto>>;
  completeResearchProject(id: string, endDate: string): Promise<Result<ResearchProjectOutputDto>>;
  deleteResearchProject(id: string): Promise<Result<void>>;
  getResearchProjectById(id: string): Promise<Result<ResearchProjectOutputDto>>;
  getResearchProjectsByProfileId(profileId: string): Promise<Result<ResearchProjectOutputDto[]>>;
  addProjectMember(
    projectId: string,
    member: ProjectMemberInputDto,
  ): Promise<Result<ResearchProjectOutputDto>>;
  removeProjectMember(
    projectId: string,
    memberId: string,
  ): Promise<Result<ResearchProjectOutputDto>>;
}

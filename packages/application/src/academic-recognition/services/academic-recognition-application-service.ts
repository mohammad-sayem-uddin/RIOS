/**
 * Contract for Academic Recognition Application Service
 */

import { Result } from '@rios/shared';

import type {
  AwardOutputDto,
  CreateAwardDto,
  CreateGrantDto,
  CreatePatentDto,
  CreateProfessionalActivityDto,
  GrantOutputDto,
  PatentOutputDto,
  ProfessionalActivityOutputDto,
  UpdatePatentStatusDto,
} from '../dtos/academic-recognition-dtos.js';

export interface AcademicRecognitionApplicationService {
  // Awards
  createAward(dto: CreateAwardDto): Promise<Result<AwardOutputDto>>;
  getAwardById(id: string): Promise<Result<AwardOutputDto>>;
  getAwardsByProfileId(profileId: string): Promise<Result<AwardOutputDto[]>>;
  searchAwards(query: string): Promise<Result<AwardOutputDto[]>>;
  deleteAward(id: string): Promise<Result<void>>;

  // Grants
  createGrant(dto: CreateGrantDto): Promise<Result<GrantOutputDto>>;
  getGrantById(id: string): Promise<Result<GrantOutputDto>>;
  getGrantsByProfileId(profileId: string): Promise<Result<GrantOutputDto[]>>;
  searchGrants(query: string): Promise<Result<GrantOutputDto[]>>;
  completeGrant(grantId: string): Promise<Result<GrantOutputDto>>;
  deleteGrant(id: string): Promise<Result<void>>;

  // Patents
  createPatent(dto: CreatePatentDto): Promise<Result<PatentOutputDto>>;
  getPatentById(id: string): Promise<Result<PatentOutputDto>>;
  getPatentsByProfileId(profileId: string): Promise<Result<PatentOutputDto[]>>;
  searchPatents(query: string): Promise<Result<PatentOutputDto[]>>;
  updatePatentStatus(dto: UpdatePatentStatusDto): Promise<Result<PatentOutputDto>>;
  deletePatent(id: string): Promise<Result<void>>;

  // Professional Activities
  createProfessionalActivity(
    dto: CreateProfessionalActivityDto,
  ): Promise<Result<ProfessionalActivityOutputDto>>;
  getProfessionalActivityById(id: string): Promise<Result<ProfessionalActivityOutputDto>>;
  getProfessionalActivitiesByProfileId(
    profileId: string,
  ): Promise<Result<ProfessionalActivityOutputDto[]>>;
  searchProfessionalActivities(query: string): Promise<Result<ProfessionalActivityOutputDto[]>>;
  deleteProfessionalActivity(id: string): Promise<Result<void>>;
}

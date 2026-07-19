/**
 * Implementation of AcademicRecognitionApplicationService
 */

import {
  ActivityCategoryType,
  Award,
  AwardCategory,
  AwardCategoryType,
  AwardTitle,
  ConferenceName,
  Country,
  Currency,
  FundingAmount,
  Grant,
  GrantNumber,
  GrantStatus,
  IAwardRepository,
  IGrantRepository,
  IPatentRepository,
  IProfessionalActivityRepository,
  OrganizationName,
  Patent,
  PatentNumber,
  PatentStatus,
  PatentStatusType,
  PatentType,
  PatentTypeEnum,
  ProfessionalActivity,
  ProfessionalRole,
} from '@rios/domain';
import { Result, UniqueId } from '@rios/shared';

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

import type { AcademicRecognitionApplicationService } from './academic-recognition-application-service.js';

export class AcademicRecognitionApplicationServiceImpl implements AcademicRecognitionApplicationService {
  constructor(
    private readonly awardRepo: IAwardRepository,
    private readonly grantRepo: IGrantRepository,
    private readonly patentRepo: IPatentRepository,
    private readonly activityRepo: IProfessionalActivityRepository,
  ) {}

  // Awards
  public async createAward(dto: CreateAwardDto): Promise<Result<AwardOutputDto>> {
    try {
      const profileId = UniqueId.from(dto.profileId);
      const titleRes = AwardTitle.create(dto.title);
      if (titleRes.isFailure) return Result.fail(titleRes.error);

      const category = AwardCategory.create(
        (dto.category as AwardCategoryType) ?? AwardCategoryType.AWARD,
      );
      const sponsorOrAgency =
        dto.sponsorOrAgency !== undefined && dto.sponsorOrAgency !== ''
          ? OrganizationName.from(dto.sponsorOrAgency)
          : undefined;

      const amount =
        dto.amount !== undefined && dto.amount >= 0
          ? FundingAmount.from(dto.amount, dto.currency ?? 'USD')
          : undefined;

      const awardDate =
        dto.awardDate !== undefined && dto.awardDate !== '' ? new Date(dto.awardDate) : new Date();

      const awardRes = Award.create({
        profileId,
        title: titleRes.value,
        category,
        sponsorOrAgency,
        amount,
        awardDate,
        description: dto.description,
        field: dto.field,
        area: dto.area,
      });

      if (awardRes.isFailure) return Result.fail(awardRes.error);

      const award = awardRes.value;
      await this.awardRepo.save(award);
      return Result.ok(this.mapAwardToDto(award));
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err.message : String(err));
    }
  }

  public async getAwardById(id: string): Promise<Result<AwardOutputDto>> {
    const award = await this.awardRepo.findById(id);
    if (!award) return Result.fail(`Award '${id}' not found.`);
    return Result.ok(this.mapAwardToDto(award));
  }

  public async getAwardsByProfileId(profileId: string): Promise<Result<AwardOutputDto[]>> {
    const awards = await this.awardRepo.findByResearchProfile(profileId);
    return Result.ok(awards.map((a) => this.mapAwardToDto(a)));
  }

  public async searchAwards(query: string): Promise<Result<AwardOutputDto[]>> {
    const awards = await this.awardRepo.search(query);
    return Result.ok(awards.map((a) => this.mapAwardToDto(a)));
  }

  public async deleteAward(id: string): Promise<Result<void>> {
    await this.awardRepo.delete(id);
    return Result.ok();
  }

  // Grants
  public async createGrant(dto: CreateGrantDto): Promise<Result<GrantOutputDto>> {
    try {
      const profileId = UniqueId.from(dto.profileId);
      const grantNumRes = GrantNumber.create(dto.grantNumber);
      if (grantNumRes.isFailure) return Result.fail(grantNumRes.error);

      const agencyRes = OrganizationName.create(dto.fundingAgency);
      if (agencyRes.isFailure) return Result.fail(agencyRes.error);

      const amountRes = FundingAmount.create(dto.amount, Currency.from(dto.currency ?? 'USD'));
      if (amountRes.isFailure) return Result.fail(amountRes.error);

      const existing = await this.grantRepo.findByGrantNumber(dto.grantNumber);
      if (existing) return Result.fail(`Grant number '${dto.grantNumber}' already exists.`);

      const grantRes = Grant.create({
        profileId,
        grantNumber: grantNumRes.value,
        title: dto.title,
        fundingAgency: agencyRes.value,
        amount: amountRes.value,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        status: (dto.status as GrantStatus) ?? GrantStatus.ACTIVE,
        principalInvestigatorId: dto.principalInvestigatorId,
        coInvestigators: dto.coInvestigators,
        description: dto.description,
        deliverables: dto.deliverables,
      });

      if (grantRes.isFailure) return Result.fail(grantRes.error);

      const grant = grantRes.value;
      await this.grantRepo.save(grant);
      return Result.ok(this.mapGrantToDto(grant));
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err.message : String(err));
    }
  }

  public async getGrantById(id: string): Promise<Result<GrantOutputDto>> {
    const grant = await this.grantRepo.findById(id);
    if (!grant) return Result.fail(`Grant '${id}' not found.`);
    return Result.ok(this.mapGrantToDto(grant));
  }

  public async getGrantsByProfileId(profileId: string): Promise<Result<GrantOutputDto[]>> {
    const grants = await this.grantRepo.findByResearchProfile(profileId);
    return Result.ok(grants.map((g) => this.mapGrantToDto(g)));
  }

  public async searchGrants(query: string): Promise<Result<GrantOutputDto[]>> {
    const grants = await this.grantRepo.search(query);
    return Result.ok(grants.map((g) => this.mapGrantToDto(g)));
  }

  public async completeGrant(grantId: string): Promise<Result<GrantOutputDto>> {
    try {
      const grant = await this.grantRepo.findById(grantId);
      if (!grant) return Result.fail(`Grant '${grantId}' not found.`);

      const compRes = grant.markCompleted();
      if (compRes.isFailure) return Result.fail(compRes.error);

      await this.grantRepo.save(grant);
      return Result.ok(this.mapGrantToDto(grant));
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err.message : String(err));
    }
  }

  public async deleteGrant(id: string): Promise<Result<void>> {
    await this.grantRepo.delete(id);
    return Result.ok();
  }

  // Patents
  public async createPatent(dto: CreatePatentDto): Promise<Result<PatentOutputDto>> {
    try {
      const profileId = UniqueId.from(dto.profileId);
      const patentNumRes = PatentNumber.create(dto.patentNumber);
      if (patentNumRes.isFailure) return Result.fail(patentNumRes.error);

      const existing = await this.patentRepo.findByPatentNumber(dto.patentNumber);
      if (existing) return Result.fail(`Patent number '${dto.patentNumber}' already exists.`);

      const status = PatentStatus.create(
        (dto.status as PatentStatusType) ?? PatentStatusType.APPLIED,
      );
      const patentType = PatentType.create(
        (dto.patentType as PatentTypeEnum) ?? PatentTypeEnum.UTILITY,
      );
      const assigneeOrganization =
        dto.assigneeOrganization !== undefined && dto.assigneeOrganization !== ''
          ? OrganizationName.from(dto.assigneeOrganization)
          : undefined;

      const patentRes = Patent.create({
        profileId,
        patentNumber: patentNumRes.value,
        title: dto.title,
        status,
        patentType,
        filingDate: new Date(dto.filingDate),
        grantDate:
          dto.grantDate !== undefined && dto.grantDate !== '' ? new Date(dto.grantDate) : undefined,
        assigneeOrganization,
        inventors: dto.inventors,
        abstract: dto.abstract,
      });

      if (patentRes.isFailure) return Result.fail(patentRes.error);

      const patent = patentRes.value;
      await this.patentRepo.save(patent);
      return Result.ok(this.mapPatentToDto(patent));
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err.message : String(err));
    }
  }

  public async getPatentById(id: string): Promise<Result<PatentOutputDto>> {
    const patent = await this.patentRepo.findById(id);
    if (!patent) return Result.fail(`Patent '${id}' not found.`);
    return Result.ok(this.mapPatentToDto(patent));
  }

  public async getPatentsByProfileId(profileId: string): Promise<Result<PatentOutputDto[]>> {
    const patents = await this.patentRepo.findByResearchProfile(profileId);
    return Result.ok(patents.map((p) => this.mapPatentToDto(p)));
  }

  public async searchPatents(query: string): Promise<Result<PatentOutputDto[]>> {
    const patents = await this.patentRepo.search(query);
    return Result.ok(patents.map((p) => this.mapPatentToDto(p)));
  }

  public async updatePatentStatus(dto: UpdatePatentStatusDto): Promise<Result<PatentOutputDto>> {
    try {
      const patent = await this.patentRepo.findById(dto.patentId);
      if (!patent) return Result.fail(`Patent '${dto.patentId}' not found.`);

      const grantDate =
        dto.grantDate !== undefined && dto.grantDate !== '' ? new Date(dto.grantDate) : undefined;
      const updateRes = patent.updateStatus(dto.nextStatus as PatentStatusType, grantDate);
      if (updateRes.isFailure) return Result.fail(updateRes.error);

      await this.patentRepo.save(patent);
      return Result.ok(this.mapPatentToDto(patent));
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err.message : String(err));
    }
  }

  public async deletePatent(id: string): Promise<Result<void>> {
    await this.patentRepo.delete(id);
    return Result.ok();
  }

  // Professional Activities
  public async createProfessionalActivity(
    dto: CreateProfessionalActivityDto,
  ): Promise<Result<ProfessionalActivityOutputDto>> {
    try {
      const profileId = UniqueId.from(dto.profileId);
      const category = (dto.category as ActivityCategoryType) ?? ActivityCategoryType.MEMBERSHIP;
      const organization =
        dto.organization !== undefined && dto.organization !== ''
          ? OrganizationName.from(dto.organization)
          : undefined;
      const role =
        dto.role !== undefined && dto.role !== '' ? ProfessionalRole.from(dto.role) : undefined;
      const conferenceName =
        dto.conferenceName !== undefined && dto.conferenceName !== ''
          ? ConferenceName.from(dto.conferenceName)
          : undefined;
      const country =
        dto.country !== undefined && dto.country !== '' ? Country.from(dto.country) : undefined;

      const actRes = ProfessionalActivity.create({
        profileId,
        category,
        title: dto.title,
        organization,
        role,
        startDate:
          dto.startDate !== undefined && dto.startDate !== '' ? new Date(dto.startDate) : undefined,
        endDate:
          dto.endDate !== undefined && dto.endDate !== '' ? new Date(dto.endDate) : undefined,
        conferenceName,
        journalName: dto.journalName,
        country,
        description: dto.description,
      });

      if (actRes.isFailure) return Result.fail(actRes.error);

      const act = actRes.value;
      await this.activityRepo.save(act);
      return Result.ok(this.mapActivityToDto(act));
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err.message : String(err));
    }
  }

  public async getProfessionalActivityById(
    id: string,
  ): Promise<Result<ProfessionalActivityOutputDto>> {
    const act = await this.activityRepo.findById(id);
    if (!act) return Result.fail(`Professional activity '${id}' not found.`);
    return Result.ok(this.mapActivityToDto(act));
  }

  public async getProfessionalActivitiesByProfileId(
    profileId: string,
  ): Promise<Result<ProfessionalActivityOutputDto[]>> {
    const list = await this.activityRepo.findByResearchProfile(profileId);
    return Result.ok(list.map((a) => this.mapActivityToDto(a)));
  }

  public async searchProfessionalActivities(
    query: string,
  ): Promise<Result<ProfessionalActivityOutputDto[]>> {
    const list = await this.activityRepo.search(query);
    return Result.ok(list.map((a) => this.mapActivityToDto(a)));
  }

  public async deleteProfessionalActivity(id: string): Promise<Result<void>> {
    await this.activityRepo.delete(id);
    return Result.ok();
  }

  // Mapper helpers
  private mapAwardToDto(award: Award): AwardOutputDto {
    return {
      id: award.awardId.value,
      profileId: award.profileId.value,
      title: award.title,
      category: award.category,
      sponsorOrAgency: award.sponsorOrAgency?.value,
      amount: award.amount?.amount,
      currency: award.amount?.currency.code,
      awardDate: award.awardDate.toISOString(),
      description: award.description,
      field: award.field,
      area: award.area,
      createdAt: award.createdAt.toISOString(),
      updatedAt: award.updatedAt.toISOString(),
    };
  }

  private mapGrantToDto(grant: Grant): GrantOutputDto {
    return {
      id: grant.grantId.value,
      profileId: grant.profileId.value,
      grantNumber: grant.grantNumber.value,
      title: grant.title,
      fundingAgency: grant.fundingAgency.value,
      amount: grant.amount.amount,
      currency: grant.amount.currency.code,
      startDate: grant.startDate.toISOString(),
      endDate: grant.endDate.toISOString(),
      status: grant.status,
      principalInvestigatorId: grant.principalInvestigatorId,
      coInvestigators: grant.coInvestigators,
      description: grant.description,
      deliverables: grant.deliverables,
      createdAt: grant.createdAt.toISOString(),
      updatedAt: grant.updatedAt.toISOString(),
    };
  }

  private mapPatentToDto(patent: Patent): PatentOutputDto {
    return {
      id: patent.patentId.value,
      profileId: patent.profileId.value,
      patentNumber: patent.patentNumber.value,
      title: patent.title,
      status: patent.status.value,
      patentType: patent.patentType.value,
      filingDate: patent.filingDate.toISOString(),
      grantDate: patent.grantDate?.toISOString(),
      assigneeOrganization: patent.assigneeOrganization?.value,
      inventors: patent.inventors,
      abstract: patent.abstract,
      createdAt: patent.createdAt.toISOString(),
      updatedAt: patent.updatedAt.toISOString(),
    };
  }

  private mapActivityToDto(act: ProfessionalActivity): ProfessionalActivityOutputDto {
    return {
      id: act.activityId.value,
      profileId: act.profileId.value,
      category: act.category,
      title: act.title,
      organization: act.organization?.value,
      role: act.role?.value,
      startDate: act.startDate?.toISOString(),
      endDate: act.endDate?.toISOString(),
      conferenceName: act.conferenceName?.value,
      journalName: act.journalName,
      country: act.country?.code,
      description: act.description,
      createdAt: act.createdAt.toISOString(),
      updatedAt: act.updatedAt.toISOString(),
    };
  }
}

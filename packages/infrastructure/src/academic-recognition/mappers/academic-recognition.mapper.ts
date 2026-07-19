/**
 * Mappers for Academic Recognition Prisma Models <-> Domain Aggregates
 */

import {
  AcademicAward as PrismaAcademicAward,
  AcademicGrant as PrismaAcademicGrant,
  AcademicPatent as PrismaAcademicPatent,
  ProfessionalActivity as PrismaProfessionalActivity,
} from '@prisma/client';
import {
  ActivityCategoryType,
  Award,
  AwardCategory,
  AwardCategoryType,
  AwardTitle,
  ConferenceName,
  Country,
  FundingAmount,
  Grant,
  GrantNumber,
  GrantStatus,
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
import { UniqueId } from '@rios/shared';

export class AcademicRecognitionMapper {
  public static toAwardDomain(raw: PrismaAcademicAward): Award {
    const amount =
      raw.amount !== null && raw.amount !== undefined
        ? FundingAmount.from(Number(raw.amount), raw.currency ?? 'USD')
        : undefined;

    const sponsorOrAgency =
      raw.sponsorOrAgency !== null &&
      raw.sponsorOrAgency !== undefined &&
      raw.sponsorOrAgency !== ''
        ? OrganizationName.from(raw.sponsorOrAgency)
        : undefined;

    return Award.create(
      {
        profileId: UniqueId.from(raw.profileId),
        title: AwardTitle.from(raw.title),
        category: AwardCategory.create(raw.category as AwardCategoryType),
        sponsorOrAgency,
        amount,
        awardDate: raw.awardDate,
        description:
          raw.description !== null && raw.description !== undefined ? raw.description : undefined,
        field: raw.field !== null && raw.field !== undefined ? raw.field : undefined,
        area: raw.area !== null && raw.area !== undefined ? raw.area : undefined,
      },
      UniqueId.from(raw.id),
    ).value;
  }

  public static toGrantDomain(raw: PrismaAcademicGrant): Grant {
    const amount = FundingAmount.from(Number(raw.amount), raw.currency ?? 'USD');
    const coInvestigators =
      raw.coInvestigators !== null &&
      raw.coInvestigators !== undefined &&
      raw.coInvestigators !== ''
        ? raw.coInvestigators.split(',')
        : [];
    const deliverables =
      raw.deliverables !== null && raw.deliverables !== undefined && raw.deliverables !== ''
        ? raw.deliverables.split(',')
        : [];

    return Grant.create(
      {
        profileId: UniqueId.from(raw.profileId),
        grantNumber: GrantNumber.from(raw.grantNumber),
        title: raw.title,
        fundingAgency: OrganizationName.from(raw.fundingAgency),
        amount,
        startDate: raw.startDate,
        endDate: raw.endDate,
        status: raw.status as GrantStatus,
        principalInvestigatorId:
          raw.principalInvestigatorId !== null && raw.principalInvestigatorId !== undefined
            ? raw.principalInvestigatorId
            : undefined,
        coInvestigators,
        description:
          raw.description !== null && raw.description !== undefined ? raw.description : undefined,
        deliverables,
      },
      UniqueId.from(raw.id),
    ).value;
  }

  public static toPatentDomain(raw: PrismaAcademicPatent): Patent {
    const status = PatentStatus.create(raw.status as PatentStatusType);
    const patentType = PatentType.create(raw.patentType as PatentTypeEnum);
    const assigneeOrganization =
      raw.assigneeOrganization !== null &&
      raw.assigneeOrganization !== undefined &&
      raw.assigneeOrganization !== ''
        ? OrganizationName.from(raw.assigneeOrganization)
        : undefined;
    const inventors =
      raw.inventors !== null && raw.inventors !== undefined && raw.inventors !== ''
        ? raw.inventors.split(',')
        : [];

    return Patent.create(
      {
        profileId: UniqueId.from(raw.profileId),
        patentNumber: PatentNumber.from(raw.patentNumber),
        title: raw.title,
        status,
        patentType,
        filingDate: raw.filingDate,
        grantDate:
          raw.grantDate !== null && raw.grantDate !== undefined ? raw.grantDate : undefined,
        assigneeOrganization,
        inventors,
        abstract: raw.abstract !== null && raw.abstract !== undefined ? raw.abstract : undefined,
      },
      UniqueId.from(raw.id),
    ).value;
  }

  public static toActivityDomain(raw: PrismaProfessionalActivity): ProfessionalActivity {
    const organization =
      raw.organization !== null && raw.organization !== undefined && raw.organization !== ''
        ? OrganizationName.from(raw.organization)
        : undefined;
    const role =
      raw.role !== null && raw.role !== undefined && raw.role !== ''
        ? ProfessionalRole.from(raw.role)
        : undefined;
    const conferenceName =
      raw.conferenceName !== null && raw.conferenceName !== undefined && raw.conferenceName !== ''
        ? ConferenceName.from(raw.conferenceName)
        : undefined;
    const country =
      raw.country !== null && raw.country !== undefined && raw.country !== ''
        ? Country.from(raw.country)
        : undefined;

    return ProfessionalActivity.create(
      {
        profileId: UniqueId.from(raw.profileId),
        category: raw.category as ActivityCategoryType,
        title: raw.title,
        organization,
        role,
        startDate:
          raw.startDate !== null && raw.startDate !== undefined ? raw.startDate : undefined,
        endDate: raw.endDate !== null && raw.endDate !== undefined ? raw.endDate : undefined,
        conferenceName,
        journalName:
          raw.journalName !== null && raw.journalName !== undefined ? raw.journalName : undefined,
        country,
        description:
          raw.description !== null && raw.description !== undefined ? raw.description : undefined,
      },
      UniqueId.from(raw.id),
    ).value;
  }
}

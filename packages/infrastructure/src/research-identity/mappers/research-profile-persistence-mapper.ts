/**
 * Research Profile Persistence Mapper
 * Maps Prisma ORM models to/from ResearchProfile Domain Aggregate.
 */

import {
  AcademicHeadline,
  AcademicPeriod,
  AcademicSummary,
  AssetTypeType,
  Biography,
  DegreeName,
  Education,
  EducationId,
  ExperienceId,
  ExternalProfile,
  ExternalProfileId,
  ExternalProfileUrl,
  InstitutionName,
  Mission,
  PortfolioAsset,
  PortfolioAssetId,
  ProfileProviderType,
  ProfessionalExperience,
  ResearchInterest,
  ResearchInterestId,
  ResearchInterestName,
  ResearchProfile,
  ResearchProfileId,
  ResearchStatement,
  Skill,
  SkillCategoryType,
  SkillId,
  SkillName,
  Vision,
} from '@rios/domain';
import { UniqueId } from '@rios/shared';

export interface PrismaResearchProfileFull {
  id: string;
  userId: string;
  title: string;
  headline: string | null;
  biography: string | null;
  summary: string | null;
  statement: string | null;
  mission: string | null;
  vision: string | null;
  createdAt: Date;
  updatedAt: Date;
  education?: Array<{
    id: string;
    profileId: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate: Date | null;
    isCurrent: boolean;
    grade: string | null;
    description: string | null;
  }>;
  experience?: Array<{
    id: string;
    profileId: string;
    positionTitle: string;
    organization: string;
    location: string | null;
    startDate: Date;
    endDate: Date | null;
    isCurrent: boolean;
    description: string | null;
  }>;
  interests?: Array<{
    id: string;
    profileId: string;
    name: string;
    category: string | null;
  }>;
  skills?: Array<{
    id: string;
    profileId: string;
    name: string;
    category: string;
    proficiencyLevel: string | null;
  }>;
  externalProfiles?: Array<{
    id: string;
    profileId: string;
    provider: string;
    url: string;
    externalIdentifier: string | null;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
  portfolioAssets?: Array<{
    id: string;
    profileId: string;
    title: string;
    assetType: string;
    fileUrl: string;
    mimeType: string;
    fileSizeBytes: number;
    uploadedAt: Date;
  }>;
}

export class ResearchProfilePersistenceMapper {
  public static toDomain(raw: PrismaResearchProfileFull): ResearchProfile {
    const rawEducation = raw.education !== undefined && raw.education !== null ? raw.education : [];
    const educationEntities = rawEducation.map((e) => {
      const instRes = InstitutionName.create(e.institution).value;
      const degRes = DegreeName.create(e.degree).value;
      const periodRes = AcademicPeriod.create(e.startDate, e.endDate, e.isCurrent).value;

      return Education.create(
        {
          institution: instRes,
          degree: degRes,
          fieldOfStudy: e.fieldOfStudy,
          period: periodRes,
          grade: e.grade ?? undefined,
          description: e.description ?? undefined,
        },
        EducationId.from(e.id),
      ).value;
    });

    const rawExperience =
      raw.experience !== undefined && raw.experience !== null ? raw.experience : [];
    const experienceEntities = rawExperience.map((exp) => {
      const periodRes = AcademicPeriod.create(exp.startDate, exp.endDate, exp.isCurrent).value;

      return ProfessionalExperience.create(
        {
          positionTitle: exp.positionTitle,
          organization: exp.organization,
          location: exp.location ?? undefined,
          period: periodRes,
          description: exp.description ?? undefined,
        },
        ExperienceId.from(exp.id),
      ).value;
    });

    const rawInterests = raw.interests !== undefined && raw.interests !== null ? raw.interests : [];
    const interestEntities = rawInterests.map((i) => {
      const nameRes = ResearchInterestName.create(i.name).value;
      return ResearchInterest.create(
        {
          name: nameRes,
          category: i.category ?? undefined,
        },
        ResearchInterestId.from(i.id),
      ).value;
    });

    const rawSkills = raw.skills !== undefined && raw.skills !== null ? raw.skills : [];
    const skillEntities = rawSkills.map((s) => {
      const nameRes = SkillName.create(s.name).value;
      return Skill.create(
        {
          name: nameRes,
          category: s.category as SkillCategoryType,
          proficiencyLevel: s.proficiencyLevel ?? undefined,
        },
        SkillId.from(s.id),
      ).value;
    });

    const rawExternalProfiles =
      raw.externalProfiles !== undefined && raw.externalProfiles !== null
        ? raw.externalProfiles
        : [];
    const externalProfileEntities = rawExternalProfiles.map((p) => {
      const urlRes = ExternalProfileUrl.create(p.url).value;
      return ExternalProfile.create(
        {
          provider: p.provider as ProfileProviderType,
          profileUrl: urlRes,
          externalIdentifier: p.externalIdentifier ?? undefined,
          isVerified: p.isVerified,
        },
        ExternalProfileId.from(p.id),
      ).value;
    });

    const rawPortfolioAssets =
      raw.portfolioAssets !== undefined && raw.portfolioAssets !== null ? raw.portfolioAssets : [];
    const assetEntities = rawPortfolioAssets.map((a) => {
      return PortfolioAsset.create(
        {
          title: a.title,
          assetType: a.assetType as AssetTypeType,
          fileUrl: a.fileUrl,
          mimeType: a.mimeType,
          fileSizeBytes: a.fileSizeBytes,
        },
        PortfolioAssetId.from(a.id),
      ).value;
    });

    return ResearchProfile.reconstruct(
      {
        userId: UniqueId.from(raw.userId),
        title: raw.title,
        headline:
          typeof raw.headline === 'string' && raw.headline.length > 0
            ? AcademicHeadline.create(raw.headline).value
            : undefined,
        biography:
          typeof raw.biography === 'string' && raw.biography.length > 0
            ? Biography.create(raw.biography).value
            : undefined,
        summary:
          typeof raw.summary === 'string' && raw.summary.length > 0
            ? AcademicSummary.create(raw.summary).value
            : undefined,
        statement:
          typeof raw.statement === 'string' && raw.statement.length > 0
            ? ResearchStatement.create(raw.statement).value
            : undefined,
        mission:
          typeof raw.mission === 'string' && raw.mission.length > 0
            ? Mission.create(raw.mission).value
            : undefined,
        vision:
          typeof raw.vision === 'string' && raw.vision.length > 0
            ? Vision.create(raw.vision).value
            : undefined,
        education: educationEntities,
        experience: experienceEntities,
        interests: interestEntities,
        skills: skillEntities,
        externalProfiles: externalProfileEntities,
        portfolioAssets: assetEntities,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      ResearchProfileId.from(raw.id),
    );
  }
}

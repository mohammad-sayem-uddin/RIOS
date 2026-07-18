/**
 * Research Profile Application Service
 * Coordinates CQRS operations for Research Profiles
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
  IResearchProfileRepository,
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
} from '@rios/domain';
import { Result, UniqueId } from '@rios/shared';

import { ResearchProfileDto } from '../dto/index.js';
import { ResearchProfileMapper } from '../mappers/research-profile-mapper.js';

export interface CreateProfileCommandInput {
  userId: string;
  title: string;
  headline?: string;
  biography?: string;
  summary?: string;
  statement?: string;
}

export interface AddEducationInput {
  profileId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date | null;
  isCurrent?: boolean;
  grade?: string;
  description?: string;
}

export interface AddExperienceInput {
  profileId: string;
  positionTitle: string;
  organization: string;
  location?: string;
  startDate: Date;
  endDate?: Date | null;
  isCurrent?: boolean;
  description?: string;
}

export interface AddResearchInterestInput {
  profileId: string;
  name: string;
  category?: string;
}

export interface AddSkillInput {
  profileId: string;
  name: string;
  category: SkillCategoryType;
  proficiencyLevel?: string;
}

export interface AddExternalProfileInput {
  profileId: string;
  provider: ProfileProviderType;
  url: string;
  externalIdentifier?: string;
}

export interface UploadPortfolioAssetInput {
  profileId: string;
  title: string;
  assetType: AssetTypeType;
  fileUrl: string;
  mimeType: string;
  fileSizeBytes: number;
}

export class ResearchProfileApplicationService {
  constructor(private readonly profileRepository: IResearchProfileRepository) {}

  public async createProfile(
    input: CreateProfileCommandInput,
  ): Promise<Result<ResearchProfileDto>> {
    const existing = await this.profileRepository.findByUserId(UniqueId.from(input.userId));
    if (existing !== null) {
      return Result.fail('Research Profile already exists for this user');
    }

    let headline: AcademicHeadline | undefined;
    if (typeof input.headline === 'string' && input.headline.length > 0) {
      const headlineRes = AcademicHeadline.create(input.headline);
      if (headlineRes.isFailure) return Result.fail(headlineRes.error);
      headline = headlineRes.value;
    }

    let biography: Biography | undefined;
    if (typeof input.biography === 'string' && input.biography.length > 0) {
      const bioRes = Biography.create(input.biography);
      if (bioRes.isFailure) return Result.fail(bioRes.error);
      biography = bioRes.value;
    }

    let summary: AcademicSummary | undefined;
    if (typeof input.summary === 'string' && input.summary.length > 0) {
      const sumRes = AcademicSummary.create(input.summary);
      if (sumRes.isFailure) return Result.fail(sumRes.error);
      summary = sumRes.value;
    }

    let statement: ResearchStatement | undefined;
    if (typeof input.statement === 'string' && input.statement.length > 0) {
      const stateRes = ResearchStatement.create(input.statement);
      if (stateRes.isFailure) return Result.fail(stateRes.error);
      statement = stateRes.value;
    }

    const createRes = ResearchProfile.create({
      userId: UniqueId.from(input.userId),
      title: input.title,
      headline,
      biography,
      summary,
      statement,
    });

    if (createRes.isFailure) {
      return Result.fail(createRes.error);
    }

    const profile = createRes.value;
    await this.profileRepository.save(profile);

    return Result.ok(ResearchProfileMapper.toDto(profile));
  }

  public async getProfileById(id: string): Promise<Result<ResearchProfileDto>> {
    const profileIdRes = UniqueId.from(id);
    const profile = await this.profileRepository.findById(
      ResearchProfileId.fromUniqueId(profileIdRes),
    );

    if (profile === null) {
      return Result.fail('Research Profile not found');
    }

    return Result.ok(ResearchProfileMapper.toDto(profile));
  }

  public async getProfileByUserId(userId: string): Promise<Result<ResearchProfileDto>> {
    const profile = await this.profileRepository.findByUserId(UniqueId.from(userId));

    if (profile === null) {
      return Result.fail('Research Profile not found for this user');
    }

    return Result.ok(ResearchProfileMapper.toDto(profile));
  }

  public async updateBiography(
    id: string,
    biographyText: string,
  ): Promise<Result<ResearchProfileDto>> {
    const profileIdRes = UniqueId.from(id);
    const profile = await this.profileRepository.findById(
      ResearchProfileId.fromUniqueId(profileIdRes),
    );

    if (profile === null) {
      return Result.fail('Research Profile not found');
    }

    const bioRes = Biography.create(biographyText);
    if (bioRes.isFailure) {
      return Result.fail(bioRes.error);
    }

    const updateRes = profile.updateBiography(bioRes.value);
    if (updateRes.isFailure) {
      return Result.fail(updateRes.error);
    }

    await this.profileRepository.save(profile);
    return Result.ok(ResearchProfileMapper.toDto(profile));
  }

  public async addEducation(input: AddEducationInput): Promise<Result<ResearchProfileDto>> {
    const profileIdRes = UniqueId.from(input.profileId);
    const profile = await this.profileRepository.findById(
      ResearchProfileId.fromUniqueId(profileIdRes),
    );

    if (profile === null) {
      return Result.fail('Research Profile not found');
    }

    const instRes = InstitutionName.create(input.institution);
    if (instRes.isFailure) return Result.fail(instRes.error);

    const degRes = DegreeName.create(input.degree);
    if (degRes.isFailure) return Result.fail(degRes.error);

    const periodRes = AcademicPeriod.create(
      input.startDate,
      input.endDate ?? null,
      input.isCurrent ?? false,
    );
    if (periodRes.isFailure) return Result.fail(periodRes.error);

    const eduRes = Education.create({
      institution: instRes.value,
      degree: degRes.value,
      fieldOfStudy: input.fieldOfStudy,
      period: periodRes.value,
      grade: input.grade,
      description: input.description,
    });

    if (eduRes.isFailure) return Result.fail(eduRes.error);

    const addRes = profile.addEducation(eduRes.value);
    if (addRes.isFailure) return Result.fail(addRes.error);

    await this.profileRepository.save(profile);
    return Result.ok(ResearchProfileMapper.toDto(profile));
  }

  public async removeEducation(
    profileId: string,
    educationId: string,
  ): Promise<Result<ResearchProfileDto>> {
    const profileIdRes = UniqueId.from(profileId);
    const profile = await this.profileRepository.findById(
      ResearchProfileId.fromUniqueId(profileIdRes),
    );

    if (profile === null) {
      return Result.fail('Research Profile not found');
    }

    const eduId = EducationId.fromUniqueId(UniqueId.from(educationId));
    const removeRes = profile.removeEducation(eduId);
    if (removeRes.isFailure) return Result.fail(removeRes.error);

    await this.profileRepository.save(profile);
    return Result.ok(ResearchProfileMapper.toDto(profile));
  }

  public async addExperience(input: AddExperienceInput): Promise<Result<ResearchProfileDto>> {
    const profileIdRes = UniqueId.from(input.profileId);
    const profile = await this.profileRepository.findById(
      ResearchProfileId.fromUniqueId(profileIdRes),
    );

    if (profile === null) {
      return Result.fail('Research Profile not found');
    }

    const periodRes = AcademicPeriod.create(
      input.startDate,
      input.endDate ?? null,
      input.isCurrent ?? false,
    );
    if (periodRes.isFailure) return Result.fail(periodRes.error);

    const expRes = ProfessionalExperience.create({
      positionTitle: input.positionTitle,
      organization: input.organization,
      location: input.location,
      period: periodRes.value,
      description: input.description,
    });

    if (expRes.isFailure) return Result.fail(expRes.error);

    const addRes = profile.addExperience(expRes.value);
    if (addRes.isFailure) return Result.fail(addRes.error);

    await this.profileRepository.save(profile);
    return Result.ok(ResearchProfileMapper.toDto(profile));
  }

  public async removeExperience(
    profileId: string,
    experienceId: string,
  ): Promise<Result<ResearchProfileDto>> {
    const profileIdRes = UniqueId.from(profileId);
    const profile = await this.profileRepository.findById(
      ResearchProfileId.fromUniqueId(profileIdRes),
    );

    if (profile === null) {
      return Result.fail('Research Profile not found');
    }

    const expId = ExperienceId.fromUniqueId(UniqueId.from(experienceId));
    const removeRes = profile.removeExperience(expId);
    if (removeRes.isFailure) return Result.fail(removeRes.error);

    await this.profileRepository.save(profile);
    return Result.ok(ResearchProfileMapper.toDto(profile));
  }

  public async addResearchInterest(
    input: AddResearchInterestInput,
  ): Promise<Result<ResearchProfileDto>> {
    const profileIdRes = UniqueId.from(input.profileId);
    const profile = await this.profileRepository.findById(
      ResearchProfileId.fromUniqueId(profileIdRes),
    );

    if (profile === null) {
      return Result.fail('Research Profile not found');
    }

    const nameRes = ResearchInterestName.create(input.name);
    if (nameRes.isFailure) return Result.fail(nameRes.error);

    const interestRes = ResearchInterest.create({
      name: nameRes.value,
      category: input.category,
    });

    if (interestRes.isFailure) return Result.fail(interestRes.error);

    const addRes = profile.addResearchInterest(interestRes.value);
    if (addRes.isFailure) return Result.fail(addRes.error);

    await this.profileRepository.save(profile);
    return Result.ok(ResearchProfileMapper.toDto(profile));
  }

  public async removeResearchInterest(
    profileId: string,
    interestId: string,
  ): Promise<Result<ResearchProfileDto>> {
    const profileIdRes = UniqueId.from(profileId);
    const profile = await this.profileRepository.findById(
      ResearchProfileId.fromUniqueId(profileIdRes),
    );

    if (profile === null) {
      return Result.fail('Research Profile not found');
    }

    const intId = ResearchInterestId.fromUniqueId(UniqueId.from(interestId));
    const removeRes = profile.removeResearchInterest(intId);
    if (removeRes.isFailure) return Result.fail(removeRes.error);

    await this.profileRepository.save(profile);
    return Result.ok(ResearchProfileMapper.toDto(profile));
  }

  public async addSkill(input: AddSkillInput): Promise<Result<ResearchProfileDto>> {
    const profileIdRes = UniqueId.from(input.profileId);
    const profile = await this.profileRepository.findById(
      ResearchProfileId.fromUniqueId(profileIdRes),
    );

    if (profile === null) {
      return Result.fail('Research Profile not found');
    }

    const nameRes = SkillName.create(input.name);
    if (nameRes.isFailure) return Result.fail(nameRes.error);

    const skillRes = Skill.create({
      name: nameRes.value,
      category: input.category,
      proficiencyLevel: input.proficiencyLevel,
    });

    if (skillRes.isFailure) return Result.fail(skillRes.error);

    const addRes = profile.addSkill(skillRes.value);
    if (addRes.isFailure) return Result.fail(addRes.error);

    await this.profileRepository.save(profile);
    return Result.ok(ResearchProfileMapper.toDto(profile));
  }

  public async removeSkill(
    profileId: string,
    skillId: string,
  ): Promise<Result<ResearchProfileDto>> {
    const profileIdRes = UniqueId.from(profileId);
    const profile = await this.profileRepository.findById(
      ResearchProfileId.fromUniqueId(profileIdRes),
    );

    if (profile === null) {
      return Result.fail('Research Profile not found');
    }

    const skId = SkillId.fromUniqueId(UniqueId.from(skillId));
    const removeRes = profile.removeSkill(skId);
    if (removeRes.isFailure) return Result.fail(removeRes.error);

    await this.profileRepository.save(profile);
    return Result.ok(ResearchProfileMapper.toDto(profile));
  }

  public async addExternalProfile(
    input: AddExternalProfileInput,
  ): Promise<Result<ResearchProfileDto>> {
    const profileIdRes = UniqueId.from(input.profileId);
    const profile = await this.profileRepository.findById(
      ResearchProfileId.fromUniqueId(profileIdRes),
    );

    if (profile === null) {
      return Result.fail('Research Profile not found');
    }

    const urlRes = ExternalProfileUrl.create(input.url);
    if (urlRes.isFailure) return Result.fail(urlRes.error);

    const extRes = ExternalProfile.create({
      provider: input.provider,
      profileUrl: urlRes.value,
      externalIdentifier: input.externalIdentifier,
    });

    if (extRes.isFailure) return Result.fail(extRes.error);

    const addRes = profile.addExternalProfile(extRes.value);
    if (addRes.isFailure) return Result.fail(addRes.error);

    await this.profileRepository.save(profile);
    return Result.ok(ResearchProfileMapper.toDto(profile));
  }

  public async removeExternalProfile(
    profileId: string,
    externalProfileId: string,
  ): Promise<Result<ResearchProfileDto>> {
    const profileIdRes = UniqueId.from(profileId);
    const profile = await this.profileRepository.findById(
      ResearchProfileId.fromUniqueId(profileIdRes),
    );

    if (profile === null) {
      return Result.fail('Research Profile not found');
    }

    const extId = ExternalProfileId.fromUniqueId(UniqueId.from(externalProfileId));
    const removeRes = profile.removeExternalProfile(extId);
    if (removeRes.isFailure) return Result.fail(removeRes.error);

    await this.profileRepository.save(profile);
    return Result.ok(ResearchProfileMapper.toDto(profile));
  }

  public async uploadPortfolioAsset(
    input: UploadPortfolioAssetInput,
  ): Promise<Result<ResearchProfileDto>> {
    const profileIdRes = UniqueId.from(input.profileId);
    const profile = await this.profileRepository.findById(
      ResearchProfileId.fromUniqueId(profileIdRes),
    );

    if (profile === null) {
      return Result.fail('Research Profile not found');
    }

    const assetRes = PortfolioAsset.create({
      title: input.title,
      assetType: input.assetType,
      fileUrl: input.fileUrl,
      mimeType: input.mimeType,
      fileSizeBytes: input.fileSizeBytes,
    });

    if (assetRes.isFailure) return Result.fail(assetRes.error);

    const addRes = profile.uploadPortfolioAsset(assetRes.value);
    if (addRes.isFailure) return Result.fail(addRes.error);

    await this.profileRepository.save(profile);
    return Result.ok(ResearchProfileMapper.toDto(profile));
  }

  public async removePortfolioAsset(
    profileId: string,
    assetId: string,
  ): Promise<Result<ResearchProfileDto>> {
    const profileIdRes = UniqueId.from(profileId);
    const profile = await this.profileRepository.findById(
      ResearchProfileId.fromUniqueId(profileIdRes),
    );

    if (profile === null) {
      return Result.fail('Research Profile not found');
    }

    const astId = PortfolioAssetId.fromUniqueId(UniqueId.from(assetId));
    const removeRes = profile.removePortfolioAsset(astId);
    if (removeRes.isFailure) return Result.fail(removeRes.error);

    await this.profileRepository.save(profile);
    return Result.ok(ResearchProfileMapper.toDto(profile));
  }
}

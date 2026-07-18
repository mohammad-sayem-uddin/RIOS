/**
 * ResearchProfile Aggregate Root
 *
 * Central aggregate root of the Research Identity Bounded Context.
 * Enforces consistency invariants across all child research entities.
 */

import { AggregateRoot, Result, UniqueId } from '@rios/shared';

import { Education } from '../entities/education.js';
import { ExternalProfile } from '../entities/external-profile.js';
import { PortfolioAsset } from '../entities/portfolio-asset.js';
import { ProfessionalExperience } from '../entities/professional-experience.js';
import { ResearchInterest } from '../entities/research-interest.js';
import { Skill } from '../entities/skill.js';
import {
  DuplicateEducationError,
  DuplicateExternalProfileError,
  DuplicateInterestError,
  DuplicateSkillError,
} from '../errors/research-identity-errors.js';
import {
  AcademicSummaryUpdated,
  BiographyUpdated,
  EducationAdded,
  EducationRemoved,
  EducationUpdated,
  ExperienceAdded,
  ExperienceRemoved,
  ExperienceUpdated,
  ExternalProfileAdded,
  ExternalProfileRemoved,
  ExternalProfileUpdated,
  MissionUpdated,
  PortfolioAssetRemoved,
  PortfolioAssetUploaded,
  ResearchInterestAdded,
  ResearchInterestRemoved,
  ResearchProfileCreated,
  ResearchStatementUpdated,
  SkillAdded,
  SkillRemoved,
  VisionUpdated,
} from '../events/research-identity-events.js';
import {
  AcademicHeadline,
  AcademicSummary,
  Biography,
  EducationId,
  ExperienceId,
  ExternalProfileId,
  Mission,
  PortfolioAssetId,
  ResearchInterestId,
  ResearchProfileId,
  ResearchStatement,
  SkillId,
  Vision,
} from '../value-objects/research-identity-value-objects.js';

export interface ResearchProfileProps {
  userId: UniqueId;
  title: string;
  headline?: AcademicHeadline;
  biography?: Biography;
  summary?: AcademicSummary;
  statement?: ResearchStatement;
  mission?: Mission;
  vision?: Vision;
  education: Education[];
  experience: ProfessionalExperience[];
  interests: ResearchInterest[];
  skills: Skill[];
  externalProfiles: ExternalProfile[];
  portfolioAssets: PortfolioAsset[];
  createdAt: Date;
  updatedAt: Date;
}

export class ResearchProfile extends AggregateRoot<ResearchProfileProps> {
  private constructor(props: ResearchProfileProps, id: UniqueId) {
    super(props, id);
  }

  public get userId(): UniqueId {
    return this.props.userId;
  }

  public get title(): string {
    return this.props.title;
  }

  public get headline(): AcademicHeadline | undefined {
    return this.props.headline;
  }

  public get biography(): Biography | undefined {
    return this.props.biography;
  }

  public get summary(): AcademicSummary | undefined {
    return this.props.summary;
  }

  public get statement(): ResearchStatement | undefined {
    return this.props.statement;
  }

  public get mission(): Mission | undefined {
    return this.props.mission;
  }

  public get vision(): Vision | undefined {
    return this.props.vision;
  }

  public get education(): readonly Education[] {
    return [...this.props.education];
  }

  public get experience(): readonly ProfessionalExperience[] {
    return [...this.props.experience];
  }

  public get interests(): readonly ResearchInterest[] {
    return [...this.props.interests];
  }

  public get skills(): readonly Skill[] {
    return [...this.props.skills];
  }

  public get externalProfiles(): readonly ExternalProfile[] {
    return [...this.props.externalProfiles];
  }

  public get portfolioAssets(): readonly PortfolioAsset[] {
    return [...this.props.portfolioAssets];
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public static create(
    props: {
      userId: UniqueId;
      title: string;
      headline?: AcademicHeadline;
      biography?: Biography;
      summary?: AcademicSummary;
      statement?: ResearchStatement;
    },
    id?: UniqueId,
  ): Result<ResearchProfile> {
    if (props.userId === null || props.userId === undefined) {
      return Result.fail('UserId is required for ResearchProfile');
    }
    if (typeof props.title !== 'string' || props.title.trim().length === 0) {
      return Result.fail('Title is required for ResearchProfile');
    }

    const profileId = id ?? ResearchProfileId.create();
    const now = new Date();

    const profile = new ResearchProfile(
      {
        userId: props.userId,
        title: props.title.trim(),
        headline: props.headline,
        biography: props.biography,
        summary: props.summary,
        statement: props.statement,
        education: [],
        experience: [],
        interests: [],
        skills: [],
        externalProfiles: [],
        portfolioAssets: [],
        createdAt: now,
        updatedAt: now,
      },
      profileId,
    );

    profile.addDomainEvent(
      new ResearchProfileCreated(profileId.value, props.userId.value, props.title.trim()),
    );
    return Result.ok(profile);
  }

  public static reconstruct(props: ResearchProfileProps, id: UniqueId): ResearchProfile {
    return new ResearchProfile(props, id);
  }

  // --- Aggregate Operations ---

  public updateBiography(biography: Biography): Result<void> {
    this.props.biography = biography;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new BiographyUpdated(this._id.value, biography.value));
    return Result.ok(undefined);
  }

  public updateHeadline(headline: AcademicHeadline): Result<void> {
    this.props.headline = headline;
    this.props.updatedAt = new Date();
    return Result.ok(undefined);
  }

  public updateSummary(summary: AcademicSummary): Result<void> {
    this.props.summary = summary;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new AcademicSummaryUpdated(this._id.value, summary.value));
    return Result.ok(undefined);
  }

  public updateStatement(statement: ResearchStatement): Result<void> {
    this.props.statement = statement;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new ResearchStatementUpdated(this._id.value, statement.value));
    return Result.ok(undefined);
  }

  public updateMission(mission: Mission): Result<void> {
    this.props.mission = mission;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new MissionUpdated(this._id.value, mission.value));
    return Result.ok(undefined);
  }

  public updateVision(vision: Vision): Result<void> {
    this.props.vision = vision;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new VisionUpdated(this._id.value, vision.value));
    return Result.ok(undefined);
  }

  // --- Education ---
  public addEducation(education: Education): Result<void> {
    const isDuplicate = this.props.education.some(
      (e) =>
        e.institution.value.toLowerCase() === education.institution.value.toLowerCase() &&
        e.degree.value.toLowerCase() === education.degree.value.toLowerCase() &&
        e.fieldOfStudy.toLowerCase() === education.fieldOfStudy.toLowerCase(),
    );

    if (isDuplicate) {
      return Result.fail(
        new DuplicateEducationError(education.degree.value, education.institution.value).message,
      );
    }

    this.props.education.push(education);
    this.props.updatedAt = new Date();
    this.addDomainEvent(
      new EducationAdded(
        this._id.value,
        education.id.value,
        education.institution.value,
        education.degree.value,
      ),
    );
    return Result.ok(undefined);
  }

  public updateEducation(education: Education): Result<void> {
    const index = this.props.education.findIndex((e) => e.id.equals(education.id));
    if (index === -1) {
      return Result.fail(`Education with ID ${education.id.value} not found`);
    }
    this.props.education[index] = education;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new EducationUpdated(this._id.value, education.id.value));
    return Result.ok(undefined);
  }

  public removeEducation(educationId: EducationId): Result<void> {
    const index = this.props.education.findIndex((e) => e.id.equals(educationId));
    if (index === -1) {
      return Result.fail(`Education with ID ${educationId.value} not found`);
    }
    this.props.education.splice(index, 1);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new EducationRemoved(this._id.value, educationId.value));
    return Result.ok(undefined);
  }

  // --- Professional Experience ---
  public addExperience(experience: ProfessionalExperience): Result<void> {
    this.props.experience.push(experience);
    this.props.updatedAt = new Date();
    this.addDomainEvent(
      new ExperienceAdded(
        this._id.value,
        experience.id.value,
        experience.positionTitle,
        experience.organization,
      ),
    );
    return Result.ok(undefined);
  }

  public updateExperience(experience: ProfessionalExperience): Result<void> {
    const index = this.props.experience.findIndex((e) => e.id.equals(experience.id));
    if (index === -1) {
      return Result.fail(`Experience with ID ${experience.id.value} not found`);
    }
    this.props.experience[index] = experience;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new ExperienceUpdated(this._id.value, experience.id.value));
    return Result.ok(undefined);
  }

  public removeExperience(experienceId: ExperienceId): Result<void> {
    const index = this.props.experience.findIndex((e) => e.id.equals(experienceId));
    if (index === -1) {
      return Result.fail(`Experience with ID ${experienceId.value} not found`);
    }
    this.props.experience.splice(index, 1);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new ExperienceRemoved(this._id.value, experienceId.value));
    return Result.ok(undefined);
  }

  // --- Research Interests ---
  public addResearchInterest(interest: ResearchInterest): Result<void> {
    const exists = this.props.interests.some(
      (i) => i.name.value.toLowerCase() === interest.name.value.toLowerCase(),
    );
    if (exists) {
      return Result.fail(new DuplicateInterestError(interest.name.value).message);
    }
    this.props.interests.push(interest);
    this.props.updatedAt = new Date();
    this.addDomainEvent(
      new ResearchInterestAdded(this._id.value, interest.id.value, interest.name.value),
    );
    return Result.ok(undefined);
  }

  public removeResearchInterest(interestId: ResearchInterestId): Result<void> {
    const index = this.props.interests.findIndex((i) => i.id.equals(interestId));
    if (index === -1) {
      return Result.fail(`Research interest with ID ${interestId.value} not found`);
    }
    this.props.interests.splice(index, 1);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new ResearchInterestRemoved(this._id.value, interestId.value));
    return Result.ok(undefined);
  }

  // --- Skills ---
  public addSkill(skill: Skill): Result<void> {
    const exists = this.props.skills.some(
      (s) => s.name.value.toLowerCase() === skill.name.value.toLowerCase(),
    );
    if (exists) {
      return Result.fail(new DuplicateSkillError(skill.name.value).message);
    }
    this.props.skills.push(skill);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new SkillAdded(this._id.value, skill.id.value, skill.name.value));
    return Result.ok(undefined);
  }

  public removeSkill(skillId: SkillId): Result<void> {
    const index = this.props.skills.findIndex((s) => s.id.equals(skillId));
    if (index === -1) {
      return Result.fail(`Skill with ID ${skillId.value} not found`);
    }
    this.props.skills.splice(index, 1);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new SkillRemoved(this._id.value, skillId.value));
    return Result.ok(undefined);
  }

  // --- External Profiles ---
  public addExternalProfile(profile: ExternalProfile): Result<void> {
    const exists = this.props.externalProfiles.some((p) => p.provider === profile.provider);
    if (exists) {
      return Result.fail(new DuplicateExternalProfileError(profile.provider).message);
    }
    this.props.externalProfiles.push(profile);
    this.props.updatedAt = new Date();
    this.addDomainEvent(
      new ExternalProfileAdded(
        this._id.value,
        profile.id.value,
        profile.provider,
        profile.profileUrl.url,
      ),
    );
    return Result.ok(undefined);
  }

  public updateExternalProfile(
    profileId: ExternalProfileId,
    url: Parameters<ExternalProfile['updateUrl']>[0],
  ): Result<void> {
    const target = this.props.externalProfiles.find((p) => p.id.equals(profileId));
    if (!target) {
      return Result.fail(`External Profile with ID ${profileId.value} not found`);
    }
    target.updateUrl(url);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new ExternalProfileUpdated(this._id.value, profileId.value));
    return Result.ok(undefined);
  }

  public removeExternalProfile(profileId: ExternalProfileId): Result<void> {
    const index = this.props.externalProfiles.findIndex((p) => p.id.equals(profileId));
    if (index === -1) {
      return Result.fail(`External Profile with ID ${profileId.value} not found`);
    }
    this.props.externalProfiles.splice(index, 1);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new ExternalProfileRemoved(this._id.value, profileId.value));
    return Result.ok(undefined);
  }

  // --- Portfolio Assets ---
  public uploadPortfolioAsset(asset: PortfolioAsset): Result<void> {
    this.props.portfolioAssets.push(asset);
    this.props.updatedAt = new Date();
    this.addDomainEvent(
      new PortfolioAssetUploaded(this._id.value, asset.id.value, asset.title, asset.fileUrl),
    );
    return Result.ok(undefined);
  }

  public removePortfolioAsset(assetId: PortfolioAssetId): Result<void> {
    const index = this.props.portfolioAssets.findIndex((a) => a.id.equals(assetId));
    if (index === -1) {
      return Result.fail(`Portfolio Asset with ID ${assetId.value} not found`);
    }
    this.props.portfolioAssets.splice(index, 1);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new PortfolioAssetRemoved(this._id.value, assetId.value));
    return Result.ok(undefined);
  }
}

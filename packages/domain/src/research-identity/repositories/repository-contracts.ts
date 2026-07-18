/**
 * Research Identity Repository Contracts
 */

import { Repository, UniqueId } from '@rios/shared';

import { ResearchProfile } from '../aggregates/research-profile.js';
import { Education } from '../entities/education.js';
import { ExternalProfile } from '../entities/external-profile.js';
import { PortfolioAsset } from '../entities/portfolio-asset.js';
import { ProfessionalExperience } from '../entities/professional-experience.js';
import { ResearchInterest } from '../entities/research-interest.js';
import { Skill } from '../entities/skill.js';
import {
  EducationId,
  ExperienceId,
  ExternalProfileId,
  PortfolioAssetId,
  ResearchInterestId,
  ResearchProfileId,
  SkillId,
} from '../value-objects/research-identity-value-objects.js';

export interface IResearchProfileRepository extends Repository<ResearchProfile> {
  findById(id: ResearchProfileId): Promise<ResearchProfile | null>;
  findByUserId(userId: UniqueId): Promise<ResearchProfile | null>;
  save(profile: ResearchProfile): Promise<void>;
  delete(id: ResearchProfileId): Promise<void>;
}

export interface IEducationRepository {
  findByProfileId(profileId: ResearchProfileId): Promise<Education[]>;
  findById(id: EducationId): Promise<Education | null>;
}

export interface IExperienceRepository {
  findByProfileId(profileId: ResearchProfileId): Promise<ProfessionalExperience[]>;
  findById(id: ExperienceId): Promise<ProfessionalExperience | null>;
}

export interface IResearchInterestRepository {
  findByProfileId(profileId: ResearchProfileId): Promise<ResearchInterest[]>;
  findById(id: ResearchInterestId): Promise<ResearchInterest | null>;
}

export interface ISkillRepository {
  findByProfileId(profileId: ResearchProfileId): Promise<Skill[]>;
  findById(id: SkillId): Promise<Skill | null>;
}

export interface IExternalProfileRepository {
  findByProfileId(profileId: ResearchProfileId): Promise<ExternalProfile[]>;
  findById(id: ExternalProfileId): Promise<ExternalProfile | null>;
}

export interface IPortfolioAssetRepository {
  findByProfileId(profileId: ResearchProfileId): Promise<PortfolioAsset[]>;
  findById(id: PortfolioAssetId): Promise<PortfolioAsset | null>;
}

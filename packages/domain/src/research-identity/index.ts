/**
 * Research Identity Bounded Context - Domain Layer Exports
 */

// Aggregates
export { ResearchProfile, type ResearchProfileProps } from './aggregates/research-profile.js';

// Entities
export { Education, type EducationProps } from './entities/education.js';
export {
  ProfessionalExperience,
  type ProfessionalExperienceProps,
} from './entities/professional-experience.js';
export { ResearchInterest, type ResearchInterestProps } from './entities/research-interest.js';
export { Skill, SkillCategory, type SkillCategoryType, type SkillProps } from './entities/skill.js';
export {
  ExternalProfile,
  ProfileProvider,
  type ProfileProviderType,
  type ExternalProfileProps,
} from './entities/external-profile.js';
export {
  PortfolioAsset,
  AssetType,
  type AssetTypeType,
  type PortfolioAssetProps,
} from './entities/portfolio-asset.js';

// Value Objects
export {
  ResearchProfileId,
  EducationId,
  ExperienceId,
  ResearchInterestId,
  SkillId,
  ExternalProfileId,
  PortfolioAssetId,
  Biography,
  AcademicHeadline,
  AcademicSummary,
  ResearchStatement,
  Mission,
  Vision,
  InstitutionName,
  DegreeName,
  SkillName,
  ResearchInterestName,
  ExternalProfileUrl,
  AcademicPeriod,
} from './value-objects/research-identity-value-objects.js';

// Errors
export {
  ResearchIdentityDomainError,
  ProfileNotFoundError,
  DuplicateEducationError,
  DuplicateSkillError,
  DuplicateInterestError,
  DuplicateExternalProfileError,
  InvalidAssetError,
} from './errors/research-identity-errors.js';

// Events
export {
  ResearchProfileCreated,
  BiographyUpdated,
  AcademicSummaryUpdated,
  ResearchStatementUpdated,
  EducationAdded,
  EducationUpdated,
  EducationRemoved,
  ExperienceAdded,
  ExperienceUpdated,
  ExperienceRemoved,
  ResearchInterestAdded,
  ResearchInterestRemoved,
  SkillAdded,
  SkillRemoved,
  ExternalProfileAdded,
  ExternalProfileUpdated,
  ExternalProfileRemoved,
  PortfolioAssetUploaded,
  PortfolioAssetRemoved,
} from './events/research-identity-events.js';

// Services
export {
  ProfileCompletenessEvaluator,
  type CompletenessReport,
} from './services/profile-completeness-evaluator.js';

// Repositories
export type {
  IResearchProfileRepository,
  IEducationRepository,
  IExperienceRepository,
  IResearchInterestRepository,
  ISkillRepository,
  IExternalProfileRepository,
  IPortfolioAssetRepository,
} from './repositories/repository-contracts.js';

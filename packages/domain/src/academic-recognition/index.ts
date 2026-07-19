/**
 * @rios/domain — Academic Recognition Bounded Context
 */

export {
  AwardId,
  GrantId,
  PatentId,
  ActivityId,
  AwardTitle,
  GrantNumber,
  PatentNumber,
  PatentStatusType,
  PatentStatus,
  PatentTypeEnum,
  PatentType,
  Currency,
  FundingAmount,
  OrganizationName,
  ConferenceName,
  AwardCategoryType,
  AwardCategory,
  ProfessionalRole,
  ActivityDate,
  Country,
  ActivityCategoryType,
} from './value-objects/academic-recognition-value-objects.js';

export * from './errors/academic-recognition-errors.js';
export * from './events/academic-recognition-events.js';
export * from './aggregates/award.js';
export * from './aggregates/grant.js';
export * from './aggregates/patent.js';
export * from './aggregates/professional-activity.js';
export * from './repositories/academic-recognition-repository-contracts.js';

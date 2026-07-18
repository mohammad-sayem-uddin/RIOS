/**
 * Research Identity Domain Errors
 */

import { DomainError } from '@rios/shared';

export class ResearchIdentityDomainError extends DomainError {
  constructor(message: string) {
    super(message, 'RESEARCH_IDENTITY_DOMAIN_ERROR');
  }
}

export class ProfileNotFoundError extends DomainError {
  constructor(profileId: string) {
    super(`Research profile with ID ${profileId} was not found`, 'PROFILE_NOT_FOUND');
  }
}

export class DuplicateEducationError extends DomainError {
  constructor(degree: string, institution: string) {
    super(`Education record for ${degree} at ${institution} already exists`, 'DUPLICATE_EDUCATION');
  }
}

export class DuplicateSkillError extends DomainError {
  constructor(skillName: string) {
    super(`Skill ${skillName} already exists in profile`, 'DUPLICATE_SKILL');
  }
}

export class DuplicateInterestError extends DomainError {
  constructor(interestName: string) {
    super(`Research interest ${interestName} already exists in profile`, 'DUPLICATE_INTEREST');
  }
}

export class DuplicateExternalProfileError extends DomainError {
  constructor(provider: string) {
    super(`External profile for provider ${provider} already exists`, 'DUPLICATE_EXTERNAL_PROFILE');
  }
}

export class InvalidAssetError extends DomainError {
  constructor(reason: string) {
    super(`Portfolio asset is invalid: ${reason}`, 'INVALID_ASSET');
  }
}

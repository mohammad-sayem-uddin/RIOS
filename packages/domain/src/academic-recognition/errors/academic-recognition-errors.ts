/**
 * Academic Recognition Domain Errors
 */

import { DomainError } from '@rios/shared';

export class DuplicateGrantNumberError extends DomainError {
  constructor(grantNumber: string) {
    super(
      `Grant number '${grantNumber}' is already registered in the system.`,
      'DUPLICATE_GRANT_NUMBER',
    );
    this.name = 'DuplicateGrantNumberError';
  }
}

export class DuplicatePatentNumberError extends DomainError {
  constructor(patentNumber: string) {
    super(
      `Patent number '${patentNumber}' is already registered in the system.`,
      'DUPLICATE_PATENT_NUMBER',
    );
    this.name = 'DuplicatePatentNumberError';
  }
}

export class InvalidFundingAmountError extends DomainError {
  constructor(amount: number) {
    super(`Funding amount cannot be negative: ${amount}`, 'INVALID_FUNDING_AMOUNT');
    this.name = 'InvalidFundingAmountError';
  }
}

export class InvalidGrantDateSequenceError extends DomainError {
  constructor(startDate: Date, endDate: Date) {
    super(
      `Grant end date (${endDate.toISOString()}) must occur after start date (${startDate.toISOString()}).`,
      'INVALID_GRANT_DATE_SEQUENCE',
    );
    this.name = 'InvalidGrantDateSequenceError';
  }
}

export class InvalidPatentStatusTransitionError extends DomainError {
  constructor(fromStatus: string, toStatus: string) {
    super(
      `Invalid patent status transition from '${fromStatus}' to '${toStatus}'.`,
      'INVALID_PATENT_STATUS_TRANSITION',
    );
    this.name = 'InvalidPatentStatusTransitionError';
  }
}

export class DuplicateMembershipError extends DomainError {
  constructor(organization: string, role: string) {
    super(
      `Duplicate professional membership: Role '${role}' at organization '${organization}' already exists.`,
      'DUPLICATE_MEMBERSHIP',
    );
    this.name = 'DuplicateMembershipError';
  }
}

export class KeynoteRequiresConferenceError extends DomainError {
  constructor() {
    super(
      'A keynote talk activity requires a valid conference name.',
      'KEYNOTE_REQUIRES_CONFERENCE',
    );
    this.name = 'KeynoteRequiresConferenceError';
  }
}

export class EditorialRequiresOrganizationError extends DomainError {
  constructor() {
    super(
      'An editorial membership activity requires a valid publishing organization or journal.',
      'EDITORIAL_REQUIRES_ORGANIZATION',
    );
    this.name = 'EditorialRequiresOrganizationError';
  }
}

export class AwardNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Award with ID '${id}' was not found.`, 'AWARD_NOT_FOUND');
    this.name = 'AwardNotFoundError';
  }
}

export class GrantNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Grant with ID '${id}' was not found.`, 'GRANT_NOT_FOUND');
    this.name = 'GrantNotFoundError';
  }
}

export class PatentNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Patent with ID '${id}' was not found.`, 'PATENT_NOT_FOUND');
    this.name = 'PatentNotFoundError';
  }
}

export class ActivityNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Professional activity with ID '${id}' was not found.`, 'ACTIVITY_NOT_FOUND');
    this.name = 'ActivityNotFoundError';
  }
}

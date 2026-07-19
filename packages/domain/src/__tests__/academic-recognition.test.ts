import { UniqueId } from '@rios/shared';
import { describe, expect, it } from 'vitest';

import {
  ActivityCategoryType,
  Award,
  AwardCategory,
  AwardCategoryType,
  AwardReceivedEvent,
  AwardTitle,
  Currency,
  FundingAmount,
  Grant,
  GrantAwardedEvent,
  GrantNumber,
  GrantStatus,
  InvalidGrantDateSequenceError,
  InvalidPatentStatusTransitionError,
  KeynoteRequiresConferenceError,
  OrganizationName,
  Patent,
  PatentFiledEvent,
  PatentNumber,
  PatentStatus,
  PatentStatusType,
  PatentType,
  PatentTypeEnum,
  ProfessionalActivity,
} from '../index.js';

describe('Academic Recognition Domain Unit Tests', () => {
  const profileId = UniqueId.create();

  describe('Value Objects', () => {
    it('should validate FundingAmount correctly', () => {
      const usd = Currency.from('USD');
      const amount = FundingAmount.create(150000, usd).value;
      expect(amount.amount).toBe(150000);
      expect(amount.toString()).toBe('150000 USD');

      const negative = FundingAmount.create(-100, usd);
      expect(negative.isFailure).toBe(true);
    });

    it('should validate PatentStatus transition correctly', () => {
      const applied = PatentStatus.create(PatentStatusType.APPLIED);
      expect(applied.canTransitionTo(PatentStatusType.PENDING)).toBe(true);
      expect(applied.canTransitionTo(PatentStatusType.EXPIRED)).toBe(false);
    });
  });

  describe('Award Aggregate', () => {
    it('should create award and emit AwardReceivedEvent', () => {
      const award = Award.create({
        profileId,
        title: AwardTitle.from('IEEE Outstanding Young Investigator Award'),
        category: AwardCategory.create(AwardCategoryType.AWARD),
        sponsorOrAgency: OrganizationName.from('IEEE'),
        amount: FundingAmount.from(25000, 'USD'),
      }).value;

      expect(award.title).toBe('IEEE Outstanding Young Investigator Award');
      expect(award.domainEvents.length).toBe(1);
      expect(award.domainEvents[0] instanceof AwardReceivedEvent).toBe(true);
    });
  });

  describe('Grant Aggregate', () => {
    it('should enforce end date after start date invariant', () => {
      const start = new Date('2026-01-01');
      const end = new Date('2025-12-31');

      const res = Grant.create({
        profileId,
        grantNumber: GrantNumber.from('NSF-2026-991'),
        title: 'Quantum Computing Systems',
        fundingAgency: OrganizationName.from('NSF'),
        amount: FundingAmount.from(500000, 'USD'),
        startDate: start,
        endDate: end,
      });

      expect(res.isFailure).toBe(true);
      expect(res.error).toBe(new InvalidGrantDateSequenceError(start, end).message);
    });

    it('should create grant and mark completed', () => {
      const start = new Date('2026-01-01');
      const end = new Date('2028-12-31');

      const grant = Grant.create({
        profileId,
        grantNumber: GrantNumber.from('NSF-2026-991'),
        title: 'Quantum Computing Systems',
        fundingAgency: OrganizationName.from('NSF'),
        amount: FundingAmount.from(500000, 'USD'),
        startDate: start,
        endDate: end,
      }).value;

      expect(grant.status).toBe(GrantStatus.ACTIVE);
      expect(grant.domainEvents.length).toBe(1);
      expect(grant.domainEvents[0] instanceof GrantAwardedEvent).toBe(true);

      grant.markCompleted();
      expect(grant.status).toBe(GrantStatus.COMPLETED);
      expect(grant.domainEvents.length).toBe(2);
    });
  });

  describe('Patent Aggregate', () => {
    it('should update status safely according to state machine', () => {
      const patent = Patent.create({
        profileId,
        patentNumber: PatentNumber.from('US-11928374-B2'),
        title: 'Distributed Consensus Engine',
        status: PatentStatus.create(PatentStatusType.APPLIED),
        patentType: PatentType.create(PatentTypeEnum.UTILITY),
        filingDate: new Date('2026-01-10'),
      }).value;

      expect(patent.domainEvents.length).toBe(1);
      expect(patent.domainEvents[0] instanceof PatentFiledEvent).toBe(true);

      const failUpdate = patent.updateStatus(PatentStatusType.EXPIRED);
      expect(failUpdate.isFailure).toBe(true);
      expect(failUpdate.error).toBe(
        new InvalidPatentStatusTransitionError('APPLIED', 'EXPIRED').message,
      );

      const okUpdate = patent.updateStatus(PatentStatusType.PENDING);
      expect(okUpdate.isSuccess).toBe(true);
    });
  });

  describe('ProfessionalActivity Aggregate', () => {
    it('should require conference name for keynote activity', () => {
      const res = ProfessionalActivity.create({
        profileId,
        category: ActivityCategoryType.KEYNOTE,
        title: 'Keynote on Autonomous Agents',
      });

      expect(res.isFailure).toBe(true);
      expect(res.error).toBe(new KeynoteRequiresConferenceError().message);
    });
  });
});

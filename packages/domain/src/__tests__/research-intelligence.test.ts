import { UniqueId } from '@rios/shared';
import { describe, expect, it } from 'vitest';

import {
  AcademicTimeline,
  CitationCount,
  Collaboration,
  CollaborationNetwork,
  CollaborationStrength,
  HIndex,
  InstitutionHistory,
  I10Index,
  PublicationStatistic,
  ResearchAnalytics,
  ResearchMetric,
  TimelineEvent,
  TimelineEventType,
} from '../index.js';

describe('Research Intelligence Domain Unit Tests', () => {
  const profileId = UniqueId.create().value;

  describe('Value Objects', () => {
    it('should enforce non-negative CitationCount', () => {
      const valid = CitationCount.create(42);
      expect(valid.isSuccess).toBe(true);
      expect(valid.value.value).toBe(42);

      const invalid = CitationCount.create(-5);
      expect(invalid.isFailure).toBe(true);
    });

    it('should validate HIndex invariants', () => {
      const valid = HIndex.create(10, 15);
      expect(valid.isSuccess).toBe(true);

      const exceedsPubs = HIndex.create(20, 15);
      expect(exceedsPubs.isFailure).toBe(true);
      expect(exceedsPubs.error).toContain('H-index cannot exceed publication count');
    });

    it('should validate I10Index invariants', () => {
      const valid = I10Index.create(5);
      expect(valid.isSuccess).toBe(true);

      const negative = I10Index.create(-1);
      expect(negative.isFailure).toBe(true);
    });
  });

  describe('AcademicTimeline Aggregate Root', () => {
    it('should create an academic timeline and add timeline events', () => {
      const timeline = AcademicTimeline.create({ profileId }).value;
      expect(timeline.profileId).toBe(profileId);
      expect(timeline.events.length).toBe(0);

      const eventType = TimelineEventType.create('publication').value;
      const event = TimelineEvent.create({
        eventType,
        title: 'Published paper on Distributed Systems',
        eventDate: new Date('2026-03-15'),
      }).value;

      timeline.addEvent(event);
      expect(timeline.events.length).toBe(1);
      expect(timeline.domainEvents.length).toBe(1);
    });

    it('should track institution history correctly', () => {
      const timeline = AcademicTimeline.create({ profileId }).value;
      const inst = InstitutionHistory.create({
        institutionName: 'Stanford University',
        role: 'Postdoctoral Researcher',
        startDate: new Date('2024-01-01'),
        isCurrent: true,
      }).value;

      timeline.addInstitutionAffiliation(inst);
      expect(timeline.getCurrentInstitutions().length).toBe(1);
      expect(timeline.getCurrentInstitutions()[0]?.institutionName).toBe('Stanford University');
    });
  });

  describe('CollaborationNetwork Aggregate Root', () => {
    it('should add collaborations and emit CollaborationCreatedEvent', () => {
      const network = CollaborationNetwork.create({ profileId }).value;
      const strength = CollaborationStrength.create('strong').value;

      const collab = Collaboration.create({
        collaboratorName: 'Dr. Alice Smith',
        collaboratorEmail: 'alice@stanford.edu',
        collaboratorOrcid: '0000-0002-1825-0097',
        institution: 'Stanford University',
        strength,
        jointPublicationCount: 5,
      }).value;

      const res = network.addCollaboration(collab);
      expect(res.isSuccess).toBe(true);
      expect(network.collaborations.length).toBe(1);
      expect(network.domainEvents.length).toBe(1);
    });

    it('should disallow duplicate collaborations', () => {
      const network = CollaborationNetwork.create({ profileId }).value;
      const strength = CollaborationStrength.create('strong').value;

      const collab1 = Collaboration.create({
        collaboratorName: 'Dr. Alice Smith',
        collaboratorEmail: 'alice@stanford.edu',
        strength,
      }).value;

      const collab2 = Collaboration.create({
        collaboratorName: 'Dr. Alice Smith',
        collaboratorEmail: 'alice@stanford.edu',
        strength,
      }).value;

      network.addCollaboration(collab1);
      const duplicateRes = network.addCollaboration(collab2);
      expect(duplicateRes.isFailure).toBe(true);
      expect(duplicateRes.error).toContain('Duplicate collaboration is forbidden');
    });
  });

  describe('ResearchAnalytics Aggregate Root', () => {
    it('should aggregate publication stats and research metrics', () => {
      const analytics = ResearchAnalytics.create({ profileId }).value;

      const pubStat = PublicationStatistic.create({
        year: 2026,
        count: 12,
        firstAuthorCount: 5,
        correspondingAuthorCount: 4,
      }).value;

      analytics.addPublicationStatistic(pubStat);

      const metric = ResearchMetric.create({
        metricType: 'h_index',
        metricName: 'H-Index',
        value: 8,
      }).value;

      const addRes = analytics.addResearchMetric(metric);
      expect(addRes.isSuccess).toBe(true);
      expect(analytics.getMetricValue('h_index')).toBe(8);
      expect(analytics.domainEvents.length).toBe(1);
    });
  });
});
